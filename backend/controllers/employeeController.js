import Employee from '../models/Employee.js'
import User from '../models/User.js'
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

export { addEmployee, upload }