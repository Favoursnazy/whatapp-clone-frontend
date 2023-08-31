import axios from "axios";
const SERVER_URL = import.meta.env.VITE_API_ENDPOINT;

// Axios
const Axios = axios.create({
  withCredentials: true,
  baseURL: SERVER_URL,
});

export default Axios;
