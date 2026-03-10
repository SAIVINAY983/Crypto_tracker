
import { useState, useEffect } from 'react';
import { API_BASE_URL } from './apiConfig';

export interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface CryptoNews {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  sentiment?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  sentimentScore?: number;
}

// Mock data while we don't have real API integration
const generateSparkline = (base: number, volatility: number) => {
  let current = base;
  return Array.from({ length: 168 }, () => {
    current = current + (Math.random() - 0.5) * volatility;
    return current;
  });
};

const mockCryptos: Cryptocurrency[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 63589.42,
    price_change_percentage_24h: 2.45,
    market_cap: 1245678987654,
    total_volume: 32456789876,
    sparkline_in_7d: { price: generateSparkline(60000, 1000) }
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3045.67,
    price_change_percentage_24h: -1.23,
    market_cap: 367890987654,
    total_volume: 19876543210,
    sparkline_in_7d: { price: generateSparkline(3000, 50) }
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.58,
    price_change_percentage_24h: 0.34,
    market_cap: 31245678987,
    total_volume: 1523456789,
    sparkline_in_7d: { price: generateSparkline(0.5, 0.01) }
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.46,
    price_change_percentage_24h: -2.56,
    market_cap: 16234567898,
    total_volume: 543234567,
    sparkline_in_7d: { price: generateSparkline(0.5, 0.01) }
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 125.78,
    price_change_percentage_24h: 4.89,
    market_cap: 54321987654,
    total_volume: 6543219876,
    sparkline_in_7d: { price: generateSparkline(120, 2) }
  }
];

const mockNews: CryptoNews[] = [
  {
    id: "1",
    title: "Bitcoin Hits New All-Time High Above $64,000",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
    source: "CoinDesk",
    publishedAt: "2023-04-08T14:30:00Z"
  },
  {
    id: "2",
    title: "Ethereum 2.0 Upgrade Scheduled for Next Month",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05",
    source: "CryptoNews",
    publishedAt: "2023-04-07T10:15:00Z"
  },
  {
    id: "3",
    title: "Major Bank Announces Cryptocurrency Custody Services",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692",
    source: "Bloomberg",
    publishedAt: "2023-04-06T18:45:00Z"
  }
];

// Simulated exchange rates
export const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151.86,
  INR: 83.42
};

export const useCryptoPrices = () => {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>(mockCryptos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/cryptos`);
        if (!response.ok) {
          throw new Error(`Failed to fetch cryptos: ${response.statusText}`);
        }
        const data = await response.json();

        // Map the data to only include the fields we need
        const mappedData: Cryptocurrency[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          symbol: item.symbol,
          image: item.image,
          current_price: item.current_price,
          price_change_percentage_24h: item.price_change_percentage_24h,
          market_cap: item.market_cap,
          total_volume: item.total_volume,
          sparkline_in_7d: item.sparkline_in_7d,
        }));

        setCryptos(mappedData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch cryptocurrency data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 60 seconds
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return { cryptos, loading, error };
};

export const useCryptoNews = () => {
  const [news, setNews] = useState<CryptoNews[]>(mockNews);
  const [sentimentSummary, setSentimentSummary] = useState<{ score: number, sentiment: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/news`);
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.statusText}`);
        }
        const data = await response.json();

        setNews(data.news || data); // handle both old and new format for safety
        if (data.summary) setSentimentSummary(data.summary);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, sentimentSummary, loading, error };
};

export const convertCrypto = (amount: number, fromCurrency: string, toCurrency: string, cryptos: Cryptocurrency[]) => {
  // Converting between cryptocurrencies or to fiat
  if (fromCurrency === toCurrency) return amount;

  const fromIsCrypto = !Object.keys(exchangeRates).includes(fromCurrency);
  const toIsCrypto = !Object.keys(exchangeRates).includes(toCurrency);

  // Both are cryptocurrencies
  if (fromIsCrypto && toIsCrypto) {
    const fromCrypto = cryptos.find(c => c.symbol.toUpperCase() === fromCurrency.toUpperCase());
    const toCrypto = cryptos.find(c => c.symbol.toUpperCase() === toCurrency.toUpperCase());

    if (!fromCrypto || !toCrypto) return 0;

    // Convert via USD
    return amount * (fromCrypto.current_price / toCrypto.current_price);
  }

  // From crypto to fiat
  if (fromIsCrypto && !toIsCrypto) {
    const fromCrypto = cryptos.find(c => c.symbol.toUpperCase() === fromCurrency.toUpperCase());
    if (!fromCrypto) return 0;

    // Convert to USD first, then to target currency
    const valueInUsd = amount * fromCrypto.current_price;
    return valueInUsd * exchangeRates[toCurrency as keyof typeof exchangeRates];
  }

  // From fiat to crypto
  if (!fromIsCrypto && toIsCrypto) {
    const toCrypto = cryptos.find(c => c.symbol.toUpperCase() === toCurrency.toUpperCase());
    if (!toCrypto) return 0;

    // Convert to USD first, then to crypto
    const valueInUsd = amount / exchangeRates[fromCurrency as keyof typeof exchangeRates];
    return valueInUsd / toCrypto.current_price;
  }

  // Both are fiat currencies
  const fromRate = exchangeRates[fromCurrency as keyof typeof exchangeRates];
  const toRate = exchangeRates[toCurrency as keyof typeof exchangeRates];

  if (!fromRate || !toRate) return 0;

  return amount * (1 / fromRate) * toRate;
};
