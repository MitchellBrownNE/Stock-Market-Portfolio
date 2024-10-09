import React from "react";

const Card = ({ children }) => {
    return (
        <div className="w-full h-full rounded-lg p-6 border-2 border-gray-400 bg-gray-200 shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-gray-300">
            <div className="flex flex-col justify-center items-center h-full">
                {children}
            </div>
        </div>
    );
};

export default Card;
