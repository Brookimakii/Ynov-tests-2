/* istanbul ignore file */
import './App.css';
import RegistrationForm from './components/RegistrationForm'; 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import HomePage from './pages/HomePage';
import { useEffect, useState } from "react"
import { loadUsers, saveUsers, addUser as addUserUtil } from './utils/userStorage';
import { getUsers, createUser } from './api/userAPI';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <Router>
      {/* istanbul ignore next */}
      <nav style={{ display: "flex", gap: "10px", padding: "10px" }}>
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage users={users} />} />
        <Route path="/register" element={<RegistrationForm users={users} />} />
      </Routes>
    </Router>
  );
}

export default App;
