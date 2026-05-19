import { Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { state, dispatch } = useApp();

  return (
    <div className="px-[17%] py-3">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Calories for Today
          </h1>
          <p className="text-3xl font-bold text-emerald-600 mt-0.5">
            {state.dailyTotals.calories.toFixed(0)} <span className="text-base font-normal text-gray-400">kcal</span>
          </p>
        </div>

        <div className="h-10 w-10" />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center rounded-xl bg-orange-50 py-2">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">Calories</span>
          <span className="text-base font-bold text-orange-600">{state.dailyTotals.calories.toFixed(0)}</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-amber-50 py-2">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">Carbs</span>
          <span className="text-base font-bold text-amber-600">{state.dailyTotals.carbs.toFixed(0)}g</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-blue-50 py-2">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">Protein</span>
          <span className="text-base font-bold text-blue-600">{state.dailyTotals.protein.toFixed(0)}g</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-yellow-50 py-2">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">Fat</span>
          <span className="text-base font-bold text-yellow-600">{state.dailyTotals.fat.toFixed(0)}g</span>
        </div>
      </div>
    </div>
  );
}
