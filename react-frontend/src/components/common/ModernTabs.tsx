'use client';
import React, { type ReactNode, useId } from 'react';
import { motion } from 'framer-motion';

export type TabItem = {
    id: string;
    label: string;
    icon?: ReactNode;
};

export type ModernTabsProps = {
    tabs: (TabItem | string)[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
};

const ModernTabs: React.FC<ModernTabsProps> = ({ tabs, activeTab, onTabChange, className = '' }) => {
    const layoutIdPrefix = useId();
    
    // Normalize string tabs to objects
    const normalizedTabs = tabs.map(tab => typeof tab === 'string' ? { id: tab, label: tab } : tab);

    return (
        <div className={`flex overflow-x-auto no-scrollbar py-2 ${className}`}>
            <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-2xl gap-2 w-max">
                {normalizedTabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`relative px-5 py-2.5 font-bold text-sm whitespace-nowrap rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 ${
                                isActive 
                                    ? 'text-blue-700 dark:text-blue-400 z-10'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-0'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId={`${layoutIdPrefix}-bg`}
                                    className="absolute inset-0 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-black/5 dark:border-white/5 -z-10"
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
        </div>
    );
};

export default ModernTabs;
