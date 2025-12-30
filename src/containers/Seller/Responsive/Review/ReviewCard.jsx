import IconComponent from "@/components/IconComponent/IconComponent";
import Image from "next/image";
import { Fragment } from "react";
import styles from "./ReviewCard.module.scss"
import { useLanguage } from "@/context/LanguageContext";

function ReviewCard({
    date,
    time,
    images,
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0501
    productImage,
    userImage,
    userName,
    rating,
    reviewText,
    productName,
    quality,
    setActiveIndex,
    setImages,
    setIsModalOpen
}) {
    const { t } = useLanguage();
    const maxRating = 5
  
    return (
        <div className="flex flex-col w-full bg-white py-3 px-4 gap-y-3">
            <div className="flex flex-col">
                <div className="flex gap-x-2">
                    <Image
                        className="h-full rounded-[30px]"
                        src={userImage}
                        alt="profile"
                        width={30}
                        height={30}
                    />
                    <div className="flex flex-col gap-y-1">
                        <span className="font-semibold text-[14px] leading-[16.8px]">{userName}</span>
                        <div className="flex gap-1 items-center self-stretch my-auto">
                            {[...Array(rating)].map((_, key) => (
                                <Fragment key={key}>
                                    <IconComponent src="/icons/star.svg"/>
                                </Fragment>
                            ))}
                            {[...Array(maxRating - rating)].map((_, key) => (
                                <Fragment key={key}>
                                    <IconComponent classname={styles.icon_rating_gray} src="/icons/star.svg"/>
                                </Fragment>
                            ))}
                            </div>
                    </div>
                </div>
                {images.length > 0 ? (
                    <div className="flex gap-3 items-center w-full mt-4">
                        {images.map((image, key) => (
                            <Fragment key={key}>
                                <Image
                                    className="h-full cursor-pointer object-contain"
                                    src={image}
                                    alt={`Review image ${key + 1}`}
                                    width={39}
                                    height={39}
                                    onClick={() => {
                                        setImages(images)
                                        setActiveIndex(key)
                                        setIsModalOpen(true)
                                    }}
                                />
                            </Fragment>
                        ))}
                    </div>
                ) : null}
                {reviewText ? <span className="mt-3 text-[12px] leading-[14.4px]">{reviewText}</span> : null}
            </div>

            <div className="p-1 bg-neutral-200 flex gap-x-3 items-center rounded-md">
                <Image
                    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0501
                    src={productImage}
                    alt={`review`}
                    width={49}
                    height={49}
                />
                <div className="flex flex-col gap-y-2">
                    <div className="font-bold text-[12px] leading-[13.2px] text-ellipsis">
                        {productName}
                    </div>
                    <div className="font-medium text-[12px] leading-[13.2px]">
                        {`${t("labelQuality")} : ${quality}`}
                    </div>
                </div>
            </div>

            <div className="font-medium text-[12px] leading-[14.4px]">
                <span className="text-black">{`${date} ${time} WIB`}</span>
            </div>
        </div>
    );
}

export default ReviewCard;