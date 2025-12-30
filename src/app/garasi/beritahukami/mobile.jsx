"use client";

import { useEffect } from "react";
import { useFormProps } from "./page";
import { ButtonSubmitMobileNav } from "../page";
import { useHeader } from "@/common/ResponsiveContext";
import { useLanguage } from "@/context/LanguageContext";

const BeritahuKamiMobile = () => {
  const { formDetails, handleDetailsChange, isSubmitted, handleSubmit } =
    useFormProps();
  const { setAppBar } = useHeader();
  const { t } = useLanguage();

  const handleTextareaChange = (e) => {
    let value = e.target.value;

    // Prevent leading spaces
    if (value.startsWith(" ")) {
      value = value.trimStart();
    }

    // Check if adding the character would exceed the limit
    if (value.length <= 1000) {
      handleDetailsChange("description", value);
    }
  };

  const onSubmit = () => {
    handleSubmit();
    console.log("Form Data:", {
      email: formDetails.email.value,
      description: formDetails.description.value,
    });
  };

  useEffect(() => {
    setAppBar({
      title: t("AppManajemenGarasiMuatpartsDataKendaraan"),
      appBarType: "header_title",
    });
  }, []);

  return (
    <div className="space-y-4 px-4 py-6 h-screen">
      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-neutral-900 text-sm font-medium flex gap-1">
          {t("AppManajemenGarasiMuatpartsEmailKamu")}
        </label>
        <input
          type="email"
          placeholder={t("AppManajemenGarasiMuatpartsHintTextEmailKamu")}
          value={formDetails.email.value}
          onChange={(e) => handleDetailsChange("email", e.target.value)}
          className={`w-full p-3 border rounded-lg text-sm font-medium text-neutral-900 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${
              isSubmitted && formDetails.email.error
                ? "border-red-500"
                : "border-gray-300"
            }`}
        />
        {isSubmitted && formDetails.email.error && (
          <p className="text-red-500 font-medium text-xs ">
            {formDetails.email.error}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <label className="text-neutral-900 text-sm font-medium">
          {t("AppManajemenGarasiMuatpartsDeskripsiKendaraan")}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder={t(
            "AppManajemenGarasiMuatpartsHintTextDeskripsiKendaraan"
          )}
          value={formDetails.description.value}
          onChange={handleTextareaChange}
          className={`w-full resize-none p-3 min-h-[100px] border rounded-lg text-sm font-medium text-neutral-900
            placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${
              isSubmitted && formDetails.description.error
                ? "border-red-500"
                : "border-gray-300"
            }`}
        />

        <div
          className={`flex ${
            isSubmitted && formDetails.description.error
              ? "justify-between"
              : "justify-end"
          } font-medium text-xs !-mt-0`}
        >
          {isSubmitted && formDetails.description.error && (
            <p className="text-sm text-red-500">
              {formDetails.description.error}
            </p>
          )}
          <span
            className={`text-sm ${
              isSubmitted && formDetails.description.error
                ? "text-error-500"
                : "text-neutral-600"
            }`}
          >
            {formDetails.description.value.length}/1.000
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <ButtonSubmitMobileNav
        title={t("AppManajemenGarasiMuatpartsKirim")}
        onclick={onSubmit}
      />
    </div>
  );
};

export default BeritahuKamiMobile;
