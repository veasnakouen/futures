"use client";
import React from "react";
import StudentList from "../../../../features/school/components/StudentList";
import Layout from "../../../../components/common/Layout";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function StudentsPage() {
  return <StudentList />;
}
