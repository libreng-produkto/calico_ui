import { Flame, X, Coffee, Sun, Sunset, Cookie } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getMealCategory } from '../db/userSettings';

const MEAL_CONFIG = {
  breakfast: { label: 'Breakfast', icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  lunch: { label: 'Lunch', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  dinner: { label: 'Dinner', icon: Sunset, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
  snacks: { label: 'Snacks', icon: Cookie, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30' },
};

const MEAL_ORDER = ['breakfast', 'snacks', 'lunch', 'dinner'];

export default function DayView() {
  const { state, deleteLogItem } = useApp();

  const formatDate = (dateKey) => {
    const date = new Date(dateKey + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  if (state.dailyLog.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
          <Flame size={28} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-base font-medium text-gray-400 dark:text-gray-500">No entries yet</p>
        <p className="mt-1 text-sm text-gray-300 dark:text-gray-600">No food logged on this day</p>
      </div>
    );
  }

  const grouped = {};
  for (const item of state.dailyLog) {
    const category = item.loggedAt ? getMealCategory(item.loggedAt) : 'snacks';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(item);
  }

  const orderedGroups = MEAL_ORDER.filter((key) => grouped[key]?.length > 0);

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400">
        {formatDate(state.selectedDate)}
      </h2>

      {orderedGroups.map((mealKey) => {
        const config = MEAL_CONFIG[mealKey];
        const Icon = config.icon;
        const items = grouped[mealKey];
        const subtotal = items.reduce((sum, i) => sum + (i.calories || 0), 0);

        return (
          <div key={mealKey}>
            <div className={`flex items-center justify-between rounded-xl px-4 py-2.5 mb-2 ${config.bg}`}>
              <div className="flex items-center gap-2">
                <Icon size={16} className={config.color} />
                <span className={`text-sm font-bold uppercase tracking-wide ${config.color}`}>{config.label}</span>
              </div>
              <span className={`text-sm font-bold ${config.color}`}>{subtotal.toFixed(0)} kcal</span>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
                  <button
                    onClick={() => deleteLogItem(item.id, state.selectedDate)}
                    className="flex h-14 w-12 shrink-0 items-center justify-center bg-red-500 text-white transition hover:bg-red-600"
                  >
                    <X size={18} />
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
                  <div className="pr-4 text-right shrink-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.serving?.toFixed(0)}g</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
