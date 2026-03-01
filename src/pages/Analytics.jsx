import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, PieChart, Activity } from 'lucide-react';
import api from '../api';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalEventParticipants: 0,
        totalAdmins: 0
    });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const dashboardRes = await api.get('/analytics/dashboard');
                const eventsRes = await api.get('/events');

                setStats(dashboardRes.data);

                // Fetch details for each event to show breakdowns
                const eventsWithAnalytics = await Promise.all(eventsRes.data.map(async (event) => {
                    try {
                        const eventAnalytics = await api.get(`/analytics/events/${event.id}`);
                        return { ...event, analytics: eventAnalytics.data };
                    } catch (e) {
                        return { ...event, analytics: { individualCount: 0, teamCount: 0, totalRegistrations: 0 } };
                    }
                }));

                setEvents(eventsWithAnalytics);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div className="text-center p-8 text-gray-500">Loading comprehensive analytics...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-hushh-black">Analytics Overview</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-hushh-grey shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Club Members</p>
                    <p className="text-2xl font-bold text-hushh-black">{stats.totalMembers}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-hushh-grey shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Total Participants</p>
                    <p className="text-2xl font-bold text-hushh-black">{stats.totalEventParticipants}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-hushh-grey shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Active Events</p>
                    <p className="text-2xl font-bold text-hushh-black">{events.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-hushh-grey shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Admins</p>
                    <p className="text-2xl font-bold text-hushh-black">{stats.totalAdmins}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-hushh-grey shadow-sm overflow-hidden">
                <div className="p-4 border-b border-hushh-grey bg-blue-grey">
                    <h2 className="font-semibold text-hushh-black flex items-center gap-2">
                        <Activity size={18} className="text-hushh-lime" />
                        Event Breakdown
                    </h2>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-sm text-gray-500">
                            <th className="p-4 font-medium border-b">Event Name</th>
                            <th className="p-4 font-medium border-b text-center">Individuals</th>
                            <th className="p-4 font-medium border-b text-center">Teams</th>
                            <th className="p-4 font-medium border-b text-center">Total Regs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id} className="hover:bg-blue-grey transition-colors border-b border-hushh-grey last:border-0">
                                <td className="p-4 text-sm font-medium text-hushh-black">{event.title}</td>
                                <td className="p-4 text-sm text-center text-gray-600">{event.analytics?.individualCount || 0}</td>
                                <td className="p-4 text-sm text-center text-gray-600">{event.analytics?.teamCount || 0}</td>
                                <td className="p-4 text-sm text-center font-semibold text-hushh-lime">
                                    {event.analytics?.totalRegistrations || 0}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Analytics;
