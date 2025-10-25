import React from 'react'
import { useAuth } from '../context/authContext'
import { Navigate } from 'react-router-dom'

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth()
    
    if(loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg">Loading...</div>
        </div>
    }
    
    return user ? children : <Navigate to="/login" />
}

export default PrivateRoutes