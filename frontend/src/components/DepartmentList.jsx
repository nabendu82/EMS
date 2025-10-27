import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import DataTable from 'react-data-table-component'
import { columns } from '../utils/DepartmentHelper'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DepartmentButtons } from '../utils/DepartmentHelper'

const DepartmentList = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('http://localhost:3000/api/department', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.data.success) {
                let sno = 1;
                const departments = response.data.departments.map(department => ({
                    _id: department._id,
                    sno: sno++,
                    name: department.name,
                    description: department.description || "No description available",
                    action: <DepartmentButtons _id={department._id} />
                }))
                setData(departments)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Manage Departments</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <input 
                        type="text" 
                        placeholder="Search Department..." 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                    />
                </div>
                <Link 
                    to="/admin-dashboard/add-department" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
                >
                    <FaPlus className="text-lg" />
                    <span>Add Department</span>
                </Link>
            </div>
            <div className="mt-6 overflow-x-auto">
                <DataTable columns={columns} data={data}
                    customStyles={{
                        table: {
                            style: { borderRadius: '12px', overflow: 'hidden' },
                        },
                        headRow: {
                            style: {
                                backgroundColor: '#10b981', color: '#ffffff', fontSize: '16px', fontWeight: 'bold', borderBottom: 'none'
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

export default DepartmentList