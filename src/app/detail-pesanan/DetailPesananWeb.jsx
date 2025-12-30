"use client";
import OrderSummary from "@/components/Troli/OrderSummary";
import style from "./DetailPesanan.module.scss";
import IconComponent from "@/components/IconComponent/IconComponent";
import OrderCard from "@/components/OrderCard/OrderCard";
const pathImage = process.env.NEXT_PUBLIC_ASSET_REVERSE;

function DetailPesananWeb({ dataCheckoutDetail, dataShippingCost }) {
  return (
    <div className={style.main}>
      {/* <pre>{JSON.stringify(dataShippingCost, null, 2)}</pre> */}

      <div className="flex gap-3 mb-4">
        <h1 className="text-xl font-bold">Detail Pesanan</h1>
      </div>

      <div className="flex gap-2 items-center bg-secondary-100 px-6 py-4 rounded-md text-xs font-medium mb-4">
        <IconComponent
          width={20}
          height={20}
          icon="warning"
          src={pathImage+"/icons/warning-outline.svg"}
          color="warning"
        />
        <div className="">
          Mohon pastikan kembali pesanan kamu telah sesuai, ini adalah langkah
          terakhir sebelum pembyaran
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-[846px] space-y-6">
          {dataCheckoutDetail.map((order, index) => (
            <OrderCard order={order} index={index} />
          ))}
        </div>

        <div className="w-[338px]">
          <OrderSummary isPayment />
        </div>
      </div>
    </div>
  );
}

export default DetailPesananWeb;
