import React, { useEffect, useState } from "react";
import "./WeatherApp.css";

const API_Key = import.meta.env.VITE_API_KEY;

const WeatherApp = () => {
  const [cityInput, setCityInput] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [weatherDetails, setWeatherDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (cityInput.trim() !== "") {
      setSearchCity(cityInput.trim());
    }
  }

  useEffect(() => {
    if (!searchCity) return;
    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_Key}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setLoading(false);
          if (data.cod !== 200) {
            setError("city not found");
            setWeatherDetails(null);
          } else {
            setWeatherDetails(data);
            console.log(data);
          }
        }, 300);
      })
      .catch((err) => {
        console.log({ err });
        setLoading(false);
        setError("something went wrong");
        setWeatherDetails(null);
      });
  }, [searchCity]);

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={cityInput}
          placeholder="Search a city..."
          onChange={(e) => setCityInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="weather-info">
        {loading && <p>Loading...</p>}
        {!loading && weatherDetails && weatherDetails.main && (
          <>
            <h2>
              {weatherDetails.name}, {weatherDetails.sys.country}
            </h2>
            <img
              src={`https://openweathermap.org/img/wn/${weatherDetails.weather[0].icon}@2x.png`}
              alt={weatherDetails.weather[0].description}
            />
            <p>
              <strong>Temperature:</strong>{" "}
              {Math.round(weatherDetails.main.temp - 273.15)}°C
            </p>
            <p>
              <strong>Condition:</strong>{" "}
              {weatherDetails.weather[0].description}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
