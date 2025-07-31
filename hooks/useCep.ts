import { useState } from 'react'

interface ViaCepResponse {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    estado: string
    regiao: string
    ibge: string
    gia: string
    ddd: string
    siafi: string
}

export function useCep() {
    const [isLoading, setIsLoading] = useState(false)

    const searchCep = async (cep: string): Promise<ViaCepResponse | null> => {
        if (!cep || cep.length < 8) return null

        setIsLoading(true)
        try {
            // Remove caracteres não numéricos
            const cleanCep = cep.replace(/\D/g, '')

            if (cleanCep.length !== 8) {
                throw new Error('CEP inválido')
            }

            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
            const data = await response.json()

            if (data.erro) {
                throw new Error('CEP não encontrado')
            }

            return data
        } catch (error) {
            console.error('Erro ao buscar CEP:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return {
        searchCep,
        isLoading
    }
} 