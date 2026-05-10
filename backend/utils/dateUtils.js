export function pad2(n) {
    return String(n).padStart(2, '0')
}

export function mondayYmdFromDate(d) {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    const day = x.getDay()
    const diff = day === 0 ? -6 : 1 - day
    x.setDate(x.getDate() + diff)
    return `${x.getFullYear()}-${pad2(x.getMonth() + 1)}-${pad2(x.getDate())}`
}

export function parseYmdLocal(ymd) {
    const [y, m, da] = ymd.split('-').map(Number)
    return new Date(y, m - 1, da, 0, 0, 0, 0)
}

export function addDaysYmd(ymd, days) {
    const dt = parseYmdLocal(ymd)
    dt.setDate(dt.getDate() + days)
    return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`
}

export function stripLocalDate(d) {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    return x
}

export function weekOverlapsCalendarMonth(weekStartYmd, year, month) {
    const ws = parseYmdLocal(weekStartYmd)
    const we = new Date(ws)
    we.setDate(we.getDate() + 6)
    we.setHours(23, 59, 59, 999)
    const first = new Date(year, month - 1, 1, 0, 0, 0, 0)
    const last = new Date(year, month, 0, 23, 59, 59, 999)
    return ws.getTime() <= last.getTime() && we.getTime() >= first.getTime()
}
