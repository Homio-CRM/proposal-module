import axios from "axios";

const homio = axios.create({
  baseURL: process.env.HOMIO_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
});

export default homio;