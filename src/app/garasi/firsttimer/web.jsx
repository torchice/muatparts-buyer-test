"use client";

import { useState, useEffect } from "react";
import { Dropdown, Card, vehicleData } from "@/app/garasi/page";
import Button from "@/components/Button/Button";
import { useFormProps } from "./page";
import { useFormProps as UFPberitahukami } from "@/app/garasi/beritahukami/page";
import { BeritahuKamiWeb } from "../beritahukami/web";
import { modal } from "@/store/modal";
import SWRHandler from "@/services/useSWRHook";
import MultipleItems from "@/components/ReactSlick/MultipleItems";
import { useToken } from "@/store/zustand/token";
import { useLanguage } from "@/context/LanguageContext";

const api = process.env.NEXT_PUBLIC_GLOBAL_API + "v1";

const Web = ({
  formState,
  handleChange,
  handleSubmit,
  isSubmitted,
  vehicleOptions,
  brandOptions,
  yearOptions,
  modelOptions,
  typeOptions,
  bannerImages,
}) => {
  const { t } = useLanguage();
  const [currentError, setCurrentError] = useState({ field: "", message: "" });
  const { setModalOpen, setModalContent, setModalConfig } = modal();

  const getDependencyMessage = (config) => {
    switch (config.key) {
      case "brand":
        return !formState.vehicle.value
          ? t("AppManajemenGarasiMuatpartsPilihKendaraanTerlebihDahulu")
          : "";
      case "year":
        return !formState.vehicle.value
          ? t("AppManajemenGarasiMuatpartsPilihKendaraanTerlebihDahulu")
          : !formState.brand.value
          ? t("AppManajemenGarasiMuatpartsPilihBrandTerlebihDahulu")
          : "";
      case "model":
        return !formState.vehicle.value
          ? t("AppManajemenGarasiMuatpartsPilihKendaraanTerlebihDahulu")
          : !formState.brand.value
          ? t("AppManajemenGarasiMuatpartsPilihBrandTerlebihDahulu")
          : !formState.year.value
          ? t("AppManajemenGarasiMuatpartsPilihTahunTerlebihDahulu")
          : "";
      case "type":
        return !formState.vehicle.value
          ? t("AppManajemenGarasiMuatpartsPilihKendaraanTerlebihDahulu")
          : !formState.brand.value
          ? t("AppManajemenGarasiMuatpartsPilihBrandTerlebihDahulu")
          : !formState.year.value
          ? t("AppManajemenGarasiMuatpartsPilihTahunTerlebihDahulu")
          : !formState.model.value
          ? t("AppManajemenGarasiMuatpartsPilihmodelTerlebihDahulu")
          : "";
      default:
        return "";
    }
  };

  const dropdownsConfig = [
    {
      key: "vehicle",
      label: t("AppManajemenGarasiMuatpartsPilihKendaraan"),
      searchPlaceholder: t("labelPlaceholderCariKendaraan"),
      options: vehicleOptions,
      col: "full",
    },
    {
      key: "brand",
      label: t("AppManajemenGarasiMuatpartsPilihBrand"),
      searchPlaceholder: t("labelPlaceholderCariBrand"),
      options: formState.vehicle.id ? brandOptions : [],
      col: "half",
    },
    {
      key: "year",
      label: t("AppManajemenGarasiMuatpartsPilihTahun"),
      searchPlaceholder: t("labelPlaceholderCariTahun"),
      options: formState.brand.id ? yearOptions : [],
      col: "half",
    },
    {
      key: "model",
      label: t("AppManajemenGarasiMuatpartsPilihModel"),
      searchPlaceholder: t("labelPlaceholderCariModel"),
      options: formState.year.value ? modelOptions : [],
      col: "half",
    },
    {
      key: "type",
      label: t("AppManajemenGarasiMuatpartsPilihTipe"),
      searchPlaceholder: t("labelPlaceholderCariTipe"),
      options: formState.model.id ? typeOptions : [],
      col: "half",
    },
  ];

  const handleDropdownClick = (config) => {
    const dependencyMessage = getDependencyMessage(config);
    if (dependencyMessage) {
      setCurrentError({ field: config.key, message: dependencyMessage });
      return false; // Return false untuk mencegah dropdown terbuka
    }
    setCurrentError({ field: "", message: "" });
    return true; // Return true jika boleh dibuka
  };

  useEffect(() => {
    setCurrentError({ field: "", message: "" });
  }, [formState]);

  return (
    <>
      <span className="capitalize font-bold text-xl px-10 pt-6 block">
        {t("buttonGarasiSaya")}
      </span>
      <div className="py-6 px-[100px] space-y-6 w-full">
        <Card classname="flex flex-col p-6 !border-none shadow-muat !w-[1080px] !m-auto">
          <span className="capitalize font-bold text-lg">
            {t("AppManajemenGarasiMuatpartsDataKendaraanSaya")}
          </span>
          <span className="font-semibold text-xs mt-4">
            {t("AppManajemenGarasiMuatpartsSubtitleDataKendaraanSaya")}
          </span>
          <div className="flex flex-col mt-6">
            <div className="flex justify-between gap-3">
              {dropdownsConfig.map((config) => (
                <div key={config.key} className="flex flex-col w-[165px]">
                  <Dropdown
                    withSearch={config.key === "year" ? false : true}
                    label={config.label}
                    value={formState[config.key].value}
                    onChange={(value) => handleChange(config.key, value)}
                    options={config.options}
                    error={
                      (formState[config.key].error && !currentError.field) ||
                      currentError.field === config.key
                    }
                    onBeforeOpen={() => handleDropdownClick(config)}
                    searchPlaceholder={config.searchPlaceholder}
                  />
                  {currentError.field === config.key && (
                    <span className="text-xs font-medium text-error-400 mt-0">
                      {currentError.message}
                    </span>
                  )}
                  {formState[config.key].error && !currentError.field && (
                    <p className="mt-1 text-xs font-medium text-error-400">
                      {/* {`${config.label.split(" ")[1]} wajib diisi`} */}
                      {config.key === "vehicle"
                        ? t("labelKendaraanWajibDiisi")
                        : config.key === "brand"
                        ? t("labelBrandWajibDiisi")
                        : config.key === "year"
                        ? t("labelTahunWajibDiisi")
                        : config.key === "model"
                        ? t("labelModelWajibDiisi")
                        : config.key === "type"
                        ? t("labelTipeWajibDiisi")
                        : null}
                    </p>
                  )}
                </div>
              ))}

              <Button
                Class="!min-w-[112px] !h-8 !font-semibold"
                onClick={handleSubmit}
              >
                {t("AppManajemenGarasiMuatpartsTambah")}
              </Button>
            </div>
          </div>

          <span
            className={`font-semibold text-xs ${
              isSubmitted ? "mt-8" : "mt-6"
            } text-neutral-600`}
          >
            {t("AppManajemenGarasiMuatpartsFooterDataKendaraanSaya")}{" "}
            <span
              className="!text-primary-700 cursor-pointer font-semibold hover:underline"
              onClick={() => {
                setModalOpen(false);
                setModalContent(<BeritahuKamiWeb {...UFPberitahukami} />);
                setModalOpen(true);
                setModalConfig({
                  width: 471,
                  height: 291,
                  classname: "!w-[471px] sm:!w-auto !h-fit",
                  withHeader: false,
                  withClose: true,
                });
              }}
            >
              {t("AppManajemenGarasiMuatpartsBeritahuKami")}
            </span>
          </span>
        </Card>
      </div>
      {bannerImages.length > 0 && (
        <section className="bg-white py-6">
          <div className="w-[1000px] mx-auto mb-[51px]">
            <MultipleItems
              images={bannerImages.map((val) => val.Image)}
              urls={bannerImages.map((val) => val.Url)}
              settings={{
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 3000,
                dots: true,
              }}
              size={1000}
              className="rounded-xl cursor-pointer"
            />
          </div>
        </section>
      )}
    </>
  );
};

