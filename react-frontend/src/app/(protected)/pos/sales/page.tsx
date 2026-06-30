"use client";

import React from 'react';
import SalesHistory from '../../../../features/pos/components/SalesHistory';
import Layout from '../../../../components/common/Layout';
import { useTheme } from '../../../../contexts/ThemeContext';

export default function PosSalesPage() {
    const { isDark, setTheme } = useTheme();
    const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

    return (
        <Layout isDark={isDark} setIsDark={setIsDark} title="Sales History">
            <SalesHistory />
        </Layout>
    );
}
