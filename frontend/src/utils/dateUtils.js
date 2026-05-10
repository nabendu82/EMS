export const pad2 = (n) => String(n).padStart(2, '0')

export function mondayYmdFromDate(d) {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    const day = x.getDay()
    const diff = day === 0 ? -6 : 1 - day
    x.setDate(x.getDate() + diff)
    return `${x.getFullYear()}-${pad2(x.getMonth() + 1)}-${pad2(x.getDate())}`
}

export function parseYmdLocal(ymd) {
    if (!ymd) return new Date()
    const [y, m, da] = ymd.split('-').map(Number)
    return new Date(y, m - 1, da, 0, 0, 0, 0)
}

export function addDaysYmd(ymd, days) {
    const dt = parseYmdLocal(ymd)
    dt.setDate(dt.getDate() + days)
    return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`
}

export function formatDmY(ymd) {
    if (!ymd) return ''
    const dt = parseYmdLocal(ymd)
    return `${pad2(dt.getDate())}-${pad2(dt.getMonth() + 1)}-${dt.getFullYear()}`
}

export function dayShortLabel(ymd) {
    const dt = parseYmdLocal(ymd)
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return `${dt.getDate()} ${names[dt.getDay()]}`
}
