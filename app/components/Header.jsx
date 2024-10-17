import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => (
  <header className="bg-gray-800 p-4">
    <nav className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">Your App</h1>
      <div className="space-x-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md transition-colors duration-200 ${
              isActive ? 'bg-green-700 text-white' : 'hover:bg-gray-700'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md transition-colors duration-200 ${
              isActive ? 'bg-green-700 text-white' : 'hover:bg-gray-700'
            }`
          }
        >
          About
        </NavLink>
      </div>
    </nav>
  </header>
);

export default Header;
