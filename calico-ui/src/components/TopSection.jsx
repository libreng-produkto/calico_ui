import { useState } from 'react';
import { Camera, ImagePlus, Loader2, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TopSection() {
  const [message, setMessage] = useState('');
  const { sendMessage, state } = useApp();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      sendMessage('Identify food in this image', file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message.trim());
    setMessage('');
  };

  return (
    <div className="px-[17%] space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your meal..."
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
        <button
          type="submit"
          disabled={state.isLoading || !message.trim()}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.isLoading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
        </button>
      </form>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => document.getElementById('camera-input')?.click()}
          disabled={state.isLoading}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-100 py-4 text-base font-medium text-emerald-700 transition hover:bg-emerald-200 disabled:opacity-50"
        >
          {state.isLoading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
          Take Photo
        </button>
        <input
          id="camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
        />

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-100 py-4 text-base font-medium text-emerald-700 transition hover:bg-emerald-200">
          {state.isLoading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
          Gallery
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>
    </div>
  );
}
