
import React from 'react';
import Header from '../components/Header';
import CryptoCard from '../components/CryptoCard';
import PriceChart from '../components/PriceChart';
import PortfolioTracker from '../components/PortfolioTracker';
import CryptoNews from '../components/CryptoNews';
import CryptoConverter from '../components/CryptoConverter';
import { useCryptoPrices, useCryptoNews } from '../utils/cryptoApi';

const Index = () => {
  const { cryptos, loading: cryptosLoading, error: cryptosError } = useCryptoPrices();
  const { news, loading: newsLoading, error: newsError } = useCryptoNews();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        <section id="dashboard">
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
        
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {!cryptosLoading && !cryptosError && (
            <PriceChart 
              cryptoId={cryptos[0]?.id || 'bitcoin'}
              name={cryptos[0]?.name || 'Bitcoin'}
              symbol={cryptos[0]?.symbol || 'BTC'}
              priceChange={cryptos[0]?.price_change_percentage_24h || 0}
            />
          )}
          
          {!cryptosLoading && !cryptosError && cryptos.length > 1 && (
            <PriceChart 
              cryptoId={cryptos[1]?.id || 'ethereum'}
              name={cryptos[1]?.name || 'Ethereum'}
              symbol={cryptos[1]?.symbol || 'ETH'}
              priceChange={cryptos[1]?.price_change_percentage_24h || 0}
            />
          )}
        </section>
        
        <section>
          {!cryptosLoading && !cryptosError && (
            <PortfolioTracker cryptocurrencies={cryptos} />
          )}
        </section>
        
        <section>
          {!cryptosLoading && !cryptosError && (
            <CryptoConverter cryptocurrencies={cryptos} />
          )}
        </section>
        
        <section>
          <CryptoNews 
            news={news} 
            loading={newsLoading} 
            error={newsError} 
          />
        </section>
      </main>
      
      <footer className="bg-card border-t border-border py-6">
        <div className="container">
          <p className="text-center text-muted-foreground">
            © 2025 CryptoPal Oracle. Data is for demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
