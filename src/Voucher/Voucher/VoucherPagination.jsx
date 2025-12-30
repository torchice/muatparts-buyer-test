import * as React from "react";

function VoucherPagination() {
  return (
    <div className="flex flex-wrap gap-10 justify-between items-center mt-4 w-full text-neutral-500 max-md:max-w-full">
      <div className="flex gap-2 items-center self-stretch my-auto text-sm font-medium text-center whitespace-nowrap min-w-[240px]">
        <button aria-label="Previous page">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/c029a61c7188b6da7a898c01221610c7a70f4ca11ac4b24ff41c6045651edb56?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
            alt=""
            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          />
        </button>
        <button className="flex-1 shrink gap-2.5 self-stretch px-0.5 my-auto w-8 h-8 font-bold text-white bg-red-700 rounded-md min-h-[32px]" aria-current="page">
          1
        </button>
        <button className="flex-1 shrink gap-2.5 self-stretch px-0.5 py-2.5 my-auto w-8 rounded-md min-h-[32px]">
          2
        </button>
        <button className="flex-1 shrink gap-2.5 self-stretch px-0.5 py-2.5 my-auto w-8 rounded-md min-h-[32px]">
          3
        </button>
        <button className="flex-1 shrink gap-2.5 self-stretch px-0.5 py-2.5 my-auto w-8 rounded-md min-h-[32px]">
          4
        </button>
        <button className="flex-1 shrink gap-2.5 self-stretch px-0.5 py-2.5 my-auto w-8 rounded-md min-h-[32px]">
          5
        </button>
        <span className="flex-1 shrink gap-2.5 self-stretch px-0.5 py-2.5 my-auto w-8 rounded-md min-h-[32px]">
          ...
        </span>
        <button className="flex-1 shrink gap-2.5 self-stretch px-0.5 py-2.5 my-auto w-8 rounded-md min-h-[32px]">
          20
        </button>
        <button aria-label="Next page">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/41ccc062b7d279d82895e485f59c2862898f2cef357d672930bfb5d000bb6479?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
            alt=""
            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          />
        </button>
      </div>
      <div className="flex gap-4 items-center self-stretch my-auto min-w-[240px]">
        <label htmlFor="pageSize" className="self-stretch my-auto text-xs font-semibold leading-tight">
          Tampilkan Jumlah detail
        </label>
        <div className="flex gap-2 items-center self-stretch my-auto text-sm font-medium text-center whitespace-nowrap">
          <button className="flex-1 shrink gap-2.5 self-stretch px-0.5 my-auto w-8 h-8 font-bold text-white bg-red-700 rounded-md min-h-[32px]">
            10
          </button>
          <button className="flex-1 shrink gap-2.5 self-stretch px-0.5 py-2.5 my-auto w-8 rounded-md min-h-[32px]">
            20
          </button>
          <button className="flex-1 shrink gap-2.5 self-stretch px-0.5 py-2.5 my-auto w-8 rounded-md min-h-[32px]">
            40
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoucherPagination;