import './App.css';
import RegistrationForm from './components/RegistrationForm'; 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import HomePage from './pages/HomePage';
import { useEffect, useState } from "react"
import { loadUsers, saveUsers, addUser as addUserUtil } from './utils/userStorage';



function App() {
  const [users, setUsers] = useState([]);

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    setUsers(loadUsers());
  }, []);

  // Ajouter un utilisateur
  const addUser = (user) => {
    const updatedUsers = addUserUtil(users, user);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  return (
    <Router>
      <nav style={{ display: "flex", gap: "10px", padding: "10px" }}>
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage users={users} />} />
        <Route path="/register" element={<RegistrationForm addUser={addUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
