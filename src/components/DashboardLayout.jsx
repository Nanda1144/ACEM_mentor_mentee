import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout() {
    const { user, loading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (loading) return null;
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-2 text-primary font-bold">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                        E
                    </div>
                    EduConnect
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-muted-foreground">
                    <Menu size={24} />
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 bg-background relative">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
