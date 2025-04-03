import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const accessToken = token?.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/Auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        if (!token?.refreshToken) {
          throw new Error("Brak tokenu odświeżającego");
        }

        const refreshResponse = await axios.post("/api/Auth/refresh", {
          refreshToken: token.refreshToken
        });

        const newData = refreshResponse.data;
        localStorage.setItem("token", JSON.stringify(newData));

        originalRequest.headers.Authorization = `Bearer ${newData.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("logout"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
