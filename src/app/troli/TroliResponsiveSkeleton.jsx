import React from "react";

const TroliResponsiveSkeleton = () => {
  return (
    <div className="w-full max-w-md mx-auto bg-neutral-100 space-y-2">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white">
        <div className="skeleton animate-skeleton bg-gray-200 h-[18px] w-32 rounded"></div>
        <div className="skeleton animate-skeleton bg-gray-200 h-[18px] w-28 rounded text-blue-500"></div>
      </div>

      {/* Store Section */}
      <div className="py-6 px-4 bg-white space-y-4">
        <div className="flex items-center">
          <div className="skeleton animate-skeleton bg-gray-200 h-4 w-4 rounded mr-3"></div>
          <div className="skeleton animate-skeleton bg-gray-200 h-5 w-48 rounded"></div>
        </div>

        {/* Shipping From */}
        <div className="bg-gray-100 py-2 px-4 rounded-lg mb-3">
          <div className="flex items-center">
            <div className="skeleton animate-skeleton bg-gray-200 h-5 w-5 rounded-full mr-2"></div>
            <div className="skeleton animate-skeleton bg-gray-200 h-5 w-48 rounded"></div>
          </div>
        </div>

        {/* Shipping To */}
        <div className="bg-white py-2 px-4 rounded-lg border mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="skeleton animate-skeleton bg-gray-200 h-5 w-5 rounded-full mr-2"></div>
              <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded"></div>
            </div>
            <div className="skeleton animate-skeleton bg-gray-200 h-5 w-5 rounded"></div>
          </div>
        </div>

        {/* Product */}
        <div className="mb-3">
          <div className="flex mb-3">
            <div className="skeleton animate-skeleton bg-gray-200 h-4 w-4 rounded mt-1 mr-3"></div>
            <div className="flex-shrink-0 mr-3">
              <div className="skeleton animate-skeleton bg-gray-200 h-24 w-20 rounded"></div>
            </div>
            <div className="flex-1">
              <div className="skeleton animate-skeleton bg-gray-200 h-5 w-full rounded mb-1"></div>
              <div className="flex items-center mb-1">
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-10 rounded line-through mr-2"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-16 rounded"></div>
              </div>
              <div className="skeleton animate-skeleton bg-gray-200 h-6 w-16 rounded mb-1 font-bold"></div>
              <div className="skeleton animate-skeleton bg-gray-200 h-5 w-28 rounded"></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded text-blue-500"></div>
            <div className="flex items-center">
              <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-full mr-2"></div>
              <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-full mr-2"></div>
              <div className="flex rounded bg-gray-200 skeleton animate-skeleton h-8 w-24"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Voucher Section */}
      <div className="py-2 px-4 !mt-0 bg-muat-parts-non-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-full mr-3"></div>
            <div className="skeleton animate-skeleton bg-gray-200 h-5 w-40 rounded"></div>
          </div>
          <div className="skeleton animate-skeleton bg-gray-200 h-5 w-5 rounded"></div>
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="p-4">
        <div className="skeleton animate-skeleton bg-gray-200 h-6 w-48 rounded font-bold mb-4"></div>

        <div className="grid grid-cols-2 gap-4">
          {/* Wishlist Item 1 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="relative">
              <div className="skeleton animate-skeleton bg-gray-200 h-40 w-full"></div>
            </div>

            <div className="p-1">
              <div className="skeleton animate-skeleton bg-gray-200 h-4 w-20 rounded"></div>
            </div>

            <div className="p-2">
              <div className="skeleton animate-skeleton bg-gray-200 h-4 w-full rounded mb-1"></div>
              <div className="skeleton animate-skeleton bg-gray-200 h-5 w-20 rounded mb-2 font-bold"></div>

              <div className="flex items-center mb-1">
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-4 rounded mr-1"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-24 rounded"></div>
              </div>

              <div className="flex items-center mb-1">
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-4 rounded mr-1"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-20 rounded"></div>
              </div>

              <div className="mb-2">
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-16 rounded"></div>
              </div>

              <div className="skeleton animate-skeleton bg-gray-200 h-8 w-full rounded"></div>
            </div>
          </div>

          {/* Wishlist Item 2 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="relative">
              <div className="skeleton animate-skeleton bg-gray-200 h-40 w-full"></div>
            </div>

            <div className="p-1">
              <div className="skeleton animate-skeleton bg-gray-200 h-4 w-20 rounded"></div>
            </div>

            <div className="p-2">
              <div className="skeleton animate-skeleton bg-gray-200 h-4 w-full rounded mb-1"></div>
              <div className="skeleton animate-skeleton bg-gray-200 h-5 w-20 rounded mb-2 font-bold"></div>

              <div className="flex items-center mb-1">
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-4 rounded mr-1"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-24 rounded"></div>
              </div>

              <div className="flex items-center mb-1">
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-4 rounded mr-1"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-20 rounded"></div>
              </div>

              <div className="mb-2">
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-16 rounded"></div>
              </div>

              <div className="skeleton animate-skeleton bg-gray-200 h-8 w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroliResponsiveSkeleton;
