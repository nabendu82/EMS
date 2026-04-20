import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import Unauthorized from './pages/Unauthorized'
import AuthContext from './context/authContext.jsx'
import PrivateRoutes from './utils/PrivateRoutes.jsx'
import RoleRoutes from './utils/RoleRoutes.jsx'
import RootRedirect from './components/RootRedirect.jsx'
import AdminSummary from './components/AdminSummary.jsx'
import DepartmentList from './components/DepartmentList.jsx'
import AddDepartment from './components/AddDepartment.jsx'
import EditDepartment from './components/EditDepartment.jsx'
import EmployeeList from './components/EmployeeList.jsx'
import AddEmployee from './components/AddEmployee.jsx'
import ViewEmployee from './components/ViewEmployee.jsx'
import EditEmployee from './components/EditEmployee.jsx'
import SalaryList from './components/SalaryList.jsx'
import Summary from './components/Summary.jsx'
import LeaveList from './components/LeaveList.jsx'
import AddLeave from './components/AddLeave.jsx'
import ViewSalary from './components/ViewSalary.jsx'
import Settings from './components/Settings.jsx'
import AdminLeaveList from './components/AdminLeaveList.jsx'
import LeaveDetails from './components/LeaveDetails.jsx'
import EmployeeLeaveList from './components/EmployeeLeaveList.jsx'

function App() {
  return (
      <BrowserRouter>
        <AuthContext>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/admin-dashboard" element={
              <PrivateRoutes>
                <RoleRoutes roles={["admin"]}>
                  <AdminDashboard />
                </RoleRoutes>
              </PrivateRoutes>
            }>
              <Route index element={<AdminSummary />} />
              <Route path="/admin-dashboard/departments" element={<DepartmentList />} />
              <Route path="/admin-dashboard/add-department" element={<AddDepartment />} />
              <Route path="/admin-dashboard/department/:id" element={<EditDepartment />} />
              <Route path="/admin-dashboard/employees" element={<EmployeeList />} />
              <Route path="/admin-dashboard/add-employee" element={<AddEmployee />} />
              <Route path="/admin-dashboard/employees/:id" element={<ViewEmployee />} />
              <Route path="/admin-dashboard/employees/edit/:id" element={<EditEmployee />} />
              <Route path="/admin-dashboard/employees/leaves/:id" element={<EmployeeLeaveList />} />
              <Route path="/admin-dashboard/salaries" element={<SalaryList />} />
              <Route path="/admin-dashboard/leaves/:id" element={<LeaveDetails />} />
              <Route path="/admin-dashboard/leaves" element={<AdminLeaveList />} />
              <Route path="/admin-dashboard/settings" element={<Settings />} />
            </Route>
            <Route path="/employee-dashboard" element={
              <PrivateRoutes>
                <RoleRoutes roles={["admin", "employee"]}>
                  <EmployeeDashboard />
                </RoleRoutes>
              </PrivateRoutes>
            }>
              <Route index element={<Summary />} />
              <Route path="/employee-dashboard/profile/:id" element={<ViewEmployee />} />
              <Route path="/employee-dashboard/leaves/:id" element={<LeaveDetails />} />
              <Route path="/employee-dashboard/leaves" element={<LeaveList />} />
              <Route path="/employee-dashboard/add-leave" element={<AddLeave />} />
              <Route path="/employee-dashboard/salaries/:id" element={<ViewSalary />} />
              <Route path="/employee-dashboard/settings" element={<Settings />} />
            </Route>
          </Routes>
        </AuthContext>
      </BrowserRouter>
  )
}

export default App
