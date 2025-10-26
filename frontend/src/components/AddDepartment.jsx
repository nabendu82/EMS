import { useState } from "react"
import { FaBuilding } from "react-icons/fa"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const AddDepartment = () => {
    const [department, setDepartment] = useState({ name: "", description: "" })
    const navigate = useNavigate()
    const handleChange = e => setDepartment({ ...department, [e.target.name]: e.target.value })
    
    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:3000/api/department/add", department, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            console.log(response)
            if(response.data.success) {
                navigate("/admin-dashboard/departments")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-lg">
                            <FaBuilding className="text-2xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Add New Department</h2>
                    </div>
                    <p className="text-gray-600 ml-16">Fill in the details below to create a new department</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                Department Name <span className="text-red-500">*</span>
                            </label>
                            <input type="text" id="name" name="name" value={department.name} onChange={handleChange}
                                placeholder="Enter department name..." required
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 hover:border-gray-400" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
                            <textarea id="description" name="description" value={department.description} onChange={handleChange}
                                rows="4" placeholder="Enter department description..."
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 resize-none hover:border-gray-400" />
                        </div>
                        <div className="pt-4">
                            <button type="submit" 
                                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >Add Department</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddDepartment