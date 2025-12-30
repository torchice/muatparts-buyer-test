"use client";
import { viewport } from "@/store/viewport";
import React, { useEffect, useMemo, useState } from "react";
import DetailProductPageResponsive from "./DetailProductPageResponsive";
import DetailProductPageWeb from "./DetailProductPageWeb";
import SWRHandler from "@/services/useSWRHook";
import {
  userLocation,
  userLocationZustan,
} from "@/store/manageLocation/managementLocationZustand";
import { useCustomRouter } from "@/libs/CustomRoute";
import ProtectComponent from "@/common/ProtectComponent";
import { notFound } from "next/navigation";
import { useHeader } from "@/common/ResponsiveContext";
import { formatDate } from "@/libs/DateFormat";
import GlobalLoading from "@/components/GlobalLoading/GlobalLoading";
import { metaSearchParams } from "@/libs/services";
import DetailProdukSkeleton from "./DetailProductSkeleton";
import DetailProdukResponsiveSkeleton from "./DetailProductResponsiveSkeleton";
import useSellerStore from "@/store/seller";

const weekDays = {
  sunday: "Minggu",
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
};
function DetailProductPage({ product, params, ...prop }) {
  const {setAppBar}=useHeader()
  const { isLogin } = prop;
  const { locations, setLocation, selectedLocation,setSelectedLocations } = userLocationZustan();
  const date = new Date();
  const today = Object.entries(weekDays)?.[date.getDay()]?.[0];
  const [showDescription, setShowDescription] = useState(false);
  const [getExpanded, setExpanded] = useState(["scania"]);
  const [getMultipleAlamatProducts, setMultipleAlamatProducts] = useState([]);
  const [getTotalStock, setTotalStock] = useState({totalStock:[]});
  const [getDateStoreOpen, setDateStoreOpen] = useState('');
  const [getCompatibility,setCompatibility]=useState({garageID:'',productID:''})
  // console.log(getMultipleAlamatProducts,getTotalStock)
  function handleMultipleAlamatVariantProduct(val,isMultiple){
    if(isMultiple) setMultipleAlamatProducts(a=>([...a,val]))
    else setMultipleAlamatProducts(getMultipleAlamatProducts?.slice(0,1))
  }
  const checkJamBuka = (val) => {
    let startTime = val?.split("-")?.[0]?.trim()?.split(".")?.[0];
    let endTime = val?.split("-")?.[1]?.trim()?.split(".")?.[0];
    if (
      date.getHours() >= parseInt(startTime) &&
      date.getHours() <= parseInt(endTime)
    ) {
      return true;
    }
    return false;
  };
  function handleExpanded(id) {
    if (getExpanded.some((val) => val === id)) {
      let tmp = getExpanded.filter((val) => val !== id);
      setExpanded(tmp);
    } else {
      setExpanded((prev) => [...prev, id]);
    }
  }
  const { useSWRHook,useSWRMutateHook } = SWRHandler();
  
  const { data: product_backup, isLoading:loading_product } = useSWRHook('v1/muatparts/buyer/product/'+params);
  const { data: check_compatibility, isLoading:check_compatibility_loading, error:error_compatibility } = useSWRHook(getCompatibility.garageID&&getCompatibility.productID?`v1/muatparts/buyer/check_compability?${metaSearchParams(getCompatibility)}`:null);
  const { data: userLocation, isLoading } = useSWRHook(
    "v1/muatparts/profile/location"
  )
  
  const {trigger:addToTroliBulk,error:errorAddToTroliBulk} = useSWRMutateHook(process.env.NEXT_PUBLIC_GLOBAL_API+'v1/muatparts/cart/bulk_item')
  const { data: DataPelanggaran } = useSWRHook("v1/muatparts/report_option");
  const { data: DataKompatibilitas } = useSWRHook(
    isLogin ? "v1/muatparts/garasi/lists" : null
  )
  const isClosedStore = product?.Data?.sellerInfo?.OperationalHours?.[today] === "Closed" || product?.Data?.sellerInfo?.storeStatus?.isClosed
  const isGrosir = product?.Data?.ProductType==="Grosir"
  const isVariant = product?.Data?.Variants?.Combinations?.length
  const isStoreOpen = ()=>{
    if(isClosedStore){
      for (let index = 0; index < Object.entries(weekDays)?.length; index++) {
        let saiki = Object.entries(weekDays)?.[date.getDay()+index]?.[0]
        let newDate = date
        newDate.setDate(date.getDate()+index)
        let result = formatDate(product?.Data?.sellerInfo?.storeStatus?.openingDate,null,false,{
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
        if(product?.Data?.sellerInfo?.OperationalHours?.[saiki]!=='Closed') {
          setDateStoreOpen(result)
          break
        }
        
      }
    }
  }
  
  const IsJamOperationalOpen = () => {
    if (product?.Data?.sellerInfo?.OperationalHours?.[today] === "Closed")
      return false;
    if (product?.Data?.sellerInfo?.OperationalHours?.[today]?.includes("Buka"))
      return true;
    return checkJamBuka(product?.Data?.sellerInfo?.OperationalHours?.[today]);
  };

  // Ulasan Produk
  const baseUrl = `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/`;

  const customFetcherGet = (url, option) => {
    return axios({
      headers:{
        "Authorization":`Bearer ${authZustand.getState().accessToken}`,
        "refreshToken":authZustand.getState().refreshToken
      },
      url,
      option
    }).catch(err => err)
  }

  // Shared state
  const [isFirstProductFetch, setIsFirstProductFetch] = useState(true)
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState({
    bestSeller: [],
    favorite: [],
    new: []
  });
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Filter
  // const []

  // Web-specific shared search state
  const defaultFilter = {
    rating: [],
    isWithImage: false,
    sort: "",
    page: 1
  }
  const [selectedEtalase, setSelectedEtalase] = useState(null);
  const [webSearch, setWebSearch] = useState("");
  const [webSearchQuery, setWebSearchQuery] = useState("");
  const [filter, setFilter] = useState(defaultFilter)
  const [validation,setValidation]=useState([])
  const title = product?.Data?.ProductInfo?.Title
  // FIX BUG Pengecekan Ronda Muatparts LB-0089
  const reviewsParams = useMemo(() => {
      const params = []
      params.push(`page=${filter.page}`)
      params.push(`size=10`)
      params.push(`search=${title}`)
      if (filter.sort === "newest") {
        params.push(`sort=createdAt`)
        params.push(`order=DESC`)
      }
      if (filter.sort === "oldest") {
        params.push(`sort=createdAt`)
        params.push(`order=ASC`)
      }
      if (filter.sort === "highest") {
        params.push(`sort=rating`)
        params.push(`order=DESC`)
      }
      if (filter.sort === "lowest") {
        params.push(`sort=rating`)
        params.push(`order=ASC`)
      }
      if (filter.rating.length > 0) {
        filter.rating.forEach((item, key) => params.push(`rating[${key}]=${item}`))
      }
      if (filter.withMedia) {
        params.push(`withMedia=true`)
      }
      return params.join("&")
  }, [JSON.stringify(filter), title])

  const { data: dataSellerProfile } = useSWRHook(
    `v1/stores/${product?.Data?.sellerInfo?.id}`
  );
  
  const { data: dataReviews } = useSWRHook(
    // FIX BUG Pengecekan Ronda Muatparts LB-0089
    `v1/stores/${product?.Data?.sellerInfo?.id}/reviews?${reviewsParams}`
  );
  const sellerProfile = dataSellerProfile?.Data ? dataSellerProfile?.Data : {}

  const setReviews = useSellerStore((state) => state.setReviews)
  const reviews = dataReviews?.Data ? dataReviews.Data.reviews : []

  // 25.⁠ ⁠11 - QC Plan - Web - Ronda Live Mei - LB - 0127
  useEffect(() => {
    setReviews(reviews)
  }, [reviews]);

  // Fetch store data
  const fetchStoreData = async () => {
    try {
      const data = await mockAPI.getStoreInfo(1);
      setStoreData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch store data');
      console.error('Error fetching store data:', err);
    }
  };

  const sharedProps = {

    // DATA DARI API
    sellerProfile,
    
    reviews,

    storeData,
    loading,
    error,
    // fetchProducts,
    defaultFilter,
    filter,
    setFilter
  };
  // Add web-specific search props
  const webProps = {
    search: webSearch,
    setSearch: setWebSearch,
    searchQuery: webSearchQuery,
    setSearchQuery: setWebSearchQuery,
  };
  useEffect(()=>{
    isStoreOpen()
  },[])
  useEffect(() => {
    if (userLocation?.Data?.length) setLocation(userLocation?.Data);
  }, [userLocation]);
  const { isMobile } = viewport();
  if (typeof isMobile !== "boolean") return <></>; //buat skeleton
  if(!product?.Data?.ID) {
    setAppBar({
      hideHeader:true,
      hideFooter:true,
    })
    return notFound()
  }
  // Improvement fix wording Pak Brian
  if(loading_product ) return isMobile?<DetailProdukResponsiveSkeleton/>:<DetailProdukSkeleton />
  if (isMobile)
    return (
    <DetailProductPageResponsive
      today={today}
      weekDays={weekDays}
      product={isLogin?product_backup?.Data:product?.Data}
      getExpanded={getExpanded}
      handleExpanded={handleExpanded}
      locations={locations}
      checkJamBuka={checkJamBuka}
      DataPelanggaran={DataPelanggaran?.Data}
      DataKompatibilitas={DataKompatibilitas?.Data}
      isLogin={isLogin}
      IsJamOperationalOpen={IsJamOperationalOpen}
      selectedLocation={selectedLocation}
      handleMultipleAlamatVariantProduct={handleMultipleAlamatVariantProduct}
      setMultipleAlamatProducts={setMultipleAlamatProducts}
      getMultipleAlamatProducts={getMultipleAlamatProducts}
      isClosedStore={isClosedStore}
      setTotalStock={setTotalStock}
      getTotalStock={getTotalStock}
      {...sharedProps} {...webProps}
      validation={validation}
      setValidation={setValidation}
      getDateStoreOpen={getDateStoreOpen}
      isGrosir={isGrosir}
      addToTroliBulk={addToTroliBulk}
      isVariant={isVariant}
      setCompatibility={setCompatibility}
      check_compatibility={check_compatibility}
      setSelectedLocations={setSelectedLocations}
      errorAddToTroliBulk={errorAddToTroliBulk}
    />
);
if (!isMobile)
  return (
  <DetailProductPageWeb
      today={today}
      weekDays={weekDays}
      setShowDescription={setShowDescription}
      showDescription={showDescription}
      product={isLogin?product_backup?.Data:product?.Data}
      getExpanded={getExpanded}
      handleExpanded={handleExpanded}
      locations={locations}
      checkJamBuka={checkJamBuka}
      DataPelanggaran={DataPelanggaran?.Data}
      DataKompatibilitas={DataKompatibilitas?.Data}
      isLogin={isLogin}
      IsJamOperationalOpen={IsJamOperationalOpen}
      selectedLocation={selectedLocation}
      handleMultipleAlamatVariantProduct={handleMultipleAlamatVariantProduct}
      setMultipleAlamatProducts={setMultipleAlamatProducts}
      getMultipleAlamatProducts={getMultipleAlamatProducts}
      setTotalStock={setTotalStock}
      isClosedStore={isClosedStore}
      getTotalStock={getTotalStock}
      {...sharedProps} {...webProps}
      validation={validation}
      setValidation={setValidation}
      getDateStoreOpen={getDateStoreOpen}
      isGrosir={isGrosir}
      addToTroliBulk={addToTroliBulk}
      isVariant={isVariant}
      setCompatibility={setCompatibility}
      check_compatibility={check_compatibility}
      setSelectedLocations={setSelectedLocations}
      errorAddToTroliBulk={errorAddToTroliBulk}
      />
  );
}
  
    
export default ProtectComponent(DetailProductPage);
    