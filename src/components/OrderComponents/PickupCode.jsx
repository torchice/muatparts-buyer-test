import React, { useState } from "react";
import Button from "../Button/Button";
import ModalComponent from "../Modals/ModalComponent";

const PickupCode = ({ code }) => {
  const [modalCode, setModalCode] = useState(false);

  return (
    <>
      <div className="shadow-muatmuat p-5 rounded-xl mb-6">
        <div className="font-bold mb-1">Pesanan Siap Diambil</div>
        <div className="text-neutral-600 text-xs mb-3 font-medium">
          Kamu wajib memberikan kode pick up saat mengambil barang
        </div>

        <Button
          Class="!h-8 !font-semibold !text-sm !min-w-full"
          children="Tampilkan Kode Pick Up"
          onClick={() => setModalCode(true)}
        />
      </div>

      <ModalComponent
        isOpen={modalCode}
        setClose={() => setModalCode(false)}
        hideHeader
        classnameContent={"w-[319px] px-6 py-8"}
        children={
          <div className="text-center">
            <div className="font-bold mb-3">Kode Pick Up</div>

            <div className="text-neutral-600 text-xs mb-5 font-medium">
              Tunjukkan kode ini kepada Penjual untuk mengambil pesanan kamu
            </div>

            <div className="space-x-4 font-bold text-3xl">
              {code.split("").map((item) => (
                <span>{item}</span>
              ))}
            </div>
          </div>
        }
      />
    </>
  );
};

export default PickupCode;
