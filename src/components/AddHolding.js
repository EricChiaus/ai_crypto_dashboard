import React, { useState, useEffect } from 'react';
import { makeRateLimitedRequest } from '../utils/apiRateLimiter';

const AddHolding = ({ onAddHolding, coinData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coin..."
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
