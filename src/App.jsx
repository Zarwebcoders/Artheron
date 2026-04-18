import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import BuyToken from './pages/BuyToken'
import Dashboard from './pages/Dashboard'
import Staking from './pages/Staking'
import AdminOverview from './pages/admin/AdminOverview'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminSettings from './pages/admin/AdminSettings'
import AdminToken from './pages/admin/AdminToken'
import Login from './pages/Login'
import Register from './pages/Register'
import History from './pages/History'
import Profile from './pages/Profile'
import Withdraw from './pages/Withdraw'
import DashboardLayout from './components/DashboardLayout'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <div className="bg-[#0B0F1A] min-h-screen text-white overflow-x-hidden font-body">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Panel Routes */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/buy" element={<DashboardLayout><BuyToken /></DashboardLayout>} />
        <Route path="/staking" element={<DashboardLayout><Staking /></DashboardLayout>} />
        
        {/* Panel Pages */}
        <Route path="/history" element={<DashboardLayout><History /></DashboardLayout>} />
        <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
        <Route path="/withdraw" element={<DashboardLayout><Withdraw /></DashboardLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<DashboardLayout><AdminOverview /></DashboardLayout>} />
        <Route path="/admin/users" element={<DashboardLayout><AdminUsers /></DashboardLayout>} />
        <Route path="/admin/transactions" element={<DashboardLayout><AdminTransactions /></DashboardLayout>} />
        <Route path="/admin/settings" element={<DashboardLayout><AdminSettings /></DashboardLayout>} />
        <Route path="/admin/token" element={<DashboardLayout><AdminToken /></DashboardLayout>} />
      </Routes>
    </div>
  )
}

export default App
