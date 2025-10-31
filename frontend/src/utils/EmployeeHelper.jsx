import axios from 'axios'
import { useNavigate } from "react-router-dom"

const fetchDepartments = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/department', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if(response.data.success) {
            return response.data.departments
        } 
    } catch (error) {
        console.log(error)
    }
}

export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno,
        sortable: true,
        width: "100px"
    },
    {
        name: "Image",
        selector: (row) => row.image,
        center: true,
        width: "120px"
    },
    {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
        width: "260px"
    },
    {
        name: "DOB",
        selector: (row) => row.dateOfBirth,
        sortable: true,
        width: "160px"
    },
    {
        name: "Department",
        selector: (row) => row.department,
        sortable: true,
        width: "150px"
    },
    {
        name: "Action",
        selector: (row) => row.action,
        center: true,
    }
]

export const EmployeeButtons = ({ _id }) => {
    const navigate = useNavigate()
    
    const handleView = () => {
        navigate(`/admin-dashboard/employees/${_id}`)
    }
    
    const handleEdit = () => {
        navigate(`/admin-dashboard/employees/edit/${_id}`)
    }
    
    const handleSalary = () => {
        // Functionality to be added later
        console.log("Salary employee:", _id)
    }
    
    const handleLeave = () => {
        // Functionality to be added later
        console.log("Leave employee:", _id)
    }
    
    return (
        <div className="flex items-center gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm" onClick={handleView}>
                View
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm" onClick={handleEdit}>
                Edit
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm" onClick={handleSalary}>
                Salary
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm" onClick={handleLeave}>
                Leave
            </button>
        </div>
    )
}

export default fetchDepartments