import React, { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp } from 'lucide-react';
import api from '../api';

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-hushh-grey">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-hushh-black mt-2">{value}</p>
            </div>
            <div className="bg-hushh-lime/10 p-3 rounded-lg">
                <Icon className="text-hushh-lime" size={24} />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <TrendingUp size={16} className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">{trend}</span>
            <span className="text-gray-500 ml-2">vs last month</span>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalEvents: 0,
        totalRegistrations: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const analyticsRes = await api.get('/analytics/dashboard');
                const eventsRes = await api.get('/events');

                setStats({
                    totalMembers: analyticsRes.data.totalMembers || 0,
                    totalEvents: eventsRes.data.length || 0,
                    totalRegistrations: analyticsRes.data.totalEventParticipants || 0,
                    recentActivity: analyticsRes.data.recentActivity || []
                });
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            {loading ? (
                <div className="text-center p-8 text-gray-500">Loading dashboard...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Members" value={stats.totalMembers.toString()} icon={Users} trend="+12%" />
                    <StatCard title="Total Events" value={stats.totalEvents.toString()} icon={Calendar} trend="+5%" />
                    <StatCard title="Total Registrations" value={stats.totalRegistrations.toString()} icon={Users} trend="+18%" />
                </div>
            )}

            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-hushh-grey">
                <h2 className="text-lg font-semibold text-hushh-black mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {stats.recentActivity.length > 0 ? (
                        stats.recentActivity.map((activity, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-hushh-lime/10 flex items-center justify-center text-hushh-lime">
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.user} joined the community
                                        </p>
                                        <p className="text-xs text-gray-500">{getRelativeTime(activity.time)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No recent activity found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
