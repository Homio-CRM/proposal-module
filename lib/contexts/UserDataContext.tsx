'use client'

import React, { createContext, useContext } from 'react'
import { UserDataContextType } from '@/lib/types/core'
import useUserData from '@/hooks/useUserData'

const UserDataContext = createContext<UserDataContextType | undefined>(undefined)

interface ProviderProps {
    children: React.ReactNode
}

export function UserDataProvider({ children }: ProviderProps) {
    const { userData, loading, error } = useUserData()

    return (
        <UserDataContext.Provider value={{ userData, loading, error }}>
            {children}
        </UserDataContext.Provider>
    )
}

export function useUserDataContext(): UserDataContextType {
    const context = useContext(UserDataContext)
    if (context === undefined) {
        throw new Error('useUserDataContext must be used within a UserDataProvider')
    }
    return context
} 