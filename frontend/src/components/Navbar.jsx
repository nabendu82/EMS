import React from 'react'
import { useAuth } from '../context/authContext'

const Navbar = () => {
    const { user, logout } = useAuth()

    return (
        <div className="bg-gray-800 shadow-md py-3 px-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <p className="text-lg font-bold text-white">Welcome, {user.name}</p>
                </div>
                <div className="flex items-center">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={logout}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Navbar