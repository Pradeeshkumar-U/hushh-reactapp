import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Plus, Layout, ArrowRight } from 'lucide-react';
import api from '../api';

const CommunitySelector = () => {
    const { selectCommunity, user } = useAuth();
    const [colleges, setColleges] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState(null);

    const [showCollegeModal, setShowCollegeModal] = useState(false);
    const [showCommunityModal, setShowCommunityModal] = useState(false);

    const [newCollege, setNewCollege] = useState({ name: '', domain: '' });
    const [newCommunity, setNewCommunity] = useState({ title: '', description: '', image_url: '' });
    const [communityImageFile, setCommunityImageFile] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchColleges();
    }, []);

    const fetchColleges = async () => {
        try {
            const res = await api.get('/colleges');
            setColleges(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch colleges:", err);
            setLoading(false);
        }
    };

    const fetchCommunities = async (collegeId) => {
        setLoading(true);
        try {
            const res = await api.get(`/communities?college_id=${collegeId}`);
            setCommunities(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch communities:", err);
            setLoading(false);
        }
    };

    const handleCreateCollege = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/colleges', newCollege);
            setColleges([...colleges, res.data]);
            setShowCollegeModal(false);
            setNewCollege({ name: '', domain: '' });
        } catch (err) {
            console.error("Failed to create college:", err);
        }
    };

    const handleCreateCommunity = async (e) => {
        e.preventDefault();
        try {
            let finalImageUrl = newCommunity.image_url;

            if (communityImageFile) {
                const formData = new FormData();
                formData.append('image', communityImageFile);
                const uploadRes = await api.post('/images/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageUrl = uploadRes.data.url;
            }

            const res = await api.post('/communities', {
                ...newCommunity,
                created_by: user.id,
                college_id: selectedCollege.id,
                image_url: finalImageUrl
            });
            setCommunities([...communities, res.data]);
            setShowCommunityModal(false);
            setNewCommunity({ title: '', description: '', image_url: '' });
            setCommunityImageFile(null);
        } catch (err) {
            console.error("Failed to create community:", err);
            alert("Failed to create community. Check your network or image size.");
        }
    };

    const handleSelectCollege = (college) => {
        setSelectedCollege(college);
        fetchCommunities(college.id);
    };

    if (loading) return <div className="text-center p-8 text-gray-500">Loading...</div>;

    if (!selectedCollege) {
        return (
            <div className="min-h-screen bg-blue-grey p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-hushh-black">Select College</h1>
                        <p className="text-gray-500 mt-2">First, choose a college to access its communities.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <button
                            onClick={() => setShowCollegeModal(true)}
                            className="h-48 flex flex-col items-center justify-center space-y-3 bg-white border-2 border-dashed border-hushh-grey rounded-2xl hover:border-hushh-lime hover:bg-hushh-lime/5 transition-all group"
                        >
                            <div className="bg-hushh-lime/10 p-3 rounded-full text-hushh-lime group-hover:bg-hushh-lime group-hover:text-white transition-colors">
                                <Plus size={24} />
                            </div>
                            <span className="font-semibold text-hushh-black">Add New College</span>
                        </button>

                        {colleges.map(college => (
                            <div
                                key={college.id}
                                onClick={() => handleSelectCollege(college)}
                                className="bg-white p-6 rounded-2xl border border-hushh-grey shadow-sm hover:shadow-md hover:border-hushh-lime/50 cursor-pointer transition-all group flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="bg-hushh-lime/10 w-10 h-10 rounded-lg flex items-center justify-center text-hushh-lime">
                                        <Layout size={20} />
                                    </div>
                                    <h3 className="font-bold text-hushh-black">{college.name}</h3>
                                    <p className="text-sm text-gray-500 truncate">{college.domain}</p>
                                </div>
                                <div className="flex items-center text-hushh-lime text-sm font-semibold mt-4">
                                    <span>Select College</span>
                                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showCollegeModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                            <h2 className="text-xl font-bold mb-4 text-hushh-black">New College</h2>
                            <form onSubmit={handleCreateCollege} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">College Name</label>
                                    <input
                                        type="text" required
                                        value={newCollege.name}
                                        onChange={e => setNewCollege({ ...newCollege, name: e.target.value })}
                                        className="mt-1 w-full px-4 py-2 border border-hushh-grey rounded-xl focus:ring-2 focus:ring-hushh-lime outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Domain (Optional)</label>
                                    <input
                                        type="text"
                                        value={newCollege.domain}
                                        onChange={e => setNewCollege({ ...newCollege, domain: e.target.value })}
                                        className="mt-1 w-full px-4 py-2 border border-hushh-grey rounded-xl focus:ring-2 focus:ring-hushh-lime outline-none"
                                        placeholder="e.g. kriet.edu"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button type="button" onClick={() => setShowCollegeModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-hushh-lime text-white rounded-xl hover:bg-hushh-lime/90 font-semibold shadow-sm">Save College</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-grey p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setSelectedCollege(null)}
                        className="text-sm font-semibold text-hushh-lime flex items-center hover:underline"
                    >
                        <ArrowRight size={16} className="rotate-180 mr-1" />
                        Back to Colleges
                    </button>
                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selected College</p>
                        <p className="text-lg font-bold text-hushh-black">{selectedCollege.name}</p>
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-hushh-black">Select Community</h1>
                    <p className="text-gray-500 mt-2">Manage communities within {selectedCollege.name}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button
                        onClick={() => setShowCommunityModal(true)}
                        className="h-48 flex flex-col items-center justify-center space-y-3 bg-white border-2 border-dashed border-hushh-grey rounded-2xl hover:border-hushh-lime hover:bg-hushh-lime/5 transition-all group"
                    >
                        <div className="bg-hushh-lime/10 p-3 rounded-full text-hushh-lime group-hover:bg-hushh-lime group-hover:text-white transition-colors">
                            <Plus size={24} />
                        </div>
                        <span className="font-semibold text-hushh-black">Create Community</span>
                    </button>

                    {communities.map(community => (
                        <div
                            key={community.id}
                            onClick={() => selectCommunity(community.community_id || community.id)}
                            className="bg-white overflow-hidden rounded-2xl border border-hushh-grey shadow-sm hover:shadow-md hover:border-hushh-lime/50 cursor-pointer transition-all group flex flex-col"
                        >
                            <div className="h-32 bg-gray-100 relative">
                                {community.image_url ? (
                                    <img src={community.image_url} alt={community.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-hushh-lime/20">
                                        <Layout size={48} />
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex flex-col flex-1 justify-between">
                                <div className="space-y-3">
                                    <h3 className="font-bold text-hushh-black">{community.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">{community.description}</p>
                                </div>
                                <div className="flex items-center text-hushh-lime text-sm font-semibold mt-4">
                                    <span>Go to Dashboard</span>
                                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showCommunityModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4 text-hushh-black">New Community</h2>
                        <form onSubmit={handleCreateCommunity} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Community Name</label>
                                <input
                                    type="text" required
                                    value={newCommunity.title}
                                    onChange={e => setNewCommunity({ ...newCommunity, title: e.target.value })}
                                    className="mt-1 w-full px-4 py-2 border border-hushh-grey rounded-xl focus:ring-2 focus:ring-hushh-lime outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={newCommunity.description}
                                    onChange={e => setNewCommunity({ ...newCommunity, description: e.target.value })}
                                    className="mt-1 w-full px-4 py-2 border border-hushh-grey rounded-xl focus:ring-2 focus:ring-hushh-lime outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Community Image</label>
                                <input
                                    type="file" accept="image/*"
                                    onChange={e => setCommunityImageFile(e.target.files[0])}
                                    className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-hushh-lime/10 file:text-hushh-lime hover:file:bg-hushh-lime/20"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => { setShowCommunityModal(false); setCommunityImageFile(null); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-hushh-lime text-white rounded-xl hover:bg-hushh-lime/90 font-semibold shadow-sm">Save Community</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunitySelector;
