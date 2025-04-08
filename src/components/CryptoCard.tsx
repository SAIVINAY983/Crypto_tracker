
import React, { useState, useEffect } from 'react';
import { Cryptocurrency } from '../utils/cryptoApi';

interface CryptoCardProps {
  crypto: Cryptocurrency;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto }) => {
  const [priceClass, setPriceClass] = useState('');
  const [animateClass, setAnimateClass] = useState('');
  const [lastPrice, setLastPrice] = useState(crypto.current_price);

  useEffect(() => {
    // Apply animation when price changes
    if (crypto.current_price !== lastPrice) {
      if (crypto.current_price > lastPrice) {
        setAnimateClass('animate-price-pulse-up');
      } else if (crypto.current_price < lastPrice) {
        setAnimateClass('animate-price-pulse-down');
      }
      
      // Clear animation after it completes
      setTimeout(() => setAnimateClass(''), 1000);
      
      // Update last price
      setLastPrice(crypto.current_price);
    }
  }, [crypto.current_price, lastPrice]);

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };

  return (
    <div className={`crypto-card ${animateClass}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
          <div>
            <h3 className="font-bold">{crypto.name}</h3>
            <span className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold">${crypto.current_price.toLocaleString()}</div>
          <div 
            className={crypto.price_change_percentage_24h >= 0 ? "price-up" : "price-down"}
          >
            {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'} 
            {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <div>Market Cap: {formatNumber(crypto.market_cap)}</div>
        <div>Volume: {formatNumber(crypto.total_volume)}</div>
      </div>
    </div>
  );
};

export default CryptoCard;
