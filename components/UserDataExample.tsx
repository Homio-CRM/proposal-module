'use client'

import React from 'react'
import { useUserDataContext } from '@/lib/contexts/UserDataContext'

export function UserDataExample() {
    const { userData, loading, error } = useUserDataContext()

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-muted-foreground">Carregando dados do usuário...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-destructive font-medium">Erro ao carregar dados do usuário</div>
                    <div className="text-sm text-muted-foreground mt-2">{error}</div>
                </div>
            </div>
        )
    }

    if (!userData?.activeLocation) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-muted-foreground">Nenhuma agência ativa selecionada</div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Dados do Usuário</h3>
            <div className="space-y-2">
                <div><strong>Nome:</strong> {userData.userName}</div>
                <div><strong>Email:</strong> {userData.email}</div>
                <div><strong>Função:</strong> {userData.role}</div>
                <div><strong>Tipo:</strong> {userData.type}</div>
                <div><strong>Agência Ativa (currentLocation):</strong> {userData.activeLocation}</div>
                <div><strong>ID da Empresa:</strong> {userData.companyId}</div>
                <div><strong>ID do Usuário:</strong> {userData.userId}</div>
            </div>
        </div>
    )
} 