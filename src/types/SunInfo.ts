export interface SunInfoForWeek {
    [date: string]: SunInfoForDay
}

export type SunInfoForDay = [
    sunriseTime: string,
    lengthOfDay: string,
    sunsetTime: string
]