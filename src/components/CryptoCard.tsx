import React, { useState, useEffect } from 'react';
import { Cryptocurrency } from '../utils/cryptoApi';
import { StarToggle } from './CoinWatchlist';

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

  const formatNumber = (num: number) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };

  // AI Short-Term Trend Predictor
  const predictTrend = () => {
    const change24h = crypto.price_change_percentage_24h;
    const sparkline = crypto.sparkline_in_7d?.price || [];

    // Calculate recent momentum: compare last 24 data pts vs prior 24
    let momentum = 0;
    if (sparkline.length >= 48) {
      const recent = sparkline.slice(-24).reduce((a, b) => a + b, 0) / 24;
      const prior = sparkline.slice(-48, -24).reduce((a, b) => a + b, 0) / 24;
      momentum = ((recent - prior) / prior) * 100;
    }

    const score = change24h * 0.6 + momentum * 0.4;

    if (score > 1.5) return { label: '▲ Uptrend', color: 'bg-green-500/15 text-green-400 border border-green-500/30' };
    if (score < -1.5) return { label: '▼ Downtrend', color: 'bg-red-500/15 text-red-400 border border-red-500/30' };
    return { label: '→ Sideways', color: 'bg-muted/70 text-muted-foreground border border-border' };
  };

  const prediction = predictTrend();

  // To ensure the chart doesn't overflow the rounded corners, use overflow-hidden
  return (
    <div className={`crypto-card overflow-hidden flex flex-col ${animateClass}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
          <div>
            <h3 className="font-bold">{crypto.name}</h3>
            <span className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarToggle id={crypto.id} />
          <div className="font-bold">${crypto.current_price.toLocaleString()}</div>
          <div
            className={crypto.price_change_percentage_24h >= 0 ? "price-up" : "price-down"}
          >
            {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}
            {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-muted-foreground mt-4">
        <div>MCap: {formatNumber(crypto.market_cap)}</div>
        <div>Vol: {formatNumber(crypto.total_volume)}</div>
      </div>

      {/* AI Short-Term Trend Prediction */}
      <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">AI Trend</span>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${prediction.color}`}>
          {prediction.label}
        </span>
      </div>
    </div>
  );
};

export default CryptoCard;
