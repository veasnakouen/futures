'use client';
import React, { type ReactNode, useId } from 'react';
import { motion } from 'framer-motion';

export type TabItem = {
    id: string;
    label: string;
    icon?: ReactNode;
};

export type PillTabsProps = {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
};

const PillTabs: React.FC<PillTabsProps> = ({ tabs, activeTab, onTabChange, className = '' }) => {
    const layoutIdPrefix = useId();

    if (!tabs || tabs.length <= 1) {
        return null;
    }

    return (
        <div className={`flex overflow-x-auto whitespace-nowrap bg-gray-100/70 dark:bg-gray-800/70 p-1.5 rounded-xl gap-1 shrink-0 hide-scrollbar shadow-inner ${className}`}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onTabChange(tab.id)}
                        className={`relative flex-1 shrink-0 min-w-max py-2 px-4 text-sm font-semibold text-center transition-all duration-300 rounded-lg flex items-center justify-center gap-2 ${isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId={`${layoutIdPrefix}-pill-bg`}
                                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-md ring-1 ring-gray-200/50 dark:ring-gray-600/50 -z-10"
                                initial={false}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            {tab.icon && <span>{tab.icon}</span>}
                            <span>{tab.label}</span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default PillTabs;
