import axios from 'axios'

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

export default fetchDepartments