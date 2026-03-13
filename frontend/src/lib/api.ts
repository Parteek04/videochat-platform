import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://videochat-platform.onrender.com',
  withCredentials: true,
});

// Attach Firebase token to every request
api.interceptors.request.use(async (config) => {
  try {
    const { auth } = await import('@/lib/firebase');
    const token = await auth.currentUser?.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // No user logged in
  }
  return config;
});

export default api;
