const BASE_URL = '/api';
const API_KEY = import.meta.env.VITE_API_KEY;

export async function healthCheck() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function sendChat(message, imageFile = null) {
  const formData = new FormData();
  formData.append('message', message);

  if (imageFile) {
    formData.append('file', imageFile);
  }

  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}
