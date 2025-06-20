import type { WeatherDataForDayFull } from "../types/WeatherData.js"

export default function calculateDayLength(data: WeatherDataForDayFull): string{
    const sunrise = data.sunrise
    const sunset = data.sunset

    const [sunriseHours,sunriseMinutes] = sunrise.split(':').map(Number)
    const [sunsetHours,sunsetMinutes] = sunset.split(':').map(Number)

    const sunriseSeconds = sunriseHours*3600 + sunriseMinutes*60
    let sunsetSeconds = sunsetHours*3600 + sunsetMinutes*60

    if (sunsetHours < sunriseHours){
        sunsetSeconds += 86400
        // Sunset after midnight
    }

    const differenceSeconds = sunsetSeconds - sunriseSeconds

    const hours = Math.floor(differenceSeconds / 3600)
    const minutes = Math.floor((differenceSeconds % 3600) / 60)

    return `${hours}h ${minutes}m`
}