import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Charts = ({ portfolio, coinData }) => {
  const portfolioChartRef = useRef(null);
  const performanceChartRef = useRef(null);
  const portfolioChartInstance = useRef(null);
  const performanceChartInstance = useRef(null);

  useEffect(() => {
    // Initialize charts
    if (!portfolioChartInstance.current && portfolioChartRef.current) {
      const ctx = portfolioChartRef.current.getContext('2d');
      portfolioChartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [
              '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
              '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#fff' }
            }
          }
        }
      });
    }

    if (!performanceChartInstance.current && performanceChartRef.current) {
      const ctx = performanceChartRef.current.getContext('2d');
      performanceChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Profit/Loss %',
            data: [],
            backgroundColor: [],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: { color: '#fff' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
              ticks: { color: '#fff' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
          },
          plugins: {
            legend: {
              labels: { color: '#fff' }
            }
          }
        }
      });
    }

    return () => {
      if (portfolioChartInstance.current) {
        portfolioChartInstance.current.destroy();
      }
      if (performanceChartInstance.current) {
        performanceChartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!portfolioChartInstance.current || !performanceChartInstance.current) {
      return;
    }

    if (portfolio.length === 0) {
      // Empty state
      portfolioChartInstance.current.data.labels = ['No Holdings'];
      portfolioChartInstance.current.data.datasets[0].data = [1];
      performanceChartInstance.current.data.labels = ['No Data'];
      performanceChartInstance.current.data.datasets[0].data = [0];
      performanceChartInstance.current.data.datasets[0].backgroundColor = ['#6b7280'];
    } else {
      // Portfolio Distribution
      const portfolioData = portfolio.map(holding => {
        const coin = coinData.get(holding.coinId);
        return coin ? holding.amount * coin.current_price : 0;
      });

      const portfolioLabels = portfolio.map(holding => holding.coinSymbol);

      portfolioChartInstance.current.data.labels = portfolioLabels;
      portfolioChartInstance.current.data.datasets[0].data = portfolioData;

      // Performance Chart
      const performanceData = portfolio.map(holding => {
        const coin = coinData.get(holding.coinId);
        if (!coin) return 0;
        
        const currentValue = holding.amount * coin.current_price;
        const cost = holding.amount * holding.buyPrice;
        return cost > 0 ? ((currentValue - cost) / cost) * 100 : 0;
      });

      const performanceColors = performanceData.map(value => 
        value >= 0 ? '#10b981' : '#ef4444'
      );

      performanceChartInstance.current.data.labels = portfolioLabels;
      performanceChartInstance.current.data.datasets[0].data = performanceData;
      performanceChartInstance.current.data.datasets[0].backgroundColor = performanceColors;
    }

    portfolioChartInstance.current.update();
    performanceChartInstance.current.update();
  }, [portfolio, coinData]);

  return (
    <section className="grid grid-cols-1 gap-8">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Portfolio Distribution</h2>
        <div className="chart-container">
          <canvas ref={portfolioChartRef}></canvas>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Top Performers</h2>
        <div className="chart-container">
          <canvas ref={performanceChartRef}></canvas>
        </div>
      </div>
    </section>
  );
};

export default Charts;
