"use client";

import { useState, useEffect } from "react";
import ImageUploaderRegister from "@/components/ImageUploader/ImageUploaderRegister";
import style from "./Profileseller.module.scss";
import profileSeller from "@/store/profileSeller";
import { BadgeCheck, TriangleAlert } from "lucide-react";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useSWRConfig } from "swr";
import SWRHandler from "@/services/useSWRHook";
import Button from "@/components/Button/Button";
import { handleCopy, handleDownload } from "@/libs/services";
import Input from "@/components/Input/Input";
import LocationManagement from "@/components/LocationManagement/LocationManagement";
import "./Profileseller.scss";
import MiniMap from "@/containers/MapContainer/MiniMap";
import MapContainer from "@/containers/MapContainer/MapContainer";
import ModalComponent from "@/components/Modals/ModalComponent";

const api = process.env.NEXT_PUBLIC_GLOBAL_API;

function ProfilesellerWeb({ handleSaveStore, handleSaveCompany }) {
  return (
    <div className={style.main}>
      <ProfileHeaderContent />
      <div className="flex gap-1 mt-10 mb-4">
        <div
          className={`px-6 py-3 text-base cursor-pointer font-bold text-primary-700 border-b border-b-primary-700 w-fit`}
        >
          Informasi Toko
        </div>
        <div className="border-r border-r-neutral-400"></div>
      </div>
      <div className="space-y-4">
        <DataToko
          handleSaveStore={handleSaveStore}
          handleSaveCompany={handleSaveCompany}
        />
        <KelengkapanLegalitas />
      </div>
    </div>
  );
}

export default ProfilesellerWeb;

