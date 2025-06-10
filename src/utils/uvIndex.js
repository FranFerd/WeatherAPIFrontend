export function getUvDescription(uvIndex){
    if (uvIndex <= 2) return 'Low'
    if (uvIndex <=5) return 'Moderate' 
    if (uvIndex <=7) return 'High'
    if (uvIndex <=10) return 'Very High'
    return 'Extreme'
}

export function setUvIndexHourly(data, uvIndexHourly){
    for(let i = 0; i < data.value.length; i++){
        uvIndexHourly.value.push({
            "time": data.value[i].datetime,
            "uvindex": data.value[i].uvindex,
            "description": getUvDescription(data.value[i].uvindex)
        })
    }
}

export function showHighUvHours(uvDataHourly, highUvHours, highUvHoursMessage){
    for (let hour of uvDataHourly){
        if (hour.uvindex >= 6){
            highUvHours.value.push(hour.time)
        }
    }
    highUvHoursMessage.value = `${highUvHours.value[0]} - ${highUvHours.value[highUvHours.value.length - 1]}`
}