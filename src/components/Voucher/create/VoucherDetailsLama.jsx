import * as React from "react";

function VoucherDetails() {
  return (
    <div className="flex overflow-hidden gap-2.5 items-start p-8 mt-6 w-full text-xs font-medium bg-white rounded-xl shadow-sm max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col min-w-[240px] w-[944px]">
        <h2 className="flex-1 shrink gap-6 w-full text-lg font-semibold leading-tight text-black max-md:max-w-full">
          Detail Voucher
        </h2>
        <form className="flex flex-col gap-6 mt-6">
          <div className="flex flex-wrap gap-8 items-center w-full">
            <label className="self-stretch my-auto leading-4 text-neutral-500 w-[178px]">
              Jenis Voucher*
            </label>
            <div className="flex gap-5 items-start self-stretch my-auto leading-tight text-black min-w-[240px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="voucherType" className="hidden" />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/4a3628348522127db70e7b50fc0e168552c5e2027a75d22bd4a44750abc5bcb9?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
                  className="object-contain shrink-0 w-4 aspect-square"
                  alt=""
                />
                <span>Diskon Produk</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="voucherType" className="hidden" />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/409db3aa53d3c70edf810c506e491b5bb463245227791837873c7d9a43ed6421?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
                  className="object-contain shrink-0 w-4 aspect-square"
                  alt=""
                />
                <span>Biaya Pengiriman</span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 items-center w-full">
            <label className="self-stretch my-auto leading-4 text-neutral-500 w-[178px]">
              Jenis Diskon*
            </label>
            <div className="flex gap-5 items-start self-stretch my-auto leading-tight text-black">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="discountType" className="hidden" />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/a98ea8674e50c7dfc99f8f272715fcf6be34b064453c77e796a99daa247bf063?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
                  className="object-contain shrink-0 w-4 aspect-square"
                  alt=""
                />
                <span>Nominal (Rp)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="discountType" className="hidden" />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/1fb72c673f95763d17bd15a4ebbaf3deb7a732c240cabbeb7c98e7293df0bee7?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
                  className="object-contain shrink-0 w-4 aspect-square"
                  alt=""
                />
                <span>Persentase (%)</span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 items-start w-full">
            <label htmlFor="discount" className="leading-4 text-neutral-500 w-[178px]">
              Diskon*
            </label>
            <div className="flex flex-col w-60 leading-tight">
              <div className="flex overflow-hidden items-start w-full rounded-md border border-red-500 border-solid">
                <span className="flex gap-2 items-center py-3 pl-3 text-black whitespace-nowrap bg-white min-h-[32px]">
                  Rp
                </span>
                <input
                  type="text"
                  id="discount"
                  className="flex-1 shrink gap-2 self-stretch p-3 bg-white min-h-[32px]"
                  placeholder="Contoh : 1.000.000"
                  aria-required="true"
                />
              </div>
              <div className="mt-1.5 text-red-500">Diskon wajib diisi</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 items-start w-full">
            <label htmlFor="minPurchase" className="leading-4 text-neutral-500 w-[178px]">
              Minimum Pembelian*
            </label>
            <div className="flex flex-col w-60 leading-tight">
              <div className="flex overflow-hidden items-start w-full rounded-md border border-red-500 border-solid">
                <span className="flex gap-2 items-center py-3 pl-3 text-black whitespace-nowrap bg-white min-h-[32px]">
                  Rp
                </span>
                <input
                  type="text"
                  id="minPurchase"
                  className="flex-1 shrink gap-2 self-stretch p-3 bg-white min-h-[32px]"
                  placeholder="Contoh : 1.000.000"
                  aria-required="true"
                />
              </div>
              <div className="mt-1.5 text-red-500">Minimum Pembelian wajib diisi</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 items-start w-full">
            <div className="flex gap-1 items-center leading-4 text-neutral-500 w-[178px]">
              <label htmlFor="quota" className="self-stretch my-auto w-[102px]">
                Kuota Pemakaian*
              </label>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/3d4d3341760bd6e3f62ae065977951871271f894ee3f4265e410bff4e9ae69a3?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                alt=""
              />
            </div>
            <div className="flex flex-col w-60">
              <input
                type="text"
                id="quota"
                className="flex-1 shrink gap-2 self-stretch p-3 w-full bg-white rounded-md border border-red-500 border-solid min-h-[32px]"
                placeholder="Contoh :10"
                aria-required="true"
              />
              <div className="mt-2 text-red-500">Kuota Pemakaian wajib diisi</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-7 items-start w-full">
            <label htmlFor="quotaPerBuyer" className="flex gap-1 items-center leading-4 text-neutral-500 w-[184px]">
              Kuota Pemakaian per Pembeli*
            </label>
            <div className="flex flex-col w-60 leading-tight">
              <input
                type="text"
                id="quotaPerBuyer"
                className="flex-1 shrink gap-2 self-stretch p-3 w-full bg-white rounded-md border border-red-500 border-solid min-h-[32px]"
                placeholder="Contoh :10"
                aria-required="true"
              />
              <div className="mt-2 text-red-500">
                Kuota Pemakaian per Pembeli wajib diisi
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VoucherDetails;