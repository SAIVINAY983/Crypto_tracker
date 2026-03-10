import React from 'react';
import Header from '../components/Header';
import CryptoCard from '../components/CryptoCard';
import CryptoChartViewer from '../components/CryptoChartViewer';
import CoinWatchlist from '../components/CoinWatchlist';
import PriceAlerts from '../components/PriceAlerts';
import { useCryptoPrices } from '../utils/cryptoApi';

const Index = () => {
  const { cryptos, loading: cryptosLoading, error: cryptosError } = useCryptoPrices();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 space-y-8">
        <section id="dashboard">
          {!cryptosLoading && !cryptosError && cryptos.length > 0 && (
            <>
              <CoinWatchlist cryptos={cryptos} />
              <PriceAlerts cryptos={cryptos} />
            </>
          )}
          <h2 className="text-xl font-bold mb-4">Top Cryptocurrencies</h2>
          {cryptosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="crypto-card h-28"></div>
              ))}
            </div>
          ) : cryptosError ? (
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-crypto-negative">{cryptosError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cryptos.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))}
            </div>
          )}
        </section>
        <section className="mt-8 mb-8">
          {!cryptosLoading && !cryptosError && cryptos.length > 0 && (
            <div className="crypto-card">
              <CryptoChartViewer cryptos={cryptos} />
            </div>
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
    </div >
  );
};

export default Index;
