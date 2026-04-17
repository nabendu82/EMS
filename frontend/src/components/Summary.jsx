import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaUser, FaTimes } from 'react-icons/fa'
import { useAuth } from '../context/authContext'

const Summary = () => {
    const { user } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [showPasswordSuccess, setShowPasswordSuccess] = useState(() => !!location.state?.passwordChanged)

    const dismissPasswordSuccess = () => {
        setShowPasswordSuccess(false)
        navigate('.', { replace: true, state: {} })
    }

    return (
        <div className="p-6">
        {showPasswordSuccess && (
            <div className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 shadow-sm">
                <span>Password changed successfully.</span>
                <button
                    type="button"
                    onClick={dismissPasswordSuccess}
                    className="shrink-0 rounded-md p-1 text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Dismiss"
                >
                    <FaTimes className="text-base" />
                </button>
            </div>
        )}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-20 h-20 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md`}>
                        <FaUser className="text-3xl" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-600">Welcome</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{user.name}</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Summary