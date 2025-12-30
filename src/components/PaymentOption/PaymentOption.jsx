import { useState } from "react";
import { PaymentAccordion } from "./PaymentAccordion";

export default function PaymentOption({ paymentData, onOptionSelect }) {
  const [options, setOptions] = useState(paymentData);

  return (
    <div className="flex flex-col font-bold leading-tight text-black w-full h-[380px]">
      <div className="self-center text-base text-center pt-6">
        Opsi Pembayaran
      </div>
      <div className="flex overflow-auto flex-col mt-4 w-full text-xs p-4">
        <div className="text-base">Semua Metode</div>
        {options.map((item) => (
          <PaymentAccordion item={item} onOptionSelect={onOptionSelect} />
        ))}
      </div>
    </div>
  );
}
