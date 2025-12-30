import Chip from "./Chip";
import { useRef } from "react";

// This is the only adapter needed, since FilterChips already expects
// a flattened array of filter items which matches your required format
const adaptFilterToChips = (filter = {}, filterLabels = {}) => {
  // filterLabels should be an object with mappings for all IDs to labels
  // e.g. { "9d05e83e-e682-4e88-9e14-a8ffca0d16cd": "tes", ... }
  
  const results = [];
  
  // Add categories
  if (filter.categories && filter.categories.length) {
    filter.categories.forEach(itemId => {
      results.push({
        id: `Categories-${itemId}`,
        label: filterLabels[itemId] || itemId,
        section: "Categories",
        itemId
      });
    });
  }
  
  // Add brands
  if (filter.brands && filter.brands.length) {
    filter.brands.forEach(itemId => {
      results.push({
        id: `Brands-${itemId}`,
        label: filterLabels[itemId] || itemId,
        section: "Brands",
        itemId
      });
    });
  }
  
  // Add stock if present
  if (filter.stock) {
    results.push({
      id: `Stock-${filter.stock}`,
      label: filterLabels[filter.stock] || filter.stock,
      section: "Stock",
      itemId: filter.stock
    });
  }
  
  return results;
};

function FilterChips({ filters, onRemoveFilter, onClearAll }) {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Handle filter removal and adapt to new format if needed
  const handleRemoveFilter = (filterId) => {
    onRemoveFilter(filterId);
  };

  return (
    filters.length > 0 && (
      <div className="flex overflow-hidden flex-wrap gap-3 items-center text-blue-600 max-w-[898px] mt-4">
        <button
          onClick={onClearAll}
          className="self-stretch my-auto text-xs font-bold leading-tight"
          aria-label="Clear all filters"
        >
          Hapus Semua Filter
        </button>

        <button
          onClick={() => handleScroll("left")}
          className="focus:outline-none"
          aria-label="Scroll left"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/1edf36eb176b79e43c55828a1d0d86041cd8559d6964e71240983385cd384999?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
            alt=""
            className="object-contain shrink-0 self-stretch my-auto w-7 aspect-square"
          />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-hidden flex-1 shrink gap-3 items-center self-stretch my-auto text-xs font-semibold leading-tight basis-0"
        >
          {filters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              onRemove={() => handleRemoveFilter(filter.id)}
            />
          ))}
        </div>

        <button
          onClick={() => handleScroll("right")}
          className="focus:outline-none"
          aria-label="Scroll right"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/220eb11b9f8f19da3c4e9d7cb9e80e0d6fe4b800bc07663e03329c2c33aa13af?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
            alt=""
            className="object-contain shrink-0 self-stretch my-auto w-7 aspect-square"
          />
        </button>
      </div>
    )
  );
}

export default FilterChips;