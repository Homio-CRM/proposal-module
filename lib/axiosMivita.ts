import axios from "axios";

const mivita = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOMIO_API_MIVITA_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
});

export default mivita;