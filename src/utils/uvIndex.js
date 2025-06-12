export function getUvDescription(uvIndex){
    if (uvIndex <= 2) return 'Low'
    if (uvIndex <=5) return 'Moderate' 
    if (uvIndex <=7) return 'High'
    if (uvIndex <=10) return 'Very High'
    return 'Extreme'
}

export function setUvIndexHourly(data){
    const uvIndexHourly = []
    for(let hourIndex = 0; hourIndex < data.length; hourIndex++){
        uvIndexHourly.push({
            "time": data[hourIndex].datetime,
            "uvindex": data[hourIndex].uvindex,
            "description": getUvDescription(data[hourIndex].uvindex)
        })
    }
    return uvIndexHourly
}

export function showHighUvHoursMessage(uvIndexHourlyData){
    const highUvHours = []
    for (let hourData of uvIndexHourlyData){
        if (hourData.uvindex >= 6){
            highUvHours.push(hourData.time.slice(0,5)) // Remove seconds
        }
    }
    if(highUvHours.length > 1){
        return `${highUvHours[0]} - ${highUvHours[highUvHours.length - 1]}`
    }
    else if(highUvHours.length === 1){
        return `${highUvHours[0]}`
    }
    return ''
}