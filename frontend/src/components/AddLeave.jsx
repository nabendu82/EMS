import { useAuth } from '../context/authContext'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddLeave = () => {
    const { user } = useAuth()
    const [leave, setLeave] = useState({
        userId: user._id,
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
    })
    
    const navigate = useNavigate()
    const handleChange = e => setLeave({ ...leave, [e.target.name]: e.target.value })

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:3000/api/leave/add", leave, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            console.log(response)
            if(response.data.success) {
                navigate("/employee-dashboard/leaves")
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800">Request for Leave</h2>
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="leaveType" className="block text-sm font-semibold text-gray-700">Leave Type <span className="text-red-500">*</span></label>
                        <select id="leaveType" name="leaveType" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400" onChange={handleChange}>
                            <option value="">Select Leave Type</option>
                            <option value="casual">Casual Leave</option>
                            <option value="sick">Sick Leave</option>
                            <option value="annual">Annual Leave</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">Start Date <span className="text-red-500">*</span></label>
                            <input type="date" id="startDate" name="startDate" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400" onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700">End Date <span className="text-red-500">*</span></label>
                            <input type="date" id="endDate" name="endDate" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="reason" className="block text-sm font-semibold text-gray-700">Reason <span className="text-red-500">*</span></label>
                        <textarea id="reason" name="reason" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400" onChange={handleChange} />
                    </div>
                </div>
                <div className="pt-4">
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]" onClick={handleSubmit}>Request Leave</button>
                </div>
            </form>
        </div>
    )
}

export default AddLeave