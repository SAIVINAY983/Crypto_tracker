import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Shield, Zap, TrendingUp, Presentation, CheckCircle, Mail, MessageSquare } from 'lucide-react';
import Header from '../components/Header';
import { useCryptoPrices } from '../utils/cryptoApi';

const Landing = () => {
    const { cryptos } = useCryptoPrices();
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-hidden">
            <Header />

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative pt-20 pb-32">

                {/* Animated Background Elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] -z-10 animate-pulse-slow object-delay-[2000ms]"></div>

                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 backdrop-blur border border-border text-sm mb-4">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        CryptoPal Oracle v2.0 is Live
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 dark:from-white dark:to-white/60 drop-shadow-sm">
                        Master the Market with <br />
                        <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Precision</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        Real-time analytics, stunning visualizations, and actionable intelligence for the modern crypto investor.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Link
                            to="/dashboard"
                            className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(22,199,132,0.4)] flex items-center gap-2"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                            <span className="relative">Launch Dashboard</span>
                            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <a
                            href="#features"
                            className="px-8 py-4 bg-secondary/50 hover:bg-secondary text-secondary-foreground font-semibold rounded-full backdrop-blur transition-all border border-border/50 hover:border-border"
                        >
                            Explore Features
                        </a>
                    </div>
                </div>
            </main>

            {/* Live Ticker Section */}
            {!cryptos.length ? null : (
                <div className="w-full bg-card/80 backdrop-blur-md border-y border-border py-3 overflow-hidden flex whitespace-nowrap">
                    <div className="animate-ticker inline-flex items-center gap-8 px-4">
                        {[...cryptos, ...cryptos].map((coin, index) => (
                            <div key={`${coin.id}-${index}`} className="flex items-center gap-3">
                                <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                                <span className="font-semibold text-foreground">{coin.symbol.toUpperCase()}</span>
                                <span className="text-muted-foreground">${coin.current_price.toLocaleString()}</span>
                                <span className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-crypto-positive' : 'text-crypto-negative'}`}>
                                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Features Section */}
            <section id="features" className="py-24 bg-card/30 border-t border-border/50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                            Everything you need to trade smarter
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            A comprehensive suite of tools designed to give you an edge in the crypto markets.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-card border border-border/50 p-8 rounded-2xl shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">Real-Time Data</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Connect directly to CoinGecko for up-to-the-second price action, market cap, and volume tracking capabilities.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-card border border-border/50 p-8 rounded-2xl shadow-lg hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="h-12 w-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BarChart2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">Advanced Visuals</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Searchable interactive history graphs, micro-sparklines, and beautiful responsive portfolio analytics.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-card border border-border/50 p-8 rounded-2xl shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">Secure Architecture</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Your data is protected by robust caching servers and local SQLite databases for maximum reliability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-background relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                            Start Tracking in 3 Steps
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop Only) */}
                        <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 -z-10"></div>

                        {/* Step 1 */}
                        <div className="text-center relative">
                            <div className="w-24 h-24 mx-auto bg-card border border-primary/20 rounded-full flex items-center justify-center text-3xl font-bold shadow-[0_0_30px_rgba(22,199,132,0.1)] mb-6 z-10">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-2">Create an Account</h3>
                            <p className="text-muted-foreground">Sign up securely and get instant access to live market feeds.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center relative">
                            <div className="w-24 h-24 mx-auto bg-card border border-primary/20 rounded-full flex items-center justify-center text-3xl font-bold shadow-[0_0_30px_rgba(22,199,132,0.1)] mb-6 z-10">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-2">Build Your Portfolio</h3>
                            <p className="text-muted-foreground">Add your existing assets and let the platform track their real-time value.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center relative">
                            <div className="w-24 h-24 mx-auto bg-card border border-primary/20 rounded-full flex items-center justify-center text-3xl font-bold shadow-[0_0_30px_rgba(22,199,132,0.1)] mb-6 z-10">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-2">Analyze & Win</h3>
                            <p className="text-muted-foreground">Leverage our advanced charting tools to find your next winning trade.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-card/30 border-y border-border/50 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -z-10"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Trusted by Crypto Traders
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-background/50 backdrop-blur border border-border/50 p-8 rounded-2xl relative">
                            <div className="text-primary mb-4">
                                ★★★★★
                            </div>
                            <p className="text-foreground/90 italic mb-6">"CryptoPal Oracle completely changed how I track my Ethereum bags. The speed is unmatched."</p>
                            <div className="font-semibold">— Sarah Jenkins, Day Trader</div>
                        </div>

                        <div className="bg-background/50 backdrop-blur border border-border/50 p-8 rounded-2xl relative transform md:-translate-y-4">
                            <div className="text-primary mb-4">
                                ★★★★★
                            </div>
                            <p className="text-foreground/90 italic mb-6">"Finally, a dashboard that doesn't feel cluttered. The dark mode aesthetics are absolutely stunning, and the portfolio accuracy is spot on."</p>
                            <div className="font-semibold">— Mike T., Web3 Developer</div>
                        </div>

                        <div className="bg-background/50 backdrop-blur border border-border/50 p-8 rounded-2xl relative">
                            <div className="text-primary mb-4">
                                ★★★★★
                            </div>
                            <p className="text-foreground/90 italic mb-6">"The currency converter alone makes this my go-to tab every morning. Highly recommended for actively managing multiple wallets."</p>
                            <div className="font-semibold">— David Chen, Investor</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section className="py-24 bg-background relative" id="contact">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                            Get in Touch
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Have questions about our premium API plans or need support? We're here to help.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto bg-card/50 backdrop-blur-md border border-border/50 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                        {/* Decorative background glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -z-10"></div>

                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! We will get back to you shortly."); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-foreground/80">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="John Doe"
                                        className="w-full bg-background border border-border/50 rounded-lg px-4 py-3 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-foreground/80">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-background border border-border/50 rounded-lg pl-10 pr-4 py-3 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-foreground/80">Your Message</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        placeholder="How can we help you dominate the market today?"
                                        className="w-full bg-background border border-border/50 rounded-lg pl-10 pr-4 py-3 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans resize-y"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all shadow-lg hover:shadow-primary/25 flex justify-center items-center gap-2 group"
                            >
                                Send Message
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 relative text-center px-4">
                <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Ready to dominate the market?
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Join thousands of traders who have already given themselves the analytical edge.
                    </p>
                    <div className="pt-4">
                        <Link
                            to="/register"
                            className="inline-flex px-10 py-5 bg-foreground text-background font-bold text-lg rounded-full hover:bg-foreground/90 transition-transform hover:scale-105"
                        >
                            Create Free Account
                        </Link>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" /> No credit card required.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} CryptoPal Oracle. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
