import { useState, useEffect } from "react";
import axios from "axios";
import { API_CONFIG } from "../config/api.config";

// Hook para GET automático (se ejecuta al montar el componente)
export const useGet = <T = any,>(url: string, autoFetch: boolean = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;

    const fetchData = async () => {
        setError(null);
        try {
            setLoading(true);
            const response = await axios.get(fullUrl);
            setData(response.data);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Error al obtener datos';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [fullUrl, autoFetch]);

    // Función para refetch manual
    const refetch = () => fetchData();

    return { data, loading, error, refetch };
};

// Hook alternativo para GET manual (solo cuando lo llamas)
export const useGetLazy = <T = any,>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;

    const get = async () => {
        setError(null);
        try {
            setLoading(true);
            const response = await axios.get(fullUrl);
            setData(response.data);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Error al obtener datos';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, get };
};
