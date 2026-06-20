import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://api.appointroll.com/api",
    timeout: 0,
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

// ─── Request interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = token;
    return config;
});

let isRedirecting = false;

// ─── Response interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;

        // ── 429: retry تلقائي مرتين مع تأخير متزايد ──────────────────────────
        if (status === 429) {
            const retryCount = error.config.__retryCount || 0;

            if (retryCount < 2) {
                error.config.__retryCount = retryCount + 1;
                const waitMs = (retryCount + 1) * 2000; // 2s ثم 4s

                console.warn(`⚠️ 429 — retrying in ${waitMs}ms (attempt ${retryCount + 1}/2)`);

                await new Promise(r => setTimeout(r, waitMs));
                return axiosInstance(error.config);
            }

            // فشلت كل المحاولات
            console.error('❌ 429 — all retries exhausted.');
            return Promise.reject(error);
        }

        // ── 401: logout + redirect ────────────────────────────────────────────
        if (status === 401) {
            const currentPath = window.location.pathname.toLowerCase();
            const isPublic = publicPaths.some((p) => currentPath.startsWith(p.toLowerCase()));

            if (!isPublic && !isRedirecting) {
                isRedirecting = true;
                localStorage.removeItem("access_token");
                localStorage.removeItem("userType");
                localStorage.removeItem("user");

                window.location.href = "/login";

                setTimeout(() => { isRedirecting = false; }, 1000);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;