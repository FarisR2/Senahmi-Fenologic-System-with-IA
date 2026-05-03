import { useState } from "react";
import axios from "axios";
import { API_CONFIG } from "../config/api.config";

export const usePost = (url: string) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)

    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;

    const post = async (body: any) => {
        setError(null);
        setShowSuccess(false);
        try {
            setLoading(true)
            const response = await axios.post(fullUrl, body);
            setShowSuccess(true)

            return response.data;

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Error al enviar datos';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false)
        }
    };

    return { post, loading, error, showSuccess }
}
 