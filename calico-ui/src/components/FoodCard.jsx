import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FoodCard({ item, index }) {
  const { updateServing, removePendingItem } = useApp();

  const handleServingChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    updateServing(index, Math.max(0, val));
  };

  return (
    <div className="flex items-center overflow-hidden rounded-xl bg-white shadow-sm">
      <button
        onClick={() => removePendingItem(index)}
        className="flex h-16 w-14 shrink-0 items-center justify-center bg-red-500 text-white transition hover:bg-red-600"
      >
        <X size={20} />
      </button>

      <div className="flex flex-1 flex-col justify-center px-4 py-3">
        <span className="text-base font-semibold capitalize text-gray-800">{item.name}</span>
        <div className="mt-1 flex gap-3 text-sm text-gray-400">
          <span className="text-orange-500 font-medium">{item.calories?.toFixed(0)} kcal</span>
          <span>C: {item.carbs?.toFixed(1)}g</span>
          <span>P: {item.protein?.toFixed(1)}g</span>
          <span>F: {item.fat?.toFixed(1)}g</span>
        </div>
      </div>

      <div className="flex flex-col items-center pr-4">
        <input
          type="number"
          min="0"
          step="1"
          value={item.serving}
          onChange={handleServingChange}
          className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-center text-base font-bold text-gray-700 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
        <span className="text-xs text-gray-400">grams</span>
      </div>
    </div>
  );
}
