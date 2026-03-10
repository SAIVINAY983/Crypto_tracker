import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Please enter a valid email address (e.g. user@example.com)." })
        .refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val), {
            message: "Email must include a domain (e.g. user@gmail.com)."
        }),
    password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    // After login, go back to the page the user came from (or /dashboard by default)
    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange'  // validate on every keystroke
    });

    // Extra client-side safety guard
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

import { API_BASE_URL } from '../utils/apiConfig';

    const onSubmit = async (data: LoginFormValues) => {
        // Hard guard: reject bad email even if Zod somehow passed it
        if (!EMAIL_REGEX.test(data.email)) {
            toast({ title: "Invalid Email", description: "Please enter a proper email address (e.g. you@example.com).", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to login');
            }

            login(result.user, result.token);
            toast({ title: "Success!", description: "You have been logged in successfully." });
            navigate(from, { replace: true });
        } catch (error: any) {
            toast({ title: "Login Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-xl p-8 relative overflow-hidden">
                    {/* Decorative glowing orb */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[64px] -z-10"></div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                        <p className="text-muted-foreground text-sm">Enter your credentials to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground/80">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="email"
                                    {...register('email')}
                                    className={`w-full bg-background border ${errors.email ? 'border-destructive' : 'border-input'} rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register('password')}
                                    className={`w-full bg-background border ${errors.password ? 'border-destructive' : 'border-input'} rounded-lg py-2.5 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account? <Link to="/register" className="text-primary hover:underline font-semibold">Sign Up</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
