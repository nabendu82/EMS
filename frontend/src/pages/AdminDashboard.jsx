import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const AdminDashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    if(!user) {
        navigate("/login")
    }
    return <h1>AdminDashboard {user && user.name}</h1>;
};

export default AdminDashboard;