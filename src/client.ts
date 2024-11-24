import { UPLINK_ELEMENTS } from './messages';
import { type CpdlcMessage, type Identity, identitySchema, messageSchema, Message, LogonAck, Uplink, MessageElement } from './schema';

const PORTS = [60860, 60861, 60862, 60863, 60864];

type UplinkCallback = (payload: Uplink) => void;

type LogonCallback = (payload: LogonAck) => void;

const getTimestamp = (): number => Math.floor(new Date().getTime() / 1000);

export class DataLinkClient {
    /**
     * WebSocket for communication with a network client.
     *
     * A null value indicates that no connection exists.
     */
    private socket: WebSocket | null = null;

    /**
     * Counter for the current message identification number (min).
     */
    private currentId: number = 0;

    /**
     * Mapping of outstanding requests to their callbacks.
     *
     * Requests are identified by `min`.
     */
    private callbacks: Map<number, UplinkCallback> = new Map();

    /**
     * Callback invoked when a logon acknowledgement is received following a logon request.
     */
    private logonCallback: LogonCallback | null = null;

    /**
     * Callback invoked when a message without a reference number is received.
     */
    private readonly receiveCallback: UplinkCallback;

    public constructor(onReceive: UplinkCallback) {
        this.receiveCallback = onReceive;
    }

    /**
     * Reset the internal state of the client.
     *
     * This does NOT close the WebSocket connection.
     */
    private reset(): void {
        this.socket = null;
        this.currentId = 0;
        this.callbacks.clear();
    }

    private async sendMessage(message: Message): Promise<void> {
        if (this.socket === null) {
            throw new Error('DataLink.sendMessage() called without an open connection');
        }

        this.socket.send(JSON.stringify(message));
    }

    private handleCpdlcMessage(message: CpdlcMessage): void {
        const { payload } = message;

        if (payload.type !== 'UP' && payload.type !== 'CR1') {
            console.debug(`Received unexpected message type: ${payload.type}. Expected "UP" or "CR1"`);
            this.sendMessage({
                method: 'CPDLC',
                payload: {
                    type: 'DN',
                    timestamp: getTimestamp(),
                    min: this.currentId++,
                    mrn: payload.min,
                    elements: [
                        { id: 'DM62', parameters: [{ type: 'error', error: 'UNEXPECTED MSG TYPE' }] },
                    ],
                },
            });
            return;
        }

        // Check if the message reference number exists, if there is one
        if (payload.mrn !== null && !this.callbacks.has(payload.mrn)) {
            console.debug(`Received message with unknown reference number: ${payload.mrn}`);
            this.sendMessage({
                method: 'CPDLC',
                payload: {
                    type: 'DN',
                    timestamp: getTimestamp(),
                    min: this.currentId++,
                    mrn: payload.min,
                    elements: [
                        { id: 'DM62', parameters: [{ type: 'error', error: 'UNRECOGNIZED MSG REFERENCE NUMBER' }] },
                    ],
                },
            });
            return;
        }

        // Check if all messages in the uplinked message are supported by our message set
        const unsupported = payload.elements?.find(({ id }) => !(id in UPLINK_ELEMENTS));
        if (unsupported) {
            console.debug(`Received message with unknown message element: ${unsupported.id}`);
            this.sendMessage({
                method: 'CPDLC',
                payload: {
                    type: 'DN',
                    timestamp: getTimestamp(),
                    min: this.currentId++,
                    mrn: payload.min,
                    elements: [
                        { id: 'DM62', parameters: [{ type: 'error', error: 'MSG NOT SUPPORTED BY THIS AIRCRAFT' }] },
                    ],
                },
            });
            return;
        }

        // TODO: check length and formatting of parameters

        // Invoke (and clear) the corresponding callback for the message
        if (payload.mrn && this.callbacks.has(payload.mrn)) {
            this.callbacks.get(payload.mrn)!(payload);
            this.callbacks.delete(payload.mrn);
        } else {
            this.receiveCallback(payload);
        }
    }

