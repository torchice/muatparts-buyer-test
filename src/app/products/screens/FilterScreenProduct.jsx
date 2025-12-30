import { useHeader } from '@/common/ResponsiveContext'
import Bubble from '@/components/Bubble/Bubble'
import Button from '@/components/Button/Button'
import ButtonBottomMobile from '@/components/ButtonBottomMobile/ButtonBottomMobile'
import IconComponent from '@/components/IconComponent/IconComponent'
import Input from '@/components/Input/Input'
import ModalComponent from '@/components/Modals/ModalComponent'
import ZustandHandler from '@/libs/handleZustand'
import { filterProduct } from '@/store/products/filter'
import React, { useState } from 'react'
import { mockProductsData } from '@/containers/HomePage/mock'
import { userLocationZustan } from '@/store/manageLocation/managementLocationZustand'
import { useLanguage } from '@/context/LanguageContext'

function FilterScreenProduct({
    isToko,
    getFilterProductState,
    setFilterProductState,
    getFilterProduct,
    brand,
    type,
    model,
    year,
    garasiList,
    cities,
    brandproducts,
    categories,
    condition,
    shippingOptions,
    bonus,
    onClickLeft,
    onClickRight,
    textLeft,
    textRight}) {
    const { t } = useLanguage()
    const {setAppBar,setScreen,screen,setSearch,search}=useHeader()
    const {selectedLocation}=userLocationZustan()
    function setFilter(label,value) {
        if(Array.isArray(getFilterProductState[label])){
            if(getFilterProductState[label]?.some(a=>a===value)){
                let tmp = getFilterProductState[label]?.filter(a=>a!==value)
                setFilterProductState(a=>({...a,[label]:tmp}))
            }else setFilterProductState(a=>({...a,[label]:[...getFilterProductState[label],value]}))
        }else{
            // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0192
            let defaultValue = typeof value==='number'?0:typeof value==='string'?'':null
            if(getFilterProductState[label]===value) setFilterProductState(a=>({...a,[label]:defaultValue}))
            else setFilterProductState(a=>({...a,[label]:value}))
        }
    }

    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0932
    const errorMessages = {
        vehicleID:t("LabeldropdownFilterKendaraanPilihJenisKendaraanterlebihdahulu"),
        brandID: t("LabeldropdownFilterKendaraanPilihBrandterlebihdahulu"),
        year: t("LabeldropdownFilterKendaraanPilihTahunterlebihdahulu"),
        modelID: t("LabeldropdownFilterKendaraanPilihModelterlebihdahulu"),
        typeID: t("LabeldropdownFilterKendaraanPilihModelterlebihdahulu"),
    };
    const getFirstEmptyFieldBefore = (currentField) => {
        const fieldOrder = ["brandID", "year", "modelID", "type"];

        const currentIndex = fieldOrder.indexOf(currentField);
        if (currentIndex <= 0) return null;

        for (let i = 0; i < currentIndex; i++) {
            const field = fieldOrder[i];
            // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0929
            if (getFilterProductState?.[field]===0||getFilterProductState?.[field]==='') {
                return field;
            }
        }
        return null;
    };
    const handleDropdownClick = (field) => {
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
        field:"",
        message:""
    })
  return (
    <div className='flex flex-col w-full gap-5 containerMobile bg-neutral-50 pb-[80px]'>
        {/* garasi */}
        {!isToko&&<><EachComponent label={t('LabelfilterProdukGarasisaya')} labelActionButton={t("LabelfilterProdukResetfilterGarasi")} actionButton={()=>setFilterProductState('garageID','')}>
            <Button iconRight={'/icons/chevron-down.svg'} Class={`!bg-neutral-50 ${garasiList?.some(a=>a?.value===getFilterProductState?.garageID)?'!text-neutral-900':'!text-neutral-600'}  border border-neutral-600 rounded-md !h-8 !font-semibold !max-w-full !w-full !justify-between !px-3`} onClick={()=>{
                setScreen('garasi')
                setSearch({
                    placeholder:`${t('LabelfilterProdukCari')} ${t('LabelfilterProdukdi')} ${t('LabelfilterProdukGarasisaya')}`
                })
            }}><span className='w-full line-clamp-1 text-left'>{garasiList?.some(a=>a?.value===getFilterProductState?.garageID)?garasiList?.find(a=>a?.value===getFilterProductState?.garageID)?.name:t('LabelfilterProdukKendaraansaya')}</span></Button>
        </EachComponent>
        {/* jenis kendaraan */}

        <EachComponent label={t('LabelfilterProdukJenisKendaraan')} labelActionButton={`Reset filter ${t('LabelfilterProdukJenisKendaraan')}`} actionButton={()=>{
            // setFilterProductState('brandID','')
            // setFilterProductState('year','')
            // setFilterProductState('modelID','')
            //  // LBM - Filter Reset bug - 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0843
            // setFilterProductState('typeID','')
            // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0929
            setFilterProductState({
                ...getFilterProductState,
                brandID:'',
                year:'',
                modelID:'',
                typeID:''
            })
        }}>
            <Button onClick={()=>{
                setScreen('kendaraan')
                setSearch({
                    value:'',
                    placeholder:`${t('LabelfilterProdukCari')} Brand`,
                    tmp:"brand"
                })
            // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0412
            }} iconRight={'/icons/chevron-down.svg'} Class={`!bg-neutral-50 ${brand?.some(a=>a?.id===getFilterProductState?.brandID)?'!text-neutral-900':'!text-neutral-600'}  border border-neutral-600 rounded-md !h-8 !font-semibold !max-w-full !w-full !justify-between !px-3`}>{brand?.some(a=>a?.id===getFilterProductState?.brandID)?brand?.find(a=>a?.id===getFilterProductState?.brandID)?.value:t('LabelfilterProdukBrand')}</Button>

            <Button onClick={()=>{
                if(getFilterProductState?.brandID){
                    setScreen('kendaraan')
                    setSearch({
                        value:'',
                        placeholder:`${t('LabelfilterProdukCari')} ${t('LabelfilterProdukTahun')}`,
                        tmp:"year"
                    })
                } else {
                    handleDropdownClick('year')
                    // setIsError({
                    //     field:'year',
                    //     message:t("LabeldropdownFilterKendaraanPilihBrandterlebihdahulu")
                    // })
                }
            }} iconRight={'/icons/chevron-down.svg'} Class={`!bg-neutral-50 ${year?.some(a=>a?.id==getFilterProductState?.year)?'!text-neutral-900':'!text-neutral-600'}  border ${isError.field==='year'?`border-red-400`:`border-neutral-600`} rounded-md !h-8 !font-semibold !max-w-full !w-full !justify-between !px-3`}>{year?.some(a=>a?.id==getFilterProductState?.year)?year?.find(a=>a?.id==getFilterProductState?.year)?.value:t('LabelfilterProdukTahun')}</Button>
            {isError.field==='year' && <p className="text-red-500 -mt-2 text-xs font-medium">{isError?.message}</p>}
            <Button onClick={()=>{
                if(getFilterProductState?.year){
                    setScreen('kendaraan')
                    setSearch({
                        value:'',
                        placeholder:`${t('LabelfilterProdukCari')} Model`,
                        tmp:"model"
                    }) 
                } else {
                    handleDropdownClick('modelID')
                    // setIsError({
                    //     field:'model',
                    //     message:t("LabeldropdownFilterKendaraanPilihTahunterlebihdahulu")
                    // })
                }
            }} iconRight={'/icons/chevron-down.svg'} Class={`!bg-neutral-50 ${model?.some(a=>a?.id===getFilterProductState?.modelID)?'!text-neutral-900':'!text-neutral-600'}  border ${isError.field==='model'?'border-red-400':'border-neutral-600'} rounded-md !h-8 !font-semibold !max-w-full !w-full !justify-between !px-3`}>{model?.some(a=>a?.id===getFilterProductState?.modelID)?model?.find(a=>a?.id===getFilterProductState?.modelID)?.value:t("LabelfilterProdukModel")}</Button>
            {isError.field==='modelID' && <p className="text-red-500 -mt-2 text-xs font-medium">{isError?.message}</p>}
            <Button onClick={()=>{
                if(getFilterProductState?.modelID){              
                    setScreen('kendaraan')
                    setSearch({
                        value:'',
                        placeholder:`${t('LabelfilterProdukCari')} Type`,
                        tmp:'type'
                    })  
                } else {
                    handleDropdownClick('type')
                    // setIsError({
                    //     field:'type',
                    //     // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0846
                    //     message:t("LabeldropdownFilterKendaraanPilihModelterlebihdahulu")
                    // })
                }
                 /* IMPROVEMENT FILTER ON PRODUCTS & HOMEPAGE */
                //  25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0845
            }} iconRight={'/icons/chevron-down.svg'} Class={`!bg-neutral-50 ${type?.some(a=>a?.id===getFilterProductState?.typeID)?'!text-neutral-900':'!text-neutral-600'}  border  ${isError.field==='type'?'border-red-400':'border-neutral-600'} rounded-md !h-8 !font-semibold !max-w-full !w-full !justify-between  !px-3`}>{type?.some(a=>a?.id===getFilterProductState?.typeID)?<span className="line-clamp-1 text-left">{type?.find(a=>a?.id===getFilterProductState?.typeID)?.value}</span>:t("LabelfilterProdukTipe")}</Button>
            {isError.field==='type' && <p className="text-red-500 -mt-2 text-xs font-medium">{isError?.message}</p>}
        </EachComponent>
        {/* harga */}
        <EachComponent label={t('LabelfilterProdukHarga')}>
            <Input type='number' changeEvent={(e)=>setFilter('startPrice',Number(e.target.value))} value={!getFilterProductState?.['startPrice']?'':getFilterProductState?.['startPrice']} placeholder={`${t('LabelfilterProdukHarga')} minimum`} icon={{left:<span className='font-semibold text-sm text-neutral-900'>Rp</span>}} />
            <Input type='number' changeEvent={(e)=>setFilter('endPrice',Number(e.target.value))} value={!getFilterProductState?.['endPrice']?'':getFilterProductState?.['endPrice']} placeholder={`${t('LabelfilterProdukHarga')} maximum`} icon={{left:<span className='font-semibold text-sm text-neutral-900'>Rp</span>}} />
        </EachComponent></>}
        {/* jarak */}
        <EachComponent label={t('LabelfilterProdukJarak')}>
            <div className='flex flex-wrap gap-2'>
                <span onClick={()=>{
                    setFilter('latitude',selectedLocation?.Latitude??-7.2575)
                    setFilter('longitude',selectedLocation?.Longitude??112.7521)
                    setFilter('radius',5)
                    }}>
                    <Bubble classname={`border ${getFilterProductState?.['radius']===5?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >{t('LabelfilterProdukRadius')} 5 km</Bubble>
                </span>
                <span onClick={()=>{
                    setFilter('latitude',selectedLocation?.Latitude??-7.2575)
                    setFilter('longitude',selectedLocation?.Longitude??112.7521)
                    setFilter('radius',10)
                    }}>
                    <Bubble classname={`border ${getFilterProductState?.['radius']===10?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >{t('LabelfilterProdukRadius')} 10 km</Bubble>
                </span>
                <span onClick={()=>{
                    setFilter('latitude',selectedLocation?.Latitude??-7.2575)
                    setFilter('longitude',selectedLocation?.Longitude??112.7521)
                    setFilter('radius',20)
                    }}>
                    <Bubble classname={`border ${getFilterProductState?.['radius']===20?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >{t('LabelfilterProdukRadius')} 20 km</Bubble>
                </span>
            </div>
        </EachComponent>
        {/* lokasi */}
        {cities?.length>0&&<EachComponent label={t('LabelfilterProdukLokasi')} labelActionButton={t('LabelfilterProdukLihatSemua')}
        actionButton={()=>{
            setScreen('location')
            setSearch({
                placeholder:`${t('LabelfilterProdukCari')} ${t('LabelfilterProdukLokasi')}`
            })
        }}>
            <div className='flex flex-wrap gap-2'>
                {/* // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0192 */}
                {cities?.map((val)=><span key={val?.id} onClick={()=>setFilter('cityID',val?.id)}>
                    <Bubble classname={`border ${getFilterProductState?.['cityID']?.toString()?.includes(val?.id)?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >{val?.value}</Bubble>
                </span>)}
            </div>
        </EachComponent>}
        {/* pengiriman */}
        {!isToko&&!!(shippingOptions?.length)&&<EachComponent label={t('LabelfilterProdukPengiriman')}>
            <div className='flex flex-wrap gap-2'>
                {shippingOptions?.map(val=><span key={val?.id} onClick={()=>setFilter('shipping', val?.id)}>
                    <Bubble classname={`border ${getFilterProductState?.['shipping']?.includes(val?.id)?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >{val?.value}</Bubble>
                </span>)}
            </div>
        </EachComponent>}
        {/* t('LabelfilterProdukPenjualTerakhirAktif') */}
        <EachComponent label={t('LabelfilterProdukPenjualTerakhirAktif')}>
            <div className='flex flex-wrap gap-2'>
                <span onClick={()=>setFilter('lastOnline', 'active')}>
                    <Bubble classname={`border ${getFilterProductState?.['lastOnline']?.some(val=>val==='active')?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >{t('LabelfilterProdukSedangAktif')}</Bubble>
                </span>
                <span onClick={()=>setFilter('lastOnline', 'hour')}>
                    <Bubble classname={`border ${getFilterProductState?.['lastOnline']?.some(val=>val==='hour')?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >{t('LabelfilterProdukPalinglama1jamyanglalu')}</Bubble>
                </span>
                <span onClick={()=>setFilter('lastOnline', 'day')}>
                    <Bubble classname={`border ${getFilterProductState?.['lastOnline']?.some(val=>val==='day')?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >{t('LabelfilterProdukPalinglama1hariyanglalu')}</Bubble>
                </span>

            </div>
        </EachComponent>
        {/* t('LabelfilterProdukKategori') */}
        {!isToko&&<EachComponent label={t('LabelfilterProdukKategori')} labelActionButton={t('LabelfilterProdukLihatSemua')} actionButton={()=>{
            setScreen('category')
            setSearch({
                placeholder:`${t('LabelfilterProdukCari')} ${t('LabelfilterProdukKategori')}`
            })
        }}>
            <div className='flex flex-wrap gap-2'>
                {categories?.slice?.(0,5).map(val=><Bubble onClick={()=>setFilter('groupcategoryID',val?.id)} key={val?.id} classname={`border ${getFilterProductState?.['groupcategoryID']?.includes(val?.id)?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >{val?.value}</Bubble>)}
            </div>
        </EachComponent>}
        {/* Brand */}
        {brandproducts?.length>0&&<EachComponent label={t("LabelfilterProdukBrand")} labelActionButton={t('LabelfilterProdukLihatSemua')} actionButton={()=>{
            setScreen('brand')
            setSearch({
                placeholder:`${t('LabelfilterProdukCari')} Brand`
            })
        }}>
            <div className='flex flex-wrap gap-2'>
                {brandproducts?.map(val=><span key={val?.id} onClick={()=>setFilter('brandProductID', val?.id)}>
                    <Bubble classname={`border ${getFilterProductState?.['brandProductID']?.includes(val?.id)?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >{val?.value}</Bubble>
                </span>)}

            </div>
        </EachComponent>}
        {/* t('LabelfilterProdukJenisPenjualan') */}
        {!isToko&&<><EachComponent label={t('LabelfilterProdukJenisPenjualan')} >
            <div className='flex flex-wrap gap-2'>
                <span onClick={()=>setFilter('salesType', 'Satuan/Ecer')}>
                    <Bubble classname={`border ${getFilterProductState?.['salesType']?.includes('Satuan/Ecer')?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >Satuan/Ecer</Bubble>
                </span>
                <span onClick={()=>setFilter('salesType', 'Grosir')}>
                    <Bubble classname={`border ${getFilterProductState?.['salesType']?.includes('Grosir')?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >Grosir</Bubble>
                </span>
            </div>
        </EachComponent>
        {/* promo */}
        {getFilterProductState?.['promo']?.length&&bonus?.length?<EachComponent label={t('LabelfilterProdukPromo')} >
            <div className='flex flex-wrap gap-2'>
                {bonus?.map(val=><span key={val?.id} onClick={()=>setFilterProductState('promo', val?.id)}>
                    <Bubble classname={`border ${getFilterProductState?.['promo']?.includes(val?.id)?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >{val?.value}</Bubble>
                </span>)}
            </div>
        </EachComponent>:''}
        {/* jeni produk */}
        <EachComponent label={t("LabelfilterProdukJenisProduk")} >
            <div className='flex flex-wrap gap-2'>
                {condition?.map(val=><span key={val?.id} onClick={()=>setFilter('conditionID', val?.id)}>
                    <Bubble classname={`border ${getFilterProductState?.['conditionID']?.includes(val?.id)?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium`} >{val?.value}</Bubble>
                </span>)}
            </div>
        </EachComponent></>}
        {/* rating produk */}
        <EachComponent label={t("LabelfilterProdukRatingProduk")} >
            <div className='flex flex-wrap gap-2'>
                <span onClick={()=>setFilter('rating', 5)}>
                    <Bubble  classname={`border ${getFilterProductState?.['rating']?.includes(5) || getFilterProductState?.['rating']?.includes("5")?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium flex items-center gap-2`} >
                        <IconComponent src={'/icons/product-star.svg'} width={14} height={14} />
                        <span>5 {t('LabelfilterProdukBintang')}</span>
                    </Bubble>
                </span>
                <span onClick={()=>setFilter('rating', 4)}>
                    <Bubble  classname={`border ${getFilterProductState?.['rating']?.includes(4) || getFilterProductState?.['rating']?.includes("4")?'!border-primary-700 !text-primary-700 !bg-primary-50': '!border-neutral-200 !bg-neutral-200'} !text-sm !text-neutral-900 !font-medium flex items-center gap-2`} >
                        <IconComponent src={'/icons/product-star.svg'} width={14} height={14} />
                        <span>4 {t('LabelfilterProdukBintang')}</span>
                    </Bubble>
                </span>
            </div>
        </EachComponent>

        <ButtonBottomMobile onClickLeft={onClickLeft} onClickRight={onClickRight} textLeft={textLeft?textLeft:'Batal'} textRight={textRight?textRight:'Simpan'} />

    </div>
  )
}

export default FilterScreenProduct

export function EachComponent({children,label,actionButton,labelActionButton,classname}) {
    return (
        <div className={`flex flex-col w-full gap-4 pb-5 border-b border-neutral-400 ${classname}`}>
            <div className='flex w-full justify-between'>
                <span className='text-sm font-semibold text-neutral-900'>{label}</span>
                {(actionButton&&typeof actionButton==='function')&&<span onClick={actionButton} className='text-sm font-semibold text-primary-700'>{labelActionButton}</span>}
            </div>
            {children}
        </div>
    )
}