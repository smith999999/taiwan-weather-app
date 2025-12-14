import React from 'react';

const WeatherForecast = ({ forecastData, loading, error }) => {
  if (loading) {
    return <div className="text-center py-4">載入一週天氣預報中...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">天氣預報載入失敗: {error}</div>;
  }

  if (!forecastData || forecastData.length === 0) {
    return <div className="text-center py-4">無一週天氣預報資料</div>;
  }


  const dailyForecasts = {};

  if (forecastData && forecastData.weatherElement) {
    forecastData.weatherElement.forEach(weatherElement => {
      const elementName = weatherElement.elementName;
      weatherElement.time.forEach(timeEntry => {
        const dataTime = new Date(timeEntry.startTime);
        if (isNaN(dataTime.getTime())) { // Check for invalid date
          console.warn('Invalid date string:', timeEntry.startTime);
          return;
        }
        const dateKey = dataTime.toISOString().slice(0, 10); // YYYY-MM-DD

        if (!dailyForecasts[dateKey]) {
          dailyForecasts[dateKey] = {
            date: dataTime.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', weekday: 'short' }),
            MinT: 'N/A',
            MaxT: 'N/A',
            PoP6h: 'N/A',
            PoP12h: 'N/A',
            Wx: 'N/A',
          };
        }

        // Assign the elementValue to the correct property
        // Note: elementValue can be an object with 'value' property
        const value = timeEntry.elementValue
          ? (timeEntry.elementValue.value !== undefined
            ? timeEntry.elementValue.value
            : timeEntry.elementValue)
          : 'N/A';

        switch (elementName) {
          case 'MinT':
            dailyForecasts[dateKey].MinT = value;
            break;
          case 'MaxT':
            dailyForecasts[dateKey].MaxT = value;
            break;
          case 'PoP6h':
            dailyForecasts[dateKey].PoP6h = value;
            break;
          case 'PoP12h':
            dailyForecasts[dateKey].PoP12h = value;
            break;
          case 'Wx':
            dailyForecasts[dateKey].Wx = value;
            break;
          // Add other weather elements if needed
        }
      });
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">一週天氣預報</h2>
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          {Object.values(dailyForecasts).map((day, index) => (
            <div key={index} className="flex-none w-48 bg-blue-50 p-4 rounded-lg shadow-sm text-center">
              <h3 className="font-semibold text-lg mb-2 text-blue-700">{day.date}</h3>
              <p>天氣: {day.Wx}</p>
              <p>溫度: {day.MinT}~{day.MaxT}°C</p>
              {day.PoP6h !== 'N/A' && <p>6小時降雨機率: {day.PoP6h}%</p>}
              {day.PoP12h !== 'N/A' && <p>12小時降雨機率: {day.PoP12h}%</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
