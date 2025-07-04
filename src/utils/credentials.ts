import { Credentials } from "@/types/User";

export function credentialsToUrlSearchParams(credentials: Credentials): URLSearchParams{
    const formData = new URLSearchParams()
    
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    return formData
}