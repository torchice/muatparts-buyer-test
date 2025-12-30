"use client";
import { viewport } from "@/store/viewport";
import React, { useEffect, useState } from "react";
import CheckoutResponsive from "./CheckoutResponsive";
import CheckoutWeb from "./CheckoutWeb";
import SWRHandler from "@/services/useSWRHook";
import { useCheckoutStore } from "@/store/checkout";
import { useCustomRouter } from "@/libs/CustomRoute";
import toast from "@/store/toast";
import Modal from "@/components/Modals/modal";
import { authZustand } from "@/store/auth/authZustand";
import axios from "axios";
import { mapOrderData } from "./helper";
import { isValidJSON } from "@/utils/Helper";
import useVoucherMuatpartsStore from "@/store/useVoucherMuatpartsStore";
import { useSearchParams } from "next/navigation";

function Checkout() {
  const CHECKOUT_DETAIL_ENDPOINT =
    process.env.NEXT_PUBLIC_GLOBAL_API + "v1/muatparts/order/checkout/detail";

  const PAYMENT_OPTIONS_ENDPOINT =
    process.env.NEXT_PUBLIC_PAY_API + "v1/payment/methods";

  const ORDER_PAYMENT_ENPOINT =
    process.env.NEXT_PUBLIC_GLOBAL_API + "v1/muatparts/buyer/orders/buy";

  const token = authZustand();

  const router = useCustomRouter();
  const [modalValidasi, setModalValidasi] = useState(false);

  const { buyNow, resetBuyNow, setCheckPay } = useCheckoutStore();
  const { submittedVouchers, clearSubmitedVouchers, literallyClearAll } =
    useVoucherMuatpartsStore();

  const { setShowToast, setDataToast } = toast();

  const { useSWRHook, useSWRMutateHook } = SWRHandler();

  const {
    data: resCheckoutDetail,
    trigger: triggerCheckoutDetail,
    error: errorCheckout,
    isMutating: isLoadingCheckout,
  } = useSWRMutateHook(CHECKOUT_DETAIL_ENDPOINT, "POST");

  const { data: resOrderPayment, trigger: triggerOrderPayment } =
    useSWRMutateHook(ORDER_PAYMENT_ENPOINT, "POST");

  const { data: resPaymentOptions } = useSWRHook(
    PAYMENT_OPTIONS_ENDPOINT,
    (url, arg) => {
      return axios({
        url,
        method: "GET",
        data: arg,
        headers: {
          Authorization: `Bearer ${token?.accessToken}`,
          refreshToken: token?.refreshToken,
        },
      });
    }
  );

  const [validateMake, setValidateMake] = useState({
    title: "",
    desc: "",
  });

  const handleOnClickPay = (val) => {
    const body = mapOrderData(val);
    triggerOrderPayment(body).catch((err) => {
      const message = err?.response?.data?.Data?.Message
        ? err?.response?.data?.Data?.Message
        : err?.response?.data?.Data[0].msg
        ? err?.response?.data?.Data[0].msg
        : "Terjadi kesalahan saat memproses pembayaran";

      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 LB - 0415 LB - 0416
      if (isValidJSON(message)) {
        setValidateMake({
          title: JSON.parse(message).title,
          desc: JSON.parse(message).body,
        });
      } else {
        setValidateMake({
          title: "",
          desc: message,
        });
      }
      setModalValidasi(true);
      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0395
      resetBuyNow();
      clearSubmitedVouchers();
    });
  };

  const params = useSearchParams();
  const from = params.get("from");

  useEffect(() => {
    setCheckPay(false);
    if (buyNow.length === 0) {
      setDataToast({
        type: "error",
        message:
          "Halaman Checkout anda kosong, anda akan dialihkan ke halaman sebelumnya",
      });
      setShowToast(true);
      setTimeout(() => {
        router.back();
      }, 3000);
    } else {
      const payload = {
        cart: buyNow,
        usedVoucherShippingMP: submittedVouchers.shipping,
        usedVoucherPurchaseMP: submittedVouchers.purchase,
      };
      triggerCheckoutDetail(payload).finally(() => {
        // 25. 15 - QC Plan - Web - Imp Voucher muatparts - LB - 0024
        if (from !== "troli") literallyClearAll();
      });
    }
  }, []);

  useEffect(() => {
    if (resOrderPayment?.data.Message.Code === 200) {
      router.push(
        "/daftarpesanan/" +
          resOrderPayment.data.Data.orderID +
          `${
            resOrderPayment.data.Data.paymentStatus === "pending"
              ? "?page=menunggu_pembayaran"
              : ""
          }`
      );
    }
  }, [resOrderPayment]);

  const { isMobile } = viewport();
  if (typeof isMobile !== "boolean") return <></>; //buat skeleton
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0259
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0395
  if (isMobile)
    return (
      <CheckoutResponsive
        resetBuyNow={resetBuyNow}
        validateMake={validateMake}
        resDetailCheckout={resCheckoutDetail?.data?.Data ?? []}
        supportingDataCheckoutDetail={
          resCheckoutDetail?.data?.SupportingData ?? null
        }
        paymentData={resPaymentOptions?.data?.Data ?? []}
        onClickPay={(val) => handleOnClickPay(val)}
        errorCheckout={errorCheckout}
        isLoadingCheckout={isLoadingCheckout}
        triggerOrderPayment={triggerOrderPayment}
      />
    );

  return (
    <>
      <Modal
        isOpen={modalValidasi}
        setIsOpen={setModalValidasi}
        closeArea={false}
        closeBtn={true}
        action1={{
          action: () => {
            router.back();
          },
          text: "Ok",
          style: "full",
          color: "#176CF7",
          customStyle: {
            width: "112px",
            color: "#ffffff",
          },
        }}
      >
        <div className="flex justify-center align-middle text-center px-[24px] flex-col gap-[10px]">
          {validateMake.title && (
            <div
              className={`flex mb-1 justify-center flex-col items-center font-[700] text-[16px] leading-[19.2px] text-[#000000] text-center`}
            >
              {validateMake.title}
            </div>
          )}
          {validateMake.desc && (
            <p className="text-sm mb-3 font-medium text-center text-[#1b1b1b]">
              {validateMake.desc}
            </p>
          )}
        </div>
      </Modal>
      <CheckoutWeb
        resDetailCheckout={resCheckoutDetail?.data?.Data ?? []}
        supportingDataCheckoutDetail={
          resCheckoutDetail?.data?.SupportingData ?? null
        }
        paymentData={resPaymentOptions?.data?.Data ?? []}
        onClickPay={(val) => handleOnClickPay(val)}
      />
    </>
  );
}

export default Checkout;
