// Improvement fix wording Pak Brian
export function MenungguUlasanResponsiveSkeleton() {
  return (
    <div className="p-4 space-y-3 bg-white">
      <div className="flex flex-col gap-2">
        <div className="font-bold h-[10px] bg-gray-300 animate-skeleton skeleton w-40" />
        <div className="font-bold h-[10px] bg-gray-300 animate-skeleton skeleton w-64" />
      </div>
      <hr className="border-neutral-400" />
      <div className="flex flex-col space-y-3">
        {/* store identity */}
        <div className="flex items-center gap-1.5">
          <div className="rounded-[100%] size-4 animate-skeleton skeleton bg-gray-300" />
          <div className="font-bold h-[10px] bg-gray-300 animate-skeleton skeleton w-20" />
        </div>

        {/* Produk - selalu ditampilkan meski tidak ada data produk */}
        <div className="flex gap-2">
          <div className="rounded-md h-[42px] w-[42px] overflow-hidden skeleton animate-skeleton  bg-gray-300" />
          <div className="flex flex-col space-y-2 w-[278px]">
            <div className="h-[42px] flex flex-col justify-between">
              <div className="font-semibold text-xs text-neutral-900 leading-[12px] line-clamp-2 h-3 animate-skeleton skeleton bg-gray-300" />
              {/* {displayVariant && (
                <span className="font-semibold text-[10px] text-neutral-700">
                  {displayVariant}
                </span>
              )} */}
              <span className="font-semibold text-[10px] text-neutral-700 h-[10px] w-20 skeleton animate-skeleton bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
      <hr className="border-neutral-400" />
      {/* label */}
      <div className="bg-warning-100 rounded-md p-3 space-y-2">
        <div className="flex items-center gap-2 text-neutral-600 font-medium text-xs">
          {/* <IconComponent
            src={
              process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/ulasanbuyeric.svg"
            }
          /> */}
          Ulasan
        </div>
        <span className="text-warning-900 text-xs font-semibold block">
          Kamu belum menulis ulasan untuk produk ini
        </span>
      </div>
      {/* tombol */}
      <div className="flex gap-2 w-full justify-between">
        <div className="!min-w-[160px] !h-8 rounded-full bg-gray-300 skeleton animate-skeleton" />
        <div className="!min-w-[160px] !h-8 rounded-full bg-gray-300 skeleton animate-skeleton" />
        {/* <Button
          color="primary_secondary"
          children="Lihat Toko"
          Class="!h-8 !font-semibold !pb-2 !min-w-[160px]"
        /> */}
        {/* <Button
          children="Tulis Ulasan"
          Class="!h-8 !font-semibold !pb-2 !min-w-[160px]"
        /> */}
      </div>
    </div>
  );
}

export function UlasanCardResponsiveSkeleton() {
  return (
    <div className="bg-neutral-50 p-4 flex flex-col gap-y-3">
      <div className="flex justify-between items-center pb-3 border-b border-b-neutral-400">
        <div className="font-bold text-[10px] leading-[10px] h-[10px] w-20 bg-gray-300 animate-skeleton skeleton " />
        <div className="font-medium text-[10px] leading-[10px] h-[10px] w-20 bg-gray-300 animate-skeleton skeleton" />
      </div>
      <div className="flex gap-x-2">
        <div className="rounded-[2.47px] size-[42px] bg-gray-300 animate-skeleton skeleton" />
        <div className="flex flex-col gap-y-3">
          <span className="font-semibold text-[12px] leading-[13.2px] line-clamp-2 h-3 w-20 bg-gray-300 animate-skeleeton skeleton" />
          <div className="font-semibold text-[10px] leading-[10px] text-neutral-600 h-[10px] bg-gray-300 animate-skeleton skeleton" />
          <div className="flex gap-x-2 items-center">
            <span className="font-semibold text-[10px] leading-[10px] text-neutral-700 h-[10px] bg-gray-300 animate-skeleton skeleton" />
          </div>
          <div className="font-medium text-[12px] leading-[14.4px] h-3 w-20 animate-skeleton skeleton bg-gray-300" />
          <div className="flex flex-wrap gap-2">
            {Array(3)
              .fill("")
              .map((image, key) => (
                <div className="size-[42px] rounded-[2.47px] bg-gray-300 animate-skeleton skeleton" />
              ))}
          </div>
        </div>
      </div>
      <div className="flex gap-x-2 items-center">
        <div className="w-full h-7 rounded-full bg-gray-300 animate-skeleton skeleton" />
        <div className="w-full h-7 rounded-full bg-gray-300 animate-skeleton skeleton" />
      </div>
    </div>
  );
}
