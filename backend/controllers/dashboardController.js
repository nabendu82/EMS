import Department from "../models/Department.js";
import Employee from "../models/Employee.js"
import Leave from "../models/Leave.js";

const getSummary = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const totalDepartments = await Department.countDocuments();
        const totalSalaries = await Employee.aggregate([
            {$group: {_id: null, totalSalary: {$sum: "$salary"}}}
        ])

        const leaveStatus = await Leave.aggregate([
            {$group: { _id: "$status", count: { $sum: 1}}}
        ])
        
        const totalLeaveCount = leaveStatus.reduce((sum, item) => sum + item.count, 0)

        const leaveSummary = {
            appliedFor: totalLeaveCount,
            approved: leaveStatus.find(item => item._id === "approved")?.count || 0,
            rejected: leaveStatus.find(item => item._id === "rejected")?.count || 0,
            pending: leaveStatus.find(item => item._id === "pending")?.count || 0
        }

        return res.status(200).json({
            success: true,
            totalEmployees,
            totalDepartments,
            totalSalary: totalSalaries[0]?.totalSalary || 0,
            leaveSummary
        })
    } catch (error) {
        console.error("Dashboard Summary Failed:", error)
        return res.status(500).json({ success: false, error: "Dashboard Summary Failed" })
    }

}

export { getSummary }