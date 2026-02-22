import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import axios from 'axios'

const columns = [
    { name: 'S No', selector: (row) => row.sno, sortable: true, width: '100px' },
    { name: 'Type', selector: (row) => row.leaveType, sortable: true, width: '120px' },
    { name: 'Start Date', selector: (row) => row.startDate, sortable: true, width: '140px' },
    { name: 'End Date', selector: (row) => row.endDate, sortable: true, width: '140px' },
    { name: 'Status', selector: (row) => row.status, sortable: true, width: '120px' },
    { name: 'Reason', selector: (row) => row.reason, sortable: false, wrap: true },
]

const LeaveList = () => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/leave', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                if (response.data.success) {
                    let sno = 1
                    const leaves = response.data.leaves.map((leave) => {
                        const start = new Date(leave.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                        const end = new Date(leave.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                        return {
                            _id: leave._id,
                            sno: sno++,
                            leaveType: leave.leaveType ?? 'N/A',
                            startDate: start,
                            endDate: end,
                            status: leave.status ?? 'pending',
                            reason: leave.reason ?? '-',
                        }
                    })
                    setData(leaves)
                    setFilteredData(leaves)
                }
            } catch (error) {
                console.error('Error fetching leaves:', error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredData(data)
        } else {
            const query = searchQuery.toLowerCase()
            const filtered = data.filter(
                (row) =>
                    (row.leaveType && row.leaveType.toLowerCase().includes(query)) ||
                    (row.reason && row.reason.toLowerCase().includes(query)) ||
                    (row.status && row.status.toLowerCase().includes(query))
            )
            setFilteredData(filtered)
        }
    }, [searchQuery, data])

    return (
        <div className="p-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Manage Leaves</h2>
            </div>
            <div className="flex justify-between items-center gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by type, reason or status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                    />
                </div>
                <Link to="/employee-dashboard/add-leave" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-200">
                    Add New Leave
                </Link>
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
                        headCells: {
                            style: { paddingLeft: '20px', paddingRight: '20px' },
                        },
                        cells: {
                            style: { paddingLeft: '20px', paddingRight: '20px', fontSize: '15px' },
                        },
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

export default LeaveList