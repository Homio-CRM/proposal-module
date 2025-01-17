// lib/auth.ts
import { redirect } from "next/dist/server/api-utils";
import homio from "./axios";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

export async function getAccessToken(): Promise<TokenResponse> {
  try {
    const body = {
        companyId: process.env.COMPANY_ID,
        locationId: process.env.LOCATION_ID
      }
      const response = await homio.post<TokenResponse>(
        "/oauth/locationToken",
        body,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Version: "2021-07-28",
            Authorization: "bearer " + process.env.AUTHORIZATION_TOKEN
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao obter o token de autenticação:", error);
    throw new Error("Falha ao obter o token de autenticação.");
  }
}
