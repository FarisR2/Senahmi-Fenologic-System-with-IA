import { useState } from "react";
import axios from "axios"

export const usePost = (url: string) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)

    const post = async (body: any) => {
        setError(null);
        setShowSuccess(false);
        try {
            setLoading(true)
            const response = await axios.post(url, body);
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