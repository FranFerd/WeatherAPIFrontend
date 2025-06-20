export const labelsMap = {
    description: 'Description',
    precipitationType: 'Precipitation',
    uvindex: 'UV index',
    sunRise: 'Sunrise',
    sunSet: 'Sunset',
    highUvHours: "High UV hours",
    dayLength: "Day Length"     
} as const

export type LabelsMap = typeof labelsMap