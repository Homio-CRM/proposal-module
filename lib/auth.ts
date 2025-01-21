// lib/auth.ts
import express from "express";
import { redirect } from "next/dist/server/api-utils";
import homio from "./axios";
import cookieParser from "cookie-parser";
import { promises } from "dns";

const app = express();
app.use(cookieParser());

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

interface LocalTokenResponse {
  access_token: string;
  expires_in: number;
}

let localTokenData: LocalTokenResponse | null = null;
let localTokenExpiration: number | null = null;

interface CustomRequest extends Request {
  cookies: { [key: string]: string };
}

interface CustomResponse extends Response {
  cookie(name: string, value: string, options: Record<string, unknown>): void;
}

export async function getFirstAccessToken(): Promise<string> {
  try {
    const body = {
      clientId: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: process.env.AUTHORIZATION_CODE,
    };

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
    return response.data.access_token;
  }
  catch (error) {
    console.error("Erro ao obter o access_token:", error);
    throw new Error("Falha ao obter o access_token.");
  }
}

export async function getAccessToken(req: CustomRequest, res: CustomResponse): Promise<string> {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new Error("Refresh token não encontrado.");
    }

    const body = {
      clientId: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };

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

    // Atualiza o refresh_token no cookie
    if (response.data.refresh_token) {
      res.cookie("refreshToken", response.data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
      });
    }

    return response.data.access_token;
  } catch (error) {
    console.error("Erro ao obter o access_token:", error);
    throw new Error("Falha ao obter o access_token.");
  }
}

export async function getLocalToken(accessToken: string): Promise<string> {
  if (!localTokenData || !localTokenExpiration || Date.now() >= localTokenExpiration) {
    try {
      const body = {
        companyId: process.env.COMPANY_ID,
        locationId: process.env.LOCATION_ID,
      };

      const response = await homio.post<LocalTokenResponse>(
        "/oauth/locationToken",
        body,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Version: "2021-07-28",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      localTokenData = response.data;
      localTokenExpiration = Date.now() + localTokenData.expires_in * 1000;
      return localTokenData.access_token;
    } catch (error) {
      console.error("Erro ao obter o localToken:", error);
      throw new Error("Falha ao obter o localToken.");
    }
  }
  return localTokenData.access_token;
}