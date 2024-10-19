import React, { useState } from "react";

const SettingsPage = ({ theme, setTheme }) => {

    return (
        <div className={`flex flex-col items-center`}>
            <h1 className="text-3xl font-bold mb-4">Settings</h1>
            <div className={`bg-white shadow-md rounded-lg p-4 w-96 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
                
            </div>
        </div>
    );
};

export default SettingsPage;
