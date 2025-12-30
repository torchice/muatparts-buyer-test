import { useState, useEffect, useRef } from "react";
import ProductComponent from "../ProductComponent/ProductComponent";
import Button from "../Button/Button";
import AlbumWishlist from "../AlbumWishist/AlbumWishlist";
import { useLanguage } from "@/context/LanguageContext";

const ProductGrid = ({
  initialLoadCount = 18,
  batchSize = 18,
  totalProducts = [],
  maxAutoLoad = 36,
  buttonThreshold = 24,
  title,
  OnSelect,
  grid = 6,
  onLoadMore = () => {
    return;
  },
  loading,
  lastPage,
  currentPage = 1,
}) => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  // const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    setVisibleProducts(totalProducts.slice(0, initialLoadCount));
  }, [totalProducts, initialLoadCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          totalProducts.length < maxAutoLoad &&
          currentPage < lastPage
        ) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [visibleProducts]);

  const loadMoreProducts = () => {
    // if (loading) return;

    // setLoading(true);
    // const currentLength = visibleProducts.length;
    // const nextBatch = totalProducts.slice(
    //   currentLength,
    //   currentLength + batchSize
    // );

    // setTimeout(() => {
    //   setVisibleProducts((prev) => [...prev, ...nextBatch]);
    //   // setLoading(false);
    // }, 500);
    onLoadMore();
  };

  // kalau jumlah product > threshold dan page api nya belum lebih dari last page, masih bisa load
  const showLoadMoreButton =
    totalProducts.length > buttonThreshold && currentPage < lastPage;

  const getGridCols = (length) => {
    if (length === 2)
      return "flex overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";
    if (length === 5) return "grid grid-cols-5";
    return "grid grid-cols-6";
  };

  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB-0280
  return (
    <section className="bg-transparent py-6">
      <div className="w-full max-w-[1080px] mx-auto">
        {title && (
          <h1 className="text-neutral-900 font-bold text-lg pt-4 pb-7">
            {title}
          </h1>
        )}

        <div className={`w-full ${getGridCols(grid)} gap-3`}>
          {/* {visibleProducts
            .filter((product) => Object.keys(product).length > 0)
            .map((product) => (
              <ProductComponent
                key={product.id}
                {...product}
                image={`https://prd.place/170?id=2`}
                OnSelect={(e) => OnSelect(e)}
              />
            ))} */}
          {totalProducts.map((product) => (
            <ProductComponent
              key={product.id}
              {...product}
              image={`https://prd.place/170?id=2`}
              OnSelect={(e) => OnSelect(e)}
            />
          ))}
        </div>

        {totalProducts.length > 6 && <div ref={observerRef} className="h-8" />}

        {/* kalau Loading atau barang lebih dari 24, munculkan Button */}
        {(showLoadMoreButton || loading) && (
          <div className="flex justify-center">
            <Button
              ref={loadMoreRef}
              onClick={loadMoreProducts}
              disabled={loading}
              Class={`place-self-center !font-semibold !text-sm !h-8 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Memuat..." : t("labelMuatLebihBanyak")}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
