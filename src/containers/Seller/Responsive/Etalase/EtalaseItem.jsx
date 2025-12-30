import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

export function EtalaseItem({ icon, title, isLast }) {
  return (
    <div
      className={`flex flex-col ${
        isLast ? "mt-3 bg-white rounded-md" : "border-b border-solid border-b-neutral-400 cursor-pointer"
      }`}
    >
      <div className={`flex flex-col ${!isLast ? "px-[9px] py-3" : "px-[9px] pb-3"} ${
        !isLast ? "w-full" : ""
      }`}>
        <div className="flex gap-8 items-center w-full">
          <div className="flex gap-2.5 items-center my-auto w-full">
            <ImageComponent
              className="rounded-[2.47px]"
              // FIX BUG Profil Seller Sisi Buyer LB-0033
              src={icon === "undefined" || icon === undefined ? "/img/etalase.png" : icon}
              alt={`etalase`}
              width={42}
              height={42}
            />
            <div className="flex my-auto min-w-[230px] w-full font-semibold text-[14px] leading-[16.8px]">{title}</div>
            <IconComponent
              src="/icons/chevron-right.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}