import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaUserEdit } from 'react-icons/fa'
import fetchDepartments from '../utils/EmployeeHelper'

const EditEmployee = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(true)
    const [formState, setFormState] = useState({
        name: '',
        maritalStatus: '',
        designation: '',
        salary: '',
        department: ''
    })

    useEffect(() => {
        const initialise = async () => {
            try {
                const [employeeResponse, departmentList] = await Promise.all([
                    axios.get(`http://localhost:3000/api/employee/${id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }),
                    fetchDepartments()
                ])

                if (employeeResponse.data.success) {
                    const employee = employeeResponse.data.employee
                    setFormState({
                        name: employee.userId?.name ?? '',
                        maritalStatus: employee.maritalStatus ?? '',
                        designation: employee.designation ?? '',
                        salary: employee.salary ?? '',
                        department: employee.department?._id ?? ''
                    })
                }

                if (Array.isArray(departmentList)) {
                    setDepartments(departmentList)
                }
            } catch (error) {
                console.error('Error initialising edit employee form:', error)
            } finally {
                setLoading(false)
            }
        }

        initialise()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormState((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`http://localhost:3000/api/employee/${id}`, formState, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            if (response.data.success) {
                navigate('/admin-dashboard/employees')
            }
        } catch (error) {
            console.error('Error updating employee:', error)
        }
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Preparing employee details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                            <FaUserEdit className="text-2xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Edit Employee</h2>
                    </div>
                    <p className="text-gray-600 ml-16">Update the essential information for this team member.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formState.name}
                                    onChange={handleChange}
                                    placeholder="Enter employee name"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 hover:border-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="maritalStatus" className="block text-sm font-semibold text-gray-700">
                                    Marital Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="maritalStatus"
                                    name="maritalStatus"
                                    value={formState.maritalStatus}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 hover:border-gray-400"
                                >
                                    <option value="">Select status</option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="designation" className="block text-sm font-semibold text-gray-700">
                                    Designation <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="designation"
                                    name="designation"
                                    value={formState.designation}
                                    onChange={handleChange}
                                    placeholder="Enter designation"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 hover:border-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="salary" className="block text-sm font-semibold text-gray-700">
                                    Salary <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="salary"
                                    name="salary"
                                    min="0"
                                    value={formState.salary}
                                    onChange={handleChange}
                                    placeholder="Enter salary in ₹"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 hover:border-gray-400"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="department" className="block text-sm font-semibold text-gray-700">
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="department"
                                    name="department"
                                    value={formState.department}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 hover:border-gray-400"
                                >
                                    <option value="">Select department</option>
                                    {departments.map((department) => (
                                        <option key={department._id} value={department._id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-sm text-gray-500">Choose the team this employee belongs to.</p>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-3">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin-dashboard/employees')}
                                className="px-6 py-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditEmployee