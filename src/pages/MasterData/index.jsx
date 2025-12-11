import { useState, useEffect } from 'react';
import { masterDataAPI } from '../../services/api';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import Spinner, { ButtonSpinner } from '../../components/Spinner';
import { School, Globe, GraduationCap, Calendar, BookOpen, Edit2, Trash2 } from 'lucide-react';
import './MasterData.css';

function MasterData() {
  const [activeTab, setActiveTab] = useState('boards');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [boards, setBoards] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [classes, setClasses] = useState([]);
  const [years, setYears] = useState([]);
  const [books, setBooks] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [boardsRes, mediumsRes, classesRes, yearsRes, booksRes] = await Promise.all([
        masterDataAPI.getBoards(),
        masterDataAPI.getMediums(),
        masterDataAPI.getClasses(),
        masterDataAPI.getAcademicYears(),
        masterDataAPI.getBooks()
      ]);

      setBoards(boardsRes.data.data);
      setMediums(mediumsRes.data.data);
      setClasses(classesRes.data.data);
      setYears(yearsRes.data.data);
      setBooks(booksRes.data.data);
    } catch (err) {
      setError('Failed to load master data');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = (type) => {
    setModalMode('add');
    setCurrentItem(null);
    setFormData(getInitialFormData(type));
    setModalOpen(true);
    setError('');
    setSuccess('');
  };

  const openEditModal = (type, item) => {
    setModalMode('edit');
    setCurrentItem(item);
    setFormData(getFormDataFromItem(type, item));
    setModalOpen(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({});
    setCurrentItem(null);
  };

  const getInitialFormData = (type) => {
    switch (type) {
      case 'boards':
        return { board_name: '' };
      case 'mediums':
        return { medium_name: '' };
      case 'classes':
        return { class_name: '', class_order: '' };
      case 'years':
        return { year_name: '', start_date: '', end_date: '' };
      case 'books':
        return { book_name: '', subject: '', publisher: '' };
      default:
        return {};
    }
  };

  const getFormDataFromItem = (type, item) => {
    switch (type) {
      case 'boards':
        return { board_name: item.board_name };
      case 'mediums':
        return { medium_name: item.medium_name };
      case 'classes':
        return { class_name: item.class_name, class_order: item.class_order };
      case 'years':
        return {
          year_name: item.year_name,
          start_date: item.start_date?.split('T')[0] || '',
          end_date: item.end_date?.split('T')[0] || ''
        };
      case 'books':
        return {
          book_name: item.book_name,
          subject: item.subject,
          publisher: item.publisher
        };
      default:
        return {};
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSubmitting(true);
      if (modalMode === 'add') {
        await masterDataAPI.create(activeTab, formData);
        setSuccess(`${activeTab.slice(0, -1)} added successfully!`);
      } else {
        await masterDataAPI.update(activeTab, currentItem.id, formData);
        setSuccess(`${activeTab.slice(0, -1)} updated successfully!`);
      }
      await loadData();
      setTimeout(() => {
        closeModal();
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${modalMode} ${activeTab.slice(0, -1)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getItemName = (type, item) => {
    switch (type) {
      case 'boards':
        return item.board_name;
      case 'mediums':
        return item.medium_name;
      case 'classes':
        return item.class_name;
      case 'years':
        return item.year_name;
      case 'books':
        return item.book_name;
      default:
        return '';
    }
  };

  const openDeleteModal = (type, id, name) => {
    setDeleteModal({ isOpen: true, type, id, name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, type: '', id: null, name: '' });
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await masterDataAPI.delete(deleteModal.type, deleteModal.id);
      setSuccess('Item deleted successfully!');
      closeDeleteModal();
      await loadData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete item');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeleting(false);
    }
  };

  const renderTable = () => {
    let data = [];
    let columns = [];

    switch (activeTab) {
      case 'boards':
        data = boards;
        columns = ['Board Name'];
        break;
      case 'mediums':
        data = mediums;
        columns = ['Medium Name'];
        break;
      case 'classes':
        data = classes;
        columns = ['Class Name', 'Order'];
        break;
      case 'years':
        data = years;
        columns = ['Year Name', 'Start Date', 'End Date'];
        break;
      case 'books':
        data = books;
        columns = ['Book Name', 'Subject', 'Publisher'];
        break;
      default:
        break;
    }

    return (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '40px' }}>
                  No data available. Add your first item!
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  {activeTab === 'boards' && (
                    <>
                      <td>{item.board_name}</td>
                    </>
                  )}
                  {activeTab === 'mediums' && (
                    <>
                      <td>{item.medium_name}</td>
                    </>
                  )}
                  {activeTab === 'classes' && (
                    <>
                      <td>{item.class_name}</td>
                      <td>{item.class_order}</td>
                    </>
                  )}
                  {activeTab === 'years' && (
                    <>
                      <td>{item.year_name}</td>
                      <td>{item.start_date?.split('T')[0]}</td>
                      <td>{item.end_date?.split('T')[0]}</td>
                    </>
                  )}
                  {activeTab === 'books' && (
                    <>
                      <td>{item.book_name}</td>
                      <td>{item.subject}</td>
                      <td>{item.publisher}</td>
                    </>
                  )}
                  <td>
                    <div className="action-buttons-cell">
                      <button
                        onClick={() => openEditModal(activeTab, item)}
                        className="btn-icon btn-icon-edit"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(activeTab, item.id, getItemName(activeTab, item))}
                        className="btn-icon btn-icon-delete"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'boards':
        return (
          <div className="form-group">
            <label className="form-label">Board Name *</label>
            <input
              type="text"
              name="board_name"
              value={formData.board_name || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., CBSE"
              required
            />
          </div>
        );
      case 'mediums':
        return (
          <div className="form-group">
            <label className="form-label">Medium Name *</label>
            <input
              type="text"
              name="medium_name"
              value={formData.medium_name || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., English"
              required
            />
          </div>
        );
      case 'classes':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Class Name *</label>
              <input
                type="text"
                name="class_name"
                value={formData.class_name || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Class 1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Class Order *</label>
              <input
                type="number"
                name="class_order"
                value={formData.class_order || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., 1"
                required
              />
            </div>
          </>
        );
      case 'years':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Year Name *</label>
              <input
                type="text"
                name="year_name"
                value={formData.year_name || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., 2024-2025"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date || ''}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date || ''}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </>
        );
      case 'books':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Book Name *</label>
              <input
                type="text"
                name="book_name"
                value={formData.book_name || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Mathematics Textbook"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Mathematics"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Publisher *</label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., NCERT"
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { key: 'boards', label: 'Boards', icon: School },
    { key: 'mediums', label: 'Mediums', icon: Globe },
    { key: 'classes', label: 'Classes', icon: GraduationCap },
    { key: 'years', label: 'Academic Years', icon: Calendar },
    { key: 'books', label: 'Books', icon: BookOpen },
  ];

  if (loading && boards.length === 0) {
    return (
      <div className="loading-container">
        <Spinner size="large" />
        <p className="loading-text">Loading master data...</p>
      </div>
    );
  }

  return (
    <div className="master-data">
      <div className="page-header">
        <h1 className="page-title">Master Data Management</h1>
        <p className="page-subtitle">Manage boards, mediums, classes, academic years, and books</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="master-data-card">
        <div className="tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <IconComponent size={18} className="tab-icon" />
                <span className="tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="tab-content">
          <div className="tab-header">
            <h2 className="tab-title">
              {tabs.find(t => t.key === activeTab)?.label}
            </h2>
            <button
              onClick={() => openAddModal(activeTab)}
              className="btn btn-primary"
            >
              + Add New
            </button>
          </div>

          {renderTable()}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={`${modalMode === 'add' ? 'Add' : 'Edit'} ${tabs.find(t => t.key === activeTab)?.label.slice(0, -1)}`}
      >
        <form onSubmit={handleSubmit}>
          {renderForm()}

          {error && (
            <div className="alert alert-error" style={{ marginTop: '16px' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" style={{ marginTop: '16px' }}>
              {success}
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <ButtonSpinner />
                  <span style={{ marginLeft: '8px' }}>{modalMode === 'add' ? 'Adding...' : 'Updating...'}</span>
                </>
              ) : (
                modalMode === 'add' ? 'Add' : 'Update'
              )}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleting}
      />
    </div>
  );
}

export default MasterData;
