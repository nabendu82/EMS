import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const projectColumns = [
    { name: 'S No', selector: (row) => row.sno, sortable: true, width: '100px' },
    { name: 'Project name', selector: (row) => row.name, sortable: true, width: '220px' },
    {
        name: 'Description',
        selector: (row) => <span className="text-gray-700 line-clamp-2">{row.description}</span>,
        wrap: true,
        minWidth: '280px',
    },
    { name: 'Action', selector: (row) => row.action, center: true, width: '220px' },
]

export const ProjectButtons = ({ _id }) => {
    const navigate = useNavigate()

    const handleDelete = async () => {
        if (
            window.confirm(
                'Delete this project? It will be unassigned from all employees. Timesheet history keeps the project name as text.'
            )
        ) {
            try {
                const response = await axios.delete(`http://localhost:3000/api/project/${_id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                if (response.data.success) {
                    window.location.reload()
                }
            } catch (error) {
                console.error(error)
                alert(error?.response?.data?.error || 'Failed to delete project')
            }
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-600 hover:shadow-lg"
                onClick={() => navigate(`/admin-dashboard/project/${_id}`)}
            >
                Edit
            </button>
            <button
                type="button"
                className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-red-600 hover:shadow-lg"
                onClick={handleDelete}
            >
                Delete
            </button>
        </div>
    )
}
