import React, { useState } from "react";
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

const faqItems = [
  {
    question: "Berapa lama pengajuan komplain direspon oleh Penjual?",
    answer: "Penjual biasanya merespons pengajuan komplain dalam waktu maksimal 2x24 jam setelah komplain diajukan. Jika dalam periode tersebut belum ada tanggapan, silakan hubungi cs muatparts untuk bantuan lebih lanjut.",
  },
  {
    question: "Bagaimana jika pengajuan ditolak oleh Penjual?",
    answer: "Cek alasan penolakan dari penjual. Jika masih ada kendala, hubungi penjual atau ajukan ulang dengan informasi lebih lengkap. Untuk bantuan lebih lanjut, hubungi cs muatparts.",
  },
  {
    question:
      "Apa saja tautan lampiran yang dapat saya tambahkan sebagai bukti?",
    answer: (
      <div className="w-full mt-3">
        <div className="flex w-full items-center gap-2">
          <div className="bg-[#176CF7] self-stretch min-h-4 text-[10px] text-[#FFFFFF] font-bold whitespace-nowrap text-center leading-[1.3] w-[16px] h-[16px] pt-[1px] my-auto rounded-[26px]">
            1
          </div>
          <div className="text-black text-xs font-medium leading-[1.2] self-stretch flex-1 my-auto">
            File video dengan format mp4 dan maks size 50Mb
          </div>
        </div>
        <div className="flex w-full gap-2 mt-[12px]">
          <div className="bg-[#176CF7] min-h-4 text-[10px] text-[#FFFFFF] font-bold whitespace-nowrap text-center leading-[1.3] w-[16px] h-[16px] pt-[1px] rounded-[26px]">
            2
          </div>
          <div className="text-black text-xs font-medium leading-[14px] flex-1">
            File gambar dengan format jpg/jpeg/png dan maks size 10Mb per file
          </div>
        </div>
        {/* <div className="flex w-full gap-2 mt-[12px]">
          <div className="bg-[#176CF7] min-h-4 text-[10px] text-[#FFFFFF] font-bold whitespace-nowrap text-center leading-[1.3] w-[16px] h-[16px] pt-[1px] rounded-[26px]">
            3
          </div>
          <div className="text-black text-xs font-medium leading-[14px] flex-1">
            Setelah itu field Alamat akan terisi secara otomatis sesuai dengan
            Pin Lokasi yang kamu tentukan. Jika Alamat masih tidak sesuai kamu
            dapat melengkapi Detail Alamat dengan Alamat lengkap perusahaan.
          </div>
        </div> */}
      </div>
    ),
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(2);

  return (
    <div className="shadow-[0px_4px_11px_0px_rgba(65,65,65,0.25)] bg-[#E2F2FF] min-w-60 w-[338px] h-fit p-5 rounded-xl">
      <h2 className="AvenirBold16px Color000000 leading-[1.1]">
        Yang Sering Ditanyakan
      </h2>
      <div className="w-full mt-6">
        {faqItems.map((item, index) => (
          <div key={index}>
            <div className="flex w-full items-center gap-[10px] text-sm text-black font-medium leading-[15px]">
              <div className="AvenirNormal14px Color000000 self-stretch flex-1 my-auto">{item.question}</div>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="self-stretch flex w-5 shrink-0 h-5 my-auto"
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/50e3c5619267718e09797bc92cd325338d0f61b7c8a24b00492b29637bacd4b8?placeholderIfAbsent=true"
                  alt={openIndex === index ? "Tutup" : "Buka"}
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            {openIndex === index && (
              <div className="mt-[12px] AvenirNormal12px Color000000 ">{item.answer}</div>
            )}
            {index < faqItems.length - 1 && (
              <img
                src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/b8752bcb4eb4d1524bdbf969f4f3072a1da549aacf5d80dc46801743bfc992ab?placeholderIfAbsent=true"
                className="object-contain w-full stroke-[1px] stroke-[#C4C4C4] mt-[16px] mb-[16px]"
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

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