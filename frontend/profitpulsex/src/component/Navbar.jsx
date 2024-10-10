import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function Navbar() {
    console.log("Navbar rendered");
  return (
    <nav className="bg-blue-500 p-4 fixed top-0 left-0 right-0 z-50">
      <ul className="flex justify-between text-white">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
