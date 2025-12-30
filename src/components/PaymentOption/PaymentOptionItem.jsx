import * as React from "react";

export function PaymentOptionItem({ option, onSelect }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      className={`flex gap-2 items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b ml-4`}
    >
      <img
        loading="lazy"
        src={option.icon}
        alt={`${option.name} icon`}
        className="object-contain shrink-0 w-8 h-8"
      />
      <div className="flex-1">
        <div className="font-medium line-clamp-1">{option.name}</div>
      </div>
    </div>
  );
}
