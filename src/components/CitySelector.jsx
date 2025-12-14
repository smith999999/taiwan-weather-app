import React from 'react';
import { TAIWAN_COUNTIES } from '../api';

const CitySelector = ({ selectedCity, onSelectCity }) => {
  return (
    <div className="mb-4">
      <label htmlFor="city-select" className="block text-gray-700 text-sm font-bold mb-2">
        選擇縣市:
      </label>
      <select
        id="city-select"
        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        value={selectedCity}
        onChange={(e) => onSelectCity(e.target.value)}
      >
        {TAIWAN_COUNTIES.map((county) => (
          <option key={county.name} value={county.name}>
            {county.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CitySelector;
