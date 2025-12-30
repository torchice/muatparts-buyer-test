import React from 'react';

const DetailProdukSkeleton = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Container with max width */}
      <div className="w-full max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="skeleton animate-skeleton bg-gray-200 h-4 w-16 rounded"></div>
          <div className="skeleton animate-skeleton bg-gray-200 h-4 w-4 rounded-full"></div>
          <div className="skeleton animate-skeleton bg-gray-200 h-4 w-32 rounded"></div>
          <div className="skeleton animate-skeleton bg-gray-200 h-4 w-4 rounded-full"></div>
          <div className="skeleton animate-skeleton bg-gray-200 h-4 w-24 rounded"></div>
        </div>

        {/* Vehicle Selection and Check Compatibility */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center gap-4">
            <div className="skeleton animate-skeleton bg-gray-200 h-10 w-64 rounded-md"></div>
            <div className="skeleton animate-skeleton bg-gray-200 h-10 w-40 rounded-md"></div>
            <div className="ml-auto skeleton animate-skeleton bg-gray-200 h-8 w-32 rounded-md"></div>
          </div>
        </div>

        {/* Main Content Wrapper - Split into two columns on desktop */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Product Details */}
          <div className="lg:flex-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-row gap-6">
                {/* Product Image */}
                <div className="w-2/3">
                  <div className="skeleton animate-skeleton bg-gray-200 h-80 w-full rounded-lg mb-2"></div>
                  <div className="flex justify-center mt-2">
                    <div className="skeleton animate-skeleton bg-gray-200 h-16 w-16 rounded-md"></div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="w-2/3">
                  {/* Product Title and Rating */}
                  <div className="skeleton animate-skeleton bg-gray-200 h-8 w-64 rounded mb-2"></div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="skeleton animate-skeleton bg-gray-200 h-4 w-16 rounded"></div>
                    <div className="skeleton animate-skeleton bg-gray-200 h-4 w-24 rounded"></div>
                  </div>

                  {/* Price */}
                  <div className="skeleton animate-skeleton bg-gray-200 h-10 w-40 rounded mb-6"></div>

                  <div className="border-t border-b py-4 my-4">
                    {/* Product Attributes */}
                    <div className="grid grid-cols-2 gap-y-4">
                      <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
                      <div className="skeleton animate-skeleton bg-gray-200 h-5 w-16 rounded"></div>

                      <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
                      <div className="skeleton animate-skeleton bg-gray-200 h-5 w-20 rounded"></div>

                      <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
                      <div className="skeleton animate-skeleton bg-gray-200 h-5 w-12 rounded"></div>

                      <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
                      <div className="skeleton animate-skeleton bg-gray-200 h-5 w-16 rounded"></div>
                    </div>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="skeleton animate-skeleton bg-gray-200 h-12 w-12 rounded-full"></div>
                    <div>
                      <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded mb-2"></div>
                      <div className="skeleton animate-skeleton bg-gray-200 h-4 w-16 rounded"></div>
                    </div>
                    <div className="skeleton animate-skeleton bg-gray-200 h-4 w-24 rounded ml-auto"></div>
                  </div>

                  {/* Location and Operational Hours */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="skeleton animate-skeleton bg-gray-200 h-5 w-5 rounded-full"></div>
                    <div className="skeleton animate-skeleton bg-gray-200 h-5 w-48 rounded"></div>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <div className="skeleton animate-skeleton bg-gray-200 h-5 w-5 rounded-full"></div>
                    <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded"></div>
                    <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
                  </div>

                  {/* Shipping Options */}
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-40 rounded mb-3"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-12 w-full rounded-md mb-3"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-48 rounded mb-6"></div>

                  {/* Report Button */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded"></div>
                    <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action Card */}
          <div className="lg:w-80">
            <div className="bg-white p-4 rounded-lg shadow sticky top-4">
              {/* Title */}
              <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded mb-4"></div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-4">
                <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded"></div>
              </div>

              {/* Available Items */}
              <div className="flex justify-between mb-4">
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-16 rounded"></div>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between mb-6">
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded"></div>
              </div>

              {/* Action Buttons */}
              <div className="skeleton animate-skeleton bg-gray-200 h-10 w-full rounded-md mb-3"></div>
              <div className="skeleton animate-skeleton bg-gray-200 h-10 w-full rounded-md mb-4"></div>

              {/* Additional Options Text */}
              <div className="skeleton animate-skeleton bg-gray-200 h-5 w-full rounded mb-4"></div>

              {/* Action Icons */}
              <div className="flex justify-around">
                <div className="skeleton animate-skeleton bg-gray-200 h-8 w-24 rounded"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-8 w-24 rounded"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-8 w-24 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProdukSkeleton;