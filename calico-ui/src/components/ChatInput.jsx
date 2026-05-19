import { useState } from 'react';
import { Send, ImagePlus, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { sendMessage, state } = useApp();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;
    sendMessage(message.trim() || 'Identify food in this image', imageFile);
    setMessage('');
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
            <button
              onClick={removeImage}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
          <span className="text-sm text-gray-500">{imageFile?.name}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200">
          <ImagePlus size={20} />
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>

        <div className="flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your meal or upload a photo..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <button
          type="submit"
          disabled={state.isLoading || (!message.trim() && !imageFile)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}
