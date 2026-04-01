import React from 'react';

const Header = ({ onRefresh }) => {
  const formatTime = () => new Date().toLocaleTimeString();

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <i className="fas fa-chart-line text-2xl text-blue-500"></i>
            <h1 className="text-2xl font-bold">Crypto Portfolio Tracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              Last updated: {formatTime()}
            </span>
            <button 
              onClick={onRefresh}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            >
              <i className="fas fa-sync-alt mr-2"></i>Refresh
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
