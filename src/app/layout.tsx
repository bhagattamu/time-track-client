import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  CssBaseline,
  InitColorSchemeScript,
  ThemeProvider,
} from "@mui/material";
import theme from "@/theme";
import Providers from "./providers";
import { ReactElement } from "react";
import TimeTrackAppBar from "@/components/app-bar";

export const metadata: Metadata = {
  title: "Time Track",
  description: "Application to track hours taken to do a task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactElement;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline enableColorScheme />
            <Providers>
              <TimeTrackAppBar />
              {children}
            </Providers>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
