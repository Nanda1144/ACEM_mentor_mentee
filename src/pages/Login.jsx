import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, User, ArrowRight, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [role, setRole] = useState('student');
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mentorId, setMentorId] = useState('');
    const { login, registerUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Handle guest account from landing page
    useEffect(() => {
        if (location.state?.guest) {
            handleGuestLogin();
        }
    }, [location.state]);

    const handleGuestLogin = async () => {
        // Simple guest login using demo credentials
        const guestId = role === 'student' ? '2023CS01' : 'M-55B2-2024';
        const guestPass = 'password123';

        const result = await login(role, { uid: guestId, password: guestPass });
        if (result.success) {
            navigate(role === 'student' ? '/student' : '/mentor');
        } else {
            alert('Guest account not available at the moment.');
        }
    };

    const handleAction = async (e) => {
        e.preventDefault();

        if (mode === 'register') {
            const userData = {
                uid: id,
                name: username || email.split('@')[0],
                email: email,
                password: password,
                mentorId: role === 'student' ? mentorId : undefined,
                role: role
            };

            const result = await registerUser(userData);
            if (result.success) {
                const finalUid = result.user.id;
                alert(`Registration successful! ${role === 'student' ? 'Linked to Mentor.' : 'Your Unique Staff ID is: ' + finalUid}`);
                const logResult = await login(role, { uid: finalUid, password: password });
                if (logResult.success) navigate(role === 'student' ? '/student' : '/mentor');
            } else {
                alert(result.msg);
            }
        } else {
            const result = await login(role, { uid: id, password: password });
            if (result.success) {
                navigate(role === 'student' ? '/student' : '/mentor');
            } else {
                alert(result.msg);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <button
                    onClick={() => navigate('/')}
                    className="mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group mx-auto"
                >
                    <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Back to Landing
                </button>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-xl shadow-primary/20">
                        <GraduationCap size={32} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">EduConnect</h1>
                    <p className="text-muted-foreground mt-2">Mentor-Mentee Management System</p>
                </div>

                <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl relative">
                    <div className="flex bg-muted rounded-xl p-1 mb-6">
                        <button
                            onClick={() => setRole('student')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${role === 'student' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => setRole('mentor')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${role === 'mentor' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Mentor
                        </button>
                    </div>

                    <h2 className="text-xl font-bold mb-6 text-center">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>

                    <form onSubmit={handleAction} className="space-y-4">
                        {mode === 'register' && (
                            <div className="space-y-4 mb-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">College Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="e.g. name@college.edu"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Username / Full Name</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">
                                {role === 'student' ? 'Roll Number / ID' : 'Staff ID (Leave blank to auto-generate)'}
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="text"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder={role === 'student' ? 'e.g. 2023CS01' : 'e.g. M-9982 (Optional)'}
                                    required={role === 'student' || mode === 'login'}
                                />
                            </div>
                        </div>

                        {mode === 'register' && role === 'student' && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Mentor Unique ID</label>
                                <input
                                    type="text"
                                    value={mentorId}
                                    onChange={(e) => setMentorId(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all border-dashed border-primary/40"
                                    placeholder="Enter your mentor's ID to join"
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 group mt-4 text-xs uppercase tracking-widest"
                        >
                            {mode === 'login' ? 'Sign In' : 'Register & Join'}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-bold px-2">
                            <span className="bg-card text-muted-foreground px-4">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGuestLogin}
                        className="w-full py-3 rounded-xl border border-border hover:bg-muted font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                    >
                        <UserCircle2 size={18} />
                        Guest Access
                    </button>

                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <button
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-xs font-black text-primary hover:underline uppercase tracking-widest"
                        >
                            {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
