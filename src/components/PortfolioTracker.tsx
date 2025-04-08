
import React, { useState, useEffect } from 'react';
import { Cryptocurrency } from '../utils/cryptoApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PortfolioEntry {
  cryptoId: string;
  symbol: string;
  amount: number;
}

interface PortfolioTrackerProps {
  cryptocurrencies: Cryptocurrency[];
}

const PortfolioTracker: React.FC<PortfolioTrackerProps> = ({ cryptocurrencies }) => {
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([
    { cryptoId: 'bitcoin', symbol: 'BTC', amount: 0.2 },
    { cryptoId: 'ethereum', symbol: 'ETH', amount: 1.5 },
    { cryptoId: 'cardano', symbol: 'ADA', amount: 100 }
  ]);
  const [newCryptoId, setNewCryptoId] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    // Calculate total portfolio value
    const value = portfolio.reduce((sum, entry) => {
      const crypto = cryptocurrencies.find(c => c.id === entry.cryptoId);
      return sum + (crypto ? crypto.current_price * entry.amount : 0);
    }, 0);
    
    setTotalValue(value);
  }, [portfolio, cryptocurrencies]);

  const handleAddCrypto = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCryptoId || !newAmount || isNaN(Number(newAmount))) return;
    
    const existingIndex = portfolio.findIndex(p => p.cryptoId === newCryptoId);
    
    if (existingIndex !== -1) {
      // Update existing entry
      const updatedPortfolio = [...portfolio];
      updatedPortfolio[existingIndex].amount += Number(newAmount);
      setPortfolio(updatedPortfolio);
    } else {
      // Add new entry
      const crypto = cryptocurrencies.find(c => c.id === newCryptoId);
      if (crypto) {
        setPortfolio([
          ...portfolio,
          {
            cryptoId: newCryptoId,
            symbol: crypto.symbol,
            amount: Number(newAmount)
          }
        ]);
      }
    }
    
    // Reset form
    setNewCryptoId('');
    setNewAmount('');
  };

  // Prepare data for pie chart
  const chartData = portfolio.map(entry => {
    const crypto = cryptocurrencies.find(c => c.id === entry.cryptoId);
    const value = crypto ? crypto.current_price * entry.amount : 0;
    
    return {
      name: entry.symbol.toUpperCase(),
      value,
    };
  });

  // Colors for pie chart
  const COLORS = ['#F7931A', '#627EEA', '#0033AD', '#00FFA3', '#23292F'];

  return (
    <div id="portfolio" className="crypto-card">
      <h2 className="text-xl font-bold mb-4">Portfolio Tracker</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-bold mb-2">Total Value</h3>
            <div className="text-3xl font-bold">${totalValue.toLocaleString()}</div>
          </div>
          
          <h3 className="font-bold mb-2">Holdings</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {portfolio.map((entry, index) => {
              const crypto = cryptocurrencies.find(c => c.id === entry.cryptoId);
              const value = crypto ? crypto.current_price * entry.amount : 0;
              
              return (
                <div key={index} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    {crypto && <img src={crypto.image} alt={entry.symbol} className="w-6 h-6" />}
                    <div>
                      <div className="font-bold">{entry.symbol.toUpperCase()}</div>
                      <div className="text-sm text-muted-foreground">{entry.amount} coins</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${value.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {((value / totalValue) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <form onSubmit={handleAddCrypto} className="mt-4 flex flex-col sm:flex-row gap-3">
            <select
              className="bg-secondary rounded px-3 py-2 flex-grow"
              value={newCryptoId}
              onChange={e => setNewCryptoId(e.target.value)}
              required
            >
              <option value="">Select cryptocurrency...</option>
              {cryptocurrencies.map(crypto => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </option>
              ))}
            </select>
            <input
              type="number"
              step="any"
              className="bg-secondary rounded px-3 py-2 w-full sm:w-32"
              value={newAmount}
              onChange={e => setNewAmount(e.target.value)}
              placeholder="Amount"
              required
            />
            <button type="submit" className="bg-primary text-white rounded px-4 py-2">
              Add
            </button>
          </form>
        </div>
        
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(23, 29, 40, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Add cryptocurrencies to see portfolio distribution
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioTracker;
