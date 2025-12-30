
'use client'
import { viewport } from '@/store/viewport'
import React, { useEffect, useState } from 'react'
import CategoriesResponsive from './CategoriesResponsive'
import CategoriesWeb from './CategoriesWeb'
import SWRHandler from '@/services/useSWRHook'
import { categoriesZustand } from '@/store/products/categoriesZustand'
import { useCustomRouter } from '@/libs/CustomRoute'

// Improvement fix wording Pak Brian
function CategoriesPage({params,searchParams,allCategories}) {
  const router=useCustomRouter()
  const [state,setState]=useState()
  const {useSWRHook,useSWRMutateHook}=SWRHandler()
  const categoriesParams = params?.routes
  const {data,error,isLoading} = useSWRHook(!allCategories?.length?`v1/muatparts/product/categories/${categoriesParams[0]}/${categoriesParams[1]}`:null)
  const {categories,generateCategoryFamily,getSubAndItem,setSubAndItem,categoryFamily} =categoriesZustand()
  const generateSubItem = categories?.find(val=>val?.id===categoriesParams[0])?.['children']?.find(a=>a.id===categoriesParams[1])
  const { data: bannerImages, isLoading:loadingFetchBanner } = useSWRHook("v1/muatparts/product/promo");
  
  useEffect(()=>{
    if(params?.routes.length) generateCategoryFamily(categoriesParams)
  },[params,categories])
  useEffect(()=>{
    setSubAndItem(generateSubItem?.children)
  },[categories])
  const {isMobile} = viewport()
  if(typeof isMobile!=='boolean') return <></> //buat skeleton
  if(isMobile) return <CategoriesResponsive isLoading={isLoading} loadingFetchBanner={loadingFetchBanner} bannerImages={bannerImages?.Data??[]} params={categoriesParams} searchParams={searchParams} products={data?.Data??[]} />
  return <CategoriesWeb isLoading={isLoading} loadingFetchBanner={loadingFetchBanner} bannerImages={bannerImages?.Data??[]} params={categoriesParams} searchParams={searchParams} products={data?.Data??[]} />
}

export default CategoriesPage
  