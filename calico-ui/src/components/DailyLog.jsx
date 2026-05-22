import { useApp } from '../context/AppContext';
import { Flame, Wheat, Beef, Droplets, X, Trash2 } from 'lucide-react';

export default function DailyLog() {
  const { state, dispatch, deleteLogItem, clearDay } = useApp();

  if (!state.drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={() => dispatch({ type: 'CLOSE_DRAWER' })} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Daily Log</h2>
            <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2">
            {state.dailyLog.length > 0 && (
              <button
                onClick={() => { clearDay(); }}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                title="Clear all"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              onClick={() => dispatch({ type: 'CLOSE_DRAWER' })}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 border-b border-gray-100 bg-gray-50 p-4">
          <div className="flex flex-col items-center rounded-xl bg-orange-50 p-2">
            <Flame size={16} className="text-orange-500" />
            <span className="mt-1 text-sm font-bold text-orange-600">{state.dailyTotals.calories.toFixed(0)}</span>
            <span className="text-[10px] text-orange-400">kcal</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-amber-50 p-2">
            <Wheat size={16} className="text-amber-500" />
            <span className="mt-1 text-sm font-bold text-amber-600">{state.dailyTotals.carbs.toFixed(1)}g</span>
            <span className="text-[10px] text-amber-400">carbs</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-blue-50 p-2">
            <Beef size={16} className="text-blue-500" />
            <span className="mt-1 text-sm font-bold text-blue-600">{state.dailyTotals.protein.toFixed(1)}g</span>
            <span className="text-[10px] text-blue-400">protein</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-yellow-50 p-2">
            <Droplets size={16} className="text-yellow-500" />
            <span className="mt-1 text-sm font-bold text-yellow-600">{state.dailyTotals.fat.toFixed(1)}g</span>
            <span className="text-[10px] text-yellow-400">fat</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {state.dailyLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Flame size={24} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">No food logged today</p>
              <p className="text-xs text-gray-300">Start by describing your meal in chat</p>
            </div>
          ) : (
            <div className="space-y-3">
              {state.dailyLog.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold capitalize text-gray-700">{item.name}</h4>
                    <div className="mt-1 flex gap-3 text-xs text-gray-400">
                      <span>{item.calories?.toFixed(0)} kcal</span>
                      <span>C: {item.carbs?.toFixed(1)}g</span>
                      <span>P: {item.protein?.toFixed(1)}g</span>
                      <span>F: {item.fat?.toFixed(1)}g</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-gray-300">
                      {item.servings} serving{item.servings !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteLogItem(item.id)}
                    className="rounded-lg p-1.5 text-gray-300 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
