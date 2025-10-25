import React from 'react'
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
    const navigate = useNavigate()
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 text-red-500 mb-4">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Unauthorized
