import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { BookOpen, Calendar, Clock, Trophy, ArrowUpRight, Code, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const skillData = [
    { name: 'Week 1', score: 40 },
    { name: 'Week 2', score: 55 },
    { name: 'Week 3', score: 48 },
    { name: 'Week 4', score: 70 },
];

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-card p-6 rounded-3xl border border-border flex flex-col justify-between shadow-sm"
    >
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl ${colorClass}`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <ArrowUpRight size={14} className="mr-1" />
                    {trend}
                </span>
            )}
        </div>
        <div className="mt-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{title}</p>
            <h3 className="text-3xl font-black mt-1">{value}</h3>
        </div>
    </motion.div>
);

export default function StudentDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight tracking-tighter">Student Hub</h1>
                    <p className="text-muted-foreground font-medium">Strategic overview of your academic and project lifecycle.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/student/weekly')}
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
                    >
                        Update Daily Logs
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Attendance"
                    value={`${user?.attendance || 0}%`}
                    icon={Calendar}
                    trend={user?.attendance > 90 ? "Optimal" : "Review"}
                    colorClass="bg-blue-500/10 text-blue-500"
                />
                <StatCard
                    title="Major Dept"
                    value={user?.dept || 'ENGG'}
                    icon={BookOpen}
                    colorClass="bg-purple-500/10 text-purple-500"
                />
                <StatCard
                    title="Project Progress"
                    value={`${user?.progress || 0}%`}
                    icon={Clock}
                    trend={`${user?.progress || 0}% Done`}
                    colorClass="bg-amber-500/10 text-amber-500"
                />
                <StatCard
                    title="Active Tasks"
                    value="08"
                    icon={Trophy}
                    colorClass="bg-emerald-500/10 text-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
                    <h3 className="text-lg font-black mb-6 uppercase tracking-widest">Skill Evolution Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={skillData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
                    <h3 className="text-lg font-black mb-6 uppercase tracking-widest">Active Focus</h3>
                    <div className="space-y-8">
                        <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm">
                                    <Code size={20} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Current Project</p>
                                    <h4 className="font-bold text-sm">{user?.currentProject || 'No Project Started'}</h4>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold">
                                    <span>Progress</span>
                                    <span>{user?.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${user?.progress || 0}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-secondary/5 rounded-3xl border border-border group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm">
                                    <Layout size={20} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Primary Tech Stack</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {(user?.technologies || 'N/A').split(',').map(tech => (
                                            <span key={tech} className="px-2 py-0.5 bg-white border border-border rounded-lg text-[10px] font-bold">{tech.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Notifications Header */}
                <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black uppercase tracking-widest">Global Broadcasts</h3>
                        <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-tighter">Last 90 Days</span>
                    </div>
                    <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2 no-scrollbar">
                        {user?.notifications && user.notifications.length > 0 ? (
                            [...user.notifications].reverse().map((note, idx) => (
                                <div key={idx} className="p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                                    <div className="flex justify-between items-start gap-3">
                                        <p className="text-sm font-bold text-foreground leading-snug">{note.message}</p>
                                        <span className="text-[8px] font-black uppercase text-muted-foreground shrink-0 mt-1">{new Date(note.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-[9px] font-black text-primary mt-2 uppercase tracking-widest">{note.type || 'System'}</p>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                <p className="text-sm text-muted-foreground italic">Your broadcast terminal is currently empty.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm flex flex-col">
                    <h3 className="text-lg font-black mb-6 uppercase tracking-widest">Academic Activity Feed</h3>
                    <div className="space-y-6 flex-1 overflow-y-auto max-h-[350px] pr-2 no-scrollbar">
                        {user?.activities && user.activities.length > 0 ? (
                            user.activities.slice().reverse().map((activity, idx) => (
                                <div key={idx} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${activity.type === 'event' ? 'bg-primary' :
                                        activity.type === 'achievement' ? 'bg-emerald-500' :
                                            activity.type === 'leave' ? 'bg-amber-500' : 'bg-blue-500'
                                        } shadow-sm`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-foreground">{activity.description}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black mt-0.5">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                <p className="text-sm text-muted-foreground italic">No activities recorded in your lifecycle yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
