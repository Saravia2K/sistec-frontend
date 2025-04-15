import _axios, { AxiosResponse } from "axios";
import { parseDates } from "./helpers";

const axios = _axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axios.interceptors.response.use((response: AxiosResponse) => {
  if (response.data) {
    response.data = parseDates(response.data);
  }
  return response;
});

export default axios;
