import { useApp } from '../context/AppContext';
import FoodCard from './FoodCard';
import { CheckCircle } from 'lucide-react';

export default function FoodCards() {
  const { state, updateServings, logFood } = useApp();

  if (state.pendingFoodItems.length === 0) return null;

  return (
    <div className="border-t border-gray-100 bg-gray-50 px-4 pb-4 pt-2">
      <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Detected Food Items
      </h3>

      <div className="space-y-3">
        {state.pendingFoodItems.map((item, idx) => (
          <FoodCard
            key={idx}
            item={item}
            index={idx}
            servings={item.servings}
            onServingsChange={updateServings}
          />
        ))}
      </div>

      <button
        onClick={logFood}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 active:scale-[0.98]"
      >
        <CheckCircle size={18} />
        Log Food ({state.pendingFoodItems.length} item{state.pendingFoodItems.length !== 1 ? 's' : ''})
      </button>
    </div>
  );
}
