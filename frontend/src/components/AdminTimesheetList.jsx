import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import axios from 'axios'

const formatDmY = (ymd) => {
    if (!ymd) return ''
    const [y, m, d] = ymd.split('-')
    return `${d}-${m}-${y}`
}

const statusDisplay = (s) => {
    if (s === 'approved') return 'Approved'
    if (s === 'submitted') return 'Pending approval'
    return s
}

const AdminTimesheetList = () => {
    const now = new Date()
    const [year, setYear] = useState(now.getFullYear())
    const [month, setMonth] = useState(now.getMonth() + 1)
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const res = await axios.get('http://localhost:3000/api/timesheet/admin/list', {
                    params: { year, month },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                if (res.data?.success) {
                    let sno = 1
                    setRows(
                        (res.data.timesheets ?? []).map((t) => ({
                            ...t,
                            sno: sno++,
                            weekRange: `${formatDmY(t.weekStart)} – ${formatDmY(t.weekEnd)}`,
                            statusLabel: statusDisplay(t.status),
                        }))
                    )
                }
            } catch (e) {
                console.error(e)
                setRows([])
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [year, month])

    const columns = useMemo(
        () => [
            { name: 'S-no', selector: (r) => r.sno, width: '70px' },
            { name: 'Emp ID', selector: (r) => r.employeeId, sortable: true, width: '110px' },
            { name: 'Name', selector: (r) => r.employeeName, sortable: true, width: '200px' },
            { name: 'Week', selector: (r) => r.weekRange, sortable: true, width: '220px' },
            { name: 'Total hrs', selector: (r) => r.totalHours, sortable: true, width: '100px' },
            {
                name: 'Status',
                selector: (r) => r.statusLabel,
                sortable: true,
                width: '150px',
            },
            {
                name: 'Action',
                cell: (r) => (
                    <Link
                        to={`/admin-dashboard/timesheets/${r._id}`}
                        className="rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-700"
                    >
                        View
                    </Link>
                ),
                width: '100px',
            },
        ],
        []
    )

    const yearOptions = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i)

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800">Timesheets</h2>
            <p className="mt-1 text-sm text-gray-600">Submitted and approved weekly timesheets by calendar month.</p>

            <div className="mt-6 flex flex-wrap items-end gap-4">
                <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Year</label>
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Month</label>
                    <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>
                                {new Date(2000, m - 1, 1).toLocaleString('en', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={rows}
                    progressPending={loading}
                    customStyles={{
                        table: { style: { borderRadius: '12px', overflow: 'hidden' } },
                        headRow: {
                            style: {
                                backgroundColor: '#059669',
                                color: '#ffffff',
                                fontSize: '15px',
                                fontWeight: 'bold',
                            },
                        },
                        headCells: { style: { paddingLeft: '16px', paddingRight: '16px' } },
                        cells: { style: { paddingLeft: '16px', paddingRight: '16px', fontSize: '14px' } },
                        rows: {
                            style: {
                                '&:nth-of-type(odd)': { backgroundColor: '#f9fafb' },
                            },
                        },
                    }}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 25, 50]}
                />
            </div>
        </div>
    )
}

export default AdminTimesheetList
