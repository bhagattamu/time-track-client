"use client";

import { createContext, useContext } from "react";

export const AuthContext = createContext<AuthContext | null>(null);
export const ToastContext = createContext<ToastContext | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useToast = () => {
  return useContext(ToastContext);
};
