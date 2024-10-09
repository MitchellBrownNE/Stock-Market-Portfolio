import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg shadow-lg w-2/3 h-3/4"> {/* Adjust height here */}
                <button onClick={onClose} className="text-red-500 float-right">Close</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
