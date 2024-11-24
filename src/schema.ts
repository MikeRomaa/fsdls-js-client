import { z } from 'zod';
import { parameter } from './parameter';

const PROTOCOL_VERSION = '1';

// DLIC Schemas

const dlicLogonReqSchema = z.object({
    type: z.literal('FN_CON'),
    facility: z.string().length(4),
    data: z.object({
        ident: z.string().min(1).max(7),
        dep_icao: z.string().length(4),
        arr_icao: z.string().length(4),
    }),
});

const dlicLogonAckSchema = z.object({
    type: z.literal('FN_AK'),
    facility: z.string().length(4),
    data: z.object({
        status: z.union([z.literal(0), z.literal(1)]),
    }),
});

export const dlicMessageSchema = z.object({
    method: z.literal('DLIC'),
    payload: z.discriminatedUnion('type', [dlicLogonReqSchema, dlicLogonAckSchema]),
});

export type LogonReq = z.infer<typeof dlicLogonReqSchema>;
export type LogonAck = z.infer<typeof dlicLogonAckSchema>;

type DlicPayload = LogonReq | LogonAck;

// TODO: Figure out if theres a way to do this better with zod
export type DlicMessage<T extends DlicPayload = DlicPayload> = { method: 'DLIC', payload: T }

// CPDLC Schemas

const cpdlcMessageElement = z.object({
    id: z.string(),
    parameters: parameter.array(),
});

function createCpdlcMessageSchema<T extends string, E extends z.ZodTypeAny>(type: T, elements: E) {
    return z.object({
        type: z.literal(type),
        timestamp: z.number().int().positive(),
        min: z.number().int().min(0).max(63),
        mrn: z.number().int().min(0).max(63).nullable(),
        elements,
    });
}

const cpdlcConnReqSchema = createCpdlcMessageSchema('CR1', z.tuple([]));

const cpdlcConnConfirmSchema = createCpdlcMessageSchema('CC1', z.tuple([]));

const cpdlcTermConfirmSchema = createCpdlcMessageSchema('DR1', z.tuple([]));

const cpdlcUplinkSchema = createCpdlcMessageSchema('UP', cpdlcMessageElement.array());

const cpdlcDownlinkSchema = createCpdlcMessageSchema('DN', cpdlcMessageElement.array());

const cpdlcMessage = z.object({
    method: z.literal('CPDLC'),
    payload: z.discriminatedUnion('type', [
        cpdlcConnReqSchema,
        cpdlcConnConfirmSchema,
        cpdlcTermConfirmSchema,
        cpdlcUplinkSchema,
        cpdlcDownlinkSchema,
    ]),
});

export type MessageElement = z.infer<typeof cpdlcMessageElement>;

export type ConnReq = z.infer<typeof cpdlcConnReqSchema>;
export type ConnConfirm = z.infer<typeof cpdlcConnConfirmSchema>;
export type TermConfirm = z.infer<typeof cpdlcTermConfirmSchema>;
export type Uplink = z.infer<typeof cpdlcUplinkSchema>;
export type Downlink = z.infer<typeof cpdlcDownlinkSchema>;

type CpdlcPayload = ConnReq | ConnConfirm | TermConfirm | Uplink | Downlink;

export type CpdlcMessage<T extends CpdlcPayload = CpdlcPayload> = { method: 'CPDLC', payload: T };

// Other Schemas

export const identitySchema = z.object({
    protocol: z.literal('fsdls'),
    version: z.literal(PROTOCOL_VERSION),
    network: z.string(),
});

export type Identity = z.infer<typeof identitySchema>;

export const messageSchema = z.discriminatedUnion('method', [dlicMessageSchema, cpdlcMessage]);

export type Message = z.infer<typeof messageSchema>;
