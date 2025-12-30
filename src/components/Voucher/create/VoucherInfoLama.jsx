import * as React from "react";

function VoucherInfo() {
  return (
    <div className="flex overflow-hidden gap-2.5 items-start p-8 w-full text-xs font-medium bg-white rounded-xl shadow-sm max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col flex-1 shrink w-full basis-0 min-w-[240px] max-md:max-w-full">
        <h2 className="gap-6 self-stretch w-full text-lg font-semibold leading-tight text-black max-md:max-w-full">
          Informasi Voucher
        </h2>
        <form className="flex flex-col gap-6 mt-6">
          <div className="flex flex-wrap gap-8 items-start w-full">
            <label htmlFor="voucherName" className="leading-4 text-neutral-500 w-[178px]">
              Nama Voucher*
            </label>
            <div className="flex flex-col leading-tight min-w-[240px] w-[360px]">
              <input
                type="text"
                id="voucherName"
                className="flex-1 shrink gap-2 self-stretch p-3 w-full bg-white rounded-md border border-red-500 border-solid min-h-[32px]"
                placeholder="Contoh : Diskon Tahun Baru"
                aria-required="true"
              />
              <div className="flex gap-3 items-start mt-2 w-full text-red-500 h-[7px]">
                <div className="flex-1 shrink basis-0">Nama Voucher wajib diisi</div>
                <div className="text-right">0/60</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 items-start w-full">
            <label htmlFor="voucherCode" className="leading-4 text-neutral-500 w-[178px]">
              Kode*
            </label>
            <div className="flex flex-col leading-tight w-[190px]">
              <div className="flex overflow-hidden items-start w-full rounded-md border border-red-500 border-solid">
                <span className="flex gap-2 items-center py-3 pl-3 text-black whitespace-nowrap bg-white min-h-[32px]">
                  TOKO
                </span>
                <input
                  type="text"
                  id="voucherCode"
                  className="flex-1 shrink gap-2 self-stretch p-3 bg-white min-h-[32px]"
                  placeholder="Maksimum 8 karakter"
                  aria-required="true"
                />
              </div>
              <div className="mt-1.5 text-red-500">Kode wajib diisi</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 items-start">
            <label className="leading-tight text-neutral-500 w-[178px]">
              Target*
            </label>
            <div className="flex gap-5 items-start min-w-[240px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="target" className="hidden" />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/e3c4e08542591831420d2ff2eaeb0bef2c1049012144d47f84514eaf362f64bc?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
                  className="object-contain shrink-0 w-4 aspect-square"
                  alt=""
                />
                <span className="text-black">Publik</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="target" className="hidden" />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/be5febef0e5fa5056e63d78728f870c4182782bb569a217e12e158fcbe128893?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
                  className="object-contain shrink-0 w-4 aspect-square"
                  alt=""
                />
                <span className="text-black">Terbatas</span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 items-start">
            <label className="leading-4 text-neutral-500 w-[178px]">
              Masa Berlaku*
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                className="flex gap-2 items-center px-3 py-2 w-40 bg-white rounded-md border border-solid border-neutral-500 min-h-[32px]"
                value="25 Jul 2024 13:00"
              />
              <span className="font-semibold leading-4 w-[18px]">s/d</span>
              <input
                type="text"
                className="flex gap-2 items-center px-3 py-2 w-40 bg-white rounded-md border border-solid border-neutral-500 min-h-[32px]"
                value="24 Ags 2024 13:00"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VoucherInfo;