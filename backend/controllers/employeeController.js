import mongoose from 'mongoose'
import Employee from '../models/Employee.js'
import User from '../models/User.js'
import Project from '../models/Project.js'
import bcrypt from 'bcrypt'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname, '../public/uploads')

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({    
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

const addEmployee = async (req, res) => {
    try {
        const { name, email, password, employeeId, dateOfBirth, gender, maritalStatus, designation, department, salary, role } = req.body
        
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Profile image is required" })
        }
        
        // Check if user already exists
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ success: false, message: "User already registered" })
        
        // Validate required fields
        if (!name || !email || !password || !employeeId || !dateOfBirth || !gender || !maritalStatus || !designation || !department || !salary || !role) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        
        // Hash password
        const hashPassword = await bcrypt.hash(password, 10)
        
        // Create new user
        const newUser = new User({ name, email, password: hashPassword, role, profileImage: req.file.filename })
        await newUser.save()
        
        // Create new employee
        const newEmployee = new Employee({ userId: newUser._id, employeeId, dateOfBirth: new Date(dateOfBirth), gender, maritalStatus,designation, department, salary: Number(salary) })
        await newEmployee.save()
        
        return res.status(200).json({ success: true, message: "Employee added successfully" })
    } catch (error) {
        console.error("Error adding employee:", error)
        return res.status(500).json({ success: false, message: error.message || "Server error in adding employee" })
    }
}

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate('userId', { password: 0 })
            .populate('department')
            .populate('projects')
        return res.status(200).json({ success: true, employees })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error in getting employees" })
    }
}

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params
        let employee
        employee = await Employee.findById(id)
            .populate('userId', { password: 0 })
            .populate('department')
            .populate('projects')
        if (!employee) {
            employee = await Employee.findOne({ userId: id })
                .populate('userId', { password: 0 })
                .populate('department')
                .populate('projects')
        }
        return res.status(200).json({ success: true, employee })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error in getting employee by id" })
    }
}

const editEmployee = async (req, res) => {
    try {
        const { id } = req.params
        const { name, maritalStatus, designation, department, salary, projects } = req.body

        const employee = await Employee.findById({ _id: id })
        if (!employee) return res.status(400).json({ success: false, message: 'Employee not found' })

        const user = await User.findById({ _id: employee.userId })
        if (!user) return res.status(400).json({ success: false, message: 'User not found' })

        let projectIds
        if (projects !== undefined) {
            if (!Array.isArray(projects)) {
                return res.status(400).json({ success: false, message: 'projects must be an array' })
            }
            projectIds = [...new Set(projects.map((p) => String(p)).filter((id) => mongoose.Types.ObjectId.isValid(id)))]
            if (projectIds.length > 0) {
                const count = await Project.countDocuments({ _id: { $in: projectIds } })
                if (count !== projectIds.length) {
                    return res.status(400).json({ success: false, message: 'One or more invalid project ids' })
                }
            }
        }

        const updateUser = await User.findByIdAndUpdate({ _id: user._id }, { name }, { new: true })
        if (!updateUser) return res.status(400).json({ success: false, message: 'User not updated' })

        const updatePayload = { maritalStatus, designation, department, salary: Number(salary) }
        if (projectIds !== undefined) updatePayload.projects = projectIds

        const updateEmployee = await Employee.findByIdAndUpdate({ _id: employee._id }, updatePayload, { new: true })
            .populate('projects')
        if (!updateEmployee) return res.status(400).json({ success: false, message: 'Employee not updated' })

        return res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            employee: updateEmployee,
            user: updateUser,
        })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error in editing employee" })
    }
}

export { addEmployee, upload, getEmployees, getEmployeeById, editEmployee }