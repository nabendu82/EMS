import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { FaUser, FaArrowLeft, FaEnvelope, FaIdCard, FaCalendar, FaVenusMars, FaHeart, FaBuilding, FaBriefcase, FaDollarSign, FaUserShield } from 'react-icons/fa'

const ViewEmployee = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [employee, setEmployee] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/employee/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                if(response.data.success) {
                    setEmployee(response.data.employee)
                }
            } catch (error) {
                console.error("Error fetching employee:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchEmployee()
    }, [id])

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-xl text-gray-600">Loading employee details...</div>
                </div>
            </div>
        )
    }

    if (!employee || !employee.userId || !employee.department) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">Employee Not Found</div>
                    <button 
                        onClick={() => navigate('/admin-dashboard/employees')}
                        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                    >
                        Go Back to Employee List
                    </button>
                </div>
            </div>
        )
    }

    const user = employee.userId
    const department = employee.department
    const dob = new Date(employee.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric'})

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/admin-dashboard/employees')}
                    className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200"
                >
                    <FaArrowLeft />
                    <span>Back to Employees</span>
                </button>

                {/* Employee Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white">Employee Details</h1>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left Side - Profile Image */}
                            <div className="flex-shrink-0 flex justify-center md:justify-start">
                                <div className="relative">
                                    <img 
                                        src={`http://localhost:3000/public/uploads/${user.profileImage}`} 
                                        alt={user.name}
                                        className="w-48 h-48 rounded-full object-cover shadow-2xl border-4 border-white ring-4 ring-blue-100"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
                                </div>
                            </div>

                            {/* Right Side - Employee Information */}
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <FaUser className="text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 font-semibold">Name</div>
                                            <div className="text-lg font-bold text-gray-800">{user.name}</div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <FaEnvelope className="text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 font-semibold">Email</div>
                                            <div className="text-lg font-bold text-gray-800 break-all">{user.email}</div>
                                        </div>
                                    </div>

                                    {/* Employee ID */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <FaIdCard className="text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 font-semibold">Employee ID</div>
                                            <div className="text-lg font-bold text-gray-800">{employee.employeeId}</div>
                                        </div>
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <FaCalendar className="text-orange-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 font-semibold">Date of Birth</div>
                                            <div className="text-lg font-bold text-gray-800">{dob}</div>
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                            <FaVenusMars className="text-pink-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 font-semibold">Gender</div>
                                            <div className="text-lg font-bold text-gray-800 capitalize">{employee.gender}</div>
                                        </div>
                                    </div>

                                    {/* Marital Status */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                            <FaHeart className="text-red-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 font-semibold">Marital Status</div>
                                            <div className="text-lg font-bold text-gray-800 capitalize">{employee.maritalStatus}</div>
                                        </div>
                                    </div>

                                    {/* Department */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <FaBuilding className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 font-semibold">Department</div>
                                            <div className="text-lg font-bold text-gray-800">{department.name}</div>
                                        </div>
                                    </div>

                                    {/* Designation */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <FaBriefcase className="text-yellow-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 font-semibold">Designation</div>
                                            <div className="text-lg font-bold text-gray-800">{employee.designation}</div>
                                        </div>
                                    </div>

                                    {/* Salary */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                            <FaDollarSign className="text-teal-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 font-semibold">Salary</div>
                                            <div className="text-lg font-bold text-gray-800">₹{employee.salary.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                                        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                            <FaUserShield className="text-cyan-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 font-semibold">Role</div>
                                            <div className="text-lg font-bold text-gray-800 capitalize">{user.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewEmployee