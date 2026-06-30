"use client";
import React from "react";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";
import RoomList from "../../../../features/hotel/components/RoomList";

export default function RoomsPage() {
  const { isDark, setTheme } = useTheme();
  const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Rooms">
      <RoomList />
    </Layout>
  );
}
