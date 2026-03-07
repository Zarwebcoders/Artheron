import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

import BuyToken from './pages/BuyToken'
import Dashboard from './pages/Dashboard'
import Staking from './pages/Staking'
import AdminPanel from './pages/AdminPanel'

function App() {
  return (
    <div className="bg-[#0B0F1A] min-h-screen text-white overflow-x-hidden font-body">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<BuyToken />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/staking" element={<Staking />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </div>
  )
}

export default App
