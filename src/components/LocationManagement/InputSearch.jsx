"use client";
import React, { useState } from "react";
import Input from "../Input/Input";

const FilterableMenu = ({
  options = [],
  filterText,
  onOptionClick,
  isVisible,
  getOptionLabel,
}) => {
  if (!isVisible) return null;

  const filteredOptions = options.filter((option) =>
    getOptionLabel(option).toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div
        className={`absolute z-50 mt-1 bg-white rounded-md border border-blue-600 border-solid ${
          filteredOptions.length > 0 ? "overflow-y-scroll max-h-36" : ""
        } w-full`}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => {
            const label = getOptionLabel(option);
            const startIndex = label
              .toLowerCase()
              .indexOf(filterText.toLowerCase());
            const endIndex = startIndex + filterText.length;
            return (
              <div
                key={index}
                className="flex gap-3 justify-between items-start w-full"
              >
                <button
                  className="flex font-semibold text-start w-full m-2 hover:text-primary-700"
                  onClick={() => onOptionClick(option)}
                >
                  <div className="flex-1 shrink gap-2.5 self-stretch">
                    {startIndex !== -1 ? (
                      <>
                        {label.substring(0, startIndex)}
                        <strong>{label.substring(startIndex, endIndex)}</strong>
                        {label.substring(endIndex)}
                      </>
                    ) : (
                      label
                    )}
                  </div>
                </button>
              </div>
            );
          })
        ) : (
          <div className="p-2 text-center font-semibold">
            Pencarian Tidak Ditemukan
          </div>
        )}
      </div>
    </div>
  );
};

const InputSearch = ({
  options,
  changeEvent,
  getOptionLabel,
  onSelectValue,
  ...props
}) => {
  const [filterText, setFilterText] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  const handleInputChange = (e) => {
    setFilterText(e.target.value);
    setMenuVisible(true);
    changeEvent(e);
  };

  const handleOptionClick = (option) => {
    setFilterText(getOptionLabel(option));
    setMenuVisible(false);
    changeEvent({ target: { value: getOptionLabel(option) } });

    onSelectValue(option);
  };

  return (
    <div>
      <Input {...props} changeEvent={handleInputChange} value={filterText} />
      <div className="relative">
        <FilterableMenu
          options={options}
          filterText={filterText}
          onOptionClick={handleOptionClick}
          isVisible={menuVisible}
          getOptionLabel={getOptionLabel}
        />
      </div>
    </div>
  );
};

export default InputSearch;
