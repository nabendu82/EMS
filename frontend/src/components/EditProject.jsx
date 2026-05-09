import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FaFolderOpen } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const EditProject = () => {
    const { id } = useParams()
    const [project, setProject] = useState({ name: '', description: '' })
    const handleChange = (e) => setProject({ ...project, [e.target.name]: e.target.value })
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/project/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                if (response.data.success) {
                    setProject({
                        name: response.data.project.name,
                        description: response.data.project.description || '',
                    })
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchProject()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`http://localhost:3000/api/project/${id}`, project, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            if (response.data.success) {
                navigate('/admin-dashboard/projects')
            }
        } catch (error) {
            console.error(error)
            alert(error?.response?.data?.error || 'Update failed')
        }
    }

    return (
        <div className="p-6">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white shadow-lg">
                            <FaFolderOpen className="text-2xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Edit Project</h2>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                Project name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={project.name}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 outline-none transition-all duration-200 hover:border-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={project.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full resize-none rounded-lg border-2 border-gray-300 px-4 py-3 outline-none transition-all duration-200 hover:border-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full transform rounded-lg bg-gradient-to-r from-green-600 to-green-500 py-4 px-6 text-lg font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:from-green-700 hover:to-green-600 active:scale-[0.98] focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Save Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProject
