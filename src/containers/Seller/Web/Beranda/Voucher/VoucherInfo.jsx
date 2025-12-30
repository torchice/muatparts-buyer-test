export default function VoucherInfo() {
  const voucherDetails = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/abb8247c2e6ffa6b88ea24b9e94eafcf9298c3ffea1dfdcc217a4e95a7eec4bf?placeholderIfAbsent=true&apiKey=60cdcdaf919148d9b5b739827a6f5b2a",
      label: "Berlaku hingga",
      value: "19 Okt 2024 - 28 Okt 2024"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ce19104611027b6d09f0bc4531d59d8cc9699e0e3a5931701dfb16def9e8c28c?placeholderIfAbsent=true&apiKey=60cdcdaf919148d9b5b739827a6f5b2a",
      label: "Minimum transaksi",
      value: "Rp300.000"
    }
  ];

  return (
    <div className="flex flex-col gap-y-3 pb-4 w-full border-b border-solid border-b-neutral-400">
      {voucherDetails.map((detail, index) => (
        <div key={index} className={`flex justify-between items-center w-full`}>
          <div className="flex gap-2 items-center self-stretch my-auto font-medium text-neutral-600">
            <img
              loading="lazy"
              src={detail.icon}
              alt=""
              className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
            />
            <div className="font-medium text-[12px] leading-[14.4px] text-neutral-700 my-auto">{detail.label}</div>
          </div>
          <div className="font-semibold text-[12px] leading-[14.4px] my-auto text-right text-black">
            {detail.value}
          </div>
        </div>
      ))}
    </div>
  );
}