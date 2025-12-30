"use client";

import { useState, useEffect } from "react";
// import DesktopFormDetails from "./DesktopFormDetails";
import MobileFormDetails from "@/app/garasi/beritahukami/mobile";
import toast from "@/store/toast";
import { useSearchParams } from "next/navigation";
import Toast from "@/components/Toast/Toast";
import { modal } from "@/store/modal";
import SWRHandler from "@/services/useSWRHook";
import { viewport } from "@/store/viewport";
import { useCustomRouter } from "@/libs/CustomRoute";
import { useLanguage } from "@/context/LanguageContext";

const api = process.env.NEXT_PUBLIC_GLOBAL_API + "v1";

export const useFormProps = () => {
  const { t } = useLanguage();
  const isAdd = useSearchParams().get("isAdd");
  const router = useCustomRouter();
  const [formDetails, setFormDetails] = useState({
    email: { value: "", error: "" },
    description: { value: "", error: "" },
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { setDataToast, setShowToast } = toast();
  const { setModalOpen } = modal();
  const { useSWRMutateHook } = SWRHandler();

  const { data: dataBeritahuKami, trigger: triggerBeritahuKami } =
    useSWRMutateHook(`${api}/muatparts/garasi/let_us_know`, "POST");

  const handleDetailsChange = (key, value) => {
    setFormDetails((prev) => ({
      ...prev,
      [key]: {
        value,
        error: "",
      },
    }));
    setIsSubmitted(false);
  };

  const validateDetails = () => {
    const newFormDetails = { ...formDetails };
    let isValid = true;

    // Validate Description (required)
    if (!formDetails.description.value.trim()) {
      newFormDetails.description.error = t("labelDeskripsiMustFilled");
      isValid = false;
    } else if (formDetails.description.value.length > 1000) {
      newFormDetails.description.error = t("labelDeskripsiTidakLebih1000");
      isValid = false;
    }

    // Validate Email (optional but must be valid if provided)
    if (formDetails.email.value && !validateEmail(formDetails.email.value)) {
      newFormDetails.email.error = t("labelFormatEmailTidakValid");
      isValid = false;
    }

    setFormDetails(newFormDetails);
    return isValid;
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);

    if (validateDetails()) {
      try {
        const bodyParams = {
          description: formDetails.description.value,
        };

        if (formDetails.email.value) {
          bodyParams.email = formDetails.email.value;
        }

        await triggerBeritahuKami(
          bodyParams,
          `${api}/muatparts/garasi/let_us_know`,
          "POST"
        );

        setModalOpen(false);
        setShowToast(true);
        setDataToast({
          type: "success",
          message: t("labelBerhasilKirimDataKendaraan"),
        });
        setTimeout(() => {
          if (window.innerWidth < 500) {
            if (isAdd) router.replace("/garasi/list");
            else router.replace("/garasi");
          }
        }, 1000);
      } catch (error) {
        console.error("Save store error:", error);
        throw error;
      }
    } else {
      console.log("Form validation failed");
    }
  };

  return {
    formDetails,
    handleDetailsChange,
    handleSubmit,
    isSubmitted,
  };
};

const MainBeritahuKamiContainer = () => {
  const { isMobile } = viewport();

  return isMobile ? (
    <>
      <Toast />
      <MobileFormDetails {...useFormProps} />
    </>
  ) : // <DesktopFormDetails {...sharedProps} />
  null;
};

export default MainBeritahuKamiContainer;
