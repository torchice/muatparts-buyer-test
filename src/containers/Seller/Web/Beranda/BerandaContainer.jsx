import { Fragment, useState } from "react";
import styles from "./BerandaContainer.module.scss"
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import VoucherList from "./Voucher/VoucherList";
import ProductSection from "./Product/ProductSection";
import VoucherModal from "./Voucher/VoucherModal";
import { userZustand } from "@/store/auth/userZustand";
import VoucherDetailModal from "@/components/Voucher/VoucherDetailModal";
import { useLanguage } from "@/context/LanguageContext";
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
import useSellerStore from "@/store/seller";

const BerandaContainer = ({
    // LBM - OLIVER - PASSING STATE LOADING UNTUK SKELETON - MP - 020
    isLoadingProductByBestSeller,
    isLoadingProductByFavorite,
    isLoadingProductByNewest,
    isLoadingTabOne,
    sellerProfile,
    sellerVouchers,
    productByBestSeller,
    productByFavorite,
    productByNewest,
    onRefreshVoucher,

    // Shared search props
    onSearch,
    onClearSearch
  }) => {
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
    const { filter, search, setSearch } = useSellerStore();
    const user = userZustand()
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
    const [isVoucherDetailModalOpen, setIsVoucherDetailModalOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const { t } = useLanguage();

    const handleShowVoucherInfo = (id) => {
        setIsVoucherDetailModalOpen(true)
    }

    // LBM - OLIVER - PASSING STATE LOADING UNTUK SKELETON - MP - 020
    const productsSection = [
        {
            title: t("titleBestSellers"),
            products: productByBestSeller,
            isLoading: isLoadingProductByBestSeller
        },
        {
            title: t("labelFavoriteProducts"),
            products: productByFavorite,
            isLoading: isLoadingProductByFavorite
        },
        {
            title: t("labelLatestProducts"),
            products: productByNewest,
            isLoading: isLoadingProductByNewest
        },
    ]

    const isFirstTimerAllProductsEmpty = filter.searchQuery === "" && 
        productByBestSeller.length < 3 &&
        productByFavorite.length < 3 &&
        productByNewest.length < 3;

    return (
        <>
            {(user?.id && sellerVouchers.length > 0) ? (
                <>
                    <div className="flex gap-x-4 mt-4 items-center">
                        <span className="font-semibold text-[16px] leading-[19.2px]">
                            {t("labelSellerVoucher")}
                        </span>
                        <button className="font-bold text-[12px] leading-[14.4px] text-primary-700" onClick={() => setIsVoucherModalOpen(true)}>
                            {t("buttonSeeAll")}
                        </button>
                    </div>
                    <VoucherList
                        sellerVouchers={sellerVouchers}
                        setSelectedVoucher={setSelectedVoucher}
                        setIsVoucherDetailModalOpen={setIsVoucherDetailModalOpen}
                        onRefreshVoucher={onRefreshVoucher}
                    />
                </>
            ) : null}
            {/* LBM - OLIVER - PASSING STATE LOADING UNTUK SKELETON - MP - 020 */}
            {isFirstTimerAllProductsEmpty && !isLoadingTabOne ? null : (
                <div className="flex flex-col items-center mt-6 bg-white rounded-xl shadow-muat px-[60px] py-6">
                    <div className='self-start'>
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
                    </div>
                    <div className="mt-4 flex flex-col gap-y-6">
                        {/* LBM - OLIVER - PASSING STATE LOADING UNTUK SKELETON - MP - 020 */}
                        {productsSection.map((productSection, key) => {
                            // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
                            if (filter.searchQuery === "" && productSection.products.length < 3 && !productSection.isLoading) {
                                return null
                            }
                            return (
                                <Fragment key={key}>
                                    <ProductSection
                                        title={productSection.title}
                                        sellerProfile={sellerProfile}
                                        products={productSection.products}
                                        isLoading={productSection.isLoading}
                                    />
                                </Fragment>
                            )
                        })}
                    </div>
                </div>
            )}
            <VoucherModal
                isOpen={isVoucherModalOpen}
                setIsOpen={setIsVoucherModalOpen}
                onShowVoucherInfo={handleShowVoucherInfo}
                sellerProfile={sellerProfile}
                setSelectedVoucher={setSelectedVoucher}
                setIsVoucherDetailModalOpen={setIsVoucherDetailModalOpen}
            />
            {/* <VoucherDetailModal
                isOpen={isVoucherDetailModalOpen}
                setIsOpen={setIsVoucherDetailModalOpen}
            /> */}
            <VoucherDetailModal
              isOpen={isVoucherDetailModalOpen}
              setIsOpen={setIsVoucherDetailModalOpen}
              id={selectedVoucher?.uuid}
            />
        </>
    )
}

export default BerandaContainer