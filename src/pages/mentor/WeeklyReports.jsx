import { useState, useMemo } from 'react';
import {
    BarChart3, Download, Users, Calendar, Filter,
    ChevronRight, ArrowRight, UserCircle, BookOpen,
    Clock, Search, MoreHorizontal, FileText, FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '../../context/AuthContext';

export default function WeeklyReports() {
    const { user, students } = useAuth();
    const [mode, setMode] = useState('student'); // student or week
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUpdate, setSelectedUpdate] = useState(null);

    // Only show reports for students assigned to this mentor
    const myMentees = useMemo(() =>
        students.filter(s => s.mentorId?.toLowerCase() === user?.id?.toLowerCase())
        , [students, user]);

    // Mock Data for Demo
    const mockReportData = [
        {
            student: 'Arjun Reddy',
            rollNo: '2023CS101',
            dept: 'Computer Science',
            year: '3rd Year',
            week: 'Week 4',
            weekNum: 4,
            status: 'Submitted',
            progress: 85,
            date: '2026-01-28',
            courses: 'React, Node.js',
            title: 'Implemented Authentication',
            description: 'Completed the login and registration modules using JWT.',
            id: 'mock-1'
        },
        {
            student: 'Priya Sharma',
            rollNo: '2023CS102',
            dept: 'Information Tech',
            year: '3rd Year',
            week: 'Week 4',
            weekNum: 4,
            status: 'Submitted',
            progress: 92,
            date: '2026-01-29',
            courses: 'Cloud Computing, AWS',
            title: 'Cloud Deployment',
            description: 'Successfully deployed the application container to AWS ECS.',
            id: 'mock-2'
        },
        {
            student: 'Rohan Gupta',
            rollNo: '2023CS103',
            dept: 'Computer Science',
            year: '2nd Year',
            week: 'Week 3',
            weekNum: 3,
            status: 'Pending',
            progress: 45,
            date: '2026-01-22',
            courses: 'Data Structures',
            title: 'Graphs and Trees',
            description: 'Working on implementing AVL trees in C++.',
            id: 'mock-3'
        },
        {
            student: 'Ananya Singh',
            rollNo: '2023CS104',
            dept: 'AI & DS',
            year: '3rd Year',
            week: 'Week 4',
            weekNum: 4,
            status: 'Submitted',
            progress: 78,
            date: '2026-01-30',
            courses: 'Machine Learning',
            title: 'Model Training',
            description: 'Trained the CNN model on the MNIST dataset with 98% accuracy.',
            id: 'mock-4'
        },
        {
            student: 'Karthik V',
            rollNo: '2023CS105',
            dept: 'Computer Science',
            year: '4th Year',
            week: 'Week 5',
            weekNum: 5,
            status: 'Submitted',
            progress: 100,
            date: '2026-01-30',
            courses: 'Final Year Project',
            title: 'Project Documentation',
            description: 'Finalized the SRS document and submitted for review.',
            id: 'mock-5'
        }
    ];

    // Flatten all weekly updates from all mentees and combine with mock data
    const allReports = useMemo(() => {
        const reports = [...mockReportData];

        myMentees.forEach(student => {
            if (student.weeklyUpdates && student.weeklyUpdates.length > 0) {
                student.weeklyUpdates.forEach(update => {
                    reports.push({
                        student: student.name,
                        rollNo: student.id,
                        dept: student.dept,
                        year: student.year,
                        week: `Week ${update.weekNumber}`,
                        weekNum: update.weekNumber,
                        status: 'Submitted',
                        progress: student.progress, // Using current student progress
                        date: update.timestamp ? new Date(update.timestamp).toLocaleDateString() : 'N/A',
                        courses: student.courses?.map(c => c.name).join(', ') || 'N/A',
                        title: update.title,
                        description: update.description,
                        id: student.id
                    });
                });
            }
        });
        // Sort by week number descending
        return reports.sort((a, b) => b.weekNum - a.weekNum);
    }, [myMentees]);

    const downloadExcel = () => {
        const exportData = allReports.map(r => ({
            'Student Name': r.student,
            'Roll Number': r.rollNo,
            'Department': r.dept,
            'Year': r.year,
            'Week': r.week,
            'Update Title': r.title,
            'Description': r.description,
            'Current Progress %': r.progress,
            'Submission Date': r.date,
            'Active Courses': r.courses
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Weekly Reports");
        XLSX.writeFile(wb, `Mentor_Weekly_Reports_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
    };

    const downloadPDF = () => {
        const doc = jsPDF();
        const dateStr = new Date().toLocaleString();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text(user?.collegeHeader || 'ST. JOSEPH INSTITUTE OF TECHNOLOGY', 105, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.text('Weekly Progress Summary Report', 105, 30, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`Mentor: ${user?.name}`, 20, 40);
        doc.text(`Staff ID: ${user?.mentorId}`, 20, 45);
        doc.text(`Generated on: ${dateStr}`, 140, 40);

        doc.setDrawColor(200, 200, 200);
        doc.line(20, 50, 190, 50);

        const tableColumn = ["Student", "Roll No", "Week", "Title", "Progress", "Date"];
        const tableRows = allReports.map(r => [
            r.student, r.rollNo, r.week, r.title, `${r.progress}%`, r.date
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 55,
            theme: 'striped',
            headStyles: { fillColor: [79, 70, 229] },
            styles: { fontSize: 8 },
        });

        doc.save(`Mentor_Weekly_Reports_${new Date().toLocaleDateString()}.pdf`);
    };

    const downloadSingleGroupPDF = (groupKey, groupData) => {
        const doc = new jsPDF();
        const dateStr = new Date().toLocaleString();

        doc.setFontSize(18);
        doc.text(user?.collegeHeader || 'ST. JOSEPH INSTITUTE OF TECHNOLOGY', 105, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.text(`${mode === 'student' ? 'Student' : 'Weekly'} Report: ${groupKey}`, 105, 30, { align: 'center' });

        const tableColumn = mode === 'student' ? ["Week", "Update Title", "Date", "Progress"] : ["Student", "Roll No", "Update Title", "Date"];
        const tableRows = groupData.map(r => mode === 'student' ?
            [r.week, r.title, r.date, `${r.progress}%`] :
            [r.student, r.rollNo, r.title, r.date]
        );

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] },
        });

        doc.save(`${groupKey}_Report.pdf`);
    };

    // Segregation logic
    const groupedData = allReports.reduce((acc, current) => {
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
                    <p className="text-muted-foreground">Manage and analyze your mentees' submitted weekly updates.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={downloadExcel}
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2"
                    >
                        <FileSpreadsheet size={18} />
                        Export Excel
                    </button>
                    <button
                        onClick={downloadPDF}
                        className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        <FileText size={18} />
                        Export PDF
                    </button>
                </div>
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
                                    <button
                                        onClick={() => downloadSingleGroupPDF(groupKey, groupedData[groupKey])}
                                        className="text-[11px] font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors flex items-center gap-2"
                                    >
                                        <Download size={14} />
                                        PDF
                                    </button>
                                    <button className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors border border-border">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-muted/10 text-[10px] font-extrabold uppercase text-muted-foreground tracking-[0.1em]">
                                        <tr>
                                            <th className="px-6 py-4">{mode === 'student' ? 'Week' : 'Student Name'}</th>
                                            <th className="px-6 py-4">Topic / Title</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                            <th className="px-6 py-4">Student Progress</th>
                                            <th className="px-6 py-4">Submission Date</th>
                                            <th className="px-6 py-4 text-right">View</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {groupedData[groupKey].map((row, i) => (
                                            <tr key={i} className="hover:bg-muted/20 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {mode === 'student' ? (
                                                            <div className="flex items-center gap-1.5 p-1.5 bg-muted rounded-lg font-bold text-xs text-primary">
                                                                <Calendar size={14} />
                                                                {row.week}
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-black">{row.student[0]}</div>
                                                                <div>
                                                                    <p className="font-bold text-sm leading-tight">{row.student}</p>
                                                                    <p className="text-[10px] text-muted-foreground font-bold">{row.rollNo}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="max-w-[200px]">
                                                        <p className="text-sm font-bold truncate">{row.title}</p>
                                                        <p className="text-[10px] text-muted-foreground truncate">{row.description}</p>
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
                                                            <span>{row.progress}% Overall</span>
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
                                                    <span className="text-xs font-semibold text-muted-foreground">{row.date}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setSelectedUpdate(row)}
                                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all group-hover:scale-110"
                                                    >
                                                        <ArrowRight size={18} />
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

            {/* Weekly Update Detail Modal */}
            <AnimatePresence>
                {selectedUpdate && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-background border border-border w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="relative h-32 bg-primary p-6 flex items-end">
                                <button
                                    onClick={() => setSelectedUpdate(null)}
                                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                                >
                                    <MoreHorizontal size={20} />
                                </button>
                                <div className="text-white">
                                    <h3 className="text-2xl font-black">{selectedUpdate.student}</h3>
                                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest">{selectedUpdate.week} Update</p>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Update Title</label>
                                    <p className="text-lg font-bold text-foreground">{selectedUpdate.title}</p>
                                </div>
                                <div className="p-6 bg-muted/30 rounded-3xl border border-border">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Description</label>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{selectedUpdate.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-muted/50">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Roll Number</p>
                                        <p className="font-bold text-sm">{selectedUpdate.rollNo}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/50">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Submission Date</p>
                                        <p className="font-bold text-sm">{selectedUpdate.date}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedUpdate(null)}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
