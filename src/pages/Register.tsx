import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import { Mail, Lock, Phone, Loader2, Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Please enter a valid email address (e.g. user@example.com)." }),
    phone: z
        .string()
        .min(1, { message: "Phone number is required." })
        .regex(
            /^\+?[1-9]\d{9,14}$/,
            { message: "Enter a valid phone number with country code (e.g. +919876543210). Must be 10–15 digits." }
        ),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password." })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange'   // show errors in real-time as user types
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, phone: data.phone, password: data.password })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to register');
            }

            login(result.user, result.token);
            toast({ title: "Welcome!", description: "Your account has been securely created." });
            navigate('/dashboard');
        } catch (error: any) {
            toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
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
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[64px] -z-10"></div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                        <p className="text-muted-foreground text-sm">Join the next generation crypto analytics platform.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-foreground/80">Email Address</label>
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

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-foreground/80">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="tel"
                                    {...register('phone')}
                                    className={`w-full bg-background border ${errors.phone ? 'border-destructive' : 'border-input'} rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow`}
                                    placeholder="+1234567890"
                                />
                            </div>
                            {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-foreground/80">Password</label>
                            <div className="relative">
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

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-foreground/80">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register('confirmPassword')}
                                    className={`w-full bg-background border ${errors.confirmPassword ? 'border-destructive' : 'border-input'} rounded-lg py-2.5 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account? <Link to="/login" className="text-primary hover:underline font-semibold">Log In</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
