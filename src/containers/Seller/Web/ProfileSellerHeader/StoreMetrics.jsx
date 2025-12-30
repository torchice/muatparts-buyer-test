import { useState } from "react";
import JamOperasionalModal from "./JamOperasionalModal";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useLanguage } from "@/context/LanguageContext";

function MetricItem({ value, label, setIsModalOpen }) {
  const { t } = useLanguage();
  const isJamOperasional = label === "Jam Operasional"
  const isProduct = label === "Produk"
  const isRatingUlasan = label === "Rating & Ulasan"

  const handleOpenModal = () => {
    if (isJamOperasional) {
      setIsModalOpen(true)
    }
  }

  const getLabel = () => {
    if (isRatingUlasan) {
      return t("titleRatingReviews")
    } else if (isProduct) {
      return t("labelProduct")
    } else if (isJamOperasional) {
      return t("titleOperatingHours")
    }
  }

  return (
    <>
      <div
        className={`flex flex-col gap-y-2 justify-center items-center 
          ${!isJamOperasional ? 'pr-4 border-r border-solid border-r-neutral-400' : ''}
          ${isJamOperasional ? "cursor-pointer" : ""}
        `}
        onClick={handleOpenModal}
      >
        <div className="flex gap-x-1 items-center">
          {label === "Rating & Ulasan" ? (
            <IconComponent
              src="/icons/star.svg"
              size={20}
              height={20}
            />
          ) : null}
          <div className="font-bold text-[18px] leading-[21.6px] text-neutral-900">
            {value}
            {isRatingUlasan && <span className="text-[14px] font-medium leading-[16.8px] text-neutral-600">{`/5`}</span>}
          </div>
        </div>
        <div className="font-medium text-[12px] leading-[14.4px] text-neutral-900">
          {getLabel()}
        </div>
      </div>
      
    </>
  );
}

function StoreMetrics({ metrics, operationalHours }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex gap-3 justify-center items-center self-stretch my-auto min-w-[240px]">
        <div className="flex gap-3 items-start self-stretch my-auto min-w-[240px]">
          {metrics ? metrics.map((metric, key) => (
            <MetricItem key={key} {...metric} setIsModalOpen={setIsModalOpen} />
          )) : null}
        </div>
      </div>
      <JamOperasionalModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} schedules={operationalHours} />
    </>
  );
}

export default StoreMetrics;