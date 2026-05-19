import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { User, Bot } from 'lucide-react';

export default function ChatMessages() {
  const { state } = useApp();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatMessages, state.pendingFoodItems, state.isLoading]);

  if (state.chatMessages.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <Bot size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Calico Calorie Counter</h2>
          <p className="mt-1 text-sm text-gray-400">Describe your meal or upload a photo to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {state.chatMessages.map((msg, idx) => (
        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`flex max-w-[85%] items-start gap-2 rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-700 shadow-sm'
            }`}
          >
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                msg.role === 'user' ? 'bg-emerald-600' : 'bg-gray-100'
              }`}
            >
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className="flex-1">
              <p className="text-sm">{msg.content}</p>
              {msg.image && (
                <img src={msg.image} alt="Uploaded" className="mt-2 h-32 rounded-lg object-cover" />
              )}
              <p className={`mt-1 text-[10px] ${msg.role === 'user' ? 'text-emerald-100' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      ))}

      {state.isLoading && (
        <div className="flex justify-start">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
              <Bot size={14} />
            </div>
            <div className="flex gap-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
