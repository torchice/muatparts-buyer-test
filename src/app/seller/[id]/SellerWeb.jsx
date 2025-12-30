import NavigationTabs from "@/containers/Seller/Web/NavigationTabs";
import ProfileSellerHeader from "@/containers/Seller/Web/ProfileSellerHeader/ProfileSellerHeader";
import BerandaContainer from "@/containers/Seller/Web/Beranda/BerandaContainer";
import EtalaseContainer from "@/containers/Seller/Web/Etalase/EtalaseContainer";
import ReviewsContainer from "@/containers/Seller/Web/Review/ReviewsContainer";
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
import useSellerStore from "@/store/seller";
// Improvement Impact Nonaktif User Seller Muatparts
import ModalComponent from "@/components/Modals/ModalComponent";
import { useCustomRouter } from "@/libs/CustomRoute";
import Button from "@/components/Button/Button";
import { useLanguage } from "@/context/LanguageContext";

function SellerWeb({
    onChangeTab,
    onRefreshVoucher,
    // DARI API
    isLoadingSellerProfile,
    // LBM - OLIVER - PASSING STATE LOADING UNTUK SKELETON - MP - 020
    isLoadingProductByBestSeller,
    isLoadingProductByFavorite,
    isLoadingProductByNewest,
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

    selectedEtalase,
    setSelectedEtalase
}) {
  // Improvement Impact Nonaktif User Seller Muatparts
  const {t} = useLanguage()
  const router = useCustomRouter()
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
  const { activeTab, clearSearch, setSearchQuery } = useSellerStore();

  // Common search handler for all tabs
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchQuery();
    }
  };
  
  const handleClearSearch = () => clearSearch();
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
  return (
    <>
      <main className="w-full flex justify-center py-[24px]">
        <div className='w-[1200px] flex flex-col'>
          {sellerProfile && <ProfileSellerHeader sellerProfile={sellerProfile} />}

          <div className="flex flex-col mt-6">
            <NavigationTabs onChangeTab={onChangeTab} />
          </div>
          {activeTab === 0 && (
            <BerandaContainer
              // API
              isLoadingTabOne={isLoadingTabOne}
              sellerProfile={sellerProfile}
              sellerVouchers={sellerVouchers}
              productByBestSeller={productByBestSeller}
              productByFavorite={productByFavorite}
              productByNewest={productByNewest}
              onRefreshVoucher={onRefreshVoucher}
              // LBM - OLIVER - PASSING STATE LOADING UNTUK SKELETON - MP - 020
              isLoadingProductByBestSeller={isLoadingProductByBestSeller}
              isLoadingProductByFavorite={isLoadingProductByFavorite}
              isLoadingProductByNewest={isLoadingProductByNewest}
              onSearch={handleSearch}
              onClearSearch={handleClearSearch}
            />
          )}
          {activeTab === 1 && (
            <EtalaseContainer
              onChangeTab={onChangeTab}
              selectedEtalase={selectedEtalase}
              setSelectedEtalase={setSelectedEtalase}

              // API
              sellerProfile={sellerProfile}
              etalase={etalase}
              // LBM - OLIVER - PASSING STATE LOADING UNTUK SKELETON - MP - 020
              isLoadingProductByEtalase={isLoadingProductByEtalase}
              pagination={productByEtalasePagination}

              onSearch={handleSearch}
              onClearSearch={handleClearSearch}
            />
          )}
          {activeTab === 2 && (
            <ReviewsContainer
              onSearch={handleSearch}
              onClearSearch={handleClearSearch}
              sellerProfile={sellerProfile}
              pagination={reviewsPagination}
            />
          )}
        </div>
        {/* // Improvement Impact Nonaktif User Seller Muatparts */}
      <ModalComponent classname="!w-full" classnameContent={"!w-full max-w-[398px] !px-0 pb-0"} isOpen={!sellerProfile?.storeIsActive} preventAreaClose={true} setClose={()=>{router.back()}} >
         <div className="flex flex-col items-center justify-center px-6 py-9 !w-full gap-6">
           <p className="text-sm font-medium leading-3">{t("LabeldetailTokoTidakDitemukanTokotidaktersedia")}</p>
           <Button onClick={()=>{router.back()}} Class="!leading-3">Oke</Button>
         </div>
       </ModalComponent>
      </main>
    </>
  );
}

export default SellerWeb