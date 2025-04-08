
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
        {news.map(item => (
          <div key={item.id} className="flex gap-4 p-3 bg-secondary rounded-lg">
            <div className="flex-shrink-0">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-24 h-16 object-cover rounded"
              />
            </div>
            <div className="flex flex-col justify-between">
              <h3 className="font-bold hover:text-primary">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{item.source}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(item.publishedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoNews;
