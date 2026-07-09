"use client";

import React from 'react';
import ProductList from '../../../../features/pos/components/ProductList';
import Layout from '../../../../components/common/Layout';
import { useTheme } from '../../../../contexts/ThemeContext';

export default function PosProductsPage() {
    const { isDark, setTheme } = useTheme();
    const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

    return (
        <>
            <ProductList />
        </>
    );
}
