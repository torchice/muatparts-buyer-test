import NavigationTabs from "@/containers/Seller/Web/NavigationTabs";
import ProfileSellerHeader from "@/containers/Seller/Web/ProfileSellerHeader/ProfileSellerHeader";
import BerandaContainer from "@/containers/Seller/Web/Beranda/BerandaContainer";
import EtalaseContainer from "@/containers/Seller/Web/Etalase/EtalaseContainer";
import ReviewsContainer from "@/containers/Seller/Web/Review/ReviewsContainer";

function SellerWeb({
    activeTab,
    onChangeTab,
    tabs,
    storeData,
    products,
    vouchers,
    etalaseData,
    reviews,
    reviewSummary,
    loading,
    error,
    productsWithFavorites,
    fetchProducts,
    // Shared search props
    search,
    setSearch,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    selectedEtalaseOption,
    setSelectedEtalaseOption
}) {
    // Common search handler for all tabs
    const handleSearch = (e) => {
      if (e.key === "Enter") {
        setSearchQuery(search);
      }
    };
  
    const handleClearSearch = () => {
      setSearch("");
      setSearchQuery("");
    };
  
    const searchProps = {
      search,
      setSearch,
      searchQuery,
      setSearchQuery,
      handleSearch,
      handleClearSearch,
      filter,
      setFilter,
      selectedEtalaseOption,
      setSelectedEtalaseOption
    };

    const reviewProps = {
      reviewSummary,
      reviews
    }
  
    if (loading && !storeData) {
      return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
  
    if (error) {
      return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
    }
  
    return (
      <>
        <main className="w-full flex justify-center py-[24px]">
          <div className='w-[1200px] flex flex-col'>
            {storeData && <ProfileSellerHeader storeData={storeData} />}
  
            <div className="flex flex-col mt-6">
              <NavigationTabs
                tabs={tabs} 
                activeTab={activeTab} 
                onChangeTab={onChangeTab}
              />
            </div>
            {activeTab === 0 && (
              <BerandaContainer
                loading={loading}
                products={products}
                vouchers={vouchers}
                productsWithFavorites={productsWithFavorites}
                fetchProducts={fetchProducts}
                {...searchProps}
              />
            )}
            {activeTab === 1 && (
              <EtalaseContainer
                loading={loading}
                etalaseData={etalaseData}
                productsWithFavorites={productsWithFavorites}
                onChangeTab={onChangeTab}
                storeName={storeData.name}
                {...searchProps}
              />
            )}
            {activeTab === 2 && (
              <ReviewsContainer
                loading={loading}
                {...searchProps}
                {...reviewProps}
              />
            )}
          </div>
        </main>
      </>
    );
}

export default SellerWeb