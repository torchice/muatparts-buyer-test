// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
import useSellerStore from "@/store/seller";
import { Fragment } from "react";
import getTabs from "../utils/getTabs";
import { useLanguage } from "@/context/LanguageContext";

function NavigationTabs({ onChangeTab }) {
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
  const { activeTab } = useSellerStore();
  const { t } = useLanguage();
  const tabs = getTabs(t);
  return (
    <div className="flex flex-col items-start w-full text-center text-neutral-900 whitespace-nowrap">
      <div className="flex flex-col justify-center">
        <div className="flex gap-1 items-start">
          {tabs.map((tab, index) => (
            <Fragment key={tab}>
              <button
                onClick={() => onChangeTab(index)}
                className={`flex flex-col justify-center text-[16px] leading-[19.2px] items-center min-h-[40px] cursor-pointer ${
                  index === activeTab
                    ? "font-bold text-primary-700 border-b-2 border-solid border-b-primary-700"
                    : "font-semibold"
                }`}
              >
                <div className="gap-1 self-stretch px-6 text-[16px] leading-[19.2px]">{tab}</div>
              </button>
              {index < tabs.length - 1 && (
                <div className="shrink-0 self-stretch w-0 h-10 border border-solid bg-stone-300 border-stone-300" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavigationTabs;