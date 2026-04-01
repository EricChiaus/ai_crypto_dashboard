import { useState, useEffect, useCallback } from 'react';
import { makeRateLimitedRequest } from '../utils/apiRateLimiter';

export const useCryptoData = () => {
  const [coinData, setCoinData] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [rateLimited, setRateLimited] = useState(false);

  const loadCoinData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const coins = await makeRateLimitedRequest(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h',
        true // High priority for main data
      );
      
      const coinMap = new Map();
      
      coins.forEach(coin => {
        coinMap.set(coin.id, coin);
        coinMap.set(coin.symbol.toUpperCase(), coin);
      });
      
      setCoinData(coinMap);
      setLastUpdate(new Date());
      setRateLimited(false);
    } catch (err) {
      if (err.message === 'Rate limit exceeded') {
        setRateLimited(true);
        setError('Rate limit exceeded. Please wait a moment before refreshing.');
      } else {
        setError(err.message);
        setRateLimited(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    if (!rateLimited) {
      loadCoinData();
    }
  }, [loadCoinData, rateLimited]);

  useEffect(() => {
    loadCoinData();
    
    // Auto-refresh every 3 minutes (further reduced to avoid rate limits)
    const interval = setInterval(() => {
      if (!rateLimited) {
        loadCoinData();
      }
    }, 180000); // 3 minutes
    
    return () => clearInterval(interval);
  }, [loadCoinData, rateLimited]);

  return {
    coinData,
    loading,
    error,
    refreshData,
    lastUpdate,
    rateLimited
  };
};
