import { z } from "zod";

import {
    altimeterParam,
    altitudeParam,
    beaconCodeParam,
    degreesParam,
    directionParam,
    distanceParam,
    errorParam,
    facilityIdentParam,
    freeTextParam,
    frequencyParam,
    positionParam,
    procedureParam,
    routeParam,
    speedParam,
    timeParam,
    unitNameParam
} from "./parameter";

function createElement<Id extends string, P extends z.AnyZodTuple>(id: Id, parameters: P) {
    return z.object({
        id: z.literal(id),
        parameters,
    });
}

const UPLINK_PARAMS = {
    UM0: [
        z.tuple([]),
        () => 'UNABLE',
    ],
    UM1: [
        z.tuple([]),
        () => 'STANDBY',
    ],
    UM3: [
        z.tuple([]),
        () => 'ROGER',
    ],
    UM4: [
        z.tuple([]),
        () => 'AFFIRM',
    ],
    UM5: [
        z.tuple([]),
        () => 'NEGATIVE',
    ],
    UM19: [
        z.tuple([altitudeParam]),
        (altitude: string) => `MAINTAIN ${altitude}`,
    ],
    UM20: [
        z.tuple([altitudeParam]),
        (altitude: string) => `CLIMB TO ${altitude}`,
    ],
    UM23: [
        z.tuple([altitudeParam]),
        (altitude: string) => `DESCEND TO ${altitude}`,
    ],
    UM26: [
        z.tuple([altitudeParam, timeParam]),
        (altitude: string, time: string) => `CLIMB TO REACH ${altitude} BY ${time}`,
    ],
    UM27: [
        z.tuple([altitudeParam, positionParam]),
        (altitude: string, position: string) => `CLIMB TO REACH ${altitude} BY ${position}`,
    ],
    UM28: [
        z.tuple([altitudeParam, timeParam]),
        (altitude: string, time: string) => `DESCEND TO REACH ${altitude} BY ${time}`,
    ],
    UM29: [
        z.tuple([altitudeParam, positionParam]),
        (altitude: string, position: string) => `DESCEND TO REACH ${altitude} BY ${position}`,
    ],
    UM30: [
        z.tuple([altitudeParam, altitudeParam]),
        (altitude1: string, altitude2: string) => `MAINTAIN BLOCK ${altitude1} TO ${altitude2}`,
    ],
    UM31: [
        z.tuple([altitudeParam, altitudeParam]),
        (altitude1: string, altitude2: string) => `CLIMB TO AND MAINTAIN BLOCK ${altitude1} TO ${altitude2}`,
    ],
    UM32: [
        z.tuple([altitudeParam, altitudeParam]),
        (altitude1: string, altitude2: string) => `DESCEND TO AND MAINTAIN BLOCK ${altitude1} TO ${altitude2}`,
    ],
    UM36: [
        z.tuple([altitudeParam]),
        (altitude: string) => `EXPEDITE CLIMB TO ${altitude}`,
    ],
    UM37: [
        z.tuple([altitudeParam]),
        (altitude: string) => `EXPEDITE DESCENT TO ${altitude}`,
    ],
    UM38: [
        z.tuple([altitudeParam]),
        (altitude: string) => `IMMEDIATELY CLIMB TO ${altitude}`,
    ],
    UM39: [
        z.tuple([altitudeParam]),
        (altitude: string) => `IMMEDIATELY DESCEND TO ${altitude}`,
    ],
    UM46: [
        z.tuple([positionParam, altitudeParam]),
        (position: string, altitude: string) => `CROSS ${position} AT ${altitude}`,
    ],
    UM47: [
        z.tuple([positionParam, altitudeParam]),
        (position: string, altitude: string) => `CROSS ${position} AT OR ABOVE ${altitude}`,
    ],
    UM48: [
        z.tuple([positionParam, altitudeParam]),
        (position: string, altitude: string) => `CROSS ${position} AT OR BELOW ${altitude}`,
    ],
    UM49: [
        z.tuple([positionParam, altitudeParam]),
        (position: string, altitude: string) => `CROSS ${position} AT AND MAINTAIN ${altitude}`,
    ],
    UM51: [
        z.tuple([positionParam, timeParam]),
        (position: string, time: string) => `CROSS ${position} AT ${time}`,
    ],
    UM52: [
        z.tuple([positionParam, timeParam]),
        (position: string, time: string) => `CROSS ${position} AT OR BEFORE ${time}`,
    ],
    UM53: [
        z.tuple([positionParam, timeParam]),
        (position: string, time: string) => `CROSS ${position} AT OR AFTER ${time}`,
    ],
    UM54: [
        z.tuple([positionParam, timeParam, timeParam]),
        (position: string, start: string, end: string) => `CROSS ${position} BETWEEN ${start} AND ${end}`,
    ],
    UM55: [
        z.tuple([positionParam, speedParam]),
        (position: string, speed: string) => `CROSS ${position} AT ${speed}`,
    ],
    UM56: [
        z.tuple([positionParam, speedParam]),
        (position: string, speed: string) => `CROSS ${position} AT OR LESS THAN ${speed}`,
    ],
    UM57: [
        z.tuple([positionParam, speedParam]),
        (position: string, speed: string) => `CROSS ${position} AT OR GREATER THAN ${speed}`,
    ],
    UM61: [
        z.tuple([positionParam, altitudeParam, speedParam]),
        (position: string, altitude: string, speed: string) => `CROSS ${position} AT ${altitude} AT ${speed}`,
    ],
    UM64: [
        z.tuple([distanceParam, directionParam]),
        (distance: string, direction: string) => `OFFSET ${distance} ${direction} OF ROUTE`,
    ],
    UM72: [
        z.tuple([]),
        () => 'RESUME OWN NAVIGATION',
    ],
    UM74: [
        z.tuple([positionParam]),
        (position: string) => `PROCEED DIRECT TO ${position}`,
    ],
    UM75: [
        z.tuple([positionParam]),
        (position: string) => `WHEN ABLE PROCEED DIRECT TO ${position}`,
    ],
    UM76: [
        z.tuple([timeParam, positionParam]),
        (time: string, position: string) => `AT ${time} PROCEED DIRECT TO ${position}`,
    ],
    UM77: [
        z.tuple([positionParam, positionParam]),
        (position1: string, position2: string) => `AT ${position1} PROCEED DIRECT TO ${position2}`,
    ],
    UM78: [
        z.tuple([altitudeParam, positionParam]),
        (altitude: string, position: string) => `AT ${altitude} PROCEED DIRECT TO ${position}`,
    ],
    UM79: [
        z.tuple([positionParam, routeParam]),
        (position: string, route: string) => `CLEARED TO ${position} VIA ${route}`,
    ],
    UM80: [
        z.tuple([routeParam]),
        (route: string) => `CLEARED ${route}`,
    ],
    UM81: [
        z.tuple([procedureParam]),
        (procedure: string) => `CLEARED ${procedure}`,
    ],
    UM82: [
        z.tuple([distanceParam, directionParam]),
        (distance: string, direction: string) => `CLEARED TO DEVIATE UP TO ${distance} ${direction} OF ROUTE`,
    ],
    UM83: [
        z.tuple([positionParam, routeParam]),
        (position: string, route: string) => `AT ${position} CLEARED ${route}`,
    ],
    UM84: [
        z.tuple([positionParam, procedureParam]),
        (position: string, procedure: string) => `AT ${position} CLEARED ${procedure}`,
    ],
    UM91: [
        z.tuple([]), // (position: string, altitude: string, degrees: string, direction: string, legType: string)
        (position: string, altitude: string, degrees: string, direction: string, legType: string) => `HOLD AT ${position} MAINTAIN ${altitude} INBOUND TRACK ${degrees} ${direction} TURNS ${legType}`,
    ],
    UM92: [
        z.tuple([positionParam, altitudeParam]),
        (position: string, altitude: string) => `HOLD AT ${position} AS PUBLISHED MAINTAIN ${altitude}`,
    ],
    UM93: [
        z.tuple([timeParam]),
        (time: string) => `EXPECT FURTHER CLEARANCE AT ${time}`,
    ],
    UM94: [
        z.tuple([directionParam, degreesParam]),
        (direction: string, degrees: string) => `TURN ${direction} HEADING ${degrees}`,
    ],
    UM96: [
        z.tuple([]),
        () => 'CONTINUE PRESENT HEADING',
    ],
    UM106: [
        z.tuple([speedParam]),
        (speed: string) => `MAINTAIN ${speed}`,
    ],
    UM107: [
        z.tuple([]),
        () => 'MAINTAIN PRESENT SPEED',
    ],
    UM108: [
        z.tuple([speedParam]),
        (speed: string) => `MAINTAIN ${speed} OR GREATER`,
    ],
    UM109: [
        z.tuple([speedParam]),
        (speed: string) => `MAINTAIN ${speed} OR LESS`,
    ],
    UM116: [
        z.tuple([]),
        () => 'RESUME NORMAL SPEED',
    ],
    UM117: [
        z.tuple([unitNameParam, frequencyParam]),
        (unit: string, frequency: string) => `CONTACT ${unit} ${frequency}`,
    ],
    UM120: [
        z.tuple([unitNameParam, frequencyParam]),
        (unit: string, frequency: string) => `MONITOR ${unit} ${frequency}`,
    ],
    UM123: [
        z.tuple([beaconCodeParam]),
        (code: string) => `SQUAWK ${code}`,
    ],
    UM127: [
        z.tuple([]),
        () => 'REPORT BACK ON ROUTE',
    ],
    UM134: [
        z.tuple([]),
        () => 'CONFIRM SPEED',
    ],
    UM135: [
        z.tuple([]),
        () => 'CONFIRM ASSIGNED ALTITUDE',
    ],
    UM137: [
        z.tuple([]),
        () => 'CONFIRM ASSIGNED ROUTE',
    ],
    UM148: [
        z.tuple([altitudeParam]),
        (altitude: string) => `WHEN CAN YOU ACCEPT ${altitude}`,
    ],
    UM153: [
        z.tuple([altimeterParam]),
        (altimeter: string) => `ALTIMETER ${altimeter}`,
    ],
    UM154: [
        z.tuple([]),
        () => 'RADAR SERVICES TERMINATED',
    ],
    UM157: [
        z.tuple([frequencyParam]),
        (frequency: string) => `CHECK STUCK MICROPHONE ${frequency}`,
    ],
    UM159: [
        z.tuple([errorParam]),
        (error: string) => `ERROR ${error}`,
    ],
    UM160: [
        z.tuple([facilityIdentParam]),
        (facility: string) => `NEXT DATA AUTHORITY ${facility}`,
    ],
    UM161: [
        z.tuple([]),
        () => 'END SERVICE',
    ],
    UM166: [
        z.tuple([]),
        () => 'DUE TO TRAFFIC',
    ],
    UM167: [
        z.tuple([]),
        () => 'DUE TO AIRSPACE RESTRICTION',
    ],
    UM179: [
        z.tuple([]),
        () => 'SQUAWK IDENT',
    ],
    UM183: [
        z.tuple([unitNameParam]),
        (unit: string) => `CURRENT ATC UNIT ${unit}`,
    ],
    UM213: [
        z.tuple([facilityIdentParam, altimeterParam]),
        (facility: string, altimeter: string) => `${facility} ALTIMETER ${altimeter}`,
    ],
    UM169: [
        z.tuple([freeTextParam]),
        (text: string) => `${text}`,
    ],
};

