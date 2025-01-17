// import axios from "axios";

// const homio = axios.create({
//   baseURL: process.env.HOMIO_API_BASE_URL, 
//   timeout: 10000, 
//   headers: {
//     "Content-Type": "application/json", 
//     Accept: "application/json",
//   },
// });

// homio.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       console.error("Erro na resposta Axios:", error.response || error.message);
//       return Promise.reject(error);
//     }
//   );
  
// export default homio;
