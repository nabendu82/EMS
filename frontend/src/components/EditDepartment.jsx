import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FaBuilding } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'

const EditDepartment = () => {
    const { id } = useParams()
    const [department, setDepartment] = useState({ name: "", description: "" })
    const handleChange = e => setDepartment({ ...department, [e.target.name]: e.target.value })
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDepartment = async () => {
            try {   
                const response = await axios.get(`http://localhost:3000/api/department/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if(response.data.success) {
                    setDepartment(response.data.department)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchDepartment()
    }, [id])

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const response = await axios.put(`http://localhost:3000/api/department/edit/${id}`, department, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
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
                        <h2 className="text-3xl font-bold text-gray-800">Edit Department</h2>
                    </div>
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
                                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">Edit Department</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditDepartment