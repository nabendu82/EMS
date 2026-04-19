import Leave from '../models/Leave.js'
import Employee from '../models/Employee.js'

const addLeave = async (req, res) => {
    try {
        const { userId, leaveType, startDate, endDate, reason } = req.body
        const newLeave = new Leave({ userId, leaveType, startDate, endDate, reason })
        await newLeave.save()
        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Add Leave Failed" })
    }
}

const getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ userId: req.user._id }).sort({ createdAt: -1 })
        return res.status(200).json({ success: true, leaves })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Fetch leaves failed" })
    }
}

const getAllLeaves = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Forbidden' })
        }
        const leaves = await Leave.find().populate('userId', 'name').sort({ createdAt: -1 })
        const userIds = leaves.map((l) => l.userId?._id ?? l.userId).filter(Boolean)
        const employees = await Employee.find({ userId: { $in: userIds } }).populate('department', 'name')
        const byUserId = new Map()
        employees.forEach((e) => {
            byUserId.set(String(e.userId), {
                employeeId: e.employeeId,
                departmentName: e.department?.name ?? 'N/A',
            })
        })
        const enriched = leaves.map((leave) => {
            const uid = String(leave.userId?._id ?? leave.userId)
            const emp = byUserId.get(uid) ?? {}
            return {
                _id: leave._id,
                userId: uid,
                employeeId: emp.employeeId ?? 'N/A',
                employeeName: leave.userId?.name ?? 'N/A',
                department: emp.departmentName ?? 'N/A',
                leaveType: leave.leaveType,
                startDate: leave.startDate,
                endDate: leave.endDate,
                reason: leave.reason,
                status: leave.status,
                createdAt: leave.createdAt,
            }
        })
        return res.status(200).json({ success: true, leaves: enriched })
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Fetch all leaves failed' })
    }
}

export { addLeave, getLeaves, getAllLeaves }