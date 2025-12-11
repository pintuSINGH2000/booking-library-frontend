import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BookSetList from './pages/BookSetList';
import CreateBookSet from './pages/CreateBookSet';
import EditBookSet from './pages/EditBookSet';
import MasterData from './pages/MasterData';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/book-sets" element={<BookSetList />} />
          <Route path="/book-sets/create" element={<CreateBookSet />} />
          <Route path="/book-sets/edit/:id" element={<EditBookSet />} />
          <Route path="/master-data" element={<MasterData />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
