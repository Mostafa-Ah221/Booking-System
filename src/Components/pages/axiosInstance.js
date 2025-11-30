import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://backend-booking.appointroll.com/api",
   timeout: 0, 
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

const publicPaths = [
  "/login",
  "/signup",
  "/forget-password",
  "/reset-password",
  "/verify",
  "/",
  "/pricing",
  "/webinars",
  "/features",
  "/contact-us",
  "/termsOf-service",
  "/privacy-policy",
  "/security",
  "/industries",
  "/abuse-policy",
];

// ✅ Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

let isRedirecting = false;

// ✅ Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname.toLowerCase();
      const isPublic = publicPaths.some((path) =>
        currentPath.startsWith(path.toLowerCase())
      );

      if (!isPublic && !isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem("access_token");
        localStorage.removeItem("userType");
        localStorage.removeItem("user");

        window.location.href = "/login";

        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
