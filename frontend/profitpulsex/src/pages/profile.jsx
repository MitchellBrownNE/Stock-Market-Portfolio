import React from 'react';

function ProfilePage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">User Profile</h1>
            <div className="bg-white shadow-md rounded-lg p-6 w-80">
                <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
                <p className="mb-1"><strong>Name:</strong> John Doe</p>
                <p className="mb-1"><strong>Email:</strong> johndoe@example.com</p>
                <p className="mb-1"><strong>Username:</strong> johndoe</p>
                <p className="mb-1"><strong>Member Since:</strong> January 2021</p>
            </div>
        </div>
    );
}

export default ProfilePage;
