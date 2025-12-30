import React, { Fragment } from "react";
import styles from "./ReviewCard.module.scss"
import Image from "next/image";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useLanguage } from "@/context/LanguageContext";

function ReviewCard({
  date,
  time,
  images,
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
    <div className="flex flex-col px-8 py-5 self-stretch bg-white rounded-[10px] border border-solid shadow-muat border-neutral-400 max-w-[898px]">
      <div className="flex justify-between items-center w-full">
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
        <div className="gap-3 self-stretch my-auto font-medium text-[12px] leading-[14.4px] text-right">
          <span className="text-neutral-600">{`${t("buttonReviews")} :`}</span>
          <span className="text-[#1B1B1B]">{` ${date} ${time} WIB`}</span>
        </div>
      </div>
      
      <div className="flex gap-6 items-start mt-5 w-full">
        <div className="flex gap-x-6 w-full min-w-[240px]">
          <div className="flex flex-col">
            <Image
              src={productImage}
              // className="object-contain aspect-square w-[60px]"
              alt="Product thumbnail"
              height={60}
              width={60}
            />
            <div className="flex flex-col justify-center mt-2 w-full">
              <div className="flex h-4 rounded px-1 bg-[#FFF1A5] w-fit items-center">
                <div className="my-auto font-semibold text-[11px] leading-[13.2px] text-[#FF7A00]">{`Kualitas : ${quality}`}</div>
              </div>
              <div className="mt-1 font-semibold text-[12px] leading-[14.4px] w-[120px] text-[#1B1B1B]">
                {productName}
              </div>
            </div>
          </div>

          <div className="flex flex-col min-w-[240px]">
            <div className="flex flex-col w-full">
              <div className="flex gap-4 items-center self-start">
                <div className="flex gap-2 items-center self-stretch my-auto">
                  <div className="flex gap-2 justify-center items-center self-stretch my-auto min-h-[32px] w-[30px]">
                    <Image
                      className="rounded-[30px]"
                      src={userImage}
                      alt="User avatar"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div className="self-stretch my-auto font-semibold text-[14px] leading-[16.8px min-h-[20px] text-[#1B1B1B]">
                    {userName}
                  </div>
                </div>
              </div>
              {reviewText ? (
                <div className="mt-3 font-medium text-[12px] leading-[14.4px] text-neutral-900">
                  {reviewText}
                </div>
              ) : null}
              {images.length > 0 ? (
                <div className="flex gap-2 items-center self-start mt-3">
                  {images.map((src, key) => (
                    <Image
                      key={key}
                      src={src}
                      alt="Product thumbnail"
                      height={60}
                      width={60}
                      className="rounded-[4px] cursor-pointer object-contain"
                      onClick={() => {
                        setImages(images)
                        setActiveIndex(key)
                        setIsModalOpen(true)
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;