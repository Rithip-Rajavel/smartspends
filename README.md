# SmartSpends - Personal Finance Advisor

SmartSpends is a comprehensive React Native mobile application designed to help individuals manage their monthly income and expenses more effectively. The app focuses on identifying and reducing unnecessary spending to increase monthly savings while providing intelligent investment guidance.

## 🚀 Features

### Core Functionality
- **Expense Tracking**: Track user spending with automatic categorization and payment mode detection
- **Savings Analysis**: Analyze salary against expenses to provide insights on savings opportunities
- **Investment Guidance**: Get statistical investment suggestions based on available surplus
- **Behavioral Comparison**: Month-over-month financial habit comparisons with detailed analytics

### Key Features
- **Financial Dashboard**: Centralized view of financial status with interactive charts
- **Quick-Entry Widget**: Screen widget for rapid expense logging without opening the full app
- **Automated Context**: Automatic date/time capture for seamless user experience
- **Multi-Category Support**: 7 expense categories (Food, Transport, Entertainment, Bills, Shopping, Healthcare, Miscellaneous)
- **Payment Mode Tracking**: Support for Cash, Card, UPI, Net Banking, and Other payment methods
- **Authentication**: Secure user registration and login system

## 🛠 Tech Stack

### Frontend
- **React Native** (0.84.0) - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **React Native Paper** - Material Design UI components
- **React Navigation** - Navigation and routing
- **React Native Element Dropdown** - Custom dropdown components
- **React Native Chart Kit** - Interactive charts and graphs
- **React Native Vector Icons** - Icon library
- **React Native Async Storage** - Local data persistence

### Backend Integration
- **Axios** - HTTP client for API communication
- **RESTful API** - Complete CRUD operations for incomes, expenses, and savings

## 📱 Screens & Navigation

### Authentication Flow
- Login Screen
- Registration Screen

### Main Navigation (Bottom Tabs)
- **Dashboard**: Financial overview with charts and quick stats
- **Income**: Manage income sources and track earnings
- **Expenses**: Track and categorize expenses with filtering
- **Savings**: View savings analysis and investment recommendations
- **Comparison**: Month-over-month financial comparisons

### Additional Screens
- Add/Edit Income
- Add/Edit Expense
- Income/Expense Details
- Investment Recommendations

## 🏗 Project Structure

```
src/
├── api/                    # API service layer
│   ├── axiosConfig.ts     # Axios configuration
│   ├── authService.ts     # Authentication services
│   ├── incomeService.ts   # Income management
│   ├── expenseService.ts  # Expense management
│   ├── savingsService.ts  # Savings & investments
│   └── dashboardService.ts # Dashboard data
├── components/            # Reusable UI components
├── context/              # React Context providers
│   └── AuthContext.tsx   # Authentication context
├── navigation/           # Navigation configuration
│   └── AppNavigator.tsx  # Main navigation setup
├── screens/             # Screen components
│   ├── Auth/           # Authentication screens
│   ├── Dashboard/      # Dashboard screen
│   ├── Income/         # Income management
│   ├── Expenses/       # Expense management
│   ├── Savings/        # Savings & investments
│   └── Comparison/     # Financial comparisons
├── types/              # TypeScript type definitions
│   └── index.ts       # Main types file
├── utils/             # Utility functions
└── widgets/           # Custom widgets
    └── QuickExpenseWidget.tsx  # Quick expense entry widget
```

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 22.11.0)
- React Native development environment
- Android Studio / Xcode (for mobile development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartspends
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup (if developing for iOS)**
   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

4. **Start Metro**
   ```bash
   npm start
   ```

5. **Run the application**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## 🔧 Configuration

### API Configuration
Update the API base URL in `src/api/axiosConfig.ts`:
```typescript
const API_BASE_URL = 'http://localhost:5012'; // Update to your API URL
```

### Environment Variables
Create environment-specific configuration files as needed for different deployment environments.

## 📊 API Integration

The app integrates with a comprehensive RESTful API supporting:

- **Authentication**: Login, registration, token management
- **Income Management**: CRUD operations for income entries
- **Expense Management**: CRUD operations with categorization
- **Savings Analysis**: Monthly summaries and recommendations
- **Dashboard Data**: Real-time financial overview
- **Monthly Comparisons**: Period-over-period analysis

## 🎨 UI/UX Features

- **Material Design**: Consistent Material Design 3 components
- **Dark Mode Support**: Automatic theme detection
- **Responsive Layout**: Optimized for various screen sizes
- **Interactive Charts**: Pie charts, bar charts, and line graphs
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Accessibility**: Screen reader support and semantic components

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Local Storage Encryption**: Sensitive data protection
- **Input Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error management

## 🚦 Quick-Entry Widget

The app includes a custom widget for rapid expense tracking:
- **Minimal Interface**: Quick amount entry with category selection
- **Auto-Timestamping**: Automatic date/time capture
- **Category Shortcuts**: Frequently used categories
- **Payment Mode Selection**: Quick payment method selection

## 📈 Analytics & Insights

- **Spending Patterns**: AI-powered spending analysis
- **Savings Trends**: Historical savings visualization
- **Investment Recommendations**: Risk-based investment suggestions
- **Financial Health Score**: Overall financial wellness indicator

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the API documentation for backend integration

---

**SmartSpends** - Your intelligent personal finance companion! 💰📱
