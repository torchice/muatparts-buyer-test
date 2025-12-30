"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import InformasiTokoAkun from "@/containers/Register/InformasiTokoAkun";
import Otp from "@/containers/Register/Otp";
import InformasiPendaftarDanRekening from "@/containers/Register/InformasiPendaftarDanRekening";
import KonfirmasiData from "@/containers/Register/KonfirmasiData";
import registerForm from "@/store/registerForm";

function RegisterWeb({
  handleNext,
  isSubmitting,
  bankOptions,
  hasVerifiedLegality,
  hasVerifiedRekening,
  remainingTime,
}) {
  const { prevStep, formData, setCurrentStep, currentStep } = registerForm();
  const router = useRouter();
  const step = useSearchParams().get("step") || "1";

  const BREADCRUMB_ITEMS = [
    "Informasi Toko Akun",
    "Informasi Pendaftar dan Rekening",
    "Konfirmasi Data",
  ];

  const handleGoBack = () => {
    if (step !== "1") {
      prevStep();
      // router.push(`/register?step=${Number(step) - 1}`);
      setCurrentStep(currentStep);
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div>
      {step === "4" ? (
        <Otp remainingTime={remainingTime} />
      ) : (
        <div className="max-w-[758px] mx-auto mt-[108px] pb-5">
          <div
            className={`bg-white ${
              step === "3"
                ? "!rounded-b-none !border-none shadow-[0px_4px_11px_0px_#41414140]"
                : "shadow-muat"
            } rounded-[10px] border border-[#E5E7EB]`}
          >
            <div className="px-8 py-6">
              <div className="flex">
                <IconComponent
                  src="/icons/blue-arrow-left.svg"
                  size="medium"
                  onclick={step !== "1" ? handleGoBack : null}
                />
                <div className="flex flex-col flex-1 gap-y-3 ml-8 items-center">
                  <span className="text-[20px] leading-[24px] font-bold">
                    Daftar menjadi Penjual muatparts
                  </span>
                  <BreadCrumb
                    data={BREADCRUMB_ITEMS.slice(0, step)}
                    maxWidth="188"
                    onclick={(val) => {
                      const index = BREADCRUMB_ITEMS.findIndex(
                        (item) => item === val
                      );
                      // router.push(`/register?step=${Number(index) + 1}`);
                      nextStep();
                      setCurrentStep(currentStep);
                    }}
                  />
                </div>
              </div>
              {step === "1" ? <InformasiTokoAkun /> : null}
              {step === "2" ? (
                <InformasiPendaftarDanRekening
                  bankOptions={bankOptions}
                  hasVerifiedLegality={hasVerifiedLegality}
                  hasVerifiedRekening={hasVerifiedRekening}
                />
              ) : null}
            </div>
          </div>
          <div className="">{step === "3" && <KonfirmasiData />}</div>

          <div className="mt-6 flex flex-col items-center gap-4 justify-center">
            <Button
              name="next"
              color="primary"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Loading..."
                : step === "3"
                ? "Daftar"
                : "Selanjutnya"}
            </Button>
            {step === "3" && (
              <span className="font-medium text-xs text-neutral-900">
                Baca{" "}
                <span className="font-medium text-xs !text-primary-700">
                  Syarat dan Ketentuan
                </span>{" "}
                muatparts Mart.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterWeb;
