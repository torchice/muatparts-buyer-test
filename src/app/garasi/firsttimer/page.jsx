"use client";

import { useState, useEffect } from "react";
import DesktopForm from "@/app/garasi/firsttimer/web";
import MobileForm from "@/app/garasi/firsttimer/mobile";
import toast from "@/store/toast";
import { modal } from "@/store/modal";
import Bottomsheet from "@/components/Bottomsheet/Bottomsheet";
import Toast from "@/components/Toast/Toast";
import { useSearchParams } from "next/navigation";
import SWRHandler from "@/services/useSWRHook";
import { garasi } from "../store";
import { authZustand } from "@/store/auth/authZustand";
import { useCustomRouter } from "@/libs/CustomRoute";
import { viewport } from "@/store/viewport";
import ConfigUrl from "@/services/baseConfig";
import GlobalLoading from "@/components/GlobalLoading/GlobalLoading";
import { useLanguage } from "@/context/LanguageContext";
const api = process.env.NEXT_PUBLIC_GLOBAL_API + "v1/";

export const useFormProps = () => {
  const { t } = useLanguage();
  const accessToken = authZustand.getState().accessToken;
  const refreshToken = authZustand.getState().refreshToken;
  const setTriggerList = garasi((state) => state.setTriggerList);
  const router = useCustomRouter();
  const [formState, setFormState] = useState({
    vehicle: { value: "", error: "", id: "" },
    brand: { value: "", error: "", id: "" },
    year: { value: "", error: "", id: "" },
    model: { value: "", error: "", id: "" },
    type: { value: "", error: "", id: "" },
  });

  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { setShowToast, setDataToast } = toast();
  const { setModalOpen } = modal();
  const isAdd = useSearchParams().get("isAdd");
  const isEditMobile = useSearchParams().get("isEdit");

  const { useSWRHook } = SWRHandler();

  const { data: vehiclesData } = useSWRHook("v1/muatparts/garasi/vehicle");

  useEffect(() => {
    if (vehiclesData?.Data) {
      setVehicleOptions(vehiclesData.Data);
    }
  }, [vehiclesData]);

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
    formState.brand.id && formState.year.value
      ? `v1/muatparts/garasi/model?brandID=${formState.brand.id}&year=${formState.year.value}`
      : null
  );

  const { data: typesData } = useSWRHook(
    formState.model.id
      ? `v1/muatparts/garasi/type?modelID=${formState.model.id}`
      : null
  );

  useEffect(() => {
    if (brandsData?.Data) {
      setBrandOptions(brandsData.Data);
      if (!formState.brand.value) {
        setYearOptions([]);
        setModelOptions([]);
        setTypeOptions([]);
      }
    }
  }, [brandsData]);

  useEffect(() => {
    if (yearsData?.Data) {
      const formattedYears = yearsData.Data.map((year) => ({
        value: year.value.toString(),
        id: year.id.toString(),
      }));
      setYearOptions(formattedYears);

      if (!formState.year.value) {
        setModelOptions([]);
        setTypeOptions([]);
      }
    }
  }, [yearsData]);

  useEffect(() => {
    if (modelsData?.Data) {
      setModelOptions(modelsData.Data);
      if (!formState.model.value) {
        setTypeOptions([]);
      }
    }
  }, [modelsData]);

  useEffect(() => {
    if (typesData?.Data) {
      setTypeOptions(typesData.Data);
    }
  }, [typesData]);

  const handleChange = (key, value) => {
    let currentOptions = [];
    let selectedOption = null;
    const isEditMode = garasi.getState().isEdit;

    switch (key) {
      case "vehicle":
        currentOptions = vehicleOptions;
        selectedOption = currentOptions.find((opt) => opt.value === value);
        // if (!isEditMode) {
        setFormState((prev) => ({
          ...prev,
          vehicle: { value: value, error: "", id: selectedOption?.id || "" },
          brand: { value: "", error: "", id: "" },
          year: { value: "", error: "", id: "" },
          model: { value: "", error: "", id: "" },
          type: { value: "", error: "", id: "" },
        }));
        // } else {
        //   setFormState((prev) => ({
        //     ...prev,
        //     vehicle: { value: value, error: "", id: selectedOption?.id || "" },
        //   }));
        // }
        break;

      case "brand":
        currentOptions = brandOptions;
        selectedOption = currentOptions.find((opt) => opt.value === value);
        // if (!isEditMode) {
        setFormState((prev) => ({
          ...prev,
          brand: { value: value, error: "", id: selectedOption?.id || "" },
          year: { value: "", error: "", id: "" },
          model: { value: "", error: "", id: "" },
          type: { value: "", error: "", id: "" },
        }));
        // } else {
        //   setFormState((prev) => ({
        //     ...prev,
        //     brand: { value: value, error: "", id: selectedOption?.id || "" },
        //   }));
        // }
        break;

      case "year":
        // if (!isEditMode) {
        setFormState((prev) => ({
          ...prev,
          year: { value: value, error: "", id: value },
          model: { value: "", error: "", id: "" },
          type: { value: "", error: "", id: "" },
        }));
        // } else {
        //   setFormState((prev) => ({
        //     ...prev,
        //     year: { value: value, error: "", id: value },
        //   }));
        // }
        break;

      case "model":
        currentOptions = modelOptions;
        selectedOption = currentOptions.find((opt) => opt.value === value);
        // if (!isEditMode) {
        setFormState((prev) => ({
          ...prev,
          model: { value: value, error: "", id: selectedOption?.id || "" },
          type: { value: "", error: "", id: "" },
        }));
        // } else {
        //   setFormState((prev) => ({
        //     ...prev,
        //     model: { value: value, error: "", id: selectedOption?.id || "" },
        //   }));
        // }
        break;

      case "type":
        currentOptions = typeOptions;
        selectedOption = currentOptions.find((opt) => opt.value === value);
        setFormState((prev) => ({
          ...prev,
          type: { value: value, error: "", id: selectedOption?.id || "" },
        }));
        break;
    }

    setIsSubmitted(false);
  };

  const setFormData = (data) => {
    setFormState({
      vehicle: { value: data.type, error: "", id: data.vehicleId || "" },
      brand: { value: data.brand, error: "", id: data.brandId || "" },
      year: { value: data.year, error: "", id: "" },
      model: { value: data.model, error: "", id: data.modelId || "" },
      type: { value: data.variant, error: "", id: data.variantId || "" },
    });
  };

  const handleSubmit = async (submitData) => {
    if (!validateForm()) {
      return;
    }
    setIsSubmitted(true);

    try {
      let response;
      const newVehicle = {
        vehicleID: formState.vehicle.id,
        brandID: formState.brand.id,
        year: formState.year.id,
        modelID: formState.model.id,
        typeID: formState.type.id,
      };

      if (submitData.type === "edit") {
        // Edit
        const editUrl = `${api}muatparts/garasi/update/${submitData.id}`;
        response = await fetch(editUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            refreshToken: `Bearer ${refreshToken}`,
          },
          body: JSON.stringify(newVehicle),
        });
      } else {
        // Create
        response = await fetch(`${api}muatparts/garasi/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            refreshToken: `Bearer ${refreshToken}`,
          },
          body: JSON.stringify(newVehicle),
        });
      }

      if (response.ok) {
        setDataToast({
          message:
            submitData.type === "edit"
              ? t("AppManajemenGarasiMuatpartsAlertSuksesMenyimpanData")
              : t("labelBerhasilMenambahkanKendaraan"),
          type: "success",
        });
        setShowToast(true);
        setModalOpen(false);
        setTriggerList(true);
        setTimeout(() => {
          if (submitData.type !== "edit" || isEditMobile)
            return router.push("/garasi/list");
        }, 2000);
      } else {
        const error = await response.json();
        setDataToast({
          message: error.Data.Message || "Terjadi kesalahan",
          type: "error",
        });
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setDataToast({
        message: "Terjadi kesalahan saat menyimpan data",
        type: "error",
      });
      setShowToast(true);
    } finally {
      setIsSubmitted(false);
    }
  };

  const validateForm = () => {
    const updatedState = { ...formState };
    let isValid = true;
    let firstErrorShown = false;

    Object.keys(formState).forEach((key) => {
      updatedState[key] = {
        ...formState[key],
        error: "",
      };
    });

    const fieldLabels = {
      vehicle: "Kendaraan",
      brand: "Brand",
      year: "Tahun",
      model: "Model",
      type: "Tipe",
    };

    const fieldOrder = ["vehicle", "brand", "year", "model", "type"];

    for (const key of fieldOrder) {
      if (!formState[key].value && !firstErrorShown) {
        updatedState[key] = {
          ...formState[key],
          error: `${
            fieldLabels[key] === "Kendaraan"
              ? t("AppManajemenGarasiMuatpartsKendaraanWajibDipilih")
              : fieldLabels[key] === "Brand"
              ? t("AppManajemenGarasiMuatpartsBrandWajibDipilih")
              : fieldLabels[key] === "Tahun"
              ? t("AppManajemenGarasiMuatpartsTahunWajibDipilih")
              : fieldLabels[key] === "Model"
              ? t("AppManajemenGarasiMuatpartsModelWajibDipilih")
              : fieldLabels[key] === "Tipe"
              ? t("AppManajemenGarasiMuatpartsTipeWajibDipilih")
              : null
          }`,
        };
        firstErrorShown = true;
        isValid = false;
        break;
      }
    }

    setFormState(updatedState);
    return isValid;
  };

  return {
    formState,
    handleChange,
    handleSubmit,
    validateForm,
    isSubmitted,
    setIsSubmitted,
    setFormData,
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
  };
};

const MainGarasiFirstTime = () => {
  const { isMobile } = viewport();
  const { dataBottomsheet } = toast();
  const formProps = useFormProps();
  const { useSWRHook } = SWRHandler();
  const { editData, isEdit, resetEditData } = garasi();
  const router = useCustomRouter();
  const isAddMobile = useSearchParams().get("isAdd");
  const isEditMobile = useSearchParams().get("isEdit");
  const [isLoading, setIsLoading] = useState(false);

  const { data: bannerImages } = useSWRHook("v1/muatparts/product/promo");

  useEffect(() => {
    const initializeEditData = async () => {
      if (isEdit && editData) {
        try {
          formProps.setFormState({
            vehicle: {
              value: editData.type,
              error: "",
              id: editData.vehicleId,
            },
            brand: { value: editData.brand, error: "", id: editData.brandId },
            year: { value: editData.year, error: "", id: editData.year },
            model: { value: editData.model, error: "", id: editData.modelId },
            type: {
              value: editData.variant,
              error: "",
              id: editData.variantId,
            },
          });
        } catch (error) {
          console.error("Error initializing edit data:", error);
        }
      }
    };

    initializeEditData();

    return () => {
      resetEditData();
    };
  }, [isEdit, editData]);

  // const { data: garageLists } = useSWRHook();
  // const [url, setUrl] = useState("");

  // useEffect(() => {
  //   setUrl(`v1/muatparts/garasi/lists`);
  // }, []);

  // useEffect(() => {
  //   console.log(garageLists?.Data?.length, garageLists, "aku di firsttimer");
  //   if (garageLists?.Data?.length > 0) return router.push("/garasi/list");
  // }, [url]);
  const { get } = ConfigUrl();

  useEffect(() => {
    setIsLoading(true);
    get({ path: "v1/muatparts/garasi/lists" }).then((x) => {
      if (isEditMobile || isAddMobile) {
        setIsLoading(false);
        return;
      }
      // console.log(x);

      if (x?.data?.Data?.length > 0) {
        router.push("/garasi/list");
      }
      setIsLoading(false);
    });
  }, []);

  return isMobile ? (
    <>
      {isLoading && <GlobalLoading />}
      <Toast />
      <MobileForm bannerImages={bannerImages?.Data ?? []} {...formProps} />
    </>
  ) : (
    <>
      {isLoading && <GlobalLoading />}
      <DesktopForm bannerImages={bannerImages?.Data ?? []} {...formProps} />
    </>
  );
};

export default MainGarasiFirstTime;
