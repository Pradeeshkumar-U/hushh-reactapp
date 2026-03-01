import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [communityId, setCommunityId] = useState(localStorage.getItem('selected_community_id'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session) {
                // Clear community on logout
                setCommunityId(null);
                localStorage.removeItem('selected_community_id');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const selectCommunity = (id) => {
        setCommunityId(id);
        localStorage.setItem('selected_community_id', id);
    };

    return (
        <AuthContext.Provider value={{ user, communityId, selectCommunity, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