    /**
     * Callback function for the `message` WebSocket event.
     *
     * All incoming messages from a network client are routed throught this function.
     */
    private receiveMessage(event: MessageEvent): void {
        const rawMessage = JSON.parse(event.data);

        // Check that the uplinked message matches the DLS schema
        const result = messageSchema.safeParse(rawMessage);
        if (!result.success) {
            console.log(result.error.issues);
            console.warn(`Received unknown message: ${event.data}`);
            return;
        }

        const message = result.data;
        console.debug(`Received message: ${event.data}`);

        if (message.method === 'CPDLC') {
            this.handleCpdlcMessage(message);
        } else if (this.logonCallback && message.payload.type === 'FN_AK') {
            this.logonCallback(message.payload);
        }
    }

    /**
     * Attempts to create a connection with a network client.
     *
     * Ports in the range `60860..60864` are scanned to locate
     * an FSDLS server hosted by a network client.
     *
     * If a port responds with a valid `Identity` packet over HTTP,
     * a new websocket connection is created over the same port.
     */
    public async connect(): Promise<Identity> {
        return new Promise((resolve, reject) => {
            // Generate requests for each port to check if a valid identity is returned
            const requests = PORTS.map(async (port) => {
                const resp = await fetch(`http://127.0.0.1:${port}/id/`);
                const data = await resp.json();
                const result = identitySchema.safeParse(data);

                if (!result.success) {
                    throw new Error(`Received invalid identity: ${JSON.stringify(data)}`);
                }

                return [result.data, port] as [Identity, number];
            });

            // This emulates the functionality of `Promise.any`, which is not available in the simulator:
            //  - If any promise resolves, then the outer promise also resolves
            //  - If all promises reject, then the outer promise also rejects
            let rejected = 0;
            requests.forEach((promise) => {
                Promise.resolve(promise)
                    .then(([ident, port]) => {
                        this.socket = new WebSocket(`ws://127.0.0.1:${port}/`, 'fsdls');

                        this.socket.addEventListener('message', this.receiveMessage.bind(this));
                        this.socket.addEventListener('close', this.reset.bind(this));
                        this.socket.addEventListener('error', this.reset.bind(this));

                        this.socket.addEventListener('open', () => {
                            console.log(`WebSocket connection open on on port ${port}`);
                        });
                        this.socket.addEventListener('close', () => {
                            console.log('WebSocket connection closed');
                        });

                        resolve(ident);
                    })
                    .catch(() => {
                        if (++rejected === requests.length) {
                            reject(new Error('No FSDLS server discovered on port range 60860..60864'));
                        }
                    });
            });
        });
    }

    /**
     * Closes an active connection with a network client.
     */
    public disconnect(): void {
        if (this.socket) {
            this.socket.close();
        }
    }

    public async logon(facility: string, ident: string, dep_icao: string, arr_icao: string): Promise<void> {
        if (this.socket === null) {
            throw new Error('DataLink.logon() called without an open connection');
        }

        const promise = new Promise<void>((resolve) => {
            this.logonCallback = (payload) => {
                if (payload.type !== 'FN_AK' || payload.data.status !== 0) {
                    throw new Error('Logon not successful');
                }

                resolve();
            };
        });

        await this.sendMessage({
            method: 'DLIC',
            payload: {
                type: 'FN_CON',
                facility,
                data: { ident, dep_icao, arr_icao },
            },
        });

        return promise;
    }

    public async downlink(elements: MessageElement[], ref: number | null = null): Promise<Uplink> {
        const promise = new Promise<Uplink>((resolve) => {
            this.callbacks.set(this.currentId, resolve);
        });

        this.sendMessage({
            method: 'CPDLC',
            payload: {
                type: 'DN',
                timestamp: getTimestamp(),
                min: this.currentId++,
                mrn: ref,
                elements,
            },
        });

        return promise;
    }

    public get connected(): boolean {
        return this.socket !== null;
    }
}
