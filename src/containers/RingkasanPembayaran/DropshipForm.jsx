import Checkbox from "@/components/Checkbox/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import ModalComponent from "@/components/Modals/ModalComponent";
import Tooltip from "@/components/Tooltip/Tooltip";
import { useLanguage } from "@/context/LanguageContext";
import { viewport } from "@/store/viewport";
import React, { useEffect, useState } from "react";

const DropshipForm = ({
  onUpdateValues,
  dropshipValues,
  errorsValues,
  isDropship,
  setIsDropship,
  loading = false,
}) => {
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734
  const {t} = useLanguage()
  const { isMobile } = viewport();
  const [modalInfo, setModalInfo] = useState(false);

  const [formValues, setFormValues] = useState(dropshipValues);
  const [errorValues, setErrorValues] = useState(errorsValues);

  useEffect(() => {
    setErrorValues(errorsValues);
  }, [errorsValues]);

  const setValues = (name, value) => {
    // Reset the error for this field when the user types
    setErrorValues((prev) => ({
      ...prev,
      [name]: "",
    }));

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    onUpdateValues(formValues);
  }, [formValues]);

  return (
    <div className="space-y-4">
      {!loading && (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isDropship}
            onChange={(e) => setIsDropship(e.checked)}
            label={
              <div className="font-semibold">
                {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734 */}
                {t("LabelcheckoutRingkasanPembayaranKirimSebagai")}{" "}
                <span className="text-muat-parts-non-800">{t("LabelcheckoutRingkasanPembayaranDropshipper")}</span>
              </div>
            }
          />
          {isMobile ? (
            <>
              <IconComponent
                src="/icons/Info.svg"
                onclick={() => setModalInfo(true)}
              />
              <ModalComponent
                isOpen={modalInfo}
                setClose={() => setModalInfo(false)}
                hideHeader
                classnameContent={"w-[296px] px-4 py-6"}
                children={
                  <div className="text-center text-sm font-medium">
                   {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734 */}
                   {t("LabelcheckoutRingkasanPembayaranJikaAndamenjadidropshipperuntukpesananininamadannomorHPyangdiisikanakantercantumsebagaipengirim.")}
                  </div>
                }
              />
            </>
          ) : (
            <Tooltip
              text={
                <div className="text-center">
                  {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734 */}
                  {t("LabelcheckoutRingkasanPembayaranJikaAndamenjadidropshipperuntukpesananininamadannomorHPyangdiisikanakantercantumsebagaipengirim.")}
                </div>
              }
              position="top"
            >
              <IconComponent src="/icons/Info.svg" />
            </Tooltip>
          )}
        </div>
      )}
      {isDropship && (
        <>
          <div className="space-y-2">
            <label className="text-xs font-medium" htmlFor="dropship-name">
              {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734 */}
              {t("LabelcheckoutRingkasanPembayaranNamaPengirim")}*
            </label>
            <Input
              id="dropship-name"
              value={formValues.name}
              // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734
              placeholder={t("LabelcheckoutRingkasanPembayaranMasukkanNamaPengirim")}
              status={errorValues.name ? "error" : ""}
              supportiveText={{ title: errorValues.name }}
              changeEvent={(e) => setValues("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium" htmlFor="dropship-phone">
              {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734 */}
              {t("LabelcheckoutRingkasanPembayaranNo.HPPengirim")}*
            </label>
            <Input
              id="dropship-phone"
              value={formValues.phone}
              // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0734
              placeholder={t("LabelcheckoutRingkasanPembayaranContoh:08xxxxxxxxxxx")}
              status={errorValues.phone ? "error" : ""}
              supportiveText={{ title: errorValues.phone }}
              changeEvent={(e) =>
                setValues("phone", e.target.value.replace(/\D/g, ""))
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DropshipForm;
