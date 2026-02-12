import axios from "axios";

// ============================================
// 🔴 BACKEND API URL CONFIGURATION
// ============================================
// Change this based on environment:
//
// FOR LOCALHOST TESTING (CURRENTLY ACTIVE):
// const API = axios.create({
//   baseURL: "http://localhost:5000",
// });
//
// FOR PRODUCTION DEPLOYMENT:
// Uncomment the line below and comment the localhost line above
const API = axios.create({
  baseURL: "https://focusdesk-backend.onrender.com",
});
//
// ⚠️ When deploying frontend:
// 1. Change baseURL to your deployed backend URL
// 2. Make sure backend is deployed first
// 3. Update CORS settings in backend to allow frontend domain
// ============================================

API.interceptors.request.use((req) => {
  try {
    const user = JSON.parse(localStorage.getItem("focusdesk_user") || "null");
    if (user?.token) {
      (req.headers as any).Authorization = `Bearer ${user.token}`;
    }
  } catch (err) {
    // ignore parsing errors
  }

  return req;
});

export default API;
