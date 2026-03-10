import React from 'react';
import Header from '../components/Header';
import PortfolioTracker from '../components/PortfolioTracker';
import PortfolioHistoryChart from '../components/PortfolioHistoryChart';
import { useCryptoPrices } from '../utils/cryptoApi';

const PortfolioPage = () => {
    const { cryptos, loading: cryptosLoading, error: cryptosError } = useCryptoPrices();

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container py-8 space-y-8">
                <h2 className="text-3xl font-bold">Your Crypto Tracker</h2>
                <p className="text-muted-foreground mb-8">Manage and track your crypto investments in real-time.</p>

                <PortfolioHistoryChart />

                <section>
                    {cryptosLoading ? (
                        <div className="crypto-card h-64 animate-pulse"></div>
                    ) : cryptosError ? (
                        <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-crypto-negative">{cryptosError}</p>
                        </div>
                    ) : (
                        <PortfolioTracker cryptocurrencies={cryptos} />
                    )}
                </section>
            </main>

            <footer className="bg-card border-t border-border py-6 mt-16 mt-auto">
                <div className="container">
                    <p className="text-center text-muted-foreground">
                        © 2025 CryptoPal Oracle. Data is for demonstration purposes only.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PortfolioPage;
