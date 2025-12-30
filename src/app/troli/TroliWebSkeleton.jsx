import React from 'react';

const TroliWebSkeleton = () => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-6">
      <div className="w-full max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-full"></div>
            <div className="skeleton animate-skeleton bg-gray-200 h-7 w-20 rounded font-bold text-xl"></div>
          </div>
        </div>
        {/* Main Content Wrapper - Split into two columns on desktop */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Cart Items */}
          <div className="lg:flex-1">
            {/* Select All Section */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-5 rounded"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-40 rounded text-blue-500"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-16 rounded text-red-500"></div>
                </div>
              </div>
            </div>
            {/* Store Section */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              {/* Store Header */}
              <div className="flex items-center mb-4">
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-5 rounded"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded ml-2"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-40 rounded ml-auto text-blue-500"></div>
              </div>
              {/* Shipping Address - From */}
              <div className="bg-gray-100 p-3 rounded-lg mb-3">
                <div className="flex items-center gap-2">
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-5 rounded-full"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-64 rounded"></div>
                </div>
              </div>
              {/* Shipping Address - To */}
              <div className="border border-gray-200 p-3 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="skeleton animate-skeleton bg-gray-200 h-5 w-5 rounded-full"></div>
                    <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded"></div>
                  </div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-48 rounded text-blue-500"></div>
                </div>
              </div>
              {/* Product Item */}
              <div className="py-4 border-t border-gray-200">
                <div className="flex items-start">
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-5 rounded mt-2 mr-3"></div>
                  <div className="flex-shrink-0">
                    <div className="skeleton animate-skeleton bg-gray-200 h-20 w-20 rounded"></div>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between">
                      <div className="skeleton animate-skeleton bg-gray-200 h-5 w-72 rounded mb-2"></div>
                      <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded font-bold text-right"></div>
                    </div>
                    <div className="flex justify-between items-end mt-6">
                      <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded text-blue-500"></div>
                      <div className="flex items-center">
                        <div className="flex mr-4">
                          <div className="skeleton animate-skeleton bg-gray-200 h-6 w-6 rounded-full mr-3"></div>
                          <div className="skeleton animate-skeleton bg-gray-200 h-6 w-6 rounded-full"></div>
                        </div>
                        <div className="flex items-center border-gray-300 rounded-md h-8 w-28 animate-skeleton bg-gray-200">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column - Order Summary */}
          <div className="lg:w-80">
            <div className="bg-white p-4 rounded-lg shadow sticky top-4">
              {/* Title */}
              <div className="skeleton animate-skeleton bg-gray-200 h-6 w-40 rounded mb-6"></div>
      
              {/* Summary Details */}
              <div className="flex justify-between mb-2">
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-48 rounded"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded text-right"></div>
              </div>
              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>
              {/* Total */}
              <div className="flex justify-between mb-6">
                <div className="skeleton animate-skeleton bg-gray-200 h-6 w-20 rounded font-bold"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded font-bold text-right"></div>
              </div>
              {/* Button */}
              <div className="skeleton animate-skeleton bg-gray-200 h-12 w-full rounded-full text-white font-medium"></div>
            </div>
          </div>
        </div>

        {/* Last You Seen Section */}
      <div className="mb-8 max-w-[1080px] mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          <div className="skeleton animate-skeleton bg-gray-200 h-8 w-40 rounded"></div>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Product Card Skeleton - Repeated 5 times */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Image with Heart Icon */}
              <div className="relative">
                <div className="skeleton animate-skeleton bg-gray-200 h-40 w-full"></div>
                <div className="absolute top-2 right-2">
                  <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-full"></div>
                </div>
                {/* Optional label */}
                {index % 2 === 1 && (
                  <div className="absolute bottom-2 left-2">
                    <div className="skeleton animate-skeleton bg-gray-200 h-5 w-36 rounded"></div>
                  </div>
                )}
              </div>
              
              {/* Quality Tag */}
              <div className="p-2">
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
              </div>
              
              {/* Product Info */}
              <div className="p-3">
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded mb-2"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-6 w-28 rounded-lg mb-3 font-bold"></div>
                
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
                
                {/* Rating */}
                <div className="flex items-center">
                  <div className="skeleton animate-skeleton bg-gray-200 h-4 w-4 rounded mr-2"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-4 w-16 rounded mr-2"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-4 w-20 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default TroliWebSkeleton;