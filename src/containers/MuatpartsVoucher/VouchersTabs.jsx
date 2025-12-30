import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { formatDateRange } from "@/libs/DateFormat";
import useVoucherMuatpartsStore from "@/store/useVoucherMuatpartsStore";
import { formatCurrency } from "@/utils/currency";
import React, { useState } from "react";

// Tab Button Component - Reusable for any tab interface with counters
const TabButton = ({ text, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-[10px] sm:text-sm font-semibold transition-colors min-w-fit ${
      isActive
        ? "bg-primary-50 text-primary-700 border border-primary-700"
        : "bg-neutral-200 text-black"
    }`}
  >
    <span>{text}</span>
    {count !== undefined && (
      <span className={`ml-1 ${isActive ? "text-primary-700" : ""}`}>
        ({count})
      </span>
    )}
  </button>
);

// Tabs Container - Generic and reusable tabs component
const Tabs = ({ tabs, defaultTab, renderContent }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className="h-full pb-8 sm:pb-0">
      {/* Tab Buttons */}
      <div className="flex space-x-3 px-6 sm:px-0 mt-3 sm:mx-4 overflow-x-scroll scrollbar-none">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            text={tab.label}
            count={tab.count}
            isActive={activeTab === tab.id}
            onClick={() => {setActiveTab(tab.id);
              // set scroll to top when tab changes
              const contentElement = document.getElementById("content-muatparts-vouchers");
              if (contentElement) {
                contentElement.scrollTo({ top: 0});
              }
            }}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div id="content-muatparts-vouchers" className="mt-4 px-4 scrollbar-none  flex flex-col flex-1 gap-4  h-full overflow-y-auto pb-20 sm:pb-72 max-h-[350px] sm:max-h-none">{renderContent(activeTab)}</div>
    </div>
  );
};

// Voucher Card Component - Extracted as a reusable component
const VoucherCard = ({
  voucher,
  activeTab,
  onClickDetail,
  handleUseVoucher,
  isSelected,
  error,
}) => {
  // Helper constants for readability
  const isShippingTab = activeTab === "shipping";
  const isPurchaseTab = activeTab === "purchase";

  const isError = Boolean(error && error.id === voucher.identification.id);

  // Conditional classes based on selection state
  const cardBorderClass = isSelected
    ? "bg-primary-50 border-primary-700"
    : isError
    ? "border-error-700"
    : "bg-white border-neutral-300";

  const dashedBorderClass = isSelected
    ? "border-primary-700 after:border-primary-700 before:border-primary-700"
    : isError
    ? "after:border-error-700 border-error-700 before:border-error-700"
    : "after:border-neutral-300 border-neutral-300 before:border-neutral-300";

  const dateTextClass = formatDateRange(
    voucher.period.startDate,
    voucher.period.endDate
  ).includes("Berakhir")
    ? "text-error-700"
    : "text-neutral-600";

  return (
    <>
      <div
        className={`flex flex-col relative rounded-md border border-solid ${cardBorderClass}`}
      >
        {/* Card Header */}
        <div className="flex relative items-center w-full pl-4 pr-2 pt-2 pb-2 gap-2.5">
          {/* Voucher Image */}
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1aea820f672fd9b16374ba94660630d13b187ef2e718ea7fd2387bfb30067d64"
            className="object-contain w-[64px] rounded aspect-square"
            alt="Cashback icon"
          />

          {/* Voucher Details */}
          <div className="flex flex-col flex-1">
            <div className="text-sm sm:text-[10px] text-black font-bold break-all line-clamp-1">
              {voucher.details.kodeVoucher}
            </div>

            {/* Voucher Terms */}
            <VoucherDetailsList voucher={voucher} activeTab={activeTab} />

            {/* Usage Progress Bar */}
            <div className="text-xs">
              <div className="bg-neutral-200 w-full h-2 rounded-full overflow-hidden py-px px-0.5">
                <div
                  className="bg-primary-500 h-full rounded-full"
                  style={{ width: `${voucher.usage.userPercentage}%` }}
                ></div>
              </div>
              <p className="mt-px text-[8px]">
                Terpakai{" "}
                <span className="font-bold">
                  {voucher.usage.userPercentage}%
                </span>
              </p>
            </div>
          </div>

          {/* Info Button */}
          <button
            type="button"
            className="self-start"
            onClick={() => onClickDetail(voucher, activeTab)}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/638933f567cf43d50a95ccdebbd68824143bf283cb86333ee9c8ecab035287b9"
              alt="Info"
              className="w-full h-full"
            />
          </button>
        </div>

        {/* Decorative Border with Circles */}
        <div
          className={`
          w-full border-neutral-300 border-t border-dashed relative z-100
          after:block after:h-5 after:w-5 after:bg-white after:border-r after:rounded-full after:absolute after:-top-[10px] after:-left-[10px] 
          before:block before:h-5 before:w-5 before:bg-white before:border-l before:rounded-full before:absolute before:-top-[10px] before:-right-[10px]
          ${dashedBorderClass}
        `}
        />

        {/* Card Footer */}
        <div className="h-8 flex px-4 my-auto w-full">
          {/* Validity Period */}
          <div
            className={`text-xs sm:text-[10px] font-medium self-center ${dateTextClass}`}
          >
            {formatDateRange(voucher.period.startDate, voucher.period.endDate)}
          </div>

          {/* Action Button */}
          <button
            className="text-xs font-bold ml-auto text-right text-primary-700"
            onClick={() => handleUseVoucher(voucher, activeTab)}
          >
            {isSelected ? "Dipakai" : "Pakai"}
          </button>
        </div>
      </div>

      {error?.id === voucher.identification.id && (
        <div className="text-xs text-error-700 mt-1">{error?.message}</div>
      )}
    </>
  );
};

// Voucher Details List Component - Extracted as a reusable component
const VoucherDetailsList = ({ voucher, activeTab }) => {
  const isShippingTab = activeTab === "shipping";
  const isPurchaseTab = activeTab === "purchase";
  const isPercentageDiscount = voucher.details.discountType === "percentage";

  const formatDiscount = (value) => {
    return isPercentageDiscount ? `${value}%` : `Rp${formatCurrency(value)}`;
  };

  return (
    <ul className="list-disc pl-3 text-[10px] h-[30px]">
      <li>
        Diskon {isShippingTab && "Ongkos Kirim"}{" "}
        {formatDiscount(voucher.details.discountValue)}
        {isPurchaseTab &&
          !voucher.details.isUnlimited &&
          " maks. potongan Rp" + formatCurrency(voucher.details.discountMax)}
      </li>
      {isPurchaseTab && (
        <li>Min. Transaksi Rp{formatCurrency(voucher.details.minPurchase)}</li>
      )}
    </ul>
  );
};

// Main Voucher Tabs Component
const VoucherTabsExample = ({ data, onClickDetail }) => {
  // State to track selected vouchers by type
  const {
    selectedVouchers,
    setSelectedVouchers,
    price,
    clearSelectedVouchers,
  } = useVoucherMuatpartsStore();

  const [error, setError] = useState();

  // Function to handle using a voucher
  const handleUseVoucher = (voucher, tabType) => {
    // Make a copy of the current selected vouchers
    const updatedSelection = { ...selectedVouchers };

    // If the voucher is already selected (in its category), deselect it
    if (
      selectedVouchers[tabType] &&
      selectedVouchers[tabType].details.kodeVoucher ===
        voucher.details.kodeVoucher
    ) {
      updatedSelection[tabType] = null;
    } else {
      // Select the new voucher for this category
      updatedSelection[tabType] = voucher;
    }

    if (price < voucher.details.minPurchase) {
      setError({
        id: voucher.identification.id,
        message: `Minimal transaksi Rp${formatCurrency(
          voucher.details.minPurchase
        )}`,
      });
      clearSelectedVouchers();
      return;
    }
    // Clear any previous error
    setError();
    // Update state
    setSelectedVouchers(updatedSelection);
  };

  // Define your tabs configuration
  const voucherTabs = [
    {
      id: "shipping",
      label: "Voucher Gratis Ongkir",
      count: data?.shipping.length,
    },
    {
      id: "purchase",
      label: "Voucher Transaksi",
      count: data?.purchase.length,
    },
  ];

  // Render content based on active tab
  const renderTabContent = (activeTab) => {
    const content = {
      shipping: {
        title: "Voucher Gratis Ongkir",
        vouchers: data?.shipping,
      },
      purchase: {
        title: "Voucher Transaksi",
        vouchers: data?.purchase,
      },
    };

    const selectedContent = content[activeTab];
    const hasVouchers =
      selectedContent.vouchers && selectedContent.vouchers.length > 0;

    return (
      <div className=" flex flex-col gap-4  ">
        {hasVouchers ? (
          selectedContent.vouchers.map((voucher, index) => {
            // Fixed check that handles null selectedVouchers[activeTab]
            const isSelected =
              selectedVouchers &&
              selectedVouchers[activeTab] &&
              selectedVouchers[activeTab].details.kodeVoucher ===
                voucher.details.kodeVoucher;

            const isLastIndex = index === selectedContent.vouchers.length - 1;

            return (
              <div
                key={index}
                className={`w-full max-w-[424px]  mx-auto ${
                  isLastIndex ? " " : ""
                }`}
              >
                <VoucherCard
                  voucher={voucher}
                  activeTab={activeTab}
                  onClickDetail={onClickDetail}
                  handleUseVoucher={handleUseVoucher}
                  isSelected={isSelected}
                  error={error}
                />
              </div>
            );
          })
        ) : (
          // Empty state when no vouchers are available
          <DataNotFound title="Keyword Tidak Ditemukan" classname="mt-11" />
        )}
      </div>
    );
  };

  return (
    <div className="h-full">
      <Tabs
        tabs={voucherTabs}
        defaultTab="shipping"
        renderContent={renderTabContent}
      />
    </div>
  );
};

export default VoucherTabsExample;
