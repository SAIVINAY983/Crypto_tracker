
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for chart
const generateMockData = (priceChange: number, days: number) => {
  const basePrice = 30000; // Starting price
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    const randomFactor = Math.random() * 0.05 - 0.025;
    const trendFactor = (priceChange / 100) * (i / days);
    const dayPrice = basePrice * (1 + trendFactor + randomFactor);

    // For large timeframes, only every Nth point to keep chart clean
    const label = days <= 30
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    data.push({
      date: label,
      price: Math.round(dayPrice),
    });
  }

  return data;
};

interface PriceChartProps {
  cryptoId: string;
  name: string;
  symbol: string;
  priceChange: number;
  color?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({
  cryptoId,
  name,
  symbol,
  priceChange,
  color = '#3b82f6'
}) => {
  const [timeframe, setTimeframe] = useState('30d');

  const timeframeDays: Record<string, number> = { '24h': 1, '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
  const data = generateMockData(priceChange, timeframeDays[timeframe]);

  const getColor = () => {
    if (cryptoId === 'bitcoin') return '#F7931A';
    if (cryptoId === 'ethereum') return '#627EEA';
    if (cryptoId === 'ripple') return '#23292F';
    if (cryptoId === 'cardano') return '#0033AD';
    if (cryptoId === 'solana') return '#00FFA3';
    return color;
  };

  const chartColor = getColor();

  return (
    <div className="crypto-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{name} Price Chart</h3>
        <div className="flex gap-1">
          {['24h', '7d', '30d', '90d', '1y'].map(tf => (
            <button
              key={tf}
              className={`px-2 py-1 text-xs rounded font-semibold transition-colors ${timeframe === tf ? 'bg-primary text-white' : 'bg-secondary hover:bg-secondary/80'}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`color${cryptoId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.6} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={'preserveStartEnd'}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(23, 29, 40, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px'
              }}
              labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, symbol]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              fillOpacity={1}
              fill={`url(#color${cryptoId})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
