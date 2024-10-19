import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';

const App = () => (
  <div className="App min-h-screen bg-gray-900 text-green-400 font-mono flex flex-col">
    <Header />
    <main className="flex-grow container mx-auto p-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* Add other routes as needed */}
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;
