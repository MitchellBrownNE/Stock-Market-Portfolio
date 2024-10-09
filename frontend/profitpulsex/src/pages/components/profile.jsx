import React from 'react';
import Modal from './Modal'; // Ensure this is the correct path

const ProfileModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}> {/* Use Modal here */}
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-4">User Profile</h1>
                <div className="bg-white shadow-md rounded-lg p-6 w-80">
                    <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
                    <p className="mb-1"><strong>Name:</strong> John Doe</p>
                    <p className="mb-1"><strong>Email:</strong> johndoe@example.com</p>
                    <p className="mb-1"><strong>Username:</strong> johndoe</p>
                    <p className="mb-1"><strong>Member Since:</strong> January 2021</p>
                </div>
            </div>
        </Modal>
    );
};

export default ProfileModal;
