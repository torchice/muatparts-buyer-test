'use client'
import CustomLink from "@/components/CustomLink";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useCustomRouter } from "@/libs/CustomRoute";
import { viewport } from "@/store/viewport";
import React from "react";

function NotFound() {
  const router = useCustomRouter()
  const {isMobile}=viewport()
  return (
    <div className="w-full flex flex-col h-screen relative justify-center items-center gap-8 bg-primary-700 py-10 overflow-hidden">
      {isMobile?
      <ImageComponent
        src={"/img/jalan-jalan.png"}
        width={130}
        height={37}
        alt="muat"
      />
      :<ImageComponent
        src={"/img/muatmuat-jalan-mudah-bersama2.png"}
        width={200}
        height={56}
        alt="muat"
      />}
      <ImageComponent
        src={"/img/aneh1.png"}
        className={`absolute ${isMobile?'-top-[68px]':'top-0'} left-0`}
        width={isMobile?142:228}
        height={isMobile?158:231}
        alt="muat"
      />
      <ImageComponent
        src={"/img/aneh2.png"}
        className={`absolute ${isMobile?'-bottom-8 w-[111px] h-[140px]':'bottom-0 w-[222px] h-[280px]'} right-0 `}
        width={isMobile?146:222}
        height={isMobile?158:222}
        alt="muat"
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-center items-center">
          <ImageComponent
            src={"/img/404.png"}
            width={165}
            height={55}
            alt="muat"
          />
          <ImageComponent
            src={"/img/404_people.png"}
            width={368}
            height={198}
            alt="muat"
          />
        </div>
        <div className="flex flex-col gap-3 text-neutral-50 items-center">
          <span className={`${isMobile?'bold-base':'text-[24px] font-bold'} `}>
            Halaman Tidak Ditemukan
          </span>
          <span className={`${isMobile?'medium-sm':'text-base'} font-medium`}>
            Silahkan kembali ke Halaman Awal
          </span>
          <span
            onClick={()=>router.back()}
            className="text-primary-700 semi-sm bg-[#FFC217] rounded-3xl px-6 py-[10px] text-center select-none cursor-pointer"
          >
            Kembali ke Halaman Awal
          </span>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
