import React, { useEffect, useState } from "react";
import { ChevronUp, Truck } from "lucide-react";
import { useCheckoutStore } from "@/store/checkout";
import Checkbox from "../Checkbox/Checkbox";
import { useLanguage } from "@/context/LanguageContext";

// 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0079
const SelectShippingOption = ({
  selected,
  isOpen = false,
  setIsOpen = () => {},
  options: initialOptions = [],
  onChange = () => {},
}) => {
  const { t } = useLanguage();
  const { checkPay } = useCheckoutStore();

  const [options, setOptions] = useState([]);

  useEffect(() => {
    // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0079
    if (
      initialOptions?.length !== 0 ||
      initialOptions?.pickup?.isActive ||
      initialOptions?.storeCourier?.isActive
    ) {
      // Create an array to store all shipping options
      let allOptions = [];

      // Add pickup option if active
      if (initialOptions?.pickup?.isActive) {
        allOptions.push({
          groupName: "Ambil Langsung",
          expeditions: [
            {
              id: "takeaway",
              courierName: "Ambil Langsung",
              minEstimatedDay: 0,
              maxEstimatedDay: 0,
              buyerCost: initialOptions.pickup.cost,
              buyerInsurance: 0,
              originalCost: initialOptions.pickup.cost,
              originalInsurance: 0,
              isPickup: true,
              mustUseInsurance: false,
            },
          ],
        });
      }

      // Add store courier option if active
      if (initialOptions?.storeCourier?.isActive) {
        allOptions.push({
          groupName: "Kurir Toko",
          expeditions: [
            {
              id: "store_courier",
              courierName: "Kurir Toko",
              minEstimatedDay: 1,
              maxEstimatedDay: 1,
              buyerCost: initialOptions.storeCourier.cost,
              buyerInsurance: 0,
              originalCost: initialOptions.storeCourier.cost,
              originalInsurance: 0,
              isStoreCourier: true,
              mustUseInsurance: false,
            },
          ],
        });
      }

      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0191
      if (initialOptions?.shippingExpeditions) {
        allOptions = [...allOptions, ...initialOptions.shippingExpeditions];
      }

      setOptions(allOptions);
    }
  }, [initialOptions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDeliveryDate = (minDays, maxDays) => {
    if (minDays === 0 && maxDays === 0) {
      return `${t("AppKomplainBuyerLabelEstimatedArrival")} hari ini`;
    }

    if (minDays === 1 && maxDays === 1) {
      return `${t("AppKomplainBuyerLabelEstimatedArrival")} besok`;
    }

    const today = new Date();
    const minDeliveryDate = new Date(today);
    const maxDeliveryDate = new Date(today);
    minDeliveryDate.setDate(today.getDate() + (minDays || 1));
    maxDeliveryDate.setDate(today.getDate() + (maxDays || 1));

    const dateFormatter = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    });

    const formattedMinDate = dateFormatter.format(minDeliveryDate);
    const formattedMaxDate = dateFormatter.format(maxDeliveryDate);

    return `${t("AppKomplainBuyerLabelEstimatedArrival")} ${
      minDays === 0 ? "hari ini" : formattedMinDate
    } - ${maxDays === 1 ? "besok" : formattedMaxDate}`;
  };

  const condition = () => {
    if (checkPay) {
      if (!selected) {
        return {
          text: "Opsi Pengiriman wajib diisi",
          class: "border-error-400",
        };
      }
    }

    return {
      text: "",
      class: "border-neutral-400",
    };
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-sm relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2 flex items-start justify-between text-gray-700 border rounded-md ${
            condition().class
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              {selected ? (
                <div className="flex-1">
                  <p className="font-medium text-xs text-left">
                    {selected.courierName} (
                    {formatDeliveryDate(
                      selected.minEstimatedDay,
                      selected.maxEstimatedDay
                    )}
                    )
                  </p>
                </div>
              ) : (
                <span className="font-medium text-xs">
                  Pilih Opsi Pengiriman
                </span>
              )}
            </div>
            {selected && !selected.isPickup && !selected.isStoreCourier && (
              <Checkbox
                checked={selected.isUseInsurance}
                disabled={selected.mustUseInsurance}
                label={
                  <div className="font-medium">
                    Pakai{" "}
                    <span className="text-primary-700">
                      {t("AppKelolaProdukMuatpartsTambahAsuransiPengiriman")}
                    </span>{" "}
                    ({formatCurrency(selected.buyerInsurance)})
                  </div>
                }
                onChange={(e) =>
                  onChange({
                    ...selected,
                    isUseInsurance: selected.mustUseInsurance || e.checked,
                  })
                }
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* price */}
            {selected && (
              <p className="font-medium text-xs">
                {formatCurrency(selected.buyerCost)}
              </p>
            )}
            {/* arrow */}
            <ChevronUp
              className={`w-5 h-5 transition-transform ${
                isOpen ? "" : "rotate-180"
              }`}
            />
          </div>
        </button>
        {isOpen && (
          <div className="mt-2 px-4 pt-3 absolute h-40 max-h-fit overflow-auto w-full bg-white shadow-sm z-10 border border-neutral-300 rounded-md">
            {options.map((group) => (
              <div key={group.groupName} className="first:mt-0 mt-2 last:mb-0">
                <h3 className="text-xs font-bold">{group.groupName}</h3>
                <div className="space-y-2">
                  {group.expeditions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onChange({
                          ...option,
                          isUseInsurance: option.mustUseInsurance,
                        });
                        setIsOpen(false);
                      }}
                      className={`w-full pl-4 py-3 rounded-lg transition-all ${
                        selected?.id === option.id
                          ? "border-blue-500 bg-white"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-left">
                            {option.courierName}
                          </p>
                          <p className="text-[10px] text-neutral-600 text-left">
                            {formatDeliveryDate(
                              option.minEstimatedDay,
                              option.maxEstimatedDay
                            )}
                          </p>
                        </div>
                        <p className="font-medium text-xs">
                          {formatCurrency(option.buyerCost)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {options.length === 0 && (
              <div className="pb-3 text-center font-medium text-xs">
                Tidak ada layanan tersedia
              </div>
            )}
          </div>
        )}
      </div>

      {condition().text && (
        <div className="text-xs font-medium text-error-400 !mt-1.5">
          {condition().text}
        </div>
      )}
    </>
  );
};

export default SelectShippingOption;
