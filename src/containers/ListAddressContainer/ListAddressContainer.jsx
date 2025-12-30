"use client";
import ModalComponent from "@/components/Modals/ModalComponent";
import style from "./ListAddressContainer.module.scss";
import { useEffect, useState } from "react";
import IconComponent from "@/components/IconComponent/IconComponent";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import CustomLink from "@/components/CustomLink";
import SWRHandler from "@/services/useSWRHook";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import {
  addManagementLocationZustand,
  userLocationZustan,
} from "@/store/manageLocation/managementLocationZustand";
import { useLanguage } from "@/context/LanguageContext";
// Improvement fix wording Pak Brian
function ListAddressContainer({
  accessToken,
  locations,
  onAddAddress,
  onSave,
  onChange,
  classname,
  onSelectLocation,
  preventDefaultSave = false,
  showMultipleSelection = false,
  defaultValue = {},
}) {
  const { useSWRHook, useSWRMutateHook } = SWRHandler();
  const { t } = useLanguage();
  const {
    data: locationsUser,
    mutate,
    isLoading,
  } = useSWRHook(!locations?.length ? `v1/muatparts/profile/location` : null);
  const [getLocations, setLocations] = useState([]);
  const [getSelectedLocation, setSelectedLocation] = useState();
  const [searchLocationUser, setSearchLocationUser] = useState("");
  const [showListLocation, setShowListLocation] = useState(false);
  const manlok = userLocationZustan();
  const { setAllState, clearState } = addManagementLocationZustand();
  function handleAddAddress(e) {
    clearState();
    if (typeof onAddAddress === "function") onAddAddress?.();
    else {
      alert("panggil AddAddressContainer dengan ModalComponent");
    }
  }
  function handleSave(e) {
    e.stopPropagation();
    if (!preventDefaultSave)
      manlok?.setSelectedLocation(
        getLocations?.find((a) => a?.ID == getSelectedLocation?.ID)
      );
    if (typeof onSave === "function") onSave?.(getSelectedLocation);
  }
  function handlePilih(val) {
    if (typeof onSelectLocation === "function") {
      onSelectLocation?.(val);
      manlok?.setSelectedLocations([val]);
    } else setSelectedLocation(val);
  }
  function handleOnChage(val) {
    setAllState(val);
    onChange?.();
  }
  useEffect(() => {
    if (!getSelectedLocation?.ID) {
      if (Object.keys(defaultValue).length === 0) {
        setSelectedLocation(manlok.selectedLocation);
      } else {
        setSelectedLocation(defaultValue);
      }
    }
    if (!locations?.length) {
      let isMain =
        locationsUser?.Data?.find((a) => a?.IsMainAddress == 1) ?? {};
      let tmp = locationsUser?.Data?.filter((a) => a?.IsMainAddress != 1) ?? [];
      let newTmp = [isMain, ...tmp];
      if (!manlok?.selectedLocation?.ID) {
        manlok?.setSelectedLocation(isMain);
        setSelectedLocation(isMain);
      }
      setLocations(newTmp.filter((a) => Object.keys(a).length));
    } else {
      let isMain = locations?.find((a) => a?.IsMainAddress == 1) ?? [];
      let tmp = locations?.filter((a) => a?.IsMainAddress != 1) ?? [];
      let newTmp = [isMain, ...tmp];
      if (!manlok?.selectedLocation?.ID) {
        manlok?.setSelectedLocation(isMain);
        setSelectedLocation(isMain);
      }
      setLocations(newTmp);
    }
  }, [locations, locationsUser]);


  return (
    <div className={`${style.main} h-auto ${classname}`}>
      {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0133 */}
      <div className="py-8 px-6 flex flex-col gap-4 w-full">
        {accessToken ? (
          <h1 className="font-bold text-base text-neutral-900 leading-3">
            {t("labelPilihAlamatTujuan")}
          </h1>
        ) : (
          <h1 className="font-bold text-base text-neutral-900">
            {t("labelKemanaPesananMauDIkirim")}
          </h1>
        )}
        {accessToken ? (
          <div className="flex flex-col gap-4">
            {getLocations?.length>0 && (
              <Input
                disabled={isLoading}
                value={searchLocationUser}
                changeEvent={(e) => setSearchLocationUser(e.target.value)}
                placeholder={t("labelAlamatyangDisimpan")}
                focusEvent={() => setShowListLocation(true)}
                // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0127
                icon={{ left: <IconComponent src={"icons/search.svg"} /> }}
              />
            )}
            {/* Improvement fix wording pak Brian */}
            {!isLoading ? (
              getLocations?.length===0 ? (
                // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0134
                <DataNotFound
                  type="data"
                  classname={"py-1"}
                  width={95}
                  height={76}
                >
                  <div className="flex flex-col gap-3 justify-center items-center text-neutral-600">
                    {/*  // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0134 */}
                    <span className="semi-base leading-3">
                      {t("labelKamuBelumPunyaAlamat")}
                    </span>
                    <span className="medium-xs leading-3">
                      {t("labelYukTambahkanAlamatmu")}
                    </span>
                  </div>
                </DataNotFound>
              ) : (
                <ul className="flex flex-col list-none h-[300px] overflow-y-auto">
                  {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0132 */}
                  {getLocations
                    ?.filter((val) =>
                      val?.Address?.toLowerCase().includes(
                        searchLocationUser?.toLocaleLowerCase()
                      )
                    )
                    ?.map((val, i) => (
                      <li key={i}>
                        <div
                          className={`${
                            showMultipleSelection
                              ? // manlok?.selectedLocations?.some(
                                //     (a) => a?.ID === val?.ID
                                //   )
                                "bg-primary-50"
                              : val?.ID === getSelectedLocation?.ID
                              ? "bg-primary-50"
                              : ""
                          } p-3 flex flex-col gap-3 border-b border-neutral-400`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 w-3/4">
                              <span
                                className={`text-xs text-neutral-900 font-bold ${
                                  val?.IsMainAddress ? "max-w-[70%]" : ""
                                }`}
                              >
                                {val?.Name}
                              </span>
                              {val?.IsMainAddress ? (
                                <span className="rounded p-1 bg-primary-700 text-neutral-50 text-xs font-semibold leading-3">
                                  {t("labelUtamaBuyer")}
                                </span>
                              ) : (
                                ""
                              )}
                            </span>
                            <div
                              className="flex items-center gap-2 cursor-pointer select-none"
                              onClick={() => handleOnChage(val)}
                            >
                              <span className="font-medium text-xs text-primary-700">
                                {t("labelUbahBuyer")}
                              </span>
                              <IconComponent src={"/icons/pencil-blue.svg"} />
                            </div>
                          </div>
                          <div className="flex justify-between h-auto relative">
                            <div className="flex flex-col gap-3 w-[60%]">
                              <span className="font-medium text-[10px] text-neutral-900 w-full line-clamp-2 leading-[10px]">
                                {val?.PicName} ({val?.PicNoTelp})
                              </span>
                              <span className="font-medium text-[10px] text-neutral-900 w-full line-clamp-2 leading-3">
                                {val?.Address}
                              </span>
                              {val?.AddressDetail && (
                                <span className="font-medium text-[10px] text-neutral-900 line-clamp-3 leading-[10px]">
                                  {t("labelDetailAlamat")} :{" "}
                                  {val?.AddressDetail}
                                </span>
                              )}
                            </div>
                            {showMultipleSelection ? (
                              <Button
                                color="primary_secondary"
                                onClick={() => handlePilih(val)}
                                Class={`absolute right-0 bottom-0 !h-8 !font-semibold`}
                                disabled={manlok?.selectedLocations?.some(
                                  (a) => a?.ID === val?.ID
                                )}
                              >
                                {manlok?.selectedLocations?.some(
                                  (a) => a?.ID === val?.ID
                                )
                                  ? // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0526
                                  // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0064
                                    t("LabelmodalPilihAlamatTerpilih")
                                  : t("labelPilihBuyer")}
                              </Button>
                            ) : (
                              <Button
                                color="primary_secondary"
                                onClick={() => handlePilih(val)}
                                Class={`absolute right-0 bottom-0 !h-8 !font-semibold`}
                                disabled={val?.ID === getSelectedLocation?.ID}
                              >
                                {val?.ID === getSelectedLocation?.ID
                                  ? t("LabelmodalPilihAlamatTerpilih")
                                  : t("labelPilihBuyer")}
                              </Button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              )
            ) : (
              <ul className="flex flex-col list-none h-[300px] overflow-y-auto">
              
                {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0132 */}
                {Array(3).fill('').map((_,i) => (
                    <li key={i}>
                      <div
                        className={`p-3 flex flex-col gap-3 border-b border-neutral-400`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2 w-3/4">
                            <div
                              className={`h-3 bg-gray-300 animate-pulse w-20 rounded-md`}
                            />
                          </span>
                        </div>
                        <div className="flex justify-between h-auto relative">
                          <div className="flex flex-col gap-3 w-[60%]">
                            <span className="font-medium text-[10px] text-neutral-900 w-32 line-clamp-2 leading-[10px] h-2 bg-gray-300 animate-pulse rounded-md"/>
                            <div className="flex flex-col gap-1">
                              <div className="font-medium text-[10px] text-neutral-900 w-full line-clamp-2 leading-3 bg-gray-300 animate-pulse h-2 rounded-md"/>
                              <div className="font-medium text-[10px] text-neutral-900 w-[30%] line-clamp-2 leading-3 bg-gray-300 animate-pulse h-2 rounded-md"/>
                            </div>
                          
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
            <div
              className={`flex items-center ${
                getLocations?.length ? "justify-between" : ""
              } gap-3`}
            >
              <Button
                Class="!h-8 !max-w-none w-full !font-semibold"
                onClick={(e) => handleAddAddress(e)}
                color={`${
                  getLocations?.length ? "primary_secondary" : "primary"
                }`}
                disabled={isLoading}
              >
                {t("labelTambahAlamat")}
              </Button>
              {getLocations?.length ? (
                <Button
                disabled={isLoading}
                  onClick={(e) => handleSave(e)}
                  Class="!h-8 !max-w-none w-full !font-semibold"
                >
                  {t("GlobalFilterButtonSave")}
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium text-neutral-900">
                {t("labelMasukkanAlamatKelurahan")}
              </p>
              <div className="relative">
                <Input
                  placeholder="Cari Lokasi Kamu"
                  focusEvent={() => setShowListLocation(true)}
                  icon={{ left: "icons/search.svg" }}
                />
                {showListLocation && (
                  <ul className="absolute top-9 left-0 list-none bg-neutral-50 rounded-md shadow-muatmuat w-full py-2 px-[10px] flex flex-col gap-4 border border-neutral-300">
                    <li>
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center gap-1 cursor-pointer text-neutral-900 font-medium text-xs"
                          onClick={() => {
                            setShowListLocation(false);
                          }}
                        >
                          <IconComponent src={"/icons/marker-outline.svg"} />
                          <span className="w-full line-clamp-1 cursor-pointer">
                            {t("labelBelumIntegrasiLokasi")}
                          </span>
                        </div>
                        <span
                          className="cursor-pointer"
                          onClick={() => {
                            setShowListLocation(false);
                          }}
                        >
                          <IconComponent src={"/icons/bookmark-outline.svg"} />
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center gap-1 text-neutral-900 font-medium text-xs"
                          onClick={() => {
                            setShowListLocation(false);
                          }}
                        >
                          <IconComponent src={"/icons/marker-outline.svg"} />
                          <span className="w-full line-clamp-1">
                            {t("labelBelumIntegrasiLokasi")}
                          </span>
                        </div>
                        <span
                          onClick={() => {
                            setShowListLocation(false);
                          }}
                        >
                          <IconComponent src={"/icons/bookmark-outline.svg"} />
                        </span>
                      </div>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <span className="w-full gap-3 flex item-center justify-between">
              <span className="bg-neutral-400 w-full h-[1px] self-center"></span>
              <span className="text-neutral-400 text-xs">atau</span>
              <span className="bg-neutral-400 w-full h-[1px] self-center"></span>
            </span>
            <div className="text-xs font-medium text-neutral-900">
              <CustomLink
                href={"https://muatmuat.com/login"}
                className="text-primary-700"
              >
                {t("BFTMLogin")}
              </CustomLink>{" "}
              {t("labelUntukMelihatAlamatyangTelahkamusimpan")}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ListAddressContainer;
