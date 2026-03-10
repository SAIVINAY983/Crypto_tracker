
import React from 'react';
import { CryptoNews as NewsItem } from '../utils/cryptoApi';

interface CryptoNewsProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
}

const CryptoNews: React.FC<CryptoNewsProps> = ({ news, loading, error }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Sentiment Badge Handler
  const getSentimentDetails = (label?: string) => {
    switch (label) {
      case 'BULLISH': return { label: 'BULLISH', color: 'text-crypto-positive bg-crypto-positive/10 border-crypto-positive/20 text-green-400' };
      case 'BEARISH': return { label: 'BEARISH', color: 'text-crypto-negative bg-crypto-negative/10 border-crypto-negative/20 text-red-500' };
      default: return { label: 'NEUTRAL', color: 'text-muted-foreground bg-muted border-border' };
    }
  };

  if (loading) {
    return (
      <div id="news" className="crypto-card">
        <h2 className="text-xl font-bold mb-4">Latest News</h2>
        <div className="flex items-center justify-center h-40">
          <p>Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="news" className="crypto-card">
        <h2 className="text-xl font-bold mb-4">Latest News</h2>
        <div className="flex items-center justify-center h-40">
          <p className="text-crypto-negative">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="news" className="crypto-card">
      <h2 className="text-xl font-bold mb-4">Latest News</h2>
      <div className="space-y-4">
        {news.map(item => {
          const sentiment = getSentimentDetails(item.sentiment);
          return (
            <div key={item.id} className="flex gap-4 p-4 bg-card rounded-lg border border-border/50 shadow-sm transition-all hover:border-primary/50">
              <div className="flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-24 h-16 object-cover rounded"
                />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <h3 className="font-bold hover:text-primary line-clamp-2 leading-tight">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center text-xs text-muted-foreground font-medium">
                    <span>{item.source}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${sentiment.color}`}>
                    {sentiment.label}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default CryptoNews;
