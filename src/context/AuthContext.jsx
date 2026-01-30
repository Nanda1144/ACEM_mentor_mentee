import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    // Fetch students automatically if user is a mentor
    useEffect(() => {
        if (user?.role === 'mentor') {
            fetchStudents(user.id);
        }
    }, [user]);

    const fetchStudents = async (mentorId) => {
        try {
            const res = await axios.get(`${API_URL}/students/mentor/${mentorId}`);
            setStudents(res.data);
        } catch (err) {
            console.error('Error fetching students:', err);
        }
    };

    const login = async (role, credentials) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { ...credentials, role });
            setUser(res.data.user);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            return { success: true };
        } catch (err) {
            console.error('Login error:', err);
            return { success: false, msg: err.response?.data?.msg || 'Login failed' };
        }
    };

    const registerUser = async (userData) => {
        try {
            const res = await axios.post(`${API_URL}/auth/register`, userData);
            return { success: true, user: res.data.user };
        } catch (err) {
            console.error('Registration error:', err);
            return { success: false, msg: err.response?.data?.msg || 'Registration failed' };
        }
    };

    const updateStudentProgress = async (studentId, updates) => {
        try {
            const res = await axios.patch(`${API_URL}/students/${studentId}`, updates);
            // If the logged in user is the student, update local state
            if (user?.id === studentId) {
                const newUser = { ...user, ...res.data };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
            }
            // Refresh students list if mentor
            if (user?.role === 'mentor') {
                fetchStudents(user.id);
            }
            return { success: true };
        } catch (err) {
            console.error('Update error:', err);
            return { success: false };
        }
    };

    const updateUser = async (data) => {
        try {
            const rolePath = user?.role === 'student' ? 'students' : 'mentors';
            const res = await axios.patch(`${API_URL}/${rolePath}/${user.id}`, data);
            const newUser = { ...res.data, id: res.data.uid };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            return { success: true };
        } catch (err) {
            console.error('Profile update error:', err);
            return { success: false };
        }
    };

    const getMentorByUid = async (uid) => {
        try {
            const cleanUid = uid.toLowerCase().trim();
            const res = await axios.get(`${API_URL}/mentors/${cleanUid}`);
            return res.data;
        } catch (err) {
            console.error('Error fetching mentor:', err);
            return null;
        }
    };

    const addEvent = async (eventData) => {
        try {
            const res = await axios.post(`${API_URL}/students/${user.id}/events`, eventData);
            const newUser = { ...res.data, id: res.data.uid };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            return { success: true };
        } catch (err) {
            console.error('Error adding event:', err);
            return { success: false };
        }
    };

    const addAchievement = async (achievementData) => {
        try {
            const res = await axios.post(`${API_URL}/students/${user.id}/achievements`, achievementData);
            const newUser = { ...res.data, id: res.data.uid };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            return { success: true };
        } catch (err) {
            console.error('Error adding achievement:', err);
            return { success: false };
        }
    };

    const addLeave = async (leaveData) => {
        try {
            const res = await axios.post(`${API_URL}/students/${user.id}/leaves`, leaveData);
            const newUser = { ...res.data, id: res.data.uid };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            return { success: true };
        } catch (err) {
            console.error('Error adding leave:', err);
            return { success: false };
        }
    };

    const getMentorStats = async (mentorUid) => {
        try {
            const cleanUid = mentorUid.toLowerCase().trim();
            const res = await axios.get(`${API_URL}/students/mentor/${cleanUid}`);
            const studentsList = res.data;
            return {
                menteeCount: studentsList.length,
                reportsReviewed: studentsList.reduce((acc, curr) => acc + (curr.activities?.length || 0), 0)
            };
        } catch (err) {
            console.error('Error fetching mentor stats:', err);
            return { menteeCount: 0, reportsReviewed: 0 };
        }
    };

    const addWeeklyUpdate = async (updateData) => {
        try {
            const res = await axios.post(`${API_URL}/students/${user.id}/weekly-updates`, updateData);
            const newUser = { ...res.data, id: res.data.uid };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            return { success: true };
        } catch (err) {
            console.error('Error adding weekly update:', err);
            return { success: false };
        }
    };

    const addNotification = async (studentId, noteData) => {
        try {
            await axios.post(`${API_URL}/students/${studentId}/notifications`, noteData);
            return { success: true };
        } catch (err) {
            console.error('Error adding notification:', err);
            return { success: false };
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_URL}/students/${user.id}/notifications`);
            return res.data;
        } catch (err) {
            console.error('Error fetching notifications:', err);
            return [];
        }
    };

    const addDocument = async (docData) => {
        try {
            const res = await axios.post(`${API_URL}/students/${user.id}/documents`, docData);
            const newUser = { ...res.data, id: res.data.uid };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            return { success: true };
        } catch (err) {
            console.error('Error adding document:', err);
            return { success: false };
        }
    };

    const addProject = async (projectData) => {
        try {
            const res = await axios.post(`${API_URL}/students/${user.id}/projects`, projectData);
            const newUser = { ...res.data, id: res.data.uid };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            return { success: true };
        } catch (err) {
            console.error('Error adding project:', err);
            return { success: false };
        }
    };

    const addCourse = async (courseData) => {
        try {
            const res = await axios.post(`${API_URL}/students/${user.id}/courses`, courseData);
            const newUser = { ...res.data, id: res.data.uid };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            return { success: true };
        } catch (err) {
            console.error('Error adding course:', err);
            return { success: false };
        }
    };

    const addResearchPaper = async (paperData) => {
        try {
            const res = await axios.post(`${API_URL}/students/${user.id}/research-papers`, paperData);
            const newUser = { ...res.data, id: res.data.uid };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            return { success: true };
        } catch (err) {
            console.error('Error adding research paper:', err);
            return { success: false };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{
            user, login, logout, loading, updateUser,
            students, registerUser, updateStudentProgress,
            fetchStudents, getMentorByUid, addEvent, addAchievement,
            addLeave, getMentorStats, addWeeklyUpdate, addNotification,
            fetchNotifications, addDocument, addProject, addCourse, addResearchPaper
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
