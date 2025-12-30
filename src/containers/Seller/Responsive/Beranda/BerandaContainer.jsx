import { Fragment } from "react"
import ProductGrid from "./ProductGrid"
import { useLanguage } from "@/context/LanguageContext";
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
import useSellerStore from "@/store/seller";

const BerandaContainer = ({
  isLoadingTabOne,
  sellerProfile,
  productByBestSeller,
  productByFavorite,
  productByNewest,
}) => {
  const { t } = useLanguage();
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
  const { filter } = useSellerStore();
  const productsSection = [
    {
        title: t("titleBestSellers"),
        products: productByBestSeller
    },
    {
        title: t("labelFavoriteProducts"),
        products: productByFavorite
    },
    {
        title: t("labelLatestProducts"),
        products: productByNewest
    },
  ]
  {/* FIX BUG Profil Seller Sisi Buyer LB-0044 */}
  const isFirstTimerAllProductsEmpty = filter.searchQuery === "" && 
    productByBestSeller.length < 3 &&
    productByFavorite.length < 3 &&
    productByNewest.length < 3;

  if (isFirstTimerAllProductsEmpty) {
    return null
  }

  return (
    <div className="flex flex-col items-start pl-4 gap-y-6 w-full overflow-x-hidden">
      {/* FIX BUG Profil Seller Sisi Buyer LB-0044 */}
      {productsSection.map((productSection, key) => {
        if (filter.searchQuery === "" && productSection.products.length < 3) {
          return null
        }
        return (
          <Fragment key={key}>
            <ProductGrid
              title={productSection.title}
              sellerProfile={sellerProfile}
              products={productSection.products}
            />
          </Fragment>
        )
      })}
    </div>
  )
}

export default BerandaContainer