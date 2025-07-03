import axios from "axios";

export function handleApiErorr(error: unknown, fallbackMessage = 'An unexpected error occured'): string{
    if (axios.isAxiosError(error)){
        return error.response?.data.detail || error.message || fallbackMessage
    }

    if(error instanceof Error){
        return error.message
    }

    return fallbackMessage
}