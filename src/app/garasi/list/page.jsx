"use client";

import { useState, useEffect } from "react";
import Web from "@/app/garasi/list/web";
import Mobile from "@/app/garasi/list/mobile";
import Toast from "@/components/Toast/Toast";
import Modal from "@/components/AI/Modal";
import toast from "@/store/toast";
import SWRHandler from "@/services/useSWRHook";
import { garasi } from "../store";
import { viewport } from "@/store/viewport";
import { useLanguage } from "@/context/LanguageContext";

const api = process.env.NEXT_PUBLIC_GLOBAL_API + "v1";

const initialCategories = [
  {
    id: "transmisi",
    name: "Transmisi",
    icon: "chopper",
    count: 2,
  },
  // ... kategori lainnya
];

const MainListGarasi = () => {
  const { t } = useLanguage();
  const { isMobile } = viewport();
  const [garageList, setGarageList] = useState();
  const [selectedVehicle, setSelectedVehicle] = useState();
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const { useSWRHook } = SWRHandler();
  const defaultID = "f0f02206-e33f-4967-914c-2ca6b30fd6b8";
  const [urlGetList, setUrlGetList] = useState();
  const { triggerList, setTriggerList } = garasi();
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [idGarageSelected, setIdGarageSelected] = useState();
  const { data: bannerImages } = useSWRHook("v1/muatparts/product/promo");
  const { data: garageSelected, error: garageSelectedError } =
    useSWRHook(urlGetList);
  const { data: garageLists, error: garageError } = useSWRHook(
    `v1/muatparts/garasi/lists`
  );
  const { data: categoryLists, mutate: mutateCategoryLists } =
    useSWRHook(idGarageSelected);

  useEffect(() => {
    if (!isInitialLoaded) {
      setUrlGetList(`v1/muatparts/garasi/lists?id=${defaultID}`);
      setIsInitialLoaded(true);

      setTimeout(() => {
        setUrlGetList(null);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (triggerList) {
      setUrlGetList(`v1/muatparts/garasi/lists?id=${defaultID}`);

      setTimeout(() => {
        setTriggerList(false);
        setUrlGetList(null);
      }, 1000);
    }
  }, [triggerList, defaultID]);

  useEffect(() => {
    if (garageSelected?.Data) {
      setSelectedVehicle(garageSelected.Data);
      const checkPrimaryForCategory = garageSelected.Data.find(
        (x) => x.isPrimary
      );
      if (checkPrimaryForCategory)
        setIdGarageSelected(
          `v1/muatparts/garasi/category_count?garageID=${checkPrimaryForCategory?.id}`
        );
    }
  }, [garageSelected]);

  useEffect(() => {
    if (garageLists?.Data) {
      setGarageList(garageLists.Data);
    }
  }, [garageLists]);

  const sharedProps = {
    selectedVehicle,
    setSelectedVehicle,
    categories,
    setCategories,
    searchTerm,
    setSearchTerm,
    garageList,
    selectedVehicle,
    setTriggerList,
    categoryLists,
    mutateCategoryLists,
  };

  return isMobile ? (
    <>
      <Toast />
      <Modal />
      <Mobile t={t} bannerImages={bannerImages?.Data ?? []} {...sharedProps} />
    </>
  ) : (
    <>
      <Toast />
      <Modal />
      <div className="pt-8 w-[1280px] sm:w-full m-auto">
        <span className="pb-1 px-10 capitalize font-bold text-xl">
          {t("AppManajemenGarasiMuatpartsGarasiSaya")}
        </span>
        <Web t={t} bannerImages={bannerImages?.Data ?? []} {...sharedProps} />
      </div>
    </>
  );
};

export default MainListGarasi;
