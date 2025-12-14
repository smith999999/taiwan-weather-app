import React from 'react';

const CurrentWeather = ({ weatherData, rainfallData, loading, error }) => {
  if (loading) {
    return <div className="text-center py-4">載入即時天氣中...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">即時天氣載入失敗: {error}</div>;
  }

  if (!weatherData) {
    return <div className="text-center py-4">無即時天氣資料</div>;
  }

  const { TEMP, HUMD, WDIR, WIND, RAIN } = weatherData;
  const currentRainfall = rainfallData && rainfallData.RAIN ? rainfallData.RAIN : 'N/A';

  const getWindDirection = (degree) => {
    if (degree >= 337.5 || degree < 22.5) return '北';
    if (degree >= 22.5 && degree < 67.5) return '東北';
    if (degree >= 67.5 && degree < 112.5) return '東';
    if (degree >= 112.5 && degree < 157.5) return '東南';
    if (degree >= 157.5 && degree < 202.5) return '南';
    if (degree >= 202.5 && degree < 247.5) return '西南';
    if (degree >= 247.5 && degree < 292.5) return '西';
    if (degree >= 292.5 && degree < 337.5) return '西北';
    return 'N/A';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">即時天氣</h2>
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <p><strong>氣溫:</strong> {TEMP ? `${TEMP}°C` : 'N/A'}</p>
        <p><strong>相對濕度:</strong> {HUMD ? `${(HUMD * 100).toFixed(0)}%` : 'N/A'}</p>
        <p><strong>風向:</strong> {WDIR ? getWindDirection(WDIR) : 'N/A'}</p>
        <p><strong>風速:</strong> {WIND ? `${WIND} m/s` : 'N/A'}</p>
        <p><strong>累積雨量 (今日):</strong> {currentRainfall ? `${currentRainfall} mm` : 'N/A'}</p>
      </div>
    </div>
  );
};

export default CurrentWeather;
