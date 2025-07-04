export interface Credentials {
    username: string
    password: string 
}

export interface UserDb {
    id: number
    created_at: string
    password_hash: string
    username: string
}

export interface TokenData {
    access_token: string 
    token_type: "bearer"
}