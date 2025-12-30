import Dropdown from '@/components/Dropdown/Dropdown';
import IconComponent from '@/components/IconComponent/IconComponent';
import Input from '@/components/Input/Input';
import React from 'react';
import styles from "./BankAccountSection.module.scss"
import registerForm from '@/store/registerForm';

const BankAccountSection = ({ bankOptions, errors }) => {
  const {
    formData,
    handleInputChange: handleFormDataChange
  } = registerForm();

  const bankNameValue = bankOptions.find(item => item.value === formData[1].bankID)
  const isBackAccountInfoFilled = bankNameValue && formData[1].accountNumber

  const handleBankSelect = (selected) => {
    handleFormDataChange("bankID", selected[0]?.value)
  };

  const handleInputChange = (field) => (e) => {
    handleFormDataChange(field, e.target.value)
  };

  const handleCheckBankAccount = () => {
    if (!isBackAccountInfoFilled) {
      return;
    }
    handleFormDataChange("accountName", "mulyono")
  }

  return (
    <>
      <div className="font-semibold text-[18px] leading-[21.6px] mt-6">Informasi Rekening Pencairan</div>
      <div className="space-y-4 mt-6">
        <div className="flex items-start">
          <div className="w-[291px] pt-1">
            <span className="font-medium text-[12px] leading-[14.4px] text-neutral-600">Nama Bank*</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <Dropdown
              options={bankOptions}
              onSelected={handleBankSelect}
              placeholder="Pilih Bank"
              searchPlaceholder="Cari bank..."
              onSearchValue={true}
              classname={`!w-[372px] ${errors.bankName ? "!border-error-400" : "!border-neutral-600"}`}
              defaultValue={bankNameValue ? [bankNameValue] : []}
            />
            {errors.bankName && (
              <span className="text-[12px] font-medium text-error-400">{errors.bankName}</span>
            )}
          </div>
        </div>

        <div className="flex items-start">
          <div className="w-[291px] pt-1">
            <span className="font-medium text-[12px] leading-[14.4px] text-neutral-600">Nomor Rekening*</span>
          </div>
          <div className="flex-1">
            <Input
              name="accountNumber"
              type="text"
              placeholder="Masukkan Nomor Rekening"
              width={{ width: "372px" }}
              changeEvent={handleInputChange('accountNumber')}
              status={errors.accountNumber ? 'error' : null}
              supportiveText={{ title: errors.accountNumber }}
              text={{ right: (
                <span
                  className={`font-medium text-[12px] leading-[14.4px] ${!isBackAccountInfoFilled ? "text-neutral-500" : "text-primary-700 cursor-pointer"}`}
                  onClick={handleCheckBankAccount}
                >
                  Periksa
                </span>
              ) }}
              value={formData[1].accountNumber}
            />
          </div>
        </div>

        {formData[1].accountName && (
          <div className="flex items-start">
            <div className="w-[291px] pt-1">
              <span className="font-medium text-[12px] leading-[14.4px] text-neutral-600">Nama Pemilik Rekening*</span>
            </div>
            <div className="flex-1">
              <span className="font-medium text-[12px] leading-[14.4px]">
                {formData[1].accountName}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-start">
          <div className="flex-1">
            <div className="bg-secondary-100 rounded-md px-6 py-4">
              <div className="flex gap-x-2 items-center">
                <IconComponent
                  classname={styles.stroke_warning}
                  src='/icons/warning-triangle.svg'
                  size="medium"
                />
                <span className="font-medium text-[12px] leading-[14.4px]">
                  Rekening Bank akan digunakan sebagai rekening tujuan pencairan dana kamu
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankAccountSection;
