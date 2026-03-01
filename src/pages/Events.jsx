import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Calendar as CalendarIcon, Users } from 'lucide-react';
import api from '../api';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', event_date: '', location: '', price: 0, is_paid: false, image_url: '', capacity: 0 });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events');
            setEvents(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    const handleEditClick = (event) => {
        setEditingEvent(event);
        setNewEvent({
            ...event,
            event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : ''
        });
        setShowModal(true);
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await api.delete(`/events/${id}`);
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalImageUrl = newEvent.image_url;

            if (imageFile) {
                try {
                    const formData = new FormData();
                    formData.append('image', imageFile);
                    const uploadRes = await api.post('/images/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    finalImageUrl = uploadRes.data.url;
                } catch (uploadErr) {
                    console.error('Image upload failed:', uploadErr.response?.data || uploadErr.message);
                    alert(`Image upload failed: ${uploadErr.response?.data?.error || uploadErr.message}`);
                    return;
                }
            }

            const dataToSubmit = { ...newEvent, image_url: finalImageUrl };

            if (editingEvent) {
                await api.put(`/events/${editingEvent.id}`, dataToSubmit);
            } else {
                await api.post('/events', dataToSubmit);
            }

            setShowModal(false);
            setEditingEvent(null);
            setImageFile(null);
            setNewEvent({ title: '', description: '', event_date: '', location: '', price: 0, is_paid: false, image_url: '', capacity: 0 });
            fetchEvents();
        } catch (error) {
            console.error('Error saving event:', error);
            alert(`Failed to save event: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-hushh-black">Event Management</h1>
                <button
                    onClick={() => {
                        setEditingEvent(null);
                        setNewEvent({ title: '', description: '', event_date: '', location: '', price: 0, is_paid: false, image_url: '', capacity: 0 });
                        setShowModal(true);
                    }}
                    className="bg-hushh-lime hover:bg-hushh-lime/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus size={18} />
                    <span>Create Event</span>
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="mt-1 w-full px-4 py-2 text-hushh-black border border-hushh-grey rounded-lg focus:ring-2 focus:ring-hushh-lime focus:border-hushh-lime" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="mt-1 w-full px-4 py-2 text-hushh-black border border-hushh-grey rounded-lg focus:ring-2 focus:ring-hushh-lime focus:border-hushh-lime" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                                <input type="datetime-local" required value={newEvent.event_date} onChange={e => setNewEvent({ ...newEvent, event_date: e.target.value })} className="mt-1 w-full px-4 py-2 text-hushh-black border border-hushh-grey rounded-lg focus:ring-2 focus:ring-hushh-lime focus:border-hushh-lime" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input type="text" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} className="mt-1 w-full px-4 py-2 text-hushh-black border border-hushh-grey rounded-lg focus:ring-2 focus:ring-hushh-lime focus:border-hushh-lime" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Event Image</label>
                                <div className="mt-1 flex items-center space-x-4">
                                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" checked={newEvent.is_paid} onChange={e => setNewEvent({ ...newEvent, is_paid: e.target.checked })} className="rounded text-hushh-lime focus:ring-hushh-lime border-hushh-grey" />
                                    <span className="text-sm font-medium text-gray-700">Is Paid Event</span>
                                </label>
                                {newEvent.is_paid && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500">₹</span>
                                        <input type="number" min="0" step="0.01" placeholder="Price" value={newEvent.price} onChange={e => setNewEvent({ ...newEvent, price: Number(e.target.value) })} className="w-24 px-3 py-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Capacity (0 for Unlimited)</label>
                                <input type="number" value={newEvent.capacity} onChange={e => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })} className="mt-1 w-full px-4 py-2 text-hushh-black border border-hushh-grey rounded-lg focus:ring-2 focus:ring-hushh-lime focus:border-hushh-lime" />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-hushh-lime text-white rounded-lg hover:bg-hushh-lime/90 transition-colors font-medium shadow-sm">
                                    {editingEvent ? 'Save Changes' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-center p-8 text-gray-500">Loading events...</div>
            ) : events.length === 0 ? (
                <div className="text-center p-8 text-gray-500">No events found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden relative">
                                <img src={event.image_url || 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=300'} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute top-3 right-3 flex space-x-2">
                                    <button onClick={() => handleEditClick(event)} className="bg-white/90 backdrop-blur p-2 rounded-lg text-gray-700 hover:text-hushh-lime shadow-sm transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteEvent(event.id)} className="bg-white/90 backdrop-blur p-2 rounded-lg text-gray-700 hover:text-red-500 border border-hushh-grey shadow-sm transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-hushh-black mb-2 truncate">{event.title}</h3>
                                <div className="space-y-2 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <CalendarIcon size={16} className="text-gray-400" />
                                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Users size={16} className="text-gray-400" />
                                        <span>{event.capacity ? `${event.joined || 0} / ${event.capacity} Registered` : 'Unlimited Capacity'}</span>
                                    </div>
                                </div>
                                {event.capacity && (
                                    <div className="w-full bg-hushh-grey rounded-full h-2 mb-2">
                                        <div className="bg-hushh-lime h-2 rounded-full" style={{ width: `${(Math.min((event.joined || 0) / event.capacity * 100, 100))}%` }}></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
