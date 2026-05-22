import { useApp } from '../context/AppContext';
import FoodCard from './FoodCard';

export default function FoodList() {
  const { state, logFood } = useApp();

  if (state.pendingFoodItems.length === 0 && !state.isLoading) return null;

  return (
    <div className="space-y-3">
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
