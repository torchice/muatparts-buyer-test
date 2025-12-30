import Bottomsheet from "@/components/Bottomsheet/Bottomsheet";
import IconComponent from "@/components/IconComponent/IconComponent";
import toast from "@/store/toast";
import { DaySchedule } from "./DaySchedule";
import { Fragment } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function StoreStats({
    metrics,
    operationalHours
}) {
    const {
        setShowBottomsheet,
        setTitleBottomsheet,
        setDataBottomsheet,
        titleBottomsheet
    } = toast();
    const { t } = useLanguage();
    const defaultSchedules = [
        { day: "1", type: "24h" },
        { day: "2", type: "24h" },
        { day: "3", type: "24h" },
        { day: "4", type: "24h" },
        { day: "5", type: "24h" },
        { day: "6", type: "24h" },
        { day: "7", type: "24h" }
      ]
    const displaySchedules = !operationalHours || operationalHours.length === 0 ? defaultSchedules : operationalHours
    {/* FIX BUG Profil Seller Sisi Buyer LB-0041 */}
    return (
        <>
            <div className="flex gap-x-2 items-center w-full">
                {/* FIX BUG Profil Seller Sisi Buyer LB-0041 */}
                {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0587 */}
                <div className="flex gap-x-1 items-start pr-2 border-r border-r-neutral-400 w-full">
                    <IconComponent src={'/icons/product-star.svg'} width={14} height={14} />
                    {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0587 */}
                    <div className="flex flex-col gap-y-2 min-w-[83px] w-full">
                        <div className="font-bold text-[14px] leading-[15.4px] text-neutral-900">
                            {`${isNaN(Number(metrics[0].value)) ? 0 : Number(metrics[0]?.value)}/`}
                            <span className="font-semibold text-[12px] leading-[13.2px] text-neutral-600">
                                5
                            </span>
                        </div>
                        <div className="font-medium text-[10px] leading-[10px] text-neutral-700">
                            {t("labelRatingAndReviews")}
                        </div>
                    </div>
                </div>
                {/* FIX BUG Profil Seller Sisi Buyer LB-0041 */}
                {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0587 */}
                <div className="flex flex-col gap-y-2 items-center pr-2 border-r border-r-neutral-400 w-full max-w-[78px]">
                    <div className="font-bold text-[14px] leading-[15.4px] text-neutral-900">
                        {metrics[1]?.value}
                    </div>
                    <div className="font-medium text-[10px] leading-[10px] text-neutral-700">
                        {t("labelProduct")}
                    </div>
                </div>
                <div
                    // FIX BUG Profil Seller Sisi Buyer LB-0041
                    className="flex flex-col gap-y-2 items-center pr-2 w-full cursor-pointer"
                    onClick={() => {
                        setShowBottomsheet(true)
                        setTitleBottomsheet(t("titleOperatingHours"))
                        setDataBottomsheet(
                            // 24. THP 2 - MOD001 - MP - 020 - QC Plan - Web - MuatParts - Profil Seller Sisi Buyer - LB - 0034
                            <div className="h-[255px]">
                                {displaySchedules.map((schedule, key) => (
                                    <Fragment key={key}>
                                        <DaySchedule
                                            {...schedule}
                                            className={key > 0 ? "mt-6" : ""}
                                        />
                                    </Fragment>
                                ))}
                            </div>
                        )
                    }}
                >
                    <div className="font-bold text-[14px] leading-[15.4px] text-neutral-900">
                        {metrics[2]?.value}
                    </div>
                    <div className="font-medium text-[10px] leading-[10px] text-neutral-700">
                        {t("titleOperatingHours")}
                    </div>
                </div>
            </div>
            {titleBottomsheet === t("titleOperatingHours") ? <Bottomsheet/> : null}
        </>
    );
}