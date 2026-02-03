export function getStartOfWeek(date: Date): number {
    if (!date) return Date.now();
    const d = new Date(date);
    if (isNaN(d.getTime())) return Date.now();

    const day = d.getDay();
    // Monday:1, Tue:2... Sat:6, Sun:0
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    const monday = new Date(new Date(d).setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.getTime();
}

export function isNewWeek(lastReset: number): boolean {
    if (typeof lastReset !== 'number') return true;
    const now = new Date();
    const currentWeekStart = getStartOfWeek(now);
    return lastReset < currentWeekStart;
}

export function formatDate(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getCalendarDaysOfMonth(
    year?: number,
    month?: number
): { date: string, dayNumber: number, weekday: number, isToday: boolean }[] {
    const now = new Date();
    const targetYear = year !== undefined ? year : now.getFullYear();
    const targetMonth = month !== undefined ? month : now.getMonth();

    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const todayStr = formatDate(now);

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(targetYear, targetMonth, i);
        days.push({
            date: formatDate(d),
            dayNumber: i,
            weekday: d.getDay(), // 0: 日, 1: 一...
            isToday: formatDate(d) === todayStr
        });
    }
    return days;
}
