import React, { useState, useEffect } from 'react';
import { makeRateLimitedRequest } from '../utils/apiRateLimiter';

const AddHolding = ({ onAddHolding, coinData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Top coins for quick selection
  const topCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
    { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' }
  ];

  useEffect(() => {
    const searchCoins = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      try {
        const data = await makeRateLimitedRequest(
          `https://api.coingecko.com/api/v3/search?query=${searchQuery}`,
          false // Low priority for search
        );
        
        setSearchResults(data.coins.slice(0, 5));
        setShowResults(true);
      } catch (error) {
        if (error.message !== 'Rate limit exceeded') {
          console.error('Search error:', error);
        }
      }
    };

    const timeoutId = setTimeout(searchCoins, 600); // Increased debounce delay
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin);
    setSearchQuery(coin.name);
    setShowResults(false);
  };

  const handleQuickSelect = (coin) => {
    const coinData = {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: `https://assets.coingecko.com/coins/images/1/small/${coin.id}.png`
    };
    setSelectedCoin(coinData);
    setSearchQuery(coin.name);
    setShowResults(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedCoin || !amount || !buyPrice) {
      return;
    }

    onAddHolding({
      coinId: selectedCoin.id,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol.toUpperCase(),
      amount: parseFloat(amount),
      buyPrice: parseFloat(buyPrice)
    });

    // Reset form
    setSearchQuery('');
    setSelectedCoin(null);
    setAmount('');
    setBuyPrice('');
    setSearchResults([]);
  };

  return (
    <section className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Add Holdings</h2>
      
      {/* Quick Select Top Coins */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-3">Quick Select Popular Coins:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {topCoins.map(coin => (
            <button
              key={coin.id}
              type="button"
              onClick={() => handleQuickSelect(coin)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition flex items-center justify-center space-x-2"
            >
              <span className="font-medium">{coin.symbol}</span>
              <span className="text-gray-400">{coin.name}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Or search coin..."
            className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
              {searchResults.map(coin => (
                <div
                  key={coin.id}
                  onClick={() => handleSelectCoin(coin)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-600 cursor-pointer"
                >
                  <img src={coin.thumb} alt={coin.name} className="w-6 h-6" />
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          step="any"
          className="bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="number"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          placeholder="Buy Price ($)"
          step="any"
          className="bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
        >
          <i className="fas fa-plus mr-2"></i>Add Holding
        </button>
      </form>
    </section>
  );
};

export default AddHolding;
