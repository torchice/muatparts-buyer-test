
import { useHeader } from '@/common/ResponsiveContext'
import React, { useEffect, useState,startTransition } from 'react'
import style from './Categories.module.scss'
import Button from '@/components/Button/Button'
import Image from 'next/image'
import IconComponent from '@/components/IconComponent/IconComponent'
import { categoriesZustand } from '@/store/products/categoriesZustand'
import MultipleItems from '@/components/ReactSlick/MultipleItems'
import ProductComponent from '@/components/ProductComponent/ProductComponent'
import ScreenCategories from '../HomePage/ScreenCategories'
import { useCustomRouter } from '@/libs/CustomRoute'
import { filterProduct } from '@/store/products/filter'
import { metaSearchParams } from '@/libs/services'
import DataNotFound from '@/components/DataNotFound/DataNotFound'
import { viewport } from '@/store/viewport'
import { useLanguage } from '@/context/LanguageContext'
import ProductComponentSkeleton from '@/components/ProductComponent/ProductComponentSkeleton'
// Improvement fix wording Pak Brian
function CategoriesResponsive({params,searchParams,products,bannerImages,isLoading,
  loadingFetchBanner,}) {
  const {
    appBarType, //pilih salah satu : 'header_title_secondary' || 'header_search_secondary' || 'default_search_navbar_mobile' || 'header_search' || 'header_title'
    appBar, // muncul ini : {onBack:null,title:'',showBackButton:true,appBarType:'',appBar:null,header:null}
    renderAppBarMobile, // untuk render komponen header mobile dengan memasukkanya ke useEffect atau by trigger function / closer
    setAppBar, // tambahkan payload seperti ini setAppBar({onBack:()=>setScreen('namaScreen'),title:'Title header',appBarType:'type'})
    handleBack, // dipanggil t('LabelfilterProdukdi') dalam button t('LabelfilterProdukdi') luar header, guna untuk kembali ke screen sebelumnya 
    clearScreen,// reset appBar
    setScreen, // set screen
    screen, // get screen,
    search, // {placeholder:'muatparts',value:'',type:'text'}
    setSearch, // tambahkan payload seperti ini {placeholder:'Pencarian',value:'',type:'text'}

  }=useHeader()
  const { t } = useLanguage()
  const {categoryFamily,categories,getSubAndItem,category}=categoriesZustand()
  const {widthScreen}=viewport()
  const [seeAll,setSeeAll]=useState()
  const router = useCustomRouter()
  const filter_product = filterProduct()
  const categoryLabel = categoryFamily?.map(val=>val?.value)?.toString().replace(","," dan ")
  function handleRedirect(params) {
    startTransition(()=>{
      if(params?.length>1){
        filter_product?.setFilterProduct('subcategoryID',[params[0]?.id])
        filter_product?.setFilterProduct('itemID',[params[1]?.id])
        filter_product?.setFilterProduct('q','')
      }else{
        filter_product?.setFilterProduct('subcategoryID',[params[0]?.id])
        filter_product?.setFilterProduct('q','')
      }
    })
    const filter = filter_product
    setScreen('')
    router.push(`/products?${metaSearchParams(filter)}`)
  }
  useEffect(()=>{
    if(screen==='screenCategories'||!screen){
      setAppBar({
        title:categoryFamily?.[1]?.value,
        appBarType:'header_title',
        bottomTabNavigation:true
      })
    }
    if(screen==='subAndItem'){
      setAppBar({
        title:categoryFamily?.[1]?.value ?? "",
        appBarType:'header_title_modal_secondary',
        componentBackType:'close',
        onBack:()=>setScreen('screenCategories')
      })
    }
  },[screen,categoryFamily])

  useEffect(()=>{
    if(products.length){}
  },[products])
  if(screen==='subAndItem') return <ScreenCategories onClick={a=>handleRedirect(a)} withExpand data={{id:categoryFamily[1]?.id,children:getSubAndItem}} />
  // main screen
  return (
    <div className={style.main+' !pt-0 pb-6 overflow-hidden'}>
      {/* carousel */}
      {!loadingFetchBanner?(bannerImages?.length?<div className='w-full h-auto flex justify-center'>
          <div className={`w-full max-h-[250px] max-w-[${widthScreen}px] sm:max-w-[1000px] h-full`}>
              <MultipleItems 
                  withArrow={false}
                  images={bannerImages.map((val) => val.Image)}
                  urls={bannerImages.map((val) => val.Url)} 
                  settings={{
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      autoplay: true,
                      autoplaySpeed: 3000,
                      dots: true,
                  }}
                  size={widthScreen}
                  className="h-[144px]" 
              />
          </div>
        </div>:''):(
          <div className="h-[144px] bg-gray-300 animate-pulse"/>
        )
      }
      <div className='containerMobile !py-4 flex flex-col gap-[22px]'>
        {/* rekomendasi produk */}
        {products?.length?<div className='flex w-full justify-between items-center'>
          <span className='font-bold text-neutral-900 text-[18px]'>{t('LabelfilterProdukRekomendasiProdukyangBanyakDicari')}</span>
          <Button Class='!bg-neutral-50 border !border-neutral-600 !rounded-md !text-sm !font-semibold !text-neutral-900 h-8' iconRight={'/icons/chevron-right.svg'} onClick={()=>{
            setScreen('subAndItem')
          }}>{t('LabelfilterProdukKategori')}</Button>
        </div>:''}
        {/* list product */}
        {!isLoading?
          (products?.length?products?.map((val,i)=> 
          <div className='flex flex-col gap-6' key={i}>
            <div key={val?.ID} className='flex flex-col gap-3'>
              <div className='flex flex-col gap-3'>
                  <div className='flex gap-4 item-center w-full justify-between'>
                      <span className='font-bold text-neutral-900 text-sm'>{val?.subcategory}</span>
                      <span className='text-[#176CF7] font-bold text-xs cursor-pointer leading-5' onClick={()=>{
                        router.push(`/products?subcategoryID=${val?.subcategoryID},`)
                      }}>{t('LabelfilterProdukLihatSemua')}</span>
                  </div>
              </div>
              <div className='flex gap-2 overflow-x-auto scrollbar-none'>
                {
                  val?.products?.map(product=>{
                    return <ProductComponent key={product.id} {...product} />
                  })
                }
              </div>
            </div>
          </div>
          ):<DataNotFound title={`${t('LabelfilterProdukTidakadaprodukdiKategori')} ${categoryLabel}`} type='data' />
          ):Array(3).fill('').map((_, index)=>(
            <div className="flex flex-col gap-6" key={index} >
              <div className="flex flex-col gap-3">
                <div>
                  <div className="w-[60%] bg-gray-300 animate-pulse h-4 rounded-md "/>
                </div>
                <div className="flex gap-2 overflow-x-auto scrollbar-none">
                  {
                    Array(3).fill('').map((_, index)=>(
                      <ProductComponentSkeleton className="min-w-[168px]" key={`Skeleton ${index}`}/>
                    ))
                  }
                </div>
              </div>
            </div>
          ))}
        {/* {products?.length?products?.map((val,i)=> 
          <div className='flex flex-col gap-6' key={i}>
            <div key={val?.ID} className='flex flex-col gap-3'>
              <div className='flex flex-col gap-3'>
                  <div className='flex gap-4 item-center w-full justify-between'>
                      <span className='font-bold text-neutral-900 text-sm'>{val?.subcategory}</span>
                      <span className='text-[#176CF7] font-bold text-xs cursor-pointer leading-5' onClick={()=>{
                        router.push(`/products?subcategoryID=${val?.subcategoryID},`)
                      }}>{t('LabelfilterProdukLihatSemua')}</span>
                  </div>
              </div>
              <div className='flex gap-2 overflow-x-auto scrollbar-none'>
                {
                  val?.products?.map(product=>{
                    return <ProductComponent key={product.id} {...product} />
                  })
                }
              </div>
            </div>
          </div>
          ):<DataNotFound title={`${t('LabelfilterProdukTidakadaprodukdiKategori')} ${categoryLabel}`} type='data' />} */}
      </div>
      <div className={style.muatPlus}>
        <div className='flex flex-col gap-3 items-center'>
          <p className='text-neutral-50 text-base font-medium'>{t('LabelfilterProdukDapatkankeuntunganlebihdenganberlanggananmembershipdi')}</p>
          <div className='flex gap-2 item-center'>
            <IconComponent src='/icons/muatplu-shield.svg' width={40} height={40} />
            <p className='font-bold text-neutral-50 text-2xl'>muatparts +PLUS</p>
          </div>
          <Button color='primary_secondary' Class='h-7 !border-none'>{t('LabelfilterProdukPelajariSelengkapnya')}</Button>
        </div>
        <div className='grid grid-cols-2 gap-[9px]'>
          <div className='flex flex-col gap-[9px] rounded p-[14px] bg-neutral-50'>
            <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE+'/img/plus1.png'} width={36} height={36} />
            <span className='font-bold text-xs text-[#176CF7]'>{t('LabelfilterProdukJaminanProdukOriginal')}</span>
          </div>
          <div className='flex flex-col gap-[9px] rounded p-[14px] bg-neutral-50'>
            <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE+'/img/plus2.png'} width={36} height={36} />
            <span className='font-bold text-xs text-[#176CF7]'>{t('LabelfilterProdukDapatMengirimRFQ')}</span>
          </div>
          <div className='flex flex-col gap-[9px] rounded p-[14px] bg-neutral-50'>
            <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE+'/img/plus3.png'} width={36} height={36} />
            <span className='font-bold text-xs text-[#176CF7]'>{t('LabelfilterProdukGratisToolsPengaturanStockdiStockist')}</span>
          </div>
          <div className='flex flex-col gap-[9px] rounded p-[14px] bg-neutral-50'>
            <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE+'/img/plus4.png'} width={36} height={36} />
            <span className='font-bold text-xs text-[#176CF7]'>{t('LabelfilterProdukVoucherEksklusif')}</span>
          </div>
          
        </div>
        <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE+'/img/muatplus-garis.png'} width={1688} height={815} alt='plus' className='absolute -bottom-[30%] opacity-5 -right-0' />
      </div>


    </div>
  )
}

export default CategoriesResponsive
  