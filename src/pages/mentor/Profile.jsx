import { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, GraduationCap,
    Camera, Save, BadgeCheck, Users, BookOpen,
    Award, FileText, Settings, Shield, CheckCircle,
    Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function MentorProfile() {
    const { user, updateUser, getMentorStats } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.name || '',
        mentorId: user?.id || '',
        designation: user?.designation || 'Senior Professor',
        department: user?.dept || 'Engineering',
        email: user?.email || '',
        phone: user?.phone || '',
        office: user?.office || 'Block C, Room 205',
        expertise: user?.expertise || 'Computer Science & Engineering',
        assignedStudents: 0,
        reportsReviewed: 0,
        publications: 15,
        collegeHeader: user?.collegeHeader || 'EDUCONNECT INSTITUTE OF TECHNOLOGY',
        collegeLogo: user?.collegeLogo || null
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.id) {
                const stats = await getMentorStats(user.id);
                setProfile(prev => ({
                    ...prev,
                    assignedStudents: stats.menteeCount,
                    reportsReviewed: stats.reportsReviewed
                }));
            }
        };
        fetchStats();
    }, [user?.id]);

    useEffect(() => {
        if (user) {
            setProfile(prev => ({
                ...prev,
                ...user,
                name: user.name || prev.name,
                email: user.email || prev.email,
                mentorId: user.id
            }));
        }
    }, [user]);

    const handleUpdate = async () => {
        setIsSaving(true);
        const result = await updateUser(profile);
        setIsSaving(false);

        if (result.success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Staff Profile</h1>
                    <p className="text-muted-foreground">Manage your professional identity and academic credentials.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-all font-bold">
                        <Settings size={18} />
                        Account Settings
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 right-8 z-50 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
                    >
                        <CheckCircle size={20} />
                        Profile updated successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Info Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6">
                            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl" title="Verified Staff">
                                <BadgeCheck size={20} />
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="relative">
                                <input
                                    type="file"
                                    id="photo-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setProfile({ ...profile, photo: reader.result });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <div
                                    onClick={() => document.getElementById('photo-upload').click()}
                                    className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-4xl border-4 border-background shadow-2xl relative overflow-hidden group cursor-pointer"
                                >
                                    {profile.photo ? (
                                        <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        profile.name ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'SW'
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera size={24} className="text-white" />
                                    </div>
                                </div>
                                <div
                                    onClick={() => document.getElementById('photo-upload').click()}
                                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg border-2 border-background cursor-pointer"
                                >
                                    <Camera size={14} />
                                </div>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-2xl font-extrabold">{profile.name}</h2>
                                <p className="text-primary font-bold mt-1 uppercase tracking-tighter text-sm">{profile.mentorId}</p>
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs font-bold text-muted-foreground">
                                    <GraduationCap size={14} />
                                    {profile.designation}
                                </div>
                            </div>

                            <div className="w-full h-px bg-border my-8" />

                            <div className="w-full space-y-5">
                                <div className="flex items-start gap-4 text-left">
                                    <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Assigned Mentees</p>
                                        <p className="text-lg font-bold">{profile.assignedStudents} Students</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 text-left">
                                    <div className="p-2.5 bg-amber-500/5 text-amber-500 rounded-xl">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reports Reviewed</p>
                                        <p className="text-lg font-bold">{profile.reportsReviewed} Submissions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-[2rem] p-8 text-primary-foreground shadow-xl shadow-primary/20">
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                            <Shield size={20} />
                            Quick Stats
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                <p className="text-white/60 text-[10px] font-bold uppercase mb-1">Impact</p>
                                <p className="text-2xl font-bold">15+</p>
                                <p className="text-[10px] text-white/40">Papers Published</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                <p className="text-white/60 text-[10px] font-bold uppercase mb-1">Active</p>
                                <p className="text-2xl font-bold">4.8/5</p>
                                <p className="text-[10px] text-white/40">Student Rating</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Details */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm flex-1">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-extrabold flex items-center gap-2">
                                <User size={24} className="text-primary" />
                                Professional Records
                            </h3>
                            <button
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-extrabold shadow-lg shadow-primary/30 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save size={20} />
                                )}
                                {isSaving ? 'Saving...' : 'Update Profile'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1 tracking-widest">Full Legal Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1 tracking-widest">University Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1 tracking-widest">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1 tracking-widest">Staff unique ID</label>
                                <div className="relative">
                                    <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                                        value={profile.mentorId}
                                        onChange={(e) => setProfile({ ...profile, mentorId: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1 tracking-widest">Designation</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                                        value={profile.designation}
                                        onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1 tracking-widest">Faculty Office</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                                        value={profile.office}
                                        onChange={(e) => setProfile({ ...profile, office: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1 tracking-widest">Department</label>
                                <div className="relative">
                                    <Settings className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                                        value={profile.department}
                                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1 tracking-widest">Core Educational Expertise & Research Areas</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-4 top-5 text-muted-foreground" size={18} />
                                    <textarea
                                        className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold min-h-[120px] resize-none"
                                        value={profile.expertise}
                                        onChange={(e) => setProfile({ ...profile, expertise: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-6 pt-6 border-t border-border">
                            <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                                <FileText size={16} />
                                Report Branding & Documentation Configuration
                            </h4>
                            <div className="max-w-xl">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase ml-1 tracking-widest">College Branding (Report Header)</label>
                                        <div className="relative">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type="text"
                                                className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                                                value={profile.collegeHeader}
                                                onChange={(e) => setProfile({ ...profile, collegeHeader: e.target.value })}
                                                placeholder="College Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl border border-dashed border-border">
                                        <div
                                            onClick={() => document.getElementById('college-logo').click()}
                                            className="w-16 h-16 rounded-xl bg-background border border-border flex items-center justify-center cursor-pointer overflow-hidden group relative"
                                        >
                                            {profile.collegeLogo ? (
                                                <img src={profile.collegeLogo} className="w-full h-full object-contain" />
                                            ) : (
                                                <Camera size={20} className="text-muted-foreground" />
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Camera size={14} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold uppercase">College Logo</p>
                                            <p className="text-[10px] text-muted-foreground">Used in PDF Header (PNG/JPG)</p>
                                            <input
                                                type="file"
                                                id="college-logo"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setProfile({ ...profile, collegeLogo: reader.result });
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 p-6 bg-muted/50 rounded-3xl border border-dashed border-border flex items-center gap-4">
                        <div className="bg-card w-14 h-14 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                            <Award size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Academic Credentials</h4>
                            <p className="text-xs text-muted-foreground">Ph.D. in Computer Science & Engineering, Stanford University (2012)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
