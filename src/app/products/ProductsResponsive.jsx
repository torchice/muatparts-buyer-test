
import { useHeader } from '@/common/ResponsiveContext'
import React, { useEffect, useMemo, useState } from 'react'
import style from './Products.module.scss'
import Button from '@/components/Button/Button'
import IconComponent from '@/components/IconComponent/IconComponent'
import FilterScreenProduct from './screens/FilterScreenProduct'
import CategoryScreenProduct from './screens/CategoryScreenProduct'
import BrandScreenProduct from './screens/BrandScreenProduct'
import DataNotFound from '@/components/DataNotFound/DataNotFound'
import Input from '@/components/Input/Input'
import ProductComponent from '@/components/ProductComponent/ProductComponent'
import StoreCardComponent from '@/components/StoreCardComponent/StoreCardComponent'
import { categoriesDummy } from './screens/mockcdata'
import GarageScreenProduct from './screens/GarageScreenProduct'
import LocationScreenProduct from './screens/LocationScreenProduct'
import VehicleTypeScreenProduct from './screens/VehicleTypeScreenProduct'
import { defaultFilterProduct, filterProduct } from '@/store/products/filter'
import ModalComponent from '@/components/Modals/ModalComponent'
import RadioButton from '@/components/Radio/RadioButton'
import { metaSearchParams } from '@/libs/services'
import { useCustomRouter } from '@/libs/CustomRoute'
import { useLanguage } from '@/context/LanguageContext'
import { ThousandSeparator } from '@/libs/NumberFormat'
import { userLocationZustan } from '@/store/manageLocation/managementLocationZustand'
import ProductComponentSkeleton from '@/components/ProductComponent/ProductComponentSkeleton'
import StoreCardComponentSkeleton from '@/components/StoreCardComponent/StoreCardComponentSkeleton'

