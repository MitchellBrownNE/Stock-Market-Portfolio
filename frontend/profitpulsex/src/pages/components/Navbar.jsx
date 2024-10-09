import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTachometerAlt, faCogs, faUser } from "@fortawesome/free-solid-svg-icons";

function Navbar({ onSettingsClick, onProfileClick }) {
  return (
    <nav className="bg-blue-500 p-4 fixed top-0 left-0 right-0 z-50 rounded-b-lg">
      <ul className="flex flex-col sm:flex-row justify-around text-white space-y-2 sm:space-y-0 sm:space-x-10">
        <li><a href="/"><FontAwesomeIcon icon={faHome} className="text-3xl" /></a></li>
        <li><a href="/dashboard"><FontAwesomeIcon icon={faTachometerAlt} className="text-3xl" /></a></li>
        <li>
          <button onClick={onProfileClick}>
            <FontAwesomeIcon icon={faUser} className="text-3xl" />
          </button> {/* Trigger the profile modal */}
        </li>
        <li><button onClick={onSettingsClick}><FontAwesomeIcon icon={faCogs} className="text-3xl" /></button></li>
      </ul>
    </nav>
  );
}

export default Navbar;
