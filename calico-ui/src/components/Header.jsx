import { Menu, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { state, dispatch } = useApp();

  return (
    <div className="mx-auto max-w-2xl px-4 pt-3">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Menu size={24} />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-xs font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">
            Total Calories for Today
          </h1>
          <p className="text-3xl font-bold text-emerald-600 mt-0.5 dark:text-emerald-400">
            {state.dailyTotals.calories.toFixed(0)} <span className="text-base font-normal text-gray-400 dark:text-gray-500">kcal</span>
          </p>
        </div>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {state.darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center rounded-xl bg-orange-50 py-2 dark:bg-orange-950/40">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide dark:text-gray-500">Calories</span>
          <span className="text-base font-bold text-orange-600 dark:text-orange-400">{state.dailyTotals.calories.toFixed(0)}</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-amber-50 py-2 dark:bg-amber-950/40">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide dark:text-gray-500">Carbs</span>
          <span className="text-base font-bold text-amber-600 dark:text-amber-400">{state.dailyTotals.carbs.toFixed(0)}g</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-blue-50 py-2 dark:bg-blue-950/40">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide dark:text-gray-500">Protein</span>
          <span className="text-base font-bold text-blue-600 dark:text-blue-400">{state.dailyTotals.protein.toFixed(0)}g</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-yellow-50 py-2 dark:bg-yellow-950/40">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide dark:text-gray-500">Fat</span>
          <span className="text-base font-bold text-yellow-600 dark:text-yellow-400">{state.dailyTotals.fat.toFixed(0)}g</span>
        </div>
      </div>
    </div>
  );
}
