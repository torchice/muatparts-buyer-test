import React from 'react';

const DaftarPesananSkeleton = () => {
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="skeleton animate-skeleton bg-gray-200 h-8 w-32 rounded font-bold"></div>
        <div className="skeleton animate-skeleton bg-gray-200 h-8 w-48 rounded-md"></div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-3">
        <div className="pb-2 px-4 border-b-2 relative">
          <div className="skeleton animate-skeleton bg-gray-200 h-6 w-24 rounded"></div>
        </div>
        <div className="pb-2 px-4">
          <div className="skeleton animate-skeleton bg-gray-200 h-6 w-28 rounded"></div>
        </div>
        <div className="pb-2 px-4">
          <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded"></div>
        </div>
        <div className="pb-2 px-4">
          <div className="skeleton animate-skeleton bg-gray-200 h-6 w-28 rounded"></div>
        </div>
        <div className="pb-2 px-4">
          <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded"></div>
        </div>
        <div className="pb-2 px-4">
          <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded"></div>
        </div>
      </div>
      
      {/* Order Cards - Repeat for multiple orders */}
      <div className="shadow-muatmuat p-6 rounded-xl">
        {/* Search Bar */}
      <div className="mb-6">
        <div className="skeleton animate-skeleton bg-gray-200 h-8 w-60 md:w-80 rounded-md"></div>
      </div>

        {[1, 2].map((index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
            {/* Order Header */}
            <div className="p-4 flex justify-between items-center">
              <div className="skeleton animate-skeleton bg-gray-200 h-6 w-48 rounded"></div>
              <div className="flex items-center">
                <div className="skeleton animate-skeleton bg-gray-200 h-6 w-40 rounded mr-4"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded-md"></div>
              </div>
            </div>
        
            {/* Order Item */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="skeleton animate-skeleton bg-gray-200 h-16 w-16 rounded-md mr-4"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded"></div>
              </div>
              <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded text-right"></div>
            </div>
        
            {/* Order Total */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <div className="skeleton animate-skeleton bg-gray-200 h-6 w-28 rounded font-bold"></div>
              <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded font-bold text-right"></div>
            </div>
        
            {/* Order Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-md mr-3"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded"></div>
                </div>
                <div className="flex">
                  <div className="skeleton animate-skeleton bg-gray-200 h-8 w-32 rounded-full mr-3 border"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-8 w-32 rounded-full"></div>
                </div>
              </div>
              <div className="skeleton animate-skeleton bg-gray-200 h-5 w-80 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaftarPesananSkeleton;