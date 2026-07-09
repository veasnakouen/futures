"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import Layout from "../../components/common/Layout";
import { useTheme } from "../../contexts/ThemeContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { isDark, setTheme } = useTheme();
  
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && (!isAuthenticated || !user)) {
      router.replace("/login");
    }
  }, [isMounted, isAuthenticated, user, router]);

  if (!isMounted || !isAuthenticated || !user) {
    return null; // Or a loading spinner
  }

  return (
    <Layout isDark={isDark} setIsDark={setIsDark}>
      {children}
    </Layout>
  );
}
