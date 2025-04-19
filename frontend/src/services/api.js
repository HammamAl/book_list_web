import axios from "axios";

const api = axios.create({
  baseURL: "https://book-api-854460623550.asia-southeast2.run.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error);

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);

      // Tambahan: Tampilkan pesan error yang lebih spesifik
      if (error.response.status === 404) {
        console.error("Resource not found. Please check the ID or endpoint.");
      } else if (error.response.status === 400) {
        console.error("Bad request. Please check your input data.");
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    return Promise.reject(error);
  }
);
export default api;
