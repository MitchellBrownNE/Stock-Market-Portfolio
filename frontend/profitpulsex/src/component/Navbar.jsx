import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Import signOut function from Firebase Auth
import { auth } from '../firebaseConfig'; // Import Firebase auth configuration
import logo from "../assets/logo.png"; // Adjust the path to your logo file

function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (path) => {
    setDropdownOpen(false);
    navigate(path); // Navigate to the desired path on option click
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-blue-500 p-4 fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
      {/* Centered Logo */}
      <div className="flex-grow text-center">
        <img src={logo} alt="Logo" className="h-10 inline-block" /> {/* Adjust the className for logo size */}
      </div>

      {/* Three dots and Dropdown Menu */}
      <div className="relative">
        <div 
          className="cursor-pointer text-white text-2xl"
          onClick={toggleDropdown}
        >
          &#8942; {/* This represents the three dots */}
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <li 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
              onClick={() => handleMenuClick('/dashboard')}
            >
              Dashboard
            </li>
            <li 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
              onClick={() => handleMenuClick('/profile')}
            >
              Profile
            </li>
            <li 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
              onClick={() => handleMenuClick('/settings')}
            >
              Settings
            </li>
            <li 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
              onClick={() => handleMenuClick('/about')}
            >
              About Us
            </li>
            <li 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
              onClick={handleLogout} // Call the handleLogout function on click
            >
              Logout
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
