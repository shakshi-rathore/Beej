import axios from 'axios';

const API_KEY = 'ddf8d460392cddb3ae6dce968bc172ff'; // your free OpenWeather API key

export const fetchWeather = async (lat: number, lon: number) => {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  const [currentResponse, forecastResponse] = await Promise.all([
    axios.get(currentUrl),
    axios.get(forecastUrl),
  ]);

  return {
    current: currentResponse.data,
    forecast: forecastResponse.data.list.slice(0, 3), // next 3 forecasts (~9 hours)
  };
};
