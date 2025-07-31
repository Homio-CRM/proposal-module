export interface UserData {
    userId: string
    companyId: string
    role: string
    type: string
    activeLocation: string
    userName: string
    email: string
}

export interface UserDataContextType {
    userData: UserData | null
    loading: boolean
    error: string | null
}

export type UseUserDataReturn = UserDataContextType 