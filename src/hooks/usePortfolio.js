import { useState, useEffect, useMemo } from 'react';

export const usePortfolio = (coinData) => {
  const [portfolio, setPortfolio] = useState([]);

  // Load portfolio from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cryptoPortfolio');
    if (saved) {
      try {
        setPortfolio(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading portfolio:', err);
      }
    }
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    if (portfolio.length > 0) {
      localStorage.setItem('cryptoPortfolio', JSON.stringify(portfolio));
    }
  }, [portfolio]);

  const addHolding = (holding) => {
    const newHolding = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...holding
    };
    setPortfolio(prev => [...prev, newHolding]);
  };

  const removeHolding = (holdingId) => {
    setPortfolio(prev => prev.filter(h => h.id !== holdingId));
  };

  // Calculate portfolio metrics
  const metrics = useMemo(() => {
    let totalValue = 0;
    let totalCost = 0;
    let dailyChange = 0;

    portfolio.forEach(holding => {
      const coin = coinData.get(holding.coinId);
      if (coin) {
        const currentValue = holding.amount * coin.current_price;
        const cost = holding.amount * holding.buyPrice;
        
        totalValue += currentValue;
        totalCost += cost;
        dailyChange += currentValue * (coin.price_change_percentage_24h || 0) / 100;
      }
    });

    const totalPL = totalValue - totalCost;
    const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

    return {
      totalValue,
      totalPL,
      totalPLPercent,
      dailyChange,
      assetCount: portfolio.length
    };
  }, [portfolio, coinData]);

  return {
    portfolio,
    addHolding,
    removeHolding,
    ...metrics
  };
};
