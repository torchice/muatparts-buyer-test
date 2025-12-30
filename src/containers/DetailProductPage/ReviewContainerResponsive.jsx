// FIX BUG Pengecekan Ronda Muatparts LB-0089
import SWRHandler from "@/services/useSWRHook";
import ReviewCardResponsive from "./ReviewCardResponsive";
import { SectionCard } from "./DetailProductPageResponsive";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useHeader } from "@/common/ResponsiveContext";
// LBM - Multibahasa Optimization
import { useLanguage } from "@/context/LanguageContext";
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0770
const ReviewContainerResponsive = ({ sellerProfile, sellerId, productName }) => {
    const {t} = useLanguage()
     const { setScreen } = useHeader();
    const { useSWRHook } = SWRHandler();
    const { data: dataReviews } = useSWRHook(
        `v1/stores/${sellerId}/reviews?page=1&size=4&search=${productName}`
    );
    const reviews = dataReviews?.Data ? dataReviews.Data.reviews : []
    const total = dataReviews?.Data ? dataReviews.Data.pagination.Total : 0
    if (reviews.length === 0) {
        return null
    }
    return (
        <SectionCard classname="gap-6">
            <div className="flex flex-col gap-y-4">
                <h3 className="font-semibold text-[14px] leading-[15.4px]">
                    {t("LabelulasanSectionUlasanPembeli")}
                </h3>
                <div className="flex items-center gap-x-1">
                    <IconComponent
                        src="/icons/star.svg"
                        size="medium"
                    />
                    <span className="font-bold text-[14px] leading-[15.4px]">
                        {sellerProfile?.rating?.averateRating}
                    </span>
                    <span className="font-medium text-[14px] leading-[15.4px] text-neutral-700">
                        {`${sellerProfile?.rating?.totalRatings} ${t("LabelulasanSectionRating")}`}
                    </span>
                    <div className="size-0.5 bg-neutral-700 rounded" />
                    <span className="font-medium text-[14px] leading-[15.4px] text-neutral-700">
                        {`${sellerProfile?.rating?.totalReviews} ${t("LabelulasanSectionUlasan")}`}
                    </span>
                </div>
            </div>
            {reviews.map((review, key) => (
                <div className={reviews.length - 1 === key ? "" : "pb-4 border-b border-b-neutral-400"} key={key}>
                    <ReviewCardResponsive {...review} />
                </div>
            ))}
            {total > 4 ? (
                <div className="flex justify-end items-center">
                    <button
                        className="font-medium text-[14px] leading-[15.4px] text-primary-700"
                        onClick={() => setScreen("ulasan")}
                    >
                        {t("LabelulasanSectionLihatSelengkapnya")}
                    </button>
                </div>
            ) : null}
        </SectionCard>
    )
}

export default ReviewContainerResponsive