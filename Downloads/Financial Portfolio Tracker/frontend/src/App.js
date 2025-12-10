import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortfolioList from './components/PortfolioList';
import PortfolioDetail from './components/PortfolioDetail';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/portfolio`);
      setPortfolios(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load portfolios. Make sure the API server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioSelect = (portfolio) => {
    setSelectedPortfolio(portfolio);
  };

  const handleBack = () => {
    setSelectedPortfolio(null);
    fetchPortfolios();
  };

  if (loading && portfolios.length === 0) {
    return (
      <div className="app">
        <div className="loading">Loading portfolios...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Financial Portfolio Tracker</h1>
        <p>Crypto & Stock Portfolio Management with Real-time Data</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {selectedPortfolio ? (
        <PortfolioDetail
          portfolio={selectedPortfolio}
          onBack={handleBack}
          apiBaseUrl={API_BASE_URL}
        />
      ) : (
        <PortfolioList
          portfolios={portfolios}
          onSelect={handlePortfolioSelect}
          onRefresh={fetchPortfolios}
          apiBaseUrl={API_BASE_URL}
        />
      )}
    </div>
  );
}

export default App;

