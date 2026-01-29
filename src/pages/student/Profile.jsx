import { useState, useRef, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, GraduationCap,
    Camera, Save, UserCircle, Calendar, Edit2,
    CheckCircle2, X, FileText, BadgeCheck, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function StudentProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [mentorDetails, setMentorDetails] = useState(null);
    const [isFetchingMentor, setIsFetchingMentor] = useState(false);
    const { user, updateUser, getMentorByUid, getMentorStats } = useAuth();
    const fileInputRef = useRef(null);

    // Initial local state
    const [profile, setProfile] = useState({
        name: user?.name || '',
        rollNo: user?.id || '',
        year: user?.year || '1st Year',
        department: user?.dept || 'Engineering',
        email: user?.email || '',
        phone: user?.phone || '',
        mentorId: user?.mentorId || '',
        address: user?.address || '',
        photo: user?.photo || null
    });

    useEffect(() => {
        if (user) {
            setProfile(prev => ({
                ...prev,
                ...user,
                rollNo: user.id, // Ensure consistency
                department: user.dept
            }));
        }
    }, [user]);

    const [showMentorModal, setShowMentorModal] = useState(false);
    const [mentorStats, setMentorStats] = useState({ menteeCount: 0, reportsReviewed: 0 });

    // Fetch mentor details dynamically when mentorId changes
    useEffect(() => {
        const fetchMentor = async () => {
            if (profile.mentorId) {
                setIsFetchingMentor(true);
                const details = await getMentorByUid(profile.mentorId);
                if (details) {
                    const stats = await getMentorStats(profile.mentorId);
                    setMentorStats(stats);
                }
                setMentorDetails(details);
                setIsFetchingMentor(false);
            } else {
                setMentorDetails(null);
                setMentorStats({ menteeCount: 0, reportsReviewed: 0 });
            }
        };

        const timeoutId = setTimeout(fetchMentor, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [profile.mentorId]);

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateUser({
            ...profile,
            dept: profile.department
        });

        setIsSaving(false);
        if (result.success) {
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setProfile(prev => ({ ...prev, photo: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'JD';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Personal Profile</h1>
                    <p className="text-muted-foreground">Manage your identity, photo, and official academic records.</p>
                </div>
                <div className="flex gap-3">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/20"
                        >
                            <Edit2 size={18} />
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setProfile({ ...user, rollNo: user.id, department: user.dept });
                                    setIsEditing(false);
                                }}
                                className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 hover:opacity-90 disabled:opacity-50 transition-all"
                            >
                                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="fixed bottom-8 right-8 z-50 bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
                    >
                        <CheckCircle2 size={24} />
                        Changes saved to your permanent record!
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Avatar Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-44 h-44 rounded-[3rem] bg-primary/5 flex items-center justify-center text-primary font-black text-6xl overflow-hidden border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                {profile.photo ? (
                                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    getInitials(profile.name)
                                )}

                                {isEditing && (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]"
                                    >
                                        <Camera size={38} className="mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Update Photo</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                            {!isEditing && (
                                <div className="absolute -bottom-1 -right-1 p-2 bg-emerald-500 text-white rounded-2xl shadow-lg border-4 border-background" title="Verified Member">
                                    <BadgeCheck size={20} />
                                </div>
                            )}
                        </div>

                        <div className="mt-8 relative z-10 w-full">
                            <h2 className="text-2xl font-black text-foreground tracking-tight">{profile.name}</h2>
                            <p className="text-primary font-black mt-1 tracking-widest text-sm uppercase">{profile.rollNo}</p>
                            <p className="text-muted-foreground text-xs mt-3 font-bold uppercase tracking-wider bg-muted py-2 px-4 rounded-xl inline-block">{profile.department}</p>
                        </div>

                        <div className="w-full h-px bg-border my-8" />

                        <div className="w-full space-y-4 relative z-10">
                            {(!mentorDetails && !isEditing) ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full flex items-center gap-4 text-sm text-left p-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group"
                                >
                                    <div className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform"><Plus size={22} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.15em] mb-0.5">No Mentor Linked</p>
                                        <p className="font-bold text-foreground/60">Assign Mentor Now</p>
                                    </div>
                                </button>
                            ) : (
                                <div
                                    onClick={() => mentorDetails && setShowMentorModal(true)}
                                    className={`flex items-center gap-4 text-sm text-left p-4 rounded-2xl border transition-all ${mentorDetails ? 'bg-primary/5 border-primary/20 cursor-pointer hover:bg-primary/10' : 'bg-muted/30 border-border/50'}`}
                                >
                                    <div className="p-2.5 bg-card rounded-xl text-primary shadow-sm"><UserCircle size={22} /></div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-0.5">Assigned Mentor</p>
                                        {isEditing && !mentorDetails ? (
                                            <input
                                                type="text"
                                                autoFocus
                                                placeholder="Enter Mentor ID"
                                                className="w-full bg-transparent border-none outline-none font-bold text-foreground placeholder:text-muted-foreground/50"
                                                value={profile.mentorId}
                                                onChange={(e) => setProfile({ ...profile, mentorId: e.target.value })}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        ) : (
                                            <>
                                                <p className={`font-bold ${mentorDetails ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {isFetchingMentor ? 'Verifying...' : (mentorDetails?.name || 'No Mentor Assigned')}
                                                </p>
                                                {mentorDetails && <p className="text-[10px] text-primary font-bold">View Profile</p>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-4 text-sm text-left p-4 rounded-2xl bg-muted/30 border border-border/50">
                                <div className="p-2.5 bg-card rounded-xl text-primary shadow-sm"><Calendar size={22} /></div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-0.5">Academic Progress</p>
                                    <p className="font-bold text-foreground">{profile.year}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Activity */}
                    <div className="bg-card border border-border rounded-[2rem] p-6 shadow-sm">
                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Live Activities</h4>
                        <div className="space-y-4">
                            {user?.activities?.slice(0, 3).map((act, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <p className="text-xs font-bold text-foreground/80 leading-relaxed">{act.description}</p>
                                </div>
                            ))}
                            {(!user?.activities || user.activities.length === 0) && (
                                <p className="text-xs text-muted-foreground italic">No activities recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mentor Profile Modal */}
                <AnimatePresence>
                    {showMentorModal && mentorDetails && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowMentorModal(false)}
                                className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-card border border-border w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
                            >
                                <div className="p-10">
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-32 h-32 rounded-[2.5rem] bg-primary/5 flex items-center justify-center text-primary font-black text-4xl overflow-hidden border-2 border-primary/20">
                                            {mentorDetails.photo ? <img src={mentorDetails.photo} className="w-full h-full object-cover" /> : getInitials(mentorDetails.name)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-3xl font-black">{mentorDetails.name}</h3>
                                                <BadgeCheck className="text-emerald-500" size={24} />
                                            </div>
                                            <p className="text-primary font-bold tracking-widest uppercase text-sm mb-4">{mentorDetails.uid}</p>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-muted/50 rounded-2xl">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Department</p>
                                                    <p className="font-bold text-sm">{mentorDetails.dept}</p>
                                                </div>
                                                <div className="p-4 bg-muted/50 rounded-2xl">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Designation</p>
                                                    <p className="font-bold text-sm">Senior Professor</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                                        <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl text-center">
                                            <p className="text-3xl font-black text-primary">{mentorStats.menteeCount}</p>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase mt-1 tracking-widest">Assigned Mentees</p>
                                        </div>
                                        <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl text-center">
                                            <p className="text-3xl font-black text-emerald-500">{mentorStats.reportsReviewed}</p>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase mt-1 tracking-widest">Reports Reviewed</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        <div className="flex items-center gap-4 text-sm font-bold p-4 bg-muted/30 rounded-2xl">
                                            <Mail size={18} className="text-muted-foreground" />
                                            {mentorDetails.email}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm font-bold p-4 bg-muted/30 rounded-2xl">
                                            <Phone size={18} className="text-muted-foreground" />
                                            +91 91234 56789
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowMentorModal(false)}
                                        className="w-full mt-10 py-4 bg-foreground text-background font-black rounded-2xl uppercase tracking-widest text-sm"
                                    >
                                        Close Profile
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Information Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-border">
                            <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-foreground tracking-tight underline decoration-primary/30 decoration-4 underline-offset-4">Official Bio-data</h3>
                                <p className="text-xs font-bold text-muted-foreground mt-1">Information held by the Registrar's Office</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 flex-1">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase ml-1 tracking-[0.2em]">Student Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                                    <input
                                        type="text"
                                        readOnly={!isEditing}
                                        className={`w-full pl-12 pr-4 py-4 rounded-[1.25rem] outline-none transition-all font-bold text-sm ${isEditing ? 'bg-background border-2 border-primary ring-4 ring-primary/5' : 'bg-muted/30 border-2 border-transparent cursor-not-allowed text-foreground/70'}`}
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase ml-1 tracking-[0.2em]">Enrollment Dept.</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full pl-12 pr-4 py-4 bg-muted/10 border-2 border-transparent rounded-[1.25rem] font-bold text-sm cursor-not-allowed text-muted-foreground"
                                        value={profile.department}
                                    />
                                </div>
                            </div>

                            {/* Mentor Assignment Section */}
                            <div className="md:col-span-2 p-8 bg-primary/5 rounded-[2rem] border border-primary/20 space-y-6">
                                <div>
                                    <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-1">Mentor Assignment</h4>
                                    <p className="text-xs text-muted-foreground font-bold">Link your profile to an official mentor via their Unique ID.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase ml-1 tracking-[0.2em]">Mentor Unique ID</label>
                                        <div className="relative">
                                            <BadgeCheck className={`absolute left-4 top-1/2 -translate-y-1/2 ${mentorDetails ? 'text-emerald-500' : 'text-muted-foreground/60'}`} size={18} />
                                            <input
                                                type="text"
                                                readOnly={!isEditing}
                                                placeholder="e.g. M-9982"
                                                className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all font-black text-sm ${isEditing ? 'bg-white border-2 border-primary' : 'bg-transparent border-2 border-transparent cursor-not-allowed'}`}
                                                value={profile.mentorId}
                                                onChange={(e) => setProfile({ ...profile, mentorId: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    {mentorDetails && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-emerald-500/20 shadow-sm"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                <UserCircle size={28} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified Mentor</p>
                                                <h5 className="font-black text-sm">{mentorDetails.name}</h5>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{mentorDetails.dept}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase ml-1 tracking-[0.2em]">Academic Progress Year</label>
                                <select
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-4 rounded-[1.25rem] outline-none transition-all font-bold text-sm bg-muted/30 border-2 border-transparent ${isEditing ? 'bg-background border-primary cursor-pointer' : 'cursor-not-allowed'}`}
                                    value={profile.year}
                                    onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                                >
                                    <option>1st Year</option>
                                    <option>2nd Year</option>
                                    <option>3rd Year</option>
                                    <option>4th Year</option>
                                </select>
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase ml-1 tracking-[0.2em]">Primary Contact</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                                    <input
                                        type="text"
                                        readOnly={!isEditing}
                                        className={`w-full pl-12 pr-4 py-4 rounded-[1.25rem] outline-none transition-all font-bold text-sm ${isEditing ? 'bg-background border-2 border-primary' : 'bg-muted/30 border-2 border-transparent cursor-not-allowed'}`}
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase ml-1 tracking-[0.2em]">Correspondence Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-5 text-muted-foreground/60" size={18} />
                                    <textarea
                                        readOnly={!isEditing}
                                        rows={3}
                                        className={`w-full pl-12 pr-4 py-4 rounded-[1.25rem] outline-none transition-all font-bold text-sm resize-none ${isEditing ? 'bg-background border-2 border-primary' : 'bg-muted/30 border-2 border-transparent cursor-not-allowed'}`}
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="mt-12 p-6 bg-amber-500/5 rounded-[2rem] border border-dashed border-amber-500/20 flex items-center gap-5">
                            <div className="bg-card w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-amber-500 shadow-sm font-black border border-amber-500/10">
                                ID
                            </div>
                            <div>
                                <h4 className="font-black text-sm text-foreground uppercase tracking-tight">Identity Status: Verified</h4>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em] mt-0.5">Registration: {profile.rollNo} • Access: GRANTED</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

