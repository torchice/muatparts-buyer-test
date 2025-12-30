import { useHeader } from "@/common/ResponsiveContext";
import { useEffect, useState } from "react";
import StoreHeader from "@/containers/Seller/Responsive/StoreHeader";
import StoreTabs from "@/containers/Seller/Responsive/StoreTabs";
import BerandaContainer from "@/containers/Seller/Responsive/Beranda/BerandaContainer";
import EtalaseContainer from "@/containers/Seller/Responsive/Etalase/EtalaseContainer";
import ReviewContainer from "@/containers/Seller/Responsive/Review/ReviewContainer";
import Filter from "@/containers/Seller/Responsive/Review/Filter";
import ProductEtalase from "@/containers/Seller/Responsive/Etalase/ProductEtalase";
import VoucherContainer from "@/containers/Seller/Responsive/Voucher/VoucherContainer";
import { userZustand } from "@/store/auth/userZustand";
import VoucherDetail from "@/containers/Seller/Responsive/Voucher/VoucherDetail";
import SellerResponsiveHeader from "@/containers/Seller/Component/SellerResponsiveHeader";
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
import useSellerStore from "@/store/seller";
// Improvement Impact Nonaktif User Seller Muatparts
import Modal from "@/components/Modals/modal";
import Button from "@/components/Button/Button";
import { useCustomRouter } from "@/libs/CustomRoute";
import { useLanguage } from "@/context/LanguageContext";
import VoucherSeller from "@/components/VoucherMobile/VoucherSeller";
// LBM
import { useParams } from "next/navigation";
export default function SellerResponsive({
  onChangeTab,
  onRefreshVoucher,
  // 24. THP 2 - MOD001 - MP - 020 - QC Plan - Web - MuatParts - Profil Seller Sisi Buyer - LB - 0051
  isEtalasePage,
  setIsEtalasePage,
  onLoadMore,
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0503
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0504
  // DARI API
  isLoadingSellerProfile,
  isLoadingTabOne,
  isLoadingProductByEtalase,
  isLoadingTabTwo,
  isLoadingTabThree,
  sellerProfile,
  sellerVouchers,
  productByBestSeller,
  productByFavorite,
  productByNewest,
  etalase,
  productByEtalasePagination,
  reviewsPagination,
  setSelectedEtalase
}) {
  // Improvement Impact Nonaktif User Seller Muatparts
  const {t} = useLanguage()
  const router = useCustomRouter()
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
  const { activeTab, setFilter, setProductByEtalase, setReviews } = useSellerStore();
  // LBM - OLIVER - FIX MENYAMAKAN KOMPONEN ULASAN TERKAIT ULASAN DI DETAIL PRODUK - MP - 020
  const { setAppBar, screen, clearScreen } = useHeader();
  const user = userZustand()
  const [tempRating, setTempRating] = useState([])
  const [selectedVoucherId, setSelectedVoucherId] = useState(null)

  const params = useParams();

  useEffect(() => {
    if (screen === "") {
      setAppBar({
        // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
        appBarType: "header_custom",
        renderAppBar: <SellerResponsiveHeader isEtalasePage={isEtalasePage} setIsEtalasePage={setIsEtalasePage} />,
        bottomTabNavigation: true,
      })
    }
  }, [isEtalasePage, screen]);

  // LBM - OLIVER - FIX MENYAMAKAN KOMPONEN ULASAN TERKAIT ULASAN DI DETAIL PRODUK - MP - 020
  const handleCancelFilter = () => {
    setTempRating([])
    clearScreen()
  }
  // LBM - OLIVER - FIX MENYAMAKAN KOMPONEN ULASAN TERKAIT ULASAN DI DETAIL PRODUK - MP - 020
  const handleSaveFilter = () => {
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
    setFilter({ rating: tempRating, page: 1 })
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0503
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0504
    setReviews([])
    clearScreen()
  }

  const handleSelectEtalase = (item) => {
    setProductByEtalase([])
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
    setFilter({ page: 1 })
    setSelectedEtalase(item)
    setIsEtalasePage(true)
  }

  if (isLoadingSellerProfile || isLoadingTabOne) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  // LBM - OLIVER - FIX MENYAMAKAN KOMPONEN ULASAN TERKAIT ULASAN DI DETAIL PRODUK - MP - 020
  if(screen==='filter') {
    return (
      <Filter
        onCancelFilter={handleCancelFilter}
        onSaveFilter={handleSaveFilter}
        tempRating={tempRating}
        setTempRating={setTempRating}
      />
    )
  }

  if (screen === "voucher") {
    return <VoucherDetail id={selectedVoucherId} />
  }

  if (isEtalasePage) {
    return (
      <ProductEtalase
        sellerProfile={sellerProfile}
        productByEtalasePagination={productByEtalasePagination}
        // LBM - OLIVER - IMP INFINITE SCROLL ETALASE - MP - 020
        isLoading={isLoadingProductByEtalase}
        onLoadMore={onLoadMore}
        // LBM - OLIVER - RESET PRODUK ETALASE RESPONSIVE SAAT DISORTING - MP - 020
      />
    )
  }

  // 25.03 LB 0300, 0366, 0338

  return (
    <div className="flex flex-col gap-y-2 pb-20 bg-neutral-200 mb-10 w-full">
      {sellerProfile && (
        <StoreHeader
          {...sellerProfile}
        />
      )}
      {
        (user?.id && sellerVouchers.length > 0) ? (
          <VoucherSeller
            seller_id={params?.id}
          />
        ) : null
      }
      {/* {(user?.id && sellerVouchers.length > 0) ? (
        <VoucherContainer
          sellerVouchers={sellerVouchers}
          setSelectedVoucherId={setSelectedVoucherId}
          onRefreshVoucher={onRefreshVoucher}
        />
      ) : null} */}
      <div className={`bg-white flex flex-col ${activeTab === 0 ? "gap-y-5" : "gap-y-4"}`}>
        <StoreTabs onTabChange={onChangeTab} />
        {activeTab === 0 && (
          <BerandaContainer
            isLoadingTabOne={isLoadingTabOne}
            sellerProfile={sellerProfile}
            productByBestSeller={productByBestSeller}
            productByFavorite={productByFavorite}
            productByNewest={productByNewest}
          />
        )}
        {activeTab === 1 && (
          <EtalaseContainer
            onSelectEtalase={handleSelectEtalase}
            // API
            etalase={etalase}
            isLoadingTabTwo={isLoadingTabTwo}
          />
        )}
        {activeTab === 2 && (
          <ReviewContainer 
            sellerProfile={sellerProfile}
            reviewsPagination={reviewsPagination}
            setTempRating={setTempRating}
            // 24. THP 2 - MOD001 - MP - 020 - QC Plan - Web - MuatParts - Profil Seller Sisi Buyer - LB - 0051
            onLoadMore={onLoadMore}
            isLoading={isLoadingTabThree}
            // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0503
            // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0504
          />
        )}
      </div>
      {/* // Improvement Impact Nonaktif User Seller Muatparts */}
            <Modal isOpen={!sellerProfile?.storeIsActive} setIsOpen={()=>{router.back()}}>
              <div className="flex flex-col gap-4 items-center">
                <p className="text-sm font-medium">{t("LabeldetailTokoTidakDitemukanTokotidaktersedia")}</p>
                <Button onClick={()=>{router.back()}} Class="!leading-3">Ok</Button>
              </div>
            </Modal>
    </div>
  );
}