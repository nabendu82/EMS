import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaHome, FaUsers, FaBuilding, FaCalendarAlt, FaMoneyBill, FaChartLine } from 'react-icons/fa'

const AdminSidebar = () => {
    return (
        <div className="text-white h-screen bg-gray-800 fixed left-0 top-0 w-64 space-y-4 p-4">
            <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-4 shadow-lg mb-4">
                <h3 className="text-white font-bold text-lg text-center leading-tight">
                    <span className="block">Employee Management</span>
                    <span className="block text-green-100">System</span>
                </h3>
            </div>
            <div className="space-y-2 px-2">
                <NavLink 
                    to="/admin-dashboard" 
                    className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            isActive ? 'bg-green-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                    <FaHome className="text-lg" />
                    <span className="font-medium">Dashboard</span>
                </NavLink>
                <NavLink 
                    to="/admin-dashboard/employees" 
                    className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            isActive ? 'bg-green-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                    <FaUsers className="text-lg" />
                    <span className="font-medium">Employees</span>
                </NavLink>
                <NavLink 
                    to="/admin-dashboard/attendance" 
                    className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            isActive ? 'bg-green-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                    <FaBuilding className="text-lg" />
                    <span className="font-medium">Department</span>
                </NavLink>
                <NavLink 
                    to="/admin-dashboard/leaves" 
                    className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            isActive ? 'bg-green-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                    <FaCalendarAlt className="text-lg" />
                    <span className="font-medium">Leaves</span>
                </NavLink>
                <NavLink 
                    to="/admin-dashboard/salaries" 
                    className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            isActive ? 'bg-green-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                    <FaMoneyBill className="text-lg" />
                    <span className="font-medium">Salaries</span>
                </NavLink>
                <NavLink 
                    to="/admin-dashboard/reports" 
                    className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            isActive ? 'bg-green-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                    <FaChartLine className="text-lg" />
                    <span className="font-medium">Settings</span>
                </NavLink>
            </div>
        </div>
    )
}

export default AdminSidebar