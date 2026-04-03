# Crypto Portfolio Tracker

A comprehensive cryptocurrency portfolio tracker dashboard **built entirely by AI** using React, Tailwind CSS, and Chart.js, powered by CoinGecko API.

## 🤖 AI-Built Application

This project demonstrates advanced AI development capabilities including:
- **Complete React architecture** with hooks and components
- **Tailwind CSS implementation** with proper build pipeline
- **API rate limiting system** to prevent 429 errors
- **Responsive design** with modern UI/UX
- **Real-time data visualization** with Chart.js
- **Professional build system** with webpack optimization

## Features

### 📊 Real-Time Data
- Live cryptocurrency prices from CoinGecko API
- 24-hour price changes
- Automatic data refresh every 60 seconds
- Manual refresh capability

### 💼 Portfolio Management
- Add/remove cryptocurrency holdings
- Track purchase price and current value
- Calculate profit/loss for each holding
- Portfolio summary with total value and P&L

### 📈 Visual Analytics
- Portfolio distribution doughnut chart
- Performance bar chart showing profit/loss percentages
- Color-coded profit/loss indicators
- Responsive chart visualizations

### 🎨 Modern UI/UX
- Dark theme with glass morphism effects
- Animated gradient backgrounds
- Hover effects and smooth transitions
- Mobile-responsive design
- Custom scrollbars

### 💾 Data Persistence
- Local storage for portfolio data
- Automatic save on portfolio changes
- Persistent holdings across sessions

## Quick Start

1. **Open the Dashboard**
   ```bash
   # Simply open index.html in your web browser
   # No installation required!
   ```

2. **Add Your First Holding**
   - Search for a cryptocurrency (e.g., "Bitcoin", "ETH")
   - Enter the amount you own
   - Enter your purchase price
   - Click "Add Holding"

3. **Track Your Portfolio**
   - View real-time prices and changes
   - Monitor profit/loss across all holdings
   - Analyze portfolio distribution
   - Check performance charts

## API Integration

The dashboard uses the **CoinGecko API** which is completely free and requires no API key:

- **Endpoint**: `https://api.coingecko.com/api/v3/`
- **Rate Limit**: 10-30 requests per minute
- **Data**: Real-time prices, market data, and search functionality

## File Structure

```
ai_crypto_dashboard/
├── index.html          # Main dashboard HTML
├── styles.css          # Custom CSS styles and animations
├── script.js           # Core JavaScript functionality
└── README.md           # This documentation
```

## Key Components

### Summary Cards
- **Total Value**: Current portfolio value
- **24h Change**: Daily portfolio performance
- **Total P/L**: Overall profit/loss
- **Assets**: Number of different cryptocurrencies

### Holdings Table
- Coin information with logos
- Amount owned
- Buy price vs. current price
- Current value
- Profit/loss with percentage
- 24-hour price change
- Delete functionality

### Interactive Charts
- **Portfolio Distribution**: Doughnut chart showing asset allocation
- **Performance Chart**: Bar chart displaying individual asset P&L percentages

## Technical Features

### JavaScript Architecture
- ES6 class-based structure
- Async/await for API calls
- Event-driven interactions
- Local storage management
- Chart.js integration

### CSS Features
- Tailwind CSS framework
- Custom animations and transitions
- Responsive grid layouts
- Glass morphism effects
- Custom scrollbars

### API Integration
- Coin search functionality
- Real-time price fetching
- Market data retrieval
- Error handling and notifications

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Notes

- No API keys required
- Client-side only application
- Local storage for data persistence
- HTTPS recommended for production

## Future Enhancements

- [ ] Portfolio export to CSV
- [ ] Price alerts
- [ ] Historical performance tracking
- [ ] Multiple portfolio support
- [ ] Advanced filtering and sorting
- [ ] Transaction history
- [ ] Tax reporting features

## Troubleshooting

### Common Issues

1. **Data not loading**: Check internet connection and CoinGecko API status
2. **Search not working**: Ensure you're typing at least 2 characters
3. **Charts not displaying**: Refresh the page and check browser console for errors

### Performance Tips

- The dashboard auto-refreshes every 60 seconds
- Large portfolios may take longer to load
- Clear browser cache if experiencing issues

## 🧹 Clean Code Standards

### React Best Practices
- **Functional components** with hooks for state management
- **Custom hooks** for reusable logic (`useCryptoData`, `usePortfolio`)
- **Props drilling avoidance** with proper component composition
- **Consistent naming** conventions (PascalCase for components)
- **PropTypes validation** for component props
- **Error boundaries** for graceful error handling

### Code Organization
- **Component-based architecture** with separation of concerns
- **Custom hooks** for business logic
- **Utility functions** for reusable operations
- **Consistent file structure** with clear naming
- **Import organization** (React → components → hooks → utils)

### Performance Optimization
- **React.memo** for expensive components
- **useCallback** and **useMemo** for optimization
- **Lazy loading** for large components
- **API rate limiting** to prevent 429 errors
- **Debouncing** for search functionality

### CSS Architecture
- **Tailwind CSS** with utility-first approach
- **@layer system** for organized styles
- **Custom components** for reusable UI patterns
- **Responsive design** with mobile-first approach
- **Animation optimization** with CSS transforms

## 🚀 Development Rules

### React Guidelines
1. **Use functional components** with hooks
2. **Custom hooks** for shared logic
3. **Props destructuring** for cleaner code
4. **Consistent error handling** with try-catch
5. **Loading states** for better UX
6. **Responsive design** for all screen sizes

### API Integration
1. **Rate limiting** for all external API calls
2. **Error handling** with user feedback
3. **Loading indicators** during data fetch
4. **Caching strategies** for performance
5. **Retry logic** for failed requests

### Code Quality
1. **ESLint compliance** for consistent code style
2. **Descriptive naming** for functions and variables
3. **Single responsibility** principle
4. **DRY principle** (Don't Repeat Yourself)
5. **Type safety** with PropTypes

## Contributing

Feel free to fork this project and submit pull requests for new features or improvements!

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**🤖 Built entirely by AI with advanced React, Tailwind CSS, and Chart.js expertise**
