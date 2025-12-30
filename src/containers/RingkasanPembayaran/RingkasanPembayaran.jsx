"use client";

import Button from "@/components/Button/Button";
import ModalComponent from "@/components/Modals/ModalComponent";
import PaymentOption from "@/components/PaymentOption/PaymentOption";
import { numberFormatMoney } from "@/libs/NumberFormat";
import { ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import DropshipForm from "./DropshipForm";
import { useCheckoutStore } from "@/store/checkout";
import { getVoucherValue } from "@/libs/voucher";
import { useLanguage } from "@/context/LanguageContext";
import MuatpartsVoucher from "../MuatpartsVoucher/MuatpartsVoucher";
import UsedVoucherList, {
  calculateVoucherValue,
} from "../MuatpartsVoucher/UsedVoucherList";
import useVoucherMuatpartsStore from "@/store/useVoucherMuatpartsStore";
import { extractVoucherIDs } from "@/utils/voucher";

function RingkasanPembayaran({
  orders: initialOrders,
  applicationFee,
  paymentData,
  onClickPay,
}) {
  const { t } = useLanguage();
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    if (initialOrders) setOrders(initialOrders);
  }, [initialOrders]);

  const { setCheckPay } = useCheckoutStore();
  const { submittedVouchers, setPrice, setOngkir } = useVoucherMuatpartsStore();

  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isDropship, setIsDropship] = useState(false);
  const [dropshipValues, setDropshipValues] = useState({
    name: "",
    phone: "",
  });
  const [dropshipErrors, setDropshipErrors] = useState({
    name: "",
    phone: "",
  });

  const totalProductCount = orders.reduce(
    (acc, order) => acc + order.countProduct,
    0
  );

  const totalProductPrice = orders.reduce(
    (acc, order) => acc + order.totalAmount,
    0
  );

  const totalSellerPurchaseVouchers =
    orders.reduce((total, order) => {
      let voucherValue = 0;
      if (order.sellerVouchers?.purchase) {
        voucherValue += getVoucherValue(
          order.sellerVouchers?.purchase,
          totalProductPrice
        );
      }
      return total + voucherValue;
    }, 0) || 0;

  const totalShippingCost = orders.reduce((acc, order) => {
    const shippingCost = order.selectedShipping?.buyerCost || 0;
    return acc + shippingCost;
  }, 0);

  const totalSellerShippingVouchers =
    orders.reduce((total, order) => {
      let voucherValue = 0;
      if (order.sellerVouchers?.shipping) {
        voucherValue += getVoucherValue(
          order.sellerVouchers?.shipping,
          order.selectedShipping?.buyerCost || 0
        );
      }
      return total + voucherValue;
    }, 0) || 0;

  useMemo(() => {
    setOngkir(totalShippingCost);
  }, [totalShippingCost]);

  const totalMuatpartsShippingVouchers = calculateVoucherValue(
    submittedVouchers.shipping,
    totalShippingCost
  );

  const totalInsuranceCost = orders.reduce((acc, order) => {
    if (order.selectedShipping?.isUseInsurance) {
      return acc + (order.selectedShipping.buyerInsurance || 0);
    }
    return acc;
  }, 0);

  const finalOngkir = totalShippingCost - totalMuatpartsShippingVouchers - totalSellerShippingVouchers;

  const appFee = applicationFee || 0;
  const adminFee = selectedPayment ? +selectedPayment.fee : 0;

  useEffect(() => {
    if (orders.length) {
      setLoading(false);
    }
  }, [orders]);

  const checkDropshipValues = (e) => {
    setDropshipValues(e);
  };

  const checkBeforePay = () => {
    const hasNoShippingCost = orders.some(
      (order) =>
        !order.selectedShipping ||
        Object.keys(order.selectedShipping).length === 0
    );

    if (isDropship) {
      const errors = {
        name: "",
        phone: "",
      };

      // Validate dropship fields
      if (!dropshipValues.name || dropshipValues.name.trim() === "") {
        // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734
        errors.name = t("LabelcheckoutRingkasanPembayaranNamaPengirimwajibdiisi");
      }

      if (!dropshipValues.phone || dropshipValues.phone.trim() === "") {
        // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734
        errors.phone = t("LabelcheckoutRingkasanPembayaranNomorTeleponwajibdiisi");
      }

      // Set the errors
      setDropshipErrors(errors);

      // Check if there are any errors
      if (errors.name || errors.phone) {
        setCheckPay(true);
        return;
      }
    }

    if (hasNoShippingCost) {
      setCheckPay(true);
    } else {
      onClickPay(fromPayment);
      setCheckPay(false);
    }
  };

  // console.log("summary", summary);

  const mappedVoucherIDs = extractVoucherIDs(submittedVouchers);

  const afterSellerPurchaseVoucher = Math.max(
    0,
    totalProductPrice - totalSellerPurchaseVouchers
  );

  const totalMuatpartsPurchaseVouchers = calculateVoucherValue(
    submittedVouchers.purchase,
    afterSellerPurchaseVoucher
  );

  const afterMuatpartsPurchaseVoucher =
    afterSellerPurchaseVoucher - totalMuatpartsPurchaseVouchers;

  const ultimatePayment =
    afterMuatpartsPurchaseVoucher +
    finalOngkir +
    totalInsuranceCost +
    appFee +
    adminFee;

  console.log("penting", {
    "0 orders": orders,
    "1 total awal": totalProductPrice,
    "2 total voucher penjual": totalSellerPurchaseVouchers,
    "3 total setelah voucher penjual": afterSellerPurchaseVoucher,
    "4 total voucher muatparts": totalMuatpartsPurchaseVouchers,
    "5 total setelah voucher muatparts": afterMuatpartsPurchaseVoucher,

    "a total ongkir": totalShippingCost,
    "b total voucher ongkir penjual": totalSellerShippingVouchers,
    "c total voucher ongkir muatparts": totalMuatpartsShippingVouchers,
    "d total ongkir akhir": finalOngkir,

    "e total asuransi": totalInsuranceCost,
    "f total biaya aplikasi": appFee,
    "g total biaya admin": adminFee,
    "z total pembayaran akhir": ultimatePayment,
  });

  const fromPayment = {
    selectedPayment,
    totalPayment: afterMuatpartsPurchaseVoucher,
    orders,
    totalSelectedItems: totalProductCount,
    totalPrice: totalProductPrice,
    totalShippingCost: totalShippingCost,
    isDropship,
    dropshipValues,
    mappedVoucherIDs,
  };

  useMemo(() => {
    setPrice(afterSellerPurchaseVoucher);
  }, [afterSellerPurchaseVoucher]);

  return (
    <>
      <div className="rounded-xl shadow-muatmuat px-5 py-6 space-y-6">
        {loading ? (
          <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
        ) : (
          // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734
          <div className="font-bold">{t("LabelcheckoutRingkasanPembayaranRingkasanPembayaran")}</div>
        )}
        {loading ? (
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
        ) : (
          <MuatpartsVoucher />
        )}
        {loading ? (
          <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
        ) : (
          <div className="font-semibold text-sm">
            {t("labelRingkasanPesanan")}
          </div>
        )}

        <div className="flex justify-between text-xs font-medium">
          {loading ? (
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
          ) : (
            <div className="w-[148px] text-neutral-600">
              {t("labelTotalHarga")} ({totalProductCount}{" "}
              {t("BuyerIndexProduk")})
            </div>
          )}

          {loading ? (
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
          ) : (
            <div className="text-right">
              {numberFormatMoney(totalProductPrice)}
            </div>
          )}
        </div>

        <div className="flex justify-between text-xs font-medium">
          {loading ? (
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
          ) : (
            <div className="w-[148px] text-neutral-600">
              {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734 */}
              {t("LabelcheckoutRingkasanPembayaranTotalBiayaPengiriman")}
            </div>
          )}
          {loading ? (
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
          ) : (
            <div className="text-right">
              {numberFormatMoney(totalShippingCost)}
            </div>
          )}
        </div>

        {orders.some((order) => order.selectedShipping?.isUseInsurance) && (
          <diviv className="flex justify-between text-xs font-medium">
            <div className="w-[148px] text-neutral-600">
              Total {t("AppKelolaProdukMuatpartsTambahAsuransiPengiriman")}
            </div>
            <div className="text-right">
              {numberFormatMoney(totalInsuranceCost)}
            </div>
          </diviv>
        )}

        {!loading &&
          orders.map(
            (item, index) =>
              item.sellerVouchers?.purchase?.uuid && (
                <div
                  key={index}
                  className="flex justify-between text-xs font-medium"
                >
                  <div className="w-[148px] text-neutral-600">
                    <span>{t("AppMuatpartsDashboardSellerVoucher")} : </span>
                    <span className="inline-block max-w-[80px] truncate align-bottom">
                      {item.sellerVouchers?.purchase.kode}
                    </span>
                  </div>
                  <div className="text-right text-error-400">
                    -
                    {numberFormatMoney(
                      getVoucherValue(
                        item.sellerVouchers?.purchase,
                        totalProductPrice
                      )
                    )}
                  </div>
                </div>
              )
          )}
        {!loading &&
          orders.map(
            (item, index) =>
              item.sellerVouchers?.shipping?.uuid && (
                <div
                  key={index}
                  className="flex justify-between text-xs font-medium"
                >
                  <div className="w-[148px] text-neutral-600">
                    <span>{t("AppMuatpartsDashboardSellerVoucher")} : </span>
                    <span className="inline-block max-w-[80px] truncate align-bottom">
                      {item.sellerVouchers?.shipping.kode}
                    </span>
                  </div>
                  <div className="text-right text-error-400">
                    -
                    {numberFormatMoney(
                      getVoucherValue(
                        item.sellerVouchers?.shipping,
                        item.selectedShipping?.buyerCost || 0
                      )
                    )}
                  </div>
                </div>
              )
          )}

        {!loading && (
          <UsedVoucherList
            voucherData={submittedVouchers}
            purchaseAmount={afterSellerPurchaseVoucher}
            shippingCostAmount={totalShippingCost}
          />
        )}

        {!loading && (
          <>
            <div className="border-[0.5px] border-neutral-400"></div>
            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734 */}
            <div className="font-semibold text-sm">{t("LabelcheckoutRingkasanPembayaranBiayaLainnya")}</div>
            <div className="flex justify-between text-xs font-medium">
              {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734 */}
              <div className="w-[148px] text-neutral-600">{t("LabelcheckoutRingkasanPembayaranBiayaAplikasi")}</div>
              {loading ? (
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
              ) : (
                numberFormatMoney(appFee)
              )}
            </div>
            <div className="flex justify-between text-xs font-medium">
              <div className="w-[148px] text-neutral-600">
                {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734 */}
                {t("LabelcheckoutRingkasanPembayaranBiayaAdministrasi")}
              </div>
              {loading ? (
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
              ) : selectedPayment ? (
                numberFormatMoney(adminFee)
              ) : (
                "-"
              )}
            </div>
          </>
        )}
        <div className="border-[0.5px] border-neutral-400"></div>
        <div className="flex justify-between font-bold">
          {loading ? (
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
          ) : (
            <div>{t("SubscriptionTotal")}</div>
          )}

          {loading ? (
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
          ) : (
            numberFormatMoney(ultimatePayment)
          )}
        </div>
        <div className="border-[0.5px] border-neutral-400"></div>

        <DropshipForm
          onUpdateValues={checkDropshipValues}
          dropshipValues={dropshipValues}
          errorsValues={dropshipErrors}
          isDropship={isDropship}
          setIsDropship={setIsDropship}
          loading={loading}
        />

        {selectedPayment && (
          <button
            className="w-full border flex gap-2 p-3 items-center rounded-md border-neutral-400"
            onClick={() => setIsOpenPayment(true)}
          >
            <img
              loading="lazy"
              src={selectedPayment.icon}
              alt={`${selectedPayment.name} icon`}
              className="object-contain shrink-0 w-8 h-8"
            />
            <div className="flex-1 text-left text-xs font-medium line-clamp-1">
              {selectedPayment.name}
            </div>
            <ChevronRight size={16} />
          </button>
        )}

        {selectedPayment ? (
          <Button Class="!max-w-full !w-full" onClick={() => checkBeforePay()}>
            {t("HomeLabelButtonPay")}
          </Button>
        ) : loading ? (
          <div className="h-9 bg-gray-200 rounded w-full animate-pulse"></div>
        ) : (
          <Button
            Class="!max-w-full !w-full"
            onClick={() => setIsOpenPayment(true)}
          >
            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734 */}
            {t("LabelcheckoutRingkasanPembayaranPilihOpsiPembayaran")}
          </Button>
        )}
      </div>

      <ModalComponent
        isOpen={isOpenPayment}
        setClose={() => setIsOpenPayment(false)}
        hideHeader
        classnameContent={"!w-[472px] !h-[412px]"}
      >
        <PaymentOption
          paymentData={paymentData}
          onOptionSelect={(val) => {
            setSelectedPayment(val);
            setIsOpenPayment(false);
          }}
        />
      </ModalComponent>
    </>
  );
}

export default RingkasanPembayaran;
