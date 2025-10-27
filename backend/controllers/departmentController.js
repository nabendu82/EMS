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

const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params
        const department = await Department.findById(id)
        return res.status(200).json({ success: true, department })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Edit Department Failed" })
    }
}

const editDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description } = req.body
        const department = await Department.findByIdAndUpdate({_id: id }, { name, description }, { new: true })
        return res.status(200).json({ success: true, department })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Edit Department Failed" })
    }
}

const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const department = await Department.findByIdAndDelete(id)
        if (!department) {
            return res.status(404).json({ success: false, error: "Department not found" })
        }
        return res.status(200).json({ success: true, message: "Department deleted successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Delete Department Failed" })
    }
}

export { addDepartment, getDepartments, getDepartmentById, editDepartment, deleteDepartment }