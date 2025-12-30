import React, { useState, useEffect } from "react";
import Button from "@/components/Button/Button";
import LocationManagement from "@/components/LocationManagement/LocationManagement";
import profileSeller from "@/store/profileSeller";
import ImageUploaderRegisterResponsive from "@/components/ImageUploader/ImageUploaderRegisterResponsive";
import { BatalkanPerubahan } from "./EditStoreScreen";
import NavSelectedMobile from "@/components/Bottomsheet/NavSelectedMobile";
import { TriangleAlert } from "lucide-react";
import { modal } from "@/store/modal";
import toast from "@/store/toast";

const EditCompanyScreen = ({
  handleSaveCompany,
  onCancel,
  setScreen,
  clearScreen,
}) => {
  const {
    companyEdit,
    updateCompanyField,
    initializeCompanyEdit, // Tambah ini
    validateCompanyData,
    setCompanyError, // Tambah ini jika diperlukan
    profileData,
  } = profileSeller();
  const { setModalConfig, setModalOpen, setModalContent } = modal();

  const [manajemenLokasi, setManajemenLokasi] = useState();
  const [defaultManajemenLokasi, setDefaultManajemenLokasi] = useState(null);
  const { setDataToast, setShowToast } = toast();

  useEffect(() => {
    initializeCompanyEdit();

    if (profileData?.companyData) {
      setDefaultManajemenLokasi({
        address: profileData.companyData.address,
        listPostalCodes: profileData.companyData.listPostalCode,
        listDistricts: profileData.companyData.listDistrict,
        location: { title: profileData.companyData.location },
        district: {
          name: profileData.companyData.district,
          value: profileData.companyData.districtID,
        },
        city: {
          name: profileData.companyData.city,
          id: profileData.companyData.cityID,
        },
        province: {
          name: profileData.companyData.province,
          id: profileData.companyData.provinceID,
        },
        postalCode: { name: profileData.companyData.postalCode },
        coordinates: {
          lat: profileData.companyData.latitude,
          long: profileData.companyData.longitude,
        },
      });
    }
  }, []);

  const handleSubmit = async () => {
    const isValid = validateCompanyData({
      address: manajemenLokasi?.address,
      location: manajemenLokasi?.location,
      district: manajemenLokasi?.district,
    });

    if (!isValid) return;

    try {
      await handleSaveCompany(profileData?.companyData?.id, {
        ...companyEdit.data,
        ...manajemenLokasi,
      });
      clearScreen();
      setScreen("main");
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const ReadOnlyField = ({ label, value }) => (
    <div className="space-y-2">
      <span className="text-neutral-900 font-semibold text-sm">{label}</span>
      <p className="text-neutral-900 font-semibold text-sm">{value || "-"}</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen relative pb-20">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 rounded-md py-2 px-3 bg-secondary-100">
          <TriangleAlert color="#FF7A00" size={20} />
          <span className="font-medium text-xs text-neutral-900 w-[274px]">
            Data pada halaman profil Big Fleets / Transport Market akan berubah
            sesuai dengan data yang diubah pada halaman ini.
          </span>
        </div>
        {/* Company Logo */}
        <div className="space-y-2">
          <span className="text-neutral-900 font-semibold text-sm">
            Logo Perusahaan
          </span>
          <ImageUploaderRegisterResponsive
            value={(file) => updateCompanyField("companyLogo", file)}
            defaultValue={companyEdit?.data?.companyLogo}
          />
        </div>

        {/* Read-only fields */}
        <ReadOnlyField
          label="Nama Perusahaan"
          value={profileData?.companyData?.companyName}
        />
        <ReadOnlyField
          label="Badan Usaha"
          value={profileData?.companyData?.businessEntity}
        />
        <ReadOnlyField
          label="Bidang Usaha"
          value={profileData?.companyData?.businessField}
        />

        {/* Location Management */}
        <div className="space-y-2">
          <LocationManagement
            value={setManajemenLokasi}
            defaultValue={defaultManajemenLokasi}
            errors={companyEdit.errors?.location} // Pass location errors
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

export default EditCompanyScreen;
