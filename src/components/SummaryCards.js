import React from 'react';

const SummaryCards = ({ totalValue, totalPL, dailyChange, assetCount }) => {
  const formatCurrency = (value) => `$${value.toFixed(2)}`;
  const formatPercent = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Value</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(totalValue)}
            </p>
          </div>
          <i className="fas fa-wallet text-3xl text-blue-500"></i>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">24h Change</p>
            <p className={`text-2xl font-bold ${dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(dailyChange)}
            </p>
          </div>
          <i className="fas fa-chart-bar text-3xl text-green-500"></i>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Profit/Loss</p>
            <p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(totalPL)} ({formatPercent((totalPL / (totalValue - totalPL)) * 100)})
            </p>
          </div>
          <i className="fas fa-percentage text-3xl text-yellow-500"></i>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Assets</p>
            <p className="text-2xl font-bold">{assetCount}</p>
          </div>
          <i className="fas fa-coins text-3xl text-purple-500"></i>
        </div>
      </div>
    </section>
  );
};

export default SummaryCards;
