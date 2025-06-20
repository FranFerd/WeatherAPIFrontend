const enum DayOfWeekIndex {
    Sunday = 0,
    Monday = 1, 
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}
export default function switchDayOfWeek(day: DayOfWeekIndex): string {
    const dayOfWeekDictionary = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    } as const

    return dayOfWeekDictionary[day] || ''
}
