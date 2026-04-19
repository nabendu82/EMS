import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import axios from 'axios'

const formatDate = (value) => {
    if (!value) return '—'
    return new Date(value).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}

const LeaveDetails = () => {
    const { id } = useParams()
    const location = useLocation()
    const isAdmin = location.pathname.includes('admin-dashboard')
    const backHref = isAdmin ? '/admin-dashboard/leaves' : '/employee-dashboard/leaves'

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [detail, setDetail] = useState(null)
    const [actionError, setActionError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const fetchLeave = useCallback(async (opts = { silent: false }) => {
        if (!id) return
        const silent = opts.silent === true
        try {
            if (!silent) {
                setLoading(true)
                setError(null)
            }
            const response = await axios.get(`http://localhost:3000/api/leave/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            if (response.data?.success && response.data.leave) {
                setDetail(response.data.leave)
            } else {
                setError('Leave not found')
                setDetail(null)
            }
        } catch (err) {
            const msg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                'Could not load leave details'
            setError(msg)
            setDetail(null)
        } finally {
            if (!silent) setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchLeave({ silent: false })
    }, [fetchLeave])

    const handleStatusUpdate = async (nextStatus) => {
        if (!id || submitting) return
        setActionError(null)
        setSubmitting(true)
        try {
            await axios.patch(
                `http://localhost:3000/api/leave/${id}/status`,
                { status: nextStatus },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            )
            await fetchLeave({ silent: true })
        } catch (err) {
            const msg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                'Could not update status'
            setActionError(msg)
        } finally {
            setSubmitting(false)
        }
    }

    const imageSrc =
        detail?.profileImage != null && detail.profileImage !== ''
            ? `http://localhost:3000/public/uploads/${detail.profileImage}`
            : null

    const isPending = detail && (detail.status ?? '').toLowerCase() === 'pending'

    const statusClass =
        detail &&
        (detail.status === 'approved'
            ? 'text-green-700'
            : detail.status === 'rejected'
              ? 'text-red-700'
              : 'text-amber-700')

    return (
        <div className="p-6">
            <div className="mb-4">
                <Link to={backHref} className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                    ← Back to leaves
                </Link>
            </div>
            {loading && (
                <div className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-600 shadow-xl">
                    Loading…
                </div>
            )}
            {!loading && error && (
                <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}
            {!loading && detail && (
                <div className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
                    <h1 className="mb-8 text-center text-2xl font-bold text-gray-800">Leave Details</h1>
                    {actionError && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {actionError}
                        </div>
                    )}
                    <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center">
                        <div className="shrink-0">
                            {imageSrc ? (
                                <img
                                    src={imageSrc}
                                    alt={detail.name}
                                    className="h-40 w-40 rounded-full border-4 border-gray-100 object-cover shadow-md md:h-48 md:w-48"
                                />
                            ) : (
                                <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-gray-100 bg-emerald-100 text-3xl font-bold text-emerald-800 shadow-md md:h-48 md:w-48">
                                    {(detail.name || '?').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="w-full max-w-md space-y-4 text-gray-800">
                            <div>
                                <p className="text-sm font-bold text-gray-600">Name</p>
                                <p className="text-lg">{detail.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-600">Employee ID</p>
                                <p className="text-lg">{detail.employeeId}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-600">Leave Type</p>
                                <p className="text-lg">{detail.leaveTypeDisplay}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-600">Reason</p>
                                <p className="text-lg">{detail.reason}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-600">Department</p>
                                <p className="text-lg">{detail.department}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-600">Start Date</p>
                                <p className="text-lg">{formatDate(detail.startDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-600">End Date</p>
                                <p className="text-lg">{formatDate(detail.endDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-600">Status</p>
                                <p className={`text-lg font-semibold ${statusClass}`}>{detail.statusDisplay}</p>
                            </div>

                            {isAdmin && isPending && (
                                <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
                                    <span className="text-sm font-bold text-gray-600 sm:mr-2">Action</span>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            disabled={submitting}
                                            onClick={() => handleStatusUpdate('approved')}
                                            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            type="button"
                                            disabled={submitting}
                                            onClick={() => handleStatusUpdate('rejected')}
                                            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LeaveDetails
