"use client";
import Image from "next/image";
import style from "./PaymentInformationMobile.module.scss";
import IconComponent from "../IconComponent/IconComponent";
import { numberFormatMoney } from "@/libs/NumberFormat";
import { useEffect, useState } from "react";
import ToastApp from "../ToastApp/ToastApp";
import { CopyClipboard } from "@/libs/services";
import { useLanguage } from "@/context/LanguageContext";
function PaymentInformationMobile({ bankLogo, bankName, amount, bankAccount }) {
  const {t}=useLanguage()
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess("");
      }, [800]);
    }
  }, [success]);
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0774
  return (
    <div
      className={`${style.main} bg-neutral-50 containerMobile pb-6 flex flex-col gap-6`}
    >
      <ToastApp
        show={success}
        onClose={() => setSuccess("")}
        text={`${success} berhasil disalin`}
      />
      <div className="flex flex-col gap-4">
        <span className="medium-sm text-neutral-600">{t("LabelfilterProdukOpsiPembayaran")}</span>
        <div className="medium-sm text-neutral-900 flex items-center gap-3">
          {bankLogo?<image
            src={`${bankLogo}`}
            width={24}
            height={24}
            alt="logo bank"
            className="rounded"
          />:<span className="w-6 h-6 border border-neutral-400"></span>}
          <span>{bankName}</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="medium-sm text-neutral-600">
          {t("LabelfilterProdukNomorVirtualAccount")}
        </span>
        <div className="medium-sm text-neutral-900 flex items-center gap-1">
          <span className="text-primary-700">{bankAccount}</span>
          <span
            className="select-none"
            onClick={() =>
              CopyClipboard(bankAccount, t("LabelfilterProdukNomorVirtualAccount"), setSuccess)
            }
          >
            <IconComponent src={"/icons/copy-outline-blue.svg"} />
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="medium-sm text-neutral-600">{t("LabelfilterProdukTotalTagihan")}</span>
        <div className="medium-sm text-neutral-900 flex items-center gap-1">
          <span className="text-primary-700">{numberFormatMoney(amount)}</span>
          <span
            className="select-none"
            onClick={() => CopyClipboard(amount, t("LabelfilterProdukTotalTagihan"), setSuccess)}
          >
            <IconComponent src={"/icons/copy-outline-blue.svg"} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default PaymentInformationMobile;
