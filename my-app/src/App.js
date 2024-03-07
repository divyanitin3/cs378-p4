import React, { useState } from 'react';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const cities = {
    Dallas: { lat: 32.7767, lon: -96.7970 },
    Houston: { lat: 29.7604, lon: -95.3698 },
    Austin: { lat: 30.2672, lon: -97.7431 },
  };

  const fetchWeatherData = async (lat, lon) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation&start=now&end=now+12h`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setWeatherData(data);
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
      <div className="weatherDisplay">
        {weatherData && weatherData.hourly && (
          <div>
            {weatherData.hourly.time.map((time, index) => {
              return (
                <div key={time}>
                  Time: {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, 
                  Temperature: {weatherData.hourly.temperature_2m[index]}°C, 
                  Precipitation: {weatherData.hourly.precipitation[index]}mm
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
