import Leave from '../models/Leave.js' 

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

export { addLeave }