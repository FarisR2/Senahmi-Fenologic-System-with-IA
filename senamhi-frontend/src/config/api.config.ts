export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
    ENDPOINTS: {
        STATION: '/station',
        CULTIVE: '/cultive',
        FENOLOGIC: '/fenologic',
        ANALYTIC: '/analytic',
        TEMPERATURE: '/temperature-data',
    }
} as const;