const DOWNLINK_PARAMS = {
    DM0: z.tuple([]),
    DM1: z.tuple([]),
    DM2: z.tuple([]),
    DM3: z.tuple([]),
    DM4: z.tuple([]),
    DM5: z.tuple([]),
    DM6: z.tuple([altitudeParam]),
    DM7: z.tuple([altitudeParam, altitudeParam]),
    DM9: z.tuple([altitudeParam]),
    DM10: z.tuple([altitudeParam]),
    DM11: z.tuple([positionParam, altitudeParam]),
    DM12: z.tuple([positionParam, altitudeParam]),
    DM13: z.tuple([timeParam, altitudeParam]),
    DM14: z.tuple([timeParam, altitudeParam]),
    DM15: z.tuple([distanceParam, directionParam]),
    DM18: z.tuple([speedParam]),
    DM20: z.tuple([]),
    DM22: z.tuple([positionParam]),
    DM23: z.tuple([procedureParam]),
    DM24: z.tuple([routeParam]),
    DM25: z.tuple([]),
    DM27: z.tuple([distanceParam, directionParam]),
    DM34: z.tuple([speedParam]),
    DM38: z.tuple([altitudeParam]),
    DM40: z.tuple([routeParam]),
    DM41: z.tuple([]),
    DM55: z.tuple([]),
    DM56: z.tuple([]),
    DM57: z.tuple([]), // TODO: (fuel: string, souls: string) => `${fuel} OF FUEL REMAINING AND ${souls} ON BOARD`,
    DM58: z.tuple([]),
    DM59: z.tuple([positionParam, routeParam]),
    DM60: z.tuple([distanceParam, directionParam]),
    DM61: z.tuple([altitudeParam]),
    DM62: z.tuple([errorParam]),
    DM63: z.tuple([]),
    DM65: z.tuple([]),
    DM66: z.tuple([]),
    DM77: z.tuple([altitudeParam, altitudeParam]),
    DM80: z.tuple([distanceParam, directionParam]),
    DM107: z.tuple([]),
    DM67: z.tuple([freeTextParam]),
    DM68: z.tuple([freeTextParam]),
}

