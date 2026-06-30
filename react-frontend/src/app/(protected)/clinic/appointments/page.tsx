"use client";
import React from "react";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";
import AppointmentList from "../../../../features/clinic/components/AppointmentList";

export default function AppointmentsPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Appointments">
      <AppointmentList />
    </Layout>
  );
}
