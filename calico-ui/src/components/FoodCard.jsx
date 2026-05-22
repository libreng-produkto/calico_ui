import { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FoodCard({ item, index }) {
  const { updateServing, removePendingItem } = useApp();
  const [rawValue, setRawValue] = useState(String(item.serving ?? ''));

  const handleFocus = () => {
    if (rawValue === '0' || rawValue === '') {
      setRawValue('');
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '' || val === '.') {
      setRawValue(val);
      return;
    }
    if (!isNaN(parseFloat(val))) {
      setRawValue(val);
      const parsed = parseFloat(val);
      if (!isNaN(parsed) && parsed >= 0) {
        updateServing(index, parsed);
      }
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed <= 0) {
      setRawValue(String(item._baseServing || 100));
      updateServing(index, item._baseServing || 100);
    } else {
      setRawValue(String(parsed));
      updateServing(index, parsed);
    }
  };

  return (
    <div className="flex items-center overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
      <button
        onClick={() => removePendingItem(index)}
        className="flex h-16 w-14 shrink-0 items-center justify-center bg-red-500 text-white transition hover:bg-red-600"
      >
        <X size={20} />
      </button>

      <div className="flex flex-1 flex-col justify-center px-4 py-3 min-w-0">
        <span className="text-base font-semibold capitalize text-gray-800 dark:text-gray-100 truncate">{item.name}</span>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-gray-400 dark:text-gray-500">
          <span className="text-orange-500 font-medium dark:text-orange-400">{item.calories?.toFixed(0)} kcal</span>
          <span>C: {item.carbs?.toFixed(1)}g</span>
          <span>P: {item.protein?.toFixed(1)}g</span>
          <span>F: {item.fat?.toFixed(1)}g</span>
        </div>
      </div>

      <div className="flex flex-col items-center pr-4">
        <input
          type="text"
          inputMode="decimal"
          value={rawValue}
          placeholder={String(item._baseServing || 100)}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-center text-base font-bold text-gray-700 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/50"
        />
        <span className="text-xs text-gray-400 dark:text-gray-500">grams</span>
      </div>
    </div>
  );
}
