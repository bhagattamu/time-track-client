import StoreProvider from "@/state/redux";
import { ReactElement, ReactNode } from "react";
import AuthProvider from "./authProvider";
import ToastProvider from "./toastProvider";

const Providers = ({
  children,
}: {
  children: ReactElement | ReactNode | string;
}) => {
  return (
    <StoreProvider>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </StoreProvider>
  );
};

export default Providers;
