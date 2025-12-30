import React from "react";

const IdAlbumSkeleton = () => {
  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <div className="skeleton animate-skeleton bg-gray-200 h-5 w-16 rounded"></div>
        <div className="skeleton animate-skeleton bg-gray-200 h-5 w-3 rounded"></div>
        <div className="skeleton animate-skeleton bg-gray-200 h-5 w-16 rounded"></div>
      </div>

      {/* Album Title and Actions */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center">
          <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-full mr-3"></div>
          <div className="skeleton animate-skeleton bg-gray-200 h-8 w-24 rounded font-bold"></div>
        </div>
        <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-full"></div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="skeleton animate-skeleton bg-gray-200 h-8 w-72 rounded-md"></div>
        <div className="skeleton animate-skeleton bg-gray-200 h-8 w-36 rounded-md"></div>
        <div className="skeleton animate-skeleton bg-gray-200 h-8 w-36 rounded-md"></div>
        <div className="ml-auto flex items-center">
          <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded mr-4"></div>
          <div className="skeleton animate-skeleton bg-gray-200 h-8 w-32 rounded-md"></div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {/* Product Card Skeleton - Repeated 5 times */}
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* Product Image */}
            <div className="relative">
              <div className="skeleton animate-skeleton bg-gray-200 h-[168px] w-full"></div>
              <div className="absolute top-2 right-2"></div>
            </div>

            {/* Quality Tag */}
            <div className="p-2">
              <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded"></div>
            </div>

            {/* Product Info */}
            <div className="p-3">
              <div className="skeleton animate-skeleton bg-gray-200 h-5 w-full rounded mb-2"></div>
              <div className="skeleton animate-skeleton bg-gray-200 h-6 w-28 rounded mb-3 font-bold"></div>

              {/* Seller Info */}
              <div className="flex items-center mb-2">
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-4 rounded mr-2"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-32 rounded"></div>
              </div>

              {/* Location */}
              <div className="flex items-center mb-2">
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-4 rounded mr-2"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-28 rounded"></div>
              </div>

              {/* Sold Count */}
              <div className="mb-3">
                <div className="skeleton animate-skeleton bg-gray-200 h-4 w-16 rounded"></div>
              </div>

              {/* Add to Cart Button */}
              <div className="skeleton animate-skeleton bg-gray-200 h-10 w-full rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mx-6">
        <div className="flex gap-2">
          <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-md"></div>
        </div>
        <div className="flex items-center">
          <div className="skeleton animate-skeleton bg-gray-200 h-6 w-40 rounded mr-3"></div>
          <div className="flex gap-2">
            <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-md"></div>
            <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-md"></div>
            <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdAlbumSkeleton;
