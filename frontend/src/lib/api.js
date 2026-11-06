
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("Backend URL is not configured. Check VITE_API_BASE_URL.");
  }

  const token = sessionStorage.getItem("token");

  const headers = {
    "ngrok-skip-browser-warning": "true",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
}
