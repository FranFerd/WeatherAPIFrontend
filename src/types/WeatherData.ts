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