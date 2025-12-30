// FIX BUG Profil Seller Sisi Buyer LB-0043
// FIX BUG Pengecekan Ronda Muatparts LB-0054
import IconComponent from "@/components/IconComponent/IconComponent";
import { Fragment, useEffect, useRef, useState } from "react";

const SortingDropdown = ({
    disabled,
    onChange,
    options,
    value
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleChange = (value) => {
        onChange(value)
        setIsOpen(false)
    }

    const selectedSort = options.find(item => item.value === value)?.label || options[0]?.label

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                // FIX BUG Profil Seller Sisi Buyer LB-0029
                className={`h-8 flex gap-x-2 items-center px-3 ${disabled ? "bg-neutral-200 cursor-not-allowed" : "bg-neutral-50 cursor-pointer"} rounded-md border ${value ? "border-primary-700" : "border-neutral-600"}`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                disabled={disabled}
            >
                <IconComponent classname={value ? "icon-blue" : ""} src="/icons/sorting.svg"/>
                <div
                    className={`flex w-12 font-medium text-[12px] leading-[14.4px] ${value ? "text-primary-700" : "text-neutral-600"} ${disabled ? "text-neutral-500" : ""}`}
                >
                    {selectedSort}
                </div>
                <IconComponent classname={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"} ${value ? "icon-blue" : ""}`} src="/icons/chevron-down.svg"/>
            </button>

            {isOpen && (
                <ul
                    className="absolute z-10 w-[136px] mt-1 bg-white border border-solid border-neutral-400 rounded-md shadow-muat"
                    role="listbox"
                >
                {options.map((option, key) => {
                    const checked = value === option.value
                    return (
                        <Fragment key={key}>
                            <li
                                onClick={() => handleChange(option.value)}
                                className={`
                                    flex justify-between items-center px-3 h-8 cursor-pointer hover:bg-neutral-200 text-[12px] leading-[14.4px]
                                    ${key === 0 ? 'rounded-t-md' : ''}
                                    ${key === options.length - 1 ? 'rounded-b-md' : ''}
                                    ${checked ? "font-semibold" : "font-medium"}
                                `}
                                role="option"
                                aria-selected={checked}
                            >
                                <span>{option.label}</span>
                                {checked ? (
                                    <IconComponent
                                        src="/icons/check-circle.svg"
                                    />
                                ) : null}
                            </li>
                        </Fragment>
                    )
                })}
                </ul>
            )}
        </div>
    )
}

export default SortingDropdown