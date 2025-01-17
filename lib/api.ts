// import { getAccessToken } from "./auth";

// export async function homioApiRequest<T>(
//   endpoint: string,
//   method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
//   body: Record<string, unknown> | null = null
// ): Promise<T> {
//   const token = await getAccessToken();

//   try {
//     const response = await fetch(`${process.env.HOMIO_API_BASE_URL}${endpoint}`, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: body ? JSON.stringify(body) : null,
//     });

//     if (!response.ok) {
//       throw new Error(`Erro na API: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Erro na requisição API:", error);
//     throw error;
// }
// }