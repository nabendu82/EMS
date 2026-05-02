import React, { useEffect, useState } from 'react'
import SummaryCard from './SummaryCard'
import { FaUsers, FaBuilding, FaCalendarAlt, FaMoneyBill, FaChartLine, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import axios from 'axios';

const AdminSummary = () => {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const summary = await axios.get('http://localhost:3000/api/dashboard/summary', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setSummary(summary);
            } catch (error) {
                if(error.response) alert(error.response.data.error)
                    console.log(error.message)
            }
        }
        fetchSummary()
    }, [])

    if(!summary){
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4">
            <h3 className="text-2xl font-bold">Dashboard Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                <SummaryCard icon={<FaUsers />} title="Total Employees" number={summary.totalEmployees} color="bg-blue-500"/>
                <SummaryCard icon={<FaBuilding />} title="Total Departments" number={summary.totalDepartments} color="bg-green-500"/>
                <SummaryCard icon={<FaMoneyBill />} title="Monthly Salaries" number={summary.totalSalary} color="bg-red-500"/>
            </div>
            <div className="mt-12">
                <h4 className="text-xl font-bold">Leave Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                    <SummaryCard icon={<FaCalendarAlt />} title="Leave Applied" number={5} color="bg-yellow-500"/>
                    <SummaryCard icon={<FaCheckCircle />} title="Leave Approved" number={4} color="bg-green-500"/>
                    <SummaryCard icon={<FaTimesCircle />} title="Leave Rejected" number={1} color="bg-red-500"/>
                    <SummaryCard icon={<FaChartLine />} title="Leave Pending" number={7} color="bg-blue-500"/>
                </div>
            </div>
        </div>
    )
}

export default AdminSummary 