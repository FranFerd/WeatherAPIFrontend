export const sunPositions = {
    1: [12, 40],
    2: [20, 24],
    3: [35, 13],
    4: [55, 4],
    5: [79, 0], // center
    6: [105, 4],
    7: [125, 13],
    8: [138, 24],
    9: [146, 40],
    10: [-10, -10] // no sun
} as const

export type SunPositions = typeof sunPositions