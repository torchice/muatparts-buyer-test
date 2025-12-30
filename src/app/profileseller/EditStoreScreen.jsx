import React, { useState, useEffect } from "react";
import { useHeader } from "@/common/ResponsiveContext";
import { BadgeCheck, Info, PencilLine, X } from "lucide-react";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import LocationManagement from "@/components/LocationManagement/LocationManagement";
import profileSeller from "@/store/profileSeller";
import NavSelectedMobile from "@/components/Bottomsheet/NavSelectedMobile";
import { modal } from "@/store/modal";
import ImageUploaderRegisterResponsive from "@/components/ImageUploader/ImageUploaderRegisterResponsive";
import toast from "@/store/toast";

const EditStoreScreen = ({
  handleSaveStore,
  onCancel,
  setScreen,
  clearScreen,
}) => {
  const {
    storeEdit,
    updateStoreField,
    initializeStoreEdit,
    validateStoreData,
    setStoreError,
    profileData,
  } = profileSeller();
  const { setModalConfig, setModalOpen, setModalContent } = modal();

  const [manajemenLokasi, setManajemenLokasi] = useState();
  const [defaultManajemenLokasi, setDefaultManajemenLokasi] = useState(null);
  const { setDataToast, setShowToast } = toast();

  useEffect(() => {
    initializeStoreEdit();

    // Initialize location data only
    if (profileData?.storeInformation) {
      setDefaultManajemenLokasi({
        address: profileData.storeInformation.address,
        listPostalCodes: profileData.storeInformation.listPostalCode,
        listDistricts: profileData.storeInformation.listDistrict,
        location: { title: profileData.storeInformation.location },
        district: {
          name: profileData.storeInformation.district,
          value: profileData.storeInformation.districtID,
        },
        city: {
          name: profileData.storeInformation.city,
          id: profileData.storeInformation.cityID,
        },
        province: {
          name: profileData.storeInformation.province,
          id: profileData.storeInformation.provinceID,
        },
        postalCode: { name: profileData.storeInformation.postalCode },
        coordinates: {
          lat: profileData.storeInformation.latitude,
          long: profileData.storeInformation.longitude,
        },
      });
    }
  }, []);

  useEffect(() => {
    console.log(
      manajemenLokasi,
      profileData,
      defaultManajemenLokasi,
      " JANCOK"
    );
  }, [manajemenLokasi]);

  const handleSubmit = async () => {
    // Validasi
    const isValid = validateStoreData(storeEdit.data);
    if (!isValid) return;

    try {
      await handleSaveStore(profileData?.storeInformation?.id, storeEdit.data);
      clearScreen();
      setScreen("main");
    } catch (error) {
      if (error?.response?.data?.Data?.Field === "storeName") {
        setStoreError(
          error?.response?.data?.Data?.Field,
          error?.response?.data?.Data?.Message || "Nama Toko telah digunakan"
        );
      }
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="p-4 space-y-4">
        {/* Store Name */}
        <div className="space-y-2">
          <span className="text-neutral-900 font-semibold text-sm">
            Nama Toko*
          </span>
          <Input
            className="w-full"
            status={storeEdit.errors?.storeName ? "error" : ""} // ubah dari errors ke storeEdit.errors
            maxLength="60"
            supportiveText={{
              title: storeEdit.errors?.storeName || "", // ubah dari errors ke storeEdit.errors
              desc: `${storeEdit?.data?.storeName?.length || 0}/60`,
            }}
            placeholder="Masukkan nama toko"
            value={storeEdit?.data?.storeName || ""}
            changeEvent={(e) => updateStoreField("storeName", e.target.value)}
          />
        </div>

        {/* Store Logo */}
        <div className="space-y-2">
          <span className="text-neutral-900 font-semibold text-sm">
            Logo Toko
          </span>
          <ImageUploaderRegisterResponsive
            value={(file) => updateStoreField("storeLogo", file)}
            defaultValue={storeEdit?.data?.storeLogo}
          />
        </div>

        {/* Location Management */}
        <div className="space-y-2">
          <LocationManagement
            value={(value) => {
              console.log("LocationManagement value:", value); // tambah ini
              setManajemenLokasi(value);
            }}
            defaultValue={defaultManajemenLokasi}
            errors={storeEdit.errors?.location}
          />
        </div>

        {/* Action Buttons */}
        <NavSelectedMobile classname="left-0 flex items-center gap-2 justify-center !w-full">
          <Button
            onClick={() => {
              setModalContent(<BatalkanPerubahan />);
              setModalOpen(true);
              setModalConfig({
                classname: "!w-[296px]",
                withHeader: false,
                withClose: false,
              });
            }}
            Class="!min-w-[50%] !h-[40px] !text-sm !font-semibold"
            color="primary_secondary"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            Class="!min-w-[50%] !h-[40px] !text-sm !font-semibold"
          >
            Simpan
          </Button>
        </NavSelectedMobile>
      </div>
    </div>
  );
};

export default EditStoreScreen;

export const BatalkanPerubahan = () => {
  const { setModalOpen } = modal();
  const { clearScreen, setScreen } = useHeader();

  return (
    <div className="px-4 py-6 flex flex-col gap-3 justify-center items-center relative">
      <X
        color="#176cf7"
        size={24}
        className="right-2 absolute top-1 cursor-pointer"
        onClick={() => setModalOpen(false)}
      />
      <span className="font-bold text-base text-neutral-900">
        Batalkan Perubahan
      </span>
      <span className="font-medium text-sm text-neutral-900 text-center">
        Apakah kamu yakin untuk membatalkan perubahan?
      </span>
      <div className="w-full flex gap-2 justify-center">
        <Button
          onClick={() => {
            setModalOpen(false);
            clearScreen();
            setScreen("main");
          }}
          Class="!min-w-[112px] !h-[28px] !font-semibold !text-xs"
          color="primary_secondary"
        >
          Yakin
        </Button>
        <Button
          onClick={() => setModalOpen(false)}
          Class="!min-w-[112px] !h-[28px] !font-semibold !text-xs"
        >
          Batal
        </Button>
      </div>
    </div>
  );
};
