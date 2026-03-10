import React from 'react';
import Header from '../components/Header';
import CryptoConverter from '../components/CryptoConverter';
import { useCryptoPrices } from '../utils/cryptoApi';

const ConverterPage = () => {
    const { cryptos, loading: cryptosLoading, error: cryptosError } = useCryptoPrices();

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container py-8 space-y-8">
                <h2 className="text-3xl font-bold">Currency Converter</h2>
                <p className="text-muted-foreground mb-8">Quickly swap and calculate values across different cryptocurrencies.</p>

                <section>
                    {cryptosLoading ? (
                        <div className="crypto-card h-64 animate-pulse"></div>
                    ) : cryptosError ? (
                        <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-crypto-negative">{cryptosError}</p>
                        </div>
                    ) : (
                        <CryptoConverter cryptocurrencies={cryptos} />
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

export default ConverterPage;
