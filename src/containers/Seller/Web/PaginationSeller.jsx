import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationSeller = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        i === currentPage ||
        (currentPage - i >= 1 && currentPage - i <= delta) ||
        (i - currentPage >= 1 && i - currentPage <= delta)
      ) {
        range.push(i);
      } else if (i < currentPage && currentPage - i === delta + 1) {
        rangeWithDots.push("...");
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="flex items-center gap-2">
        <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-1 rounded ${
            currentPage === 1
                ? "text-neutral-400 cursor-not-allowed"
                : "text-neutral-700 hover:bg-neutral-100"
            }`}
            aria-label="Previous page"
        >
            <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2">
            {getPageNumbers().map((pageNumber, index) => (
            <React.Fragment key={index}>
                {pageNumber === "..." ? (
                <span className="px-2">...</span>
                ) : (
                <button
                    onClick={() => onPageChange(pageNumber)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm
                    ${
                        currentPage === pageNumber
                        ? "bg-[rgba(194,39,22,1)] text-white font-bold"
                        : "text-neutral-700 hover:bg-neutral-100 font-medium"
                    }`}
                    aria-label={`Go to page ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                    {pageNumber}
                </button>
                )}
            </React.Fragment>
            ))}
        </div>

        <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-1 rounded ${
            currentPage === totalPages
                ? "text-neutral-400 cursor-not-allowed"
                : "text-neutral-700 hover:bg-neutral-100"
            }`}
            aria-label="Next page"
        >
            <ChevronRight size={20} />
        </button>
    </div>
  );
};

export default PaginationSeller;
