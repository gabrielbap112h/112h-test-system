import './App.css';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from './components/Home.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Testes from './components/Testes.jsx';
import TesteUnitario from './components/TesteUnitario.jsx'

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <Router>
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/testes" element={<Testes />} />
        <Route path="/teste-unitario" element={<TesteUnitario />} />
      </Routes>
    </Router>
  );
}

export default App;
