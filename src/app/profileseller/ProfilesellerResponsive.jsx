import { useHeader } from "@/common/ResponsiveContext";
import { useState, useEffect } from "react";
import profileSeller from "@/store/profileSeller";
import Button from "@/components/Button/Button";
import { BadgeCheck, Download, Info, PencilLine } from "lucide-react";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import LocationManagement from "@/components/LocationManagement/LocationManagement";
import { handleCopy, handleDownload } from "@/libs/services";
import style from "./Profileseller.module.scss";
import MiniMap from "@/containers/MapContainer/MiniMap";
import MapContainer from "@/containers/MapContainer/MapContainer";
import ModalComponent from "@/components/Modals/ModalComponent";
import { Skeleton } from "./ProfilesellerWeb";
import toast from "@/store/toast";
import Bottomsheet from "@/components/Bottomsheet/Bottomsheet";
import EditStoreScreen from "./EditStoreScreen";
import EditCompanyScreen from "./EditCompanyScreen";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

function ProfilesellerResponsive({ handleSaveStore, handleSaveCompany }) {
  const {
    appBarType, //pilih salah satu : 'header_title_secondary' || 'header_search_secondary' || 'default_search_navbar_mobile' || 'header_search' || 'header_title'
    appBar, // muncul ini : {onBack:null,title:'',showBackButton:true,appBarType:'',appBar:null,header:null}
    renderAppBarMobile, // untuk render komponen header mobile dengan memasukkanya ke useEffect atau by trigger function / closer
    setAppBar, // tambahkan payload seperti ini setAppBar({onBack:()=>setScreen('namaScreen'),title:'Title header',appBarType:'type'})
    handleBack, // dipanggil di dalam button di luar header, guna untuk kembali ke screen sebelumnya
    clearScreen, // reset appBar
    setScreen, // set screen
    screen, // get screen,
    search, // {placeholder:'muatparts',value:'',type:'text'}
    setSearch, // tambahkan payload seperti ini {placeholder:'Pencarian',value:'',type:'text'}
  } = useHeader();
  const { profileData } = profileSeller();

  useEffect(() => {
    setScreen("main");
    setAppBar({
      renderAppBar: <HeaderProfileResponsive />,
    });
  }, []);

  useEffect(() => {
    if (screen === "main") {
      clearScreen();
      setAppBar({
        renderAppBar: <HeaderProfileResponsive />,
      });
    } else if (screen === "edit-store") {
      setAppBar({
        title: "Ubah Data Toko",
        appBarType: "header_title",
        showBackButton: true,
        onBack: () => {
          clearScreen();
          setScreen("main");
        },
      });
    } else if (screen === "edit-company") {
      setAppBar({
        title: "Ubah Data Perusahaan",
        appBarType: "header_title",
        showBackButton: true,
        onBack: () => {
          clearScreen();
          setScreen("main");
        },
      });
    }
  }, [screen]);

  if (!profileData) return <Skeleton fill={5} />;

  if (screen === "editStore") {
    return (
      <EditStoreScreen
        handleSaveStore={handleSaveStore}
        onCancel={() => {
          setScreen("main");
          clearScreen();
        }}
        setScreen={setScreen}
        clearScreen={clearScreen}
      />
    );
  } else if (screen === "editCompany") {
    return (
      <EditCompanyScreen
        handleSaveCompany={handleSaveCompany}
        onCancel={() => {
          setScreen("main");
          clearScreen();
        }}
        setScreen={setScreen}
        clearScreen={clearScreen}
      />
    );
  }

  // main screen
  return (
    <div className="min-h-screen relative">
      <Bottomsheet />
      <div className="bg-[#C22716] h-[260px] relative">
        <ImageComponent
          src="/img/fallinstartheader.png"
          className="absolute right-0 top-6"
        />
      </div>
      <div className="bg-white absolute w-full top-[10%] rounded-t-[10px]">
        <div className="space-y-4 relative bg-[#F6F6F6] rounded-t-[10px]">
          <ProfileHeaderContentMobile />
          <DataToko
            handleSaveStore={handleSaveStore}
            handleSaveCompany={handleSaveCompany}
          />
          <KelengkapanLegalitas />
        </div>
      </div>
    </div>
  );
}

