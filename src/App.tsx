import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.tsx';
import Footer from './components/layout/Footer.tsx';
import LandingPage from './pages/LandingPage.tsx';
import DonatePage from './pages/DonatePage.tsx';
import BrowsePage from './pages/BrowsePage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
