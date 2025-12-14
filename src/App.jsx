import React, { useState, useEffect } from 'react';
import CitySelector from './components/CitySelector';
import CurrentWeather from './components/CurrentWeather';
import WeatherForecast from './components/WeatherForecast';
import RadarMap from './components/RadarMap';
import { getForecast, getCurrentWeather, getRainfall, TAIWAN_COUNTIES } from './api';

function App() {
  const [selectedCity, setSelectedCity] = useState(TAIWAN_COUNTIES[0]?.name || '');
  const [forecastData, setForecastData] = useState(null);
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [rainfallData, setRainfallData] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [loadingCurrentWeather, setLoadingCurrentWeather] = useState(true);
  const [loadingRainfall, setLoadingRainfall] = useState(true);
  const [errorForecast, setErrorForecast] = useState(null);
  const [errorCurrentWeather, setErrorCurrentWeather] = useState(null);
  const [errorRainfall, setErrorRainfall] = useState(null);

  useEffect(() => {
    if (!selectedCity) return;

    // Fetch Forecast Data (F-C0032-001)
    const fetchForecast = async () => {
      setLoadingForecast(true);
      setErrorForecast(null);
      try {
        const data = await getForecast(selectedCity);
        if (data && data.location && data.location.length > 0) {
          setForecastData(data.location[0]); // Pass the entire location data to WeatherForecast
        } else {
            setForecastData([]);
        }
      } catch (err) {
        setErrorForecast(err.message);
      } finally {
        setLoadingForecast(false);
      }
    };

    // Fetch Current Weather Data (O-A0003-001) and Rainfall Data (O-A0001-001)
    const fetchCurrentObservations = async () => {
        setLoadingCurrentWeather(true);
        setLoadingRainfall(true);
        setErrorCurrentWeather(null);
        setErrorRainfall(null);

        // Find the station ID for the selected city from TAIWAN_COUNTIES
        const cityInfo = TAIWAN_COUNTIES.find(county => county.name === selectedCity);
        const stationId = cityInfo ? cityInfo.stationId : null;

        if (!stationId) {
            console.warn(`No stationId found for ${selectedCity}. Skipping current weather and rainfall fetch.`);
            setLoadingCurrentWeather(false);
            setLoadingRainfall(false);
            setErrorCurrentWeather('找不到對應觀測站');
            setErrorRainfall('找不到對應觀測站');
            setCurrentWeatherData(null);
            setRainfallData(null);
            return;
        }

        try {
            const weather = await getCurrentWeather(stationId);
            if (weather && weather.location && weather.location.length > 0) {
                // Assuming the first location and first weather element are relevant
                const currentObs = weather.location[0].weatherElement.reduce((acc, el) => {
                    acc[el.elementName] = el.elementValue;
                    return acc;
                }, {});
                setCurrentWeatherData(currentObs);
            } else {
                setCurrentWeatherData(null);
            }
        } catch (err) {
            setErrorCurrentWeather(err.message);
        } finally {
            setLoadingCurrentWeather(false);
        }

        try {
            const rainfall = await getRainfall(stationId); // Re-use stationId for rainfall for simplicity
            if (rainfall && rainfall.location && rainfall.location.length > 0) {
                const currentRain = rainfall.location[0].weatherElement.reduce((acc, el) => {
                    acc[el.elementName] = el.elementValue;
                    return acc;
                }, {});
                setRainfallData(currentRain);
            } else {
                setRainfallData(null);
            }
        } catch (err) {
            setErrorRainfall(err.message);
        } finally {
            setLoadingRainfall(false);
        }
    };

    fetchForecast();
    fetchCurrentObservations();

    // Refresh current observations every 10 minutes
    const intervalId = setInterval(fetchCurrentObservations, 10 * 60 * 1000);
    return () => clearInterval(intervalId);

  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">台灣天氣查詢</h1>

        <CitySelector selectedCity={selectedCity} onSelectCity={setSelectedCity} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CurrentWeather
            weatherData={currentWeatherData}
            rainfallData={rainfallData}
            loading={loadingCurrentWeather || loadingRainfall}
            error={errorCurrentWeather || errorRainfall}
          />
          <RadarMap />
        </div>

        <WeatherForecast
          forecastData={forecastData}
          loading={loadingForecast}
          error={errorForecast}
        />
      </div>
    </div>
  );
}

export default App;