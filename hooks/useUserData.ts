'use client'

import { useState, useEffect } from 'react'
import { UserData, UseUserDataReturn } from '@/lib/types/core'
import { mockUserData, mockEncryptedData } from '@/lib/utils/userData.local'

export default function useUserData(): UseUserDataReturn {
    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function initializeUserSession(): Promise<void> {
            try {
                // Verificar se já existe dados salvos no localStorage
                const savedUserData = localStorage.getItem('userData')
                if (savedUserData) {
                    const parsedData = JSON.parse(savedUserData)
                    setUserData(parsedData)
                    setLoading(false)
                    return
                }

                // Se não tem dados salvos, iniciar fluxo de autenticação
                if (process.env.NEXT_PUBLIC_NODE_ENV === 'dev') {
                    // Versão mock para desenvolvimento
                    await handleMockAuthentication()
                } else {
                    // Versão real para produção
                    await handleRealAuthentication()
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
                setUserData(null)
            } finally {
                setLoading(false)
            }
        }

        initializeUserSession()
    }, [])

    const handleMockAuthentication = async (): Promise<void> => {
        // Interceptar mensagens para simular GHL
        const messageHandler = (event: MessageEvent) => {
            if (event.data.message === 'REQUEST_USER_DATA') {
                window.postMessage({
                    message: 'REQUEST_USER_DATA_RESPONSE',
                    payload: mockEncryptedData
                }, '*')
            }
        }
        window.addEventListener('message', messageHandler)

        // Solicitar dados do GHL (será interceptado)
        window.parent.postMessage({ message: 'REQUEST_USER_DATA' }, '*')

        // Aguardar resposta
        const encryptedUserData = await new Promise<string>((resolve) => {
            const responseHandler = ({ data }: MessageEvent) => {
                if (data.message === 'REQUEST_USER_DATA_RESPONSE') {
                    resolve(data.payload)
                }
            }
            window.addEventListener('message', responseHandler, { once: true })
        })

        // Descriptografar (mock)
        const decryptedUserData = mockUserData

        // Salvar dados e finalizar
        await saveUserData(decryptedUserData)

        // Limpar event listeners
        window.removeEventListener('message', messageHandler)
    }

    const handleRealAuthentication = async (): Promise<void> => {
        // Solicitar dados do GHL
        window.parent.postMessage({ message: 'REQUEST_USER_DATA' }, '*')

        // Aguardar resposta
        const encryptedUserData = await new Promise<string>((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Timeout waiting for GHL response'))
            }, 10000)

            const messageHandler = ({ data }: MessageEvent) => {
                if (data.message === 'REQUEST_USER_DATA_RESPONSE') {
                    clearTimeout(timeout)
                    resolve(data.payload)
                }
            }
            window.addEventListener('message', messageHandler, { once: true })
        })

        // Descriptografar via API
        const response = await fetch('/api/decrypt-user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ encryptedData: encryptedUserData })
        })

        if (!response.ok) {
            throw new Error('Failed to decrypt user data')
        }

        const decryptedUserData: UserData = await response.json()

        // Salvar dados e finalizar
        await saveUserData(decryptedUserData)
    }

    const saveUserData = async (userData: UserData): Promise<void> => {
        // Salvar no localStorage para persistência
        localStorage.setItem('userData', JSON.stringify(userData))
        setUserData(userData)
    }

    return { userData, loading, error }
} 