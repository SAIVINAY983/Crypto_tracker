import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:3000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setSubmitted(true);
                toast.success('Reset link sent! Check your email.');
            } else {
                toast.error(data.error || 'Something went wrong');
            }
        } catch (err) {
            toast.error('Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl">
                    <h2 className="text-3xl font-bold mb-2 text-center">Forgot Password</h2>
                    <p className="text-muted-foreground text-center mb-8">
                        Enter your email and we'll send you a link to reset your password.
                    </p>

                    {submitted ? (
                        <div className="text-center space-y-4">
                            <div className="bg-primary/10 text-primary p-4 rounded-lg border border-primary/20">
                                Check your email for the reset link!
                            </div>
                            <Link to="/login" className="block text-primary hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                            <div className="text-center">
                                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Remembered your password? Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;
