import z from 'zod';

export enum DirectionDir {
    Left,
    Right,
    EitherSide,
    North,
    South,
    East,
    West,
    NorthEast,
    NorthWest,
    SouthEast,
    SouthWest,
}

export enum UnitFunc {
    Center,
    Approach,
    Tower,
    Final,
    GroundControl,
    ClearanceDelivery,
    Departure,
    Control,
}


export const altimeterParam = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('qnh-inhg'),
        ft: z.number().int().min(2500).max(3100),
    }),
    z.object({
        type: z.literal('qnh-hpa'),
        fl: z.number().int().min(850).max(1050),
    }),
]);

export const altitudeParam = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('alt-ft'),
        ft: z.number().int().min(0).max(25000),
    }),
    z.object({
        type: z.literal('alt-fl'),
        fl: z.number().int().min(30).max(600),
    }),
]);

export const beaconCodeParam = z.object({
    type: z.literal('beacon'),
    code: z.number()
        .int()
        .min(0)
        .max(7777)
        .refine((num) => (
            num % 10 <= 7
            && Math.floor(num / 10) % 10 <= 7
            && Math.floor(num / 100) % 10 <= 7
            && Math.floor(num / 1000) <= 7
        )),
})

export const degreesParam = z.object({
    type: z.literal('degrees'),
    deg: z.number().int().min(1).max(360),
});

export const distanceParam = z.object({
    type: z.literal('distance'),
    nmi: z.number().int().min(0).max(9999),
});

export const directionParam = z.object({
    type: z.literal('direction'),
    dir: z.nativeEnum(DirectionDir),
});

export const errorParam = z.object({
    type: z.literal('error'),
    error: z.string(),
});

export const facilityIdentParam = z.object({
    type: z.literal('facility'),
    ident: z.string().length(4),
})

export const freeTextParam = z.object({
    type: z.literal('text'),
    text: z.string(),
});

export const frequencyParam = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('freq-hf'),
        hf: z.number().int().min(2850).max(28000),
    }),
    z.object({
        type: z.literal('freq-vhf'),
        vhf: z.number().int().min(118000).max(136975).step(25),
    }),
]);

export const positionParam = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('pos-fix'),
        fix: z.string().min(1).max(5),
    }),
    z.object({
        type: z.literal('pos-navaid'),
        navaid: z.string().min(1).max(4),
    }),
    z.object({
        type: z.literal('pos-airport'),
        airport: z.string().length(4),
    }),
    z.object({
        type: z.literal('pos-latlon'),
        lat: z.number().min(-90).max(90),
        lon: z.number().min(-180).max(180),
    }),
    z.object({
        type: z.literal('pos-pdb'),
        // TODO
    }),
]);

export const procedureParam = z.object({
    type: z.literal('procedure'),
    // TODO
});

export const routeParam = z.object({
    type: z.literal('route'),
    // TODO
});

export const speedParam = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('speed-kts'),
        kts: z.number().int().min(7).max(38),
    }),
    z.object({
        type: z.literal('speed-mach'),
        mach: z.number().int().min(61).max(99),
    }),
]);

export const timeParam = z.object({
    type: z.literal('time'),
    hrs: z.number().int().min(0).max(23),
    min: z.number().int().min(0).max(59),
});

export const unitNameParam = z.object({
    type: z.literal('unit'),
    ident: z.string().length(4),
    name: z.string().min(3).max(18),
    func: z.nativeEnum(UnitFunc),
});

export const parameter = z.discriminatedUnion('type', [
    beaconCodeParam,
    degreesParam,
    distanceParam,
    directionParam,
    errorParam,
    facilityIdentParam,
    freeTextParam,
    procedureParam,
    routeParam,
    timeParam,
    unitNameParam,
    // Other discriminated unions need to be destructured
    ...altimeterParam.options,
    ...altitudeParam.options,
    ...frequencyParam.options,
    ...positionParam.options,
    ...speedParam.options,
]);

export type Altimeter = z.infer<typeof altimeterParam>;
export type Altitude = z.infer<typeof altitudeParam>;
export type BeaconCode = z.infer<typeof beaconCodeParam>;
export type Degrees = z.infer<typeof degreesParam>;
export type Distance = z.infer<typeof distanceParam>;
export type Direction = z.infer<typeof directionParam>;
export type Error = z.infer<typeof errorParam>;
export type FacilityIdent = z.infer<typeof facilityIdentParam>;
export type FreeText = z.infer<typeof freeTextParam>;
export type Frequency = z.infer<typeof frequencyParam>;
export type Position = z.infer<typeof positionParam>;
export type Procedure = z.infer<typeof procedureParam>;
export type Route = z.infer<typeof routeParam>;
export type Speed = z.infer<typeof speedParam>;
export type Time = z.infer<typeof timeParam>;
export type UnitName = z.infer<typeof unitNameParam>;