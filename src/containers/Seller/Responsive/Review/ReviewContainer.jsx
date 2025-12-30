import ReviewFilter from "./ReviewFilter";
import ReviewCard from "./ReviewCard";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { useHeader } from "@/common/ResponsiveContext";
import { Fragment, useState } from "react";
import ImagesPreview from "@/components/ImagesPreview/ImagesPreview";
import { useLanguage } from "@/context/LanguageContext";
import InfiniteScroll from "../../Component/InfiniteScroll";
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
import useSellerStore, { defaultFilter } from "@/store/seller";

function ReviewContainer({
    sellerProfile,
    reviewsPagination,
    setTempRating,
    onLoadMore,
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0503
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0504
    isLoading
}) {
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
    const { filter, reviews } = useSellerStore();
    const { t } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0)
    const [images, setImages] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const isEmptyFirstTimer = reviews?.length === 0 && JSON.stringify(defaultFilter) === JSON.stringify(filter)

    const previewImageProps = {
        setActiveIndex,
        setImages,
        setIsModalOpen
    }

    return (
        <>
            <div className="flex overflow-hidden flex-col justify-end w-full max-w-[480px]">
                {/* <ReviewHeader /> */}
                {/* Profil Seller Sisi Buyer LB-0045 */}
                {isEmptyFirstTimer ? (
                    <DataNotFound
                        classname="my-[75px]"
                        title={t("messageNoReviewsYet")}
                        type="data"
                    />
                ) : (
                    <div className="flex flex-col w-full">
                        <ReviewFilter
                            {...sellerProfile.rating}
                            setTempRating={setTempRating}
                            // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0503
                            // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0504
                        />
                        {reviews.length === 0 ? (
                            <DataNotFound
                                classname="my-[75px]"
                                title={t("messageKeywordNotFound")}
                                type={"search"}
                            />
                        ) : (
                            // 24. THP 2 - MOD001 - MP - 020 - QC Plan - Web - MuatParts - Profil Seller Sisi Buyer - LB - 0051
                            <InfiniteScroll
                                isLoading={isLoading || reviews.length === 0}
                                hasMore={filter.page < reviewsPagination?.LastPage}
                                onScrollToBottom={onLoadMore}
                            >
                                <div className="flex flex-col gap-y-2 bg-neutral-200">
                                    {reviews.map((review, key) => (
                                        <Fragment key={key}>
                                            <ReviewCard {...review} {...previewImageProps} />
                                        </Fragment>
                                    ))}
                                </div>
                            </InfiniteScroll>
                        )}
                    </div>
                )}
            </div>
            <ImagesPreview
                // 24. THP 2 - MOD001 - MP - 020 - QC Plan - Web - MuatParts - Profil Seller Sisi Buyer - LB - 0046
                // 24. THP 2 - MOD001 - MP - 020 - QC Plan - Web - MuatParts - Profil Seller Sisi Buyer - LB - 0051
                full
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                images={images}
            />
        </>
    );
}

export default ReviewContainer;