import React from "react";

function StarterPage() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen bg-bgdark">
        <h1 className="text-white text-6xl font-heading mb-8">
          Profit Pulse X
        </h1>
        <div className="flex space-x-4">
          <button className="bg-lightgreen font-body text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
            Login
          </button>
          <button className="bg-boldred font-body text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none">
            Register
          </button>
        </div>
      </div>
    </>
  );
}

export default StarterPage;
