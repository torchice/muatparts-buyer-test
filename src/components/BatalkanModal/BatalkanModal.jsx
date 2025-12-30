import React, { useState } from "react";
import Modal from "@/components/Modals/modal";
import RadioButton from "@/components/Radio/RadioButton";
import { useLanguage } from "@/context/LanguageContext";
import useBatalkanPesanan from "@/store/batalkanPesanan";
import styles from "./batalkan.module.scss";
import SWRHandler from "@/services/useSWRHook";
import Input from "@/components/Input/Input";
import toast from "@/store/toast";
import { useCustomRouter } from "@/libs/CustomRoute";
const BatalkanModal = ({ data }) => {
  const router = useCustomRouter();
  const { t } = useLanguage();
  const [value, setValue] = useState();
  const [reason, setReason] = useState("");
  const { setShowToast, setDataToast } = toast();
  const { useSWRHook, useSWRMutateHook } = SWRHandler();
  const { data: dataOptionBatalkan } = useSWRHook(
    `/v1/muatparts/transaction/cancel_options`
  );
  const { data: swrSave, trigger: triggerSaveBatalkan } = useSWRMutateHook(`
        ${process.env.NEXT_PUBLIC_GLOBAL_API}/v1/muatparts/orders/cancel
    `);
  const { setModalBatal, modalBatal,validateReason, setValidateReason,activeReason, setActiveReason } = useBatalkanPesanan();
  const onSave = () => {
    let orderID = data?.orderID;
    let cancelOptionID = value;
    if (activeReason && !reason) {
      setValidateReason(true);
      return;
    }
    triggerSaveBatalkan({
      orderID,
      cancelOptionID,
      reason,
    });
    setModalBatal(false);
    setShowToast(true);
    setDataToast({
      type: "success",
      message: "Berhasil membatalkan pesanan",
    });
    router.push("/daftarpesanan?tab=6");
  };
  return (
    <div>
      <Modal
        isOpen={modalBatal}
        setIsOpen={setModalBatal}
        closeArea={false}
        closeBtn={true}
        action1={{
          action: () => setModalBatal(false),
          text: t("labelBatalButton"),
          style: "outline",
          color: "#176CF7",
          customStyle: {
            width: "112px",
          },
        }}
        action2={{
          action: onSave,
          text: t("labelSimpanButton"),
          style: "full",
          color: "#176CF7",
          customStyle: {
            width: "112px",
            color: "#ffffff",
          },
        }}
      >
        <div className="flex justify-center align-middle text-center  flex-col ">
          <div
            className={`flex justify-center flex-col items-center font-[700] text-[16px] leading-[19.2px] text-[#000000] text-center mb-4`}
          >
            {t("AppKomplainBuyerLabelSelectCancellationReason")}
          </div>
          <div className={`${styles.containerbatalkanradion}`}>
            {/* 24. THP 2 - MOD001 - MP - 035 - QC Plan - Web - MuatParts - General - Daftar Pesanan LB - 0041 LB - 0042 */}
            {dataOptionBatalkan?.Data?.length > 0 &&
              dataOptionBatalkan?.Data?.map((item) => (
                <>
                  <label className="flex items-start gap-[2px] cursor-pointer">
                    <RadioButton
                      name="option-batalkan"
                      onClick={(e) => {
                        if (item.value !== "Lainnya") {
                          setActiveReason(false);
                          setReason("");
                        } else setActiveReason(true);
                        setValue(e.value);
                      }}
                      value={item.id}
                    />
                    <div className="flex text-start">
                      <div
                        className={`text-xs flex flex-col gap-1 text-neutral-900 font-medium`}
                      >
                        {item.value}
                        {activeReason && item.value == "Lainnya" && (
                          <>
                            <Input
                              maxLength="80"
                              classname="w-[312px]"
                              changeEvent={(event) => {
                                setValidateReason(false);
                                setReason(event.target.value);
                              }}
                              supportiveText={{
                                title: `${
                                  validateReason
                                    ? "Alasan Pembatalan Wajib diisi"
                                    : ""
                                }`,
                                desc: ` ${reason.length}/80`,
                              }}
                              status={`${validateReason ? "error" : ""}`}
                              placeholder={`Masukkan alasan pembatalan`}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </label>
                </>
              ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BatalkanModal;
