import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookSetAPI, masterDataAPI } from '../../services/api';
import Spinner, { ButtonSpinner } from '../../components/Spinner';
import { ArrowLeft } from 'lucide-react';

function EditBookSet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [boards, setBoards] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [classes, setClasses] = useState([]);
  const [years, setYears] = useState([]);
  const [books, setBooks] = useState([]);

  const [formData, setFormData] = useState({
    board_id: '',
    medium_id: '',
    class_id: '',
    year_id: '',
    set_name: ''
  });

  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [boardsRes, mediumsRes, classesRes, yearsRes, booksRes, bookSetRes] = await Promise.all([
        masterDataAPI.getBoards(),
        masterDataAPI.getMediums(),
        masterDataAPI.getClasses(),
        masterDataAPI.getAcademicYears(),
        masterDataAPI.getBooks(),
        bookSetAPI.getById(id)
      ]);

      setBoards(boardsRes.data.data);
      setMediums(mediumsRes.data.data);
      setClasses(classesRes.data.data);
      setYears(yearsRes.data.data);
      setBooks(booksRes.data.data);

      const bookSet = bookSetRes.data.data;
      setFormData({
        board_id: bookSet.board_id,
        medium_id: bookSet.medium_id,
        class_id: bookSet.class_id,
        year_id: bookSet.year_id,
        set_name: bookSet.set_name
      });

      setSelectedBooks(
        bookSet.book_set_items.map(item => ({
          book_id: item.books.id,
          book: item.books,
          quantity: item.quantity
        }))
      );
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBook = (e) => {
    const bookId = parseInt(e.target.value);
    if (!bookId) return;

    const book = books.find(b => b.id === bookId);
    if (!book || selectedBooks.find(b => b.book_id === bookId)) return;

    setSelectedBooks(prev => [...prev, { book_id: bookId, book, quantity: 1 }]);
    e.target.value = '';
  };

  const handleQuantityChange = (bookId, quantity) => {
    setSelectedBooks(prev =>
      prev.map(item =>
        item.book_id === bookId ? { ...item, quantity: parseInt(quantity) || 1 } : item
      )
    );
  };

  const handleRemoveBook = (bookId) => {
    setSelectedBooks(prev => prev.filter(item => item.book_id !== bookId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.board_id || !formData.medium_id || !formData.class_id || !formData.year_id || !formData.set_name) {
      setError('All fields are required');
      return;
    }

    if (selectedBooks.length === 0) {
      setError('Please select at least one book');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        board_id: parseInt(formData.board_id),
        medium_id: parseInt(formData.medium_id),
        class_id: parseInt(formData.class_id),
        year_id: parseInt(formData.year_id),
        books: selectedBooks.map(({ book_id, quantity }) => ({ book_id, quantity }))
      };

      await bookSetAPI.update(id, payload);
      setSuccess('Book set updated successfully!');
      setTimeout(() => navigate('/book-sets'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update book set');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.set_name) {
    return (
      <div className="loading-container">
        <Spinner size="large" />
        <p className="loading-text">Loading book set...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => navigate('/book-sets')}
          className="back-button"
          title="Back to Book Sets"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>Edit Book Set</h1>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="filters">
          <div className="form-group">
            <label className="form-label">Board *</label>
            <select
              name="board_id"
              value={formData.board_id}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Select Board</option>
              {boards.map(board => (
                <option key={board.id} value={board.id}>{board.board_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Medium *</label>
            <select
              name="medium_id"
              value={formData.medium_id}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Select Medium</option>
              {mediums.map(medium => (
                <option key={medium.id} value={medium.id}>{medium.medium_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Class *</label>
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.class_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Academic Year *</label>
            <select
              name="year_id"
              value={formData.year_id}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Select Year</option>
              {years.map(year => (
                <option key={year.id} value={year.id}>{year.year_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Set Name *</label>
          <input
            type="text"
            name="set_name"
            value={formData.set_name}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., Class 3 English Medium Set"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Add Books *</label>
          <select onChange={handleAddBook} className="form-select">
            <option value="">Select a book to add</option>
            {books
              .filter(book => !selectedBooks.find(sb => sb.book_id === book.id))
              .map(book => (
                <option key={book.id} value={book.id}>
                  {book.book_name} - {book.subject} ({book.publisher})
                </option>
              ))}
          </select>
        </div>

        {selectedBooks.length > 0 && (
          <div className="selected-books">
            <h3>Selected Books ({selectedBooks.length})</h3>
            <div className="selected-books-list">
              {selectedBooks.map(item => (
                <div key={item.book_id} className="selected-book-item">
                  <div>
                    <strong>{item.book.book_name}</strong>
                    <span> - {item.book.subject} ({item.book.publisher})</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.book_id, e.target.value)}
                      style={{ width: '80px', padding: '0.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBook(item.book_id)}
                      className="btn btn-danger"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <ButtonSpinner />
                <span style={{ marginLeft: '8px' }}>Updating...</span>
              </>
            ) : 'Update Book Set'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/book-sets')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBookSet;
