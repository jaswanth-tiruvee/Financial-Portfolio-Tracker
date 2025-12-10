const axios = require('axios');

const COINGECKO_API_URL = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
const IEX_CLOUD_API_URL = process.env.IEX_CLOUD_API_URL || 'https://cloud.iexapis.com/stable';
const IEX_CLOUD_API_KEY = process.env.IEX_CLOUD_API_KEY;

class PriceService {
  async getCurrentPrice(assetType, symbol) {
    if (assetType === 'crypto') {
      return await this.getCryptoPrice(symbol);
    } else if (assetType === 'stock') {
      return await this.getStockPrice(symbol);
    } else {
      throw new Error(`Unsupported asset type: ${assetType}`);
    }
  }

  async getCryptoPrice(symbol) {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
        params: {
          ids: symbol.toLowerCase(),
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
        },
      });

      const data = response.data[symbol.toLowerCase()];
      if (!data) {
        throw new Error(`Crypto symbol ${symbol} not found`);
      }

      return {
        symbol: symbol.toUpperCase(),
        assetType: 'crypto',
        price: data.usd,
        change24h: data.usd_24h_change,
        marketCap: data.usd_market_cap,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch crypto price: ${error.message}`);
    }
  }

  async getStockPrice(symbol) {
    try {
      if (!IEX_CLOUD_API_KEY) {
        throw new Error('IEX Cloud API key not configured');
      }

      const response = await axios.get(`${IEX_CLOUD_API_URL}/stock/${symbol}/quote`, {
        params: {
          token: IEX_CLOUD_API_KEY,
        },
      });

      const data = response.data;
      return {
        symbol: symbol.toUpperCase(),
        assetType: 'stock',
        price: data.latestPrice,
        change24h: ((data.latestPrice - data.previousClose) / data.previousClose) * 100,
        marketCap: data.marketCap,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch stock price: ${error.message}`);
    }
  }

  async getHistoricalData(assetType, symbol, days = 30) {
    if (assetType === 'crypto') {
      return await this.getCryptoHistorical(symbol, days);
    } else if (assetType === 'stock') {
      return await this.getStockHistorical(symbol, days);
    } else {
      throw new Error(`Unsupported asset type: ${assetType}`);
    }
  }

  async getCryptoHistorical(symbol, days) {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/coins/${symbol.toLowerCase()}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: days <= 1 ? 'hourly' : 'daily',
        },
      });

      return {
        symbol: symbol.toUpperCase(),
        assetType: 'crypto',
        prices: response.data.prices.map(([timestamp, price]) => ({
          timestamp: new Date(timestamp).toISOString(),
          price,
        })),
      };
    } catch (error) {
      throw new Error(`Failed to fetch crypto historical data: ${error.message}`);
    }
  }

  async getStockHistorical(symbol, days) {
    try {
      if (!IEX_CLOUD_API_KEY) {
        throw new Error('IEX Cloud API key not configured');
      }

      const range = days <= 5 ? '5d' : days <= 30 ? '1m' : '3m';
      const response = await axios.get(`${IEX_CLOUD_API_URL}/stock/${symbol}/chart/${range}`, {
        params: {
          token: IEX_CLOUD_API_KEY,
        },
      });

      return {
        symbol: symbol.toUpperCase(),
        assetType: 'stock',
        prices: response.data.map((point) => ({
          timestamp: point.date || point.minute,
          price: point.close || point.marketClose,
        })),
      };
    } catch (error) {
      throw new Error(`Failed to fetch stock historical data: ${error.message}`);
    }
  }
}

module.exports = new PriceService();

