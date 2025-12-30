"use client";
import React, { useEffect } from "react";
import { SectionCard } from "./DetailProductPageResponsive";
import { useHeader } from "@/common/ResponsiveContext";
import { useRouter } from "next/navigation";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
  // Improvement fix wording Pak Brian
const DetailProdukResponsiveSkeleton = ({ isMobile = false }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const { setAppBar, setSearch } = useHeader();
  useEffect(() => {
    setAppBar({
      appBarType: "compact",
      renderActionButton: (
        <div className="flex gap-2">
          <span className="flex flex-col z-30 justify-center items-center gap-[2px] select-none cursor-pointer">
            <IconComponent
              classname={"icon-white"}
              width={20}
              height={20}
              src={"/icons/share.svg"}
            />
            <span className="font-semibold text-neutral-50 text-[10px]">
              {t("labelShareBuyer")}
            </span>
          </span>
          {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB-0306 */}
          <span
            className="flex flex-col z-30 justify-center items-center gap-[2px] select-none cursor-pointer"
            onClick={() => router.push("/troli")}
          >
            <Image
              alt="ssd"
              width={20}
              height={20}
              src={
                process.env.NEXT_PUBLIC_ASSET_REVERSE + "/img/cart-outline.png"
              }
            />
            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0769 */}
            <span className="font-semibold text-neutral-50 text-[10px] whitespace-nowrap">
              {t("AppMuatpartsAnalisaProdukTroli")}
            </span>
          </span>
        </div>
      ),
    });
    setSearch({
      placeholder: t("AppMuatpartsWishlistCariProduk"),
      onSubmitForm: true,
    });
  }, []);
  return (
    <div className="w-full  min-h-screen bg-neutral-200">
      <SectionCard classname={"!p-0 my-4"}>
        <div className="w-full h-full aspect-square bg-gray-300 animate-skeleton skeleton !rounded-none" />
      </SectionCard>
      <SectionCard classname="my-4">
        <div className="h-[14px] bg-gray-300 animate-skeleton skeleton w-20" />
        <div className="flex items-center justify-between">
          <div className="h-[14px] bg-gray-300 animate-skeleton skeleton w-32" />
        </div>
        <div className="h-[14px] bg-gray-300 animate-skeleton skeleton w-20" />
      </SectionCard>
      <SectionCard classname="my-4">
        <div className="h-[14px] w-40 bg-gray-300 skeleton animate-skeleton" />
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
        </div>
      </SectionCard>
      <SectionCard classname="my-4">
        <div className="h-[14px] w-40 bg-gray-300 skeleton animate-skeleton" />
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
          <div className="h-[14px] w-20 bg-gray-300 skeleton animate-skeleton" />
        </div>
        <div className="h-[14px] w-40 bg-gray-300 skeleton animate-skeleton" />
        <div className="h-[14px] w-full bg-gray-300 skeleton animate-skeleton" />
      </SectionCard>

      {/* Vehicle Selection and Check Compatibility */}
    </div>
  );
};

export default DetailProdukResponsiveSkeleton;
