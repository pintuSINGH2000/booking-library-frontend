import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookSetAPI, masterDataAPI } from '../../services/api';
import Spinner from '../../components/Spinner';
import { BookOpen, Library, School, GraduationCap, Globe, Calendar, Plus, Settings } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookSets: 0,
    totalBoards: 0,
    totalMediums: 0,
    totalClasses: 0,
    totalBooks: 0,
    totalYears: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [bookSets, boards, mediums, classes, books, years] = await Promise.all([
        bookSetAPI.getAll(),
        masterDataAPI.getBoards(),
        masterDataAPI.getMediums(),
        masterDataAPI.getClasses(),
        masterDataAPI.getBooks(),
        masterDataAPI.getAcademicYears()
      ]);

      setStats({
        totalBookSets: bookSets.data.data.length,
        totalBoards: boards.data.data.length,
        totalMediums: mediums.data.data.length,
        totalClasses: classes.data.data.length,
        totalBooks: books.data.data.length,
        totalYears: years.data.data.length
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner size="large" />
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome to School Book Inventory Management System</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon"><Library size={32} /></div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalBookSets}</h3>
            <p className="stat-label">Book Sets</p>
          </div>
          <button onClick={() => navigate('/book-sets')} className="stat-link">
            View All →
          </button>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon"><BookOpen size={32} /></div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalBooks}</h3>
            <p className="stat-label">Total Books</p>
          </div>
          <button onClick={() => navigate('/master-data')} className="stat-link">
            Manage →
          </button>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon"><School size={32} /></div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalBoards}</h3>
            <p className="stat-label">Boards</p>
          </div>
          <button onClick={() => navigate('/master-data')} className="stat-link">
            Manage →
          </button>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon"><GraduationCap size={32} /></div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalClasses}</h3>
            <p className="stat-label">Classes</p>
          </div>
          <button onClick={() => navigate('/master-data')} className="stat-link">
            Manage →
          </button>
        </div>

        <div className="stat-card stat-card-purple">
          <div className="stat-icon"><Globe size={32} /></div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalMediums}</h3>
            <p className="stat-label">Mediums</p>
          </div>
          <button onClick={() => navigate('/master-data')} className="stat-link">
            Manage →
          </button>
        </div>

        <div className="stat-card stat-card-danger">
          <div className="stat-icon"><Calendar size={32} /></div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalYears}</h3>
            <p className="stat-label">Academic Years</p>
          </div>
          <button onClick={() => navigate('/master-data')} className="stat-link">
            Manage →
          </button>
        </div>
      </div>

      <div className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="action-buttons">
          <button onClick={() => navigate('/book-sets/create')} className="action-btn action-btn-primary">
            <span className="action-icon"><Plus size={32} /></span>
            <div className="action-text">
              <h3>Create Book Set</h3>
              <p>Add a new book set</p>
            </div>
          </button>
          <button onClick={() => navigate('/master-data')} className="action-btn action-btn-secondary">
            <span className="action-icon"><Settings size={32} /></span>
            <div className="action-text">
              <h3>Master Data</h3>
              <p>Manage boards, classes, books</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
