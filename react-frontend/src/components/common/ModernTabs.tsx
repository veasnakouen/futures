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
        <div className={`flex border-b  overflow-x-auto no-scrollbar pt-1 ${className}`}>
            {normalizedTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-colors duration-300 relative flex items-center justify-center gap-2 rounded-t-xl ${ isActive ?'text-blue-600 dark:text-blue-400 z-10':'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 z-0'}`}
                        style={{ marginBottom: '-1px' }} // Pull down slightly to cover border-b seamlessly if needed
                    >
                        {isActive && (
                            <motion.div
                                layoutId={`${layoutIdPrefix}-bg`}
                                className="absolute inset-0 bg-white dark:bg-gray-800 rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t border-x -z-10"
                                initial={false}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        
                        <span className="relative z-10 flex items-center gap-2">
                            {tab.icon && <span>{tab.icon}</span>}
                            <span>{tab.label}</span>
                        </span>
                        
                        {isActive && (
                            <motion.div
                                layoutId={`${layoutIdPrefix}-underline`}
                                className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-blue-600 dark:bg-blue-400 rounded-t-full z-20"
                                initial={false}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default ModernTabs;