export default ProfilesellerResponsive;

const HeaderProfileResponsive = () => {
  return (
    <div className="flex justify-center">
      <span className="font-bold text-base text-white">Profil Toko</span>
    </div>
  );
};

const ProfileHeaderContentMobile = () => {
  const { profileData } = profileSeller();

  if (!profileData) return null;

  const verifiedBadge = (
    <span className="text-success-400 text-xs flex gap-[2px] items-center">
      <BadgeCheck fill="#0FBB81" color="white" size={16} />
      Verified
    </span>
  );

  const infoList = [
    {
      label: "No. Whatsapp",
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
      label: "Kode Referal",
      value: profileData.profile.refferalCode,
      copyable: true,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-4 space-y-4 rounded-t-[10px]">
      <div className="flex flex-col items-center gap-4 -mt-16">
        <div className="w-[94px] h-[94px] border-8 border-white rounded-full relative">
          <img
            src={profileData.profile.avatar}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
          <div
            className="absolute top-12 -right-4 rounded-full bg-white border border-primary-700 w-[35px] h-[35px] flex justify-center items-center"
            onClick={() => handleUploadAvatar()}
          >
            <PencilLine size={12} className="text-primary-700" />
          </div>
        </div>

        <h1 className="font-bold">{profileData.profile.name}</h1>
      </div>

      <div className="space-y-3 pt-5">
        {infoList.map((item) => (
          <div key={item.label} className="space-y-1">
            <p className="text-neutral-700 text-sm font-medium">{item.label}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold truncate max-w-[234px]">
                {item.value}
              </p>
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
      <hr />
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
  const {
    setAppBar, // tambahkan payload seperti ini setAppBar({onBack:()=>setScreen('namaScreen'),title:'Title header',appBarType:'type'})
    handleBack, // dipanggil di dalam button di luar header, guna untuk kembali ke screen sebelumnya
    clearScreen, // reset appBar
    setScreen,
  } = useHeader();
  const { profileData } = profileSeller();
  const [isOpenMap, setOpenMap] = useState(false);
  const { setShowBottomsheet, setDataBottomsheet, setTitleBottomsheet } =
    toast();

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
    <ContainerResponsiveData
      classname={type === "store" && "-mt-7"}
      title={type === "store" ? "Data Toko" : "Data Perusahaan"}
      info={type === "store" && true}
      onClickInfo={() => {
        setShowBottomsheet(true);
        setTitleBottomsheet("Data Toko");
        setDataBottomsheet(
          <span className="font-medium text-sm text-neutral-900">
            Data toko akan ditampilkan pada profil kamu untuk pengguna lainnya
          </span>
        );
      }}
      onClickUbah={() => {
        if (type === "store") {
          setScreen("editStore");
          setAppBar({
            title: "Ubah Data Toko",
            appBarType: "header_title",
            showBackButton: true,
            onBack: () => {
              setScreen("main");
              clearScreen();
            },
          });
        } else if (type === "company" && data.isCross) {
          // Tambahkan kondisi untuk company
          setScreen("editCompany"); // Tambahkan screen baru untuk edit company
          setAppBar({
            title: "Ubah Data Perusahaan",
            appBarType: "header_title",
            showBackButton: true,
            onBack: () => {
              setScreen("main");
              clearScreen();
            },
          });
        }
      }}
    >
      <>
        {[
          ...renderContent().map((field) => ({
            type: "basic",
            content: (
              <div className="flex flex-col gap-2 px-4">
                <span className="text-neutral-700 font-medium text-sm">
                  {field.label}
                </span>
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
                    <p className="font-medium text-sm text-neutral-900">
                      {field.value}
                    </p>
                  )}
                </div>
              </div>
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
            <>
              <div key={index} className={``}>
                {item.content}
              </div>
              <hr />
            </>
          ))}
      </>
    </ContainerResponsiveData>
  );
};

export const DataToko = ({ handleSaveStore, handleSaveCompany }) => {
  const [isEditCompany, setIsEditCompany] = useState(false);
  const [isEditStore, setIsEditStore] = useState(false);
  const [manajemenLokasi, setManajemenLokasi] = useState();
  const [defaultManajemenLokasi, setDefaultManajemenLokasi] = useState(null);
  const { profileData, errors } = profileSeller();

  useEffect(() => {
    if (!profileData) return;

    const storeInfo =
      profileData?.profile?.accountType === "Perusahaan"
        ? profileData?.storeInformation
        : profileData?.companyData;

    if (storeInfo) {
      console.log(storeInfo);
      setDefaultManajemenLokasi({
        address: storeInfo.address,
        listPostalCodes: storeInfo.listPostalCode,
        listDistricts: storeInfo.listDistrict,
        location: { title: storeInfo.location },
        district: { name: storeInfo.district, value: storeInfo.districtID },
        city: { name: storeInfo.city, id: storeInfo.cityID },
        province: { name: storeInfo.province, id: storeInfo.provinceID },
        postalCode: { name: storeInfo.postalCode },
        coordinates: { lat: storeInfo.latitude, long: storeInfo.longitude },
      });
    }
  }, [profileData, isEditStore, isEditCompany]);

  if (!profileData) return <Skeleton fill={5} />;

  const storeInfo = profileData?.storeInformation || {};
  const companyData = profileData?.companyData || {};
  const isCompany = profileData?.profile?.accountType === "Perusahaan";
  const locationProps = {
    manajemenLokasi,
    setManajemenLokasi,
    defaultManajemenLokasi,
    errors,
  };

  return (
    <div className="space-y-4">
      <StoreSection
        type="store"
        data={storeInfo}
        isEditMode={isEditStore}
        setIsEditMode={setIsEditStore}
        locationProps={{
          manajemenLokasi,
          setManajemenLokasi,
          defaultManajemenLokasi,
          errors,
        }}
        handleSaveStore={handleSaveStore}
        handleSaveCompany={handleSaveCompany}
      />
      {isCompany && profileData?.companyData?.isCross && (
        <StoreSection
          type="company"
          data={companyData}
          isEditMode={isEditCompany}
          setIsEditMode={setIsEditCompany}
          locationProps={{
            manajemenLokasi,
            setManajemenLokasi,
            defaultManajemenLokasi,
            errors,
          }}
          handleSaveStore={handleSaveStore}
          handleSaveCompany={handleSaveCompany}
        />
      )}
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
      value: (
        <span className="font-semibold text-sm text-success-400">
          File KTP.png
        </span>
      ),
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
    <ContainerResponsiveData title="Kelengkapan Legalitas">
      {legalInfo.map((item, index) => (
        <>
          <div key={item.label} className="px-4">
            <span className="text-neutral-700 font-medium text-sm">
              {item.label}
            </span>
            <div className="flex justify-between items-center w-full">
              <p className="font-semibold text-sm text-neutral-900">
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
                  iconRight={<Download size={14} />}
                  Class="!h-8 !font-semibold !text-sm !bg-white !text-primary-700 !p-0"
                >
                  Download
                </Button>
              )}
            </div>
          </div>
          <hr />
        </>
      ))}
    </ContainerResponsiveData>
  );
};

const ContainerResponsiveData = ({
  title,
  info = false,
  onClickInfo,
  onClickUbah,
  classname,
  children,
}) => {
  return (
    <div className={`space-y-4 p-4 bg-white ${classname}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-sm mt-[2px]">{title}</h2>
          {info && (
            <Info
              size={14}
              color="#176cf7"
              onClick={onClickInfo}
              className="cursor-pointer"
            />
          )}
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onClickUbah}
        >
          <span className="text-sm font-semibold text-primary-700 mt-[2px]">
            Ubah
          </span>
          <PencilLine size={14} className="text-primary-700" />
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
};
