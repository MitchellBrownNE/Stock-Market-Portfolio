import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
// Adjust the path to your logo file

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

  return (
    <nav className="bg-black p-4  top-0 left-0 right-0 z-50 flex justify-between items-center  ">
      {/* Centered Logo */}
      <div className="flex-grow text-center">
        <img src={logo} alt="Logo" className="h-10 inline-block" />{" "}
        {/* Adjust the className for logo size */}
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
          <ul className="absolute z-50 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMenuClick("/dashboard")}
            >
              Dashboard
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMenuClick("/profile")}
            >
              Profile
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMenuClick("/settings")}
            >
              Settings
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMenuClick("/about")}
            >
              About Us
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMenuClick("/logout")}
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
