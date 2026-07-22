"use client";

import ProductList from '../../../../features/pos/components/ProductList';
import { useTheme } from '../../../../contexts/ThemeContext';

export default function PosProductsPage() {
    const { isDark, setTheme } = useTheme(); const setIsDark = (dark: boolean) => setTheme(dark ? "dark" : "light");

    return (
        <>
            <ProductList />
        </>
    );
}
