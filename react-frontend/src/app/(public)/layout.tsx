"use client";
import React from "react";
import Link from "next/link";
import { useTheme } from "../../contexts/ThemeContext";
import { Briefcase, Sun, Moon } from "lucide-react";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark, setTheme } = useTheme();
  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${isDark ? "dark" : ""}`}
    >
      {" "}
      {/* Navigation Bar */}{" "}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {" "}
          <div className="flex justify-between h-16">
            {" "}
            {/* Logo */}{" "}
            <div className="flex-shrink-0 flex items-center">
              {" "}
              <Link href="/jobs" className="flex items-center gap-2">
                {" "}
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  {" "}
                  <Briefcase size={24} />{" "}
                </div>{" "}
                <span className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {" "}
                  Futures Portal{" "}
                </span>{" "}
              </Link>{" "}
            </div>{" "}
            {/* Right side navigation */}{" "}
            <div className="flex items-center gap-4">
              {" "}
              <Link
                href="/employer/dashboard"
                className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                {" "}
                Employers{" "}
              </Link>{" "}
              <Link
                href="/login"
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                {" "}
                Admin Login{" "}
              </Link>{" "}
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                {" "}
                {isDark ? <Sun size={20} /> : <Moon size={20} />}{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </nav>{" "}
      {/* Main Content Area */}{" "}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {" "}
        {children}{" "}
      </main>{" "}
      {/* Footer */}{" "}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        {" "}
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {" "}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-bold tracking-wide">
            {" "}
            &copy; {new Date().getFullYear()} Futures Portal. All rights
            reserved.{" "}
          </p>{" "}
        </div>{" "}
      </footer>{" "}
    </div>
  );
}
