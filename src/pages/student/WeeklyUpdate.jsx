import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileCheck, Code, BookOpen, Layers, Download, Eye, X, Building, FileText, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function WeeklyUpdate() {
    const { user, updateStudentProgress, addWeeklyUpdate } = useAuth();
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState({
        courses: '',
        completion: user?.progress || 0,
        skills: user?.skills || '',
        projectTitle: user?.currentProject || '',
        projectDesc: '',
        technologies: user?.technologies || '',
        research: '',
        status: 'In Progress'
    });

    const [savedSections, setSavedSections] = useState({
        academics: false,
        project: false,
        research: false
    });

    const handleSaveSection = (section) => {
        setSavedSections({ ...savedSections, [section]: true });
        setTimeout(() => setSavedSections(prev => ({ ...prev, [section]: false })), 3000);
    };

    const downloadReportPDF = () => {
        const doc = new jsPDF();
        const dateStr = new Date().toLocaleString();
        let currentY = 15;

        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.setFont(undefined, 'bold');
        doc.text('WEEKLY ACTIVITY PERFORMANCE REPORT', 105, currentY + 7, { align: 'center' });

        currentY += 20;
        doc.setDrawColor(200, 200, 200);
        doc.line(20, currentY, 190, currentY);

        currentY += 15;
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(`Student Name: ${user?.name || 'Student'}`, 20, currentY);
        doc.text(`Roll Number: ${user?.id || 'N/A'}`, 20, currentY + 6);
        doc.text(`Submission Date: ${dateStr.split(',')[0]}`, 130, currentY);
        doc.text(`Department: ${user?.dept || 'Engineering'}`, 130, currentY + 6);

        currentY += 20;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Detailed Report Summary', 20, currentY);

        const tableBody = [
            ['Academic Focus', formData.courses || 'Not Specified'],
            ['Completion Rate', `${formData.completion}%`],
            ['Skills Developed', formData.skills || 'Not Specified'],
            ['Current Project', formData.projectTitle || 'Not Specified'],
            ['Project Progress', formData.status],
            ['Technologies', formData.technologies || 'Not Specified'],
            ['Research Work', formData.research || 'Not Specified']
        ];

        doc.autoTable({
            body: tableBody,
            startY: currentY + 10,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 6 },
            columnStyles: { 0: { fontStyle: 'bold', fillColor: [245, 247, 250], width: 50 } }
        });

        currentY = doc.lastAutoTable.finalY + 30;
        doc.text('__________________________', 20, currentY);
        doc.text('Student Signature', 25, currentY + 7);

        doc.text('__________________________', 130, currentY);
        doc.text('Mentor Acknowledgment', 135, currentY + 7);

        doc.save(`Weekly_Report_${user?.id}_${dateStr.split(',')[0].replace(/\//g, '-')}.pdf`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Update general progress
        await updateStudentProgress(user.id, {
            progress: parseInt(formData.completion),
            currentProject: formData.projectTitle || 'N/A',
            technologies: formData.technologies || 'N/A',
            skills: formData.skills || 'N/A'
        });

        // Add to permanent weekly updates collection
        await addWeeklyUpdate({
            title: formData.projectTitle || 'Weekly Log',
            description: formData.projectDesc || formData.skills || 'No description provided.',
            weekNumber: Math.ceil((new Date().getDate()) / 7)
        });

        alert('Weekly report submitted and stored permanently!');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Weekly Activity Update</h1>
                    <p className="text-muted-foreground">Share your progress and achievements for this week.</p>
                </div>
                <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold self-start text-xs uppercase tracking-widest"
                >
                    <Eye size={16} />
                    Preview Report
                </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-8">
                    {/* Academics Section */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-border pb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <BookOpen size={20} className="text-primary" />
                                Academic Progress
                            </h3>
                            <button
                                type="button"
                                onClick={() => handleSaveSection('academics')}
                                className={`text-xs font-bold px-4 py-1.5 rounded-lg border transition-all ${savedSections.academics ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-primary text-primary hover:bg-primary/5'}`}
                            >
                                {savedSections.academics ? 'Saved!' : 'Save Academics'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Selected Courses</label>
                                <input
                                    type="text"
                                    placeholder="e.g. React, Advanced Java"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.courses}
                                    onChange={(e) => setFormData({ ...formData, courses: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Completion % ({formData.completion}%)</label>
                                <input
                                    type="range"
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    value={formData.completion}
                                    onChange={(e) => setFormData({ ...formData, completion: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Skills Improved</label>
                            <textarea
                                placeholder="List new skills or improvements..."
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Project Section */}
                    <div className="space-y-6 pt-4">
                        <div className="flex justify-between items-center border-b border-border pb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Code size={20} className="text-primary" />
                                Project Details
                            </h3>
                            <button
                                type="button"
                                onClick={() => handleSaveSection('project')}
                                className={`text-xs font-bold px-4 py-1.5 rounded-lg border transition-all ${savedSections.project ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-primary text-primary hover:bg-primary/5'}`}
                            >
                                {savedSections.project ? 'Saved!' : 'Save Project'}
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Project Title</label>
                            <input
                                type="text"
                                placeholder="My Awesome Project"
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                value={formData.projectTitle}
                                onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Project Description</label>
                            <textarea
                                placeholder="What did you work on this week?"
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                                value={formData.projectDesc}
                                onChange={(e) => setFormData({ ...formData, projectDesc: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Technologies Used</label>
                                <input
                                    type="text"
                                    placeholder="e.g. React, Firebase, Tailwind"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.technologies}
                                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Current Status</label>
                                <select
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option>Not Started</option>
                                    <option>In Progress</option>
                                    <option>Blocked</option>
                                    <option>Completed</option>
                                    <option>Under Review</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Research Section */}
                    <div className="space-y-6 pt-4">
                        <div className="flex justify-between items-center border-b border-border pb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Layers size={20} className="text-primary" />
                                Research Updates
                            </h3>
                            <button
                                type="button"
                                onClick={() => handleSaveSection('research')}
                                className={`text-xs font-bold px-4 py-1.5 rounded-lg border transition-all ${savedSections.research ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-primary text-primary hover:bg-primary/5'}`}
                            >
                                {savedSections.research ? 'Saved!' : 'Save Research'}
                            </button>
                        </div>
                        <textarea
                            placeholder="Any research papers read or new concepts learned?"
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                            value={formData.research}
                            onChange={(e) => setFormData({ ...formData, research: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        className="px-6 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-all"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="submit"
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        Submit Report
                        <Send size={18} />
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {showPreview && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[120] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-background border border-border w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                                <div>
                                    <h3 className="text-xl font-bold">Weekly Report Preview</h3>
                                    <p className="text-xs text-muted-foreground">Review your activity summary before downloading.</p>
                                </div>
                                <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 bg-white text-black">
                                <div className="text-center border-b-2 border-slate-100 pb-8 mb-10">
                                    <h2 className="text-2xl font-black tracking-tight uppercase">Weekly Activity Performance Report</h2>
                                    <p className="text-xs font-bold text-slate-400 mt-2">Official Mentee Documentation</p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Information</p>
                                            <h4 className="text-lg font-bold">{user?.name}</h4>
                                            <p className="text-sm text-slate-600 font-medium">{user?.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</p>
                                            <p className="text-sm font-bold text-slate-700">{user?.dept || 'Engineering'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 text-right">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report Cycle</p>
                                            <p className="text-sm font-bold text-slate-700">Week of {new Date().toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase">
                                                {formData.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Academic & Skills Focus</h4>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase">Selected Courses</p>
                                                <p className="text-sm font-bold">{formData.courses || 'Not Listed'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase">Completion Rate</p>
                                                <p className="text-sm font-black text-indigo-600">{formData.completion}%</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Project Implementation</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase">Project Title</p>
                                                <p className="text-sm font-bold">{formData.projectTitle || 'Not Listed'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase">Technologies Used</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {(formData.technologies || 'None').split(',').map(tech => (
                                                        <span key={tech.trim()} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold">{tech.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-border bg-muted/10 flex gap-4 justify-end">
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="px-6 py-3 rounded-xl border border-border bg-card hover:bg-muted font-bold text-xs uppercase tracking-widest"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => { downloadReportPDF(); setShowPreview(false); }}
                                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 shadow-lg shadow-primary/20 text-xs uppercase tracking-widest"
                                >
                                    <Download size={18} />
                                    Download PDF
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
