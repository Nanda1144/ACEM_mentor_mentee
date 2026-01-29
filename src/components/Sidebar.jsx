import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    UserCircle,
    FileText,
    Calendar,
    Bell,
    LogOut,
    Users,
    BarChart3,
    Award,
    Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const studentLinks = [
        { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
        { name: 'Profile', path: '/student/profile', icon: UserCircle },
        { name: 'Weekly Update', path: '/student/weekly', icon: FileText },
        { name: 'Events', path: '/student/events', icon: Award },
        { name: 'Attendance', path: '/student/attendance', icon: Clock },
        { name: 'Notifications', path: '/student/notifications', icon: Bell },
    ];

    const mentorLinks = [
        { name: 'Overview', path: '/mentor', icon: LayoutDashboard },
        { name: 'My Students', path: '/mentor/students', icon: Users },
        { name: 'Reports', path: '/mentor/reports', icon: BarChart3 },
        { name: 'Notifications', path: '/mentor/notifications', icon: Bell },
        { name: 'Profile', path: '/mentor/profile', icon: UserCircle },
    ];

    const links = user?.role === 'mentor' ? mentorLinks : studentLinks;

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border hidden md:flex flex-col z-30">
            <div className="p-6">
                <div className="flex items-center gap-3 text-primary font-bold text-xl">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                        E
                    </div>
                    EduConnect
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <Icon size={20} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="bg-muted/50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user?.name?.[0]}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">{user?.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{user?.role}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all font-medium text-sm"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
