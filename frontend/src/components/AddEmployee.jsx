import { FaUser } from "react-icons/fa"
import { useState, useEffect } from 'react'
import fetchDepartments from '../utils/EmployeeHelper'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddEmployee = () => {
    const [employee, setEmployee] = useState({ name: "", email: "", employeeId: "", dateOfBirth: "", gender: "", maritalStatus: "", designation: "", department: "", salary: "", password: "", role: "", image: null })
    const [departments, setDepartments] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchDepartments().then(departments => setDepartments(departments))
    }, [])

    const handleChange = e => {
        if (e.target.type === 'file') {
            setEmployee({ ...employee, image: e.target.files[0] })
        } else {
            setEmployee({ ...employee, [e.target.name]: e.target.value })
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('name', employee.name)
            formData.append('email', employee.email)
            formData.append('employeeId', employee.employeeId)
            formData.append('dateOfBirth', employee.dateOfBirth)
            formData.append('gender', employee.gender)
            formData.append('maritalStatus', employee.maritalStatus)
            formData.append('designation', employee.designation)
            formData.append('department', employee.department)
            formData.append('salary', employee.salary)
            formData.append('password', employee.password)
            formData.append('role', employee.role)
            if (employee.image) {
                formData.append('image', employee.image)
            }
            
            const response = await axios.post("http://localhost:3000/api/employee/add", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(response)
            if(response.data.success) {
                navigate("/admin-dashboard/employees")
            }
        } catch (error) {
            console.log(error)
            if(error.response && error.response.data) {
                alert(error.response.data.message || error.response.data.error || "Failed to add employee")
            } else {
                alert("Failed to add employee")
            }
        }
    }
    return (
            <div className="p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg">
                            <FaUser className="text-2xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Add New Employee</h2>
                    </div>
                    <p className="text-gray-600 ml-16">Fill in the details below to create a new employee</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Employee Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input type="text" id="name" name="name" value={employee.name} onChange={handleChange}
                                    placeholder="Enter employee name..." required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400" />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input type="email" id="email" name="email" value={employee.email} onChange={handleChange}
                                    placeholder="Enter email address..." required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400" />
                            </div>

                            {/* Employee ID */}
                            <div className="space-y-2">
                                <label htmlFor="employeeId" className="block text-sm font-semibold text-gray-700">
                                    Employee ID <span className="text-red-500">*</span>
                                </label>
                                <input type="text" id="employeeId" name="employeeId" value={employee.employeeId} onChange={handleChange}
                                    placeholder="Enter employee ID..." required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400" />
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <input type="date" id="dateOfBirth" name="dateOfBirth" value={employee.dateOfBirth} onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400" />
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select id="gender" name="gender" value={employee.gender} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400">
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Marital Status */}
                            <div className="space-y-2">
                                <label htmlFor="maritalStatus" className="block text-sm font-semibold text-gray-700">
                                    Marital Status <span className="text-red-500">*</span>
                                </label>
                                <select id="maritalStatus" name="maritalStatus" value={employee.maritalStatus} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400">
                                    <option value="">Select Status</option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                </select>
                            </div>

                            {/* Designation */}
                            <div className="space-y-2">
                                <label htmlFor="designation" className="block text-sm font-semibold text-gray-700">
                                    Designation <span className="text-red-500">*</span>
                                </label>
                                <input type="text" id="designation" name="designation" value={employee.designation} onChange={handleChange}
                                    placeholder="Enter designation..." required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400" />
                            </div>

                            {/* Department */}
                            <div className="space-y-2">
                                <label htmlFor="department" className="block text-sm font-semibold text-gray-700">
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <select id="department" name="department" value={employee.department} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400">
                                    <option value="">Select Department</option>
                                    {departments.map(department => (
                                        <option key={department._id} value={department._id}>{department.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Salary */}
                            <div className="space-y-2">
                                <label htmlFor="salary" className="block text-sm font-semibold text-gray-700">
                                    Salary <span className="text-red-500">*</span>
                                </label>
                                <input type="number" id="salary" name="salary" value={employee.salary} onChange={handleChange}
                                    placeholder="Enter salary..." required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400" />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input type="password" id="password" name="password" value={employee.password} onChange={handleChange}
                                    placeholder="Enter password..." required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400" />
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select id="role" name="role" value={employee.role} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400">
                                    <option value="">Select Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="employee">Employee</option>
                                </select>
                            </div>

                            {/* Upload Image */}
                            <div className="space-y-2">
                                <label htmlFor="image" className="block text-sm font-semibold text-gray-700">
                                    Upload Image <span className="text-red-500">*</span>
                                </label>
                                <input type="file" id="image" name="image" onChange={handleChange} accept="image/*" required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button type="submit" 
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >Add Employee</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddEmployee