import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import axios from 'axios'

const columns = [
    { name: 'S No', selector: (row) => row.sno, sortable: true, width: '100px' },
    { name: 'Name', selector: (row) => row.name, sortable: true, width: '260px' },  
    { name: 'DOB', selector: (row) => row.dateOfBirth, sortable: true, width: '160px' },
    { name: 'Department', selector: (row) => row.department, sortable: true, width: '180px' },
    { name: 'Designation', selector: (row) => row.designation, sortable: true, width: '220px' },
    { name: 'Salary', selector: (row) => row.salary, sortable: true, width: '180px' },
]

const SalaryList = () => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/employee', {
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}` },
                })

                if (response.data.success) {
                    let sno = 1
                    const employees = response.data.employees.map((employee) => {
                        const user = employee.userId
                        const department = employee.department
                        const dob = new Date(employee.dateOfBirth).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })

                        return {
                            _id: employee._id,
                            sno: sno++,
                            name: user?.name ?? 'N/A',
                            dateOfBirth: dob,
                            department: department?.name ?? 'N/A',
                            designation: employee.designation ?? 'N/A',
                            salary: `₹${Number(employee.salary ?? 0).toLocaleString()}`,
                        }
                    })

                    setData(employees)
                    setFilteredData(employees)
                }
            } catch (error) {
                console.error('Error fetching salary data:', error)
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
                (employee) =>
                    employee.name.toLowerCase().includes(query) ||
                    employee.department.toLowerCase().includes(query) ||
                    employee.designation.toLowerCase().includes(query)
            )
            setFilteredData(filtered)
        }
    }, [searchQuery, data])

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Salary Overview</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by employee, department, or designation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                    />
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

export default SalaryList
