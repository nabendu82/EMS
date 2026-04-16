import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import axios from 'axios'

const ViewSalary = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [rows, setRows] = useState([])
    const [employeeInfo, setEmployeeInfo] = useState({ department: 'N/A', designation: 'N/A' })

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')
                const headers = { Authorization: `Bearer ${token}` }

                const [salaryRes, employeeRes] = await Promise.all([
                    axios.get(`http://localhost:3000/api/salary/${id}`, { headers }),
                    axios.get(`http://localhost:3000/api/employee/${id}`, { headers }),
                ])

                const employee = employeeRes.data?.employee
                const departmentName = employee?.department?.name ?? 'N/A'
                const designation = employee?.designation ?? 'N/A'
                setEmployeeInfo({ department: departmentName, designation })

                if (salaryRes.data?.success) {
                    let sno = 1
                    const mapped = (salaryRes.data.salaries ?? []).map((s) => {
                        const createdAt = s.createdAt
                            ? new Date(s.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                            : '-'
                        return {
                            _id: s._id,
                            sno: sno++,
                            salary: Number(s.salary ?? 0),
                            department: departmentName,
                            designation,
                            createdAt,
                        }
                    })

                    setRows(mapped)
                } else {
                    setRows([])
                }
            } catch (error) {
                console.error('Error fetching salary:', error)
                setRows([])
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchSalaries()
    }, [id])

    const columns = useMemo(
        () => [
            { name: 'S No', selector: (row) => row.sno, sortable: true, width: '100px' },
            {
                name: 'Salary',
                selector: (row) => `₹${Number(row.salary ?? 0).toLocaleString()}`,
                sortable: true,
                width: '200px',
            },
            { name: 'Department', selector: (row) => row.department, sortable: true, width: '200px' },
            { name: 'Designation', selector: (row) => row.designation, sortable: true, width: '220px' },
            { name: 'Updated On', selector: (row) => row.createdAt, sortable: true, width: '200px' },
        ],
        []
    )

    const latestSalary = rows.length ? rows[0].salary : null

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">My Salary</h2>
            </div>
            <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-600">Latest Salary</p>
                        <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                            {latestSalary === null ? '—' : `₹${Number(latestSalary).toLocaleString()}`}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {employeeInfo.department} • {employeeInfo.designation}
                        </p>
                    </div>
                    <div className="text-sm text-gray-500">
                        {rows.length ? `Records: ${rows.length}` : 'No salary records found'}
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
        </div>
    )
}

export default ViewSalary