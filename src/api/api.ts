import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
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
