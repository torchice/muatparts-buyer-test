import Bottomsheet from "@/components/Bottomsheet/Bottomsheet";
import ListEtalaseProduct from "./ListEtalaseProduct"
import toast from "@/store/toast";
import RadioButton from "@/components/Radio/RadioButton";
import styles from "./ProductEtalase.module.scss";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useLanguage } from "@/context/LanguageContext";
import InfiniteScroll from "../../Component/InfiniteScroll";
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
import useSellerStore from "@/store/seller";

const ProductEtalase = ({
    sellerProfile,
    productByEtalasePagination,
    isLoading,
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0545
    onLoadMore,
    // LBM - OLIVER - RESET PRODUK ETALASE RESPONSIVE SAAT DISORTING - MP - 020
}) => {
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
    const { filter, productByEtalase, setProductByEtalase, setFilter } = useSellerStore();
    const { t } = useLanguage();
    const labelSort = t("labelSort")
    const {
        setShowBottomsheet,
        setTitleBottomsheet,
        setDataBottomsheet,
        titleBottomsheet
    } = toast();

    const handleSortSelect = (value) => () => {
        // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
        setFilter({ sort: value, page: 1 })
        // LBM - OLIVER - RESET PRODUK ETALASE RESPONSIVE SAAT DISORTING - MP - 020
        setProductByEtalase([])
        renderSortBottomsheet(value)
    }

    const renderSortBottomsheet = (currentSort) => {
        setDataBottomsheet(
            <div className="flex flex-col gap-y-3">
                <span className="font-bold text-[14px] leading-[15.4px]">
                    {t("buttonReviews")}
                </span>
                <RadioButton
                    label={t("labelNewest")}
                    name="newest"
                    checked={currentSort === "newest"}
                    onClick={handleSortSelect("newest")}
                />
                <RadioButton
                    label={t("labelOldest")}
                    name="oldest"
                    checked={currentSort === "oldest"}
                    onClick={handleSortSelect("oldest")}
                />
            </div>
        )
    }

    const handleOpenBottomsheet = () => {
        setShowBottomsheet(true)
        setTitleBottomsheet(labelSort)
        renderSortBottomsheet(filter.sort)
    }

    return (
        <>
            <div className="py-5 px-4 flex flex-col gap-y-4 mb-[100px]">
                <button
                    className={`flex gap-2 items-center px-3 h-[30px] rounded-3xl border border-solid w-fit
                        ${filter.sort ? "text-primary-700 border-primary-700 bg-primary-50" : "bg-neutral-200 border-neutral-200 text-neutral-900"}
                    `}
                    onClick={handleOpenBottomsheet}
                >
                    <div className="font-medium text-[14px] leading-[15.4px]">
                        {t("labelSort")}
                    </div>
                    <IconComponent
                        classname={filter.sort ? styles.icon_active : styles.icon_inactive}
                        src="/icons/sorting.svg"
                        height={14}
                        width={14}
                    />
                </button>
                {/* LBM - OLIVER - IMP INFINITE SCROLL ETALASE - MP - 020 */}
                <InfiniteScroll
                    isLoading={isLoading || productByEtalase.length === 0}
                    hasMore={filter.page < productByEtalasePagination?.LastPage}
                    onScrollToBottom={onLoadMore}
                >
                    <ListEtalaseProduct sellerProfile={sellerProfile} />
                </InfiniteScroll>
            </div>
            {titleBottomsheet === labelSort ? <Bottomsheet withReset onClickReset={handleSortSelect(null)}/> : null}
        </>
    )
}

export default ProductEtalase