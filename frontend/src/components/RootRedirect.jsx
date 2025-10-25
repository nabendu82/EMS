import React from 'react'
import { useAuth } from '../context/authContext'
import { Navigate } from 'react-router-dom'

const RootRedirect = () => {
    const { user, loading } = useAuth()
    
    if(loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-lg text-gray-600">Loading...</div>
                </div>
            </div>
        )
    }
    
    if(!user) {
        return <Navigate to="/login" />
    }
    
    // Redirect based on user role
    if(user.role === 'admin') {
        return <Navigate to="/admin-dashboard" />
    } else {
        return <Navigate to="/employee-dashboard" />
    }
}

export default RootRedirect
