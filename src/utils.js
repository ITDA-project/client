import axios from "axios";
import { useAuth } from "./contexts/AuthContext";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const removeWhitespace = (text) => {
  const regex = /\s/g;
  return text.replace(regex, "");
};

const api = axios.create({
  baseURL: "http://10.0.2.2:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = () => {
  const { accessToken } = useAuth();

  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  return api;
};
