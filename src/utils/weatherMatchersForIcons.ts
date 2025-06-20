export const weatherMatchersForIcons = {
    'partly-cloudy-day': 'partlyCloudyDay',
    'partly-cloudy-night': 'partlyCloudyNight',
    'cloudy': 'cloudy',
    'rain': 'rain',
    'clear-night': 'clearNight',
    'clear-day': 'clearDay',
    'snow': 'snow',
    'fog': 'fog'
} as const
export type WeatherMatchersForIcons = typeof weatherMatchersForIcons

export const weatherMathcersForDisplay = {
    'partly-cloudy-day': 'partly cloudy day',
    'partly-cloudy-night': 'partly cloudy night',
    'cloudy': 'cloudy',
    'rain': 'rain',
    'clear-night': 'clear night',
    'clear-day': 'clear day',
    'snow': 'snow',
    'fog': 'fog'
} as const
export type WeatherMatchersForDisplay = typeof weatherMathcersForDisplay