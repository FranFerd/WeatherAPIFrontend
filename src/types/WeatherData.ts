export interface WeatherDataForDayFull {
    conditions: string,
    datetime: string,
    feelslike: number,
    hours: HourlyInfo[],
    icon: string,
    preciptype: string[] | null,
    sunrise: string,
    sunset: string,
    temp: number,
    uvindex: number,
    windspeed: number
}

export interface HourlyInfo {
    conditions: string,
    datetime: string,
    feelslike: number,
    icon: string,
    preciptype: string[] | null,
    temp: number,
    uvindex: number,
    windspeed: number
} 
export type HourlyInfoKey = keyof HourlyInfo
export type ItemToPushKey = 'temp' | 'icon' | 'feelslike' | 'windspeed'

export interface WeatherDataForWeekRaw {
    address: string,
    days: WeatherDataForDayFull[],
    resolvedAddress: string
}

export interface WeatherDataForWeekRefined {
    [date: string]: WeatherDataForDayRefined[]
}

export type WeatherDataForDayRefined = [
    timeOfDay: TimeOfDay,
    temperature?: number,
    description?: string,
    feelsLike?: number,
    windSpeed?: number
]
type TimeOfDay = 'night' | 'morning' | 'afternoon' | 'evening'