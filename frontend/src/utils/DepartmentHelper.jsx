import { useNavigate } from "react-router-dom"
import axios from "axios"

export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno,
        sortable: true,
        width: "100px"
    },
    {
        name: "Department Name",
        selector: (row) => row.name,
        sortable: true,
        width: "200px"
    },
    {
        name: "Description",
        selector: (row) => (
            <span className="text-gray-700 line-clamp-2">
                {row.description}
            </span>
        ),
        wrap: true,
        minWidth: "300px"
    },
    {
        name: "Action",
        selector: (row) => row.action,
        center: true,
        width: "220px"
    }
]

export const DepartmentButtons = ({ _id }) => {
    const navigate = useNavigate()
    
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            try {
                const response = await axios.delete(`http://localhost:3000/api/department/${_id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.data.success) {
                    alert("Department deleted successfully!")
                    window.location.reload()
                }
            } catch (error) {
                console.log(error)
                alert("Failed to delete department")
            }
        }
    }
    
    return (
        <div className="flex items-center gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200" onClick={() => navigate(`/admin-dashboard/department/${_id}`)}>
                Edit
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200" onClick={handleDelete}>
                Delete
            </button>
        </div>
    )
}