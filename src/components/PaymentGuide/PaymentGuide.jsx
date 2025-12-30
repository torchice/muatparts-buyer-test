import { useState } from "react";
import { GuideAccordion } from "./GuideAccordion";
import { resPaymentMethods } from "./paymentData";
import { useLanguage } from "@/context/LanguageContext";

export default function PaymentGuide({ onOptionSelect }) {
  const {t} = useLanguage()
  const [paymentData, setPaymentData] = useState(resPaymentMethods.Data);

  return (
    <div className="flex flex-col leading-tight text-black w-full h-fit">
      {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0732 */}
      <div className="self-start text-base font-bold">{t("LabeldetailPesananCaraPembayaran")}</div>
      <div className="flex overflow-auto flex-col mt-4 w-full text-xs">
        {paymentData.map((item) => (
          <GuideAccordion item={item} onOptionSelect={onOptionSelect} />
        ))}
      </div>
    </div>
  );
}
