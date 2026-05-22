import { useState } from 'react';
import { Camera, ImagePlus, Loader2, X, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HomeView() {
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { sendMessage, state, updateServings, logFood, removePendingItem } = useApp();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      sendMessage('Identify food in this image', file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message.trim());
    setMessage('');
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const hasResults = state.pendingFoodItems.length > 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {imagePreview && (
          <div className="mx-4 mt-4 flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
            <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">{imageFile?.name}</p>
              <p className="text-xs text-gray-400">Analyzing...</p>
            </div>
            <button onClick={removeImage} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
        )}

        {hasResults ? (
          <div className="mx-4 mt-4 space-y-3">
            {state.pendingFoodItems.map((item, idx) => (
              <FoodRow
                key={idx}
                item={item}
                index={idx}
                servings={item.servings}
                onRemove={() => removePendingItem(idx)}
                onServingsChange={(val) => updateServings(idx, val)}
              />
            ))}
            <button
              onClick={logFood}
              className="mt-4 w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 active:scale-[0.98]"
            >
              SAVE LOGS
            </button>
          </div>
        ) : (
          <div className="mx-4 mt-6 flex flex-col gap-3">
            <button
              onClick={() => document.getElementById('camera-input')?.click()}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-100 py-4 text-sm font-medium text-emerald-700 transition hover:bg-emerald-200"
            >
              <Camera size={20} />
              Take Photo
            </button>
            <input id="camera-input" type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-100 py-4 text-sm font-medium text-emerald-700 transition hover:bg-emerald-200">
              <ImagePlus size={20} />
              Upload from Gallery
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        )}

        {state.isLoading && !hasResults && (
          <div className="mx-4 mt-4 flex items-center justify-center gap-2 rounded-xl bg-white py-4 shadow-sm">
            <Loader2 size={20} className="animate-spin text-emerald-500" />
            <span className="text-sm text-gray-500">Analyzing your meal...</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your meal..."
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="submit"
            disabled={state.isLoading || !message.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state.isLoading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
}

function FoodRow({ item, servings, onRemove, onServingsChange }) {
  return (
    <div className="flex items-center overflow-hidden rounded-xl bg-white shadow-sm">
      <button
        onClick={onRemove}
        className="flex h-14 w-12 shrink-0 items-center justify-center bg-red-500 text-white transition hover:bg-red-600"
      >
        <X size={18} />
      </button>
      <div className="flex flex-1 items-center justify-between px-4 py-3">
        <span className="text-sm font-medium capitalize text-gray-700">{item.name}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onServingsChange(Math.max(0.5, servings - 0.5))}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition hover:bg-gray-200"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-gray-700">{servings}</span>
          <button
            onClick={() => onServingsChange(servings + 0.5)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition hover:bg-gray-200"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
