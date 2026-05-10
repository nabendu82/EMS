export function formatHourDisplay(h) {
    let n = Number(h)
    if (!Number.isFinite(n)) n = 0
    n = Math.round(n * 100) / 100
    if (Object.is(n, -0)) return '0'
    return String(n)
}

export function parseHourInput(raw) {
    if (raw === '' || raw == null) return 0
    const n = parseFloat(String(raw).replace(',', '.'))
    if (!Number.isFinite(n)) return 0
    return Math.min(24, Math.max(0, Math.round(n * 100) / 100))
}

export function sum(arr) {
    return arr.reduce((a, b) => a + (Number(b) || 0), 0)
}

export function cloneRows(rows) {
    return (rows ?? []).map((r) => ({
        projectId: r.projectId != null && r.projectId !== '' ? String(r.projectId) : '',
        project: r.project ?? '',
        activity: r.activity ?? '',
        hours: [...(r.hours ?? [0, 0, 0, 0, 0, 0, 0])].slice(0, 7).map((x) => {
            const n = Number(x)
            return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0
        }),
    }))
}
