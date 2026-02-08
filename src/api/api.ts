import axios from "axios";

// 🔧 Change this to your backend URL
// Local: http://localhost:5000
// Production: https://focusdesk-backend.onrender.com
const API = axios.create({
  baseURL: "https://focusdesk-backend.onrender.com",
});

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
