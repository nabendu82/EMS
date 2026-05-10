import mongoose from 'mongoose'
import Employee from '../models/Employee.js'
import { parseYmdLocal, stripLocalDate } from './dateUtils.js'

export function canInteractWithWeek(weekStartYmd) {
    const monday = stripLocalDate(parseYmdLocal(weekStartYmd))
    const today = stripLocalDate(new Date())
    return monday.getTime() <= today.getTime()
}

export async function finalizeTimesheetRows(userId, rawRows) {
    if (!Array.isArray(rawRows) || rawRows.length < 1) {
        throw new Error('At least one row is required')
    }
    const employee = await Employee.findOne({ userId }).populate('projects')
    if (!employee) {
        throw new Error('Employee profile not found')
    }
    const designation = (employee.designation || 'Staff').trim()
    const assigned = employee.projects || []
    const allowed = new Set(assigned.map((p) => String(p._id)))
    const nameById = new Map(assigned.map((p) => [String(p._id), p.name]))
    const projectByName = new Map(assigned.map((p) => [p.name, p]))

    return rawRows.map((r) => {
        let hours = Array.isArray(r.hours) ? r.hours.map((h) => Number(h)) : []
        if (hours.length !== 7) {
            hours = [0, 0, 0, 0, 0, 0, 0]
        }
        hours = hours.map((h) => (Number.isFinite(h) && h >= 0 ? Math.min(h, 24) : 0))

        let projectIdStr = null
        const pidRaw = r.projectId
        if (pidRaw != null && pidRaw !== '') {
            const s = String(pidRaw)
            if (mongoose.Types.ObjectId.isValid(s)) projectIdStr = s
        }
        let projectName = String(r.project ?? '').trim()

        if (assigned.length > 0) {
            if (!projectIdStr || !allowed.has(projectIdStr)) {
                const legacy = projectByName.get(projectName)
                if (legacy) projectIdStr = String(legacy._id)
            }
            if (!projectIdStr || !allowed.has(projectIdStr)) {
                throw new Error('Each row must use a project assigned to you (select from the Project dropdown)')
            }
            projectName = nameById.get(projectIdStr) || projectName
            if (!projectName) {
                throw new Error('Invalid project')
            }
            return {
                projectId: new mongoose.Types.ObjectId(projectIdStr),
                project: projectName,
                activity: designation,
                hours,
            }
        }

        if (!projectName) {
            throw new Error('Project name is required for each row')
        }
        return {
            project: projectName,
            activity: designation,
            hours,
        }
    })
}

export function weekdayTotalsValid(rows) {
    for (let d = 0; d < 5; d++) {
        let sum = 0
        for (const r of rows) {
            sum += Number(r.hours[d] ?? 0)
        }
        const ok = sum <= 0.05 || Math.abs(sum - 8) <= 0.05
        if (!ok) return { ok: false, day: d }
    }
    return { ok: true }
}

export function totalHoursFromRows(rows) {
    let t = 0
    for (const r of rows || []) {
        for (const h of r.hours || []) {
            t += Number(h) || 0
        }
    }
    return Math.round(t * 100) / 100
}