export default Web;

export const WebModal = ({
  mode = "add",
  initialData = null,
  mutateCategoryLists,
}) => {
  const {
    formState,
    handleChange,
    handleSubmit,
    isSubmitted,
    vehicleOptions,
    brandOptions,
    yearOptions,
    modelOptions,
    typeOptions,
    setVehicleOptions,
    setBrandOptions,
    setYearOptions,
    setModelOptions,
    setTypeOptions,
    setFormState,
    setIsSubmitted,
    validateForm,
  } = useFormProps();

  const { t } = useLanguage();

  const [currentError, setCurrentError] = useState({ field: "", message: "" });
  const { setModalOpen, setModalContent, setModalConfig } = modal();
  const { useSWRHook } = SWRHandler();

  const { data: vehiclesData } = useSWRHook("v1/muatparts/garasi/vehicle");
  const { data: brandsData } = useSWRHook(
    formState.vehicle.id
      ? `v1/muatparts/garasi/brand?vehicleID=${formState.vehicle.id}`
      : null
  );
  const { data: yearsData } = useSWRHook(
    formState.brand.id
      ? `v1/muatparts/garasi/years?brandID=${formState.brand.id}`
      : null
  );
  const { data: modelsData } = useSWRHook(
    formState.year.value
      ? `v1/muatparts/garasi/model?brandID=${formState.brand.id}&year=${formState.year.value}`
      : null
  );
  const { data: typesData } = useSWRHook(
    formState.model.id
      ? `v1/muatparts/garasi/type?modelID=${formState.model.id}`
      : null
  );

  useEffect(() => {
    if (mode === "edit" && initialData) {
      // note arek2
      // 1 = type
      // 2 = brand
      // 3 = year
      // 4 = model
      // 5 = varian
      setFormState({
        vehicle: {
          value: initialData.variant,
          error: "",
          id: initialData.variantID,
        },
        brand: {
          value: initialData.brand,
          error: "",
          id: initialData.brandID,
        },
        year: {
          value: initialData.year,
          error: "",
          id: initialData.year,
        },
        model: {
          value: initialData.model,
          error: "",
          id: initialData.modelID,
        },
        type: {
          value: initialData.type,
          error: "",
          id: initialData.typeID,
        },
      });
    }
  }, [mode, initialData]);

  useEffect(() => {
    if (vehiclesData?.Data) {
      setVehicleOptions(vehiclesData.Data);
    }
  }, [vehiclesData]);

  useEffect(() => {
    if (brandsData?.Data) {
      setBrandOptions(brandsData.Data);
    }
  }, [brandsData]);

  useEffect(() => {
    if (yearsData?.Data) {
      setYearOptions(yearsData.Data);
    }
  }, [yearsData]);

  useEffect(() => {
    if (modelsData?.Data) {
      setModelOptions(modelsData.Data);
    }
  }, [modelsData]);

  useEffect(() => {
    if (typesData?.Data) {
      setTypeOptions(typesData.Data);
    }
  }, [typesData]);

  const dropdownsConfig = [
    {
      key: "vehicle",
      label: t("AppManajemenGarasiMuatpartsPilihKendaraan"),
      searchPlaceholder: t("labelPlaceholderCariKendaraan"),
      options: vehicleOptions?.map((option) => option.value) || [],
      col: "full",
    },
    {
      key: "brand",
      label: t("AppManajemenGarasiMuatpartsPilihBrand"),
      searchPlaceholder: t("labelPlaceholderCariBrand"),
      options: brandOptions?.map((option) => option.value) || [],
      col: "half",
    },
    {
      key: "year",
      label: t("AppManajemenGarasiMuatpartsPilihTahun"),
      searchPlaceholder: t("labelPlaceholderCariTahun"),
      options: yearOptions || [],
      col: "half",
    },
    {
      key: "model",
      label: t("AppManajemenGarasiMuatpartsPilihModel"),
      searchPlaceholder: t("labelPlaceholderCariModel"),
      options: modelOptions?.map((option) => option.value) || [],
      col: "half",
    },
    {
      key: "type",
      label: t("AppManajemenGarasiMuatpartsPilihTipe"),
      searchPlaceholder: t("labelPlaceholderCariTipe"),
      options: typeOptions?.map((option) => option.value) || [],
      col: "half",
    },
  ];

  const renderLabel = (config, index) => (
    <div className="flex items-center gap-2">
      <span
        className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold
        ${
          formState[config.key].value
            ? "bg-primary-600 text-white"
            : "bg-neutral-700 text-white"
        }`}
      >
        {index + 1}
      </span>
      <span
        className={`${config.col !== "full" && "truncate w-[105px]"}
        ${
          formState[config.key].value == ""
            ? "text-[#7b7b7b]"
            : "text-[#1b1b1b]"
        } text-left`}
      >
        {formState[config.key].value || config.label}
      </span>
    </div>
  );

  const getDependencyMessage = (config) => {
    switch (config.key) {
      case "brand":
        return !formState.vehicle.value
          ? t("AppManajemenGarasiMuatpartsPilihKendaraanTerlebihDahulu")
          : "";
      case "year":
        return !formState.vehicle.value
          ? t("AppManajemenGarasiMuatpartsPilihKendaraanTerlebihDahulu")
          : !formState.brand.value
          ? t("AppManajemenGarasiMuatpartsPilihBrandTerlebihDahulu")
          : "";
      case "model":
        return !formState.vehicle.value
          ? t("AppManajemenGarasiMuatpartsPilihKendaraanTerlebihDahulu")
          : !formState.brand.value
          ? t("AppManajemenGarasiMuatpartsPilihBrandTerlebihDahulu")
          : !formState.year.value
          ? t("AppManajemenGarasiMuatpartsPilihTahunTerlebihDahulu")
          : "";
      case "type":
        return !formState.vehicle.value
          ? t("AppManajemenGarasiMuatpartsPilihKendaraanTerlebihDahulu")
          : !formState.brand.value
          ? t("AppManajemenGarasiMuatpartsPilihBrandTerlebihDahulu")
          : !formState.year.value
          ? t("AppManajemenGarasiMuatpartsPilihTahunTerlebihDahulu")
          : !formState.model.value
          ? t("AppManajemenGarasiMuatpartsPilihmodelTerlebihDahulu")
          : "";
      default:
        return "";
    }
  };

  const handleDropdownClick = (config) => {
    const dependencyMessage = getDependencyMessage(config);
    if (dependencyMessage) {
      setCurrentError({ field: config.key, message: dependencyMessage });
      return false;
    }
    setCurrentError({ field: "", message: "" });
    return true;
  };

  const handleFormSubmit = async () => {
    setIsSubmitted(true);
    const isValid = validateForm();
    if (!isValid) return;

    if (mode === "edit") {
      await handleSubmit({
        type: "edit",
        id: initialData.id,
        oldData: {
          type: initialData.typeID,
          brand: initialData.brandID,
          year: initialData.yearID,
          model: initialData.modelID,
          variant: initialData.vehicleID,
        },
        newData: formState,
      });
      mutateCategoryLists();
    } else {
      handleSubmit({
        type: "add",
        newData: formState,
      });
      mutateCategoryLists();
    }
  };

  const renderDropdowns = () => {
    const fullWidthDropdowns = dropdownsConfig.filter(
      (config) => config.col === "full"
    );
    const halfWidthDropdowns = dropdownsConfig.filter(
      (config) => config.col === "half"
    );

    return (
      <div className="space-y-4">
        {fullWidthDropdowns.map((config, index) => (
          <div key={config.key}>
            <Dropdown
              searchPlaceholder={config.searchPlaceholder}
              withSearch
              customLabel={renderLabel(config, index)}
              value={formState[config.key].value}
              onChange={(value) => handleChange(config.key, value)}
              options={config.options}
              error={
                formState[config.key].error || currentError.field === config.key
              }
              onBeforeOpen={() => handleDropdownClick(config)}
              classname="!w-full"
            />
            {currentError.field === config.key && (
              <span className="text-xs font-medium text-error-400 mt-0">
                {currentError.message}
              </span>
            )}
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          {halfWidthDropdowns.map((config, index) => (
            <div key={config.key}>
              <Dropdown
                searchPlaceholder={config.searchPlaceholder}
                withSearch={config.key === "year" ? false : true}
                customLabel={renderLabel(
                  config,
                  fullWidthDropdowns.length + index
                )}
                value={formState[config.key].value}
                onChange={(value) => handleChange(config.key, value)}
                options={config.options}
                error={
                  formState[config.key].error ||
                  currentError.field === config.key
                }
                onBeforeOpen={() => handleDropdownClick(config)}
                classname="!w-full"
              />
              {currentError.field === config.key && (
                <span className="text-xs font-medium text-error-400 mt-0">
                  {currentError.message}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto py-8 px-[45px]">
      <h1 className="text-lg font-bold mb-4 mx-auto text-center">
        {mode === "edit"
          ? t("AppManajemenGarasiMuatpartsUbahKendaraan")
          : t("AppManajemenGarasiMuatpartsTambahKendaraan")}
      </h1>
      <div className="space-y-4">
        {renderDropdowns()}

        <Button
          onClick={handleFormSubmit}
          Class="!mx-auto !h-8 !font-semibold !text-sm"
        >
          {t("AppPromosiSellerMuatpartsSimpan")}
        </Button>

        <div className="text-center text-sm !mt-4">
          <span className="text-neutral-600 font-semibold text-xs">
            {t("labelTidakMenemukanKendaraanKamu")}{" "}
            <a
              onClick={() => {
                setModalOpen(false);
                setModalContent(<BeritahuKamiWeb {...UFPberitahukami} />);
                setModalOpen(true);
                setModalConfig({
                  width: 471,
                  height: 291,
                  classname: "!w-[471px] sm:!w-auto !h-fit",
                  withHeader: false,
                  withClose: true,
                });
              }}
              className="text-primary-700 font-semibold cursor-pointer hover:underline"
            >
              {t("AppManajemenGarasiMuatpartsBeritahuKami")}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};
