import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const UserContext = createContext()

const AuthContext = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const verifyUser = async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem("token")
                if(token) {
                    const response = await axios.get("http://localhost:3000/api/auth/verify", {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if(response.data.success) {
                        setUser(response.data.user)
                    } else {
                        setUser(null)
                        localStorage.removeItem("token")
                    }
                } else {
                    setUser(null)
                }
            } catch (error) {
                setUser(null)
                localStorage.removeItem("token")
            } finally {
                setLoading(false)
            }
        }
        verifyUser()
    }, [])

    const login = (user) => {
        setUser(user)
        setLoading(false)
    }

    const logout = () => {
        setUser(null)
        setLoading(false)
        localStorage.removeItem("token")
    }
    return (
        <UserContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export const useAuth = () => useContext(UserContext)
export default AuthContext