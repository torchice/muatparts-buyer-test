// FIX BUG Pengecekan Ronda Muatparts LB-0065
import VoucherCard from '@/containers/Seller/Component/VoucherCard';
import { useState } from 'react';

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const VoucherSlider = ({ sellerVouchers, setIsVoucherDetailModalOpen, setSelectedVoucher, onRefreshVoucher }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4; //5;
  const voucherWidth = 290; //229; // Width of each voucher
  const gapWidth = 16; // Gap between vouchers (gap-4 = 16px)

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      Math.min(sellerVouchers.length - itemsPerPage, prevIndex + 1)
    );
  };

  const handleSelectVoucher = voucher => {
		setSelectedVoucher(voucher);
		setIsVoucherDetailModalOpen(true);
	};

  const showLeftButton = currentIndex > 0;
  const showRightButton = currentIndex < sellerVouchers.length - itemsPerPage;

  const translateX = currentIndex * (voucherWidth + gapWidth);

  return (
    <>
      <div className="relative" style={{ width: `${(voucherWidth + gapWidth) * itemsPerPage - gapWidth}px` }}>
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out gap-x-4"
            style={{ transform: `translateX(-${translateX}px)` }}
          >
            {sellerVouchers.map((item, key) => {
              const voucher = {
                ...item,
                // LBM - OLIVER - FIX PENGGUNAAN PROPERTY DARI API VOUCHER - MP - 020
                usageCount: Number(item.usageCount),
                usageQuota: item.usage_quota,
              }
              return (
                <div className="min-w-[293px]" key={key}>
                  <VoucherCard
                    voucher={voucher}
                    onClickDetail={handleSelectVoucher}
                    onRefreshVoucher={onRefreshVoucher}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation buttons */}
        {sellerVouchers.length > itemsPerPage && (
          <>
            {showLeftButton && (
              <button
                onClick={handlePrevious}
                className="absolute left-0 shadow-muat top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 hover:bg-gray-50"
                aria-label="Previous voucher"
              >
                <ChevronLeft />
              </button>
            )}
            {showRightButton && (
              <button
                onClick={handleNext}
                className="absolute right-[16px] shadow-muat top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 hover:bg-gray-50"
                aria-label="Next voucher"
              >
                <ChevronRight />
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default VoucherSlider;