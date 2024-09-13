function App() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen bg-black">
        <h1 className="text-white text-6xl mb-8">Profit Pulse X</h1>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
            Login
          </button>
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none">
            Register
          </button>
        </div>
      </div>
      );
    </>
  );
}

export default App;
