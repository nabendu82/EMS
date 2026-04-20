import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import axios from 'axios'

const leaveTypeLabel = (type) => {
    const map = { casual: 'Casual Leave', sick: 'Sick Leave', annual: 'Annual Leave' }
    return map[type] ?? type ?? 'N/A'
}

const statusLabel = (status) => {
    const s = (status ?? 'pending').toLowerCase()
    if (s === 'approved') return 'Approved'
    if (s === 'rejected') return 'Rejected'
    return 'Pending'
}

const inclusiveDays = (start, end) => {
    const s = new Date(start)
    const e = new Date(end)
    const a = Date.UTC(s.getFullYear(), s.getMonth(), s.getDate())
    const b = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate())
    return Math.floor((b - a) / 86400000) + 1
}

const EmployeeLeaveList = () => {
    const { id } = useParams() // employee _id
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [employeeHeader, setEmployeeHeader] = useState({ name: 'Employee', employeeId: '' })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token')
                const headers = { Authorization: `Bearer ${token}` }

                const [leaveRes, empRes] = await Promise.all([
                    axios.get(`http://localhost:3000/api/leave/employee/${id}`, { headers }),
                    axios.get(`http://localhost:3000/api/employee/${id}`, { headers }),
                ])

                const employee = empRes.data?.employee
                const name = employee?.userId?.name ?? 'Employee'
                const empId = employee?.employeeId ?? ''
                setEmployeeHeader({ name, employeeId: empId })

                if (leaveRes.data?.success) {
                    let sno = 1
                    const leaves = (leaveRes.data.leaves ?? []).map((leave) => ({
                        _id: leave._id,
                        sno: sno++,
                        leaveType: leave.leaveType,
                        leaveTypeDisplay: leaveTypeLabel(leave.leaveType),
                        department: leave.department ?? employee?.department?.name ?? 'N/A',
                        days: inclusiveDays(leave.startDate, leave.endDate),
                        statusRaw: (leave.status ?? 'pending').toLowerCase(),
                        statusDisplay: statusLabel(leave.status),
                    }))
                    setData(leaves)
                    setFilteredData(leaves)
                } else {
                    setData([])
                    setFilteredData([])
                }
            } catch (error) {
                console.error('Error fetching employee leaves:', error)
                setData([])
                setFilteredData([])
            }
        }

        if (id) fetchData()
    }, [id])

    useEffect(() => {
        let rows = data
        if (statusFilter !== 'all') {
            rows = rows.filter((row) => row.statusRaw === statusFilter)
        }
        if (searchQuery === '') {
            setFilteredData(rows)
            return
        }
        const query = searchQuery.toLowerCase()
        setFilteredData(
            rows.filter(
                (row) =>
                    (row.leaveTypeDisplay && row.leaveTypeDisplay.toLowerCase().includes(query)) ||
                    (row.department && row.department.toLowerCase().includes(query)) ||
                    (row.statusDisplay && row.statusDisplay.toLowerCase().includes(query))
            )
        )
    }, [searchQuery, statusFilter, data])

    const columns = useMemo(
        () => [
            { name: 'S No', selector: (row) => row.sno, sortable: true, width: '95px' },
            { name: 'Leave Type', selector: (row) => row.leaveTypeDisplay, sortable: true, width: '180px' },
            { name: 'Department', selector: (row) => row.department, sortable: true, width: '180px' },
            { name: 'Days', selector: (row) => row.days, sortable: true, width: '95px' },
            { name: 'Status', selector: (row) => row.statusDisplay, sortable: true, width: '140px' },
            {
                name: 'Action',
                cell: (row) => (
                    <Link
                        to={`/admin-dashboard/leaves/${row._id}`}
                        className="inline-block rounded-md bg-teal-600 px-3 py-1.5 text-center text-sm font-semibold text-white shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        View
                    </Link>
                ),
                ignoreRowClick: true,
                allowOverflow: true,
                width: '110px',
            },
        ],
        []
    )

    const filterBtn = (key, label, colorClass) => (
        <button
            type="button"
            onClick={() => setStatusFilter((prev) => (prev === key ? 'all' : key))}
            className={`rounded-lg px-4 py-2 font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${colorClass} ${
                statusFilter === key ? 'ring-2 ring-offset-2 ring-gray-700 opacity-100' : 'opacity-85'
            }`}
        >
            {label}
        </button>
    )

    return (
        <div className="p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Manage Leaves</h2>
                    <p className="mt-1 text-sm font-medium text-gray-600">
                        {employeeHeader.name}
                        {employeeHeader.employeeId ? ` • ${employeeHeader.employeeId}` : ''}
                    </p>
                </div>
                <Link to="/admin-dashboard/employees" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                    ← Back to employees
                </Link>
            </div>

            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by type, department or status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {filterBtn('pending', 'Pending', 'bg-blue-500 hover:bg-blue-600')}
                    {filterBtn('approved', 'Approved', 'bg-green-500 hover:bg-green-600')}
                    {filterBtn('rejected', 'Rejected', 'bg-red-500 hover:bg-red-600')}
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    customStyles={{
                        table: { style: { borderRadius: '12px', overflow: 'hidden' } },
                        headRow: {
                            style: {
                                backgroundColor: '#059669',
                                color: '#ffffff',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                borderBottom: 'none',
                            },
                        },
                        headCells: { style: { paddingLeft: '20px', paddingRight: '20px' } },
                        cells: { style: { paddingLeft: '20px', paddingRight: '20px', fontSize: '15px' } },
                        rows: {
                            style: {
                                '&:nth-of-type(odd)': { backgroundColor: '#f9fafb' },
                                '&:hover': { backgroundColor: '#f3f4f6', cursor: 'pointer' },
                            },
                        },
                    }}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30]}
                />
            </div>
        </div>
    )
}

export default EmployeeLeaveList