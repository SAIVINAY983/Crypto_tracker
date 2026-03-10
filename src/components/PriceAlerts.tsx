import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/apiConfig';
import { Cryptocurrency } from '../utils/cryptoApi';
import { Bell, Trash2, Plus, AlertCircle } from 'lucide-react';

interface PriceAlert {
    id: string;
    cryptoId: string;
    symbol: string;
    targetPrice: number;
    direction: 'ABOVE' | 'BELOW';
    triggered: boolean;
    createdAt: string;
}

interface PriceAlertsProps {
    cryptos: Cryptocurrency[];
}

const PriceAlerts: React.FC<PriceAlertsProps> = ({ cryptos }) => {
    const { token } = useAuth();
    const [alerts, setAlerts] = useState<PriceAlert[]>([]);
    const [selectedCryptoId, setSelectedCryptoId] = useState('');
    const [targetPrice, setTargetPrice] = useState('');
    const [direction, setDirection] = useState<'ABOVE' | 'BELOW'>('ABOVE');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) return;
        fetch(`${API_BASE_URL}/api/alerts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setAlerts(data))
            .catch(err => console.error('Failed to fetch alerts:', err));
    }, [token]);

    const handleAddAlert = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCryptoId || !targetPrice || isNaN(Number(targetPrice))) return;

        setLoading(true);
        const crypto = cryptos.find(c => c.id === selectedCryptoId);

        try {
            const response = await fetch(`${API_BASE_URL}/api/alerts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cryptoId: selectedCryptoId,
                    symbol: crypto?.symbol || selectedCryptoId,
                    targetPrice: Number(targetPrice),
                    direction
                })
            });

            if (response.ok) {
                const newAlert = await response.json();
                setAlerts([newAlert, ...alerts]);
                setTargetPrice('');
                setSelectedCryptoId('');
            }
        } catch (err) {
            console.error('Failed to create alert:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAlert = async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/alerts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setAlerts(alerts.filter(a => a.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete alert:', err);
        }
    };

    return (
        <div className="crypto-card mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Price Alerts</h3>
            </div>

            <form onSubmit={handleAddAlert} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
                <select
                    className="bg-secondary rounded px-3 py-2 text-sm sm:col-span-1"
                    value={selectedCryptoId}
                    onChange={e => setSelectedCryptoId(e.target.value)}
                    required
                >
                    <option value="">Select Coin...</option>
                    {cryptos.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    className="bg-secondary rounded px-3 py-2 text-sm sm:col-span-1"
                    value={direction}
                    onChange={e => setDirection(e.target.value as 'ABOVE' | 'BELOW')}
                >
                    <option value="ABOVE">Above</option>
                    <option value="BELOW">Below</option>
                </select>

                <input
                    type="number"
                    step="any"
                    placeholder="Price (USD)"
                    className="bg-secondary rounded px-3 py-2 text-sm sm:col-span-1"
                    value={targetPrice}
                    onChange={e => setTargetPrice(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white rounded px-4 py-2 text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </form>

            <div className="space-y-3">
                {alerts.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">No active price alerts.</p>
                ) : (
                    alerts.map(alert => {
                        const crypto = cryptos.find(c => c.id === alert.cryptoId);
                        const isTriggered = alert.triggered;

                        return (
                            <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg border ${isTriggered ? 'bg-primary/5 border-primary/20' : 'bg-secondary/50 border-border/50'}`}>
                                <div className="flex items-center gap-3">
                                    {crypto ? (
                                        <img src={crypto.image} alt={alert.symbol} className="w-6 h-6 rounded-full" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 text-muted-foreground" />
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{alert.symbol.toUpperCase()}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${alert.direction === 'ABOVE' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {alert.direction === 'ABOVE' ? 'Goes Above' : 'Goes Below'}
                                            </span>
                                        </div>
                                        <div className="text-sm font-semibold">${alert.targetPrice.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {isTriggered && (
                                        <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded shadow-sm font-bold">TRIGGERED</span>
                                    )}
                                    <button
                                        onClick={() => handleDeleteAlert(alert.id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PriceAlerts;
