import React, { useState } from "react";
import SWRHandler from "@/services/useSWRHook";

// 24. THP 2 - MOD001 - MP - 027 - QC Plan - Web - MuatParts - Komplain Buyer
// LB - 0007
// LB - 0008
// LB - 0011
// LB - 0012
// LB - 0014
// LB - 0015
// LB - 0016
// LB - 0017
// LB - 0021
// LB - 0022
// LB - 0034
// 24. THP 2 - MOD001 - MP - 027 - QC Plan - Web - MuatParts - Komplain Buyer

import "@/app/komplainbuyer/ComplaintPopUp.css" 

const RadioButton = ({ reason,checked, onChange }) => {
  return (
    // LB - 0001 Excel Bug Komplain Buyer Web

    <div className="w-full flex gap-[8px] cursor-pointer" onClick={onChange}>
      <div
        className={`flex flex-col-0 gap-[8px]  min-w-[16px] h-[16px] cursor-pointer rounded-full border border-solid
          ${checked ? "border-[#176cf7]" : "border-[#7B7B7B]"}`}
      >
        {checked && (
          <div className="w-full h-full rounded-full bg-[#FFFFFF] p-[2px]">
            <div className="w-full h-full rounded-full bg-[#176CF7]" />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="text-xs font-medium text-black">{reason.title}</div>
        <div className="text-xs text-[#666666] mt-1 leading-[1.2]">{reason.description}</div>
      </div>
    </div>
    
  );
};

const ComplaintOption = ({ reason, selected, onSelect }) => {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-2">
        <RadioButton checked={selected} onChange={onSelect} reason={reason} />
        
      </div>
    </div>
  );
};

export const ComplaintPopUp = ({ onClose, onSelect }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const { useSWRHook } = SWRHandler();
  
  // Fetch alasan komplain dari API
  const { data: reasonsData, error } = useSWRHook(
    "/v1/muatparts/buyer/complaints-reasons"
  );

  const handleSubmit = () => {
    if (selectedReason) {
      // Pastikan kita mengirim data yang diperlukan
      onSelect({
        id: selectedReason.id,
        title: selectedReason.title,
        description: selectedReason.description
      });
      onClose();
    }
  };

  // Tampilkan loading state jika data belum tersedia
  if (!reasonsData && !error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-[386px] max-w-[90%] shadow-lg p-6">
          <div className="text-center">Memuat data...</div>
        </div>
      </div>
    );
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-[386px] max-w-[90%] shadow-lg p-6">
          <div className="text-center text-red-500">Gagal memuat data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ zIndex: 10000 }}>
      <div className="bg-white rounded-xl w-[386px] max-w-[90%] shadow-lg z-10000" style={{ zIndex: 10000 }}>
        <div className="bg-[#FF3B30] flex justify-between items-top p-4 rounded-t-xl modal-apps-az-header-red-small h-[70px]">
          <div className="flex items-center gap-2">
          </div>
          <button
            onClick={onClose}
            className="silang-merah w-[20px] h-[20px]"
            aria-label="Close"
          >
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-base font-bold text-black text-center mb-6">
            Pilih Alasan Komplain
          </h2>

          <div>
            {reasonsData?.Data?.map((reason) => (
              <ComplaintOption
                key={reason.id}
                reason={reason}
                selected={selectedReason?.id === reason.id}
                onSelect={() => setSelectedReason(reason)}
              />
            ))}
          </div>

          <div className="flex gap-2 justify-center mt-6">
            <button
              onClick={onClose}
              className="min-w-[112px] h-[32px] px-[24px] py-[5px] rounded-3xl border border-[#176CF7] text-[#176CF7] text-[14px] font-semibold"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedReason}
              className={`min-w-[112px] h-[32px] px-[24px] py-[5px] rounded-3xl text-[#FFFFFF] text-[14px] font-semibold
                ${selectedReason 
                  ? 'bg-[#176CF7]' 
                  : 'bg-[#176CF7] cursor-not-allowed'
                }`}
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  // LB - 0001 Excel Bug Komplain Buyer Web
};

export default ComplaintPopUp;