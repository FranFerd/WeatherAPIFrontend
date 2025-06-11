export function getUvDescription(uvIndex){
    if (uvIndex <= 2) return 'Low'
    if (uvIndex <=5) return 'Moderate' 
    if (uvIndex <=7) return 'High'
    if (uvIndex <=10) return 'Very High'
    return 'Extreme'
}

export function setUvIndexHourly(data){
    const uvIndexHourly = []
    for(let i = 0; i < data.value.length; i++){
        uvIndexHourly.push({
            "time": data.value[i].datetime,
            "uvindex": data.value[i].uvindex,
            "description": getUvDescription(data.value[i].uvindex)
        })
    }
    return uvIndexHourly
}

export function showHighUvHoursMessage(uvIndexHourly){
    const highUvHours = []
    for (let hourData of uvIndexHourly){
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