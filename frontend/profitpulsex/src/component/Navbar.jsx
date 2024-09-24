// src/components/Navbar.jsx

import React from 'react';

function Navbar() {
    console.log("Navbar rendered");
  return (
    <nav className="bg-blue-500 p-4 fixed top-0 left-0 right-0 z-50">
      <ul className="flex justify-between text-white">
        <li><a href="/">Home</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/register">Register</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
