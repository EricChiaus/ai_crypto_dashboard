// Crypto Portfolio Tracker JavaScript

class CryptoPortfolioTracker {
    constructor() {
        this.portfolio = this.loadPortfolio();
        this.coinData = new Map();
        this.searchTimeout = null;
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initCharts();
        this.loadCoinData();
        this.updateLastUpdateTime();
        
        // Auto-refresh every 60 seconds
        setInterval(() => this.refreshData(), 60000);
    }

    setupEventListeners() {
        const searchInput = document.getElementById('coinSearch');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#coinSearch') && !e.target.closest('#searchResults')) {
                document.getElementById('searchResults').classList.add('hidden');
            }
        });
    }

    async loadCoinData() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h');
            const coins = await response.json();
            
            coins.forEach(coin => {
                this.coinData.set(coin.id, coin);
                this.coinData.set(coin.symbol.toUpperCase(), coin);
            });
            
            this.updatePortfolioDisplay();
        } catch (error) {
            console.error('Error loading coin data:', error);
            this.showNotification('Error loading cryptocurrency data', 'error');
        }
    }

    async handleSearch(query) {
        clearTimeout(this.searchTimeout);
        
        if (query.length < 2) {
            document.getElementById('searchResults').classList.add('hidden');
            return;
        }

        this.searchTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
                const data = await response.json();
                
                this.displaySearchResults(data.coins.slice(0, 5));
            } catch (error) {
                console.error('Search error:', error);
            }
        }, 300);
    }

    displaySearchResults(coins) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (coins.length === 0) {
            resultsContainer.innerHTML = '<div class="p-2 text-gray-400">No results found</div>';
            resultsContainer.classList.remove('hidden');
            return;
        }

        resultsContainer.innerHTML = coins.map(coin => `
            <div class="search-result flex items-center justify-between" onclick="selectCoin('${coin.id}', '${coin.name}', '${coin.symbol}')">
                <div class="flex items-center space-x-3">
                    <img src="${coin.thumb}" alt="${coin.name}" class="w-6 h-6">
                    <div>
                        <div class="font-medium">${coin.name}</div>
                        <div class="text-sm text-gray-400">${coin.symbol.toUpperCase()}</div>
                    </div>
                </div>
            </div>
        `).join('');
        
        resultsContainer.classList.remove('hidden');
    }

    addHolding(coinId, coinName, coinSymbol, amount, buyPrice) {
        const holding = {
            id: Date.now().toString(),
            coinId,
            coinName,
            coinSymbol: coinSymbol.toUpperCase(),
            amount: parseFloat(amount),
            buyPrice: parseFloat(buyPrice),
            timestamp: new Date().toISOString()
        };

        this.portfolio.push(holding);
        this.savePortfolio();
        this.updatePortfolioDisplay();
        this.clearAddForm();
        this.showNotification(`Added ${amount} ${coinSymbol.toUpperCase()} to portfolio`, 'success');
    }

    removeHolding(holdingId) {
        const holding = this.portfolio.find(h => h.id === holdingId);
        if (holding) {
            this.portfolio = this.portfolio.filter(h => h.id !== holdingId);
            this.savePortfolio();
            this.updatePortfolioDisplay();
            this.showNotification(`Removed ${holding.coinSymbol} from portfolio`, 'success');
        }
    }

    updatePortfolioDisplay() {
        this.updateSummaryCards();
        this.updateHoldingsTable();
        this.updateCharts();
    }

    updateSummaryCards() {
        let totalValue = 0;
        let totalCost = 0;
        let dailyChange = 0;

        this.portfolio.forEach(holding => {
            const coin = this.coinData.get(holding.coinId);
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

        document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
        document.getElementById('dailyChange').textContent = `${dailyChange >= 0 ? '+' : ''}$${dailyChange.toFixed(2)}`;
        document.getElementById('dailyChange').className = `text-2xl font-bold ${dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`;
        
        document.getElementById('totalPL').textContent = `${totalPL >= 0 ? '+' : ''}$${totalPL.toFixed(2)} (${totalPLPercent >= 0 ? '+' : ''}${totalPLPercent.toFixed(2)}%)`;
        document.getElementById('totalPL').className = `text-2xl font-bold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`;
        
        document.getElementById('assetCount').textContent = this.portfolio.length;
    }

    updateHoldingsTable() {
        const tbody = document.getElementById('holdingsTable');
        
        if (this.portfolio.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-gray-500">No holdings yet. Add your first crypto asset above!</td></tr>';
            return;
        }

        tbody.innerHTML = this.portfolio.map(holding => {
            const coin = this.coinData.get(holding.coinId);
            if (!coin) return '';

            const currentValue = holding.amount * coin.current_price;
            const cost = holding.amount * holding.buyPrice;
            const pl = currentValue - cost;
            const plPercent = (pl / cost) * 100;
            const dailyChange = coin.price_change_percentage_24h || 0;

            return `
                <tr class="border-b border-gray-700 table-row-hover">
                    <td class="py-3 px-4">
                        <div class="flex items-center space-x-3">
                            <img src="${coin.image}" alt="${coin.name}" class="w-8 h-8">
                            <div>
                                <div class="font-medium">${coin.name}</div>
                                <div class="text-sm text-gray-400">${coin.symbol.toUpperCase()}</div>
                            </div>
                        </div>
                    </td>
                    <td class="text-right py-3 px-4">${holding.amount.toFixed(6)}</td>
                    <td class="text-right py-3 px-4">$${holding.buyPrice.toFixed(2)}</td>
                    <td class="text-right py-3 px-4">$${coin.current_price.toFixed(2)}</td>
                    <td class="text-right py-3 px-4 font-medium">$${currentValue.toFixed(2)}</td>
                    <td class="text-right py-3 px-4">
                        <div class="${pl >= 0 ? 'profit' : 'loss'}">
                            ${pl >= 0 ? '+' : ''}$${pl.toFixed(2)} (${plPercent >= 0 ? '+' : ''}${plPercent.toFixed(2)}%)
                        </div>
                    </td>
                    <td class="text-right py-3 px-4">
                        <div class="${dailyChange >= 0 ? 'profit' : 'loss'}">
                            ${dailyChange >= 0 ? '+' : ''}${dailyChange.toFixed(2)}%
                        </div>
                    </td>
                    <td class="text-center py-3 px-4">
                        <button onclick="removeHolding('${holding.id}')" class="text-red-400 hover:text-red-300 transition">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    initCharts() {
        // Portfolio Distribution Chart
        const portfolioCtx = document.getElementById('portfolioChart').getContext('2d');
        this.charts.portfolio = new Chart(portfolioCtx, {
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

        // Performance Chart
        const performanceCtx = document.getElementById('performanceChart').getContext('2d');
        this.charts.performance = new Chart(performanceCtx, {
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

    updateCharts() {
        if (!this.charts.portfolio || !this.charts.performance) {
            console.log('Charts not initialized yet');
            return;
        }

        if (this.portfolio.length === 0) {
            this.charts.portfolio.data.labels = ['No Holdings'];
            this.charts.portfolio.data.datasets[0].data = [1];
            this.charts.performance.data.labels = ['No Data'];
            this.charts.performance.data.datasets[0].data = [0];
            this.charts.performance.data.datasets[0].backgroundColor = ['#6b7280'];
            this.charts.portfolio.update();
            this.charts.performance.update();
            return;
        }

        // Portfolio Distribution
        const portfolioData = this.portfolio.map(holding => {
            const coin = this.coinData.get(holding.coinId);
            return coin ? holding.amount * coin.current_price : 0;
        });

        const portfolioLabels = this.portfolio.map(holding => holding.coinSymbol);

        this.charts.portfolio.data.labels = portfolioLabels;
        this.charts.portfolio.data.datasets[0].data = portfolioData;
        this.charts.portfolio.update();

        // Performance Chart
        const performanceData = this.portfolio.map(holding => {
            const coin = this.coinData.get(holding.coinId);
            if (!coin) return 0;
            
            const currentValue = holding.amount * coin.current_price;
            const cost = holding.amount * holding.buyPrice;
            return ((currentValue - cost) / cost) * 100;
        });

        const performanceColors = performanceData.map(value => 
            value >= 0 ? '#10b981' : '#ef4444'
        );

        this.charts.performance.data.labels = portfolioLabels;
        this.charts.performance.data.datasets[0].data = performanceData;
        this.charts.performance.data.datasets[0].backgroundColor = performanceColors;
        this.charts.performance.update();
    }

    async refreshData() {
        await this.loadCoinData();
        this.updateLastUpdateTime();
        this.showNotification('Data refreshed successfully', 'success');
    }

    updateLastUpdateTime() {
        const now = new Date();
        document.getElementById('lastUpdate').textContent = `Last updated: ${now.toLocaleTimeString()}`;
    }

    clearAddForm() {
        document.getElementById('coinSearch').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('buyPrice').value = '';
        document.getElementById('searchResults').classList.add('hidden');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    savePortfolio() {
        localStorage.setItem('cryptoPortfolio', JSON.stringify(this.portfolio));
    }

    loadPortfolio() {
        const saved = localStorage.getItem('cryptoPortfolio');
        return saved ? JSON.parse(saved) : [];
    }
}

// Global functions for HTML onclick handlers
let tracker;

function selectCoin(coinId, coinName, coinSymbol) {
    document.getElementById('coinSearch').value = coinName;
    document.getElementById('coinSearch').dataset.coinId = coinId;
    document.getElementById('coinSearch').dataset.coinSymbol = coinSymbol;
    document.getElementById('searchResults').classList.add('hidden');
}

function addHolding() {
    const searchInput = document.getElementById('coinSearch');
    const amount = document.getElementById('amount').value;
    const buyPrice = document.getElementById('buyPrice').value;

    if (!searchInput.dataset.coinId || !amount || !buyPrice) {
        tracker.showNotification('Please fill in all fields', 'error');
        return;
    }

    tracker.addHolding(
        searchInput.dataset.coinId,
        searchInput.value,
        searchInput.dataset.coinSymbol,
        amount,
        buyPrice
    );
}

function removeHolding(holdingId) {
    if (confirm('Are you sure you want to remove this holding?')) {
        tracker.removeHolding(holdingId);
    }
}

function refreshData() {
    tracker.refreshData();
}

// Initialize the tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    tracker = new CryptoPortfolioTracker();
});
