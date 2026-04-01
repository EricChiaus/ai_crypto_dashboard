import React from 'react';

const HoldingsTable = ({ portfolio, coinData, onRemoveHolding }) => {
  if (portfolio.length === 0) {
    return (
      <section className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Your Holdings</h2>
        <div className="text-center py-8 text-gray-500">
          No holdings yet. Add your first crypto asset above!
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Your Holdings</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4">Coin</th>
              <th className="text-right py-3 px-4">Amount</th>
              <th className="text-right py-3 px-4">Buy Price</th>
              <th className="text-right py-3 px-4">Current Price</th>
              <th className="text-right py-3 px-4">Value</th>
              <th className="text-right py-3 px-4">P/L</th>
              <th className="text-right py-3 px-4">24h Change</th>
              <th className="text-center py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map(holding => {
              const coin = coinData.get(holding.coinId);
              if (!coin) return null;

              const currentValue = holding.amount * coin.current_price;
              const cost = holding.amount * holding.buyPrice;
              const pl = currentValue - cost;
              const plPercent = cost > 0 ? (pl / cost) * 100 : 0;
              const dailyChange = coin.price_change_percentage_24h || 0;

              return (
                <tr key={holding.id} className="border-b border-gray-700 table-row-hover">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">{holding.amount.toFixed(6)}</td>
                  <td className="text-right py-3 px-4">${holding.buyPrice.toFixed(2)}</td>
                  <td className="text-right py-3 px-4">${coin.current_price.toFixed(2)}</td>
                  <td className="text-right py-3 px-4 font-medium">${currentValue.toFixed(2)}</td>
                  <td className="text-right py-3 px-4">
                    <div className={pl >= 0 ? 'profit' : 'loss'}>
                      {pl >= 0 ? '+' : ''}${pl.toFixed(2)} ({plPercent >= 0 ? '+' : ''}{plPercent.toFixed(2)}%)
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className={dailyChange >= 0 ? 'profit' : 'loss'}>
                      {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}%
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">
                    <button
                      onClick={() => onRemoveHolding(holding.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default HoldingsTable;
