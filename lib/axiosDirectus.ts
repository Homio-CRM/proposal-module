import axios from "axios";

const directus = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
});

export default directus;