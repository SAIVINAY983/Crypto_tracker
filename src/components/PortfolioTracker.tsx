
import React, { useState, useEffect } from 'react';
import { Cryptocurrency } from '../utils/cryptoApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TransactionHistory } from './TransactionHistory';
import { useAuth } from '../context/AuthContext';
import CryptoSparkline from './CryptoSparkline';

interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  amount: number;
  priceAtTransaction: number;
  createdAt: string;
}

interface PortfolioEntry {
  id?: string;
  cryptoId: string;
  symbol: string;
  amount: number;
  transactions?: Transaction[];
}

interface PortfolioTrackerProps {
  cryptocurrencies: Cryptocurrency[];
}

const PortfolioTracker: React.FC<PortfolioTrackerProps> = ({ cryptocurrencies }) => {
  const { token } = useAuth();
  const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [cashBalance, setCashBalance] = useState<number | null>(null);
  const [newCryptoId, setNewCryptoId] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    // Fetch initial portfolio from backend
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/portfolio', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Backward compatibility or new format
          if (Array.isArray(data)) {
            setPortfolio(data);
          } else {
            setPortfolio(data.portfolio || []);
            setCashBalance(data.balance);
          }
        }
      } catch (err) {
        console.error('Failed to fetch portfolio:', err);
      }
    };
    fetchPortfolio();
  }, [token]);

  useEffect(() => {
    // Calculate total portfolio value
    const value = portfolio.reduce((sum, entry) => {
      const crypto = cryptocurrencies.find(c => c.id === entry.cryptoId);
      return sum + (crypto ? crypto.current_price * entry.amount : 0);
    }, 0);

    setTotalValue(value);
  }, [portfolio, cryptocurrencies]);

  useEffect(() => {
    // Record a snapshot of the net worth automatically on value load
    if (cashBalance !== null && (totalValue > 0 || cashBalance >= 0)) {
      const netWorth = cashBalance + totalValue;
      fetch('http://127.0.0.1:3000/api/portfolio/snapshot', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ totalValue: netWorth })
      }).catch(err => console.error("Failed to snapshot:", err));
    }
  }, [cashBalance, totalValue]);

  const handleAddCrypto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCryptoId || !newAmount || isNaN(Number(newAmount))) return;

    const crypto = cryptocurrencies.find(c => c.id === newCryptoId);
    if (!crypto) return;

    try {
      // Add entry to backend
      const response = await fetch('http://127.0.0.1:3000/api/portfolio/buy', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          cryptoId: newCryptoId,
          symbol: crypto.symbol,
          amount: Number(newAmount),
          currentPrice: crypto.current_price
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to buy crypto');
      }

      // Re-fetch portfolio to get the updated aggregated data
      const refreshResponse = await fetch('http://127.0.0.1:3000/api/portfolio', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (refreshResponse.ok) {
        const updatedData = await refreshResponse.json();
        if (Array.isArray(updatedData)) {
          setPortfolio(updatedData);
        } else {
          setPortfolio(updatedData.portfolio || []);
          setCashBalance(updatedData.balance);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to buy crypto');
      console.error('Failed to buy crypto:', err);
    }

    // Reset form
    setNewCryptoId('');
    setNewAmount('');
  };

  const handleSellCrypto = async (cryptoId: string, maxAmount: number) => {
    const amountToSellStr = prompt(`How much would you like to sell? (Max: ${maxAmount})`);
    if (!amountToSellStr) return;

    const amountToSell = Number(amountToSellStr);
    if (isNaN(amountToSell) || amountToSell <= 0 || amountToSell > maxAmount) {
      alert("Invalid amount.");
      return;
    }

    const crypto = cryptocurrencies.find(c => c.id === cryptoId);
    if (!crypto) return;

    try {
      const response = await fetch('http://127.0.0.1:3000/api/portfolio/sell', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          cryptoId: cryptoId,
          amount: amountToSell,
          currentPrice: crypto.current_price
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sell crypto');
      }

      // Re-fetch portfolio
      const refreshResponse = await fetch('http://127.0.0.1:3000/api/portfolio', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (refreshResponse.ok) {
        const updatedData = await refreshResponse.json();
        if (Array.isArray(updatedData)) {
          setPortfolio(updatedData);
        } else {
          setPortfolio(updatedData.portfolio || []);
          setCashBalance(updatedData.balance);
        }
      }
    } catch (err: any) {
      alert(err.message);
      console.error('Failed to sell crypto:', err);
    }
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

  // Calculate average cost basis and P&L for a holding
  const calcPnL = (entry: PortfolioEntry, currentPrice: number) => {
    const buyTxns = (entry.transactions || []).filter(t => t.type === 'BUY');
    const totalCost = buyTxns.reduce((s, t) => s + t.priceAtTransaction * t.amount, 0);
    const totalBought = buyTxns.reduce((s, t) => s + t.amount, 0);
    const avgBuyPrice = totalBought > 0 ? totalCost / totalBought : 0;
    const currentValue = currentPrice * entry.amount;
    const costBasis = avgBuyPrice * entry.amount;
    const pnl = currentValue - costBasis;
    const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    return { pnl, pnlPct, avgBuyPrice };
  };

  return (
    <div id="portfolio" className="crypto-card">
      <h2 className="text-xl font-bold mb-4">Asset Tracker</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
              <h3 className="font-bold mb-1 text-primary">Buying Power</h3>
              <div className="text-3xl font-bold">{cashBalance !== null ? '$' + cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '...'}</div>
            </div>
            <div className="bg-secondary p-4 rounded-xl border border-border/50">
              <h3 className="font-bold mb-1">Tracked Assets Value</h3>
              <div className="text-3xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>

          <h3 className="font-bold mb-2">Holdings</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {portfolio.map((entry, index) => {
              const crypto = cryptocurrencies.find(c => c.id === entry.cryptoId);
              const value = crypto ? crypto.current_price * entry.amount : 0;
              const { pnl, pnlPct, avgBuyPrice } = crypto
                ? calcPnL(entry, crypto.current_price)
                : { pnl: 0, pnlPct: 0, avgBuyPrice: 0 };
              const isProfit = pnl >= 0;

              return (
                <div key={index} className="flex flex-col p-4 bg-secondary rounded-xl border border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                  {/* Top Header Row */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      {crypto && <img src={crypto.image} alt={entry.symbol} className="w-10 h-10 rounded-full" />}
                      <div>
                        <div className="font-bold text-lg leading-tight">{entry.symbol.toUpperCase()}</div>
                        <div className="text-xs text-muted-foreground">{entry.amount.toLocaleString()} coins</div>
                      </div>
                    </div>

                    <div className="flex-1 max-w-[120px] mx-4 hidden sm:block">
                      {crypto?.sparkline_in_7d && (
                        <CryptoSparkline
                          data={crypto.sparkline_in_7d.price}
                          isPositive={crypto.price_change_percentage_24h >= 0}
                        />
                      )}
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg">${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className={`text-xs font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                        {isProfit ? '▲' : '▼'} ${Math.abs(pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isProfit ? '+' : ''}{pnlPct.toFixed(2)}%)
                      </div>
                    </div>
                  </div>

                  {/* Stats & Actions Row */}
                  <div className="flex justify-between items-center text-xs py-2 border-t border-border/30">
                    <div className="flex gap-4">
                      <div className="text-muted-foreground">Portfolio: <span className="text-foreground font-semibold">{((value / totalValue) * 100).toFixed(1)}%</span></div>
                      {avgBuyPrice > 0 && <div className="text-muted-foreground">Avg Cost: <span className="text-foreground font-semibold">${avgBuyPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>}
                    </div>

                    <button
                      onClick={() => handleSellCrypto(entry.cryptoId, entry.amount)}
                      className="px-3 py-1 bg-destructive/10 hover:bg-destructive/20 text-destructive text-[10px] font-bold rounded uppercase tracking-wider transition-colors"
                    >
                      Sell Asset
                    </button>
                  </div>

                  {/* Transaction History Dropdown */}
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <TransactionHistory transactions={entry.transactions || []} symbol={entry.symbol} />
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
            <div className="h-full flex items-center justify-center text-muted-foreground text-center px-4">
              Add cryptocurrencies to see your asset distribution
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioTracker;
