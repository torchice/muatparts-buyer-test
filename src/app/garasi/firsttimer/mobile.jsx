"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import toast from "@/store/toast";
import { ButtonSubmitMobileNav } from "@/app/garasi/page";
import { useSearchParams } from "next/navigation";
import { useHeader } from "@/common/ResponsiveContext";
import MultipleItems from "@/components/ReactSlick/MultipleItems";
import CustomLink from "@/components/CustomLink";
import { garasi } from "../store";
import { useLanguage } from "@/context/LanguageContext";
import { useCustomRouter } from "@/libs/CustomRoute";
const BottomsheetContent = ({ options, onSelect, label }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const { setShowBottomsheet } = toast();

  const filteredOptions = options.filter((option) => {
    // Convert searchTerm to lowercase once
    const searchLower = searchTerm.toLowerCase();

    if (typeof option === "object" && option.value !== undefined) {
      // Convert value to string before comparing
      const valueStr = String(option.value).toLowerCase();
      return valueStr.includes(searchLower);
    } else if (typeof option === "string") {
      return option.toLowerCase().includes(searchLower);
    } else if (typeof option === "number") {
      // Handle number values
      return String(option).includes(searchTerm);
    }
    return false;
  });

  const handleSelect = (value) => {
    onSelect(value);
    setShowBottomsheet(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="pt-2 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-900" />
          <input
            type="text"
            className="w-full pl-10 py-2.5 border border-neutral-600 text-neutral-900 text-sm font-medium rounded-lg focus:outline-none"
            placeholder={`${t("labelCari")} ${label}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Options List */}
      <div className="flex-1 overflow-y-auto">
        {filteredOptions.map((option, index) => (
          <div key={typeof option === "object" ? option.id : option}>
            <button
              onClick={() =>
                handleSelect(typeof option === "object" ? option.value : option)
              }
              className="w-full py-3.5 text-left text-neutral-900 text-sm font-semibold hover:bg-gray-50 focus:outline-none"
            >
              {typeof option === "object"
                ? String(option.value)
                : String(option)}
            </button>
          </div>
        ))}
        {filteredOptions.length === 0 && (
          <div className="px-4 py-2 text-neutral-900 text-sm text-center">
            {t("AppKomplainBuyerLabelDataNotFound")}
          </div>
        )}
      </div>
    </div>
  );
};

const Mobile = ({
  formState,
  handleChange,
  handleSubmit,
  isSubmitted,
  setIsSubmitted,
  vehicleOptions,
  brandOptions,
  yearOptions,
  modelOptions,
  typeOptions,
  bannerImages,
  ...props
}) => {
  const { t } = useLanguage();
  const { setShowBottomsheet, setDataBottomsheet, setTitleBottomsheet } =
    toast();
  const { setAppBar } = useHeader();
  const isAdd = useSearchParams().get("isAdd");
  const [currentError, setCurrentError] = useState({ field: "", message: "" });
  const { isEdit } = garasi();
  // LB - 0596, 25.03
  const router = useCustomRouter();

  const handleOpenBottomsheet = (config) => {
    const fieldOrder = ["vehicle", "brand", "year", "model", "type"];
    const fieldNames = {
      vehicle: "Kendaraan",
      brand: "Brand",
      year: "Tahun",
      model: "Model",
      type: "Tipe",
    };

    const currentIndex = fieldOrder.indexOf(config.key);
    let errorField = "";
    let errorMessage = "";

    // Reset isSubmitted to clear previous submit errors
    setIsSubmitted(false);

    // Check prerequisites in sequence
    for (let i = 0; i < currentIndex; i++) {
      const prerequisiteField = fieldOrder[i];
      if (!formState[prerequisiteField].value) {
        errorField = config.key;
        errorMessage =
          fieldNames[prerequisiteField] === "Kendaraan"
            ? t("AppManajemenGarasiMuatpartsPilihKendaraanTerlebihDahulu")
            : fieldNames[prerequisiteField] === "Brand"
            ? t("AppManajemenGarasiMuatpartsPilihBrandTerlebihDahulu")
            : fieldNames[prerequisiteField] === "Tahun"
            ? t("AppManajemenGarasiMuatpartsPilihTahunTerlebihDahulu")
            : fieldNames[prerequisiteField] === "Model"
            ? t("AppManajemenGarasiMuatpartsPilihmodelTerlebihDahulu")
            : fieldNames[prerequisiteField] === "Kendaraan"
            ? t("AppManajemenGarasiMuatpartsPilihKendaraanTerlebihDahulu")
            : null;
        // errorMessage = `Pilih ${fieldNames[prerequisiteField]} terlebih dahulu`;
        break;
      }
    }

    // Reset current error state
    setCurrentError({ field: "", message: "" });

    // Set new error if found
    if (errorMessage) {
      setCurrentError({ field: errorField, message: errorMessage });
      return;
    }

    setTitleBottomsheet(config.label);
    setDataBottomsheet(
      <BottomsheetContent
        options={config.options}
        onSelect={(value) => {
          handleChange(config.key, value);
          // setShowBottomsheet(false);
        }}
        label={config.label}
      />
    );
    setShowBottomsheet(true);
  };

  const renderLabel = (config) => (
    <div className="flex items-center gap-2">
      <span
        className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold
          ${
            formState[config.key].value
              ? "bg-primary-600 text-white"
              : "bg-neutral-700 text-white"
          }`}
      >
        {config.step}
      </span>
      {/* LB - 0619, 25.03 */}
      <span
        className={`flex-1 text-left
          ${
            !formState[config.key].value ? "text-gray-500" : "text-neutral-900"
          } truncate w-[250px]`}
      >
        {formState[config.key].value || config.label}
      </span>
    </div>
  );

  const dropdownsConfig = [
    {
      key: "vehicle",
      label: t("AppManajemenGarasiMuatpartsPilihKendaraan"),
      searchPlaceholder: t("labelPlaceholderCariKendaraan"),
      options: vehicleOptions,
      col: "full",
      step: 1,
    },
    {
      key: "brand",
      label: t("AppManajemenGarasiMuatpartsPilihBrand"),
      searchPlaceholder: t("labelPlaceholderCariBrand"),
      options: formState.vehicle.id ? brandOptions : [],
      col: "half",
      step: 2,
    },
    {
      key: "year",
      label: t("AppManajemenGarasiMuatpartsPilihTahun"),
      searchPlaceholder: t("labelPlaceholderCariTahun"),
      options: formState.brand.id ? yearOptions : [],
      col: "half",
      step: 3,
    },
    {
      key: "model",
      label: t("AppManajemenGarasiMuatpartsPilihModel"),
      searchPlaceholder: t("labelPlaceholderCariModel"),
      options: formState.year.value ? modelOptions : [],
      col: "half",
      step: 4,
    },
    {
      key: "type",
      label: t("AppManajemenGarasiMuatpartsPilihTipe"),
      searchPlaceholder: t("labelPlaceholderCariTipe"),
      options: formState.model.value ? typeOptions : [],
      col: "half",
      step: 5,
    },
  ];

  // Clear error saat value berubah
  useEffect(() => {
    setCurrentError({ field: "", message: "" });
  }, [formState]);

  useEffect(() => {
    setAppBar({
      title: isAdd
        ? t("AppManajemenGarasiMuatpartsTambahKendaraan")
        : t("buttonGarasiSaya"),
      appBarType: "header_title",
      // LB - 0074, 24. THP 2 - MOD001 - MP - 010 - QC Plan - Web - MuatParts - Paket 033 - Buyer - Manajemen Garasi
      onBack: () => {
        router.push("/");
      },
    });
  }, []);

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
      {!isAdd && (
        <div className="pb-8 text-neutral-900 px-4 pt-6 bg-neutral-100">
          <h1 className="text-base font-bold mb-2">
            {t("AppManajemenGarasiMuatpartsDataKendaraanSaya")}
          </h1>
          <p className="text-sm font-medium">
            {t("AppManajemenGarasiMuatpartsSubtitleDataKendaraanSaya")}
          </p>
        </div>
      )}
      <div className={`bg-neutral-100 space-y-4 px-4 pb-6 ${isAdd && "pt-6"}`}>
        {dropdownsConfig.map((config) => (
          <div key={config.key} className="relative">
            <button
              onClick={() => handleOpenBottomsheet(config)}
              className={`w-full p-3 bg-white flex items-center border rounded-lg text-sm font-medium cursor-pointer justify-between
        ${
          (formState[config.key].error && !currentError.field) ||
          currentError.field === config.key
            ? "border-error-400"
            : "border-neutral-600"
        }`}
            >
              {renderLabel(config)}
              <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
            </button>

            {/* Show dependency error (from dropdown click) */}
            {currentError.field === config.key && (
              <p className="mt-1 text-xs font-medium text-error-400">
                {currentError.message}
              </p>
            )}
            {/* Show validation error (from submit) */}
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

        <div className="mt-8">
          <div className="mt-4 text-center text-sm">
            <p className="text-neutral-900 font-medium">
              {t("AppManajemenGarasiMuatpartsFooterDataKendaraanSaya")}{" "}
              <CustomLink
                href={`/garasi/beritahukami${isAdd ? "?isAdd=true" : ""}`}
                className="!text-primary-700 font-semibold"
              >
                {t("AppManajemenGarasiMuatpartsBeritahuKami")}
              </CustomLink>
            </p>
          </div>
        </div>

        <ButtonSubmitMobileNav
          title={t("labelSimpanButton")}
          onclick={() =>
            handleSubmit({
              type: isEdit ? "edit" : "add",
              id: garasi.getState().editData?.id,
            })
          }
        />
      </div>
    </>
  );
};

export default Mobile;
