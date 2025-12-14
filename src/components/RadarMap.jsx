import React, { useState, useEffect } from 'react';
import { getRadarImageUrl } from '../api';

const RadarMap = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRadarImage = () => {
    setLoading(true);
    setError(null);
    try {
      const url = getRadarImageUrl();
      setImageUrl(url);
    } catch (err) {
      setError('載入雷達影像失敗');
      console.error('Error fetching radar image:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadarImage(); // Fetch immediately on mount

    const intervalId = setInterval(fetchRadarImage, 5 * 60 * 1000); // Refresh every 5 minutes (300000 ms)

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">衛星雷達回波圖</h2>
      {loading && <div className="text-center py-4">載入雷達影像中...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}
      {imageUrl && !loading && (
        <img
          src={imageUrl}
          alt="衛星雷達回波圖"
          className="w-full h-auto rounded-md"
          onError={(e) => {
            e.target.onerror = null;
            setImageUrl('/placeholder-radar.png'); // Fallback to a placeholder
            setError('雷達影像載入失敗，已切換至預設圖。');
          }}
        />
      )}
      {!imageUrl && !loading && !error && <div className="text-center py-4">無雷達影像資料</div>}
      <p className="text-sm text-gray-500 mt-2 text-right">資料來源: 中央氣象署</p>
    </div>
  );
};

export default RadarMap;
