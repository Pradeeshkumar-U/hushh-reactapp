import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    BarChart3,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
            flex items-center justify-between px-4 py-3 rounded-xl transition-all group
            ${isActive
                ? 'bg-hushh-lime text-white shadow-lg shadow-hushh-lime/20'
                : 'text-gray-500 hover:bg-hushh-lime/10 hover:text-hushh-lime'}
        `}
    >
        <div className="flex items-center space-x-3">
            <Icon size={20} />
            <span className="font-semibold text-sm">{label}</span>
        </div>
        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </NavLink>
);

const Sidebar = () => {
    const { user } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col z-40">
            <div className="p-8">
                <h1 className="text-2xl font-black bg-gradient-to-r from-hushh-black to-hushh-lime bg-clip-text text-transparent italic">
                    HUSHH
                </h1>
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">
                    Connect Administration
                </p>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                <SidebarItem to="/events" icon={Calendar} label="Events" />
                <SidebarItem to="/admins" icon={Users} label="Admins" />
                <SidebarItem to="/analytics" icon={BarChart3} label="Analytics" />
                <SidebarItem to="/settings" icon={Settings} label="System Settings" />
            </nav>

            <div className="p-4 mt-auto border-t border-gray-50">
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-hushh-lime shadow-sm font-bold">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-hushh-black truncate">{user?.email}</p>
                            <p className="text-[10px] text-gray-500 font-medium">Administrator</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold text-sm"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
