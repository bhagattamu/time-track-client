"use client";

import { ReactElement, ReactNode, useEffect, useState } from "react";
import { AuthContext, useToast } from "./context";
import {
  useGetAuthTokenMutation,
  useLoginMutation,
  useRegisterMutation,
} from "@/state/api/authApi";
import { usePathname, useRouter } from "next/navigation";
import { setAuth } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { jwtDecode, JwtPayload } from "jwt-decode";
import PageLoader from "@/components/page-loader";

const AuthProvider = ({
  children,
}: {
  children: ReactElement | ReactNode | string;
}) => {
  const authUser = useAppSelector((state) => state.global.auth);
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [refreshToken] = useGetAuthTokenMutation();
  const [isAuthenticatingInServer, setIsAuthenticatingInServer] =
    useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const dispatch = useAppDispatch();
  const toast = useToast();

  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.match(/^\/(login|register)$/);
  const isPublicPage = pathname.match(/^\/(thank-you)$/);

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    const accessToken = authUser?.accessToken || "";
    const isTokenExpired = (token: string): boolean => {
      if (!token) return true;
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.exp ? decoded.exp < Date.now() / 1000 : true;
      } catch (error) {
        toast?.warnToast("Token Expired, refreshing token in progress");
        console.error("Error decoding token:", error);
        return true; // If there's an error, consider the token expired
      }
    };
    if (!isPublicPage) {
      if (isTokenExpired(accessToken || "")) {
        setIsAuthenticatingInServer(true);

        // Token is expired, refresh it
        refreshToken()
          .unwrap()
          .then((response) => {
            if (response) {
              setAuthenticated(true);
              dispatch(setAuth(response));
              if (isAuthPage) {
                router.push("/");
                toast?.warnToast(
                  "Please logout to go to login / register page"
                );
              }
            }
          })
          .catch((error) => {
            setAuthenticated(false);
            console.error("Failed to refresh token:", error);
            // redirect to login page if token refresh fails and user is on private page
            if (!isAuthPage) {
              router.push("/login");
              toast?.errorToast("Please login to continue");
            }
          })
          .finally(() => {
            setIsAuthenticatingInServer(false);
          });
      } else if (isAuthPage) {
        // User is authenticated and on an auth page, redirect to home
        console.log("IN");
        router.push("/");
        setIsAuthenticatingInServer(false);
        setAuthenticated(true);
      } else {
        setIsAuthenticatingInServer(false);
        setAuthenticated(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.accessToken]);

  if (!isAuthPage && authenticated) {
    return (
      <AuthContext.Provider value={{ authUser }}>
        {isAuthenticatingInServer ? <PageLoader /> : children}
      </AuthContext.Provider>
    );
  }
  const loginAction = async (user: LoginRequest) => {
    try {
      const response = await login(user).unwrap();
      if (response) {
        // Handle successful login, e.g., redirect to dashboard
        dispatch(setAuth(response));
        router.push("/");
        if (toast) toast.successToast("Login successful!");
      }
    } catch (error) {
      // Handle login error, e.g., show an error message
      console.error("Login failed:", error);
      if (toast) toast.errorToast("Login Failed!");
    }
  };

  const registerAction = async (user: RegisterRequest) => {
    try {
      const response = await register(user).unwrap();
      if (response) {
        if (toast) toast.successToast("Registration successful!");
        router.push("/thank-you");
      }
    } catch (error) {
      // Handle registration error, e.g., show an error message
      console.error("Registration failed:", error);
      if (toast) toast.errorToast("Registration Failed!");
    }
  };

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (isAuthPage && !authenticated) {
    return (
      <AuthContext.Provider value={{ authUser, loginAction, registerAction }}>
        {isAuthenticatingInServer ? <PageLoader /> : children}
      </AuthContext.Provider>
    );
  }
  return <PageLoader />;
};

export default AuthProvider;
