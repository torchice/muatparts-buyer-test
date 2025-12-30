
'use client'
import { viewport } from '@/store/viewport'
import React, { startTransition, useContext, useEffect, useState } from 'react'
import ProductsResponsive from './ProductsResponsive'
import ProductsWeb from './ProductsWeb'
import SWRHandler from '@/services/useSWRHook'
import { filterProduct } from '@/store/products/filter'
import ZustandHandler from '@/libs/handleZustand'
import { useHeader } from '@/common/ResponsiveContext'
import { brands, models, types,  years } from './screens/mockcdata'
import { useSearchParams } from 'next/navigation'
import { metaSearchParams } from '@/libs/services'
import { useCustomRouter } from '@/libs/CustomRoute'
import { useLanguage } from '@/context/LanguageContext'


// IMP FILTER HOMEPAGE & PRODUCT
function Products() {
  const { t } = useLanguage();
  const sorting_label = [
    {
      name:t("labelPalingRelevan"),
      value:'relevance',
      mode:'desc'
    },
    {
      name:t("labelTerbaruBuyer"),
      value:'newest',
      mode:'asc'
    },
    {
      name:t("labelPenjualanTerbanyak"),
      value:'sold',
      mode:'desc'
    },
    {
      name:t("labelHargaTerendah"),
      value:'pricel',
      mode:'asc'
    },
    {
      name:t("labelHargaTertinggi"),
      value:'priceu',
      mode:'desc'
    },
    {
      name:t("labelRatingTertinggi"),
      value:'rating',
      mode:'desc'
    },
  ]
  const sorting_label_toko = [
    {
      name:t("labelPalingRelevan"),
      value:'relevance',
      mode:'desc'
    },
    {
      name:t("labelTerdekatBuyer"),
      value:'distance',
      mode:'asc'
    },
    {
      name:t("labelRatingTertinggi"),
      value:'rating',
      mode:'desc'
    },
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0431
    {
      name:t("labelRatingTerbanyak"),
      value:'review',
      mode:'desc'
    },
    {
      name:t("labelPenjualanTerbanyak"),
      value:'sold',
      mode:'asc'
    },
    {
      name:t("labelPalingLamaTerdaftar"),
      value:'date',
      mode:'asc'
    },
  ]
  const router = useCustomRouter()
  const searchParams=useSearchParams()
  const {useSWRHook,useSWRMutateHook}=SWRHandler()
  // LB - 0031 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer
  const {trigger:mutateFilter,data:products,error,isMutating}=useSWRMutateHook(process.env.NEXT_PUBLIC_GLOBAL_API+`v1/muatparts/product/search`)
  const {trigger:trigger_let_us_know,data:letUsKnow}=useSWRMutateHook(process.env.NEXT_PUBLIC_GLOBAL_API+`v1/muatparts/garasi/let_us_know`)
  const { data: resRecommendations } =
    useSWRHook("v1/muatparts/cart/recommendations");
  const {data:garasi_list} = useSWRHook('v1/muatparts/garasi/lists')

  const getFilterProduct = filterProduct()

 /* IMPROVEMENT FILTER ON PRODUCTS & HOMEPAGE */
  /* ---FETCHING OPTIONS LIST--- */
  /* Brand */
  const [paramsBrand, setParamsBrand] = useState({
    page:1,
    limit:10,
    keyword:''
  })
  const { data: brandOptions, isLoading:loadingFetchBrand } = useSWRHook(`v1/muatparts/garasi/brand`)
  const handleBrandLoadMore = ()=>{
    setParamsBrand((prev)=>({...prev, page:prev.page+1}))
  }
  const [brandsOptions, setBrandsOptions] = useState([])
  const handlePushBrand =()=>{
    const temp = [...brandsOptions]
    temp.push(...brandOptions.Data)
    setBrandsOptions(temp)
  }
  useEffect(()=>{
    if(brandOptions){
      handlePushBrand()
    }
  },[brandOptions])


  /* Years */
  const [paramsYear, setParamsYear] = useState({
    page:1,
    limit:10,
    keyword:''
  })
  const { data: yearOptions, isLoading:loadingFetchYear } = useSWRHook(getFilterProduct?.brandID?`v1/muatparts/garasi/years?brandID=${getFilterProduct?.brandID}`:null)
  const handleYearLoadMore = ()=>{
    setParamsYear((prev)=>({...prev, page:prev.page+1}))
  }
  const [yearsOptions, setYearsOptions] = useState([])
  const handlePushYears =()=>{
    const temp = [...yearsOptions]
    temp.push(...yearOptions.Data)
    setYearsOptions(temp)
  }
  useEffect(()=>{
    if(yearOptions){
      handlePushYears()
    }
  },[yearOptions])

  /* Model */
  const [paramsModel, setParamsModel] = useState({
    page:1,
    limit:10,
    keyword:''
  })
  const { data: modelOptions, isLoading:loadingFetchModel } = useSWRHook(getFilterProduct?.year?`v1/muatparts/garasi/model?year=${getFilterProduct?.year}&brandID=${getFilterProduct?.brandID}`:null)
  const handleModelLoadMore = ()=>{
    setParamsModel((prev)=>({...prev, page:prev.page+1}))
  }
  const [modelsOptions, setModelsOptions] = useState([])
  const handlePushModels =()=>{
    const temp = [...modelsOptions]
    temp.push(...modelOptions.Data)
    setModelsOptions(temp)
  }
  useEffect(()=>{
    if(modelOptions){
      handlePushModels()
    }
  },[modelOptions])

  /* Type */
  const [paramsType, setParamsType] = useState({
    page:1,
    limit:10,
    keyword:''
  })
  const { data: typeOptions, isLoading:loadingFetchType } = useSWRHook(getFilterProduct?.modelID?`v1/muatparts/garasi/type?modelID=${getFilterProduct?.modelID}`:null)
  const handleTypeLoadMore = ()=>{
    setParamsType((prev)=>({...prev, page:prev.page+1}))
  }
  const [typesOptions, setTypesOptions] = useState([])
  const handlePushTypes =()=>{
    const temp = [...typesOptions]
    temp.push(...typeOptions.Data)
    setTypesOptions(temp)
  }
  useEffect(()=>{
    if(typeOptions){
      handlePushTypes()
    }
  },[typeOptions])
  /* IMPROVEMENT FILTER ON PRODUCTS & HOMEPAGE END */

  const { data: bannerImages } = useSWRHook("v1/muatparts/product/promo");
  
  const {isMobile} = viewport()

  const [getListFilter, setListFilter] = useState({
    brands:[],
    categories:[],
    cities:[]
  })
  const [getMatchFilter,setMatchFilter]=useState([])
  const [getRecomendation,setRecomendation]=useState([])
  const [isLoading,setIsLoading]=useState(false)

  const {search,setSearch} = useHeader()
  
  // function deleteFilterMatch(params) {
  //   const vehicleFields = ['brandID', 'year', 'modelID', 'typeID'];
  //   const isVehicleField = vehicleFields.includes(params.field);
  
  //   const getFilteredMatch = () => {
  //     return [
  //       ...new Map(
  //         getMatchFilter.map(item => [`${item.id}-${item.value}`, item])
  //       ).values(),
  //     ].filter(item => item?.id !== undefined);
  //   };
  
  //   const clearVehicleFields = (startField) => {
  //     const baseIndex = vehicleFields.indexOf(startField);
  //     const fieldsToClear = vehicleFields.slice(baseIndex);
  
  //     fieldsToClear.forEach(field =>
  //       getFilterProduct?.setFilterProduct(field, '')
  //     );
  //   };
  
  //   // Step 1: Filter Match
  //   if (isVehicleField) {
  //     console.log('masuk di sini kaka');
  //     const filtered = getFilteredMatch().filter(
  //       item => !vehicleFields.slice(vehicleFields.indexOf(params.field)).includes(item?.field)
  //     );
  //     setMatchFilter(filtered);
  //   } else {
  //     setMatchFilter(
  //       getMatchFilter?.filter(item => item?.id !== params?.id)
  //     );
  //   }
  
  //   // Step 2: Reset FilterProduct field
  //   const filterValue = getFilterProduct?.[params?.field];
  
  //   if (typeof filterValue === 'string') {
  //     if (isVehicleField) {
  //       console.log('masuk di sini juga kaka');
  //       clearVehicleFields(params.field);
  //     }
  //     getFilterProduct?.setFilterProduct(params.field, '');
  //   }
  
  //   if (typeof filterValue === 'number') {
  //     if (isVehicleField) {
  //       console.log('masuk di sini juga kaka');
  //       clearVehicleFields(params.field);
  //     }
  //     getFilterProduct?.setFilterProduct(params.field, 0);
  //   }
  
  //   // Step 3: Handle Array Field
  //   if (Array.isArray(filterValue)) {
  //     const updatedArray = filterValue.filter(
  //       val => val.toString() !== params?.id.toString()
  //     );
  //     getFilterProduct?.setFilterProduct(params.field, updatedArray);
  //   }
  
  //   // Step 4: Handle Radius
  //   if (params?.field === 'radius') {
  //     getFilterProduct?.setFilterProduct('latitude', 0);
  //     getFilterProduct?.setFilterProduct('longitude', 0);
  //   }
  // }
  
  function deleteFilterMatch(params) {
    let vechicle_cas = ['brandID', 'year', 'modelID', 'typeID']
    if(vechicle_cas.includes(params.field)){
      console.log('masuk di sini kaka')
      let tmp = [...new Map(getMatchFilter.map(item => [`${item.id}-${item.value}`, item])).values()].filter(a=>a?.id!==undefined)
      console.log('tmp', tmp)
      let new_vehicle_cas = vechicle_cas
      let baseIndex = new_vehicle_cas.indexOf(params.field)
      let slicing_data = new_vehicle_cas.slice(baseIndex,new_vehicle_cas.length)
      // console.log(
      //   tmp.map(a=>{
      //     if(slicing_data.includes(a?.field)) return null
      //     return a
      //    })?.filter(a=>a!=null)
      // )
      setMatchFilter(tmp.map(a=>{
        if(slicing_data.includes(a?.field)) return null
        return a
       })?.filter(a=>a!=null))
    } else {
      setMatchFilter(getMatchFilter?.filter(a=>a?.id!==params?.id || a?.id!=params?.id))
    }
    if(typeof getFilterProduct?.[params?.field]==='string') {
      if(vechicle_cas.includes(params.field)){
        console.log('masuk di sini juga kaka')
        let tmp = [...new Map(getMatchFilter.map(item => [`${item.id}-${item.value}`, item])).values()].filter(a=>a?.id!==undefined)
        console.log('tmp', tmp)
        let new_vehicle_cas = vechicle_cas
        let baseIndex = new_vehicle_cas.indexOf(params.field)
        let slicing_data = new_vehicle_cas.slice(baseIndex,new_vehicle_cas.length)
        console.log('slicing_data',slicing_data)
        slicing_data.map(s=>getFilterProduct.setFilterProduct(s,''))
      }
      getFilterProduct?.setFilterProduct(params?.field,'')
    }
    if(typeof getFilterProduct?.[params?.field]==='number'){
      if(vechicle_cas.includes(params.field)){
        console.log('masuk di sini juga kaka')
        let tmp = [...new Map(getMatchFilter.map(item => [`${item.id}-${item.value}`, item])).values()].filter(a=>a?.id!==undefined)
        console.log('tmp', tmp)
        let new_vehicle_cas = vechicle_cas
        let baseIndex = new_vehicle_cas.indexOf(params.field)
        let slicing_data = new_vehicle_cas.slice(baseIndex,new_vehicle_cas.length)
        console.log('slicing_data',slicing_data)
        slicing_data.map(s=>getFilterProduct.setFilterProduct(s,''))
      }
      getFilterProduct?.setFilterProduct(params?.field,0)
    }
      if(Array.isArray(getFilterProduct?.[params?.field])) {
        let tmp = getFilterProduct?.[params?.field].filter(a=>a.toString()!==params?.id.toString())
        console.log('tmp array',tmp)
        let field = params?.field
        getFilterProduct?.setFilterProduct(field,tmp)
    }
    if(params?.field==='radius'){
      getFilterProduct?.setFilterProduct('latitude',0)
      getFilterProduct?.setFilterProduct('longitude',0)
    }
  }
  // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer
  // LB - 0074
  // LB - 0078
  // LB - 0083
  // LB - 0087
  // LB - 0093
  // LB - 0094
  // LB - 0098
  // LB - 0099
  // LB - 0120
  // LB - 0124
  // LB - 0125
  // LB - 0126
  // LB - 0128
  // LB - 0130
  // LB - 0131
  // LB - 0138
  // LB - 0140
  // LB - 0163
  // LB - 0165
  // LB - 0202
  // LB - 0203
  function baseFilterMatchProduct(params){
    let subCategories = products?.data?.Filter?.categories
    let itemCategories = products?.data?.Filter?.categories?.map(val=>val.children)?.flat()
    let tmpParams = Object.entries(params)?.filter(([key])=> key!=='q'&&key!=='limit'&&key!=='page'&&key!=='order'&&key!=='mode')
    let resultMatch = []
    startTransition(()=>{
      for (let i = 0; i < tmpParams.length; i++) {
        const key = tmpParams[i][0];
        const value = tmpParams[i][1];
        
        if(key==='subcategoryID'){
          let selected = subCategories?.find(a=>a?.id===value[0])
          let result = {field:key,...selected}
          resultMatch.push([...getMatchFilter,result])
        }
        if(key==='itemID'){
          let selected = itemCategories?.find(a=>a?.id===value[0])
          let result = {field:key,...selected}
          resultMatch.push([...getMatchFilter,result])
        }
        if(key==='cityID'){
          let selected = products?.data?.Filter?.cities?.filter(a=>{
            // LBM
            if(value?.toString()?.includes(Number(a?.id))) return a
          })||[]
          let result = [...getMatchFilter,...selected?.map(({id,value})=>({field:key,id:Number(id),value}))]
          resultMatch.push(result)
        }
        if(key==='brandProductID'){
          let selected = products?.data?.Filter?.brands?.filter(a=>{
            if(value.includes(a?.id)) return a
          })||[]
          let result = [...getMatchFilter,...selected?.map(({id,value})=>({field:key,id,value}))]
          resultMatch.push(result)
        }
        if(key==='conditionID'){
          let selected = products?.data?.Filter?.condition?.find(a=>{
            if(value.includes(a?.id)) return a
          })
          let result = {field:key,...selected}
          resultMatch.push([...getMatchFilter,result])
        }
        if(key==='brandID'){
          let selected = brandOptions?.Data?.find(a=>a?.id===value)
          let result = {field:key,...selected}
          let newFilter = getMatchFilter.filter(a=>a?.field!==key)
          resultMatch.push([...newFilter,result])
        }
        if(key==='year'){
          let selected = yearOptions?.Data?.find(a=>a?.id===value)
          let result = {field:key,...selected}
          resultMatch.push([...getMatchFilter,result])
        }
        if(key==='modelID'){
          let selected = modelOptions?.Data?.find(a=>a?.id===value)
          let result = {field:key,...selected}
          resultMatch.push([...getMatchFilter,result])
        }
        if(key==='typeID'){
          let selected = typeOptions?.Data?.find(a=>a?.id===value)
          let result = {field:key,...selected}
          resultMatch.push([...getMatchFilter,result])
        }
        if(key==='garageID'){
          let selected = garasi_list?.Data?.find(a=>a?.id===value)
          let result = {field:key,...selected}
          resultMatch.push([...getMatchFilter,result])
        }
        if(key==='shippingType'){
          let selected = products?.data?.Filter?.shippingOption?.filter(a=>{
            if(value.includes(a?.id)) return a
          })||[]
          let result = [...getMatchFilter,...selected?.map(({id,value})=>({field:key,id:id,value}))]
          resultMatch.push(result)
        }
        if(key==='rating'){
          let result = [...getMatchFilter,...value?.map((val)=>({field:key,id:val,value:val+' Bintang'}))]
          resultMatch.push(result)
        }
        if(key==='salesType'){
          let result = [...getMatchFilter,...value?.map((val)=>({field:key,id:val,value:val}))]
          resultMatch.push(result)
        }
        
        if(key==='promo'){
          let selected = products?.data?.Filter?.bonus?.find(a=>{
            if(value.includes(a?.id)) return a
          })
          let result = {field:key,...selected}
          resultMatch.push([...getMatchFilter,result])
        }
        if(key==='radius'){
          let tmp = getMatchFilter
          let selected = {id:value,value:`Radius ${value} km`}
          let result = tmp.filter(a=>a.id==value).length>1?{}:{field:key,...selected}
          let newArr = tmp?.filter(a=>a?.field!=='radius')
          resultMatch.push([...newArr,result])
        }
      }
    })
    // console.log(resultMatch?.flat())
    setMatchFilter(resultMatch?.flat())
  }
  useEffect(()=>{
    if(window?.location?.search){
      let tmpFilter = metaSearchParams(window?.location?.search?.replace('?',''))
      setIsLoading(true)
      Object.entries(tmpFilter).map(val=>{
        getFilterProduct.setFilterProduct(val[0],val[1])
      })
      mutateFilter(metaSearchParams(window?.location?.search?.replace('?',''))).then((a)=>{
        setIsLoading(false)
        if(a?.data?.Filter) setListFilter(a?.data?.Filter)
        })
    }
  },[searchParams])
  
  
  useEffect(()=>{
    const filter_product = getFilterProduct
    router.replace(`/products?${metaSearchParams(filter_product)}`)
  },[getFilterProduct])
  useEffect(()=>{
    if(window.location.search){
      let tmpFilter = metaSearchParams(window?.location?.search?.replace('?',''))
      baseFilterMatchProduct(tmpFilter)
    }
  },[
    products?.data?.Filter?.categories,
    products?.data?.Filter?.categories,
    products?.data?.Filter?.categories,
    products?.data?.Filter?.categories,
    products?.data?.Filter?.cities,
    products?.data?.Filter?.brands,
    products?.data?.Filter?.condition,
    // brandOptions?.Data,
    // yearOptions?.Data,
    // modelOptions?.Data,
    // yearOptions?.Data,
    garasi_list?.Data,
    products?.data?.Filter?.shippingOption,
    products?.data?.Filter?.bonus
  ])

  if(typeof isMobile!=='boolean') return <></> //buat skeleton
  if(isMobile) return <ProductsResponsive 
  getFilterProduct={getFilterProduct}
  search={search} 
  setSearch={setSearch} 
  products={error?.status==404?[]:products?.data?.Data}  
  pagination={error?.status==404?[]:products?.data?.Pagination}
  responseFilter={error?.status==404?[]:products?.data?.Filter}
  totalCount={products?.data?.Pagination}
/* IMPROVEMENT FILTER ON PRODUCTS & HOMEPAGE */
  kompabilitas={{brand:brandOptions?.Data??[],type:typeOptions?.Data??[],year:yearOptions?.Data??[],model:modelOptions?.Data??[]}}
  handleLoadMore={{brand:()=>handleBrandLoadMore(),type:()=>handleTypeLoadMore(),year:()=>handleYearLoadMore(),model:()=>handleModelLoadMore()}}
  isLoadingFetchFilter={{brand:loadingFetchBrand, type:loadingFetchType, year:loadingFetchYear, model:loadingFetchModel}}
  isHasMore={{brand:brandsOptions.length < brandOptions?.Pagination?.total,type:typesOptions.length < typeOptions?.Pagination?.total, year:yearsOptions.length < yearOptions?.Pagination?.total, model:modelsOptions.length < modelOptions?.Pagination?.total}} 
  garasiList={garasi_list?.Data??[]}
  trigger_let_us_know={trigger_let_us_know}
  letUsKnowMessage={letUsKnow}
  bannerImages={bannerImages?.Data}
  isLoading={isMutating}
  getListFilter={getListFilter}
  sorting_label={sorting_label}
  sorting_label_toko={sorting_label_toko}
  setMatchFilter={setMatchFilter}
  recomendedGoods={resRecommendations?.Data}
  recomendedStores={resRecommendations?.Stores} />

  return <ProductsWeb 
  getFilterProduct={getFilterProduct} 
  setFilter={getFilterProduct?.setFilterProduct} 
  products={error?.status==404?[]:products?.data?.Data} 
  pagination={error?.status==404?[]:products?.data?.Pagination}
  garasiList={garasi_list?.Data??[]}
/* IMPROVEMENT FILTER ON PRODUCTS & HOMEPAGE */
  brandOptions={brandOptions?.Data??[]}
  yearOptions={yearOptions?.Data??[]}
  modelOptions={modelOptions?.Data??[]}
  typeOptions={typeOptions?.Data??[]}
  trigger_let_us_know={trigger_let_us_know}
  letUsKnowMessage={letUsKnow}
  bannerImages={bannerImages?.Data}
  isLoading={isMutating}
  getListFilter={getListFilter}
  sorting_label={sorting_label}
  sorting_label_toko={sorting_label_toko}
  getMatchFilter={[...new Map(getMatchFilter.map(item => [`${item.id}-${item.value}`, item])).values()].filter(a=>a?.id!==undefined)}
  setMatchFilter={setMatchFilter}
  deleteFilterMatch={deleteFilterMatch}
  recomendedGoods={resRecommendations?.Data}
  recomendedStores={resRecommendations?.Stores}
  handleBrandLoadMore={handleBrandLoadMore}
  handleModelLoadMore={handleModelLoadMore}
  handleTypeLoadMore={handleTypeLoadMore}
  handleYearLoadMore={handleYearLoadMore}
  isBrandHasMore={brandsOptions.length < brandOptions?.Pagination?.total} 
  isModelHasMore={modelsOptions.length < modelOptions?.Pagination?.total} 
  isYearHasMore={yearsOptions.length < yearOptions?.Pagination?.total} 
  isTypeHasMore={typesOptions.length < typeOptions?.Pagination?.total} />
}

export default Products
  