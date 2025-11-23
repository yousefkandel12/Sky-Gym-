import { saveToStorage, getFromStorage } from "./storage";

export const login = (email: string, password: string) => {
  if (email && password) {
    saveToStorage("user", { email });
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUser = () => {
  return getFromStorage("user");
};
