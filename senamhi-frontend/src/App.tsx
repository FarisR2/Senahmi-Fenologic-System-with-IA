import CreateStationPage from './pages/StationPage';
import CreateCultivePage from './pages/CultivePage';
import CreateFenologicPage from './pages/FenologicPage';
import CreateAnalyticPage from './pages/AnalyticPage';
import ChartPage from './pages/ChartPage';
import { TemperatureUploadPage } from './pages/TemperatureUploadPage';
import DashboardHome from './pages/DashboardHome';
import DashboardLayout from './components/Dashboard/DashboardLayout';
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
