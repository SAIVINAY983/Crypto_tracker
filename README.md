# 🚀 CryptoPal Oracle Pro

**CryptoPal Oracle Pro** is a high-performance, AI-enhanced cryptocurrency management platform. It combines real-time market data with advanced sentiment analysis and professional portfolio tracking tools to give you a competitive edge in the crypto market.

![CryptoPal Oracle Dashboard](file:///C:/Users/saivi/.gemini/antigravity/brain/ea787dd5-50bd-4b66-b1f1-cb9ada89ee54/dashboard_overview_1773085888531.png)

## ✨ Features

### 📈 Pro Portfolio Tracker
- **Real-time Valuation**: Track your crypto holdings with live price updates.
- **7-Day Sparklines**: Instant visual trend analysis for every asset in your portfolio.
- **Transaction History**: Securely log every Buy and Sell transaction.
- **Net Worth Chart**: Interactive historical visualization of your total portfolio value.

### 🤖 AI Market Sentiment
- **NLP News Analysis**: Our backend AI automatically reads the latest crypto news.
- **Bullish/Bearish Ratings**: Get a unified "Market Mood" score calculated using Natural Language Processing.
- **Real-time News Feed**: Stay updated with the most relevant headlines curated for you.

### 🔐 Secure Authentication & Recovery
- **JWT Protection**: Secure, token-based authentication for all private data.
- **MongoDB Integration**: Robust user profile management.
- **Email Recovery**: End-to-end "Forgot Password" flow using NodeMailer and secure hex tokens.

### 🔄 Multi-Currency Converter
- **Instant Swaps**: Calculate conversions between hundreds of crypto pairs and fiat currencies.
- **Optimized Performance**: Fast, client-side calculation with live exchange rates.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, Prisma (SQLite), Mongoose (MongoDB)
- **Visualization**: Recharts, Framer Motion, Lucide Icons
- **AI/NLP**: Sentiment library
- **Operations**: NodeMailer, JWT, BcryptJS

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/saivinay943/crypto-pal-oracle-pro.git
   cd crypto-pal-oracle-pro
   ```

2. **Frontend Setup**
   ```bash
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file (see .env.example)
   npm run dev
   ```

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory:
```env
PORT=3000
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your_secret_here"
MONGO_URI="mongodb://127.0.0.1:27017/crypto-pal"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 📄 License
MIT

---
Built with ❤️ by [Saivinay](https://github.com/saivinay943)
