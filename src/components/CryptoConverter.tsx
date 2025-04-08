
import React, { useState, useEffect } from 'react';
import { Cryptocurrency, convertCrypto, exchangeRates } from '../utils/cryptoApi';

interface CryptoConverterProps {
  cryptocurrencies: Cryptocurrency[];
}

const CryptoConverter: React.FC<CryptoConverterProps> = ({ cryptocurrencies }) => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('BTC');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [result, setResult] = useState<number>(0);
  
  // Available currencies (both crypto and fiat)
  const currencies = [
    ...cryptocurrencies.map(crypto => crypto.symbol.toUpperCase()),
    ...Object.keys(exchangeRates)
  ];
  
  useEffect(() => {
    // Calculate conversion
    const convertedAmount = convertCrypto(
      amount,
      fromCurrency,
      toCurrency,
      cryptocurrencies
    );
    setResult(convertedAmount);
  }, [amount, fromCurrency, toCurrency, cryptocurrencies]);
  
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  return (
    <div id="converter" className="crypto-card">
      <h2 className="text-xl font-bold mb-4">Currency Converter</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block mb-2 text-sm">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-secondary rounded px-3 py-2"
              min="0"
              step="any"
            />
          </div>
          
          <div className="grid grid-cols-5 gap-4 items-center mb-4">
            <div className="col-span-2">
              <label className="block mb-2 text-sm">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full bg-secondary rounded px-3 py-2"
              >
                {currencies.map((currency) => (
                  <option key={`from-${currency}`} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                ⇄
              </button>
            </div>
            
            <div className="col-span-2">
              <label className="block mb-2 text-sm">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full bg-secondary rounded px-3 py-2"
              >
                {currencies.map((currency) => (
                  <option key={`to-${currency}`} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center items-center p-6 bg-secondary rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">Converted Amount</div>
          <div className="text-3xl font-bold mb-2">
            {result.toLocaleString('en-US', {
              maximumFractionDigits: 8,
            })}
          </div>
          <div className="text-muted-foreground">{toCurrency}</div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Exchange rates are updated every minute. All conversions are approximate.</p>
      </div>
    </div>
  );
};

export default CryptoConverter;
