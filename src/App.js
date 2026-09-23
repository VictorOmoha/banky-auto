import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ContactProvider } from './components/ContactSheet';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import VehicleDetail from './pages/VehicleDetail';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import HelpCenter from './pages/HelpCenter';
import Careers from './pages/Careers';
import NotFound from './pages/NotFound';

// The owner's admin portal is loaded only when someone visits /admin.
const AdminApp = lazy(() => import('./admin/AdminApp'));

// Old links used /inventory/... — send them to the matching /vehicles page.
function LegacyVehicleRedirect() {
  const { id } = useParams();
  return <Navigate to={`/vehicles/${id}`} replace />;
}

function PublicSite() {
  return (
    <ContactProvider>
      <div className="app">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Inventory />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />
            <Route path="/inventory" element={<Navigate to="/vehicles" replace />} />
            <Route path="/inventory/:id" element={<LegacyVehicleRedirect />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/login" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ContactProvider>
  );
}

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div className="admin-center" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
                  Loading admin…
                </div>
              }
            >
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<PublicSite />} />
      </Routes>
    </Router>
  );
}

export default App;
