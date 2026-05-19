import { Flame, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DayView() {
  const { state, deleteLogItem } = useApp();

  const formatDate = (dateKey) => {
    const date = new Date(dateKey + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  if (state.dailyLog.length === 0) {
    return (
      <div className="px-[17%] flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
          <Flame size={28} className="text-gray-300" />
        </div>
        <p className="text-base font-medium text-gray-400">No entries detected</p>
        <p className="mt-1 text-sm text-gray-300">No food logged on this day</p>
      </div>
    );
  }

  return (
    <div className="px-[17%] space-y-3">
      <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wide">
        {formatDate(state.selectedDate)}
      </h2>

      {state.dailyLog.map((item) => (
        <div key={item.id} className="flex items-center overflow-hidden rounded-xl bg-white shadow-sm">
          <button
            onClick={() => deleteLogItem(item.id, state.selectedDate)}
            className="flex h-14 w-12 shrink-0 items-center justify-center bg-red-500 text-white transition hover:bg-red-600"
          >
            <X size={18} />
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
          <div className="pr-4 text-right">
            <p className="text-sm text-gray-500">{item.serving?.toFixed(0)}g</p>
          </div>
        </div>
      ))}
    </div>
  );
}
