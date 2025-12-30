// FIX BUG Pengecekan Ronda Muatparts LB-0089
import IconComponent from "@/components/IconComponent/IconComponent"
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import ImagesPreview from "@/components/ImagesPreview/ImagesPreview";
import { useLanguage } from "@/context/LanguageContext";
import { Fragment, useState } from "react";

const ReviewCardResponsive = ({
    date,
    time,
    images,
    userImage,
    userName,
    rating,
    reviewText
}) => {
    const { t } = useLanguage();
    const maxRating = 5
    const [activeIndex, setActiveIndex] = useState(0)
    const [selectedImages, setSelectedImages] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    return (
        <>
            <div className="flex flex-col gap-y-4 text-neutral-900">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-2">
                        <ImageComponent
                            className="h-full rounded-[30px] border border-neutral-500"
                            src={userImage}
                            alt="profile"
                            width={32}
                            height={32}
                        />
                        <span className="font-semibold text-[14px] leading-[14px]">
                            {userName}
                        </span>
                    </div>
                    <IconComponent
                        src="/icons/three-dots.svg"
                        size="medium"
                        // onclick={() => alert("tugasnya andrew")}
                    />
                </div>
                <div className="flex items-center gap-x-2">
                    <div className="flex gap-x-1 items-center">
                        {[...Array(rating)].map((_, key) => (
                            <Fragment key={key}>
                                <IconComponent src="/icons/star.svg"/>
                            </Fragment>
                        ))}
                        {[...Array(maxRating - rating)].map((_, key) => (
                            <Fragment key={key}>
                                <IconComponent classname="icon-fill-neutral-400" src="/icons/star.svg"/>
                            </Fragment>
                        ))}
                    </div>
                    <span className="font-medium text-[12px] leading-[14.4px]">
                        {`${date} ${time}`}
                    </span>
                </div>
                {reviewText ? (
                    <div>
                        <p className="mt-3 font-medium text-[12px] leading-[14.4px]">{reviewText}</p>
                    </div>
                ) : null}
                {images.length > 0 ? (
                    <div className="flex gap-x-1 items-center w-full">
                        {images.map((image, key) => (
                            <Fragment key={key}>
                                <ImageComponent
                                    className="h-full cursor-pointer object-contain rounded"
                                    src={image}
                                    alt={`review-image`}
                                    width={32}
                                    height={32}
                                    onClick={() => {
                                        setSelectedImages(images)
                                        setActiveIndex(key)
                                        setIsModalOpen(true)
                                    }}
                                />
                            </Fragment>
                        ))}
                    </div>
                ) : null}
            </div>
            <ImagesPreview
                full={true}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                images={selectedImages}
            />
        </>
    )
}

export default ReviewCardResponsive