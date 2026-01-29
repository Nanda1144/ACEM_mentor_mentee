import { useState } from 'react';
import {
    Search, Filter, Download, User, ArrowRight, ExternalLink,
    Send, X, Calendar, BookOpen, Clock, Award, ShieldCheck, FileText,
    Building, Camera, Mail, Phone, GraduationCap, BadgeCheck, Code, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function MyStudents() {
    const { user, students, addNotification } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [notifTarget, setNotifTarget] = useState(null);
    const [notifText, setNotifText] = useState('');
    const [showExportPreview, setShowExportPreview] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Only show students assigned to this mentor
    const myMentees = students.filter(s => s.mentorId?.toLowerCase() === user?.id?.toLowerCase());

    const filteredStudents = myMentees.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Mentee Progress Report');
        const dateStr = new Date().toLocaleDateString();

        // 1. Add Logo if exists
        if (user?.collegeLogo) {
            try {
                const base64Data = user.collegeLogo.split(',')[1];
                const imageId = workbook.addImage({
                    base64: base64Data,
                    extension: 'png',
                });

                // Position logo in first few rows
                worksheet.addImage(imageId, {
                    tl: { col: 0, row: 0 },
                    ext: { width: 80, height: 80 }
                });

                // Add some empty rows for the logo
                for (let i = 0; i < 5; i++) worksheet.addRow([]);
            } catch (err) {
                console.error("Error adding logo to Excel:", err);
            }
        }

        // 2. Add Branding Header
        const headerRow = worksheet.addRow([user?.collegeHeader || 'ST. JOSEPH INSTITUTE OF TECHNOLOGY']);
        headerRow.font = { name: 'Arial Black', size: 16 };
        worksheet.addRow([]); // Gap

        // 3. Add Metadata
        worksheet.addRow(['Mentor Name:', user?.name || 'Dr. Sarah Wilson', 'Mentor ID:', user?.mentorId || 'M-55B2-2024']);
        worksheet.addRow(['Department:', user?.department || 'Computer Science', 'Report Date:', dateStr]);
        worksheet.addRow([]); // Gap

        // 4. Add Table headers
        const tableHeader = ['Student ID', 'Student Name', 'Department', 'Year', 'Progress %', 'Attendance %', 'Last Update', 'Email'];
        const headerFields = worksheet.addRow(tableHeader);
        headerFields.eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E7FF' } // Light indigo
            };
        });

        // 5. Add Student Data
        filteredStudents.forEach(s => {
            worksheet.addRow([
                s.id, s.name, s.dept, s.year, s.progress, s.attendance,
                s.lastUpdate ? new Date(s.lastUpdate).toLocaleDateString() : 'N/A',
                s.email
            ]);
        });

        // 6. Final Polish
        worksheet.getColumn(1).width = 15;
        worksheet.getColumn(2).width = 25;
        worksheet.getColumn(3).width = 20;
        worksheet.getColumn(7).width = 20;
        worksheet.getColumn(8).width = 30;

        // 7. Save File
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Mentee_Report_${dateStr.replace(/\//g, '-')}.xlsx`);
    };

    const downloadDocumentation = () => {
        const doc = new jsPDF();
        const dateStr = new Date().toLocaleString();
        let currentY = 15;

        if (user?.collegeLogo) {
            doc.addImage(user.collegeLogo, 'PNG', 15, currentY, 20, 20);
        }

        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.setFont(undefined, 'bold');
        doc.text(user?.collegeHeader || 'ST. JOSEPH INSTITUTE OF TECHNOLOGY', 105, currentY + 12, { align: 'center' });

        currentY += 25;
        doc.setDrawColor(200, 200, 200);
        doc.line(20, currentY, 190, currentY);

        currentY += 10;
        doc.setFontSize(10);
        doc.text(`Mentor: ${user?.name || 'Dr. Sarah Wilson'}`, 20, currentY);
        doc.text(`Staff ID: ${user?.mentorId || 'M-55B2-2024'}`, 20, currentY + 5);
        doc.text(`Mentor Progress Updation Date: ${dateStr}`, 130, currentY);

        const tableColumn = ["ID", "Student Name", "Year", "Attendance", "Progress %", "Last Update"];
        const tableRows = filteredStudents.map(s => [
            s.id, s.name, s.year, `${s.attendance}%`, `${s.progress}%`,
            s.lastUpdate ? new Date(s.lastUpdate).toLocaleDateString() : 'N/A'
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: currentY + 15,
            theme: 'striped',
            headStyles: { fillStyle: 'f', fillColor: [79, 70, 229] },
        });

        doc.save(`Mentee_Documentation_${dateStr.split(',')[0].trim()}.pdf`);
    };

    const downloadSingleStudentPDF = (student) => {
        const doc = new jsPDF();
        const dateStr = new Date().toLocaleString();
        let currentY = 15;

        if (user?.collegeLogo) {
            doc.addImage(user.collegeLogo, 'PNG', 15, currentY, 20, 20);
        }
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.setFont(undefined, 'bold');
        doc.text(user?.collegeHeader || 'ST. JOSEPH INSTITUTE OF TECHNOLOGY', 105, currentY + 12, { align: 'center' });

        currentY += 25;
        doc.setDrawColor(200, 200, 200);
        doc.line(20, currentY, 190, currentY);

        currentY += 15;
        doc.setFontSize(16);
        doc.setTextColor(79, 70, 229);
        doc.text(`Individual Mentee Progress Report`, 105, currentY, { align: 'center' });

        currentY += 15;
        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);

        doc.setFont(undefined, 'bold');
        doc.text(`Student Name:`, 20, currentY);
        doc.setFont(undefined, 'normal');
        doc.text(student.name, 50, currentY);

        doc.setFont(undefined, 'bold');
        doc.text(`Roll Number:`, 110, currentY);
        doc.setFont(undefined, 'normal');
        doc.text(student.id, 140, currentY);

        currentY += 10;
        doc.setFont(undefined, 'bold');
        doc.text(`Department:`, 20, currentY);
        doc.setFont(undefined, 'normal');
        doc.text(student.dept, 50, currentY);

        doc.setFont(undefined, 'bold');
        doc.text(`Year of Study:`, 110, currentY);
        doc.setFont(undefined, 'normal');
        doc.text(student.year, 140, currentY);

        currentY += 15;
        doc.setDrawColor(240, 240, 240);
        doc.line(20, currentY, 190, currentY);

        currentY += 15;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Performance & Activity Summary`, 20, currentY);

        currentY += 10;
        const bodyContent = [
            ['Current Progress', `${student.progress}%`],
            ['Attendance Status', `${student.attendance}%`],
            ['Last Update Recorded', student.lastUpdate ? new Date(student.lastUpdate).toLocaleDateString() : 'N/A'],
            ['Active Project', student.currentProject || 'N/A'],
            ['Specializations', student.technologies || 'N/A'],
            ['Email ID', student.email],
            ['Contact Number', student.phone || 'N/A']
        ];

        doc.autoTable({
            body: bodyContent,
            startY: currentY,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 5 },
            columnStyles: { 0: { fontStyle: 'bold', fillColor: [250, 250, 250], width: 60 } }
        });

        currentY = doc.lastAutoTable.finalY + 30;

        doc.setFontSize(10);
        doc.text(`__________________________`, 130, currentY);
        doc.text(`Signature of Mentor`, 135, currentY + 7);
        doc.text(`(Verified on: ${dateStr.split(',')[0]})`, 135, currentY + 12);

        doc.save(`Student_Report_${student.id}.pdf`);
    };


    const handleSendNotification = async (e) => {
        e.preventDefault();
        const notificationData = {
            message: notifText,
            type: 'info'
        };

        if (notifTarget.id === 'ALL') {
            const promises = myMentees.map(s => addNotification(s.id, notificationData));
            await Promise.all(promises);
            alert(`Notification sent to all ${myMentees.length} mentees.`);
        } else {
            const res = await addNotification(notifTarget.id, notificationData);
            if (res.success) {
                alert(`Notification sent to ${notifTarget.name}.`);
            } else {
                alert('Failed to send notification.');
            }
        }

        setNotifTarget(null);
        setNotifText('');
    };

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
                    <p className="text-muted-foreground">Detailed overview of your assigned mentees.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setNotifTarget({ name: 'All Assigned Students', id: 'ALL' })}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-semibold shadow-lg shadow-primary/20"
                    >
                        <Send size={18} />
                        Bulk Notify
                    </button>
                    <button
                        onClick={() => setShowExportPreview(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary bg-primary/5 text-primary hover:bg-primary/10 transition-all font-bold shadow-sm"
                    >
                        <FileText size={18} />
                        Preview & Export Report
                    </button>
                </div>
            </header>

            <div className="bg-card border border-border p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-all">
                        <Filter size={18} />
                        Advanced
                    </button>
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student Name</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">ID</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Attendance</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Progress</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedStudent(student)}
                                            className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
                                        >
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-border">
                                                    {student.photo ? (
                                                        <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        student.name[0]
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">{student.name}</p>
                                                    {student.lastUpdate && (new Date() - new Date(student.lastUpdate)) < 86400000 && (
                                                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Updated</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground uppercase">{student.year}</p>
                                            </div>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">{student.id}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-bold ${student.attendance < 80 ? 'text-destructive' : 'text-emerald-500'}`}>
                                            {student.attendance}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full ${student.progress > 70 ? 'bg-emerald-500' : student.progress > 40 ? 'bg-primary' : 'bg-amber-500'}`}
                                                    style={{ width: `${student.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground">{student.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setNotifTarget(student)}
                                                className="p-2 text-muted-foreground hover:text-primary transition-all rounded-lg hover:bg-primary/10"
                                                title="Send Notification"
                                            >
                                                <Send size={18} />
                                            </button>
                                            <button
                                                onClick={() => setSelectedStudent(student)}
                                                className="p-2 text-muted-foreground hover:text-primary transition-all rounded-lg hover:bg-primary/10"
                                                title="View Full Profile"
                                            >
                                                <ExternalLink size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Student Detail View */}
            <AnimatePresence>
                {selectedStudent && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-end">
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-2xl h-full bg-background shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="relative h-48 bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-8 flex items-end overflow-hidden flex-shrink-0">
                                <div className="absolute top-6 right-6 flex gap-2">
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                                <div className="relative flex items-center gap-6 z-10">
                                    <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-2xl transform hover:scale-105 transition-transform">
                                        <div className="w-full h-full rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary font-black text-3xl overflow-hidden">
                                            {selectedStudent.photo ? (
                                                <img src={selectedStudent.photo} alt={selectedStudent.name} className="w-full h-full object-cover" />
                                            ) : (
                                                selectedStudent.name[0]
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-white">
                                        <h3 className="text-3xl font-black tracking-tight">{selectedStudent.name}</h3>
                                        <div className="flex items-center gap-2 mt-1 opacity-90">
                                            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">{selectedStudent.id}</span>
                                            <span className="w-1 h-1 bg-white/40 rounded-full" />
                                            <span className="text-xs font-bold opacity-80 uppercase tracking-widest">{selectedStudent.year}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border-b border-border px-8 flex-shrink-0">
                                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                                    {['overview', 'projects', 'leaves', 'activity'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`relative py-5 text-sm font-bold uppercase tracking-widest transition-colors flex-shrink-0 ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <motion.div
                                                    layoutId="modalTab"
                                                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 bg-muted/20">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'overview' && (
                                        <motion.div
                                            key="overview"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 rounded-[2rem] bg-card border border-border shadow-sm group hover:border-primary/20 transition-all">
                                                    <Mail className="text-primary mb-3" size={20} />
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Email Address</p>
                                                    <p className="font-bold text-sm truncate">{selectedStudent.email}</p>
                                                </div>
                                                <div className="p-6 rounded-[2rem] bg-card border border-border shadow-sm group hover:border-primary/20 transition-all">
                                                    <Phone className="text-primary mb-3" size={20} />
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Contact Phone</p>
                                                    <p className="font-bold text-sm">{selectedStudent.phone || 'N/A'}</p>
                                                </div>
                                                <div className="md:col-span-2 p-6 rounded-[2rem] bg-card border border-border shadow-sm group hover:border-primary/20 transition-all">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <GraduationCap className="text-primary mb-3" size={20} />
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Department</p>
                                                            <p className="font-bold text-lg">{selectedStudent.dept}</p>
                                                        </div>
                                                        <div className="bg-primary/5 p-4 rounded-2xl flex flex-col items-center">
                                                            <p className="text-[10px] font-bold text-primary uppercase mb-1">Attendance</p>
                                                            <p className={`text-2xl font-black ${selectedStudent.attendance > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>{selectedStudent.attendance}%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-card to-muted border border-border shadow-sm">
                                                <h4 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <BadgeCheck size={18} className="text-primary" />
                                                    Academic Skills Profile
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {(selectedStudent.skills || 'Self Learning, Communication').split(',').map(skill => (
                                                        <span key={skill} className="px-4 py-2 bg-white border border-border rounded-xl text-xs font-bold shadow-sm hover:border-primary/30 transition-colors">
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'projects' && (
                                        <motion.div
                                            key="projects"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-sm relative overflow-hidden group">
                                                <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                                        <Code size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-xl">{selectedStudent.currentProject || 'Research Project Alpha'}</h4>
                                                        <p className="text-xs text-muted-foreground font-bold">Active Module Implementation</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                            <span>Project Completion</span>
                                                            <span>{selectedStudent.progress}%</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-indigo-500 rounded-full"
                                                                style={{ width: `${selectedStudent.progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Core Technologies</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(selectedStudent.technologies || 'React, Node, MongoDB').split(',').map(tech => (
                                                                <span key={tech} className="px-3 py-1 bg-muted text-muted-foreground rounded-lg text-[10px] font-black uppercase">
                                                                    {tech.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'leaves' && (
                                        <motion.div
                                            key="leaves"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-card border border-border rounded-[2rem] overflow-hidden">
                                                <table className="w-full text-left text-xs">
                                                    <thead className="bg-muted/50 border-b border-border">
                                                        <tr>
                                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-muted-foreground">Reason</th>
                                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-muted-foreground">Duration</th>
                                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border">
                                                        {(selectedStudent.leaves || []).map((leave, i) => (
                                                            <tr key={i}>
                                                                <td className="px-6 py-4 font-bold">{leave.reason}</td>
                                                                <td className="px-6 py-4 text-muted-foreground uppercase">{leave.startDate} - {leave.endDate}</td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                                                        {leave.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {(!selectedStudent.leaves || selectedStudent.leaves.length === 0) && (
                                                            <tr>
                                                                <td colSpan="3" className="px-6 py-8 text-center text-muted-foreground font-bold italic">No leave requests found.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'activity' && (
                                        <motion.div
                                            key="activity"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-card border border-border rounded-[2rem] p-6">
                                                <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Live Activity Log</h4>
                                                <div className="space-y-6">
                                                    {(selectedStudent.activities || []).slice().reverse().map((act, i) => (
                                                        <div key={i} className="relative pl-6 border-l-2 border-primary/20 pb-4">
                                                            <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary" />
                                                            <p className="text-[10px] font-bold text-primary uppercase">{new Date(act.timestamp).toLocaleString()}</p>
                                                            <p className="text-sm font-bold mt-0.5">{act.description}</p>
                                                            <span className="text-[9px] font-black text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded ml-auto mt-2 inline-block">
                                                                {act.type}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {(!selectedStudent.activities || selectedStudent.activities.length === 0) && (
                                                        <p className="text-center text-muted-foreground font-bold italic py-10">No recent activities recorded.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="p-8 bg-card border-t border-border flex gap-4 flex-shrink-0">
                                <button
                                    onClick={() => downloadSingleStudentPDF(selectedStudent)}
                                    className="flex-1 py-4 bg-muted hover:bg-muted/80 text-foreground font-black text-sm uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 border border-border group"
                                >
                                    <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                                    Download Report
                                </button>
                                <button
                                    onClick={() => setNotifTarget(selectedStudent)}
                                    className="flex-[1.5] py-4 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <Send size={18} />
                                    Send Message
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showExportPreview && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[120] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-background border border-border w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                                <div>
                                    <h3 className="text-xl font-bold">Report Preview</h3>
                                    <p className="text-xs text-muted-foreground">Review document branding and data before saving.</p>
                                </div>
                                <button onClick={() => setShowExportPreview(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 bg-white text-black">
                                <div className="flex items-center gap-8 mb-10 border-b-2 border-slate-100 pb-8">
                                    <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                                        {user?.collegeLogo ? (
                                            <img src={user.collegeLogo} className="w-full h-full object-contain" />
                                        ) : (
                                            <Building size={32} className="text-slate-200" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-black tracking-tight text-slate-800">{user?.collegeHeader || 'ST. JOSEPH INSTITUTE OF TECHNOLOGY'}</h2>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Official Mentee Progress Report</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-4 mb-10 text-sm">
                                    <div className="flex gap-2">
                                        <span className="font-bold text-slate-500 uppercase text-[10px] w-24">Mentor:</span>
                                        <span className="font-bold underline decoration-2 underline-offset-4">{user?.name || 'Dr. Sarah Wilson'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold text-slate-500 uppercase text-[10px] w-40">Date:</span>
                                        <span className="font-bold">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold text-slate-500 uppercase text-[10px] w-24">Staff ID:</span>
                                        <span className="font-bold">{user?.mentorId || 'M-55B2-2024'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold text-slate-500 uppercase text-[10px] w-40">Department:</span>
                                        <span className="font-bold">{user?.department || 'Computer Science'}</span>
                                    </div>
                                </div>

                                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-[11px] text-left">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-3 font-bold text-slate-700">Student ID</th>
                                                <th className="px-4 py-3 font-bold text-slate-700">Name</th>
                                                <th className="px-4 py-3 font-bold text-slate-700 text-center">Year</th>
                                                <th className="px-4 py-3 font-bold text-slate-700 text-right">Progress</th>
                                                <th className="px-4 py-3 font-bold text-slate-700 text-right">Attendance</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 italic">
                                            {filteredStudents.map(s => (
                                                <tr key={s.id}>
                                                    <td className="px-4 py-3 font-medium text-slate-600">{s.id}</td>
                                                    <td className="px-4 py-3 font-bold">{s.name}</td>
                                                    <td className="px-4 py-3 text-center">{s.year}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-indigo-600">{s.progress}%</td>
                                                    <td className="px-4 py-3 text-right font-bold text-emerald-600">{s.attendance}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-8 text-[10px] text-slate-400 text-center italic">
                                    End of Generated Mentee Progress Report
                                </div>
                            </div>

                            <div className="p-8 border-t border-border bg-muted/10 flex gap-4 justify-end">
                                <button
                                    onClick={() => { downloadExcel(); setShowExportPreview(false); }}
                                    className="px-6 py-2.5 rounded-xl border border-border bg-card hover:bg-muted font-bold flex items-center gap-2"
                                >
                                    <Download size={18} />
                                    Excel
                                </button>
                                <button
                                    onClick={() => { downloadDocumentation(); setShowExportPreview(false); }}
                                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    <FileText size={18} />
                                    PDF
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {notifTarget && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-lg bg-card border border-border rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold">Message {notifTarget.name}</h3>
                                </div>
                                <button onClick={() => setNotifTarget(null)} className="p-2 hover:bg-muted rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSendNotification} className="space-y-6">
                                <textarea
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none min-h-[150px]"
                                    placeholder="Type your message..."
                                    value={notifText}
                                    onChange={(e) => setNotifText(e.target.value)}
                                    required
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setNotifTarget(null)}
                                        className="flex-1 py-3 border border-border font-bold rounded-xl hover:bg-muted"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        <Send size={16} />
                                        Send
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
