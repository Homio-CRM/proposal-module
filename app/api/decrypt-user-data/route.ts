import { NextRequest, NextResponse } from 'next/server'
import { UserData } from '@/lib/types/core'
import { mockUserData } from '@/lib/utils/userData.local'

interface RequestBody {
    encryptedData: string
}

function decryptUserData(encryptedUserData: string, sharedSecretKey: string): UserData {
    try {
        // Em produção, usar CryptoJS para descriptografar
        // const decrypted = CryptoJS.AES.decrypt(encryptedUserData, sharedSecretKey).toString(CryptoJS.enc.Utf8)
        // return JSON.parse(decrypted)

        // Por enquanto, retornar dados mock
        return mockUserData
    } catch {
        throw new Error('Failed to decrypt user data')
    }
}

export async function POST(request: NextRequest): Promise<NextResponse<UserData | { error: string }>> {
    try {
        const { encryptedData }: RequestBody = await request.json()

        if (process.env.NEXT_PUBLIC_NODE_ENV === 'dev') {
            return NextResponse.json(mockUserData)
        }

        const userData = decryptUserData(encryptedData, process.env.GHL_APP_SHARED_SECRET || 'mock-secret')
        return NextResponse.json(userData)
    } catch {
        return NextResponse.json({ error: 'Failed to decrypt user data' }, { status: 400 })
    }
} 