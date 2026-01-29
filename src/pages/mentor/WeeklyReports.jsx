import { useState } from 'react';
import {
    BarChart3, Download, Users, Calendar, Filter,
    ChevronRight, ArrowRight, UserCircle, BookOpen,
    Clock, Search, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

const reportData = [
    { student: 'John Doe', rollNo: '2023CS01', week: 'Week 4', status: 'Submitted', progress: 85, date: '2026-01-23', courses: 'React, Node', remarks: 'Excellent progress in project.' },
    { student: 'John Doe', rollNo: '2023CS01', week: 'Week 3', status: 'Submitted', progress: 70, date: '2026-01-16', courses: 'React, JS', remarks: 'Good start on frontend.' },
    { student: 'Jane Smith', rollNo: '2023CS05', week: 'Week 4', status: 'Pending', progress: 40, date: '-', courses: 'Next.js', remarks: 'Needs to focus more on labs.' },
    { student: 'Jane Smith', rollNo: '2023CS05', week: 'Week 3', status: 'Submitted', progress: 38, date: '2026-01-15', courses: 'Next.js', remarks: 'Initial setup done.' },
    { student: 'Alex Johnson', rollNo: '2023CS12', week: 'Week 4', status: 'Submitted', progress: 65, date: '2026-01-23', courses: 'Solidity', remarks: 'Completed smart contracts.' },
    { student: 'Alex Johnson', rollNo: '2023CS12', week: 'Week 3', status: 'Submitted', progress: 50, date: '2026-01-16', courses: 'Blockchain Basics', remarks: 'Theory cleared.' },
];

export default function WeeklyReports() {
    const [mode, setMode] = useState('student'); // student or week
    const [searchTerm, setSearchTerm] = useState('');

    const downloadReport = () => {
        const ws = XLSX.utils.json_to_sheet(reportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Weekly Report");
        XLSX.writeFile(wb, `Mentor_Weekly_Report_${mode}.xlsx`);
    };

    // Segregation logic
    const groupedData = reportData.reduce((acc, current) => {
        const key = mode === 'student' ? current.student : current.week;
        if (!acc[key]) acc[key] = [];
        acc[key].push(current);
        return acc;
    }, {});

    const keys = Object.keys(groupedData).filter(k =>
        k.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Weekly Reports</h1>
                    <p className="text-muted-foreground">Manage and analyze your students' weekly performance data.</p>
                </div>
                <button
                    onClick={downloadReport}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
                >
                    <Download size={18} />
                    Export All Data
                </button>
            </header>

            {/* Segregation Mode Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => setMode('student')}
                    className={`group p-6 rounded-3xl border transition-all text-left flex items-start justify-between relative overflow-hidden ${mode === 'student' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:bg-muted'}`}
                >
                    <div className="z-10 relative">
                        <div className={`p-3 rounded-2xl mb-4 transition-colors ${mode === 'student' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground'}`}>
                            <Users size={24} />
                        </div>
                        <h3 className="text-lg font-bold">Student-wise Segregation</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">Group all weekly updates by individual student progress.</p>
                    </div>
                    {mode === 'student' && <motion.div layoutId="activeDot" className="w-1.5 h-full bg-primary absolute right-0 top-0" />}
                </button>

                <button
                    onClick={() => setMode('week')}
                    className={`group p-6 rounded-3xl border transition-all text-left flex items-start justify-between relative overflow-hidden ${mode === 'week' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:bg-muted'}`}
                >
                    <div className="z-10 relative">
                        <div className={`p-3 rounded-2xl mb-4 transition-colors ${mode === 'week' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground'}`}>
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-lg font-bold">Week-wise Segregation</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">Group all student updates for specific academic weeks.</p>
                    </div>
                    {mode === 'week' && <motion.div layoutId="activeDot" className="w-1.5 h-full bg-primary absolute right-0 top-0" />}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder={`Search by ${mode === 'student' ? 'student name' : 'week number'}...`}
                        className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold hover:bg-muted transition-all">
                    <Filter size={16} /> Filter Results
                </button>
            </div>

            {/* Segregated Content */}
            <div className="space-y-6">
                {keys.length > 0 ? (
                    keys.map((groupKey) => (
                        <div key={groupKey} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {mode === 'student' ? groupKey[0] : groupKey.slice(-1)}
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-lg">{groupKey}</h3>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                                            {groupedData[groupKey].length} Updates Recorded
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">Generate PDF</button>
                                    <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors border border-border">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-muted/10 text-[10px] font-extrabold uppercase text-muted-foreground tracking-[0.1em]">
                                        <tr>
                                            <th className="px-6 py-4">{mode === 'student' ? 'Week' : 'Student Name'}</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                            <th className="px-6 py-4">Progress</th>
                                            <th className="px-6 py-4">Current Courses</th>
                                            <th className="px-6 py-4">Submission Date</th>
                                            <th className="px-6 py-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {groupedData[groupKey].map((row, i) => (
                                            <tr key={i} className="hover:bg-muted/20 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {mode === 'student' ? (
                                                            <div className="flex items-center gap-1.5 p-1.5 bg-muted rounded-lg font-bold text-xs">
                                                                <Calendar size={14} className="text-primary" />
                                                                {row.week}
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-[8px] flex items-center justify-center font-bold">{row.student[0]}</div>
                                                                <span className="font-semibold text-sm">{row.student}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-extrabold tracking-tight ${row.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                                        {row.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between text-[10px] font-bold">
                                                            <span>{row.progress}%</span>
                                                        </div>
                                                        <div className="w-24 bg-muted rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className={`h-full ${row.progress > 70 ? 'bg-emerald-500' : 'bg-primary'}`}
                                                                style={{ width: `${row.progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-xs font-medium text-muted-foreground max-w-[150px] truncate">{row.courses}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-semibold text-muted-foreground">{row.date}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all group-hover:scale-110">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-card border border-border rounded-3xl border-dashed">
                        <div className="p-4 bg-muted rounded-full w-fit mx-auto mb-4 text-muted-foreground">
                            <Search size={32} />
                        </div>
                        <h3 className="text-lg font-bold">No reports found</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-2">Try adjusting your search or switching segregation modes.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
