import React, { useRef, useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { makeRateLimitedRequest } from '../utils/apiRateLimiter';

Chart.register(...registerables);

const TopCryptoCharts = ({ coinData }) => {
  const chartRefs = useRef({});
  const chartInstances = useRef({});
  const [historicalData, setHistoricalData] = useState({});
  const [loading, setLoading] = useState(true);

  // Get top cryptocurrency by market cap
  const topCoins = React.useMemo(() => {
    if (!coinData || coinData.size === 0) return [];

    return Array.from(coinData.values())
      .filter(coin => coin.market_cap_rank === 1) // Only get #1 ranked crypto
      .slice(0, 1);
  }, [coinData]);

  // Fetch historical data for charts
  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (topCoins.length === 0) return;

      setLoading(true);
      const historical = {};

      try {
        // Fetch 7-day historical data for each top coin using rate limiter
        const promises = topCoins.map(async (coin) => {
          try {
            const data = await makeRateLimitedRequest(
              `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=7&interval=daily`,
              false // Low priority for charts
            );
            
            // Process data for Chart.js
            const labels = data.prices.map((price, index) => {
              const date = new Date(price[0]);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            });
            
            const prices = data.prices.map(price => price[1]);
            
            return {
              id: coin.id,
              labels,
              prices,
              currentPrice: coin.current_price,
              priceChange: coin.price_change_percentage_24h || 0
            };
          } catch (error) {
            console.warn(`Failed to fetch data for ${coin.name}:`, error.message);
            return null;
          }
        });

        const results = await Promise.all(promises);
        const validResults = results.filter(result => result !== null);
        
        validResults.forEach(result => {
          historical[result.id] = result;
        });

        setHistoricalData(historical);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [topCoins]);

  // Initialize and update charts
  useEffect(() => {
    topCoins.forEach(coin => {
      const chartRef = chartRefs.current[coin.id];
      const existingChart = chartInstances.current[coin.id];

      if (chartRef && !existingChart && historicalData[coin.id]) {
        const ctx = chartRef.getContext('2d');
        const data = historicalData[coin.id];

        const chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: [{
              label: `${coin.name} Price (USD)`,
              data: data.prices,
              borderColor: data.priceChange >= 0 ? '#10b981' : '#ef4444',
              backgroundColor: data.priceChange >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointRadius: 3,
              pointHoverRadius: 5,
              pointBackgroundColor: data.priceChange >= 0 ? '#10b981' : '#ef4444',
              pointBorderColor: '#fff',
              pointBorderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: 'index'
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#333',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                  label: function(context) {
                    return `Price: $${context.parsed.y.toFixed(2)}`;
                  }
                }
              }
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)',
                  drawBorder: false
                },
                ticks: {
                  color: '#9ca3af',
                  font: {
                    size: 11
                  }
                }
              },
              y: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)',
                  drawBorder: false
                },
                ticks: {
                  color: '#9ca3af',
                  font: {
                    size: 11
                  },
                  callback: function(value) {
                    return '$' + value.toFixed(0);
                  }
                }
              }
            }
          }
        });

        chartInstances.current[coin.id] = chartInstance;
      }
    });

    // Cleanup
    return () => {
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) chart.destroy();
      });
      chartInstances.current = {};
    };
  }, [topCoins, historicalData]);

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Top 10 Cryptocurrencies - 7 Day Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-32 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (topCoins.length === 0) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-white">Top Cryptocurrency Performance</h2>
        <div className="text-center py-8 text-gray-400">
          <p>No cryptocurrency data available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-white">Top Cryptocurrency Performance</h2>
      <div className="grid grid-cols-1 gap-6">
        {topCoins.map((coin) => {
          const data = historicalData[coin.id];
          if (!data) return null;

          return (
            <div key={coin.id} className="bg-gray-800 rounded-lg p-6 shadow-lg card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img 
                    src={coin.image} 
                    alt={coin.name} 
                    className="w-8 h-8 mr-3"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{coin.name}</h3>
                    <p className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${data.currentPrice.toLocaleString()}</p>
                  <p className={`text-sm ${data.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.priceChange >= 0 ? '+' : ''}{data.priceChange.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="chart-container">
                <canvas ref={el => chartRefs.current[coin.id] = el}></canvas>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopCryptoCharts;
