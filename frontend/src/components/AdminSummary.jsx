import React from 'react'
import SummaryCard from './SummaryCard'
import { FaUsers, FaBuilding, FaCalendarAlt, FaMoneyBill, FaChartLine, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const AdminSummary = () => {
    return (
        <div className="p-4">
            <h3 className="text-2xl font-bold">Dashboard Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                <SummaryCard icon={<FaUsers />} title="Total Employees" number={50} color="bg-blue-500"/>
                <SummaryCard icon={<FaBuilding />} title="Total Departments" number={2} color="bg-green-500"/>
                <SummaryCard icon={<FaMoneyBill />} title="Monthly Salaries" number={50000} color="bg-red-500"/>
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