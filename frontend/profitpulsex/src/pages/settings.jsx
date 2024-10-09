import React, { useState } from 'react';

function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [theme, setTheme] = useState('light');
    
    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };

    const handleNotificationChange = () => {
        setEmailNotifications(!emailNotifications);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Settings</h1>
            <div className="bg-white shadow-md rounded-lg p-6 w-80">
                <h2 className="text-xl font-semibold mb-2">Preferences</h2>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                    </label>
                    <select
                        value={theme}
                        onChange={handleThemeChange}
                        className="form-select mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={emailNotifications}
                            onChange={handleNotificationChange}
                        />
                        <span className="ml-2">Enable Email Notifications</span>
                    </label>
                </div>

                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                    Save Settings
                </button>
            </div>
        </div>
    );
}

export default SettingsPage;
