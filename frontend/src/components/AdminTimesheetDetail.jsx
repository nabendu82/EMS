import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

const pad2 = (n) => String(n).padStart(2, '0')

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

function formatHourDisplay(h) {
    let n = Number(h)
    if (!Number.isFinite(n)) n = 0
    n = Math.round(n * 100) / 100
    return String(n)
}

function sum(arr) {
    return arr.reduce((a, b) => a + (Number(b) || 0), 0)
}

const AdminTimesheetDetail = () => {
    const { id } = useParams()
    const [ts, setTs] = useState(null)
    const [err, setErr] = useState(null)
    const [msg, setMsg] = useState(null)
    const [loading, setLoading] = useState(true)
    const [approving, setApproving] = useState(false)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setErr(null)
            try {
                const res = await axios.get(`http://localhost:3000/api/timesheet/admin/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                if (res.data?.success) setTs(res.data.timesheet)
                else setErr('Not found')
            } catch (e) {
                setErr(e?.response?.data?.error || 'Failed to load')
                setTs(null)
            } finally {
                setLoading(false)
            }
        }
        if (id) load()
    }, [id])

    const dayColumns = useMemo(() => {
        if (!ts?.weekStart) return []
        return Array.from({ length: 7 }, (_, i) => ({
            ymd: addDaysYmd(ts.weekStart, i),
            label: dayShortLabel(addDaysYmd(ts.weekStart, i)),
        }))
    }, [ts?.weekStart])

    const handleApprove = async () => {
        if (!ts?._id || ts.status !== 'submitted') return
        setApproving(true)
        setMsg(null)
        setErr(null)
        try {
            const res = await axios.patch(`http://localhost:3000/api/timesheet/admin/${ts._id}/approve`,{},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            if (res.data?.success) {
                setMsg('Timesheet approved')
                setTs((prev) => ({
                    ...res.data.timesheet,
                    employeeId: prev?.employeeId,
                    department: prev?.department,
                    employeeName: prev?.employeeName ?? res.data.timesheet?.userId?.name,
                }))
            }
        } catch (e) {
            setErr(e?.response?.data?.error || 'Approve failed')
        } finally {
            setApproving(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-600">Loading…</p>
            </div>
        )
    }

    if (err || !ts) {
        return (
            <div className="p-6">
                <p className="text-red-600">{err || 'Not found'}</p>
                <Link to="/admin-dashboard/timesheets" className="mt-4 inline-block text-emerald-700 font-semibold">
                    ← Back to timesheets
                </Link>
            </div>
        )
    }

    const statusText =
        ts.status === 'approved'
            ? 'Approved by HR'
            : ts.status === 'submitted'
              ? 'Submitted — pending approval'
              : ts.status

    const approver = ts.approvedBy?.name

    return (
        <div className="p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <Link to="/admin-dashboard/timesheets" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                    ← Back to timesheets
                </Link>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800">Timesheet detail</h2>
                <p className="mt-1 text-sm text-gray-600">
                    {ts.employeeName} · Emp ID {ts.employeeId} · {ts.department}
                </p>
                <p className="text-sm text-gray-600">
                    Week: {formatDmY(ts.weekStart)} – {formatDmY(addDaysYmd(ts.weekStart, 6))}
                </p>

                {msg && (
                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">{msg}</div>
                )}
                {err && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="bg-emerald-700 text-white">
                                <th className="px-3 py-2">Project</th>
                                <th className="px-3 py-2">Designation</th>
                                {dayColumns.map((d) => (
                                    <th key={d.ymd} className="px-2 py-2 text-center">
                                        {d.label}
                                    </th>
                                ))}
                                <th className="px-3 py-2 text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(ts.rows || []).map((row, ri) => (
                                <tr key={ri} className="border-b border-gray-100">
                                    <td className="px-3 py-2">{row.project}</td>
                                    <td className="px-3 py-2">{row.activity}</td>
                                    {[0, 1, 2, 3, 4, 5, 6].map((di) => (
                                        <td key={di} className="px-2 py-2 text-center">
                                            {formatHourDisplay(row.hours?.[di] ?? 0)}
                                        </td>
                                    ))}
                                    <td className="px-3 py-2 text-center font-semibold">{formatHourDisplay(sum(row.hours))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-gray-700">
                        <p>
                            <span className="font-semibold">Status:</span> {statusText}
                        </p>
                        {ts.status === 'approved' && ts.approvedAt && (
                            <p className="text-gray-500">
                                Approved on {new Date(ts.approvedAt).toLocaleString()}
                                {approver ? ` · by ${approver}` : ''}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {ts.status === 'submitted' && (
                            <button
                                type="button"
                                disabled={approving}
                                onClick={handleApprove}
                                className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {approving ? 'Approving…' : 'Approve'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminTimesheetDetail
