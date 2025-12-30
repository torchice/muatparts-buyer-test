import React from "react";
import Input from "@/components/Input/Input";
import Checkbox from "@/components/Checkbox/Checkbox";
import FileUpload from "@/components/FileUpload/FileUpload";
import Dropdown from "@/components/Dropdown/Dropdown";
import registerForm from "@/store/registerForm";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";

function InformasiPendaftarDanRekeningResponsive() {
  const {
    formData,
    currentStep,
    handleInputChange,
    setFormData,
  } = registerForm();

  // File upload handlers
  const handleFileUpload = (fileData) => {
    if (fileData === null) {
      handleInputChange("ktpFile", null);
    } else {
      handleInputChange("ktpFile", {
        url: fileData.url,
        name: fileData.name
      });
    }
  };

  const handleFileUploadError = (error) => {
    // Handle file upload error
    console.error("File upload error:", error);
  };

  // Input change handlers
  const handleTextInputChange = (field) => (e) => {
    handleInputChange(field, e.target.value);
  };

  // Bank selection handler
  const handleBankSelect = (selected) => {
    handleInputChange("bankId", selected[0]?.value);
  };

  // Mock bank options (replace with actual data from API)
  const bankOptions = [
    { name: "Bank BCA", value: "bca" },
    { name: "Bank Mandiri", value: "mandiri" },
    { name: "Bank BNI", value: "bni" }
  ];

  return (
    <div className="flex overflow-hidden flex-col mx-auto w-full bg-white max-w-[480px]">
      <div className="flex flex-col self-center p-4 w-full max-w-[480px]">
        <div className="font-semibold text-lg mb-6">Data Pendaftar</div>

        <div className="space-y-6">
          {/* KTP File Upload */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-600">KTP Pendaftar*</span>
            <FileUpload
              label="Unggah"
              acceptedFormats={['.jpg', '.jpeg', '.png']}
              maxSize={5}
              onSuccess={handleFileUpload}
              onError={handleFileUploadError}
              value={formData[currentStep].ktpFile}
            />
          </div>

          {/* KTP Number */}
          <Input
            name="ktpNumber"
            type="text"
            placeholder="16 digit No. KTP Pendaftar"
            width={{ width: "100%" }}
            changeEvent={handleTextInputChange('ktpNo')}
            value={formData[currentStep].ktpNo}
            supportiveText={{ title: "No. KTP Pendaftar*" }}
          />

          {/* KTP Name */}
          <Input
            name="ktpName"
            type="text"
            placeholder="Masukkan Nama sesuai KTP"
            width={{ width: "100%" }}
            changeEvent={handleTextInputChange('namaKtpPendaftar')}
            value={formData[currentStep].namaKtpPendaftar}
            supportiveText={{ title: "Nama KTP Pendaftar*" }}
          />

          {/* Bank Account Checkbox */}
          <div className="pt-4 border-t border-neutral-200">
            <Checkbox
              label="Lengkapi Informasi Rekening Pencairan Dana"
              onChange={({ checked }) => handleInputChange("hasBankAccount", checked)}
              checked={formData[currentStep].hasBankAccount}
            />
          </div>

          {/* Conditional Bank Account Section */}
          {formData[currentStep].hasBankAccount && (
            <div className="space-y-6">
              <div className="font-semibold">Informasi Rekening Pencairan</div>
              
              <Dropdown
                options={bankOptions}
                onSelected={handleBankSelect}
                placeholder="Pilih Bank"
                searchPlaceholder="Cari bank..."
                onSearchValue={true}
                classname="w-full"
              />

              <Input
                name="accountNumber"
                type="text"
                placeholder="Masukkan Nomor Rekening"
                width={{ width: "100%" }}
                changeEvent={handleTextInputChange('rekeningNumber')}
                value={formData[currentStep].rekeningNumber}
                text={{ right: (
                  <span className="text-primary-700 cursor-pointer text-sm font-medium">
                    Periksa
                  </span>
                )}}
              />

              {/* Warning Info */}
              <div className="flex gap-2 p-3 bg-warning-50 rounded-md">
                <IconComponent src="/icons/warning-triangle.svg" />
                <span className="text-sm">
                  Rekening Bank akan digunakan sebagai rekening tujuan pencairan dana kamu
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-between p-4 bg-white shadow-lg">
        <Button
          name="back"
          color="primary_secondary"
          onClick={() => {/* Handle back */}}
        >
          Kembali
        </Button>
        <Button
          name="next"
          color="primary"
          onClick={() => {/* Handle next */}}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}

export default InformasiPendaftarDanRekeningResponsive;