// LBM - Complaint Responsive - Andrew
import React, { useState, useEffect } from 'react';
import useKomplainStore from './useKomplainStore';
import { useAlasanKomplain } from './komplainHooks';

function ComplaintBottomSheet({ onClose }) {
  const [selectedReason, setSelectedReason] = useState(null);
  const { alasanKomplain } = useAlasanKomplain();
  const { form, setAlasanKomplain: setStoreAlasanKomplain } = useKomplainStore();
  
  // Set selected reason based on current form state on mount
  useEffect(() => {
    if (form.alasanKomplain) {
      const index = alasanKomplain.findIndex(reason => reason.id === form.alasanKomplain.id);
      if (index !== -1) {
        setSelectedReason(index);
      }
    }
  }, [form.alasanKomplain, alasanKomplain]);

  const handleReasonSelect = (index) => {
    setSelectedReason(index);
  };

  const handleSave = () => {
    if (selectedReason !== null && alasanKomplain && alasanKomplain.length > 0) {
      setStoreAlasanKomplain(alasanKomplain[selectedReason]);
      onClose?.(); // Tutup bottom sheet jika ada handler onClose
    }
  };

  // Fungsi untuk tutup bottom sheet
  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className="flex flex-col gap-6 px-4 pt-1 pb-6 mx-auto my-0 w-full bg-white max-w-[480px] rounded-[16px_16px_0_0] shadow-[0_2px_20px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-4 items-center">
        <div>
          <svg width="38" height="4" viewBox="0 0 38 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 2C0 0.895431 0.89543 0 2 0H36C37.1046 0 38 0.895431 38 2V2C38 3.10457 37.1046 4 36 4H2C0.89543 4 0 3.10457 0 2V2Z" fill="#DDDDDD" />
          </svg>
        </div>
        <div className="flex relative items-center w-full">
          <button onClick={handleClose} className="cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.36 18.3599L5.64001 5.63989" stroke="#0080FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="bevel" />
              <path d="M18.36 5.63989L5.64001 18.3599" stroke="#0080FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="bevel" />
            </svg>
          </button>
          <div className="flex-1 text-sm font-bold text-center text-black">
            Pilih Alasan Komplain
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {alasanKomplain && alasanKomplain.map((reason, index) => (
          <div key={index} className="flex justify-between items-start pb-4 w-full border-b border-solid border-b-stone-300">
            <div className="flex-1 mr-3">
              <div className="mb-3 text-sm text-black">{reason.title}</div>
              <div className="text-xs leading-tight text-neutral-500">{reason.description}</div>
            </div>
            <div className="shrink-0 w-4 h-4">
              <input
                type="radio"
                id={`reason-${index}`}
                name="complaintReason"
                checked={selectedReason === index}
                onChange={() => handleReasonSelect(index)}
                className="hidden"
              />
              <label htmlFor={`reason-${index}`} className="cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_1175_17876)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16 20.0001C20.4183 20.0001 24.0001 16.4183 24.0001 12C24.0001 7.58174 20.4183 4 16 4C11.5817 4 8 7.58174 8 12C8 16.4183 11.5817 20.0001 16 20.0001Z" fill={selectedReason === index ? "#0080FF" : "white"} />
                    <path d="M23.5001 12C23.5001 16.1422 20.1422 19.5001 16 19.5001C11.8579 19.5001 8.5 16.1422 8.5 12C8.5 7.85788 11.8579 4.5 16 4.5C20.1422 4.5 23.5001 7.85788 23.5001 12Z" stroke="#7B7B7B" />
                  </g>
                  <defs>
                    <filter id="filter0_d_1175_17876" x="0" y="0" width="32.0001" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="4" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.172549 0 0 0 0 0.152941 0 0 0 0 0.219608 0 0 0 0.08 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1175_17876" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1175_17876" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </label>
            </div>
          </div>
        ))}
      </div>
      <button
        className="px-6 py-2.5 w-full text-sm font-semibold text-white bg-blue-600 rounded-3xl cursor-pointer border-[none]"
        onClick={handleSave}
        disabled={selectedReason === null}
      >
        Simpan
      </button>
    </div>
  );
}

export default ComplaintBottomSheet;

// LBM - Complaint Responsive - Andrew