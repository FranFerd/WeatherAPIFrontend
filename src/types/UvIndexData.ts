export interface UvindexHourlyDescription{
    "time": string,
    "uvindex": number,
    "description" : string
}
export interface UvindexForDay{
    [date: string]: UvindexHourlyDescription[]
}

export interface UvindexAndHighUvHoursForDay{
    uvindex: string,
    highUvHours: string
}

export interface UvindexAndHighUvHoursForWeek{
    [date: string]: UvindexAndHighUvHoursForDay
}