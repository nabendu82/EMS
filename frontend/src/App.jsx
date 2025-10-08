import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import AuthContext from './context/authContext.jsx'

function App() {
  return (
      <BrowserRouter>
        <AuthContext>
          <Routes>
            <Route path="/" element={<Navigate to="/admin-dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          </Routes>
        </AuthContext>
      </BrowserRouter>
  )
}

export default App
