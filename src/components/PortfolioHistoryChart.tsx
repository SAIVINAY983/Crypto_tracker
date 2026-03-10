import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

interface Snapshot {
    id: string;
    totalValue: number;
    timestamp: string;
}

const PortfolioHistoryChart = () => {
    const { token } = useAuth();
    const [history, setHistory] = useState<Snapshot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('http://127.0.0.1:3000/api/portfolio/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                }
            } catch (err) {
                console.error("Failed to fetch historical snapshots:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token]);

    if (loading) {
        return <div className="crypto-card h-64 animate-pulse flex items-center justify-center">Loading Chart...</div>;
    }

    if (history.length === 0) {
        return (
            <div className="crypto-card mb-8 border-dashed border-2 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <AreaChart width={32} height={20} data={[{ v: 1 }, { v: 3 }, { v: 2 }, { v: 5 }]}>
                        <Area type="monotone" dataKey="v" stroke="#16c784" fill="#16c784" fillOpacity={0.2} />
                    </AreaChart>
                </div>
                <h3 className="text-lg font-bold mb-1">No history yet</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                    Start adding assets below to build your portfolio and track your net worth history!
                </p>
            </div>
        );
    }

    // Format data for Recharts
    const chartData = history.map(snap => ({
        time: new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(snap.timestamp).toLocaleDateString(),
        value: snap.totalValue
    }));

    // Calculate percent change from first to last
    const firstValue = chartData[0]?.value || 0;
    const lastValue = chartData[chartData.length - 1]?.value || 0;
    const percentChange = firstValue ? ((lastValue - firstValue) / firstValue) * 100 : 0;
    const isPositive = percentChange >= 0;

    return (
        <div className="crypto-card mb-8">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-xl font-bold">Net Worth History</h2>
                    <p className="text-muted-foreground text-sm">Tracking your combined Cash + Assets over time.</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold">${lastValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className={`text-sm font-semibold ${isPositive ? 'text-crypto-positive' : 'text-crypto-negative'}`}>
                        {isPositive ? '+' : ''}{percentChange.toFixed(2)}% All Time
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isPositive ? '#16c784' : '#ea3943'} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={isPositive ? '#16c784' : '#ea3943'} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
                        <XAxis
                            dataKey="time"
                            stroke="var(--muted-foreground)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            stroke="var(--muted-foreground)"
                            fontSize={12}
                            tickFormatter={(val) => `$${val.toLocaleString()}`}
                            tickLine={false}
                            axisLine={false}
                            width={80}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(23, 29, 40, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Net Worth']}
                            labelFormatter={(label, payload) => `${payload[0]?.payload.date} at ${label}`}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={isPositive ? '#16c784' : '#ea3943'}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PortfolioHistoryChart;
