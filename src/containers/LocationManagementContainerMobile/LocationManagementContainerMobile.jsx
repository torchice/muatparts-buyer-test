import IconComponent from '@/components/IconComponent/IconComponent';
import style from './LocationManagementContainerMobile.module.scss'
import { useEffect, useState } from 'react';
import { useHeader } from '@/common/ResponsiveContext';
import debounce from '@/libs/debounce';
import SWRHandler from '@/services/useSWRHook';
import { sortMainAddressOnTop } from '@/libs/services';
import { addManagementLocationZustand } from '@/store/manageLocation/managementLocationZustand';
import { hightlightText } from '@/libs/TypographServices';
import DataNotFound from '@/components/DataNotFound/DataNotFound';
import { useLanguage } from '@/context/LanguageContext';
function LocationManagementContainerMobile({listLocations,listSavedLocations,onSelect,onClickVieManloc,onAddLocation}) {
    const {
        appBarType, //pilih salah satu : 'header_title_secondary' || 'header_search_secondary' || 'default_search_navbar_mobile' || 'header_search' || 'header_title'
        appBar, // muncul ini : {onBack:null,title:'',showBackButton:true,appBarType:'',appBar:null,header:null}
        renderAppBarMobile, // untuk render komponen header mobile dengan memasukkanya ke useEffect atau by trigger function / closer
        setAppBar, // tambahkan payload seperti ini setAppBar({onBack:()=>setScreen('namaScreen'),title:'Title header',appBarType:'type'})
        handleBack, // dipanggil di dalam button di luar header, guna untuk kembali ke screen sebelumnya 
        clearScreen,// reset appBar
        setScreen, // set screen
        screen, // get screen,
        search, // {placeholder:'muatparts',value:'',type:'text'}
        setSearch, // tambahkan payload seperti ini {placeholder:'Pencarian',value:'',type:'text'}
      }=useHeader()
    const { t } = useLanguage()
    const add_management_location=addManagementLocationZustand()
    const [searchLoacation,setSearchLocation]=useState('')
    const [getListAlamat,setListAlamat]=useState([])
    function onSelectKodePos(data) {
        add_management_location?.setAllState({
            ...add_management_location,
            Province:data?.ProvinceName,
            ProvinceID:data?.ProvinceID,
            City:data?.CityName,
            CityID:data?.CityID,
            District:data?.DistrictName,
            DistrictID:data?.DistrictID,
            PostalCode:data?.PostalCode,
        })
        onSelect?.({
            ...add_management_location,
            Province:data?.ProvinceName,
            ProvinceID:data?.ProvinceID,
            City:data?.CityName,
            CityID:data?.CityID,
            District:data?.DistrictName,
            DistrictID:data?.DistrictID,
            PostalCode:data?.PostalCode,
        })
            
    }
    function onShowManloc(){
        // onClickVieManloc wajib memanggil setAppBar di parent container, better setScreen dan setAppBar di useEffect parent untuk better peformance
        if(typeof onClickVieManloc==='function') onClickVieManloc()
    }
    function onAdd(){
        onAddLocation?.()
    }
    const {useSWRMutateHook,useSWRHook}= SWRHandler()
    
    const {trigger}=useSWRMutateHook(process.env.NEXT_PUBLIC_GLOBAL_API+'v1/autocompleteStreetLocal')
    
    useEffect(()=>{
        if(search?.value) {
            trigger({phrase:search?.value})
            .then(data=>{
                let list = data?.data?.Data?.data?.Data
                setListAlamat(list)
            })
        }
    },[search])
    useEffect(()=>{
        setSearch({onSubmitForm:true})
        // if(search?.value) {
        //     setSearchLocation(search?.value)
        //     // autoComplete({phrase:search?.value}).then(a=>console.log(a))
        // }
    },[])
    
    return (
        <div className={`${style.main} flex flex-col py-5 px-4 gap-5 text-neutral-700 h-screen bg-neutral-50`}>
            {/* <div className='flex gap-3 items-center pb-5 border-b border-gray-400'>
                <IconComponent src={'/icons/pilih-lokasi-blue.svg'} width={24} height={24} />
                <span className='semi-sm text-primary-700'>t('LabelnavbarResponsivePilih') Lokasi</span>
            </div> */}
            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0268 */}
            {getListAlamat?.length==0&&
                search?.value.length>0&&(
                <DataNotFound title={t('LabelnavbarResponsiveAlamatTidakDitemukan')} />
            )}
            {getListAlamat?.length?<div className='flex flex-col gap-4 border-b border-gray-400 pb-4'>
                    {/* <span className='bold-sm'>Hasil Pencarian</span> */}
                    <ul className='list-none flex flex-col gap-3'>
                        {
                            getListAlamat?.map(val=>{
                                return (<li>
                                <div className='flex w-full' onClick={()=>onSelectKodePos(val)}>
                                    {/* <div className='flex gap-2 items-start' onClick={()=>onSelectLocation(val)}>
                                        <span className='w-6 h-6'>
                                            <IconComponent src={'/icons/marker-outline.svg'} width={24} height={24} />
                                        </span> */}
                                        <span className='medium-sm line-clamp-2 text-neutral-900' dangerouslySetInnerHTML={{__html:hightlightText(search?.value,val?.Description)}}></span>
                                    {/* </div>
                                    <span onClick={()=>onSaveLocation()}>
                                        <IconComponent src={'/icons/bookmark-outline.svg'} width={24} height={24} />
                                    </span> */}
                                </div>
                            </li>
                            )})
                        }
                    </ul>
                    {/* <div className='flex items-center py-2 px-3 gap-[10px] text-primary-700 border border-primary-700 rounded-[3px]'>
                        <IconComponent src={'/icons/Info.svg'} classname={style.iconBlue}/>
                        <span className='semi-xs'>Input Lokasi yang terdekat dengan Anda</span>
                    </div> */}
                </div>
            :''}
            {/* {locationManagement?.Data?.length?<div className='flex flex-col gap-4 pb-4'>
                <span className='bold-sm'>Manajemen Lokasi</span>
                <ul className='list-none flex flex-col gap-3'>
                    {sortMainAddressOnTop(locationManagement?.Data)?.map(val=>{
                        return (<li>
                        <div className='flex justify-between items-start'>
                            <div className='flex gap-2 items-start' onClick={()=>onSelectLocation()}>
                                <span className='w-6'>
                                    <IconComponent src={'/icons/map-location.svg'} width={24} height={24} />
                                </span>
                                <div className='flex flex-col '>
                                    <span className='semi-sm text-neutral-900 line-clamp-1'>{val?.Address}</span>
                                    <span className='semi-xs'>{val?.AddressDetail}</span>
                                </div>
                            </div>
                            <div className='flex gap-2 items-center'>
                                {val?.IsMainAddress?<span className='bg-primary-700 py-1 px-2 rounded-md text-neutral-50 semi-sm'>t('LabelnavbarResponsiveUtama')</span>:''}
                                <span onClick={()=>onEditLocation()}>
                                    <IconComponent src={'/icons/edit.svg'} width={24} height={24} />
                                </span>
                            </div>
                        </div>
                    </li>)})}
                </ul>
                {locationManagement?.Data?.length>3?<span className='text-primary-700 semi-xs text-end' onClick={onShowManloc}>Lihat Manajemen Lokasi</span>:''}
            </div>:''} */}
        </div>
    );
}

export default LocationManagementContainerMobile;
  