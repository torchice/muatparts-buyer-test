import * as React from "react";

function VoucherCard({
  image,
  title,
  code,
  type,
  products,
  target,
  discount,
  quota,
  status,
  startDate,
  endDate
}) {
  return (
    <div className="flex gap-3 items-center px-6 py-5 w-full text-black bg-white border-b border-solid border-b-stone-300 min-h-[110px] max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap flex-1 shrink gap-5 items-center self-stretch my-auto w-full basis-0 min-w-[240px] max-md:max-w-full">
        <div className="flex gap-3 items-center self-stretch my-auto text-xs leading-tight min-w-[240px]">
          <img
            loading="lazy"
            src={image}
            alt=""
            className="object-contain shrink-0 self-stretch my-auto w-14 rounded aspect-square"
          />
          <div className="flex gap-5 items-start self-stretch my-auto w-[230px]">
            <div className="flex flex-col flex-1 shrink justify-center py-1 w-full basis-0">
              <div className="text-xs font-bold leading-4 text-ellipsis">
                {title}
              </div>
              <div className="mt-3">Kode Voucher : {code}</div>
              <div className="mt-3">{type}</div>
            </div>
          </div>
        </div>
        <div className="flex-1 shrink gap-2.5 self-stretch py-1 my-auto w-[130px]">
          {products}
        </div>
        <div className="flex-1 shrink gap-2.5 self-stretch py-1 my-auto whitespace-nowrap w-[88px]">
          {target}
        </div>
        <div className="flex-1 shrink gap-2.5 self-stretch py-1 my-auto basis-6">
          {discount}
        </div>
        <div className="flex flex-1 shrink gap-1 items-center self-stretch py-0.5 my-auto text-xs leading-tight whitespace-nowrap basis-6">
          <div className="self-stretch my-auto">{quota}</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/1d9329ffaefc6dfd3e4a5367e526364652d5406f19902d16a9f3189c1f7971bf?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
            alt=""
            className="object-contain shrink-0 self-stretch my-auto w-3 aspect-square"
          />
        </div>
        <div className="flex gap-5 items-start self-stretch my-auto text-xs leading-tight w-[148px]">
          <div className="flex flex-col flex-1 shrink justify-center py-1 w-full basis-0">
            <div className={`gap-1 self-stretch p-2 text-xs font-semibold leading-tight ${
              status === "Aktif" 
                ? "text-emerald-500 bg-green-100" 
                : "text-orange-500 bg-yellow-100"
            } rounded-md min-h-[24px] w-[90px]`}>
              {status}
            </div>
            <div className="mt-3">
              <span className="text-neutral-500">Mulai :</span> {startDate}
            </div>
            <div className="mt-3">
              <span className="text-neutral-500">Akhir :</span> {endDate}
            </div>
          </div>
        </div>
        <button className="flex gap-2 items-center self-stretch px-3 py-2 my-auto whitespace-nowrap bg-white rounded-md border border-solid border-neutral-500 min-h-[32px] w-[72px]">
          <span className="self-stretch my-auto">Atur</span>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/50e3c5619267718e09797bc92cd325338d0f61b7c8a24b00492b29637bacd4b8?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
            alt=""
            className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
          />
        </button>
      </div>
    </div>
  );
}

export default VoucherCard;