import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserContext = createContext()

const AuthContext = ({ children }) => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const token = localStorage.getItem("token")
                if(!token) {
                    navigate("/login")
                }
                const response = await axios.get("http://localhost:3000/api/auth/verify", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if(response.data.success) {
                    setUser(response.data.user)
                }
            } catch (error) {
                if(error.response && !error.response.data.error) {
                    navigate("/login")
                }
            }
        }
        verifyUser()
    }, [])

    const login = user => setUser(user)

    const logout = () => {
        setUser(null)
        localStorage.removeItem("token")
    }
    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export const useAuth = () => useContext(UserContext)
export default AuthContext