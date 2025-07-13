"use client";

import React, { ReactElement, ReactNode } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ToastContext } from "./context";

const ToastProvider = ({
  children,
}: {
  children: ReactElement | ReactNode | string;
}) => {
  const successToast = (message: string) => {
    toast.success(message);
  };

  const errorToast = (message: string) => {
    toast.error(message);
  };

  const warnToast = (message: string) => {
    toast.warn(message);
  };

  const infoToast = (message: string) => {
    toast.info(message);
  };

  return (
    <ToastContext.Provider
      value={{ successToast, errorToast, warnToast, infoToast }}
    >
      {children}
      <ToastContainer position="bottom-right" theme="light" />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
