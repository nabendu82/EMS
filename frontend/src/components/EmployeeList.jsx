import React from 'react'
import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { columns, EmployeeButtons } from '../utils/EmployeeHelper'
import axios from 'axios'

const EmployeeList = () => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/employee', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if(response.data.success) {
                    let sno = 1
                    const employees = response.data.employees.map(employee => {
                        const user = employee.userId
                        const department = employee.department
                        const dob = new Date(employee.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric'})
                        
                        return {
                            _id: employee._id,
                            sno: sno++,
                            image: (
                                <img src={`http://localhost:3000/public/uploads/${user.profileImage}`} alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover mx-auto"
                                />
                            ),
                            name: user.name,
                            dateOfBirth: dob,
                            department: department ? department.name : "N/A",
                            action: <EmployeeButtons _id={employee._id} />
                        }
                    })
                    setData(employees)
                    setFilteredData(employees)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredData(data)
        } else {
            const filtered = data.filter(employee =>
                employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                employee.department.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredData(filtered)
        }
    }, [searchQuery, data])

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Manage Employees</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <input 
                        type="text" 
                        placeholder="Search Employee..."  
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                    />
                </div>
                <Link 
                    to="/admin-dashboard/add-employee" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
                >
                    <FaPlus className="text-lg" />
                    <span>Add Employee</span>
                </Link>
            </div>
            <div className="mt-6 overflow-x-auto">
                <DataTable 
                    columns={columns} 
                    data={filteredData}
                    customStyles={{
                        table: { style: { borderRadius: '12px', overflow: 'hidden' } },
                        headRow: {
                            style: { backgroundColor: '#10b981', color: '#ffffff', fontSize: '16px', fontWeight: 'bold', borderBottom: 'none'},
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

export default EmployeeList