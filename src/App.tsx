import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

// Layouts
import AppShell from './components/layout/AppShell';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import TimeTracking from './pages/TimeTracking';
import Team from './pages/Team';
import Budget from './pages/Budget';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import DocumentList from './pages/Documents'; // Renamed import to avoid confusion if needed
import Documents from './pages/Documents';
import Clients from './pages/Clients';
import PortalLayout from './components/portal/PortalLayout';
import PortalDashboard from './pages/portal/PortalDashboard';
import PortalProjects from './pages/portal/PortalProjects';
import PortalInvoices from './pages/portal/PortalInvoices';
import PortalDocuments from './pages/portal/PortalDocuments';
import ClientLogin from './pages/portal/ClientLogin';

// Route Guards
function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const { currentUser, isClient } = useAuth();
  
  if (!currentUser) return <Navigate to="/login" />;
  
  // If user is client, they should only see portal (unless I add portal shell later)
  if (isClient && !window.location.pathname.startsWith('/portal')) {
     return <Navigate to="/portal" />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/client-login" element={<ClientLogin />} />
            
            {/* Private Agency Routes */}
            <Route path="/" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="time" element={<TimeTracking />} />
              <Route path="team" element={<Team />} />
              <Route path="budget" element={<Budget />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="reports" element={<Reports />} />
              <Route path="documents" element={<Documents />} />
              <Route path="clients" element={<Clients />} />
            </Route>

            {/* Portal Routes */}
            <Route path="/portal" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
              <Route index element={<PortalDashboard />} />
              <Route path="projects" element={<PortalProjects />} />
              <Route path="invoices" element={<PortalInvoices />} />
              <Route path="documents" element={<PortalDocuments />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
