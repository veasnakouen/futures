"use client";

import React from 'react';
import PosDashboard from '../../../features/pos/views/PosDashboard';
import Layout from '../../../components/common/Layout';
import { useTheme } from '../../../contexts/ThemeContext';

export default function PosPage() {
    const { isDark, setTheme } = useTheme();
    const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

    return (
        <>
            <PosDashboard />
        </>
    );
}
