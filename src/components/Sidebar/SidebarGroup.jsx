import React, { useState } from "react";
import { SidebarItem } from "./SidebarItem";

export function SidebarGroup({
  title,
  items,
  activeItem,
  setActiveItem,
  isLast,
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`flex flex-col pb-4 mt-4 w-full ${
        !isLast ? "border-b border-solid border-b-stone-300" : ""
      }`}
    >
      {title && (
        <div
          className="flex justify-between items-center pb-2 w-full text-sm font-bold bg-white cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex-1 shrink self-stretch my-auto basis-0">
            {title}
          </div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/ad7b5eca32e81f6e8812c7c8179eba8826271728d957dcdaed42f4e0ce7888ce?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
            alt="Expand icon"
            className={`object-contain shrink-0 self-stretch my-auto w-4 aspect-square transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      )}
      {isOpen &&
        items.filter(i => typeof i.hidden == 'undefined').map((item) => (
          <SidebarItem
            key={item.id}
            {...item}
            isActive={activeItem === item.id}
            onClick={() => setActiveItem(item.id)}
          />
        ))}
    </div>
  );
}
