
'use client';
import style from './AddressCardMobile.module.scss'
import Button from '@/components/Button/Button';
import { useState } from 'react';
import AddAddressContainerMobile from '../AddAddressContainerMobile/AddAddressContainerMobile';
import { addManagementLocationZustand, userLocationZustan } from '@/store/manageLocation/managementLocationZustand';
import { useLanguage } from '@/context/LanguageContext';
function AddressCardMobile({
    classname,
    primary,
    isMain,
    ID,
    name,
    pic,
    nomor,
    address,
    detailAddress,
    onChoose,
    value={},
    mutate,
    onChange,
    onAddAddress,
    isMultiple
}) {
    const { t } = useLanguage()
    const [getMenu,setMenu]=useState('list_address')
    const [getData,setData]=useState()
    const {locations,setSelectedLocation} =userLocationZustan()
    const {setAllState} = addManagementLocationZustand()
    function handleUbah() {
        if(typeof onChange==='function'){
            onChange(value)
        }else{
            setData(value)
            setAllState(value)
        }
    }
    function handleChoose() {
        if(typeof onChoose==='function'){
            onChoose(ID)
        }else setSelectedLocation(locations?.find(a=>a.ID==ID))
    }
    if(getMenu==='add_address') return <AddAddressContainerMobile state={getData} />
    return (
        <div className={`${style.main} py-3 px-4 w-full flex flex-col gap-3 text-neutral-900 ${primary?'bg-primary-50':'bg-neutral-50'} ${classname}`}>
            {/* nama label alamat */}
            <div className='flex gap-2 items-center'>
                <span className='bold-xs line-clamp-1'>{name}</span>
                {isMain?<span className='semi-xs text-primary-50 bg-primary-700 p-1 rounded'>{t('LabelnavbarResponsiveUtama')}</span>:''}
            </div>
            {/* nama & nomor */}
            <span className='flex medium-xs'>{pic+` (${nomor})`}</span>
            {/* alamat */}
            <span className='flex medium-xs'>{address}</span>
            {/* detail alamat */}
            <span className='flex medium-xs'>{detailAddress}</span>
            <div className='flex items-center justify-between'>
                <Button onClick={handleUbah} Class='!w-[160px] max-w-none h-7' color='primary_secondary' >{t('LabelnavbarResponsiveUbah')}</Button>
                <Button onClick={handleChoose} Class='!w-[160px] max-w-none h-7' color='primary_secondary' disabled={primary}>{primary?t('LabelnavbarResponsiveTerpilih'):t('LabelnavbarResponsivePilih')}</Button>
            </div>
        </div>
    );
}

export default AddressCardMobile;
  