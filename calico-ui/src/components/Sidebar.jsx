import { X, Settings, History } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTodayKey } from '../db/foodDb';

export default function Sidebar() {
  const { state, dispatch, loadDailyLog } = useApp();

  const handleDayClick = (dateKey) => {
    loadDailyLog(dateKey);
    dispatch({ type: 'CLOSE_SIDEBAR' });
  };

  const formatDate = (dateKey) => {
    const date = new Date(dateKey + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatShortDate = (dateKey) => {
    const date = new Date(dateKey + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {state.sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })} />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-stone-700 text-white transition-transform duration-300 ${
          state.sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-600 p-4">
          <div className="flex items-center gap-2">
            <History size={18} />
            <span className="text-lg font-bold">History</span>
          </div>
          <button
            onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
            className="rounded-lg p-1 text-stone-300 hover:bg-stone-600 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <button
            onClick={() => handleDayClick(getTodayKey())}
            className={`w-full rounded-lg px-4 py-3 text-left transition ${
              state.selectedDate === getTodayKey() ? 'bg-stone-600 text-white' : 'text-stone-300 hover:bg-stone-600'
            }`}
          >
            <div className="font-semibold">Today</div>
            <div className="text-xs text-stone-400">{formatShortDate(getTodayKey())}</div>
          </button>

          {state.availableDates.filter(d => d !== getTodayKey()).map((dateKey) => (
            <button
              key={dateKey}
              onClick={() => handleDayClick(dateKey)}
              className={`w-full rounded-lg px-4 py-3 text-left transition ${
                state.selectedDate === dateKey ? 'bg-stone-600 text-white' : 'text-stone-300 hover:bg-stone-600'
              }`}
            >
              <div className="font-semibold">{formatDate(dateKey)}</div>
              <div className="text-xs text-stone-400">{formatShortDate(dateKey)}</div>
            </button>
          ))}

          {state.availableDates.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-stone-400">No history yet</p>
          )}
        </nav>

        <div className="border-t border-stone-600 p-3">
          <button
            onClick={() => {
              dispatch({ type: 'CLOSE_SIDEBAR' });
              dispatch({ type: 'TOGGLE_SETTINGS' });
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-stone-300 transition hover:bg-stone-600 hover:text-white"
          >
            <Settings size={18} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}
