import CreateStationPage from './pages/StationPage/StationPage';
import CreateCultivePage from './pages/CultivePage/CultivePage';
import CreateFenologicPage from './pages/FenologicPage/FenologicPage';
import CreateAnalyticPage from './pages/AnalyticPage/AnalyticPage';
import ChartPage from './pages/ChartPage/ChartPage';
import { TemperatureUploadPage } from './pages/TemperatureUploadPage/TemperatureUploadPage';
import DashboardHome from './pages/DashboardHome/DashboardHome';
import DashboardLayout from './components/Dashboard/DashboardLayout/DashboardLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/station" element={<CreateStationPage />} />
          <Route path="/cultive" element={<CreateCultivePage />} />
          <Route path="/fenologic" element={<CreateFenologicPage />} />
          <Route path="/temperature" element={<TemperatureUploadPage />} />
          <Route path="/analytic" element={<CreateAnalyticPage />} />
          <Route path="/create-analytic" element={<CreateAnalyticPage />} />
          <Route path="/chart" element={<ChartPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  )
}

export default App
