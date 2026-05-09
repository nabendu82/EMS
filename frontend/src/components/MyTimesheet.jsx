import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const pad2 = (n) => String(n).padStart(2, '0')

function mondayYmdFromDate(d) {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    const day = x.getDay()
    const diff = day === 0 ? -6 : 1 - day
    x.setDate(x.getDate() + diff)
    return `${x.getFullYear()}-${pad2(x.getMonth() + 1)}-${pad2(x.getDate())}`
}

function parseYmdLocal(ymd) {
    const [y, m, da] = ymd.split('-').map(Number)
    return new Date(y, m - 1, da, 0, 0, 0, 0)
}

function addDaysYmd(ymd, days) {
    const dt = parseYmdLocal(ymd)
    dt.setDate(dt.getDate() + days)
    return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`
}

function formatDmY(ymd) {
    const dt = parseYmdLocal(ymd)
    return `${pad2(dt.getDate())}-${pad2(dt.getMonth() + 1)}-${dt.getFullYear()}`
}

function dayShortLabel(ymd) {
    const dt = parseYmdLocal(ymd)
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return `${dt.getDate()} ${names[dt.getDay()]}`
}

/** Display hours as plain numbers (8, 4.5, 0) — not clock time */
function formatHourDisplay(h) {
    let n = Number(h)
    if (!Number.isFinite(n)) n = 0
    n = Math.round(n * 100) / 100
    if (Object.is(n, -0)) return '0'
    return String(n)
}

function parseHourInput(raw) {
    if (raw === '' || raw == null) return 0
    const n = parseFloat(String(raw).replace(',', '.'))
    if (!Number.isFinite(n)) return 0
    return Math.min(24, Math.max(0, Math.round(n * 100) / 100))
}

function sum(arr) {
    return arr.reduce((a, b) => a + (Number(b) || 0), 0)
}

function cloneRows(rows) {
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

const MyTimesheet = () => {
    const [weekStart, setWeekStart] = useState(() => mondayYmdFromDate(new Date()))
    const [weekEnd, setWeekEnd] = useState(() => addDaysYmd(mondayYmdFromDate(new Date()), 6))
    const [canCreate, setCanCreate] = useState(false)
    const [timesheet, setTimesheet] = useState(null)
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState(null)
    const [err, setErr] = useState(null)
    const [editing, setEditing] = useState(false)
    const [editRows, setEditRows] = useState([])
    const [editBaseline, setEditBaseline] = useState([])
    const [employeeTimesheetContext, setEmployeeTimesheetContext] = useState(null)

    const designation = (employeeTimesheetContext?.designation ?? '').trim() || 'Staff'
    const assignedProjects = employeeTimesheetContext?.projects ?? []
    const hasAssignedProjects = assignedProjects.length > 0

    const makeEmptyRow = () => ({
        projectId: '',
        project: '',
        activity: designation,
        hours: [0, 0, 0, 0, 0, 0, 0],
    })

    const dayColumns = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => ({
            ymd: addDaysYmd(weekStart, i),
            label: dayShortLabel(addDaysYmd(weekStart, i)),
        }))
    }, [weekStart])

    const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

    const fetchWeek = useCallback(async () => {
        setLoading(true)
        setErr(null)
        try {
            const res = await axios.get('http://localhost:3000/api/timesheet', {
                params: { weekStart },
                headers: authHeader(),
            })
            if (res.data?.success) {
                setWeekStart(res.data.weekStart)
                setWeekEnd(res.data.weekEnd)
                setCanCreate(!!res.data.canCreate)
                setTimesheet(res.data.timesheet ?? null)
                setEmployeeTimesheetContext(res.data.employeeTimesheetContext ?? null)
            }
        } catch (e) {
            setErr(e?.response?.data?.error || 'Failed to load timesheet')
            setTimesheet(null)
        } finally {
            setLoading(false)
        }
    }, [weekStart])

    useEffect(() => {
        fetchWeek()
    }, [fetchWeek])

    const startEdit = () => {
        if (!timesheet || timesheet.status !== 'draft') return
        const copy = cloneRows(timesheet.rows).map((r) => ({ ...r, activity: designation }))
        if (copy.length === 0) copy.push(makeEmptyRow())
        setEditBaseline(cloneRows(copy))
        setEditRows(copy)
        setEditing(true)
        setErr(null)
        setMsg(null)
    }

    const cancelEdit = () => {
        setEditing(false)
        setEditRows([])
        setEditBaseline([])
        setErr(null)
    }

    const resetEdit = () => {
        const base = cloneRows(editBaseline)
        if (base.length === 0) base.push(makeEmptyRow())
        setEditRows(base.map((r) => ({ ...r, activity: designation })))
    }

    const shiftWeek = (delta) => {
        if (editing) return
        setMsg(null)
        setErr(null)
        const monday = parseYmdLocal(weekStart)
        monday.setDate(monday.getDate() + delta * 7)
        setWeekStart(mondayYmdFromDate(monday))
    }

    const handleCreate = async () => {
        setErr(null)
        setMsg(null)
        try {
            const res = await axios.post(
                'http://localhost:3000/api/timesheet',
                { weekStart },
                { headers: authHeader() }
            )
            if (res.data?.success && res.data.timesheet) {
                setMsg('Timesheet created')
                const ts = res.data.timesheet
                setTimesheet(ts)
                setWeekEnd(addDaysYmd(ts.weekStart, 6))
            }
        } catch (e) {
            setErr(e?.response?.data?.error || 'Could not create timesheet')
        }
    }

    const handleSave = async () => {
        if (!timesheet?._id) return
        setErr(null)
        setMsg(null)
        try {
            const res = await axios.put(
                `http://localhost:3000/api/timesheet/${timesheet._id}`,
                { rows: editRows },
                { headers: authHeader() }
            )
            if (res.data?.success) {
                setMsg('Saved (draft – not sent to HR)')
                setTimesheet(res.data.timesheet)
                setEditing(false)
                setEditRows([])
                setEditBaseline([])
            }
        } catch (e) {
            setErr(e?.response?.data?.error || 'Save failed')
        }
    }

    const handleSubmit = async () => {
        if (!timesheet?._id) return
        setErr(null)
        setMsg(null)
        const rowsPayload = editing ? editRows : cloneRows(timesheet.rows)
        try {
            const res = await axios.patch(
                `http://localhost:3000/api/timesheet/${timesheet._id}/submit`,
                { rows: rowsPayload },
                { headers: authHeader() }
            )
            if (res.data?.success) {
                setMsg('Submitted to HR')
                setTimesheet(res.data.timesheet)
                setEditing(false)
                setEditRows([])
                setEditBaseline([])
            }
        } catch (e) {
            setErr(e?.response?.data?.error || 'Submit failed')
        }
    }

    const updateCell = (rowIdx, dayIdx, raw) => {
        setEditRows((prev) => {
            const next = cloneRows(prev)
            if (!next[rowIdx]) return prev
            const h = [...next[rowIdx].hours]
            h[dayIdx] = parseHourInput(raw)
            next[rowIdx] = { ...next[rowIdx], hours: h, activity: designation }
            return next
        })
    }

    const updateField = (rowIdx, field, value) => {
        if (field === 'activity') return
        setEditRows((prev) => {
            const next = cloneRows(prev)
            if (!next[rowIdx]) return prev
            next[rowIdx] = { ...next[rowIdx], [field]: value }
            return next
        })
    }

    const updateProjectSelection = (rowIdx, projectId) => {
        setEditRows((prev) => {
            const next = cloneRows(prev)
            if (!next[rowIdx]) return prev
            const p = assignedProjects.find((x) => String(x._id) === String(projectId))
            next[rowIdx] = {
                ...next[rowIdx],
                projectId: projectId ? String(projectId) : '',
                project: p?.name ?? '',
                activity: designation,
            }
            return next
        })
    }

    const addRow = () => {
        setEditRows((prev) => [...cloneRows(prev), makeEmptyRow()])
    }

    const removeRow = (idx) => {
        setEditRows((prev) => {
            const next = cloneRows(prev).filter((_, i) => i !== idx)
            return next.length ? next : [makeEmptyRow()]
        })
    }

    const displayRows = editing ? editRows : cloneRows(timesheet?.rows || [])

    const colTotals = useMemo(() => {
        const t = [0, 0, 0, 0, 0, 0, 0]
        displayRows.forEach((r) => {
            for (let i = 0; i < 7; i++) t[i] += Number(r.hours?.[i] ?? 0)
        })
        return t
    }, [displayRows])

    const grandTotal = sum(displayRows.map((r) => sum(r.hours)))

    const isApproved = timesheet?.status === 'approved'
    const isSubmittedPending = timesheet?.status === 'submitted'
    const canEmployeeEdit = timesheet?.status === 'draft'
    const statusLabel = isApproved ? 'Approved by HR' : isSubmittedPending ? 'Submitted (pending HR approval)' : 'Draft (not submitted to HR)'

    if (loading) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800">My Timesheet</h2>
                <p className="mt-6 text-gray-600">Loading…</p>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold text-gray-800">My Timesheet</h2>
                <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-semibold text-gray-600">Timesheet Period</span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={editing}
                            onClick={() => shiftWeek(-1)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50 disabled:opacity-40"
                        >
                            ‹
                        </button>
                        <span className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm">
                            {formatDmY(weekStart)} to {formatDmY(weekEnd)}
                        </span>
                        <button
                            type="button"
                            disabled={editing}
                            onClick={() => shiftWeek(1)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50 disabled:opacity-40"
                        >
                            ›
                        </button>
                    </div>
                </div>
            </div>

            {msg && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
                    {msg}
                </div>
            )}
            {err && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                    {err}
                </div>
            )}

            {!timesheet && (
                <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 px-6 py-10 text-center shadow-sm">
                    <p className="font-medium text-amber-900">No timesheet found for this period.</p>
                    <p className="mt-2 text-sm text-amber-800">
                        {!canCreate
                            ? 'This week has not started yet — you can create a timesheet once the week begins.'
                            : 'Create a timesheet to log your hours (each Mon–Fri totals 8 hours across rows before submit, or 0 on a full leave/holiday day).'}
                    </p>
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            disabled={!canCreate}
                            onClick={handleCreate}
                            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                        >
                            Create Timesheet
                        </button>
                    </div>
                </div>
            )}

            {timesheet && (
                <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-xl">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="bg-emerald-700 text-white">
                                <th className="whitespace-nowrap px-4 py-3 font-semibold">Project</th>
                                <th className="whitespace-nowrap px-4 py-3 font-semibold">Designation</th>
                                {dayColumns.map((d) => (
                                    <th key={d.ymd} className="whitespace-nowrap px-3 py-3 text-center font-semibold">
                                        {d.label}
                                    </th>
                                ))}
                                <th className="whitespace-nowrap px-4 py-3 text-center font-semibold">Total</th>
                                {editing && <th className="px-2 py-3" />}
                            </tr>
                        </thead>
                        <tbody>
                            {displayRows.map((row, ri) => (
                                <tr key={ri} className="border-b border-gray-100 odd:bg-gray-50/80">
                                    <td className="px-4 py-2 align-middle">
                                        {editing && canEmployeeEdit ? (
                                            hasAssignedProjects ? (
                                                <select
                                                    value={row.projectId || ''}
                                                    onChange={(e) => updateProjectSelection(ri, e.target.value)}
                                                    className="w-52 min-w-[13rem] rounded border border-gray-300 bg-white px-2 py-1.5 text-sm"
                                                >
                                                    <option value="">Select project</option>
                                                    {assignedProjects.map((p) => (
                                                        <option key={p._id} value={p._id}>
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={row.project}
                                                    onChange={(e) => updateField(ri, 'project', e.target.value)}
                                                    className="w-40 min-w-[10rem] rounded border border-gray-300 px-2 py-1.5 text-sm"
                                                />
                                            )
                                        ) : (
                                            <span className="text-gray-900">{row.project}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 align-middle">
                                        <span className="text-gray-900">
                                            {(designation || row.activity || '—').trim() || '—'}
                                        </span>
                                    </td>
                                    {[0, 1, 2, 3, 4, 5, 6].map((di) => (
                                        <td key={di} className="px-2 py-2 text-center align-middle">
                                            {editing && canEmployeeEdit ? (
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={24}
                                                    step={0.25}
                                                    inputMode="decimal"
                                                    value={row.hours?.[di] ?? 0}
                                                    onChange={(e) => updateCell(ri, di, e.target.value)}
                                                    className="w-16 rounded border border-gray-300 px-2 py-1.5 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                    title="Hours (e.g. 8, 4, 0)"
                                                />
                                            ) : (
                                                <span className="font-medium text-gray-800">
                                                    {formatHourDisplay(row.hours?.[di] ?? 0)}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2 text-center font-semibold text-gray-900">
                                        {formatHourDisplay(sum(row.hours))}
                                    </td>
                                    {editing && (
                                        <td className="px-1 py-2 text-center">
                                            {displayRows.length > 1 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(ri)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Remove row"
                                                >
                                                    ✕
                                                </button>
                                            ) : null}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            <tr className="bg-gray-100 font-semibold">
                                <td colSpan={2} className="px-4 py-3 text-gray-700">
                                    Total
                                </td>
                                {colTotals.map((t, i) => (
                                    <td key={i} className="py-3 text-center text-gray-900">
                                        {formatHourDisplay(t)}
                                    </td>
                                ))}
                                <td className="py-3 text-center text-gray-900">{formatHourDisplay(grandTotal)}</td>
                                {editing && <td />}
                            </tr>
                        </tbody>
                    </table>
                    {editing && (
                        <div className="border-t border-gray-100 px-4 py-3">
                            <button
                                type="button"
                                onClick={addRow}
                                className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                            >
                                + Add row
                            </button>
                        </div>
                    )}
                    <div className="flex flex-col gap-4 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-600">
                            Status: <span className="font-semibold text-gray-800">{statusLabel}</span>
                        </p>
                        <div className="flex flex-wrap justify-end gap-2">
                            {!isApproved && !isSubmittedPending && !editing && (
                                <>
                                    <button
                                        type="button"
                                        onClick={startEdit}
                                        className="rounded-lg border-2 border-emerald-600 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
                                    >
                                        Submit
                                    </button>
                                </>
                            )}
                            {editing && (
                                <>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="rounded-lg border-2 border-emerald-600 bg-white px-4 py-2 text-sm font-semibold text-emerald-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetEdit}
                                        className="rounded-lg border-2 border-emerald-600 bg-white px-4 py-2 text-sm font-semibold text-emerald-700"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
                                    >
                                        Save
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyTimesheet
