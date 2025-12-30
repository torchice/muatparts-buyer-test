"use client";

import { useState, useEffect } from "react";
import LocationManagement from "@/components/LocationManagement/LocationManagement";
import RadioButton from "@/components/Radio/RadioButton";
import Input from "@/components/Input/Input";
import registerForm from "@/store/registerForm";
import ImageUploaderRegister from "@/components/ImageUploader/ImageUploaderRegister";
import { Dropdown } from "@/app/garasi/page";
import SWRHandler from "@/services/useSWRHook";

const api = process.env.NEXT_PUBLIC_API_HASYIM;

const InformasiTokoAkun = () => {
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [manajemenLokasi, setManajemenLokasi] = useState();
  const [defaultManajemenLokasi, setDefaultManajemenLokasi] = useState(null);
  const { formData, errors, handleInputChange } = registerForm();
  const { useSWRHook } = SWRHandler();

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
      setLocationManagementData(merchantData.Data);
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
    <>
      <span className="text-neutral-900 font-semibold text-lg block mb-4 mx-12">
        Informasi Toko
      </span>

      <div className="flex flex-col space-y-4 mx-12">
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
          />
        </DivParticleRegister>

        {/* Store Logo */}
        <DivParticleRegister
          title="Logo Toko"
          mustFill={false}
          classname="!items-center"
        >
          <ImageUploaderRegister
            value={(e) => handleInputChange("logo", e)}
            defaultValue={formData[0].logo}
          />
        </DivParticleRegister>
      </div>

      {/* Location Management */}
      <LocationManagement
        value={setManajemenLokasi}
        defaultValue={defaultManajemenLokasi}
        errors={errors}
      />

      {/* Email */}
      <DivParticleRegister title="Email" classname="mx-12">
        {merchantData?.Data?.isVerifEmail ? (
          <span className="text-xs font-medium text-neutral-900">{formData[0].email}</span>
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
    </>
  );
};

export const DivParticleRegister = ({
  title,
  children,
  mustFill = true,
  classname,
  classLabel,
  classValue,
}) => (
  <div
    className={`flex sm:flex-col sm:gap-2 sm:w-full items-baseline ${classname}`}
  >
    <label
      className={`w-1/3 text-neutral-600 font-medium sm:font-semibold sm:text-sm sm:text-neutral-900 sm:w-full text-xs ${classLabel}`}
    >
      {title}
      {mustFill && "*"}
    </label>
    <div className={`w-2/3 sm:w-full ${classValue}`}>{children}</div>
  </div>
);

export default InformasiTokoAkun;
