import React from 'react';

const AlbumSkeleton = () => {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4">
      {/* Album Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          <div className="skeleton animate-skeleton bg-gray-200 h-8 w-28 rounded"></div>
        </h2>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-3 gap-4">
            {/* Album Card 1 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-[190px] w-full flex">
                <div className="w-full">
                  <div className="skeleton animate-skeleton bg-gray-200 h-full w-full"></div>
                </div>
                {/* <div className="w-1/2">
                  <div className="skeleton animate-skeleton bg-gray-200 h-full w-full"></div>
                </div> */}
              </div>
              <div className="p-4">
                <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded mb-2"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
              </div>
            </div>
            
            {/* Album Card 2 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-[190px] w-full flex items-center justify-center">
                <div className="text-center">
                  <div className="skeleton animate-skeleton bg-gray-200 h-16 w-16 rounded-full mx-auto mb-4"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-5 w-40 rounded mx-auto"></div>
                </div>
              </div>
              <div className="p-4">
                <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded mb-2"></div>
                <div className="skeleton animate-skeleton bg-gray-200 h-5 w-24 rounded"></div>
              </div>
            </div>
            
            {/* New Album Card */}
            <div className="border border-gray-200 border-dashed rounded-lg overflow-hidden">
              <div className="h-[190px] w-full flex items-center justify-center">
                <div className="text-center">
                  <div className="skeleton animate-skeleton bg-gray-200 h-10 w-10 rounded-full mx-auto mb-3"></div>
                  <div className="skeleton animate-skeleton bg-gray-200 h-6 w-32 rounded mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Last You Seen Section */}
      <div className="mb-8">
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
  );
};

export default AlbumSkeleton;