import { useState, useEffect } from 'react';
import { Clock, Calendar as CalendarIcon, FileText, CheckCircle2, XCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function StudentAttendance() {
    const { user, addLeave } = useAuth();
    const [showApply, setShowApply] = useState(false);
    const [leaveRequests, setLeaveRequests] = useState(user?.leaves || []);
    const [leaveForm, setLeaveForm] = useState({
        type: 'Medical Leave',
        from: '',
        to: '',
        reason: ''
    });

    useEffect(() => {
        if (user?.leaves) setLeaveRequests(user.leaves);
    }, [user]);

    const attendanceData = [
        { month: 'Current Semester', percentage: user?.attendance || 0 },
        { month: 'Previous Record', percentage: Math.max(0, (user?.attendance || 0) - 2) },
    ];

    const handleApply = async (e) => {
        e.preventDefault();
        const res = await addLeave({
            reason: `${leaveForm.type}: ${leaveForm.reason}`,
            startDate: leaveForm.from,
            endDate: leaveForm.to
        });

        if (res.success) {
            alert('Leave application submitted successfully!');
            setShowApply(false);
            setLeaveForm({ type: 'Medical Leave', from: '', to: '', reason: '' });
        } else {
            alert('Failed to submit leave.');
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Attendance Ledger</h1>
                    <p className="text-muted-foreground">Official record of presence and sanctioned absences.</p>
                </div>
                <button
                    onClick={() => setShowApply(true)}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
                >
                    <Send size={16} />
                    Apply for Leave
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Attendance Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="text-lg font-black mb-6 uppercase tracking-widest">Global Status</h3>
                        <div className="space-y-6">
                            {attendanceData.map((item) => (
                                <div key={item.month} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-sm">{item.month}</span>
                                        <span className={`font-black text-lg ${item.percentage < 80 ? 'text-destructive' : 'text-primary'}`}>{item.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            className={`h-full ${item.percentage < 80 ? 'bg-destructive' : 'bg-primary'}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                            <p className="text-[10px] text-primary/60 uppercase font-black tracking-[0.2em]">Overall Standing</p>
                            <p className="text-4xl font-black text-primary mt-1">{user?.attendance || 0}%</p>
                            <p className="text-xs font-bold text-primary/60 mt-1">{user?.attendance >= 80 ? 'Eligible for Examination' : 'Attendance Shortage Warning'}</p>
                        </div>
                    </div>
                </div>

                {/* Leave Status */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-[2.5rem] shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-border bg-muted/20">
                            <h3 className="font-black text-lg uppercase tracking-widest">Sanctioned Leaves</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                                    <tr>
                                        <th className="px-8 py-5">Classification</th>
                                        <th className="px-8 py-5">Duration</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Reason Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {leaveRequests.map((leave, idx) => (
                                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <span className="font-bold text-sm">General Leave</span>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-muted-foreground font-bold">
                                                {leave.startDate} {leave.startDate !== leave.endDate ? `to ${leave.endDate}` : ''}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${leave.status === 'Approved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {leave.status === 'Approved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                                    {leave.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm max-w-xs truncate text-muted-foreground italic">"{leave.reason}"</td>
                                        </tr>
                                    ))}
                                    {leaveRequests.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-10 text-center text-sm text-muted-foreground italic">No leave history found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showApply && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl"
                    >
                        <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter">Permission Application</h2>
                        <form className="space-y-6" onSubmit={handleApply}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Leave Classification</label>
                                <select
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                    value={leaveForm.type}
                                    onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                                >
                                    <option>Medical Leave</option>
                                    <option>Personal Leave</option>
                                    <option>On Duty (OD) - Technical</option>
                                    <option>On Duty (OD) - Sports</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Range Start</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        value={leaveForm.from}
                                        onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Range End</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        value={leaveForm.to}
                                        onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Detailed Rationale</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl font-bold outline-none focus:ring-4 focus:ring-primary/10 min-h-[120px] resize-none transition-all placeholder:font-normal"
                                    placeholder="Provide necessary details for verification..."
                                    value={leaveForm.reason}
                                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-4 mt-10">
                                <button type="button" onClick={() => setShowApply(false)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest text-muted-foreground hover:bg-muted rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 font-black text-xs uppercase tracking-widest bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all">Transmit Data</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
