const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("Backend URL is not configured.");
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "ngrok-skip-browser-warning": "true",
      ...options.headers,
    },
  });
}