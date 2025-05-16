import axios from "axios";
import { envClient } from "@/config/env/client";

export const axiosApi = axios.create({
  baseURL: envClient.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
