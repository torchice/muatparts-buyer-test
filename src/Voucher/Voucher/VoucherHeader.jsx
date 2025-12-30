import * as React from "react";

function VoucherHeader() {
  return (
    <div className="flex flex-col justify-center self-start mt-4 text-base text-center">
      <div className="flex gap-1 items-start">
        <div className="flex flex-col justify-center items-center font-bold text-blue-600 border-b-2 border-solid border-b-blue-600 min-h-[40px]">
          <div className="flex gap-1 justify-center items-center px-6 min-h-[14px] max-md:px-5">
            <div className="self-stretch my-auto">Daftar Voucher</div>
            <div className="self-stretch my-auto">(40)</div>
          </div>
        </div>
        <div className="shrink-0 self-stretch w-0 h-10 border border-solid bg-stone-300 border-stone-300" />
        <button className="flex flex-col justify-center items-center font-semibold text-black whitespace-nowrap min-h-[40px]">
          <div className="flex gap-1 justify-center items-center px-6 min-h-[14px] max-md:px-5">
            <div className="self-stretch my-auto">Riwayat</div>
            <div className="self-stretch my-auto">(9)</div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default VoucherHeader;