import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import api from '../api';

const Admins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const res = await api.get('/admins');
            setAdmins(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admins:', error);
            setLoading(false);
        }
    };

    const handleAddAdmin = async () => {
        if (!newEmail) return;
        try {
            await api.post('/admins', { email: newEmail, role: 'admin' });
            setNewEmail('');
            fetchAdmins();
        } catch (error) {
            console.error('Error adding admin:', error);
        }
    };

    const handleDeleteAdmin = async (id) => {
        if (!window.confirm('Are you sure you want to delete this admin?')) return;
        try {
            await api.delete(`/admins/${id}`);
            fetchAdmins();
        } catch (error) {
            console.error('Error deleting admin:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-hushh-black">Admin Management</h1>
                <div className="flex space-x-2">
                    <input
                        type="email"
                        placeholder="New Admin Email"
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        className="px-4 py-2 border border-hushh-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-hushh-lime"
                    />
                    <button onClick={handleAddAdmin} className="bg-hushh-lime hover:bg-hushh-lime/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                        <Plus size={18} />
                        <span>Add Admin</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-hushh-grey overflow-hidden">
                <div className="p-4 border-b border-hushh-grey flex items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search admins..."
                            className="w-full pl-10 pr-4 py-2 border border-hushh-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-hushh-lime"
                        />
                    </div>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-blue-grey text-gray-600 text-sm">
                            <th className="p-4 font-medium border-b border-hushh-grey hover:bg-gray-100 cursor-pointer">Email</th>
                            <th className="p-4 font-medium border-b border-hushh-grey hover:bg-gray-100 cursor-pointer">Role</th>
                            <th className="p-4 font-medium border-b border-hushh-grey hover:bg-gray-100 cursor-pointer">Added Date</th>
                            <th className="p-4 font-medium border-b border-hushh-grey text-right flex-shrink-0">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="p-8 text-center">Loading admins...</td></tr>
                        ) : admins.map((admin) => (
                            <tr key={admin.id} className="border-b border-hushh-grey last:border-0 hover:bg-blue-grey transition-colors">
                                <td className="p-4 text-sm text-hushh-black font-medium">{admin.email}</td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 'bg-hushh-lime/10 text-hushh-lime'}`}>
                                        {admin.role}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500">{new Date(admin.created_at).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDeleteAdmin(admin.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!loading && admins.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500">No admins found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admins;