interface ElementToStringMap {
    [id: string]: (...args: typeof UPLINK_PARAMS[typeof id]) => string;
}

export const UPLINK_ELEMENTS: ElementToStringMap = {
    UM0: () => 'UNABLE',
    UM1: () => 'STANDBY',
    UM3: () => 'ROGER',
    UM4: () => 'AFFIRM',
    UM5: () => 'NEGATIVE',
    UM19: (altitude: string) => `MAINTAIN ${altitude}`,
    UM20: (altitude: string) => `CLIMB TO ${altitude}`,
    UM23: (altitude: string) => `DESCEND TO ${altitude}`,
    UM26: (altitude: string, time: string) => `CLIMB TO REACH ${altitude} BY ${time}`,
    UM27: (altitude: string, position: string) => `CLIMB TO REACH ${altitude} BY ${position}`,
    UM28: (altitude: string, time: string) => `DESCEND TO REACH ${altitude} BY ${time}`,
    UM29: (altitude: string, position: string) => `DESCEND TO REACH ${altitude} BY ${position}`,
    UM30: (altitude1: string, altitude2: string) => `MAINTAIN BLOCK ${altitude1} TO ${altitude2}`,
    UM31: (altitude1: string, altitude2: string) => `CLIMB TO AND MAINTAIN BLOCK ${altitude1} TO ${altitude2}`,
    UM32: (altitude1: string, altitude2: string) => `DESCEND TO AND MAINTAIN BLOCK ${altitude1} TO ${altitude2}`,
    UM36: (altitude: string) => `EXPEDITE CLIMB TO ${altitude}`,
    UM37: (altitude: string) => `EXPEDITE DESCENT TO ${altitude}`,
    UM38: (altitude: string) => `IMMEDIATELY CLIMB TO ${altitude}`,
    UM39: (altitude: string) => `IMMEDIATELY DESCEND TO ${altitude}`,
    UM46: (position: string, altitude: string) => `CROSS ${position} AT ${altitude}`,
    UM47: (position: string, altitude: string) => `CROSS ${position} AT OR ABOVE ${altitude}`,
    UM48: (position: string, altitude: string) => `CROSS ${position} AT OR BELOW ${altitude}`,
    UM49: (position: string, altitude: string) => `CROSS ${position} AT AND MAINTAIN ${altitude}`,
    UM51: (position: string, time: string) => `CROSS ${position} AT ${time}`,
    UM52: (position: string, time: string) => `CROSS ${position} AT OR BEFORE ${time}`,
    UM53: (position: string, time: string) => `CROSS ${position} AT OR AFTER ${time}`,
    UM54: (position: string, start: string, end: string) => `CROSS ${position} BETWEEN ${start} AND ${end}`,
    UM55: (position: string, speed: string) => `CROSS ${position} AT ${speed}`,
    UM56: (position: string, speed: string) => `CROSS ${position} AT OR LESS THAN ${speed}`,
    UM57: (position: string, speed: string) => `CROSS ${position} AT OR GREATER THAN ${speed}`,
    UM61: (position: string, altitude: string, speed: string) => `CROSS ${position} AT ${altitude} AT ${speed}`,
    UM64: (distance: string, direction: string) => `OFFSET ${distance} ${direction} OF ROUTE`,
    UM72: () => 'RESUME OWN NAVIGATION',
    UM74: (position: string) => `PROCEED DIRECT TO ${position}`,
    UM75: (position: string) => `WHEN ABLE PROCEED DIRECT TO ${position}`,
    UM76: (time: string, position: string) => `AT ${time} PROCEED DIRECT TO ${position}`,
    UM77: (position1: string, position2: string) => `AT ${position1} PROCEED DIRECT TO ${position2}`,
    UM78: (altitude: string, position: string) => `AT ${altitude} PROCEED DIRECT TO ${position}`,
    UM79: (position: string, route: string) => `CLEARED TO ${position} VIA ${route}`,
    UM80: (route: string) => `CLEARED ${route}`,
    UM81: (procedure: string) => `CLEARED ${procedure}`,
    UM82: (distance: string, direction: string) => `CLEARED TO DEVIATE UP TO ${distance} ${direction} OF ROUTE`,
    UM83: (position: string, route: string) => `AT ${position} CLEARED ${route}`,
    UM84: (position: string, procedure: string) => `AT ${position} CLEARED ${procedure}`,
    UM91: (position: string, altitude: string, degrees: string, direction: string, legType: string) => `HOLD AT ${position} MAINTAIN ${altitude} INBOUND TRACK ${degrees} ${direction} TURNS ${legType}`,
    UM92: (position: string, altitude: string) => `HOLD AT ${position} AS PUBLISHED MAINTAIN ${altitude}`,
    UM93: (time: string) => `EXPECT FURTHER CLEARANCE AT ${time}`,
    UM94: (direction: string, degrees: string) => `TURN ${direction} HEADING ${degrees}`,
    UM96: () => 'CONTINUE PRESENT HEADING',
    UM106: (speed: string) => `MAINTAIN ${speed}`,
    UM107: () => 'MAINTAIN PRESENT SPEED',
    UM108: (speed: string) => `MAINTAIN ${speed} OR GREATER`,
    UM109: (speed: string) => `MAINTAIN ${speed} OR LESS`,
    UM116: () => 'RESUME NORMAL SPEED',
    UM117: (unit: string, frequency: string) => `CONTACT ${unit} ${frequency}`,
    UM120: (unit: string, frequency: string) => `MONITOR ${unit} ${frequency}`,
    UM123: (code: string) => `SQUAWK ${code}`,
    UM127: () => 'REPORT BACK ON ROUTE',
    UM134: () => 'CONFIRM SPEED',
    UM135: () => 'CONFIRM ASSIGNED ALTITUDE',
    UM137: () => 'CONFIRM ASSIGNED ROUTE',
    UM148: (altitude: string) => `WHEN CAN YOU ACCEPT ${altitude}`,
    UM153: (altimeter: string) => `ALTIMETER ${altimeter}`,
    UM154: () => 'RADAR SERVICES TERMINATED',
    UM157: (frequency: string) => `CHECK STUCK MICROPHONE ${frequency}`,
    UM159: (error: string) => `ERROR ${error}`,
    UM160: (facility: string) => `NEXT DATA AUTHORITY ${facility}`,
    UM161: () => 'END SERVICE',
    UM166: () => 'DUE TO TRAFFIC',
    UM167: () => 'DUE TO AIRSPACE RESTRICTION',
    UM179: () => 'SQUAWK IDENT',
    UM183: (unit: string) => `CURRENT ATC UNIT ${unit}`,
    UM213: (facility: string, altimeter: string) => `${facility} ALTIMETER ${altimeter}`,
    UM169: (text: string) => `${text}`,
};

