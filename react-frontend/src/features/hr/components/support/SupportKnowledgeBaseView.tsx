import React, { useState } from "react";
import SearchInput from "@/components/common/SearchInput";
import { BookOpen, Shield, HelpCircle } from "lucide-react";

export const SupportKnowledgeBaseView: React.FC = () => {
  const [kbSearch, setKbSearch] = useState("");

  const articles = [
    {
      id: 1,
      title: "VPN Remote Connection & Multi-Factor Auth Setup",
      category: "Network & Access",
      summary: "Step-by-step guide to installing Cisco AnyConnect VPN and configuring Okta MFA token for remote access.",
    },
    {
      id: 2,
      title: "Hardware Asset Exchange & Deprecation Policy",
      category: "Equipment",
      summary: "Guidelines for requesting hardware upgrades, returning old laptops, and reporting damaged peripherals.",
    },
    {
      id: 3,
      title: "Self-Service Password Reset & Security Key Management",
      category: "Security",
      summary: "How to use the automated password self-service portal and configure YubiKey hardware tokens.",
    },
  ];

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(kbSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(kbSearch.toLowerCase()) ||
      a.summary.toLowerCase().includes(kbSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h3 className="text-lg font-black dark:text-white uppercase tracking-tight flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" /> Knowledge Base & Self-Service FAQ
          </h3>
          <p className="text-xs text-gray-500 mt-1">Search standard operating procedures and technical guides</p>
        </div>
        <SearchInput
          placeholder="Search Knowledge Base..."
          value={kbSearch}
          onChange={(val) => setKbSearch(val)}
          containerClassName="w-full sm:w-72"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
                {article.category}
              </span>
              <h4 className="text-base font-black dark:text-white mt-4 group-hover:text-blue-600 transition-colors leading-snug">
                {article.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                {article.summary}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>Read SOP Guide →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportKnowledgeBaseView;
