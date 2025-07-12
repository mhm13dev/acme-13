import axios from "axios";
import { envClient } from "@repo/env/admin/client";

export const axiosApi = axios.create({
  baseURL: envClient.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
