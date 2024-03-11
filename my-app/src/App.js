import React, { useState } from 'react';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState('');

  const cities = {
    Dallas: { lat: 32.7767, lon: -96.7970 },
    Houston: { lat: 29.7604, lon: -95.3698 },
    Austin: { lat: 30.2672, lon: -97.7431 },
  };

  const validateCoordinates = (lat, lon) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (isNaN(latNum) || isNaN(lonNum)) {
      return 'Latitude and Longitude must be numbers.';
    }
    if (latNum < -90 || latNum > 90) {
      return 'Latitude must be between -90 and 90.';
    }
    if (lonNum < -180 || lonNum > 180) {
      return 'Longitude must be between -180 and 180.';
    }
    return '';
  };

  const fetchWeatherData = async (lat, lon) => {
    const errorMsg = validateCoordinates(lat, lon);
    if (errorMsg) {
      setError(errorMsg);
      setWeatherData(null);
      return;
    }
    setError('');
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation&start=now&end=now+12h`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      setError('Failed to fetch weather data.');
    }
  };

  const handleCityClick = city => {
    const { lat, lon } = cities[city];
    fetchWeatherData(lat, lon);
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetchWeatherData(latitude, longitude);
  };

  return (
    <div className="App">
      <div className="city-buttons">
        {Object.keys(cities).map(city => (
          <button key={city} onClick={() => handleCityClick(city)}>{city}</button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="latlong-input">
        <input type="text" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="Latitude" />
        <input type="text" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="Longitude" />
        <button type="submit">Get Weather</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <div className="weatherDisplay">
      {weatherData && weatherData.hourly && (
    <table className="weatherTable">
      <thead>
        <tr>
          <th>Time</th>
          <th>Temperature (°C)</th>
          <th>Precipitation (mm)</th>
        </tr>
      </thead>
      <tbody>
        {weatherData.hourly.time.map((time, index) => (
          <tr key={time}>
            <td>{new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            <td>{weatherData.hourly.temperature_2m[index]}°C</td>
            <td>{weatherData.hourly.precipitation[index]}mm</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
      </div>
    </div>
  );
}

export default App;
