import React, { useState } from 'react';
import axios from 'axios';
import './PortfolioList.css';

const PortfolioList = ({ portfolios, onSelect, onRefresh, apiBaseUrl }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    userId: 'user1', // In a real app, this would come from auth
  });
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${apiBaseUrl}/portfolio`, formData);
      setShowCreateForm(false);
      setFormData({ name: '', userId: 'user1' });
      onRefresh();
    } catch (error) {
      alert('Failed to create portfolio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>My Portfolios</h2>
        <div>
          <button className="btn btn-secondary" onClick={onRefresh}>
            🔄 Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{ marginLeft: '10px' }}
          >
            + New Portfolio
          </button>
        </div>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreate} className="create-form">
          <div className="form-group">
            <label>Portfolio Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., My Crypto Portfolio"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Creating...' : 'Create Portfolio'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {portfolios.length === 0 ? (
        <div className="empty-state">
          <h3>No portfolios yet</h3>
          <p>Create your first portfolio to get started!</p>
        </div>
      ) : (
        <div className="portfolio-grid">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio._id}
              className="portfolio-card"
              onClick={() => onSelect(portfolio)}
            >
              <h3>{portfolio.name}</h3>
              <p>Holdings: {portfolio.holdings.length}</p>
              <p>Created: {new Date(portfolio.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioList;

