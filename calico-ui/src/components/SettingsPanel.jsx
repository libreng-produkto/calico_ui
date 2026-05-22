import { useState } from 'react';
import { X, Moon, Sun, Clock, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSettings } from '../db/userSettings';

const MEAL_LABELS = {
  breakfast: 'Breakfast',
  snacksMorning: 'Snacks (Morning)',
  lunch: 'Lunch',
  snacksAfternoon: 'Snacks (Afternoon)',
  dinner: 'Dinner',
  snacksNight: 'Snacks (Night)',
};

function formatHour(h) {
  const adjusted = h >= 24 ? h - 24 : h;
  const period = adjusted >= 12 ? 'PM' : 'AM';
  const hour12 = adjusted % 12 || 12;
  return `${hour12} ${period}`;
}

export default function SettingsPanel() {
  const { state, dispatch } = useApp();
  const [localSettings, setLocalSettings] = useState(() => getSettings());

  if (!state.settingsOpen) return null;

  const handleMealTimeChange = (mealKey, field, value) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    const updated = {
      ...localSettings,
      mealTimes: {
        ...localSettings.mealTimes,
        [mealKey]: {
          ...localSettings.mealTimes[mealKey],
          [field]: num,
        },
      },
    };
    setLocalSettings(updated);
    dispatch({ type: 'UPDATE_SETTINGS', payload: updated });
  };

  const handleReset = () => {
    const defaults = getSettings();
    defaults.mealTimes = {
      breakfast: { start: 6, end: 10 },
      snacksMorning: { start: 10, end: 12 },
      lunch: { start: 12, end: 14 },
      snacksAfternoon: { start: 14, end: 18 },
      dinner: { start: 18, end: 22 },
      snacksNight: { start: 22, end: 30 },
    };
    setLocalSettings(defaults);
    dispatch({ type: 'UPDATE_SETTINGS', payload: defaults });
  };

  const hours = Array.from({ length: 49 }, (_, i) => i);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => dispatch({ type: 'CLOSE_SETTINGS' })} />

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85vh] max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-gray-900 animate-slide-up">
        <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Settings</h2>
          <button
            onClick={() => dispatch({ type: 'CLOSE_SETTINGS' })}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-6" style={{ maxHeight: 'calc(85vh - 60px)' }}>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              {state.darkMode ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-amber-500" />}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Dark Mode</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Toggle dark theme</p>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className={`relative h-7 w-12 rounded-full transition-colors ${state.darkMode ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${state.darkMode ? 'translate-x-5' : ''}`}
              />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Meal Times</h3>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(localSettings.mealTimes).map(([key, range]) => (
                <div key={key} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{MEAL_LABELS[key]}</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={range.start}
                      onChange={(e) => handleMealTimeChange(key, 'start', e.target.value)}
                      className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 outline-none focus:border-emerald-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {hours.map((h) => (
                        <option key={h} value={h}>{formatHour(h)}</option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-400">to</span>
                    <select
                      value={range.end}
                      onChange={(e) => handleMealTimeChange(key, 'end', e.target.value)}
                      className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 outline-none focus:border-emerald-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {hours.map((h) => (
                        <option key={h} value={h}>{formatHour(h)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
