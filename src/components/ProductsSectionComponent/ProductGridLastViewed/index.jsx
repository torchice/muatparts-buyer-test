"use client";
import SWRHandler from "@/services/useSWRHook";
import ProductGrid from "../ProductGrid";
import { useEffect, useState, useCallback } from "react";
import { metaSearchParams } from "@/libs/services";

// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB-0280

export default function ProductGridLastViewed({ title }) {
  const [datas, setDatas] = useState([]);
  const [params, setParams] = useState({
    size: 18,
    page: 1,
  });
  const { useSWRHook } = SWRHandler();

  const PRODUCT_MOST_VIEWED_ENDPOINT = `v1/muatparts/product/most_viewed?size=${params.size}&page=${params.page}`;

  const { data, isLoading } = useSWRHook(PRODUCT_MOST_VIEWED_ENDPOINT);

  const handleFetchNextViewed = useCallback(() => {
    setParams((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  useEffect(() => {
    if (data && data.Data) {
      if (params.page === 1) {
        // For first page, just set the data
        setDatas(data.Data);
      } else {
        // For subsequent pages, append data
        setDatas((prev) => [...prev, ...data.Data]);
      }
    }
  }, [data, params.page]); // Include params.page in dependencies

  return (
    <ProductGrid
      loading={isLoading}
      title={title}
      totalProducts={datas}
      onLoadMore={handleFetchNextViewed}
      currentPage={params.page}
      lastPage={data?.Pagination?.LastPage ?? 0}
      buttonThreshold={24}
    />
  );
}
