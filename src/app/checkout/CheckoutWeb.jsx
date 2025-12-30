"use client";
import { useEffect, useMemo, useState } from "react";
import style from "./Checkout.module.scss";
import IconComponent from "@/components/IconComponent/IconComponent";
import OrderCard from "@/components/OrderCard/OrderCard";
import RingkasanPembayaran from "@/containers/RingkasanPembayaran/RingkasanPembayaran";
import { useLanguage } from "@/context/LanguageContext";
import ModalComponent from "@/components/Modals/ModalComponent";
import Button from "@/components/Button/Button";
import useVoucherMuatpartsStore from "@/store/useVoucherMuatpartsStore";

function CheckoutWeb({
  resDetailCheckout,
  dataShippingCost,
  supportingDataCheckoutDetail,
  paymentData,
  onClickPay,
}) {
  const { t } = useLanguage();
  const [detailCheckout, setDetailCheckout] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalHargaBeda, setModalHargaBeda] = useState(false);

  const { submittedVouchers, setPrice } = useVoucherMuatpartsStore();

  useEffect(() => {
    if (submittedVouchers?.shipping) {
      setDetailCheckout((prev) =>
        prev.map((item) => ({
          ...item,
          sellerVouchers: {
            ...item.sellerVouchers,
            shipping: null,
          },
        }))
      );
    }
  }, [submittedVouchers?.shipping]);

  useEffect(() => {
    if (resDetailCheckout.length) {
      const updatedDetailCheckout = resDetailCheckout.map((order) => {
        return {
          ...order,
          sellerVouchers: {
            purchase: order.usedVouchers?.dataUsedTransaction || null,
            shipping: order.usedVouchers?.dataUsedVoucher || null,
          },
          shippingOptions: order.shippingCost,
          selectedShipping: null,
        };
      });

      setDetailCheckout(updatedDetailCheckout);
      setLoading(false);
    }
  }, [resDetailCheckout]);

  useEffect(() => {
    if (!supportingDataCheckoutDetail?.checkPromo) {
      setModalHargaBeda(false);
    } else {
      setModalHargaBeda(true);
    }
  }, [supportingDataCheckoutDetail?.checkPromo]);

  const updateOrderItemExplicit = (orderIndex, field, newData) => {
    setDetailCheckout((prev) =>
      prev.map((item, index) => {
        if (index !== orderIndex) return item;

        switch (field) {
          // handle product note, products[0].notes
          case "product":
            return {
              ...item,
              products: item.products.map((product, prodIndex) => {
                if (prodIndex !== newData.index) return product;
                return {
                  ...product,
                  notes: newData.notes,
                };
              }),
            };
          case "shippingAddress":
            return {
              ...item,
              shippingAddress: { ...item.shippingAddress, ...newData },
            };
          case "shippingOptions":
            return {
              ...item,
              shippingOptions: { ...item.shippingOptions, ...newData },
            };
          case "selectedShipping":
            return {
              ...item,
              selectedShipping: newData,
            };
          case "sellerVouchers":
            return {
              ...item,
              sellerVouchers: newData,
            };
          default:
            return item;
        }
      })
    );
  };

  return (
    <div className={style.main}>
      <div className="flex gap-3 mb-4">
        <h1 className="text-xl font-bold">
          {t("AppMuatpartsDaftarPesananBuyerDetailPesanan")}
        </h1>
      </div>

      <div className="flex gap-2 items-center bg-secondary-100 px-6 py-4 rounded-md text-xs font-medium mb-4">
        <IconComponent
          width={20}
          height={20}
          icon="warning"
          src={"/icons/warning-outline.svg"}
          color="warning"
        />
        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 LB - 0826 */}
        <div className="">
          {/* Improvement fix wording pak Brian */}
          {t(
            "LabelcheckoutWebMohonpastikankembalipesanankamusudahsesuai.Iniadalahlangkahterakhirsebelumpembayaran."
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-[846px]">
          {loading ? (
            <>
              <div className="animate-pulse px-8 py-5 shadow-muatmuat rounded-xl space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </>
          ) : (
            detailCheckout?.map((order, index) => (
              <OrderCard
                order={order}
                orderIndex={index}
                key={index}
                updateOrderItemExplicit={updateOrderItemExplicit}
              />
            ))
          )}
        </div>

        <div className="w-[338px]">
          <RingkasanPembayaran
            orders={detailCheckout ?? []}
            applicationFee={supportingDataCheckoutDetail?.appFee}
            paymentData={paymentData}
            onClickPay={(val) => onClickPay(val)}
          />
        </div>
      </div>

      <ModalComponent
        isOpen={modalHargaBeda}
        setClose={() => setModalHargaBeda(false)}
      >
        <div className="w-[386px] text-center py-9 px-6 !font-medium !text-sm">
          <>{supportingDataCheckoutDetail?.checkPromo}</>
          <Button
            children="OK"
            Class="!h-8 !mx-auto !mt-6 !font-semibold"
            onClick={() => setModalHargaBeda(false)}
          />
        </div>
      </ModalComponent>
    </div>
  );
}

export default CheckoutWeb;