export const DOWNLINK_ELEMENTS: ElementToStringMap = {
    DM0: () => 'WILCO',
    DM1: () => 'UNABLE',
    DM2: () => 'STANDBY',
    DM3: () => 'ROGER',
    DM4: () => 'AFFIRM',
    DM5: () => 'NEGATIVE',
    DM6: (altitude: string) => `REQUEST ${altitude}`,
    DM7: (altitude1: string, altitude2: string) => `REQUEST BLOCK ${altitude1} TO ${altitude2}`,
    DM9: (altitude: string) => `REQUEST CLIMB TO ${altitude}`,
    DM10: (altitude: string) => `REQUEST DESCENT TO ${altitude}`,
    DM11: (position: string, altitude: string) => `AT ${position} REQUEST CLIMB TO ${altitude}`,
    DM12: (position: string, altitude: string) => `AT ${position} REQUEST DESCENT TO ${altitude}`,
    DM13: (time: string, altitude: string) => `AT TIME ${time} REQUEST CLIMB TO ${altitude}`,
    DM14: (time: string, altitude: string) => `AT TIME ${time} REQUEST DESCENT TO ${altitude}`,
    DM15: (distance: string, direction: string) => `REQUEST OFFSET ${distance} ${direction} OF ROUTE`,
    DM18: (speed: string) => `REQUEST ${speed}`,
    DM20: () => 'REQUEST VOICE CONTACT',
    DM22: (position: string) => `REQUEST DIRECT TO ${position}`,
    DM23: (procedure: string) => `REQUEST ${procedure}`,
    DM24: (route: string) => `REQUEST ${route}`,
    DM25: () => 'REQUEST CLEARANCE',
    DM27: (distance: string, direction: string) => `REQUEST WEATHER DEVIATION UP TO ${distance} ${direction} OF ROUTE`,
    DM34: (speed: string) => `PRESENT SPEED ${speed}`,
    DM38: (altitude: string) => `ASSIGNED ALTITUDE ${altitude}`,
    DM40: (route: string) => `ASSIGNED ROUTE ${route}`,
    DM41: () => 'BACK ON ROUTE',
    DM55: () => 'PAN PAN PAN',
    DM56: () => 'MAYDAY MAYDAY MAYDAY',
    DM57: (fuel: string, souls: string) => `${fuel} OF FUEL REMAINING AND ${souls} ON BOARD`,
    DM58: () => 'CANCEL EMERGENCY',
    DM59: (position: string, route: string) => `DIVERTING TO ${position} VIA ${route}`,
    DM60: (distance: string, direction: string) => `OFFSETTING ${distance} ${direction} OF ROUTE`,
    DM61: (altitude: string) => `DESCENDING TO ${altitude}`,
    DM62: (error: string) => `ERROR ${error}`,
    DM63: () => 'NOT CURRENT DATA AUTHORITY',
    DM65: () => 'DUE TO WEATHER',
    DM66: () => 'DUE TO AIRCRAFT PERFORMANCE',
    DM77: (altitude1: string, altitude2: string) => `ASSIGNED BLOCK ${altitude1} TO ${altitude2}`,
    DM80: (distance: string, direction: string) => `DEVIATING ${distance} ${direction} OF ROUTE`,
    DM107: () => 'NOT AUTHORIZED NEXT DATA AUTHORITY',
    DM67: (text: string) => `${text}`,
    DM68: (text: string) => `${text}`,
};
