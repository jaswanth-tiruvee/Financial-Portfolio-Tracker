import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './PortfolioDetail.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PortfolioDetail = ({ portfolio, onBack, apiBaseUrl }) => {
  const [holdings, setHoldings] = useState(portfolio.holdings || []);
  const [valuation, setValuation] = useState(null);
  const [priceData, setPriceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    assetType: 'crypto',
    quantity: '',
    purchasePrice: '',
  });
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchValuation();
    fetchPrices();
    fetchChartData();
  }, [portfolio]);

  const fetchValuation = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/valuation/portfolio/${portfolio._id}`
      );
      setValuation(response.data);
    } catch (error) {
      console.error('Failed to fetch valuation:', error);
    }
  };

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const assets = holdings.map((h) => ({
        assetType: h.assetType,
        symbol: h.symbol,
      }));

      if (assets.length > 0) {
        const response = await axios.post(`${apiBaseUrl}/price/batch`, { assets });
        const priceMap = {};
        response.data.forEach((price) => {
          priceMap[`${price.assetType}:${price.symbol}`] = price;
        });
        setPriceData(priceMap);
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/valuation/portfolio/${portfolio._id}/history?limit=30`
      );
      
      if (response.data && response.data.length > 0) {
        const labels = response.data
          .reverse()
          .map((v) => new Date(v.timestamp).toLocaleDateString());
        const values = response.data.map((v) => v.totalValue);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Portfolio Value',
              data: values,
              borderColor: 'rgb(102, 126, 234)',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        });
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    }
  };

  const handleAddHolding = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiBaseUrl}/portfolio/${portfolio._id}/holdings`,
        {
          ...formData,
          quantity: parseFloat(formData.quantity),
          purchasePrice: parseFloat(formData.purchasePrice) || 0,
          assetId: formData.symbol.toLowerCase(),
        }
      );
      setHoldings(response.data.holdings);
      setShowAddForm(false);
      setFormData({
        symbol: '',
        assetType: 'crypto',
        quantity: '',
        purchasePrice: '',
      });
      fetchPrices();
      // Trigger valuation
      await axios.post(
        `${apiBaseUrl}/valuation/portfolio/${portfolio._id}/calculate`
      );
    } catch (error) {
      alert('Failed to add holding: ' + error.message);
    }
  };

  const handleDeleteHolding = async (holdingId) => {
    if (!window.confirm('Are you sure you want to remove this holding?')) {
      return;
    }
    try {
      const response = await axios.delete(
        `${apiBaseUrl}/portfolio/${portfolio._id}/holdings/${holdingId}`
      );
      setHoldings(response.data.holdings);
      fetchPrices();
    } catch (error) {
      alert('Failed to delete holding: ' + error.message);
    }
  };

  const getPriceForHolding = (holding) => {
    const key = `${holding.assetType}:${holding.symbol}`;
    return priceData[key] || null;
  };

  const calculateHoldingValue = (holding) => {
    const priceInfo = getPriceForHolding(holding);
    if (!priceInfo) return 0;
    return holding.quantity * priceInfo.price;
  };

  const totalValue = holdings.reduce((sum, h) => sum + calculateHoldingValue(h), 0);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <button className="btn btn-secondary" onClick={onBack}>
            ← Back
          </button>
          <h2 style={{ marginLeft: '20px', display: 'inline' }}>
            {portfolio.name}
          </h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          + Add Holding
        </button>
      </div>

      {valuation && (
        <div className="valuation-summary">
          <div className="valuation-card">
            <h3>Total Value</h3>
            <div className="value">${valuation.totalValue.toFixed(2)}</div>
          </div>
          <div className="valuation-card">
            <h3>Total Cost</h3>
            <div className="value">${valuation.totalCost.toFixed(2)}</div>
          </div>
          <div className="valuation-card">
            <h3>Gain/Loss</h3>
            <div
              className={`value ${
                valuation.totalGainLoss >= 0 ? 'positive' : 'negative'
              }`}
            >
              ${valuation.totalGainLoss.toFixed(2)} (
              {valuation.totalGainLossPercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      )}

      {chartData && (
        <div className="chart-container">
          <h3>Portfolio Value History</h3>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: '30-Day Portfolio Value Trend',
                },
              },
              scales: {
                y: {
                  beginAtZero: false,
                  ticks: {
                    callback: function (value) {
                      return '$' + value.toLocaleString();
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddHolding} className="create-form">
          <div className="form-group">
            <label>Asset Type</label>
            <select
              value={formData.assetType}
              onChange={(e) =>
                setFormData({ ...formData, assetType: e.target.value })
              }
            >
              <option value="crypto">Crypto</option>
              <option value="stock">Stock</option>
            </select>
          </div>
          <div className="form-group">
            <label>Symbol (e.g., bitcoin, ethereum, AAPL, TSLA)</label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) =>
                setFormData({ ...formData, symbol: e.target.value })
              }
              required
              placeholder="bitcoin"
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              step="0.00000001"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
              placeholder="0.5"
            />
          </div>
          <div className="form-group">
            <label>Purchase Price (optional)</label>
            <input
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) =>
                setFormData({ ...formData, purchasePrice: e.target.value })
              }
              placeholder="50000"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              Add Holding
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="holdings-list">
        <h3>Holdings ({holdings.length})</h3>
        {loading && <p>Loading prices...</p>}
        {holdings.length === 0 ? (
          <div className="empty-state">
            <h3>No holdings yet</h3>
            <p>Add your first holding to start tracking!</p>
          </div>
        ) : (
          holdings.map((holding) => {
            const priceInfo = getPriceForHolding(holding);
            const currentValue = calculateHoldingValue(holding);
            const change24h = priceInfo?.change24h || 0;

            return (
              <div key={holding._id} className="holding-item">
                <div className="holding-info">
                  <div className="holding-symbol">
                    {holding.symbol.toUpperCase()} ({holding.assetType})
                  </div>
                  <div className="holding-details">
                    Quantity: {holding.quantity} | Purchase: $
                    {holding.purchasePrice || 'N/A'}
                  </div>
                </div>
                <div className="holding-value">
                  {priceInfo ? (
                    <>
                      <div className="holding-price">
                        ${priceInfo.price.toLocaleString()}
                      </div>
                      <div
                        className={`holding-change ${
                          change24h >= 0 ? 'positive' : 'negative'
                        }`}
                      >
                        {change24h >= 0 ? '+' : ''}
                        {change24h.toFixed(2)}% (24h)
                      </div>
                      <div className="holding-value-text">
                        Value: ${currentValue.toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <div>Loading...</div>
                  )}
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteHolding(holding._id)}
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PortfolioDetail;

