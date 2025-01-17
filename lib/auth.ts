// lib/auth.ts
import homio from "./axios";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

export async function getAccessToken(): Promise<TokenResponse> {
  try {
    const body = {
        clientId: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code:process.env.AUTHORIZATION_CODE,
        user_type:'Company'
    }
    const response = await homio.post<TokenResponse>(
      "/oauth/token",
      body,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao obter o token de autenticação:", error);
    throw new Error("Falha ao obter o token de autenticação.");
  }
}
