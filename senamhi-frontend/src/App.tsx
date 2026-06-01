import CreateStationPage from './pages/StationPage/StationPage';
import CreateCultivePage from './pages/CultivePage/CultivePage';
import CreateFenologicPage from './pages/FenologicPage/FenologicPage';
import CreateAnalyticPage from './pages/AnalyticPage/AnalyticPage';
import ChartPage from './pages/ChartPage/ChartPage';
import { TemperatureUploadPage } from './pages/TemperatureUploadPage/TemperatureUploadPage';
import DashboardHome from './pages/DashboardHome/DashboardHome';
import DashboardLayout from './components/Dashboard/DashboardLayout/DashboardLayout';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/station" element={<CreateStationPage />} />
            <Route path="/cultive" element={<CreateCultivePage />} />
            <Route path="/fenologic" element={<CreateFenologicPage />} />
            <Route path="/temperature" element={<TemperatureUploadPage />} />
            <Route path="/analytic" element={<CreateAnalyticPage />} />
            <Route path="/create-analytic" element={<CreateAnalyticPage />} />
            <Route path="/chart" element={<ChartPage />} />
          </Route>
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
