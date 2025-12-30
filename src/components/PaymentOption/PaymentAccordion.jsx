import { useState } from "react";
import { PaymentOptionItem } from "./PaymentOptionItem";

export function PaymentAccordion({ item, onOptionSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className=" mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex gap-2 justify-between items-center p-4 border-b"
        aria-expanded={isExpanded}
      >
        <img src={item.icon} alt="" className="w-6 h-6" />
        <span className="font-bold flex-1 text-left">{item.category}</span>

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
      {isExpanded && (
        <div className="">
          {item.methods.map((option) => (
            <PaymentOptionItem
              key={option.id}
              option={option}
              onSelect={() => onOptionSelect({ ...option, channel: item.channel })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
