import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import ImageComponent from "@/components/ImageComponent/ImageComponent";

const SortingDropdown = ({ 
  onChange, 
  options, 
  value,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wasSelected, setWasSelected] = useState(false);
  const dropdownRef = useRef(null);
  
  const selectedOption = options.find(option => option.value === value) || options[0];

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setWasSelected(true);
  };

  // If initial value is not the default, consider it as selected
  useEffect(() => {
    if (value !== options[0].value) {
      setWasSelected(true);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
        {/* LB 006 Ulasan Buyer */}
      <button
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          flex items-center justify-between gap-2 px-3 py-2 h-[32px] rounded-md border 
          ${disabled 
            ? 'border border-neutral-600 text-[#7b7b7b] bg-neutral-50 cursor-default' 
            : isOpen || wasSelected
              ? 'border border-[#176CF7] hover:border-[#176CF7] text-[#176CF7] cursor-pointer'
              : 'border border-neutral-600 hover:border-neutral-400 text-neutral-700 cursor-pointer'}
          min-w-[120px]
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2">
            <ImageComponent
                src={isOpen || wasSelected ? "/icons/sort-active.svg" : "/icons/sort-gray.svg"}
                width={16}
                height={16}
                alt="muat"
            />
            <span className="text-sm font-medium">{selectedOption.label}</span>
        </div>
        {isOpen || wasSelected ? (
          <ImageComponent
            src="/icons/chevron-active.svg"
            width={16}
            height={16}
            alt="chevron"
          />
        ) : (
          <ChevronDown 
            size={16} 
            className={disabled ? 'text-[#7b7b7b]' : 'text-neutral-700'} 
          />
        )}

        {/* LB 006 Ulasan Buyer */}
      </button>

      {isOpen && (
        <ul
          className="absolute top-full left-0 z-10 mt-1 w-full bg-white border border-neutral-200 rounded-md shadow-lg py-1"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              className={`
                px-3 py-2 text-sm cursor-pointer hover:bg-neutral-100
                ${value === option.value ? 'bg-neutral-50 text-primary-700 font-medium' : 'text-neutral-700'}
              `}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortingDropdown;