import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Settings, User } from 'lucide-react';
import './Layout.css';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/book-sets', icon: BookOpen, label: 'Book Sets' },
    { path: '/master-data', icon: Settings, label: 'Master Data' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Top Header */}
      <header className="admin-header">
        <div className="header-left">
          <button className="hamburger" onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1 className="header-title">School Book Inventory</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              <User size={18} />
            </div>
            <span className="user-name">Admin</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <IconComponent size={20} className="sidebar-icon" />
                <span className="sidebar-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Main Content */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
