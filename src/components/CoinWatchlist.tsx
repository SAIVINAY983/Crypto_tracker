import React, { useState, useEffect } from 'react';
import { Cryptocurrency } from '../utils/cryptoApi';
import { API_BASE_URL } from '../utils/apiConfig';
import { Star, StarOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface WatchlistProps {
    cryptos: Cryptocurrency[];
}

// -- Watchlist Panel Component --
const CoinWatchlist: React.FC<WatchlistProps> = ({ cryptos }) => {
    const { token } = useAuth();
    const [watchedIds, setWatchedIds] = useState<string[]>([]);

    useEffect(() => {
        if (!token) return;
        fetch(`${API_BASE_URL}/api/watchlist`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => setWatchedIds((data || []).map((i: any) => i.cryptoId)))
            .catch(() => { });
    }, [token]);

    const remove = async (cryptoId: string) => {
        if (!token) return;
        await fetch(`${API_BASE_URL}/api/watchlist/${cryptoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setWatchedIds(prev => prev.filter(id => id !== cryptoId));
    };

    const watched = cryptos.filter(c => watchedIds.includes(c.id));

    if (watched.length === 0) return (
        <div className="crypto-card mb-4">
            <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <h3 className="font-bold text-sm">Watchlist</h3>
            </div>
            <p className="text-muted-foreground text-xs">Star any coin card to add it to your watchlist.</p>
        </div>
    );

    return (
        <div className="crypto-card mb-4">
            <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <h3 className="font-bold text-sm">Watchlist ({watched.length})</h3>
            </div>
            <div className="flex flex-wrap gap-3">
                {watched.map(coin => {
                    const isUp = coin.price_change_percentage_24h >= 0;
                    return (
                        <div key={coin.id} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 border border-border/50">
                            <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                            <span className="font-semibold text-sm">{coin.symbol.toUpperCase()}</span>
                            <span className="font-bold text-sm">${coin.current_price.toLocaleString()}</span>
                            <span className={`text-xs font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                                {isUp ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                            </span>
                            <button onClick={() => remove(coin.id)} className="ml-1 text-muted-foreground hover:text-red-400 transition-colors">
                                <StarOff className="w-3 h-3" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export { CoinWatchlist };
export type { WatchlistProps };

// -- StarToggle: Used inside each CryptoCard --
const StarToggle = ({ id }: { id: string }) => {
    const { token } = useAuth();
    const [watched, setWatched] = useState(false);

    useEffect(() => {
        if (!token) return;
        fetch(`${API_BASE_URL}/api/watchlist`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => setWatched((data || []).some((i: any) => i.cryptoId === id)))
            .catch(() => { });
    }, [token, id]);

    const toggle = async () => {
        if (!token) return;
        if (watched) {
            await fetch(`${API_BASE_URL}/api/watchlist/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } else {
            const res = await fetch(`${API_BASE_URL}/api/watchlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ cryptoId: id })
            });
        }
        setWatched(prev => !prev);
    };

    return (
        <button onClick={toggle} title={watched ? 'Remove from watchlist' : 'Add to watchlist'}
            className={`p-1 rounded transition-colors ${watched ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`}>
            {watched ? <Star className="w-4 h-4 fill-yellow-400" /> : <Star className="w-4 h-4" />}
        </button>
    );
};

export default CoinWatchlist;
export { StarToggle };
