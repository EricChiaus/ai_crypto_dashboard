import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import AddHolding from './components/AddHolding';
import HoldingsTable from './components/HoldingsTable';
import Charts from './components/Charts';
import TopCryptoCharts from './components/TopCryptoCharts';
import Footer from './components/Footer';
import Notification from './components/Notification';
import { useCryptoData } from './hooks/useCryptoData';
import { usePortfolio } from './hooks/usePortfolio';

function App() {
  const { coinData, loading, error, refreshData } = useCryptoData();
  const { 
    portfolio, 
    addHolding, 
    removeHolding, 
    totalValue, 
    totalPL, 
    dailyChange, 
    assetCount 
  } = usePortfolio(coinData);
  
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddHolding = (holding) => {
    addHolding(holding);
    showNotification(`Added ${holding.amount} ${holding.coinSymbol} to portfolio`, 'success');
  };

  const handleRemoveHolding = (holdingId) => {
    const holding = portfolio.find(h => h.id === holdingId);
    if (holding) {
      removeHolding(holdingId);
      showNotification(`Removed ${holding.coinSymbol} from portfolio`, 'success');
    }
  };

  const handleRefresh = () => {
    refreshData();
    showNotification('Data refreshed successfully', 'success');
  };

  return (
    <div className="min-h-screen text-white">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
        />
      )}
      
      <Header onRefresh={handleRefresh} />
      
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-400/20 border border-red-400 text-red-400 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {loading && (
          <div className="text-center py-12">
            <div className="loading mx-auto mb-4"></div>
            <p className="text-gray-400">Loading cryptocurrency data...</p>
          </div>
        )}
        
        {!loading && !error && (
          <>
            <SummaryCards 
              totalValue={totalValue}
              totalPL={totalPL}
              dailyChange={dailyChange}
              assetCount={portfolio.length}
            />
            
            <AddHolding 
              onAddHolding={handleAddHolding}
              coinData={coinData}
            />
            
            <HoldingsTable 
              portfolio={portfolio}
              coinData={coinData}
              onRemoveHolding={handleRemoveHolding}
            />
            
            <Charts 
              portfolio={portfolio}
              coinData={coinData}
            />
            
            <TopCryptoCharts coinData={coinData} />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
