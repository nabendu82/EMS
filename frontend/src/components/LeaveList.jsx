import { Link } from 'react-router-dom'

const LeaveList = () => {
    return (
        <div className="p-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Manage Leaves</h2>
            </div>
            <div className="flex justify-between items-center gap-4">
                <div className="flex-1">
                    <input 
                        type="text" 
                        placeholder="Search by Dep Name" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                    />
                </div>
                <Link to="/employee-dashboard/add-leave" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-200">
                    Add New Leave
                </Link>
                </div>
            
        </div>
    )
}

export default LeaveList