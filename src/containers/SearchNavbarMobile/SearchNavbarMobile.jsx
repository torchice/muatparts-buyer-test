import React, { useCallback, useEffect, useRef, useState } from 'react'
import style from './SearchNavbarMobile.module.scss'
import Input from '@/components/Input/Input'
import IconComponent from '@/components/IconComponent/IconComponent'
import Image from 'next/image'
import SWRHandler from '@/services/useSWRHook'
import Button from '@/components/Button/Button'
import debounce from '@/libs/debounce'
import { useSearchParams } from 'next/navigation'
import { hightlightText } from '@/libs/TypographServices'
import ImageComponent from '@/components/ImageComponent/ImageComponent'
import DataNotFound from '@/components/DataNotFound/DataNotFound'
import { useCustomRouter } from '@/libs/CustomRoute'
import { useHeader } from '@/common/ResponsiveContext'
import { filterProduct } from '@/store/products/filter'
import ModalComponent from '@/components/Modals/ModalComponent'
import { metaSearchParams } from '@/libs/services'
import { useLanguage } from '@/context/LanguageContext'
import { Loader2 } from 'lucide-react'
import { modal } from '@/store/modal'
import { useDebounce } from '@/utils/useDebounce'
// IMP FILTER PRODUCT
function SearchNavbarMobile() {
    const { t } = useLanguage()
    const {clearScreen,setAppbar}=useHeader()
    const searchParams=useSearchParams()
    const router=useCustomRouter()
    const {useSWRHook,useSWRMutateHook} = SWRHandler()
    const menus=[
        {
            id:'product',
            name:t('LabelnavbarResponsiveNamaProduk')
        },
        {
            id:'type_of_transportation',
            name:t('LabelnavbarResponsiveJenisKendaraan')
        },
    ]
     /* IMPROVEMENT FILTER ON PRODUCTS & HOMEPAGE */
    const [url, setURL] = useState("")
    // const {data:options, isLoading:loadingFetchOptions} = useSWRHook(url)
    const VEHICLE_OPTIONS_ENDPOINT = "v1/muatparts/garasi/vehicle";

    const [optionsArray, setOptionsArray] = useState([])
    const [params, setParams] = useState({
        page:1,
        limit:10,
        keyword:''
    })
    // const { data: vehicleOptions } = useSWRHook("v1/muatparts/garasi/vehicle")
    // const { data: brandOptions } = useSWRHook("v1/muatparts/garasi/brand")
    // const { data: yearOptions } = useSWRHook("v1/muatparts/garasi/years")
    // const { data: modelOptions } = useSWRHook("v1/muatparts/garasi/model")
    // const { data: typeOptions } = useSWRHook("v1/muatparts/garasi/type")
    const [getModal,setModal]=useState({modal:'',data:[],title:'',field:''})
    const [getSearchModal,setSearchModal]=useState('')
    const [getTransportations,setTransportations] = useState({
        "vehicle":{
            name:t('LabelnavbarResponsivePilihKendaraan'),
            value:'',
            id:'',
        },
        "brand":{
            name:t('LabelnavbarResponsivePilihBrand'),
            value:'',
            id:'',
        },
        "year":{
            name:t('LabelnavbarResponsivePilihTahun'),
            value:'',
            id:'',
        },
        "model":{
            name:t('LabelnavbarResponsivePilihModel'),
            value:'',
            id:'',
        },
        "type":{
            name:t('LabelnavbarResponsivePilihTipe'),
            value:'',
            id:'',
        },
        "key_query":{
            name:t('LabelnavbarResponsiveSearch'),
            value:'',
            id:'',
        },
        
    })  
    const BRAND_OPTIONS_ENDPOINT = getTransportations?.vehicle?.id?`v1/muatparts/garasi/brand?vehicleID=${getTransportations?.vehicle?.id}`:null;
    const YEAR_OPTIONS_ENDPOINT = getTransportations?.brand?.id?`v1/muatparts/garasi/years?brandID=${getTransportations?.brand?.id}`:null;
    const MODEL_OPTIONS_ENDPOINT = getTransportations?.year?.id?`v1/muatparts/garasi/model?brandID=${getTransportations?.brand?.id}&year=${getTransportations?.year?.id}`:null;
    const TYPE_OPTIONS_ENDPOINT = getTransportations?.model?.id?`v1/muatparts/garasi/type?modelID=${getTransportations?.model?.id}`:null;
    const { data: vehicleOptions } = useSWRHook(VEHICLE_OPTIONS_ENDPOINT);
    const { data: brandOptions } = useSWRHook(BRAND_OPTIONS_ENDPOINT);
    const { data: yearOptions } = useSWRHook(YEAR_OPTIONS_ENDPOINT);
    const { data: modelOptions } = useSWRHook(MODEL_OPTIONS_ENDPOINT);
    const { data: typeOptions } = useSWRHook(TYPE_OPTIONS_ENDPOINT);
    const updateTransportations = (fieldKey, newId, newValue) => {
        const keys = Object.keys(getTransportations);
        const index = keys.indexOf(fieldKey);
      
        if (index === -1) return;
      
        const updated = { ...getTransportations };
      
        // Update selected field
        updated[fieldKey] = {
          ...updated[fieldKey],
          id: newId,
          value: newValue,
        };
      
        // Clear all fields after the selected one
        for (let i = index + 1; i < keys.length; i++) {
          updated[keys[i]] = {
            ...updated[keys[i]],
            id: '',
            value: '',
          };
        }
      
        setTransportations(updated);
      };
    const resetFilter = () => {
        setVehicle({
            vehicle: {
                value: "",
                name: "",
            },
            brand: {
                value: "",
                name: "",
            },
            year: {
                value: "",
                name: "",
            },
            model: {
                value: "",
                name: "",
            },
            type: {
                value: "",
                name: "",
            },
            keyword: "",
        })
    }
    const productFilter=filterProduct()
    const [getActive,setActive] = useState('product')
    const [getSearch,setSearch] = useState('')
    function handleCariSparepart() {
        productFilter.setFilterProduct('vehicleID',getTransportations?.['vehicle']?.['id'])
        productFilter.setFilterProduct('brandID',getTransportations?.['brand']?.['id'])
        productFilter.setFilterProduct('year',getTransportations?.['year']?.['id'])
        productFilter.setFilterProduct('modelID',getTransportations?.['model']?.['id'])
        // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0845
        productFilter.setFilterProduct('typeID',getTransportations?.['type']?.['id'])
        productFilter.setFilterProduct('q',getSearchModal)
        const filterProd = productFilter
        delete filterProd.setFilterProduct
        delete filterProd.setFilter
        delete filterProd.setAllFilter
        clearScreen()
        router.push(`${process.env.NEXT_PUBLIC_ASSET_REVERSE}/products?${metaSearchParams(filterProd)}`)
    }
    const handleSearchProduct=(val,isToko='')=>{
        // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0207
        if(val?.trim())
        {
            productFilter?.setFilterProduct('type',isToko)
            productFilter?.setFilterProduct('q',val)
            setSearch(val)
            clearScreen()
            router.push(`/products?q=${val}`)
        }
      }
    const handleInput =useCallback(debounce((val)=>{
            productFilter?.setFilter({
                q:val,
                page: searchParams.get('page')?searchParams.get('page'):1,
                limit: searchParams.get('limit')?searchParams.get('limit'):10
            })
        },500)
    ,[])
    const {data,isLoading} = useSWRHook(`v1/muatparts/product/search_suggestion?q=${productFilter.q}`)
    // useEffect(()=>{
    //     if(searchParams.get('q')){
    //         productFilter?.setFilter('q',searchParams.get('q'))
    //         productFilter?.setFilter('page', searchParams.get('page')?searchParams.get('page'):1)
    //         productFilter?.setFilter("limit", searchParams.get('limit')?searchParams.get('limit'):10)
    //     }
    // },[searchParams])
      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0928
      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0929
    const getFirstEmptyFieldBefore = (currentField) => {
        const fieldOrder = ["vehicle", "brand", "year", "model", "type"];
    
        const currentIndex = fieldOrder.indexOf(currentField);
        if (currentIndex <= 0) return null;
    
        for (let i = 0; i < currentIndex; i++) {
          const field = fieldOrder[i];
          if (!getTransportations[field].value) {
            return field;
          }
        }
    
        return null;
      };
    const errorMessages = {
        vehicle:t("LabeldropdownFilterKendaraanPilihJenisKendaraanterlebihdahulu"),
        brand: t("LabeldropdownFilterKendaraanPilihBrandterlebihdahulu"),
        year: t("LabeldropdownFilterKendaraanPilihTahunterlebihdahulu"),
        model: t("LabeldropdownFilterKendaraanPilihModelterlebihdahulu"),
        type: t("LabeldropdownFilterKendaraanPilihModelterlebihdahulu"),
    };
    const handleErrorMessage = (field) => {
        const firstEmpty = getFirstEmptyFieldBefore(field);
    
        if (firstEmpty) {
          setIsError({
            field,
            message: errorMessages[firstEmpty] ||`${firstEmpty} must be filled`,
          });
        } else {
          setIsError({
            field: "",
            message: "",
          });
        }
      };
    const [isError, setIsError] = useState({
        field:'',
        message:""
    })

    // useEffect(()=>{
    //     if(options){
    //         const tmp = [...optionsArray]
    //         tmp.push(...options.Data)
    //         setOptionsArray(tmp)
    //         console.log(tmp)
    //     }
    // },[options])
    useEffect(()=>{
        setModal((prev)=>({...prev, data:optionsArray}))
    },[productFilter.brandID, productFilter.year, productFilter.modelID, productFilter.typeID])


    /* INFINITE SCROLL LOGIC */
    // const scrollContainerRef = useRef(null)
    // const hasUserScrolledRef = useRef(null)
    // const loaderRef = useRef(null)

    // const handleLoadMore = () => {
    //     const nextPage = params.page + 1;
    //     const updatedParams = { ...params, page: nextPage };
      
    //     const [baseURL] = url.split("?");
    //     const newURL = `${baseURL}?${metaSearchParams(updatedParams)}`;
    //     setParams(updatedParams)
    //     setURL(newURL);
    // };

    // const handleSearch = (keyword) => {
    //     setOptionsArray([])
    //     const updatedParams = { ...params, page:1, keyword:keyword };
    //     const [baseURL] = url.split("?");
    //     const newURL = `${baseURL}?${metaSearchParams(updatedParams)}`;
    //     setParams(updatedParams)
    //     setURL(newURL);
    // }

    // useEffect(() => {
    //     const el = scrollContainerRef.current;
    //     if (!el) return;

    //     const handleScroll = () => {
    //     hasUserScrolledRef.current = true;
    //     };

    //     el.addEventListener("scroll", handleScroll);

    //     return () => {
    //     el.removeEventListener("scroll", handleScroll);
    //     };
    // }, [modal, optionsArray]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const first = entries[0];
//         if (
//           first.isIntersecting && 
//           optionsArray.length < options?.Pagination?.total 
//         ) {
//           handleLoadMore();
//         } 
//       },
//       { root: scrollContainerRef.current, threshold: 0.1 }
//     );

//     if (loaderRef.current) {
//       observer.observe(loaderRef.current);
//     }

//     return () => observer.disconnect();
//   }, [optionsArray, modal]);
  
//   const debouncedValue = useDebounce(getSearchModal, 1000)
//   const isFirstRun = useRef(true)
//   useEffect(()=>{
//     if (isFirstRun.current){
//         isFirstRun.current=false;
//         return;
//     }
//    handleSearch(debouncedValue)
//   },[debouncedValue])
  return (
    <div className='flex flex-col bg-neutral-50 h-screen relative '>
        <ModalComponent type='BottomSheet' full title={getModal?.title} isOpen={getModal?.modal==='modal_kendaraan'} setClose={()=>setModal({data:[],modal:'',title:'',field:''})}>
            <div className='flex flex-col pb-10 overflow-auto h-[50vh]'>
                <div className="w-full sticky top-0 bg-white pt-6 px-4 pb-6">
                    <Input placeholder={`Cari ${getModal?.title?.split(' ')?.[1]}`} changeEvent={e=>{setSearchModal(e.target.value);console.log(e.target.value)}} />
                </div>
                <div className='flex flex-col gap-4 px-4 pb-4 '>
                    {/* {
                        getModal?.data?.filter(a=>a.value?.toString()?.toLowerCase().includes(getSearchModal.toLowerCase()))?.map((val,i)=><span key={i} onClick={()=>{
                            setTransportations(a=>({...a,[getModal?.field]:{...getTransportations[getModal?.field],value:val?.value,id:val?.id}}))
                            setModal({data:[],modal:'',title:'',field:''})
                        }} className='pb-4 border-b border-neutral-400 semi-sm'>{val?.value}</span>)
                    } */}
                    {
                        getModal?.data?.filter(a=>a.value?.toString()?.toLowerCase().includes(getSearchModal.toLowerCase()))?.map((val,i)=><span key={i} onClick={()=>{
                            updateTransportations(getModal?.field, val?.id, val?.value)
                            // setTransportations(a=>({...a,[getModal?.field]:{...getTransportations[getModal?.field],value:val?.value,id:val?.id}}))
                            setModal({data:[],modal:'',title:'',field:''})
                            setSearchModal("")
                        }} className='pb-4 border-b border-neutral-400 semi-sm'>{val?.value}</span>)
                    }
                    {/* {(!getModal?.data?.length||!getModal?.data?.filter(a=>a.value?.toString()?.toLowerCase().includes(getSearchModal.toLowerCase()))?.length)&&<span className='semi-sm text-center'>{t('LabelnavbarResponsiveDataTidakDitemukan')}</span>} */}
                    {!getModal?.data?.length&&<span className='semi-sm text-center'>{t('LabelnavbarResponsiveDataTidakDitemukan')}</span>}
                </div>
                {/* {loadingFetchOptions && (<div className="flex items-center justify-center w-full"><Loader2 className="animate-spin text-neutral-500"/></div>)} */}
               
                <div className="h-0.5 w-full flex items-center justify-center"/>
            </div>
        </ModalComponent>
        <div className={`bg-neutral-50  flex items-center w-full z-[90] sticky top-[52px] shadow-md`}>
            {
                menus.map(val=><div key={val.id} onClick={()=>setActive(val.id)} className={`${val.id===getActive?'text-primary-700':'text-[#676767]'} font-bold text-sm pt-[10px] pb-[14px] px-10 border-b-2 ${val.id===getActive?'border-primary-700 border-b-2':'border-neutral-200'} w-[50%] whitespace-nowrap`}>{val.name}</div>)
            }
        </div>
        <div className='flex flex-col gap-5 pt-5 px-4'>
            {getActive==='product' && (
                <form onSubmit={e=>{
                    e.preventDefault()
                    handleSearchProduct(getSearch)
                }}>
                    {(getActive==='product')&&<Input 
                        placeholder={t('LabelnavbarResponsiveCariProduk')} 
                        value={getSearch} 
                        changeEvent={e=>{
                            setSearch(e.target.value)
                            productFilter?.setFilter('q',e.target.value)
                            handleInput(e.target.value)
                        }} 
                        icon={{left:'/icons/search.svg',right:getSearch?<span onClick={()=>setSearch('')}><IconComponent src={'/icons/closes.svg'} width={10} height={10} /></span>:''}}  />}
                </form>
            )}
            
            {
                (getActive==='product'&&getSearch)?
                <div className='flex flex-col bg-neutral-50 gap-[27px]'>
                    {data?.Data?.products?<ul className='list-none flex flex-col gap-3'>
                        {
                            data?.Data?.products?.map(val=>{
                                return(
                                    <li key={val.id}>
                                        <div className="pl-4 pb-3 border-b border-neutral-400 flex items-center gap-2 cursor-pointer" onClick={()=>handleSearchProduct(val?.productName)}>
                                            <IconComponent src={'/icons/search.svg'} width={18} height={18} />
                                            <span className="normal-sm" dangerouslySetInnerHTML={{__html:hightlightText(getSearch,val?.productName)}}></span>
                                        </div>
                                    </li>

                                )
                            })
                        }
                    </ul>:''}
                    {
                        !!(data?.Data?.stores?.length && getSearch)&&
                        <div className="flex flex-col gap-3">
                            <span className="bold-sm">{t('LabelnavbarResponsiveCariPenjual')}</span>
                            <ul className="list-none flex flex-col gap-2">
                                {
                                data?.Data?.stores?.map(val=>{
                                    return(
                                    <li key={val.id}>
                                        <div className="pl-4 pb-3 border-b border-neutral-400 flex items-center gap-2 cursor-pointer" onClick={()=>handleSearchProduct(val?.storeName,'store')}>
                                        {val?.logoPath&&<ImageComponent alt={val?.logoPath} src={val?.logoPath} width={24} height={24} className={'rounded-full'} />}
                                        <span className="normal-sm" dangerouslySetInnerHTML={{__html:hightlightText(getSearch,val?.storeName)}}></span>
                                        </div>
                                    </li>
                                    )
                                })
                                }
                            </ul>
                        </div>
                    }
                    {(!data?.Data?.products?.length&&getSearch&&!isLoading)?<DataNotFound width={52} height={45} classname={'!flex-row gap-3 items-center pt-3 py-5'}><span className="text-neutral-600 semi-xs">{t('LabelnavbarResponsiveHasilPencarianTidakDitemukan')}</span></DataNotFound>:''}
                    {getSearch&&<div className="flex flex-col">
                        <span className="bold-sm">{t('LabelnavbarResponsiveAlternatifPencarian')}</span>
                        <ul className="list-none mt-3">
                            <li>
                                <div className="py-2 px-4 flex items-center gap-2 cursor-pointer" onClick={()=>{
                                    productFilter?.setFilterProduct('alias',true)
                                    handleSearchProduct(getSearch)
                                    }}>
                                <IconComponent src={'/icons/search.svg'} />
                                {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0760 */}
                                <span className="medium-xs">{t('LabelnavbarResponsiveCarisemuaproduk')} <b>{getSearch}</b></span>
                                </div>
                            </li>
                            <li>
                                <div className="py-2 px-4 flex items-center gap-2 cursor-pointer" onClick={()=>{
                                    productFilter?.setFilterProduct('alias',true)
                                    handleSearchProduct(getSearch)
                                    }}>
                                <IconComponent src={'/icons/search.svg'} />
                                {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0760 */}
                                <span className="medium-xs">{t('LabelnavbarResponsiveCarisemuaprodukdanprodukdenganalias')} <b>“{getSearch}”</b></span>
                                </div>
                            </li>
                        </ul>
                    </div>}
                </div>
                :getActive==='product'?<div className='flex flex-col gap-3 '>
                    <span className='text-[#000000] text-sm font-semibold'>{t('LabelnavbarResponsivePromoyangpalingbanyakdicari')}</span>
                    <span className='h-[1px] w-full bg-neutral-400'></span>
                    <Image className='w-full' width={323} height={131} alt='adspr' src={'/img/ads_search_product_name.png'} />
                </div>:''
            }
            {
                (getActive==='type_of_transportation')&&
                <div className='flex flex-col gap-5'>
                    {
                        Object.entries(getTransportations).map((val,idx,arr)=>{
                            const prevItem = arr[idx - 1]?.[1]; // Previous field object (if exists)
                            const isDisabled = idx > 0 && !prevItem?.value; // Disable if previous value is empty                        
                            if(val[0]==='key_query') return <Input 
                            placeholder={t('LabelnavbarResponsiveMasukkankatakunci')}
                             icon={{left: <span className={`${val[1]['value']?'bg-primary-700':'bg-neutral-700'} rounded-full w-4 h-4 text-neutral-50 font-bold text-[10px] grid place-content-center`} >{idx+1}</span>}} />
                            return (
                                <div className="flex flex-col gap-2">
                                    <Button 
                                        onClick={()=>{
                                            if(!isDisabled){
                                                let selectedOptions;
                                                switch(val[0]){
                                                    case'vehicle':
                                                        console.log(val[0])
                                                    default:
                                                        console.log(val[0])
                                                }
                                                setOptionsArray([])
                                                let tempParams = {...params}
                                                tempParams.page=1
                                                tempParams.keyword=""
                                                setURL(`${val[1].url}`)
                                                setParams(tempParams)
                                                let data = val[0]==='vehicle'?vehicleOptions?.Data:val[0]==='brand'?brandOptions?.Data:val[0]==='year'?yearOptions?.Data:val[0]==='model'?modelOptions?.Data:val[0]==='type'?typeOptions?.Data:[]
                                                setModal({modal:'modal_kendaraan',data:data,title:val[1]['name'],field:val[0]})
                                                setIsError({field:'',message:''})
                                            } else {
                                                // setIsError({field:val[0], message:`Pilih ${arr[idx-1][0]} terlebih dahulu`})
                                                handleErrorMessage(val[0])
                                            }
                                        }}
                                        key={idx}
                                        iconLeft={<span className={`${val[1]['value']?'bg-primary-700':'bg-neutral-700'} rounded-full w-4 h-4 text-neutral-50 font-bold text-[10px] grid place-content-center`} >{idx+1}</span>}
                                        iconRight={'/icons/chevron-down.svg'}
                                        Class={`!all-none h-8 border ${isError.field===val[0]?'border-red-400':'border-neutral-600'} rounded-md !bg-neutral-50 !w-full max-w-none justify-between !px-3 ${val[1]['value']?'!text-neutral-900':'!text-neutral-600'} font-semibold text-sm relative`}>
                                        <span className='line-clamp-1 absolute top-[6px] left-[48px] text-left'>{val[1]["value"]?val[1]["value"]:val[1]['name']}</span>
                                    </Button>
                                    {isError.field===val[0] && (<p className="text-red-500 text-xs font-medium">{isError.message}</p>)}
                                </div>
                            )
                        })
                    }
                    
                </div>
            }
            {getActive==='type_of_transportation'&&<div className='fixed bottom-0 left-0 bg-white w-full h-[64px] py-3 px-4'>
                <Button onClick={handleCariSparepart} Class='w-full max-w-none'>{t('LabelnavbarResponsiveCariSukuCadang')}</Button>
            </div>}
        </div>
    </div>
  )
}

export default SearchNavbarMobile
