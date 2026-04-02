import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BuyToken from './pages/BuyToken'
import Dashboard from './pages/Dashboard'
import Staking from './pages/Staking'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import Register from './pages/Register'
import History from './pages/History'
import Profile from './pages/Profile'
import Withdraw from './pages/Withdraw'
import DashboardLayout from './components/DashboardLayout'

function App() {
  return (
    <div className="bg-[#0B0F1A] min-h-screen text-white overflow-x-hidden font-body">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Panel Routes */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/buy" element={<DashboardLayout><BuyToken /></DashboardLayout>} />
        <Route path="/staking" element={<DashboardLayout><Staking /></DashboardLayout>} />
        
        {/* Panel Pages */}
        <Route path="/history" element={<DashboardLayout><History /></DashboardLayout>} />
        <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
        <Route path="/withdraw" element={<DashboardLayout><Withdraw /></DashboardLayout>} />

        {/* Admin Route */}
        <Route path="/admin" element={<DashboardLayout><AdminPanel /></DashboardLayout>} />
      </Routes>
    </div>
  )
}

export default App
