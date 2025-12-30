import { viewport } from "@/store/viewport";
import React from "react";

// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0090
const DropshipCard = ({ name, phone }) => {
  const { isMobile } = viewport();

  if (isMobile)
    return (
      <div className="flex flex-col py-6 px-4 bg-white">
        <div className="font-semibold mb-5 text-sm">
          Dikirim sebagai{" "}
          <span className="text-muat-parts-non-800">Dropshipper</span>
        </div>
        <div className="flex flex-col gap-2 font-medium text-sm mb-5">
          <div className="w-32 text-neutral-600">Nama Pengirim</div>
          <div className="">{name}</div>
        </div>
        <div className="flex flex-col gap-2 font-medium text-sm">
          <div className="w-32 text-neutral-600">No. HP Pengirim</div>
          <div className="">{phone}</div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col shadow-muatmuat mb-4 rounded-xl py-5 px-8">
      <div className="font-bold mb-5">
        Dikirim sebagai{" "}
        <span className="text-muat-parts-non-800">Dropshipper</span>
      </div>
      <div className="flex gap-6 font-medium text-xs mb-4">
        <div className="w-32 text-neutral-600">Nama Pengirim</div>
        <div className="">{name}</div>
      </div>
      <div className="flex gap-6 font-medium text-xs">
        <div className="w-32 text-neutral-600">No. HP Pengirim</div>
        <div className="">{phone}</div>
      </div>
    </div>
  );
};

export default DropshipCard;