// Improvement fix wording Pak Brian
function ProductsResponsive(
  {
    products,
    getFilterProduct,
    search,
    setSearch,
    kompabilitas,
    handleLoadMore,
    isHasMore,
    isLoadingFetchFilter,
    garasiList,
    responseFilter,
    isLoading,
    trigger_let_us_know,
    letUsKnowMessage,
    getListFilter,
    sorting_label,
    sorting_label_toko,
    setMatchFilter,
    recomendedGoods,
    recomendedStores
  }) {
  const { t } = useLanguage()
  const {
    appbar,
    setAppBar, 
    clearScreen,
    setScreen,
    screen,
  }=useHeader()
  const menus=[
    {
        id:'produk',
        name:t('LabelfilterProdukProduk')
    },
    {
        id:'toko',
        name:t('LabelfilterProdukToko')
    },
  ]
  const router = useCustomRouter()
  const filter_product=filterProduct()
  const [getMenu,setMenu]=useState()
  const [getModal,setModal]=useState('')
  const [getSort,setSort]=useState()
  const [getState,setState]=useState({
    email:'',
    description:''
  })
  const [getFilter,setFilter]=useState({
    groupcategoryID: [],
    categoryID: [],
    subcategoryID: [],
    itemID: [],
    startPrice: 0,
    endPrice: 0,
    cityID: [],
    brandProductID: [],
    salesType: [],
    conditionID: [],
    vehicleID: "",
    brandID: "",
    year: "",
    modelID: "",
    typeID:"",
    garageID: "",
    radius: 0,
    latitude: "",
    longitude: "",
    shippingType: [],
    lastOnline: [],
    promo: [],
    rating: [],
    alias:false,
    type:"",
    limit:10,
    page:1,
    distance:[],
    order:'',
    mode:''
  })
  function handleInput(field,value) {
    const field_exception = ['brandID', 'year', 'modelID','typeID']
    setFilter(a=>({...a,[field]:value}))
    console.log(field)
    if(field_exception.includes(field)){
      let baseIndex = field_exception.indexOf(field)
      let sliced = field_exception.slice(baseIndex+1, field_exception.length)
      sliced.map(s=>{getFilterProduct.setFilterProduct(s,'');setFilter(a=>({...a,[s]:''}))})
      getFilterProduct.setFilterProduct(field, value)
    }
  }
  const {selectedLocation}=userLocationZustan()
  // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0193
  const filtered = ()=>{
    let tmp = getFilter
    delete tmp?.limit
    delete tmp?.page
    // LBM - Filter Reset bug - 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0843
    // delete tmp?.['0']
    delete tmp?.q
    delete tmp?.alias
    delete tmp?.type
    delete tmp?.mode
    delete tmp?.order
    return tmp
  }
  const isFiltered = !!(metaSearchParams(filtered()))
  const getSortingLabel = getFilterProduct?.type==='store'?sorting_label_toko:sorting_label
  useEffect(()=>{
      if(search?.value) getFilterProduct.setFilterProduct('q',search?.value)
    },[search])
  useEffect(()=>{
    if(!screen){
      setAppBar({
        appBarType:'main_compact',
        bottomTabNavigation:true
      })
      setSearch({
        placeholder:`${t('LabelfilterProdukCari')} ${t('LabelfilterProdukProduk')}`,
        // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0189
        value:getFilterProduct?.q,
        tmp:getFilterProduct?.q,
        onSubmitForm:true
      })
    }
    if(screen){
      setAppBar({
        bottomTabNavigation:false
      })
    }
    if(screen==='location' | screen==='garasi') {
      setAppBar({
        appBarType:'header_search_secondary',
        onBack:()=> setScreen('filter'),
        shadow:true
      })
      setSearch({value:'',placeholder:`${t('LabelfilterProdukCari')} `+screen[0]?.toUpperCase()+screen.substring(1)})
    }
    if(screen==='filter'){
      setAppBar({
        appBarType:'header_title_modal_secondary',
        componentBackType:'close',
        title:'Filter',
        renderActionButton:<span className='semi-sm text-primary-700' onClick={()=>{
          getFilterProduct?.resetFilter()
          setFilter(defaultFilterProduct)
          setMatchFilter([])
          setScreen('')
        }}>Reset</span>,
        onBack:()=>clearScreen()
      })
    }
    if(screen==='category'){
      setAppBar({
        appBarType:'header_title_modal_secondary',
        componentBackType:'close',
        title:t('LabelfilterProdukKategori'),
        renderActionButton:'',
        withSearchBottom:'category',
        onBack:()=>{
          setScreen('filter')
          setAppBar({withSearchBottom:false})
        }
      })
      setSearch({value:'',placeholder:`${t('LabelfilterProdukCari')} ${t('LabelfilterProdukKategori')}`})
    }
    if(screen==='brand') {
      setAppBar({
        appBarType:'header_search_secondary',
        onBack:()=> setScreen('filter'),
        shadow:true
      })
      setSearch({value:'',placeholder:`${t('LabelfilterProdukCari')} Brand`})
    }
    if(screen==='kendaraan') {
      setAppBar({
        appBarType:'header_search_secondary',
        onBack:()=> setScreen('filter'),
        shadow:true
      })
      setSearch({onSubmitForm:false})
    }
  },[screen])
  useEffect(()=>{
    const tmpfilter = Object.fromEntries(Object.entries(getFilterProduct).filter(([_, value]) => typeof value !== "function"))
    setFilter(tmpfilter)
    if(filter_product?.type==='store') setMenu({id:'toko',name:t('LabelfilterProdukToko')}) 
    else setMenu(menus[0])
  },[filter_product])
  if(screen==='filter') return <FilterScreenProduct 
  onClickLeft={()=>{
    setFilter(getFilterProduct)
    setScreen('')
  }} 
  onClickRight={()=>{
    getFilterProduct?.setAllFilter(getFilter)
    setScreen('')
  }} 
  bonus={responseFilter?.bonus} shippingOptions={responseFilter?.shippingOption} condition={responseFilter?.condition} categories={responseFilter?.categories} brandproducts={responseFilter?.brands} cities={responseFilter?.cities} getFilterProduct={getFilterProduct} year={kompabilitas?.['year']??[]} type={kompabilitas?.['type']??[]} model={kompabilitas?.['model']??[]} brand={kompabilitas?.['brand']??[]} getFilterProductState={getFilter} setFilterProductState={setFilter} garasiList={garasiList?.map(a=>({value:a?.id,name:`${a?.brand} ${a?.year}, ${a?.model}, ${a?.type}`}))} isToko={getMenu?.id==='toko'} textLeft={getMenu?.id==='toko'?'Reset':''} textRight={getMenu?.id==='toko'?t('LabelfilterProdukTerapkan'):''} />
  // if(screen==='filter') return <span>asd</span>
  if(screen==='garasi') return <GarageScreenProduct data={garasiList?.map(a=>({value:a?.id,name:`${a?.brand} ${a?.year}, ${a?.model}, ${a?.type}`}))} getFilterProduct={getFilterProduct} handleInput={handleInput} search={search} setSearch={setSearch} />
  if(screen==='location') return <LocationScreenProduct getFilterProduct={getFilterProduct} data={responseFilter?.cities} handleInput={handleInput} />
  if(screen==='category') return <CategoryScreenProduct setFilter={setFilter} categories={responseFilter?.categories} getFilterProduct={getFilterProduct} handleInput={handleInput} />
  if(screen==='brand') return <BrandScreenProduct data={responseFilter?.brands} getFilterProduct={getFilterProduct}  handleInput={handleInput} />
/* IMPROVEMENT FILTER ON PRODUCTS & HOMEPAGE */
  if(screen==='kendaraan') return <VehicleTypeScreenProduct data={kompabilitas} getFilter={getFilter} getFilterProduct={getFilterProduct} handleInput={handleInput} search={search} setSearch={setSearch} handleLoadMore={handleLoadMore} hasMore={isHasMore} isLoadingFetchFilter={isLoadingFetchFilter} />
  // main screen
  return (
    <div className={style.main+' relative'}>
      <ModalComponent onClickReset={()=>{
        getFilterProduct?.setFilterProduct('order','')
        getFilterProduct?.setFilterProduct('mode',"")
        setModal('')
      }} type='BottomSheet' title={t('LabelfilterProdukUrutkan')} isOpen={getModal==='sort'} setClose={()=>setModal('')}>
        <div className='relative flex flex-col gap-3 pt-6 py-12 px-4'>
          {
            getSortingLabel?.map(val=><RadioButton checked={getSort?.name===val.name} key={val.value} label={val.name} value={val} onClick={a=>{
              if(a?.value?.value==='distance'){
                getFilterProduct?.setFilterProduct('latitude',selectedLocation?.Latitude?selectedLocation?.Latitude:-7.2575)
                getFilterProduct?.setFilterProduct('longitude',selectedLocation?.Longitude?selectedLocation?.Longitude:112.7521)
              }
              setSort(val)
              getFilterProduct?.setFilterProduct('order',val?.value==='pricel'||val?.value==='priceu'?'price':val?.value)
              getFilterProduct?.setFilterProduct('mode',val?.mode)
              setModal('')
            }} />)
          }
        </div>
      </ModalComponent>
      <div className={`bg-neutral-50  flex items-center ${style.tabMenu} shadow-md`}>
          {
              menus.map(val=><div key={val.id} onClick={()=>{
                setMenu(val)
                getFilterProduct?.setFilterProduct('order','')
                getFilterProduct?.setFilterProduct('mode',"")
                getFilterProduct.setFilterProduct('type',val?.id==='toko'?'store':'')
              }} className={`${val.id===getMenu?.id?'text-[#c22716]':'text-neutral-700'} font-bold text-sm pt-4 pb-[11px] border-b-2 ${val.id===getMenu?.id?'border-[#c22716] border-b-2':'border-neutral-200'} w-[50%] whitespace-nowrap text-center`}>{val.name}</div>)
          }
      </div>
      {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0199 */}
      <div className='containerMobile flex gap-2 p-4 bg-[#ffffff] sticky top-[65px] z-50'>
          <button  onClick={()=>{
            setScreen('filter')
          }} className={`${style.filterButton} ${!products?.length?'!text-neutral-600':''} ${isFiltered?'!border !border-primary-700 !text-primary-700 !bg-primary-50':''}`} >
            <span>Filter</span>
            {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0190 */}
            {
              isFiltered?<IconComponent classname={`${products?.length?style.iconFilterActive:style.iconFilterDisable} `} src={'/icons/filter-active.svg'} />
              :<IconComponent classname={`${products?.length?style.iconFilter:style.iconFilterDisable} `} src={'/icons/filter-active.svg'} />
            }
          </button>
          {/*  // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0193 */}
          <button onClick={()=>{
            if(!products?.length) return
            setModal('sort')
          }} className={`${style.filterButton} ${!products?.length?'!text-neutral-600':''} ${getFilterProduct?.mode||getFilterProduct?.order?'!border !border-primary-700 !text-primary-700 !bg-primary-50':''}`} >
            <span>{t('LabelfilterProdukUrutkan')}</span>
            {
              (getFilterProduct?.mode||getFilterProduct?.order)? <IconComponent classname={`${products?.length?style.iconFilterActive:style.iconFilterActive}`} src='/icons/sort-active.svg' />
              :<IconComponent classname={`${products?.length?style.iconFilterDisable:style.iconFilterDisable}`} src='/icons/sort-active.svg' />
            }
            {/* <IconComponent classname={`${products?.length?style.iconFilterDisable:style.iconFilterDisable}`} src='/icons/sort-active.svg' /> */}
          </button>
      </div>
      <div className='mt-4 flex flex-col gap-2 pb-24 w-full'>
        {/* list products */}
        {/* {
          !isLoading&&getMenu?.id==='produk'?
          <div className='grid grid-cols-2 gap-2 px-4'>
              {
                25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0600
                products?.map(val=><ProductComponent parentClassname={"!w-auto"} classname={"!w-auto"} key={val.id} {...val} />)
              }
            </div>
          :!products?.length?<>
          <DataNotFound textClass={'!font-semibold !text-sm !text-neutral-600 !w-[111px]'} title='Keyword 
  Tidak Ditemukan' />
          <div className='flex flex-col gap-6 px-4 bg-neutral-50 py-5'>
            <div className={`flex gap-6 flex-col`}>
              <div className='flex flex-col gap-4'>
                <p className='font-semibold text-sm text-neutral-900'>{t('LabelfilterProdukBeritahukamiapayangkamucari')}</p>
                <p className='font-medium text-sm text-neutral-900'>{t('LabelfilterProdukMasukkankamu')}</p>
              </div>
              24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0194
              <div className={`${getMenu?.id==='produk'?'flex-col':'flex-col-reverse'} flex gap-6`}>
                <div className='flex flex-col gap-4'>
                  <span className='font-semibold text-sm text-neutral-900 flex gap-1'>Email <p className='text-[10px]'>{'(Optional)'}</p></span>
                  <Input placeholder='Contoh : brikobatubata@mail.com' value={getState.email} changeEvent={(e)=>setState(prev=>({...prev,email:e.target.value}))} />
                </div>
                <div className='flex flex-col gap-4'>
                  24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0195 LB - 0143
                  <p className='font-semibold text-sm text-neutral-900'>Deskripsi {t('LabelfilterProdukProduk')}*</p>
                  <p className='font-semibold text-sm text-neutral-900'>Label *</p>
                  24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0197
                  <div className='flex flex-col gap-2'>
                    <textarea onChange={e=>e?.target?.value?.length<1000?setState(a=>({...a,description:e.target.value})):''} className='border border-neutral-600 rounded-md py-[11px] px-3 placeholder:text-sm placeholder:font-semibold placeholder:text-neutral-600 h-[62px] outline-none' placeholder='Mohon deskripsikan produk yang kamu tidak temukan pada muatparts atau berikan saran kepada tim muatparts'></textarea>
                    <span className='medium-xs text-neutral-600 self-end'>{getState.description.length}/{ThousandSeparator(1000)}</span>
                  </div>
                </div>
              </div>
            </div>
            IMP MENDADAK
            <Button disabled={!getState?.description?.length} Class='self-end h-7' onClick={()=>trigger_let_us_know(getState)}>{t('LabelfilterProdukKirim')}</Button>
          </div>
          
          </>:''
        } */}
        {/* LBM Data not found */}
        {
          !isLoading && products?.length===0 && (
            <DataNotFound textClass={'!font-semibold !text-sm !text-neutral-600 !w-[111px]'} title='Keyword 
  Tidak Ditemukan' />
          )
        }
        {
          getMenu?.id==='produk'&& (
            <>
              {
                // LBM Filter produk responsive empty error
                !isLoading? products?.length>0&&(
                  <div className='grid grid-cols-2 gap-2 px-4'>
                    {
                      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0600
                      products?.map(val=><ProductComponent parentClassname={"!w-auto"} classname={"!w-auto"} key={val.id} {...val} />)
                    }
                  </div>
                ):(
                  <div className="grid grid-cols-2 gap-2 px-4 ">
                  {Array(3).fill('').map(()=>(

                      <ProductComponentSkeleton/>
                    
                  ))}
                  </div>
                )
              }
            </>
          )
        }
         {
          getMenu?.id==='toko'&& (
            <>
              {
                !isLoading? products?.length&&(
                  <div className='flex flex-col gap-2 px-4 !w-full'>
                    {
                      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0600
                      products?.map(val=><StoreCardComponent parentClassname={"!w-auto"} classname={"!w-auto"} key={val.id} {...val} />)
                    }
                  </div>
                ):(
                  <div className="flex flex-col gap-2 px-4">
                  {Array(3).fill('').map(()=>(
                    
                      <StoreCardComponentSkeleton/>
                    
                  ))}
                  </div>
                )
              }
            </>
          )
        }
        {/* {!isLoading && !products?.length && (
          <>
            <DataNotFound textClass={'!font-semibold !text-sm !text-neutral-600 !w-[111px]'} title='Keyword 
    Tidak Ditemukan' />
            <div className='flex flex-col gap-6 px-4 bg-neutral-50 py-5'>
              <div className={`flex gap-6 flex-col`}>
                <div className='flex flex-col gap-4'>
                  <p className='font-semibold text-sm text-neutral-900'>{t('LabelfilterProdukBeritahukamiapayangkamucari')}</p>
                  <p className='font-medium text-sm text-neutral-900'>{t('LabelfilterProdukMasukkankamu')}</p>
                </div>
                24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0194
                <div className={`${getMenu?.id==='produk'?'flex-col':'flex-col-reverse'} flex gap-6`}>
                  <div className='flex flex-col gap-4'>
                    <span className='font-semibold text-sm text-neutral-900 flex gap-1'>Email <p className='text-[10px]'>{'(Optional)'}</p></span>
                    <Input placeholder='Contoh : brikobatubata@mail.com' value={getState.email} changeEvent={(e)=>setState(prev=>({...prev,email:e.target.value}))} />
                  </div>
                  <div className='flex flex-col gap-4'>
                    24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0195 LB - 0143
                    <p className='font-semibold text-sm text-neutral-900'>Deskripsi {t('LabelfilterProdukProduk')}*</p>
                    <p className='font-semibold text-sm text-neutral-900'>Label *</p>
                    24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0197
                    <div className='flex flex-col gap-2'>
                      <textarea onChange={e=>e?.target?.value?.length<1000?setState(a=>({...a,description:e.target.value})):''} className='border border-neutral-600 rounded-md py-[11px] px-3 placeholder:text-sm placeholder:font-semibold placeholder:text-neutral-600 h-[62px] outline-none' placeholder='Mohon deskripsikan produk yang kamu tidak temukan pada muatparts atau berikan saran kepada tim muatparts'></textarea>
                      <span className='medium-xs text-neutral-600 self-end'>{getState.description.length}/{ThousandSeparator(1000)}</span>
                    </div>
                  </div>
                </div>
              </div>
              IMP MENDADAK
              <Button disabled={!getState?.description?.length} Class='self-end h-7' onClick={()=>trigger_let_us_know(getState)}>{t('LabelfilterProdukKirim')}</Button>
            </div>
          </>
        )} */}
        {/* <div className='flex flex-col gap-2 px-4 pb-12'>
          {
            (getMenu?.id==='toko'&&products?.length)? products?.map(val=><StoreCardComponent  key={val.id} {...val} />):''
          }
        </div> */}

        <div className='flex flex-col gap-4 bg-neutral-50 px-4 pt-4'>
          {
            getMenu?.id==='produk'&&recomendedGoods?.length?
            <span className='font-semibold text-base text-neutral-900'>{t('LabelfilterProdukRekomendasiProdukLain')}</span>
            :recomendedStores?.length?<span className='font-semibold text-base text-neutral-900'>{t('LabelfilterProdukRekomendasiPenjuallainuntukkamu')}</span>:''
          }
          {/* list product/garasi rekomendasi */}
          <div className='grid grid-cols-2 gap-2'>
            {
              (getMenu?.id==='produk')&& recomendedGoods?.map(val=><ProductComponent key={val.id} {...val} />)
            }
          </div>
          <div className='flex flex-col gap-2'>
            {
              (getMenu?.id==='toko')&& recomendedStores?.map(val=><StoreCardComponent key={val.id} {...val}/>)
            }
          </div>
        </div>
      </div>

    </div>
  )
}

export default ProductsResponsive
  