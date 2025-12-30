import React, { Fragment, useState } from 'react';
import RatingFilter from './RatingFilter';
import ReviewCard from './ReviewCard';
import styles from "./ReviewsContainer.module.scss"
import Input from '@/components/Input/Input';
import IconComponent from '@/components/IconComponent/IconComponent';
import ImagesPreview from '@/components/ImagesPreview/ImagesPreview';
import DataNotFound from '@/components/DataNotFound/DataNotFound';
import PaginationSeller from '../PaginationSeller';
import { useLanguage } from '@/context/LanguageContext';
// FIX BUG Profil Seller Sisi Buyer LB-0043
// FIX BUG Pengecekan Ronda Muatparts LB-0054
import SortingDropdown from '../../Component/SortingDropdown';
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
import useSellerStore, { defaultFilter } from '@/store/seller';

export default function ReviewsContainer({
  sellerProfile,
  pagination,
  onSearch,
  onClearSearch
}) {
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
  const { filter, reviews, search, setFilter, setSearch } = useSellerStore();
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0)
  const [images, setImages] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const options = [
    {
        label: t("labelNewest"),
        value: "newest"
    },
    {
        label: t("labelOldest"),
        value: "oldest"
    },
    {
      label: t("labelHighest"),
      value: "highest"
    },
    {
      label: t("labelLowest"),
      value: "lowest"
    },
  ];
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
  const handleChange = (value) => setFilter({ sort: value });

  const previewImageProps = {
    setActiveIndex,
    setImages,
    setIsModalOpen
  }

  const isEmptyFirstTimer = reviews?.length === 0 && JSON.stringify(defaultFilter) === JSON.stringify(filter)

  return (
    <>
      <div className="flex gap-x-[38px] w-full mt-6">
        {/* Rating Filter - Kiri */}
        <div className="w-[264px] flex-shrink-0">
          <RatingFilter {...sellerProfile.rating ?? 0} />
        </div>

        {/* Container Ulasan - Kanan */}
        <div className="flex-1 min-w-0 max-w-[898px]">
          <div className="flex flex-col gap-y-4 pb-6">
            {/* Header */}
            {!isEmptyFirstTimer ? (
              <>
                <div className="flex flex-col w-full gap-y-3">
                  <div className="font-bold text-[18px] leading-[21.6px] text-neutral-900">
                    {t("titleProductReviews")}
                  </div>
                  <div className="font-medium text-[12px] leading-[14.4px] text-neutral-700">
                    {`${t("labelShowing")} ${reviews?.length} ${t("buttonReviews")}`}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex gap-x-3">
                  <Input
                      classname={`w-[262px] ${styles.input_search}`}
                      placeholder={t("placeholderSearchProduct")}
                      icon={{
                        left: (
                          <IconComponent src={"/icons/search.svg"} />
                        ),
                        right: search ? (
                          <IconComponent
                            src={"/icons/silang.svg"}
                            onclick={onClearSearch}
                          />
                        ) : null,
                      }}
                      value={search}
                      changeEvent={(e) => setSearch(e.target.value)}
                      onKeyUp={onSearch}
                  />
                  {/* SORTING DROPDOWN */}
                  <SortingDropdown
                    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
                    disabled={reviews?.length === 0 && filter.searchQuery !== "" && !filter.sort}
                    onChange={handleChange}
                    options={options}
                    value={filter.sort}
                  />
                </div>
              </>
            ) : null}

            {/* Review Cards */}
            <div>
              {reviews.length === 0 ? (
                <div className={`${isEmptyFirstTimer ? "mt-[50px]" : "mt-5"} w-full flex justify-center`}>
                  <DataNotFound
                    title={isEmptyFirstTimer ? t("messageNoReviewsYet") : t("messageKeywordNotFound")}
                    type={isEmptyFirstTimer ? "data" : "search"}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-y-4">
                  {reviews.map((review, key) => (
                    <Fragment key={key}>
                      <ReviewCard
                        {...review}
                        {...previewImageProps}
                      />
                    </Fragment>
                  ))}
                </div>
              )}
            </div>

            {reviews?.length > 0 ? (
              <div className="flex justify-end">
                <PaginationSeller
                  currentPage={filter.page}
                  totalPages={pagination?.LastPage}
                  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
                  onPageChange={(pageNumber) => setFilter({ page: pageNumber })}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <ImagesPreview
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        images={images}
      />
    </>
  );
}