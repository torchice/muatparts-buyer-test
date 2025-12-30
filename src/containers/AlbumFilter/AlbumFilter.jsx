import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import IconComponent from "@/components/IconComponent/IconComponent";
// LBM - Multibahasa Optimization
import { useLanguage } from "@/context/LanguageContext";

// Adapter function to convert from new format to component format
const adaptFilterToComponent = (filter = {}) => {
  const { brands = [], categories = [], stock = "" } = filter;
  
  // This function assumes we have access to the original data items with names
  // We'll need to find the corresponding items from the data prop
  return {
    brands,
    categories,
    stock
  };
};

// Adapter function to convert from component format to new format
const adaptComponentToFilter = (selectedFilters) => {
  return {
    brands: selectedFilters.Brands.map(item => item.ID),
    categories: selectedFilters.Categories.map(item => item.ID),
    stock: selectedFilters.Stock.length > 0 ? selectedFilters.Stock[0].ID : ""
  };
};

const AlbumFilter = ({
  data,
  isOpen,
  setClose,
  onSelected,
  onSelectedValue,
  initialFilter = {} // New prop for the formatted filter data
}) => {
  const {t} = useLanguage()
  const toggleButtonRef = useRef(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [searchTerms, setSearchTerms] = useState({
    Categories: "",
    Brands: "",
    Stock: "",
  });
  
  // Initialize with empty selections
  const [selectedFilters, setSelectedFilters] = useState({
    Categories: [],
    Brands: [],
    Stock: [],
  });
  
  const filterRef = useRef(null);

  const translations = {
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0693
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0694
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0695
    Categories: t("LabelalbumFilterKategori"),
    Brands: t("LabelalbumFilterBrand"),
    Stock: t("LabelalbumFilterStok"),
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0692
    searchPlaceholder: t("LabelalbumFilterCari"),
  };

  // Effect to initialize selected filters from initialFilter prop
  useEffect(() => {
    if (!initialFilter || Object.keys(initialFilter).length === 0) return;
    
    // Find the corresponding item objects for each ID in the filter
    const newSelectedFilters = {
      Categories: initialFilter.categories?.map(id => 
        data.Categories?.find(item => item.ID === id)
      ).filter(Boolean) || [],
      
      Brands: initialFilter.brands?.map(id => 
        data.Brands?.find(item => item.ID === id)
      ).filter(Boolean) || [],
      
      Stock: initialFilter.stock ? 
        [data.Stock.find(item => item.ID === initialFilter.stock)].filter(Boolean) : []
    };
    
    setSelectedFilters(newSelectedFilters);
  }, [initialFilter, data]);

  // Add useEffect for handling outside clicks
  useEffect(() => {
    // Find and store a reference to the toggle button element
    toggleButtonRef.current = document.querySelector("button[id]");

    const handleOutsideClick = (event) => {
      // Check if the click is on the filter or on the toggle button
      const isClickOnToggleButton =
        toggleButtonRef.current &&
        toggleButtonRef.current.contains(event.target);

      // Only close if the click is outside both the filter and the toggle button
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !isClickOnToggleButton
      ) {
        setClose();
      }
    };

    // Add event listener when the filter is open
    if (isOpen) {
      // Use setTimeout to ensure this event listener runs after the toggle button's click handler
      setTimeout(() => {
        document.addEventListener("mousedown", handleOutsideClick);
      }, 0);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, setClose]);

  const handleSearch = (section, value) => {
    setSearchTerms((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const clearSearch = (section) => {
    setSearchTerms((prev) => ({
      ...prev,
      [section]: "",
    }));
  };

  const getFilteredItems = (section) => {
    const searchTerm = searchTerms[section].toLowerCase();
    return data[section].filter((item) =>
      item.Name.toLowerCase().includes(searchTerm)
    );
  };

  const handleCheckboxChange = (section, item, isChecked) => {
    const newSelectedFilters = { ...selectedFilters };

    if (isChecked) {
      // Add to selected filters
      newSelectedFilters[section] = [...newSelectedFilters[section], item];
    } else {
      // Remove from selected filters
      newSelectedFilters[section] = newSelectedFilters[section].filter(
        (filter) => filter.ID !== item.ID
      );
    }

    setSelectedFilters(newSelectedFilters);

    // Convert to new format before sending to parent
    if (onSelected) {
      const formattedFilter = adaptComponentToFilter(newSelectedFilters);
      onSelected(formattedFilter);
    }

    // Also send flattened array of all selected filters for FilterChips
    const allSelectedFilters = Object.entries(newSelectedFilters).flatMap(
      ([section, items]) =>
        items.map((item) => ({
          id: `${section}-${item.ID}`,
          label: item.Name,
          section,
          itemId: item.ID,
        }))
    );

    if (onSelectedValue) {
      onSelectedValue(allSelectedFilters);
    }
  };

  const isItemSelected = (section, itemId) => {
    return selectedFilters[section].some((item) => item.ID === itemId);
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Main Menu */}
          <div
            ref={filterRef}
            className="absolute top-8 -left-px w-44 bg-white rounded-md shadow-md border border-neutral-400 z-40"
          >
            {Object.entries(data).map(([section, items], index) => (
              <div
                key={section}
                className="group relative"
                onMouseEnter={() => setExpandedSection(section)}
                onMouseLeave={(e) => {
                  // Check if we're not hovering over the options panel
                  const rect = e.currentTarget.getBoundingClientRect();
                  const isInOptionsPanel =
                    e.clientX > rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom;
                  if (!isInOptionsPanel) {
                    setExpandedSection(null);
                  }
                }}
              >
                <div className="px-[10px] py-2 flex items-center justify-between hover:bg-gray-50 rounded-md">
                  <span className="text-xs font-medium">
                    {translations[section]}
                  </span>
                  <IconComponent
                    src={"/icons/chevron-right.svg"}
                    color="default"
                  />
                </div>

                {/* Invisible bridge to maintain hover */}
                {expandedSection === section && (
                  <div className="absolute top-0 left-full w-4 h-full" />
                )}

                {/* Options Panel */}
                {expandedSection === section && (
                  <div
                    className="absolute -top-px left-[calc(100%+1px)] w-52 bg-white rounded-md shadow-md border border-neutral-400 p-3 z-50"
                    onMouseEnter={() => setExpandedSection(section)}
                    onMouseLeave={() => setExpandedSection(null)}
                  >
                    {/* Search within option menu */}
                    <div className="relative mb-2">
                      <div className="relative flex items-center bg-white rounded-lg border border-gray-200 focus-within:border-primary-700">
                        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                        <input
                          id={`search-${section}`}
                          type="text"
                          value={searchTerms[section]}
                          onChange={(e) =>
                            handleSearch(section, e.target.value)
                          }
                          placeholder={`${translations.searchPlaceholder} ${translations[section]}`}
                          className="w-full pl-10 pr-8 py-2 text-xs font-medium bg-transparent focus:outline-none placeholder:text-neutral-600"
                        />
                        {searchTerms[section] && (
                          <button
                            onClick={() => clearSearch(section)}
                            className="absolute right-3"
                          >
                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filtered options */}
                    <div className="max-h-64 overflow-y-auto">
                      {getFilteredItems(section).map((item) => (
                        <label
                          key={item.ID}
                          className="flex items-center gap-2 py-2 px-1 cursor-pointer"
                        >
                          <input
                            id={`checkbox-${item.ID}`}
                            type="checkbox"
                            className="min-h-4 min-w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                            checked={isItemSelected(section, item.ID)}
                            onChange={(e) =>
                              handleCheckboxChange(
                                section,
                                item,
                                e.target.checked
                              )
                            }
                          />
                          <span className="text-xs font-medium">
                            {item.Name}
                          </span>
                        </label>
                      ))}
                      {getFilteredItems(section).length === 0 && (
                        <div className="text-sm text-gray-500 py-2">
                          {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0692 */}
                          {t("LabelalbumFilterTidakadahasil")}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default AlbumFilter;