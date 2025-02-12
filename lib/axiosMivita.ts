import axios from "axios";

const mivita = axios.create({
  baseURL: process.env.REACT_APP_HOMIO_API_MIVITA_BASE_URL,
  timeout: 10000
});

// homio.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       console.error("Erro na resposta Axios:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//       });
//       return Promise.reject(error);
//     }
//   );

export default mivita;