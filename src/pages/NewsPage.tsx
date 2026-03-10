import React from 'react';
import Header from '../components/Header';
import CryptoNews from '../components/CryptoNews';
import { useCryptoNews } from '../utils/cryptoApi';

const NewsPage = () => {
    const { news, sentimentSummary, loading: newsLoading, error: newsError } = useCryptoNews();

    const overallSentiment = sentimentSummary?.sentiment === 'BULLISH' ? '🟢 Bullish' : sentimentSummary?.sentiment === 'BEARISH' ? '🔴 Bearish' : '⚪ Neutral';
    const sentimentColor = sentimentSummary?.sentiment === 'BULLISH' ? 'text-green-400' : sentimentSummary?.sentiment === 'BEARISH' ? 'text-red-400' : 'text-muted-foreground';

    // Default percentages if summarize is missing, though backend should provide it
    const bullPct = sentimentSummary?.sentiment === 'BULLISH' ? 70 : sentimentSummary?.sentiment === 'BEARISH' ? 20 : 40;
    const bearPct = sentimentSummary?.sentiment === 'BEARISH' ? 70 : sentimentSummary?.sentiment === 'BULLISH' ? 10 : 30;
    const neuPct = 100 - bullPct - bearPct;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="container py-8 flex-1">
                <h2 className="text-3xl font-bold">Latest Crypto News</h2>
                <p className="text-muted-foreground mb-6">Stay updated with the market's latest trends and movements.</p>

                {/* AI Market Sentiment Banner */}
                {!newsLoading && news.length > 0 && (
                    <div className="crypto-card mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Today's AI Market Mood</p>
                            <div className={`text-2xl font-bold ${sentimentColor}`}>{overallSentiment}</div>
                            <p className="text-xs text-muted-foreground mt-1">Based on {news.length} analysed headlines</p>
                        </div>
                        <div className="flex gap-6 text-center">
                            <div><div className="text-xl font-bold text-green-400">{bullPct}%</div><div className="text-xs text-muted-foreground">Bullish</div></div>
                            <div><div className="text-xl font-bold text-muted-foreground">{neuPct}%</div><div className="text-xs text-muted-foreground">Neutral</div></div>
                            <div><div className="text-xl font-bold text-red-400">{bearPct}%</div><div className="text-xs text-muted-foreground">Bearish</div></div>
                        </div>
                        {/* Sentiment Bar */}
                        <div className="w-full sm:w-48 h-3 rounded-full overflow-hidden bg-secondary flex">
                            <div className="bg-green-400 h-full" style={{ width: `${bullPct}%` }} />
                            <div className="bg-muted h-full" style={{ width: `${neuPct}%` }} />
                            <div className="bg-red-400 h-full" style={{ width: `${bearPct}%` }} />
                        </div>
                    </div>
                )}

                <section>
                    <CryptoNews news={news} loading={newsLoading} error={newsError} />
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

export default NewsPage;
