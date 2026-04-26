
"use client";
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function AuthForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, user, token: contextToken } = useAuth();
    const [step, setStep] = useState<'EMAIL' | 'OTP' | 'NAME'>('EMAIL');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle OAuth Callback
    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            // We need to fetch the user profile using this token to log them in fully
            // For now, we decode it or fetch from /auth/me or simply let AuthContext hydrate from it.
            // But we actually need the User object for the `login` function.
            // Let's create an anonymous user object if we don't have one, or fetch /users/me
            const hydrateOAuthUser = async () => {
                try {
                    setLoading(true);
                    const res = await fetch('http://localhost:4000/users/me', {
                        headers: { Authorization: `Bearer ${tokenFromUrl}` }
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        login(tokenFromUrl, userData);
                        router.replace('/explorer');
                    } else {
                        throw new Error('Could not fetch user profile');
                    }
                } catch (e) {
                    // Fallback if /users/me doesn't exist or fails
                    // Decode JWT minimally or just store it
                    try {
                        const payload = JSON.parse(atob(tokenFromUrl.split('.')[1]));
                        const fallbackUser = { id: payload.sub, email: payload.email, name: payload.name || 'User', role: payload.role || 'USER' };
                        login(tokenFromUrl, fallbackUser);
                        router.replace('/explorer');
                    } catch (decodeErr) {
                        setError('Invalid OAuth token received.');
                    }
                } finally {
                    setLoading(false);
                }
            };

            hydrateOAuthUser();
        }
    }, [searchParams, login, router]);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:4000/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) throw new Error('Failed to send OTP');
            setStep('OTP');
        } catch (err) {
            setError('Could not send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:4000/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            if (!res.ok) throw new Error('Invalid OTP');

            const data = await res.json();
            localStorage.setItem('token', data.access_token);

            // Check if user needs to set name
            if (!data.user.name) {
                setStep('NAME');
            } else {
                router.push('/explorer');
            }
        } catch (err) {
            setError('Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleNameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Need user ID - for now extract from token or assume response included it.
            // Ideally we get user object in verify response. Assuming we have user ID in token not easily accessible here without decoding.
            // Better approach: verify-otp response should include user ID.

            // Re-fetch user profile or decode token to get ID? 
            // Simplified: Assume we decoded token or stored user ID or fetch /auth/me

            // For this implementation, let's assume we can hit /users/me or decode locally
            // Given the complexity, let's alert user or just redirect for now if we can't easily get ID.
            // Wait, we stored 'token'. We can decode it or make an authenticated call to update 'me'.

            // Workaround: We will use the user object returned from verify-otp, but we didn't store it in state. 
            // Let's optimize: handleOtpSubmit should store user ID.

            // Re-implement logic efficiently below in component state.
        } catch (err) {
            setError('Failed to update name.');
        }
    };

    // Revised logic with state for user ID
    const [userId, setUserId] = useState('');

    const handleOtpSubmitWithId = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:4000/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            if (!res.ok) throw new Error('Invalid OTP');

            const data = await res.json();

            // Call the context login to update state across the app immediately
            login(data.access_token, data.user);
            setUserId(data.user.id);

            if (!data.user.name) {
                setStep('NAME');
            } else {
                router.push('/explorer');
            }
        } catch (err) {
            setError('Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalNameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`http://localhost:4000/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}` // If protected
                },
                body: JSON.stringify({ name }),
            });

            if (!res.ok) throw new Error('Update failed');

            // Update user's name in context
            if (user && contextToken) {
                const updatedUser = { ...user, name };
                login(contextToken, updatedUser);
            }

            router.push('/explorer');
        } catch (err) {
            setError('Could not update name');
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col pt-24 transition-colors duration-300">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">

                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-taxi-yellow/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                    <div className="text-center mb-8 relative z-10">
                        <div className="flex justify-center mb-6">
                            <img src="/bombayhub_logo.png" alt="Bombay Hub" className="h-20 w-auto object-contain dark:invert transition-all duration-300" />
                        </div>
                        <h1 className="text-3xl font-heading font-bold mb-2">
                            {step === 'EMAIL' && 'Welcome to Bombay'}
                            {step === 'OTP' && 'Verify It\'s You'}
                            {step === 'NAME' && 'One Last Thing'}
                        </h1>
                        <p className="text-foreground/60">
                            {step === 'EMAIL' && 'Enter your email to get started'}
                            {step === 'OTP' && `We sent a code to ${email}`}
                            {step === 'NAME' && 'What should we call you?'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={step === 'EMAIL' ? handleEmailSubmit : step === 'OTP' ? handleOtpSubmitWithId : handleFinalNameSubmit} className="space-y-6 relative z-10">
                        {step === 'EMAIL' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <label className="block text-sm font-medium text-foreground/60 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 dark:bg-asphalt-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-taxi-yellow transition-all text-foreground placeholder:text-foreground/30 focus:ring-1 focus:ring-taxi-yellow/20"
                                    placeholder="navimumbaikar@example.com"
                                    disabled={loading}
                                />
                            </div>
                        )}

                        {step === 'OTP' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <label className="block text-sm font-medium text-foreground/60 mb-2">Enter 6-digit Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    className="w-full bg-gray-50 dark:bg-asphalt-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-taxi-yellow transition-all text-foreground placeholder:text-foreground/30 text-center tracking-[0.5em] text-2xl font-mono focus:ring-1 focus:ring-taxi-yellow/20"
                                    placeholder="000000"
                                    disabled={loading}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setStep('EMAIL')}
                                    className="text-xs text-foreground/40 mt-2 hover:text-taxi-yellow transition-colors"
                                >
                                    Wrong email? Change it.
                                </button>
                            </div>
                        )}

                        {step === 'NAME' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <label className="block text-sm font-medium text-foreground/60 mb-2">Your Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 dark:bg-asphalt-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-taxi-yellow transition-all text-foreground placeholder:text-foreground/30 focus:ring-1 focus:ring-taxi-yellow/20"
                                    placeholder="Rohit Sharma"
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-taxi-yellow text-black font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg shadow-taxi-yellow/20"
                        >
                            {loading ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {step === 'EMAIL' && 'Continue with Email'}
                                    {step === 'OTP' && 'Verify & Login'}
                                    {step === 'NAME' && 'Complete Profile'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {step === 'EMAIL' && (
                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10 relative z-10">
                            <p className="text-center text-foreground/40 text-sm mb-4">Or continue with</p>
                            <div className="grid grid-cols-2 gap-4">
                                <a href="http://localhost:4000/auth/google" className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 transition-all hover:border-taxi-yellow/50">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                    <span className="text-sm font-medium">Google</span>
                                </a>
                                <a href="http://localhost:4000/auth/github" className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 transition-all hover:border-taxi-yellow/50">
                                    <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-5 h-5 dark:invert" alt="GitHub" />
                                    <span className="text-sm font-medium">GitHub</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>}>
            <AuthForm />
        </Suspense>
    );
}
