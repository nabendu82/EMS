import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import DataTable from 'react-data-table-component'
import { projectColumns, ProjectButtons } from '../utils/ProjectHelper'
import axios from 'axios'
import { useState, useEffect } from 'react'

const ProjectList = () => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/project', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                if (response.data.success) {
                    let sno = 1
                    const projects = response.data.projects.map((project) => ({
                        _id: project._id,
                        sno: sno++,
                        name: project.name,
                        description: project.description || '—',
                        action: <ProjectButtons _id={project._id} />,
                    }))
                    setData(projects)
                    setFilteredData(projects)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredData(data)
        } else {
            const q = searchQuery.toLowerCase()
            setFilteredData(
                data.filter((p) => p.name.toLowerCase().includes(q) || String(p.description).toLowerCase().includes(q))
            )
        }
    }, [searchQuery, data])

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Manage Projects</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search project..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <Link
                    to="/admin-dashboard/add-project"
                    className="inline-flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg"
                >
                    <FaPlus className="text-lg" />
                    <span>Add Project</span>
                </Link>
            </div>
            <div className="mt-6 overflow-x-auto">
                <DataTable
                    columns={projectColumns}
                    data={filteredData}
                    customStyles={{
                        table: { style: { borderRadius: '12px', overflow: 'hidden' } },
                        headRow: {
                            style: {
                                backgroundColor: '#059669',
                                color: '#ffffff',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                borderBottom: 'none',
                            },
                        },
                        headCells: { style: { paddingLeft: '20px', paddingRight: '20px' } },
                        cells: { style: { paddingLeft: '20px', paddingRight: '20px', fontSize: '15px' } },
                        rows: {
                            style: {
                                '&:nth-of-type(odd)': { backgroundColor: '#f9fafb' },
                                '&:hover': { backgroundColor: '#f3f4f6', cursor: 'pointer' },
                            },
                        },
                    }}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30]}
                />
            </div>
        </div>
    )
}

export default ProjectList
