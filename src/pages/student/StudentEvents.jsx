import { useState, useEffect } from 'react';
import { Award, Plus, Link, Calendar, Building, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const mockEvents = [
    { id: 1, name: 'HackUniversity 2025', college: 'MIT Tech', date: '2025-12-15', certificate: 'https://drive.google.com/cert1', status: 'Verified' },
    { id: 2, name: 'Cloud Workshop', college: 'AWS Student Hub', date: '2026-01-10', certificate: 'https://drive.google.com/cert2', status: 'Pending' },
];

export default function StudentEvents() {
    const { user, addEvent } = useAuth();
    const [showAdd, setShowAdd] = useState(false);
    const [eventsList, setEventsList] = useState(user?.events || []);
    const [newLink, setNewLink] = useState('');
    const [showLinkReminder, setShowLinkReminder] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        college: '',
        date: '',
        certificate: ''
    });

    useEffect(() => {
        if (user?.events) setEventsList(user.events);
    }, [user]);

    const handleLinkPaste = () => {
        setShowLinkReminder(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFuture = new Date(formData.date) > new Date();
        const eventData = {
            ...formData,
            certificate: newLink,
            status: isFuture ? 'Planned' : 'Pending'
        };

        const res = await addEvent(eventData);
        if (res.success) {
            setShowAdd(false);
            setFormData({ name: '', college: '', date: '', certificate: '' });
            setNewLink('');
            alert(isFuture ? 'Event planned successfully!' : 'Event participation logged!');
        } else {
            alert('Failed to add event.');
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Events & Lifecycle</h1>
                    <p className="text-muted-foreground">Strategize your participation and archive your achievements.</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
                >
                    <Plus size={18} />
                    Plan / Log Event
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {eventsList.length > 0 ? (
                        eventsList.map((event, idx) => {
                            const isPlanned = event.status === 'Planned';
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={idx}
                                    className={`bg-card border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group ${isPlanned ? 'border-dashed border-primary/40' : 'border-border'}`}
                                >
                                    <div className="absolute top-0 right-0 p-4 shrink-0">
                                        <div className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${event.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' :
                                            isPlanned ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {event.status}
                                        </div>
                                    </div>

                                    <div className={`p-3 rounded-2xl w-fit mb-4 ${isPlanned ? 'bg-primary/5 text-primary' : 'bg-primary/10 text-primary'}`}>
                                        {isPlanned ? <Clock size={24} /> : <Award size={24} />}
                                    </div>

                                    <h3 className="text-lg font-bold pr-16">{event.name}</h3>

                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                                            <Building size={14} />
                                            {event.college}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                                            <Calendar size={14} />
                                            {event.date}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-primary truncate max-w-[150px]">
                                            <Link size={14} />
                                            {event.certificate || 'Wait for Event'}
                                        </div>
                                        {event.certificate && (
                                            <a
                                                href={event.certificate}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs font-black hover:underline text-primary uppercase"
                                            >
                                                View
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award size={40} className="text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">No Events Logged Yet</h3>
                            <p className="text-muted-foreground">Plan an upcoming event or log a past participation.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border w-full max-w-lg rounded-3xl p-8 shadow-2xl"
                    >
                        <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Add Event Record</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Event Domain</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Google Solutions Challenge"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl font-bold focus:ring-4 focus:ring-primary/5 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Host Organization</label>
                                <input
                                    type="text"
                                    placeholder="e.g. IIT Madras"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl font-bold focus:ring-4 focus:ring-primary/5 outline-none"
                                    value={formData.college}
                                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Scheduled Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl font-bold focus:ring-4 focus:ring-primary/5 outline-none"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Link (Optional for Planned)</label>
                                    <div className="relative">
                                        <Link size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="url"
                                            value={newLink}
                                            onPaste={handleLinkPaste}
                                            onChange={(e) => setNewLink(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl font-bold focus:ring-4 focus:ring-primary/5 outline-none"
                                            placeholder="Drive cert link..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex gap-3 text-xs text-primary font-bold">
                                <AlertCircle size={16} className="shrink-0" />
                                <p>Planning an upcoming event? You can leave the certificate link blank for now and update it later.</p>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 font-black uppercase text-xs tracking-widest text-muted-foreground hover:bg-muted rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 font-black uppercase text-xs tracking-widest bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all">Confirm Entry</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            {showLinkReminder && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center"
                    >
                        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 mx-auto rounded-3xl flex items-center justify-center mb-6">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-xl font-black mb-2 uppercase">Sanity Check</h3>
                        <p className="text-muted-foreground text-xs font-bold mb-8">
                            Ensure your link's privacy setting is "Anyone with the link can view". Without this, your mentor cannot verify your credentials.
                        </p>
                        <button
                            onClick={() => setShowLinkReminder(false)}
                            className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all uppercase tracking-widest text-xs"
                        >
                            Understood
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
