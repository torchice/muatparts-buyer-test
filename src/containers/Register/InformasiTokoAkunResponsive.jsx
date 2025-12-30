"use client";

import { useState, useEffect } from "react";
import LocationManagement from "@/components/LocationManagement/LocationManagement";
import RadioButton from "@/components/Radio/RadioButton";
import Input from "@/components/Input/Input";
import registerForm from "@/store/registerForm";
import ImageUploaderRegister from "@/components/ImageUploader/ImageUploaderRegister";
import { Dropdown } from "@/app/garasi/page";
import SWRHandler from "@/services/useSWRHook";
import { DivParticleRegister } from "./InformasiTokoAkun";
import ImageUploaderRegisterResponsive from "@/components/ImageUploader/ImageUploaderRegisterResponsive";
import ImageUploaderResponsive from "@/components/ImageUploader/ImageUploaderResponsive";
import Bottomsheet from "@/components/Bottomsheet/Bottomsheet";
import toast from "@/store/toast";

const api = process.env.NEXT_PUBLIC_API_HASYIM;

const InformasiTokoAkunResponsive = () => {
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [manajemenLokasi, setManajemenLokasi] = useState();
  const [defaultManajemenLokasi, setDefaultManajemenLokasi] = useState(null);
  const { formData, errors, handleInputChange } = registerForm();
  const { useSWRHook } = SWRHandler();
  const { dataBottomsheet } = toast();

  // API Calls
  const { data: dataBusinessEntity } = useSWRHook("/business_entity");
  const { data: merchantData } = useSWRHook(
    formData[0].tipeToko === 0
      ? api + "v1/register/merchant_personal"
      : api + "v1/register/merchant_company"
  );

  // Handle initial data load
  useEffect(() => {
    if (merchantData?.Data) {
      handleInitialData(merchantData.Data);
      setLocationManagementData(merchantData);
      setBusinessEntityData(merchantData.Data, dataBusinessEntity?.Data);
    }
  }, [merchantData, dataBusinessEntity]);

  // Handle location management updates
  useEffect(() => {
    if (manajemenLokasi) {
      handleInputChange("address", manajemenLokasi.address);
      handleInputChange("location", manajemenLokasi.location?.title);
      handleInputChange("districtID", manajemenLokasi.district?.value);
      handleInputChange("cityID", manajemenLokasi.city?.id);
      handleInputChange("provinceID", manajemenLokasi.province?.id);
      handleInputChange("postalCode", manajemenLokasi.postalCode?.value);
      handleInputChange("latitude", manajemenLokasi.coordinates?.lat);
      handleInputChange("longitude", manajemenLokasi.coordinates?.long);
    }
  }, [manajemenLokasi]);

  useEffect(() => {
    if (defaultManajemenLokasi) {
      handleInputChange("address", defaultManajemenLokasi.address);
      handleInputChange("location", defaultManajemenLokasi.location?.title);
      handleInputChange("districtID", defaultManajemenLokasi.district?.value);
      handleInputChange("cityID", defaultManajemenLokasi.city?.id);
      handleInputChange("provinceID", defaultManajemenLokasi.province?.id);
      handleInputChange("postalCode", defaultManajemenLokasi.postalCode?.name);
      handleInputChange("latitude", defaultManajemenLokasi.coordinates?.lat);
      handleInputChange("longitude", defaultManajemenLokasi.coordinates?.long);
    }
  }, [defaultManajemenLokasi]);

  // Helper Functions
  const handleInitialData = (data) => {
    Object.entries(data).forEach(([key, value]) =>
      handleInputChange(key, value)
    );
  };

  const setLocationManagementData = (data) => {
    const formattedLocation = {
      address: data.addressDetail,
      location: { title: data.address },
      district: { name: data.districtDescription, value: data.districtID },
      city: { name: data.cityDescription, id: data.cityID },
      province: { name: data.provinceDescription, id: data.provinceID },
      postalCode: { name: data.postalCode },
      coordinates: { lat: data.latitude, long: data.longitude },
      listPostalCodes: data.postalCodes,
      listDistricts: data.Districts,
    };
    setDefaultManajemenLokasi(formattedLocation);
  };

  const setBusinessEntityData = (merchantData, businessEntities) => {
    if (merchantData.businessEntityID && businessEntities) {
      const entity = businessEntities.find(
        (item) => item.ID == merchantData.businessEntityID
      );
      console.log(entity, " tokeek");
      if (entity) setSelectedEntityId(entity.Description);
    }
  };

  const handleChangeBadanUsaha = (description) => {
    const entity = dataBusinessEntity?.Data?.find(
      (item) => item.Description === description
    );
    handleInputChange("businessEntityID", entity?.ID || null);
    setSelectedEntityId(description);
  };

  const handleTipeTokoChange = (idx) => {
    setSelectedEntityId("");
    handleInputChange("companyName", "");
    handleInputChange("businessEntityID", null);
    handleInputChange("tipeToko", idx);
  };

  const handleInputWithTrim = (field, value) => {
    handleInputChange(field, value.trimStart());
  };

  return (
    <div className="pt-8 px-4 pb-24 bg-white min-h-screen">
      {/* <Bottomsheet>{dataBottomsheet}</Bottomsheet> */}
      <h1 className="text-sm font-semibold text-neutral-900 mb-5">
        Informasi Toko
      </h1>

      <div className="space-y-4">
        {/* Tipe Toko */}
        <DivParticleRegister title="Tipe Toko" mustFill={false}>
          <div className="flex gap-[18px]">
            {[
              { label: "Individu", value: 0 },
              { label: "Badan Usaha", value: 1 },
            ].map(({ label, value }) => (
              <RadioButton
                key={value}
                label={label}
                name="tipe_toko"
                checked={value === formData[0].tipeToko}
                onClick={() => handleTipeTokoChange(value)}
              />
            ))}
          </div>
        </DivParticleRegister>
        {/* Conditional Company Fields */}
        {formData[0].tipeToko === 1 && (
          <>
            <DivParticleRegister title="Nama Perusahaan">
              <Input
                status={errors.companyName ? "error" : ""}
                supportiveText={{
                  title: errors.companyName || "",
                }}
                placeholder="Masukkan Nama Perusahaan"
                value={formData[0].companyName}
                changeEvent={(e) =>
                  handleInputWithTrim("companyName", e.target.value)
                }
              />
            </DivParticleRegister>

            <DivParticleRegister title="Badan Usaha">
              <div className="flex flex-col gap-1">
                <Dropdown
                  withSearch={false}
                  label="Pilih Badan Usaha"
                  value={selectedEntityId}
                  onChange={handleChangeBadanUsaha}
                  options={dataBusinessEntity?.Data?.map(
                    (item) => item.Description
                  )}
                  classname={`!w-full ${
                    errors.businessEntityID
                      ? "!border-error-400"
                      : "!border-neutral-600"
                  }`}
                />
                {errors.businessEntityID && (
                  <span className="text-[12px] font-medium text-error-400">
                    {errors.businessEntityID}
                  </span>
                )}
              </div>
            </DivParticleRegister>
          </>
        )}
        {/* Store Name */}
        <DivParticleRegister title="Nama Toko">
          <Input
            status={errors.storeName ? "error" : ""}
            supportiveText={{
              title: errors.storeName || "",
              desc: `${formData[0].storeName.length}/60`,
            }}
            placeholder="Masukkan Nama Toko"
            maxLength="60"
            value={formData[0].storeName}
            changeEvent={(e) =>
              handleInputWithTrim("storeName", e.target.value)
            }
            classInput="!max-w-full"
          />
        </DivParticleRegister>
        {/* Store Logo */}
        <DivParticleRegister
          title="Logo Toko"
          mustFill={false}
          classname="!items-center"
        >
          <ImageUploaderRegisterResponsive
            value={(e) => handleInputChange("logo", e)}
            defaultValue={formData[0].logo}
          />
        </DivParticleRegister>
        {/* Location Management */}
        <LocationManagement
          value={setManajemenLokasi}
          defaultValue={defaultManajemenLokasi}
          errors={errors}
        />
        {/* Email */}
        <DivParticleRegister title="Email">
          {merchantData?.Data?.isVerifEmail ? (
            <span className="text-xs font-medium text-neutral-900">
              {formData[0].email}
            </span>
          ) : (
            <Input
              status={errors.email ? "error" : ""}
              supportiveText={{
                title: errors.email || "",
              }}
              value={formData[0].email}
              placeholder="Masukkan Email"
              maxLength="60"
              changeEvent={(e) => handleInputChange("email", e.target.value)}
            />
          )}
        </DivParticleRegister>
      </div>
    </div>
  );
};

export default InformasiTokoAkunResponsive;
