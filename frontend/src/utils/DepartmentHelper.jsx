import { useNavigate } from "react-router-dom"

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
    return (
        <div className="flex items-center gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200" onClick={() => navigate(`/admin-dashboard/department/${_id}`)}>
                Edit
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Delete
            </button>
        </div>
    )
}