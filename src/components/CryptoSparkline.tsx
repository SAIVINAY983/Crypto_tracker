import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface CryptoSparklineProps {
    data: number[];
    isPositive: boolean;
    height?: number;
    width?: number | string;
}

const CryptoSparkline: React.FC<CryptoSparklineProps> = ({
    data,
    isPositive,
    height = 40,
    width = '100%'
}) => {
    if (!data || data.length === 0) return null;

    // Transform simple array for Recharts
    const chartData = data.map((price, i) => ({ price, id: i }));
    const color = isPositive ? '#16c784' : '#ea3943';

    return (
        <div style={{ height, width }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.1} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#gradient-${color})`}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CryptoSparkline;
