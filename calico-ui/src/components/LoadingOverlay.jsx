import { Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LoadingOverlay() {
  const { state } = useApp();

  if (!state.isLoading) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center rounded-2xl bg-white px-8 py-6 shadow-2xl dark:bg-gray-800">
        <div className="relative">
          <Loader2 size={48} className="animate-spin text-emerald-500" />
        </div>
        <p className="mt-4 text-base font-semibold text-gray-700 dark:text-gray-200">Analyzing your meal...</p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">This may take a few seconds</p>
      </div>
    </div>
  );
}
