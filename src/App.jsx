import { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AdminProvider } from "./context/AdminContext";
import { useAdmin } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import "./index.css";

// Kam tashrif buyuriladigan sahifalar (Admin) va og'ir kutubxonali sahifalar
// (Aloqa — leaflet xaritasi) faqat kerak bo'lganda alohida chunk sifatida yuklanadi.
const DrugsPage = lazy(() => import("./pages/DrugsPage"));
const DrugDetailPage = lazy(() => import("./pages/DrugDetailPage"));
const CompanyPage = lazy(() => import("./pages/CompanyPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const PageNotFaund = lazy(() => import("./pages/PageNotFaund"));

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAdmin();
  return isLoggedIn ? children : <Navigate to="/admin" replace />;
}

function Layout({ children }) {
  const location = useLocation();
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar />
      <main key={location.pathname} style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AdminProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Admin routes — Navbar/Footer yo'q */}
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Public routes */}
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/drugs" element={<DrugsPage />} />
                      <Route path="/drugs/:slug" element={<DrugDetailPage />} />
                      <Route path="/company" element={<CompanyPage />} />
                      <Route path="/news" element={<NewsPage />} />
                      <Route path="/partners" element={<PartnersPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                  </Layout>
                }
              />
              <Route path="*" element={<PageNotFaund />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AdminProvider>
    </AppProvider>
  );
}
