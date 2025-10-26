import Department from '../models/Department.js'

const addDepartment = async (req, res) => {
    try {
        const { name, description } = req.body
        const newDep = new Department({ name, description })
        await newDep.save()
        return res.status(200).json({ success: true, department: newDep })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Add Department Failed" })
    }
}

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
        return res.status(200).json({ success: true, departments })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Get Departments Failed" })
    }
}
export { addDepartment, getDepartments }