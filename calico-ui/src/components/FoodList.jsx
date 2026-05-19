import { Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FoodCard from './FoodCard';

export default function FoodList() {
  const { state, logFood } = useApp();

  if (state.pendingFoodItems.length === 0 && !state.isLoading) return null;

  return (
    <div className="px-[17%] space-y-3">
      {state.isLoading && (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-8 shadow-sm">
          <div className="relative">
            <Loader2 size={40} className="animate-spin text-emerald-500" />
          </div>
          <p className="mt-3 text-base font-medium text-gray-600">Analyzing your meal...</p>
          <p className="text-sm text-gray-400">This may take a few seconds</p>
        </div>
      )}

      {state.pendingFoodItems.map((item, idx) => (
        <FoodCard key={idx} item={item} index={idx} />
      ))}

      {state.pendingFoodItems.length > 0 && (
        <button
          onClick={logFood}
          className="mt-2 w-full rounded-xl bg-emerald-500 py-3.5 text-base font-bold uppercase tracking-wide text-white transition hover:bg-emerald-600 active:scale-[0.98]"
        >
          Save Logs
        </button>
      )}
    </div>
  );
}
