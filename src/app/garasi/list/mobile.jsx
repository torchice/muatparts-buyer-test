"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { modal } from "@/store/modal";
import { WebModal } from "../firsttimer/web";
import { useFormProps } from "../firsttimer/page";
import { HapusKendaraanModal } from "./web";
import toast from "@/store/toast";
import TambahMobile from "@/app/garasi/firsttimer/mobile";
import { useRouter } from "next/navigation";
import { useHeader } from "@/common/ResponsiveContext";
import SWRHandler from "@/services/useSWRHook";
import MultipleItems from "@/components/ReactSlick/MultipleItems";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useCustomRouter } from "@/libs/CustomRoute";
import { garasi } from "../store";
import axios from "axios";
import { authZustand } from "@/store/auth/authZustand";
import { Skeleton } from "@/app/profileseller/ProfilesellerWeb";
import { useLanguage } from "@/context/LanguageContext";

const api = process.env.NEXT_PUBLIC_GLOBAL_API + "v1/";

export default function Mobile({
  selectedVehicle,
  setSelectedVehicle,
  categories,
  setCategories,
  searchTerm,
  setSearchTerm,
  bannerImages,
  setTriggerList,
  garageList,
  categoryLists,
  mutateCategoryLists,
}) {
  const { setModalOpen, setModalContent, setModalConfig } = modal();
  const { setShowBottomsheet, setDataBottomsheet, setTitleBottomsheet } =
    toast();
  const [mainList, setMainList] = useState();

  const { setAppBar } = useHeader();
  const formProps = useFormProps();
  const router = useCustomRouter();

  const setEditData = garasi((state) => state.setEditData);

  const { t } = useLanguage();

  const handleEditClick = () => {
    setEditData({
      type: mainList.vehicle,
      brand: mainList.brand,
      year: mainList.year,
      model: mainList.model,
      variant: mainList.type,
      vehicleId: mainList.vehicleID,
      brandId: mainList.brandID,
      modelId: mainList.modelID,
      variantId: mainList.typeID,
      id: mainList.id,
    });

    router.push("/garasi/firsttimer?isEdit=true");
  };

   useEffect(() => {
     setMainList(selectedVehicle?.find((key) => key.isPrimary));
     //  LB - 0072, 24. THP 2 - MOD001 - MP - 010 - QC Plan - Web - MuatParts - Paket 033 - Buyer - Manajemen Garasi
     if (selectedVehicle?.length === 0) router.push("/garasi");
   }, [selectedVehicle]);

  useEffect(() => {
    setAppBar({
      title: t("AppManajemenGarasiMuatpartsGarasiSaya"),
      appBarType: "header_title",
      onBack: () => {
        router.push("/");
      },
    });
  }, []);

  // if (!selectedVehicle)
  //   return (
  //     <div className="px-10 py-4">
  //       <Skeleton fill={10} />
  //     </div>
  //   );

  // if (selectedVehicle?.length === 0) return router.push("/garasi");

  return (
    <>
      {bannerImages.length > 0 && (
        <section className="bg-white">
          <div className="w-auto mx-auto">
            <MultipleItems
              images={bannerImages.map((val) => val.Image)}
              urls={bannerImages.map((val) => val.Url)}
              settings={{
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 3000,
                dots: true,
                arrows: false,
              }}
              size={1000}
              className="cursor-pointer"
            />
          </div>
        </section>
      )}
      {/* Vehicle Card */}
      <div className="bg-neutral-100 rounded-lg py-6 shadow-sm mb-5 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-6 h-fit">
          <div className="w-[116px] h-[116px] border border-neutral-400 rounded-md p-6 bg-neutral-50 relative">
            <Image
              src={mainList?.image || ""}
              alt={mainList?.brand}
              width={68}
              height={68}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-between gap-5">
            <div className="flex flex-col gap-3 justify-between w-[286px] mx-auto">
              <span className="font-bold text-base flex items-center justify-between gap-4">
                {mainList?.vehicle} · {mainList?.brand} · {mainList?.year}
                <div className="flex gap-4">
                  <IconComponent
                    src="/icons/editgarasi.svg"
                    classname="cursor-pointer !w-4 !h-4"
                    // onclick={() => {
                    //   setModalOpen(false);
                    //   setModalContent(
                    //     <WebModal
                    //       mode="edit"
                    //       initialData={{
                    //         type: "Mobil",
                    //         brand: "Toyota",
                    //         year: "2023",
                    //         model: "Innova",
                    //         variant: "2.0 G",
                    //       }}
                    //       {...formProps}
                    //     />
                    //   );
                    //   setModalOpen(true);
                    //   setModalConfig({
                    //     width: 471,
                    //     height: 291,
                    //     classname: "!w-[471px] !h-fit",
                    //     withHeader: false,
                    //     withClose: true,
                    //   });
                    // }}
                    onclick={handleEditClick}
                  />
                  <div className="size-4">
                    <Trash2
                      color="#EE4343"
                      className="cursor-pointer"
                      size={16}
                      onClick={() => {
                        setModalContent(
                          <HapusKendaraanModal
                            setTriggerList={setTriggerList}
                            selectedVehicle={mainList}
                            mutateCategoryLists={mutateCategoryLists}
                          />
                        );
                        setModalOpen(true);
                        setModalConfig({
                          classname: "!w-[296px] !h-fit",
                          withHeader: false,
                          withClose: true,
                        });
                      }}
                    />
                  </div>
                </div>
              </span>
              <p className="text-xs font-medium text-neutral-700">
                {mainList?.model}
              </p>
              <p className="text-xs font-medium text-neutral-700">
                {mainList?.type}
              </p>
            </div>
            <div className="flex justify-between gap-2">
              <Button
                color="primary_secondary"
                Class="!min-w-[158px] !h-8 !text-sm !font-semibold"
                onClick={() => {
                  setTitleBottomsheet("Daftar Kendaraan");
                  setDataBottomsheet(
                    <DaftarKendaraanBottomsheet
                      setTriggerList={setTriggerList}
                      selectedVehicle={selectedVehicle}
                      mutateCategoryLists={mutateCategoryLists}
                      {...useFormProps}
                    />
                  );
                  setShowBottomsheet(true);
                }}
              >
                {t("AppManajemenGarasiMuatpartsGanti")} (
                {selectedVehicle?.length})
              </Button>
              <Button
                Class="!min-w-[158px] !text-sm !h-8 !font-semibold"
                onClick={() => {
                  router.push("/garasi/firsttimer?isAdd=true");
                }}
              >
                {t("AppManajemenGarasiMuatpartsTambah")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6 py-0 px-6 mx-auto">
        <h3 className="text-base font-bold mb-4">
          {t("AppManajemenGarasiMuatpartsTitleSearchSection")} {mainList?.brand}{" "}
          {mainList?.year}
        </h3>
        <div className="flex gap-6">
          <form
            className="w-full min-w-full max-w-full"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                // LB-0361, 25.03
                router.push(
                  `/products?q=${searchTerm}&garageID=${mainList?.id}`
                );
              }
            }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-[15px] -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("AppManajemenGarasiMuatpartsCariSukuCadang")}
                value={searchTerm}
                changeEvent={(e) => setSearchTerm(e.target.value)}
                classInput="!min-w-full !max-w-full !w-full !pl-[35px]"
              />
              {searchTerm && (
                <X
                  className="absolute right-3 top-[15px] -translate-y-1/2 text-gray-400 h-4 w-4"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-6 pb-6 pt-5 bg-neutral-100">
        <h3 className="text-base font-bold mb-4">
          {t("AppManajemenGarasiMuatpartsKategoriUntuk")} {mainList?.brand}{" "}
          {mainList?.year}
        </h3>

        {categoryLists?.Data?.length === 0 ? (
          <div className="mt-[44px] block">
            <DataNotFound
              image={"/img/daftarprodukicon.png"}
              title={t("AppManajemenGarasiMuatpartsBelumAdaKategoriYangCocok")}
              textClass="!w-[234px]"
              width={95}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {/* LB-101, 25.03 */}
            {categoryLists?.Data?.map((key, idx) => (
              <div
                key={idx}
                className="bg-white p-[14px] w-full h-fit rounded-md border hover:border-primary-600 cursor-pointer relative"
                onClick={() =>
                  router.push(
                    `/products?categoryID=${key.id[1]},&garageID=${mainList?.id}`
                  )
                }
              >
                <div className="aspect-square relative mb-2">
                  <img
                    src={key.icon}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="flex gap-2 items-center justify-center text-center text-neutral-900 pt-3">
                  <p className="text-sm font-bold max-w-[109px] truncate">
                    {key.value[1]}
                  </p>
                  <p className="text-xs font-medium">({key.productCount})</p>
                </div>
                {/* {category.isRecommended && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Rekomendasi
                    </span>
                  </div>
                )} */}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export const DaftarKendaraanBottomsheet = ({
  selectedVehicle,
  setSelectedVehicle,
  setTriggerList,
  mutateCategoryLists,
}) => {
  const { setModalOpen, setModalContent, setModalConfig } = modal();
  const { setShowBottomsheet, setShowToast, setDataToast } = toast();
  const formProps = useFormProps();
  const router = useCustomRouter();

  const { useSWRMutateHook } = SWRHandler();
  const [selectedKendaraan, setSelectedKendaraan] = useState(
    selectedVehicle?.find((key) => key.isPrimary)
  );

  const { t } = useLanguage();

  const { data: dataUpdateMainGarasi, trigger: mutateUpdateMainGarasi } =
    useSWRMutateHook(
      `v1/muatparts/garasi/update_status/efb13bd9-65f7-4c41-aabe-8e84229f88bc`,
      "PUT"
    );

  const ChangeMainGarasi = async (val) => {
    // if (selectedKendaraan.brand === val.brand) {
    try {
      await axios.put(`${api}muatparts/garasi/update_status/${val.id}`, null, {
        headers: {
          Authorization: `Bearer ${authZustand.getState().accessToken}`,
          refreshToken: authZustand.getState().refreshToken,
        },
      });
      setSelectedKendaraan(val.brand);
      setShowBottomsheet(false);
      setShowToast(true);
      setDataToast({
        type: "success",
        message: t("labelKendaraanBerhasilDiganti"),
      });
      setTriggerList(true);
    } catch (error) {
      console.error("Save store error:", error);
      throw error;
    }
    // }
  };

  return (
    <div className="relative">
      <div className="w-full mx-auto flex flex-col gap-2 overflow-auto max-h-[400px] !z-10">
        {selectedVehicle.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`flex w-full h-[84px] border cursor-pointer ${
              vehicle.id === selectedKendaraan.id
                ? "bg-primary-50 border-primary-700"
                : "bg-white border-neutral-400"
            } rounded-lg p-3`}
            onClick={() => ChangeMainGarasi(vehicle)}
          >
            <div className="relative w-[68px] h-auto aspect-square">
              <img
                src={vehicle.image}
                alt={vehicle.brand}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex ml-2 font-bold text-sm justify-center flex-col gap-1">
              <p>{vehicle.year} •</p>
              <p>{vehicle.brand}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        Class="!max-w-full !min-w-full !h-8 !font-semibold text-sm mx-auto mt-4"
        onClick={() => {
          setShowBottomsheet(false);
          // setModalOpen(false);
          // setModalContent(<WebModal mode="add" {...formProps} />);
          // setModalOpen(true);
          // setModalConfig({
          //   width: 471,
          //   height: 291,
          //   classname: "!w-[471px] !h-fit !z-20",
          //   withHeader: false,
          //   withClose: true,
          // });
          router.push("/garasi/firsttimer?isAdd=true");
        }}
      >
        {t("AppManajemenGarasiMuatpartsTambahKendaraan")}
      </Button>
    </div>
  );
};
