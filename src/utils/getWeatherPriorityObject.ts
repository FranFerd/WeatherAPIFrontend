export const weatherPriorityObject = {
    'thunderstorm' : 10,
    'rain' : 9,
    'snow' : 8,
    'fog' : 7,
    'partly-cloudy-day': 6,
    'partly-cloudy-night': 6,
    'cloudy': 5,
    'clear-day': 4,
    'clear-night': 4,
    'wind': 3,
    'hail': 2,
    'defaultWeather': 1
} as const

export type WeatherPriority = typeof weatherPriorityObject
export type WeatherKey = keyof WeatherPriority // keyof gets the keys of a type as a union of string literal types (can only be of these exact string types)