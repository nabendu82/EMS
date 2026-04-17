import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { FaUserEdit, FaEye, FaEyeSlash } from 'react-icons/fa'

const Settings = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [settings, setSettings] = useState({
        userId: user._id,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [error, setError] = useState(null)
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    })

    const toggleShowPassword = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
    }
    const handleChange = (e) => {
        if (error) setError(null)
        setSettings({ ...settings, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        if(settings.newPassword !== settings.confirmPassword) {
            setError('Passwords do not match')
            return
        }
        try {
            const response = await axios.put(`http://localhost:3000/api/settings/change-password`, settings, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            if(response.data.success) {
                navigate('/employee-dashboard', { state: { passwordChanged: true } })
            }
        }
        catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                'Failed to change password'
            setError(message)
        }
    }

    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-lg">
                            <FaUserEdit className="text-2xl" />
                        </div>
                    </div>
                </div>
                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="oldPassword" className="block text-sm font-semibold text-gray-700">Old Password <span className="text-red-500">*</span> </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.oldPassword ? 'text' : 'password'}
                                    id="oldPassword"
                                    name="oldPassword"
                                    value={settings.oldPassword}
                                    onChange={handleChange}
                                    placeholder="Enter old password..."
                                    required
                                    className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 hover:border-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShowPassword('oldPassword')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
                                    aria-label={showPasswords.oldPassword ? 'Hide old password' : 'Show old password'}
                                >{showPasswords.oldPassword ? <FaEyeSlash /> : <FaEye />}</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">New Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type={showPasswords.newPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    value={settings.newPassword}
                                    onChange={handleChange}
                                    placeholder="Enter new password..."
                                    required
                                    className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 hover:border-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShowPassword('newPassword')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
                                    aria-label={showPasswords.newPassword ? 'Hide new password' : 'Show new password'}
                                >{showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={settings.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password..."
                                    required
                                    className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 hover:border-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShowPassword('confirmPassword')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
                                    aria-label={showPasswords.confirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                >
                                    {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">Change Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Settings