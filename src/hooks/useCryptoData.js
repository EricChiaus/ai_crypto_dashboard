import { useState, useEffect, useCallback } from 'react';

export const useCryptoData = () => {
  const [coinData, setCoinData] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadCoinData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch cryptocurrency data');
      }
      
      const coins = await response.json();
      const coinMap = new Map();
      
      coins.forEach(coin => {
        coinMap.set(coin.id, coin);
        coinMap.set(coin.symbol.toUpperCase(), coin);
      });
      
      setCoinData(coinMap);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    loadCoinData();
  }, [loadCoinData]);

  useEffect(() => {
    loadCoinData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadCoinData, 60000);
    
    return () => clearInterval(interval);
  }, [loadCoinData]);

  return {
    coinData,
    loading,
    error,
    refreshData,
    lastUpdate
  };
};
