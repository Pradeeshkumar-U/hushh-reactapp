import React, { useState, useEffect } from 'react';
import { Settings, Save, Image as ImageIcon, Layout, Globe, Bell, Shield, Database } from 'lucide-react';
import api from '../api';
import { useAuth } from '../AuthContext';

const SettingsPage = () => {
    const { communityId } = useAuth();
    const [community, setCommunity] = useState({ title: '', description: '', image_url: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const fetchCommunityDetails = async () => {
            try {
                const res = await api.get(`/communities/${communityId}`);
                setCommunity(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch community details:", error);
                setLoading(false);
            }
        };

        if (communityId) fetchCommunityDetails();
    }, [communityId]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let finalImageUrl = community.image_url;

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const uploadRes = await api.post('/images/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageUrl = uploadRes.data.url;
            }

            await api.put(`/communities/${communityId}`, {
                ...community,
                image_url: finalImageUrl
            });

            alert('Settings updated successfully!');
            setImageFile(null);
        } catch (error) {
            console.error("Failed to update settings:", error);
            alert('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center p-8 text-gray-500">Loading settings...</div>;

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-hushh-black">Community Settings</h1>
            </div>

            <div className="bg-white rounded-2xl border border-hushh-grey shadow-sm overflow-hidden">
                <div className="p-6 border-b border-hushh-grey bg-blue-grey/30">
                    <h2 className="text-lg font-bold text-hushh-black">General Information</h2>
                    <p className="text-sm text-gray-500">Manage your community's public identity and branding.</p>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Community Title</label>
                                <input
                                    type="text"
                                    value={community.title}
                                    onChange={e => setCommunity({ ...community, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-hushh-grey rounded-xl focus:ring-2 focus:ring-hushh-lime outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows="4"
                                    value={community.description}
                                    onChange={e => setCommunity({ ...community, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-hushh-grey rounded-xl focus:ring-2 focus:ring-hushh-lime outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Community Branding</label>
                            <div className="relative group border-2 border-dashed border-hushh-grey rounded-2xl p-4 text-center hover:border-hushh-lime transition-colors">
                                {community.image_url || imageFile ? (
                                    <div className="relative h-40 w-full rounded-lg overflow-hidden">
                                        <img
                                            src={imageFile ? URL.createObjectURL(imageFile) : community.image_url}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <label className="cursor-pointer bg-white px-4 py-2 rounded-lg text-sm font-bold text-hushh-black">
                                                Change Image
                                                <input type="file" className="hidden" onChange={e => setImageFile(e.target.files[0])} accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer space-y-2 py-8 block">
                                        <div className="mx-auto w-12 h-12 bg-hushh-lime/10 rounded-full flex items-center justify-center text-hushh-lime">
                                            <ImageIcon size={24} />
                                        </div>
                                        <div className="text-sm font-medium text-gray-600">Click to upload community logo</div>
                                        <input type="file" className="hidden" onChange={e => setImageFile(e.target.files[0])} accept="image/*" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-hushh-grey flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-hushh-lime hover:bg-hushh-lime/90 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 shadow-sm transition-all disabled:opacity-50"
                        >
                            <Save size={18} />
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Other system status cards */}
            <div className="bg-white rounded-2xl border border-hushh-grey shadow-sm overflow-hidden mt-8">
                <div className="p-4 bg-blue-grey border-b border-hushh-grey">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Infrastructure Status</h2>
                </div>
                <div className="divide-y divide-hushh-grey">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                            <Database className="text-hushh-lime" size={20} />
                            <span className="text-sm font-medium text-gray-700">Supabase Connection</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                            <ImageIcon className="text-hushh-lime" size={20} />
                            <span className="text-sm font-medium text-gray-700">Cloudinary Media Storage</span>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

