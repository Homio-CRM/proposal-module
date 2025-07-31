'use client'

import React from 'react'
import { AlertCircle, X } from 'lucide-react'

interface GlobalErrorProps {
    error: string | null
    onClose: () => void
}

export function GlobalError({ error, onClose }: GlobalErrorProps) {
    if (!error) return null

    return (
        <div className="fixed top-4 right-4 z-50 max-w-md">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
                <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-red-800">
                            Erro na operação
                        </p>
                        <p className="mt-1 text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-3 flex-shrink-0 text-red-400 hover:text-red-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
} 