"use client";
import { ChevronRight } from "lucide-react";
import style from "./MuatpartsVoucher.module.scss";
import { useEffect, useState } from "react";
import ModalComponent from "@/components/Modals/ModalComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import VoucherContent from "./VoucherContent";
import useVoucherMuatpartsStore from "@/store/useVoucherMuatpartsStore";
import { viewport } from "@/store/viewport";

function MuatpartsVoucher() {
  const { isMobile } = viewport();

  const [modalVoucher, setModalVoucher] = useState(false);

  const { setSelectedVouchers, submittedVouchers } = useVoucherMuatpartsStore();

  const hasVouchers =
    Boolean(submittedVouchers?.purchase) ||
    Boolean(submittedVouchers?.shipping);

  const evaluateVouchers = (v) =>
    Object.values(v).filter(Boolean).length === 2
      ? 2
      : Object.values(v).filter(Boolean).length === 0
      ? 0
      : 1;

  return (
    <>
      <div
        className="flex justify-between items-center border border-primary-700 bg-primary-50 py-2 px-3 rounded-md cursor-pointer text-xs font-medium"
        onClick={() => setModalVoucher(true)}
      >
        {hasVouchers ? (
          <div className="flex gap-2 items-center">
            <ImageComponent
              src={"/img/voucher-used.png"}
              width={24}
              height={24}
              alt="Voucher used"
            />
            <div className=" text-primary-700">
              {evaluateVouchers(submittedVouchers)} Voucher Terpakai
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <ImageComponent
              src={"/img/voucher-none.png"}
              width={24}
              height={24}
              alt="No voucher"
            />
            <div className="">Makin hemat pakai voucher</div>
          </div>
        )}
        <ChevronRight
          size={16}
          className={hasVouchers ? "text-primary-700" : ""}
        />
      </div>

      <ModalComponent
        full
        isOpen={modalVoucher}
        setClose={() => {
          setModalVoucher(false);
        }}
        hideHeader
        type={isMobile ? "BottomSheet" : "Modal"}
        preventAreaClose={isMobile}
        classnameContent={
          " !w-full !max-w-[472px]  !p-0 sm:h-[100%] sm:max-h-none sm:!pt-12 h-fit sm:!rounded-none"
        }
      >
        <VoucherContent closeModal={() => setModalVoucher(false)} />
      </ModalComponent>
    </>
  );
}

export default MuatpartsVoucher;
