import { motion } from 'framer-motion';
import { Users, AlertCircle, Calendar, ArrowUpRight, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function MentorDashboard() {
    const { students } = useAuth();

    const stats = [
        {
            label: 'Total Mentees',
            val: students.length,
            icon: <Users size={24} />,
            color: 'bg-primary/10 text-primary',
            link: '/mentor/students'
        },
        {
            label: 'Reports Reviewed',
            val: students.reduce((acc, s) => acc + (s.activities?.length || 0), 0),
            icon: <BookOpen size={24} />,
            color: 'bg-blue-500/10 text-blue-500',
            link: '/mentor/reports'
        },
        {
            label: 'Low Attendance',
            val: students.filter(s => s.attendance < 80).length,
            icon: <AlertCircle size={24} />,
            color: 'bg-destructive/10 text-destructive',
            link: '/mentor/students'
        },
        {
            label: 'Active Projects',
            val: students.filter(s => s.progress > 0).length,
            icon: <CheckCircle2 size={24} />,
            color: 'bg-emerald-500/10 text-emerald-500',
            link: '/mentor/reports'
        }
    ];

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mentor Overview</h1>
                    <p className="text-muted-foreground">Strategic summary of your assigned mentees' performance.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm group hover:border-primary/20 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <Link to={stat.link} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <ArrowUpRight size={18} className="text-muted-foreground" />
                            </Link>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            <p className="text-4xl font-black mt-1">{stat.val}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity / Quick Reports */}
                <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="font-bold text-xl mb-6">Recent Student Updates</h3>
                    <div className="space-y-6">
                        {students.slice(0, 5).map((student, idx) => (
                            <div key={student.id} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center font-bold text-primary border border-primary/10">
                                    {student.name[0]}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm group-hover:text-primary transition-colors">{student.name}</p>
                                    <p className="text-xs text-muted-foreground">Updated progress to {student.progress}%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{student.lastUpdate ? new Date(student.lastUpdate).toLocaleDateString() : 'Today'}</p>
                                    <div className={`w-20 h-1 rounded-full bg-muted mt-1 overflow-hidden`}>
                                        <div className="h-full bg-primary" style={{ width: `${student.progress}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {students.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-10 italic">No assigned mentees available.</p>
                        )}
                    </div>
                </div>

                {/* Performance Outlook */}
                <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="font-bold text-xl mb-6">Attendance Outlook</h3>
                    <div className="space-y-6">
                        {students.filter(s => s.attendance < 85).map((student) => (
                            <div key={student.id} className="p-4 bg-muted/30 rounded-2xl flex items-center justify-between border border-transparent hover:border-destructive/20 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-destructive shadow-sm shadow-destructive/40" />
                                    <div>
                                        <p className="font-bold text-sm">{student.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{student.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-destructive">{student.attendance}%</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase italic px-2 py-0.5 bg-destructive/10 rounded-full inline-block">Action Required</p>
                                </div>
                            </div>
                        ))}
                        {students.filter(s => s.attendance < 85).length === 0 && (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={32} />
                                </div>
                                <p className="text-sm font-bold">Excellent!</p>
                                <p className="text-xs text-muted-foreground">All mentees have optimal attendance.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
