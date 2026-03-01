import React from 'react';
import { supabase } from '../supabaseClient';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) console.error('Error logging in:', error.message);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-hushh-black">Hushh Connect</h2>
                    <p className="mt-2 text-sm text-gray-600">Admin Administration Portal</p>
                </div>
                <div className="mt-8 space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-hushh-lime hover:bg-hushh-lime/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hushh-lime transition-all shadow-md"
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <LogIn className="h-5 w-5 text-white/50 group-hover:text-white" />
                        </span>
                        Sign in with Google
                    </button>
                    <p className="text-center text-xs text-gray-400">
                        Authorized users only. access is restricted.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
