import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    if(!user) {
        navigate("/login")
    }

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 ml-64 bg-gray-100 h-screen">
                <Navbar />
                <Outlet />
            </div>
        </div>
    )
};

export default AdminDashboard;