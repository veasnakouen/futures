"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

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

  return <>{children}</>;
}
