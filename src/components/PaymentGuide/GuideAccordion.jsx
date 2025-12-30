import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

export function GuideAccordion({ item, onOptionSelect }) {
  const {t} = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex gap-2 justify-between items-center p-4 border-b"
        aria-expanded={isExpanded}
      >
        <span className="font-bold flex-1 text-left">{t(item.category)}</span>

        <svg
          className={`w-4 h-4 transform transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isExpanded && <div className="px-4 py-3">{t(item.guide)}</div>}
    </div>
  );
}
