import React from "react";
import IconComponent from "../IconComponent/IconComponent";
import "../../app/globals.scss";
import { useRouter } from "next/navigation";
import "./Bottomsheet.scss"
import { useCustomRouter } from "@/libs/CustomRoute";

const linkBar = [
  { icon: "/icons/chat.svg", value: "pesan", link: "/" },
  { icon: "/icons/profile.svg", value: "profile", link: "/" },
];

const NavigationMenu = () => {
  const router = useCustomRouter();

  return (
    // <div className="hidden md:flex fixed bottom-0 left-0 right-0 bg-white shadow-lg justify-around items-center h-16 px-10 py-3 shadow-muat">
    <div className="z-50 relative hidden sm:block">
      <button
        className="border-none bg-transparent fixed bottom-11 left-[44%] w-16 h-16 rounded-full z-[51]"
        onClick={() => router.push("/kelolaproduk/tambahproduk?page=1")}
      />
      <span className="capitalize text-primary-700 text-xs font-medium z-[51] fixed bottom-2 left-[41%] tambah-navmenu">
        tambah produk
      </span>
      <div
        className="flex flex-col gap-0 items-center z-[51] fixed bottom-2 left-12 cursor-pointer"
        onClick={() => alert("clicked")}
      >
        <IconComponent
          width={35}
          height={35}
          color="primary"
          src="/icons/chat.svg"
        />
        <span className="capitalize font-medium text-primary-700 text-xs">
          pesan
        </span>
      </div>
      <div
        className="flex flex-col gap-0 items-center z-[51] fixed bottom-2 right-12 cursor-pointer"
        onClick={() => alert("clicked")}
      >
        <IconComponent
          width={35}
          height={35}
          color="primary"
          src="/icons/profile.svg"
        />
        <span className="capitalize font-medium text-primary-700 text-xs nav-">
          profile
        </span>
      </div>
      <img
        src="/img/navmenumobile.svg"
        className="z-50 fixed w-[115%] -bottom-[35px] -left-[26px] max-w-[1000%] main-navmenu"
        alt="navmenu"
        srcSet=""
      />
      {/* {linkBar.map((key, index) => {
        return (
          <>
            <div className="flex flex-col gap-0 items-center">
              <IconComponent
                width={30}
                height={30}
                color="primary"
                src={key.icon}
              />
              <span className="capitalize font-medium text-primary-700 text-xs">
                {key.value}
              </span>
            </div>
            {index == 0 && (
              <div className="relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <button className="bg-red-500 text-white p-4 rounded-full shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m6-6H6"
                      />
                    </svg>
                  </button>
                </div>
                <p className="font-medium mt-[30px] text-primary-700 text-xs">
                  Tambah Produk
                </p>
              </div>
            )}
          </>
        );
      })} */}
    </div>
  );
};

export default NavigationMenu;
