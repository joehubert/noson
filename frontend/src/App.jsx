import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import PrivateRoute from './components/Auth/PrivateRoute'
import LoginPage from './pages/LoginPage'
import AuthSuccessPage from './pages/AuthSuccessPage'
import DashboardPage from './pages/DashboardPage'
import DevicesPage from './pages/DevicesPage'
import ServicesPage from './pages/ServicesPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/services" element={<ServicesPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
