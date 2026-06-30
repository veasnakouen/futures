"use client";
import "../i18n";
import React, { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { ThemeProvider } from "../contexts/ThemeContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          {children}
          {mounted && (
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                className:
                  "dark:bg-slate-900/80 dark:text-white rounded-md shadow-2xl border dark:border-white/10 backdrop-blur-xl font-bold tracking-tight",
                duration: 4000,
                style: {
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  color: "#0f172a",
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
                },
                success: { iconTheme: { primary: "#3b82f6", secondary: "#fff" } },
                error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
              }}
            />
          )}
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
