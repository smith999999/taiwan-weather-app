const CWA_API_KEY = 'CWA-D956DF28-CC0F-4C3E-97C8-78CD92D44A84'; // 請替換成您自己的中央氣象署 API Key
const CWA_BASE_URL = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore';

const fetchCwaData = async (endpoint, params = {}) => {
  if (!CWA_API_KEY || CWA_API_KEY === 'YOUR_CWA_API_KEY') {
    console.error('請設定您的中央氣象署 API Key。');
    alert('請在 src/api.js 中設定您的中央氣象署 API Key。');
    return null;
  }

  const queryParams = new URLSearchParams({
    Authorization: CWA_API_KEY,
    ...params,
  }).toString();

  const url = `${CWA_BASE_URL}/${endpoint}?${queryParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success !== 'true') {
        console.error('API 請求失敗:', data);
        return null;
    }
    return data.records;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return null;
  }
};

export const getForecast = async (locationName) => {
  const params = {
    locationName: locationName,
    elementName: 'MinT,MaxT,PoP6h,PoP12h,Wx,CI,WS,WD,RH', // 最小溫度, 最大溫度, 6小時降雨機率, 12小時降雨機率, 天氣現象, 舒適度, 風速, 風向, 相對濕度
    timeFrom: new Date().toISOString().slice(0, 19), // 從現在開始
  };
  return fetchCwaData('F-C0032-001', params);
};

export const getCurrentWeather = async (stationId) => {
    const params = {
        stationId: stationId,
        elementName: 'TEMP,HUMD,WDIR,WIND,RAIN', // 溫度, 濕度, 風向, 風速, 雨量
    };
    return fetchCwaData('O-A0003-001', params);
};

export const getRainfall = async (stationId) => {
    const params = {
        stationId: stationId,
        elementName: 'RAIN',
    };
    return fetchCwaData('O-A0001-001', params);
}

// 衛星雷達圖是靜態 URL，但可以每隔一段時間重新載入
export const getRadarImageUrl = () => {
  // 中央氣象署雷達回波圖，通常為動態更新，可以加上時間戳記避免快取
  return `https://www.cwa.gov.tw/Data/radar/CV1_3600.png?_t=${new Date().getTime()}`;
};

// 台灣主要縣市及其對應的觀測站ID (簡化版，實際應查詢更完整的對應表)
// 這裡提供一些常見的縣市及其代表性測站ID，您可以根據需求擴充
// 請注意，O-A0003-001 和 O-A0001-001 的測站ID可能不同或需要額外篩選
export const TAIWAN_COUNTIES = [
    { name: '臺北市', stationId: '466920' }, // 臺北
    { name: '新北市', stationId: '466880' }, // 板橋
    { name: '桃園市', stationId: '467050' }, // 桃園
    { name: '臺中市', stationId: '467490' }, // 臺中
    { name: '臺南市', stationId: '467410' }, // 臺南
    { name: '高雄市', stationId: '467440' }, // 高雄
    { name: '基隆市', stationId: '466940' }, // 基隆
    { name: '新竹縣', stationId: 'C0H710' }, // 新竹 (非正式測站代號，需查O-A0003-001)
    { name: '新竹市', stationId: '467571' }, // 新竹 (O-A0003-001)
    { name: '苗栗縣', stationId: 'C0E760' }, // 苗栗 (非正式測站代號，需查O-A0003-001)
    { name: '彰化縣', stationId: 'C0G660' }, // 彰化 (非正式測站代號，需查O-A0003-001)
    { name: '南投縣', stationId: 'C0F930' }, // 南投 (非正式測站代號，需查O-A0003-001)
    { name: '雲林縣', stationId: 'C0M690' }, // 雲林 (非正式測站代號，需查O-A0003-001)
    { name: '嘉義縣', stationId: 'C0N110' }, // 嘉義 (非正式測站代號，需查O-A0003-001)
    { name: '嘉義市', stationId: '467530' }, // 嘉義 (O-A0003-001)
    { name: '屏東縣', stationId: '467590' }, // 屏東
    { name: '宜蘭縣', stationId: '467080' }, // 宜蘭
    { name: '花蓮縣', stationId: '466990' }, // 花蓮
    { name: '臺東縣', stationId: '467660' }, // 臺東
    { name: '澎湖縣', stationId: '467110' }, // 澎湖
    { name: '金門縣', stationId: '467990' }, // 金門
    { name: '連江縣', stationId: '467940' }, // 馬祖
];

// 為了更精確地獲取觀測站資料，我們可能需要一個更詳細的縣市-測站對應表
// 或者從 F-C0032-001 的 'location' 欄位中提取 'locationName' 作為查詢參數
// 並從 'station' API 中查詢對應的 'stationId'
// 這裡暫時使用簡化的縣市列表和部分代表性測站ID
// 注意：O-A0003-001 和 O-A0001-001 的測站列表可能不同，需要分別處理或找到共通測站。
// 為了這個範例，我會嘗試使用 F-C0032-001 中 locationName 的值來查詢。
// 對於 O-A0003-001 (觀測資料)，實際情況可能需要根據所選縣市找出最接近的觀測站 ID。
// 這裡的 stationId 主要是針對 O-A0003-001，對於 O-A0001-001 (雨量) 可能需要另外的 ID。
// 我會先讓 App.jsx 取得 F-C0032-001 的縣市列表，然後嘗試用這些縣市名稱去查觀測資料。
// 如果找不到，就用預設的 stationId。

// 輔助函數：從 F-C0032-001 取得所有預報縣市列表
export const getForecastLocations = async () => {
    const records = await fetchCwaData('F-C0032-001', {
        elementName: 'MinT,MaxT,PoP6h,Wx',
        timeFrom: new Date().toISOString().slice(0, 19),
    });
    if (records && records.location) {
        return records.location.map(loc => ({ name: loc.locationName, stationId: null })); // 這裡先不填 stationId
    }
    return [];
};

// 針對觀測資料，我們需要動態尋找最接近的測站
// 這裡只是一個簡化，實際應用中會需要一個更完善的測站匹配邏輯
export const getObservedStationId = async (countyName) => {
    const params = {
        elementName: 'TEMP', // 只查詢溫度，獲取測站列表
        sort: 'time',
    };
    const records = await fetchCwaData('O-A0003-001', params);
    if (records && records.location) {
        // 嘗試找到名稱包含縣市名稱的測站
        const station = records.location.find(loc => loc.locationName.includes(countyName));
        if (station) {
            return station.stationId;
        }
        // 如果找不到精確匹配，則返回第一個測站或 null
        return records.location[0]?.stationId || null;
    }
    return null;
};
