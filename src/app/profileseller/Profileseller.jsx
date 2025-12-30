"use client";

import { viewport } from "@/store/viewport";
import { useState, useEffect } from "react";
import ProfilesellerResponsive from "./ProfilesellerResponsive";
import ProfilesellerWeb from "./ProfilesellerWeb";
import SWRHandler from "@/services/useSWRHook";
import profileSeller from "@/store/profileSeller";
import { useSWRConfig } from "swr";

const api = process.env.NEXT_PUBLIC_GLOBAL_API;

function Profileseller() {
  const { profileData, setProfileData } = profileSeller();
  const { useSWRHook, useSWRMutateHook } = SWRHandler();
  const { isMobile } = viewport();
  const { mutate } = useSWRConfig();

  // Get initial profile data
const { data: dataProfile } = useSWRHook(
  `/muatparts/profile`,
  null,
  null, // cbError parameter
  {
    headers: {
      Authorization:
        "Bearer OWU5Yjg1Y2E4Y2MzNTUzYTViZTAyMjA5YjZhMjcxMGYxNzlmMTcwNw--",
    },
  }
);

  // Initialize SWR Handlers dengan key yang sesuai format API
  const { trigger: updateStoreTrigger } = useSWRMutateHook(
    `/muatparts/profile/${profileData?.storeInformation?.id}`,
    "PUT"
  );

  const { trigger: updateCompanyTrigger } = useSWRMutateHook(
    `/muatparts/profile/company/${profileData?.companyData?.id}`,
    "PUT"
  );

  const handleSaveStore = async (id, data) => {
    try {
      await updateStoreTrigger(
        {
          storeName: data.storeName,
          address: data.address,
          location: data.location,
          provinceID: data.provinceID,
          cityID: data.cityID,
          districtID: data.districtID,
          postalCode: data.postalCode,
          latitude: data.latitude,
          longitude: data.longitude,
          storeLogo: data.storeLogo,
        },
        `/muatparts/profile/${id}`
      );

      mutate(`/muatparts/profile`);
    } catch (error) {
      console.error("Save store error:", error);
      throw error;
    }
  };

  const handleSaveCompany = async (id, data) => {
    try {
      await updateCompanyTrigger(
        {
          address: data.address,
          location: data.location,
          provinceID: data.provinceID,
          cityID: data.cityID,
          districtID: data.districtID,
          postalCode: data.postalCode,
          latitude: data.latitude,
          longitude: data.longitude,
          companyLogo: data.companyLogo,
        },
        `/muatparts/profile/company/${id}`
      ); // URL sebenarnya sebagai parameter kedua

      mutate(`/muatparts/profile`);
    } catch (error) {
      console.error("Save company error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (dataProfile?.Data) {
      setProfileData(dataProfile.Data);
    }
  }, [dataProfile, setProfileData]);

  if (typeof isMobile !== "boolean") return <></>;
  if (isMobile)
    return (
      <ProfilesellerResponsive
        handleSaveStore={handleSaveStore}
        handleSaveCompany={handleSaveCompany}
      />
    );
  return (
    <ProfilesellerWeb
      handleSaveStore={handleSaveStore}
      handleSaveCompany={handleSaveCompany}
    />
  );
}

export default Profileseller;
