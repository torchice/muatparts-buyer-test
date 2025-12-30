import React from 'react';

const IdPesananSkeleton = () => {
  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <div className="skeleton animate-skeleton bg-gray-200 h-5 w-20 rounded"></div>
        <div className="skeleton animate-skeleton bg-gray-200 h-5 w-3 rounded"></div>
        <div className="skeleton animate-skeleton bg-gray-200 h-5 w-40 rounded"></div>
        <div className="skeleton animate-skeleton bg-gray-200 h-5 w-3 rounded"></div>
        <div className="skeleton animate-skeleton bg-gray-200 h-5 w-28 rounded"></div>
      </div>
      
      {/* Page Title */}
      <div className="flex items-center mb-6">
        <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-full mr-3"></div>
        <div className="skeleton animate-skeleton bg-gray-200 h-8 w-36 rounded font-bold"></div>
      </div>
      
      {/* Order Status Card */}
      <div className="bg-white rounded-lg shadow-muatmuat p-4 mb-6">
        <div className="flex items-center">
          <div className="skeleton animate-skeleton bg-gray-200 h-12 w-12 rounded-full mr-4"></div>
          <div>
            <div className="skeleton animate-skeleton bg-gray-200 h-6 w-36 rounded mb-2"></div>
            <div className="skeleton animate-skeleton bg-gray-200 h-5 w-80 rounded"></div>
          </div>
        </div>
      </div>
      
      {/* Main Content Wrapper - Split into two columns on desktop */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:flex-1">
          <div className="bg-white rounded-lg shadow-muatmuat p-4 mb-6">
            {/* Order Info Section */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4">
                <div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded mb-2 text-gray-500"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-40 rounded"></div>
                </div>
                <div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-28 rounded mb-2 text-gray-500"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded"></div>
                </div>
                <div className="flex justify-start md:justify-end">
                  <div className="skeleton animate-skeleton bg-gray-200 h-8 w-40 rounded-md"></div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded mb-2 text-gray-500"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded"></div>
                </div>
                <div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-28 rounded mb-2 text-gray-500"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 py-4">
              <div className="grid grid-cols-1 gap-y-4">
                <div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded mb-2 text-gray-500"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-full md:w-3/4 rounded mb-1"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-full md:w-2/3 rounded mb-1"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-full md:w-1/2 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Product Item */}
            <div className="border-t border-gray-200 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="skeleton animate-skeleton bg-gray-200 h-16 w-16 rounded-full mr-4"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded"></div>
                </div>
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded text-right"></div>
              </div>
            </div>
            
            {/* Payment Details */}
            <div className="border-t border-gray-200 pt-6">
              <div className="skeleton animate-skeleton bg-gray-200 h-6 w-40 rounded mb-4 font-bold"></div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-48 rounded"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-28 rounded text-right"></div>
                </div>
                <div className="flex justify-between">
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-64 rounded"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded text-right"></div>
                </div>
                <div className="flex justify-between">
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-40 rounded"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-20 rounded text-right"></div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 py-4">
                <div className="flex justify-between items-center">
                  <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded font-bold"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded font-bold text-right"></div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-20 rounded text-right"></div>
                </div>
                <div className="flex justify-between">
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-36 rounded"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-20 rounded text-right"></div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 py-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded font-bold"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded font-bold text-right"></div>
                </div>
                
                <div className="flex justify-between">
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-36 rounded"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-40 rounded text-right"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Order Timeline and Actions */}
        <div className="lg:w-80">
          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-muatmuat p-4 mb-6">
            <div className="relative">
              {/* Timeline Item 1 */}
              <div className="flex mb-6">
                <div className="mr-3">
                  <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-full"></div>
                  <div className="h-full w-0.5 bg-gray-200 mx-auto mt-2"></div>
                </div>
                <div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded mb-1"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-40 rounded mb-1"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-48 rounded"></div>
                </div>
              </div>
              
              {/* Timeline Item 2 */}
              <div className="flex">
                <div className="mr-3">
                  <div className="skeleton animate-skeleton bg-gray-200 h-8 w-8 rounded-full"></div>
                </div>
                <div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-32 rounded mb-1"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-40 rounded mb-1"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-36 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="skeleton animate-skeleton bg-gray-200 h-12 w-full rounded-full"></div>
            <div className="skeleton animate-skeleton bg-gray-200 h-12 w-full rounded-full"></div>
            <div className="skeleton animate-skeleton bg-gray-200 h-12 w-full rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdPesananSkeleton;