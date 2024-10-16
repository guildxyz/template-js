import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';

const App = () => {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-900 text-green-400 font-mono flex flex-col">
        <header className="bg-gray-800 p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Your App</h1>
            <div className="space-x-4">
              <NavLink to="/" className={({ isActive }) => 
                `px-3 py-2 rounded-md transition-colors duration-200 ${isActive ? 'bg-green-700 text-white' : 'hover:bg-gray-700'}`
              }>Home</NavLink>
              <NavLink to="/about" className={({ isActive }) => 
                `px-3 py-2 rounded-md transition-colors duration-200 ${isActive ? 'bg-green-700 text-white' : 'hover:bg-gray-700'}`
              }>About</NavLink>
            </div>
          </nav>
        </header>
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-center p-4">
          <p>&copy; 2024 Your App. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
