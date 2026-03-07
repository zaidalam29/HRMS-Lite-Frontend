import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { Dashboard } from './pages/Dashboard';
import { EmployeesPage } from './pages/EmployeesPage';
import { AttendancePage } from './pages/AttendancePage';
import { EmployeeDetailsPage } from './pages/EmployeeDetailsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;