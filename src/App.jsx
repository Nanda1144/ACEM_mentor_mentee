import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import StudentDashboard from './pages/student/Dashboard';
import WeeklyUpdate from './pages/student/WeeklyUpdate';
import StudentProfile from './pages/student/Profile';
import MyStudents from './pages/mentor/StudentsList';
import WeeklyReports from './pages/mentor/WeeklyReports';
import StudentEvents from './pages/student/StudentEvents';
import StudentAttendance from './pages/student/Attendance';
import Notifications from './pages/common/Notifications';
import MentorProfile from './pages/mentor/Profile';
import MentorDashboard from './pages/mentor/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<DashboardLayout />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/weekly" element={<WeeklyUpdate />} />
            <Route path="/student/events" element={<StudentEvents />} />
            <Route path="/student/attendance" element={<StudentAttendance />} />
            <Route path="/student/notifications" element={<Notifications />} />

            <Route path="/mentor" element={<MentorDashboard />} />
            <Route path="/mentor/students" element={<MyStudents />} />
            <Route path="/mentor/reports" element={<WeeklyReports />} />
            <Route path="/mentor/notifications" element={<Notifications />} />
            <Route path="/mentor/profile" element={<MentorProfile />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