export const ProfileHeaderContent = () => {
  const { profileData } = profileSeller();
  const { useSWRMutateHook } = SWRHandler();
  const { mutate } = useSWRConfig();
  const { trigger: changeFotoProfil } = useSWRMutateHook(
    `${api}/muatparts/profile/update_avatar_url`,
    "PUT"
  );

  const changePhotoHeader = async (val) => {
    try {
      const formData = new URLSearchParams();
      formData.append("file", val);
      await changeFotoProfil(formData.toString());
      mutate(`${api}/muatparts/profile/update_avatar_url`);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  if (!profileData) return <Skeleton fill={1} />;

  const verifiedBadge = (
    <span className="bg-white text-success-400 font-semibold text-xs flex gap-[2px] items-center -mt-[1px]">
      <BadgeCheck
        fill="#0FBB81"
        color="white"
        size={16}
        className="-mt-[2px]"
      />
      Verified
    </span>
  );

  return (
    <div className="flex items-center gap-8">
      <ImageUploaderRegister
        type={2}
        value={changePhotoHeader}
        defaultValue={profileData.profile.avatar}
      />
      <div className="space-y-4">
        <h2 className="text-sm font-bold">{profileData.profile.name}</h2>
        <div className="grid grid-cols-2 gap-x-16 gap-y-4">
          {[
            {
              label: "No. WhatsApp",
              value: profileData.profile.noWA,
              badge: verifiedBadge,
            },
            {
              label: "Email",
              value: profileData.profile.email,
              badge: verifiedBadge,
            },
            {
              label: "Jenis Akun",
              value: profileData.profile.accountType,
            },
            {
              label: "Kode Referral",
              value: profileData.profile.refferalCode,
              copyable: true,
            },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-[4px]">
              <span className="text-neutral-600 text-xs font-medium">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{item.value}</span>
                {item.badge}
                {item.copyable && (
                  <IconComponent
                    src="/icons/copymuatpartsred.svg"
                    size="small"
                    onclick={() =>
                      handleCopy(item.value, "Kode Referal berhasil disalin!")
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CardContainerProfile = ({ title, children, subTitle }) => {
  return (
    <div className="w-full border rounded-lg border-neutral-400 bg-neutral-100">
      <div className="p-8 flex flex-col gap-[18px]">
        <span className="text-neutral-900 text-lg font-semibold block">
          {title}
        </span>
        {subTitle}
      </div>
      {children}
    </div>
  );
};

export const DivParticleProfile = ({ title, children, mustFill }) => {
  return (
    <div className="flex gap-[46px] items-center w-full px-8 py-4">
      <span className="font-medium text-xs text-neutral-600 w-[300px]">
        {title}
        {mustFill && "*"}
      </span>
      {children}
    </div>
  );
};

const StoreSection = ({
  type,
  data,
  isEditMode,
  setIsEditMode,
  locationProps,
  handleSaveStore,
  handleSaveCompany,
}) => {
  const {
    storeEdit,
    updateStoreField,
    updateCompanyField,
    companyEdit,
    initializeStoreEdit,
    initializeCompanyEdit,
    errors,
  } = profileSeller();
  const [isOpenMap, setOpenMap] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      if (type === "store") {
        initializeStoreEdit();
      } else {
        initializeCompanyEdit();
      }
    }
  }, [isEditMode, type]);

  const renderContent = () => {
    if (type === "company" && !data.isCross) {
      return [
        {
          label: "Nama Perusahaan",
          value: data?.companyName || "-",
          type: "text",
          key: "companyName",
        },
        {
          label: "Badan Usaha",
          value: data?.businessEntity || "-",
          type: "text",
          key: "businessEntity",
        },
      ];
    }

    const fields =
      type === "company"
        ? [
            {
              label: "Logo Perusahaan",
              value:
                data?.companyLogo ||
                "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1733985462989.webp",
              type: "logo",
              key: "companyLogo",
            },
            {
              label: "Nama Perusahaan",
              value: data?.companyName || "-",
              type: "text",
              key: "companyName",
            },
            {
              label: "Badan Usaha",
              value: data?.businessEntity || "-",
              type: "text",
              key: "businessEntity",
            },
            {
              label: "Bidang Usaha",
              value: data?.businessField || "-",
              type: "text",
              key: "businessField",
            },
          ]
        : [
            {
              label: "Nama Toko",
              value: data?.storeName || "-",
              type: "input",
              key: "storeName",
            },
            {
              label: "Logo Toko",
              value:
                data?.storeLogo ||
                "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1733985462989.webp",
              type: "logo",
              key: "storeLogo",
            },
          ];

    // Add location fields in view mode
    if (!isEditMode) {
      return [
        ...fields,
        { label: "Alamat", value: data?.address || "-", type: "text" },
        { label: "Lokasi", value: data?.location || "-", type: "text" },
        { label: "Kecamatan", value: data?.district || "-", type: "text" },
        { label: "Kota", value: data?.city || "-", type: "text" },
        { label: "Provinsi", value: data?.province || "-", type: "text" },
        { label: "Kode Pos", value: data?.postalCode || "-", type: "text" },
        {
          label: "Titik Lokasi",
          value:
            data?.latitude && data?.longitude
              ? `${data.latitude}, ${data.longitude}`
              : "-",
          type: "map",
          coordinates: {
            lat: Number(data?.latitude),
            long: Number(data?.longitude),
          },
          key: "coordinates",
        },
      ];
    }

    return fields;
  };

  const handleSave = async () => {
    try {
      if (type === "store") {
        await handleSaveStore(data?.id, storeEdit.data);
      } else {
        await handleSaveCompany(data?.id, companyEdit.data);
      }
      setIsEditMode(false);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <CardContainerProfile
      title={
        type === "company" && !data.isCross
          ? null
          : type === "company"
          ? null
          : "Data Toko"
      }
      subTitle={
        <>
          {type === "company" ? (
            <>
              <div className="flex justify-between gap-2">
                <span className="text-neutral-900 text-lg font-semibold block">
                  Data Perusahaan
                </span>
                {data.isCross && (
                  <Button
                    onClick={
                      isEditMode ? handleSave : () => setIsEditMode(true)
                    }
                    Class="!h-8 !font-semibold !text-sm"
                  >
                    {isEditMode ? "Simpan Data" : "Ubah Data"}
                  </Button>
                )}
              </div>
              {isEditMode && (
                <div className="flex items-center gap-2 rounded-md py-4 px-6 bg-secondary-100">
                  <TriangleAlert color="#FF7A00" />
                  <span className="font-medium text-xs text-neutral-900">
                    Data pada halaman profil Big Fleets / Transport Market akan
                    berubah sesuai dengan data yang diubah pada halaman ini.
                  </span>
                </div>
              )}
            </>
          ) : type === "map" ? (
            <div className="w-full">
              <MiniMap
                lat={field?.coordinates.lat || -7.250445}
                lng={field?.coordinates.long || 112.768845}
                onClick={() => setOpenMap(true)}
                titleButton="Lihat Lokasi"
              />
              <ModalComponent
                isOpen={isOpenMap}
                setClose={() => setOpenMap(false)}
                hideHeader
              >
                <div className="flex item-start gap-4 pt-[14px] px-3">
                  <MapContainer
                    width={600}
                    height={390}
                    lat={field?.coordinates.lat || -7.250445}
                    lng={field?.coordinates.long || 112.768845}
                    onPosition={(val) => {
                      if (type === "store") {
                        updateStoreField("latitude", Number(val.lat));
                        updateStoreField("longitude", Number(val.lng));
                      } else {
                        updateCompanyField("latitude", Number(val.lat));
                        updateCompanyField("longitude", Number(val.lng));
                      }
                    }}
                  />
                  <div className="flex flex-col gap-[22px]">
                    <span className="text-base font-semibold text-neutral-900">
                      Lihat Lokasi
                    </span>
                    <div className="relative">
                      <IconComponent
                        classname="absolute"
                        size="medium"
                        src={"/icons/marker.svg"}
                      />
                      <span className="flex items-center gap-2 w-[237px] font-medium text-[#868686] text-xs pl-[25px]">
                        {data?.location}
                      </span>
                    </div>
                  </div>
                </div>
              </ModalComponent>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="w-full justify-between items-center flex">
                <div className="flex items-center gap-2">
                  <IconComponent src="/icons/datatokonotif.svg" size="small" />
                  <span className="font-normal text-xs text-neutral-900">
                    Data Toko akan ditampilkan pada profilmu untuk pengguna
                    lainnya
                  </span>
                </div>
                <Button
                  onClick={isEditMode ? handleSave : () => setIsEditMode(true)}
                  Class="!h-8 !font-semibold !text-sm"
                >
                  {isEditMode ? "Simpan Data" : "Ubah Data"}
                </Button>
              </div>
            </div>
          )}
        </>
      }
    >
      <div>
        {[
          ...renderContent().map((field) => ({
            type: "basic",
            content: (
              <DivParticleProfile title={field.label}>
                <div className="flex justify-between items-center w-full">
                  {field.type === "map" ? (
                    <div className="w-full">
                      <MiniMap
                        lat={field?.coordinates.lat || -7.250445}
                        lng={field?.coordinates.long || 112.768845}
                        onClick={() => setOpenMap(true)}
                        titleButton="Lihat Lokasi"
                      />
                      <ModalComponent
                        isOpen={isOpenMap}
                        setClose={() => setOpenMap(false)}
                        hideHeader
                      >
                        <div className="flex item-start gap-4 pt-[14px] px-3">
                          <MapContainer
                            width={600}
                            height={390}
                            lat={field?.coordinates.lat || -7.250445} // Change long to lng
                            lng={field?.coordinates.long || 112.768845} // Change long to lng
                            onPosition={(val) => {
                              if (type === "store") {
                                updateStoreField("latitude", Number(val.lat));
                                updateStoreField("longitude", Number(val.lng));
                              } else {
                                updateCompanyField("latitude", Number(val.lat));
                                updateCompanyField(
                                  "longitude",
                                  Number(val.lng)
                                );
                              }
                            }}
                          />
                          <div className="flex flex-col gap-[22px]">
                            <span className="text-base font-semibold text-neutral-900">
                              Lihat Lokasi
                            </span>
                            <div className="relative">
                              <IconComponent
                                classname="absolute"
                                size="medium"
                                src={"/icons/marker.svg"}
                              />
                              <span className="flex items-center gap-2 w-[237px] font-medium text-[#868686] text-xs pl-[25px]">
                                {data?.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </ModalComponent>
                    </div>
                  ) : field.type === "logo" ? (
                    // Existing logo rendering logic
                    isEditMode ? (
                      <ImageUploaderRegister
                        value={(e) => {
                          if (type === "store") {
                            updateStoreField("storeLogo", e);
                          } else {
                            updateCompanyField("companyLogo", e);
                          }
                        }}
                        defaultValue={field.value}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={field.value}
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  ) : field.type === "input" && isEditMode ? (
                    // Existing input rendering logic
                    <Input
                      classname="!min-w-[363px]"
                      status={errors?.[field.key] ? "error" : ""}
                      maxLength="60"
                      supportiveText={{
                        title: errors?.[field.key] || "",
                        desc: `${
                          type === "store"
                            ? storeEdit?.data?.[field.key].length
                            : companyEdit?.data?.[field.key].length
                        }/60`,
                      }}
                      placeholder={`Masukkan ${field.label}`}
                      value={
                        type === "store"
                          ? storeEdit?.data?.[field.key] || ""
                          : companyEdit?.data?.[field.key] || ""
                      }
                      changeEvent={(e) => {
                        const value = e.target.value;
                        if (type === "store") {
                          updateStoreField(field.key, value);
                        } else {
                          updateCompanyField(field.key, value);
                        }
                      }}
                    />
                  ) : (
                    // Default text rendering
                    <p className="font-medium text-xs text-neutral-900">
                      {field.value}
                    </p>
                  )}
                </div>
              </DivParticleProfile>
            ),
          })),
          isEditMode
            ? {
                type: "location",
                content: (
                  <div className="manlokContainer">
                    <LocationManagement
                      value={locationProps.setManajemenLokasi}
                      defaultValue={locationProps.defaultManajemenLokasi}
                      errors={locationProps.errors}
                    />
                  </div>
                ),
              }
            : null,
        ]
          .filter(Boolean)
          .map((item, index, array) => (
            <div
              key={index}
              className={`${index % 2 === 0 ? "bg-white" : "bg-neutral-100"} ${
                index === array.length - 1 ? "rounded-b-lg" : ""
              }`}
            >
              {item.content}
            </div>
          ))}
      </div>
    </CardContainerProfile>
  );
};

export const DataToko = ({ handleSaveStore, handleSaveCompany }) => {
  const [isEditCompany, setIsEditCompany] = useState(false);
  const [isEditStore, setIsEditStore] = useState(false);
  const [manajemenLokasi, setManajemenLokasi] = useState();
  const [defaultManajemenLokasi, setDefaultManajemenLokasi] = useState(null);
  const { profileData, errors } = profileSeller();
  const { updateStoreField, updateCompanyField } = profileSeller();

  useEffect(() => {
    if (!profileData) return;

    const storeInfo =
      profileData?.profile?.accountType === "Perusahaan"
        ? profileData?.storeInformation
        : profileData?.companyData;

    if (storeInfo) {
      setDefaultManajemenLokasi({
        address: storeInfo.address,
        location: { title: storeInfo.location },
        district: { name: storeInfo.district, value: storeInfo.districtID },
        city: { name: storeInfo.city, id: storeInfo.cityID },
        province: { name: storeInfo.province, id: storeInfo.provinceID },
        postalCode: { name: storeInfo.postalCode },
        coordinates: { lat: storeInfo.latitude, long: storeInfo.longitude },
        listPostalCodes: storeInfo.listPostalCode,
        listDistricts: storeInfo.listDistrict,
      });
    }
  }, [profileData, isEditStore, isEditCompany]);

  useEffect(() => {
    console.log(manajemenLokasi);
    if (manajemenLokasi && isEditStore) {
      updateStoreField("address", manajemenLokasi.address);
      updateStoreField("location", manajemenLokasi.location?.title);
      updateStoreField("districtID", manajemenLokasi.district?.value);
      updateStoreField("cityID", manajemenLokasi.city?.id);
      updateStoreField("provinceID", manajemenLokasi.province?.id);
      updateStoreField("postalCode", manajemenLokasi.postalCode?.value);
      updateStoreField("latitude", manajemenLokasi.coordinates?.lat);
      updateStoreField("longitude", manajemenLokasi.coordinates?.long);
    }
    if (manajemenLokasi && isEditCompany) {
      updateCompanyField("address", manajemenLokasi.address);
      updateCompanyField("location", manajemenLokasi.location?.title);
      updateCompanyField("districtID", manajemenLokasi.district?.value);
      updateCompanyField("cityID", manajemenLokasi.city?.id);
      updateCompanyField("provinceID", manajemenLokasi.province?.id);
      updateCompanyField("postalCode", manajemenLokasi.postalCode?.value);
      updateCompanyField("latitude", manajemenLokasi.coordinates?.lat);
      updateCompanyField("longitude", manajemenLokasi.coordinates?.long);
    }
  }, [manajemenLokasi]);

  if (!profileData) return <Skeleton fill={5} />;

  const isCompany = profileData?.profile?.accountType === "Perusahaan";
  const locationProps = {
    manajemenLokasi,
    setManajemenLokasi,
    defaultManajemenLokasi,
    errors,
  };

  return (
    <div className="space-y-4">
      {isCompany && profileData?.companyData?.isCross && (
        <StoreSection
          type="company"
          data={profileData?.companyData}
          isEditMode={isEditCompany}
          setIsEditMode={setIsEditCompany}
          locationProps={locationProps}
          handleSaveStore={handleSaveStore}
          handleSaveCompany={handleSaveCompany}
        />
      )}
      <StoreSection
        type="store"
        data={profileData?.storeInformation}
        isEditMode={isEditStore}
        setIsEditMode={setIsEditStore}
        locationProps={locationProps}
        handleSaveStore={handleSaveStore}
        handleSaveCompany={handleSaveCompany}
      />
      {isCompany && !profileData?.companyData?.isCross && (
        <StoreSection
          type="company"
          data={profileData?.companyData}
          isEditMode={false}
          setIsEditMode={() => {}}
          locationProps={locationProps}
          handleSaveStore={handleSaveStore}
          handleSaveCompany={handleSaveCompany}
        />
      )}
    </div>
  );
};

export const KelengkapanLegalitas = () => {
  const { profileData } = profileSeller();

  if (!profileData?.legality) return <Skeleton fill={3} />;

  const legalInfo = [
    {
      label: "KTP Pendaftar",
      value: <span className="text-success-400">File KTP.png</span>,
      button: profileData.legality.fileKTP,
    },
    { label: "No. KTP Pendaftar", value: profileData.legality.noKTP },
    { label: "Nama KTP Pendaftar", value: profileData.legality.nameKTP },
    ...(profileData.legality.noNPWP
      ? [
          {
            label: "NPWP Badan Usaha",
            value: <span className="text-success-400">File NPWP.png</span>,
            button: profileData.legality.fileNPWP,
          },
          { label: "No. NPWP Badan Usaha", value: profileData.legality.noNPWP },
        ]
      : []),
  ];

  return (
    <CardContainerProfile title="Kelengkapan Legalitas">
      {legalInfo.map((item, index) => (
        <div
          key={item.label}
          className={`flex items-center justify-between ${
            index % 2 !== 0 ? "bg-neutral-100" : "bg-white"
          } ${index === legalInfo.length - 1 && "rounded-b-lg"}`}
        >
          <DivParticleProfile title={item.label}>
            <div className="flex justify-between items-center w-full">
              <p className="font-medium text-xs text-neutral-900">
                {item.value}
              </p>
              {item.button && (
                <Button
                  onClick={() =>
                    handleDownload(
                      item.button,
                      `ktp_${profileData.legality.nameKTP}_${profileData.legality.noKTP}`
                    )
                  }
                  Class="!h-8 !font-semibold !text-sm"
                >
                  Download
                </Button>
              )}
            </div>
          </DivParticleProfile>
        </div>
      ))}
    </CardContainerProfile>
  );
};

export const Skeleton = ({ fill }) => {
  return (
    <>
      <div className="w-full rounded-lg border h-fit p-3 flex flex-col gap-2">
        {Array(fill)
          .fill()
          .map((_, idx) => {
            return (
              <div
                key={idx}
                className="animate-pulse w-full rounded-lg border h-4 bg-neutral-600"
              ></div>
            );
          })}
      </div>
    </>
  );
};
