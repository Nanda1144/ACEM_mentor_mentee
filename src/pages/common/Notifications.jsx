import { useState } from 'react';
import { Bell, Check, Clock, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultNotifications = [
    { id: 1, title: 'Weekly Report Due', body: 'Please submit your activity report for Week 4 by Friday.', time: '2 hours ago', type: 'alert', read: false },
    { id: 2, title: 'Leave Approved', body: 'Your medical leave request for Jan 20th has been approved by Dr. Wilson.', time: '1 day ago', type: 'success', read: true },
    { id: 3, title: 'Mentor Meeting', body: 'Upcoming group discussion on Project Progress this Thursday at 10 AM.', time: '2 days ago', type: 'info', read: true },
];

export default function Notifications() {
    const [notifications, setNotifications] = useState(defaultNotifications);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
                    <p className="text-muted-foreground">Stay updated with messages from your mentor and department.</p>
                </div>
                <button
                    onClick={markAllRead}
                    className="text-sm font-bold text-primary hover:underline px-4 py-2"
                >
                    Mark all as read
                </button>
            </header>

            <div className="space-y-4">
                {notifications.map((n) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={n.id}
                        className={`bg-card border p-6 rounded-3xl flex gap-4 items-start transition-all shadow-sm ${n.read ? 'border-border/50' : 'border-primary/30 ring-1 ring-primary/10'}`}
                    >
                        <div className={`p-3 rounded-2xl ${n.type === 'alert' ? 'bg-destructive/10 text-destructive' :
                                n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                    'bg-blue-500/10 text-blue-500'
                            }`}>
                            {n.type === 'alert' ? <AlertTriangle size={20} /> : n.type === 'success' ? <Check size={20} /> : <Info size={20} />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className={`font-bold ${n.read ? 'text-foreground/80' : 'text-foreground'}`}>{n.title}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Clock size={12} />
                                    {n.time}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{n.body}</p>
                            {!n.read && <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> New Notification</div>}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
