import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com", // غيّر ده لو عندك API URL
});

// GET
export const getData = async (endpoint: string) => {
  const response = await api.get(endpoint);
  return response.data;
};

// POST
export const postData = async (endpoint: string, data: any) => {
  const response = await api.post(endpoint, data);
  return response.data;
};
