import React from "react";

const Card = ({ children, selected }) => {
  return (
    <div
      className={`w-full h-full rounded-md relative p-4 border-2 shadow-lg ${
        selected ? "bg-black text-white" : "bg-textcolor"
      }`}
    >
      {children}
    </div>
  );
};

export default Card;