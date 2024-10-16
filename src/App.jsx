import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { useAtom } from 'jotai';
import { tokenAtom, usernameAtom } from './atoms';

function App() {

  return (
    <Router>
      <div className="App min-h-screen text-green-400 font-mono">
        <h1>Hello World</h1>
      </div>
    </Router>
  );
}

export default App;
