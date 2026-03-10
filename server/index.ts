import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth';
import path from 'path';
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET: string = process.env.JWT_SECRET || 'fallback_secret_for_dev';

// ─── Auth Middleware ────────────────────────────────────────────────────────
interface AuthRequest extends Request { userId?: string; }

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided. Please log in.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Invalid token format.' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.userId = decoded.id;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
};
// ────────────────────────────────────────────────────────────────────────────


app.use(cors());
app.use(express.json());

// Connect to MongoDB for Authentication
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crypto-pal';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB (Auth DB)'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Register Auth Routes
app.use('/api/auth', authRoutes);

// Serve static files from the React app
const frontendDistPath = path.resolve(__dirname, process.env.NODE_ENV === 'production' ? '../../dist' : '../dist');
app.use(express.static(frontendDistPath));

// Handle React routing, return all requests to React app
app.get('(.*)', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

let cryptoCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000 * 5; // 5 minutes

const generateSparkline = (base: number, volatility: number) => {
    let current = base;
    return Array.from({ length: 168 }, () => {
        current = current + (Math.random() - 0.5) * volatility;
        return current;
    });
};

const fallbackData = [
    { id: "bitcoin", name: "Bitcoin", symbol: "btc", image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png", current_price: 63589.42, price_change_percentage_24h: 2.45, market_cap: 1245678987654, total_volume: 32456789876, sparkline_in_7d: { price: generateSparkline(60000, 1000) } },
    { id: "ethereum", name: "Ethereum", symbol: "eth", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png", current_price: 3045.67, price_change_percentage_24h: -1.23, market_cap: 367890987654, total_volume: 19876543210, sparkline_in_7d: { price: generateSparkline(3000, 50) } },
    { id: "tether", name: "Tether", symbol: "usdt", image: "https://assets.coingecko.com/coins/images/325/large/Tether.png", current_price: 1, price_change_percentage_24h: 0, market_cap: 80000000000, total_volume: 30000000000, sparkline_in_7d: { price: Array(168).fill(1) } },
    { id: "binancecoin", name: "BNB", symbol: "bnb", image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png", current_price: 580.45, price_change_percentage_24h: 1.2, market_cap: 89000000000, total_volume: 1200000000, sparkline_in_7d: { price: generateSparkline(550, 10) } },
    { id: "solana", name: "Solana", symbol: "sol", image: "https://assets.coingecko.com/coins/images/4128/large/solana.png", current_price: 125.78, price_change_percentage_24h: 4.89, market_cap: 54321987654, total_volume: 6543219876, sparkline_in_7d: { price: generateSparkline(100, 5) } },
    { id: "ripple", name: "XRP", symbol: "xrp", image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png", current_price: 0.58, price_change_percentage_24h: 0.34, market_cap: 31245678987, total_volume: 1523456789, sparkline_in_7d: { price: generateSparkline(0.5, 0.01) } },
];

// Proxy CoinGecko API to avoid CORS and caching limits locally
app.get('/api/cryptos', async (req, res) => {
    try {
        const now = Date.now();
        if (cryptoCache && (now - lastFetchTime < CACHE_DURATION)) {
            return res.json(cryptoCache);
        }

        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true');
        if (!response.ok) {
            throw new Error(`CoinGecko API returned ${response.status}`);
        }
        const data = await response.json();
        cryptoCache = data;
        lastFetchTime = now;
        res.json(data);
    } catch (error) {
        console.error('Error fetching cryptos from CoinGecko:', error);
        if (cryptoCache) {
            console.log('Serving from stale cache');
            res.json(cryptoCache);
        } else {
            console.log('Serving fallback data due to rate limits');
            res.json(fallbackData);
        }
    }
});

let newsCache: any = null;
let lastNewsFetchTime = 0;
const NEWS_CACHE_DURATION = 60 * 1000 * 15; // 15 minutes

const fallbackNews = [
    {
        id: "1",
        title: "Bitcoin Hits New All-Time High Above $64,000",
        url: "#",
        imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
        source: "CoinDesk",
        publishedAt: new Date().toISOString()
    },
    {
        id: "2",
        title: "Ethereum Upgrade Scheduled for Next Month",
        url: "#",
        imageUrl: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05",
        source: "CryptoNews",
        publishedAt: new Date().toISOString()
    }
];

import Sentiment from 'sentiment';

const sentimentAnalyzer = new Sentiment();

// Live News API Route
app.get('/api/news', async (req, res) => {
    try {
        const now = Date.now();
        if (newsCache && (now - lastNewsFetchTime < NEWS_CACHE_DURATION)) {
            return res.json(newsCache);
        }

        // Fetch live news from CryptoCompare
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        if (!response.ok) {
            throw new Error(`News API returned ${response.status}`);
        }
        const data = await response.json();

        // Analyze sentiment and map to frontend expected structure
        let totalScore = 0;
        const mappedNews = data.Data.slice(0, 5).map((item: any) => {
            const analysis = sentimentAnalyzer.analyze(item.title);
            totalScore += analysis.score;

            let label = 'NEUTRAL';
            if (analysis.score > 0) label = 'BULLISH';
            if (analysis.score < 0) label = 'BEARISH';

            return {
                id: item.id,
                title: item.title,
                url: item.url,
                imageUrl: item.imageurl,
                source: item.source_info.name,
                publishedAt: new Date(item.published_on * 1000).toISOString(),
                sentiment: label,
                sentimentScore: analysis.score
            };
        });

        const overallScore = totalScore / mappedNews.length;
        const result = {
            news: mappedNews,
            summary: {
                score: overallScore,
                sentiment: overallScore > 0.5 ? 'BULLISH' : overallScore < -0.5 ? 'BEARISH' : 'NEUTRAL'
            }
        };

        newsCache = result;
        lastNewsFetchTime = now;
        res.json(result);
    } catch (error) {
        console.error('Error fetching live news:', error);
        if (newsCache) {
            console.log('Serving from stale news cache');
            res.json(newsCache);
        } else {
            console.log('Serving fallback news');
            res.json(fallbackNews);
        }
    }
});

// Helper to get or create PaperAccount (per user)
async function getOrCreatePaperAccount(userId: string) {
    let account = await prisma.paperAccount.findUnique({ where: { userId } });
    if (!account) {
        account = await prisma.paperAccount.create({ data: { userId, cashBalance: 100000.0 } });
    }
    return account;
}

// ─── Portfolio Routes (Protected) ─────────────────────────────────────────
app.get('/api/portfolio', verifyToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const portfolio = await prisma.portfolioItem.findMany({
            where: { userId },
            include: { transactions: { orderBy: { createdAt: 'desc' } } }
        });
        const account = await getOrCreatePaperAccount(userId);
        res.json({ portfolio, balance: account.cashBalance });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
});

app.get('/api/portfolio/history', verifyToken, async (req: AuthRequest, res) => {
    try {
        const snapshots = await prisma.portfolioSnapshot.findMany({
            where: { userId: req.userId! },
            orderBy: { timestamp: 'asc' }
        });
        res.json(snapshots);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.post('/api/portfolio/snapshot', verifyToken, async (req: AuthRequest, res) => {
    const { totalValue } = req.body;
    try {
        const snapshot = await prisma.portfolioSnapshot.create({
            data: { userId: req.userId!, totalValue: Number(totalValue) }
        });
        res.json(snapshot);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save snapshot' });
    }
});

app.post('/api/portfolio/buy', verifyToken, async (req: AuthRequest, res) => {
    const { cryptoId, symbol, amount, currentPrice } = req.body;
    const userId = req.userId!;
    try {
        const account = await getOrCreatePaperAccount(userId);
        const cost = Number(amount) * Number(currentPrice);

        if (account.cashBalance < cost) {
            return res.status(400).json({ error: 'Insufficient funds in Paper Account' });
        }

        await prisma.paperAccount.update({
            where: { userId },
            data: { cashBalance: account.cashBalance - cost }
        });

        let portfolioItem = await prisma.portfolioItem.findFirst({
            where: { userId, cryptoId }
        });

        if (!portfolioItem) {
            portfolioItem = await prisma.portfolioItem.create({
                data: { userId, cryptoId, symbol, amount: 0 }
            });
        }

        await prisma.transaction.create({
            data: {
                portfolioItemId: portfolioItem.id,
                type: 'BUY',
                amount: Number(amount),
                priceAtTransaction: Number(currentPrice)
            }
        });

        const updatedItem = await prisma.portfolioItem.update({
            where: { id: portfolioItem.id },
            data: { amount: portfolioItem.amount + Number(amount) },
            include: { transactions: true }
        });

        res.json(updatedItem);
    } catch (error) {
        console.error('Buy Error:', error);
        res.status(500).json({ error: 'Failed to process BUY transaction' });
    }
});

app.post('/api/portfolio/sell', verifyToken, async (req: AuthRequest, res) => {
    const { cryptoId, amount, currentPrice } = req.body;
    const userId = req.userId!;
    try {
        const portfolioItem = await prisma.portfolioItem.findFirst({
            where: { userId, cryptoId }
        });

        if (!portfolioItem || portfolioItem.amount < Number(amount)) {
            return res.status(400).json({ error: 'Insufficient balance to sell' });
        }

        const account = await getOrCreatePaperAccount(userId);
        const proceeds = Number(amount) * Number(currentPrice);

        await prisma.paperAccount.update({
            where: { userId },
            data: { cashBalance: account.cashBalance + proceeds }
        });

        await prisma.transaction.create({
            data: {
                portfolioItemId: portfolioItem.id,
                type: 'SELL',
                amount: Number(amount),
                priceAtTransaction: Number(currentPrice)
            }
        });

        const updatedItem = await prisma.portfolioItem.update({
            where: { id: portfolioItem.id },
            data: { amount: portfolioItem.amount - Number(amount) },
            include: { transactions: true }
        });

        res.json(updatedItem);
    } catch (error) {
        console.error('Sell Error:', error);
        res.status(500).json({ error: 'Failed to process SELL transaction' });
    }
});

// ─── Watchlist Routes (Protected) ──────────────────────────────────────────
app.get('/api/watchlist', verifyToken, async (req: AuthRequest, res) => {
    try {
        const items = await prisma.watchlistItem.findMany({ where: { userId: req.userId! } });
        res.json(items);
    } catch { res.status(500).json({ error: 'Failed to fetch watchlist' }); }
});

app.post('/api/watchlist', verifyToken, async (req: AuthRequest, res) => {
    const { cryptoId } = req.body;
    try {
        const item = await prisma.watchlistItem.upsert({
            where: { userId_cryptoId: { userId: req.userId!, cryptoId } },
            update: {},
            create: { userId: req.userId!, cryptoId }
        });
        res.json(item);
    } catch { res.status(500).json({ error: 'Failed to add to watchlist' }); }
});

app.delete('/api/watchlist/:cryptoId', verifyToken, async (req: AuthRequest, res) => {
    try {
        await prisma.watchlistItem.deleteMany({ where: { userId: req.userId!, cryptoId: req.params.cryptoId as string } });
        res.json({ success: true });
    } catch { res.status(500).json({ error: 'Failed to remove from watchlist' }); }
});

// ─── Price Alert Routes (Protected) ────────────────────────────────────────
app.get('/api/alerts', verifyToken, async (req: AuthRequest, res) => {
    try {
        const alerts = await prisma.priceAlert.findMany({
            where: { userId: req.userId! },
            orderBy: { createdAt: 'desc' }
        });
        res.json(alerts);
    } catch { res.status(500).json({ error: 'Failed to fetch alerts' }); }
});

app.post('/api/alerts', verifyToken, async (req: AuthRequest, res) => {
    const { cryptoId, symbol, targetPrice, direction } = req.body;
    if (!cryptoId || !targetPrice || !direction) {
        return res.status(400).json({ error: 'cryptoId, targetPrice, and direction are required.' });
    }
    try {
        const alert = await prisma.priceAlert.create({
            data: { userId: req.userId!, cryptoId, symbol, targetPrice: Number(targetPrice), direction }
        });
        res.json(alert);
    } catch { res.status(500).json({ error: 'Failed to create alert' }); }
});

app.delete('/api/alerts/:id', verifyToken, async (req: AuthRequest, res) => {
    try {
        await prisma.priceAlert.deleteMany({ where: { id: req.params.id as string, userId: req.userId! } });
        res.json({ success: true });
    } catch { res.status(500).json({ error: 'Failed to delete alert' }); }
});

// ─── Price Alert Processor ──────────────────────────────────────────────────
const checkPriceAlerts = async () => {
    if (!cryptoCache || cryptoCache.length === 0) return;

    try {
        const activeAlerts = await prisma.priceAlert.findMany({ where: { triggered: false } });
        for (const alert of activeAlerts) {
            const coin = cryptoCache.find((c: any) => c.id === alert.cryptoId);
            if (!coin) continue;

            let isTriggered = false;
            if (alert.direction === 'ABOVE' && coin.current_price >= alert.targetPrice) {
                isTriggered = true;
            } else if (alert.direction === 'BELOW' && coin.current_price <= alert.targetPrice) {
                isTriggered = true;
            }

            if (isTriggered) {
                console.log(`🔔 ALERT TRIGGERED: ${alert.symbol} hit ${coin.current_price} (Target: ${alert.targetPrice})`);
                await prisma.priceAlert.update({
                    where: { id: alert.id },
                    data: { triggered: true }
                });
            }
        }
    } catch (err) {
        console.error('Error processing price alerts:', err);
    }
};

// Check alerts every 60 seconds
setInterval(checkPriceAlerts, 60 * 1000);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
