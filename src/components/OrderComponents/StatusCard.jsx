import React from "react";
import ImageComponent from "../ImageComponent/ImageComponent";

const StatusCard = ({ orderStatus, title, subtitle }) => {
  let icon = "";

  switch (orderStatus) {
    case "Menunggu Respon Penjual":
    case "Dikemas":
      icon = "/icons/order-clock.svg";
      break;

    case "Dikirim":
      icon = "/icons/order-truck.svg";
      break;

    case "Tiba di Tujuan":
      icon = "/icons/order-location.svg";
      break;

    case "Dibatalkan Penjual":
    case "Dibatalkan Pembeli":
    case "Dibatalkan Sistem":
    case "Dikomplain":
      icon = "/icons/order-exclamation.svg";
      break;

    case "Selesai":
    case "Pengembalian Dana Selesai":
    case "Komplain Selesai":
      icon = "/icons/order-check.svg";
      break;
  }

  return (
    <>
      {orderStatus !== "Menunggu Pembayaran" && (
        <div className="flex items-center shadow-muatmuat mb-4 rounded-xl py-5 px-8 gap-6">
          <ImageComponent src={icon} width={42} height={42} />
          <div className="space-y-2">
            <div className="text-base font-semibold">{title}</div>
            <div
              className="text-sm font-semibold"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StatusCard;
