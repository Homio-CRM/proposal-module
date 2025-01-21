// lib/tokenManager.ts
import express from "express";
import { redirect } from "next/dist/server/api-utils";
import homio from "./axios";
import cookieParser from "cookie-parser";
import { promises } from "dns";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

interface LocalTokenResponse {
  access_token: string;
  expires_in: number;
}

let localTokenData: LocalTokenResponse | null = null;
let localTokenExpiration: number | null = null;

let accessTokenData: TokenResponse | null = null;
let accessTokenExpiration: number | null = null;

let currentAccessToken: string;
let currentRefreshToken: string;

async function getFirstAccessToken(): Promise<string> {
  try {
    const body = {
        clientId: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code: process.env.AUTHORIZATION_CODE,
        user_type: "Company"
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
    currentRefreshToken = response.data.refresh_token;
    return response.data.access_token;
  }
  catch (error) {
    console.error("Erro ao obter o access_token:", error);
    throw new Error("Falha ao obter o access_token.");
  }
}

async function getAccessToken(refreshToken: string): Promise<string> {
    if (!accessTokenData || !accessTokenExpiration || Date.now() >= accessTokenExpiration) {
        try {
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

          accessTokenData = response.data;
          currentRefreshToken = accessTokenData.refresh_token;
          accessTokenExpiration = Date.now() + accessTokenData.expires_in * 1000;
          return accessTokenData.access_token;
        } catch (error) {
          console.error("Erro ao obter o access_token:", error);
          throw new Error("Falha ao obter o access_token.");
        }
    }
    return accessTokenData.access_token;
}

async function getLocalToken(accessToken: string): Promise<string> {
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

export async function getToken(): Promise<string> {
    currentAccessToken = await getFirstAccessToken()
//   if(currentAccessToken == null) {
//   } 
//   else {
//       currentAccessToken = await getAccessToken(currentRefreshToken)
//   }
//   const localToken = await getLocalToken(currentAccessToken)
  return currentAccessToken;
}