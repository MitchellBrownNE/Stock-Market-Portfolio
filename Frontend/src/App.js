import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <h1>Stock Data</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.ticker}: {item.datetime} - Open: {item.open}, Close: {item.close}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;