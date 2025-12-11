import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookSetAPI, masterDataAPI } from '../../services/api';
import Spinner from '../../components/Spinner';
import ConfirmModal from '../../components/ConfirmModal';
import { ChevronDown, ChevronRight, Edit2, Trash2, Plus } from 'lucide-react';

function BookSetList() {
  const navigate = useNavigate();
  const [bookSets, setBookSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSets, setExpandedSets] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  const [boards, setBoards] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [classes, setClasses] = useState([]);
  const [years, setYears] = useState([]);

  const [filters, setFilters] = useState({
    board_id: '',
    medium_id: '',
    class_id: '',
    year_id: ''
  });

  useEffect(() => {
    loadMasterData();
    loadBookSets();
  }, []);

  const loadMasterData = async () => {
    try {
      const [boardsRes, mediumsRes, classesRes, yearsRes] = await Promise.all([
        masterDataAPI.getBoards(),
        masterDataAPI.getMediums(),
        masterDataAPI.getClasses(),
        masterDataAPI.getAcademicYears()
      ]);

      setBoards(boardsRes.data.data);
      setMediums(mediumsRes.data.data);
      setClasses(classesRes.data.data);
      setYears(yearsRes.data.data);
    } catch (err) {
      setError('Failed to load master data');
    }
  };

  const loadBookSets = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await bookSetAPI.getAll(filterParams);
      setBookSets(response.data.data);
    } catch (err) {
      setError('Failed to load book sets');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const activeFilters = Object.entries(newFilters)
      .filter(([_, val]) => val !== '')
      .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});

    loadBookSets(activeFilters);
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: null, name: '' });
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await bookSetAPI.delete(deleteModal.id);
      closeDeleteModal();
      loadBookSets();
    } catch (err) {
      setError('Failed to delete book set');
    } finally {
      setDeleting(false);
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedSets);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSets(newExpanded);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner size="large" />
        <p className="loading-text">Loading book sets...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Book Sets</h1>
        <button onClick={() => navigate('/book-sets/create')} className="btn btn-primary">
          <Plus size={20} />
          Add Book Set
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div className="filters">
          <div className="form-group">
            <label className="form-label">Board</label>
            <select
              name="board_id"
              value={filters.board_id}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Boards</option>
              {boards.map(board => (
                <option key={board.id} value={board.id}>{board.board_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Medium</label>
            <select
              name="medium_id"
              value={filters.medium_id}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Mediums</option>
              {mediums.map(medium => (
                <option key={medium.id} value={medium.id}>{medium.medium_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Class</label>
            <select
              name="class_id"
              value={filters.class_id}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.class_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Academic Year</label>
            <select
              name="year_id"
              value={filters.year_id}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year.id} value={year.id}>{year.year_name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {bookSets.length === 0 ? (
        <div className="empty-state">
          <p>No book sets found. Create your first book set!</p>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {bookSets.map(bookSet => {
            const isExpanded = expandedSets.has(bookSet.id);
            return (
              <div key={bookSet.id} className="book-set-item">
                <div className="book-set-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <button
                      onClick={() => toggleExpand(bookSet.id)}
                      className="expand-btn"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                    <h3 className="book-set-title">{bookSet.set_name}</h3>
                  </div>
                  <div className="book-set-actions">
                    <button
                      onClick={() => navigate(`/book-sets/edit/${bookSet.id}`)}
                      className="btn btn-secondary btn-sm"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(bookSet.id, bookSet.set_name)}
                      className="btn btn-danger btn-sm"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="book-set-meta">
                  <div className="meta-item">
                    <span className="meta-label">Board</span>
                    <span className="meta-value">{bookSet.boards.board_name}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Medium</span>
                    <span className="meta-value">{bookSet.mediums.medium_name}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Class</span>
                    <span className="meta-value">{bookSet.classes.class_name}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Academic Year</span>
                    <span className="meta-value">{bookSet.academic_years.year_name}</span>
                  </div>
                </div>

                {isExpanded && bookSet.book_set_items && bookSet.book_set_items.length > 0 && (
                  <div className="books-list">
                    <h4 className="books-title">Books in this set ({bookSet.book_set_items.length}):</h4>
                    {bookSet.book_set_items.map((item, idx) => (
                      <div key={idx} className="book-item">
                        <div>
                          <strong>{item.books.book_name}</strong>
                          <span> - {item.books.subject} ({item.books.publisher})</span>
                        </div>
                        <span className="book-qty">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Book Set"
        message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleting}
      />
    </div>
  );
}

export default BookSetList;
