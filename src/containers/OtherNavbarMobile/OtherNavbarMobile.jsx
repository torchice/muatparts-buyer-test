
'use client';
import Link from 'next/link';
import style from './OtherNavbarMobile.module.scss'
import IconComponent from '@/components/IconComponent/IconComponent';
import CustomLink from '@/components/CustomLink';
import { useCustomRouter } from '@/libs/CustomRoute';
import { useHeader } from '@/common/ResponsiveContext';
import { useLanguage } from '@/context/LanguageContext';
// Improvement Trigger Multibahasa
import BottomSheetMultibahasa from '@/components/DropdownMultibahasa/BottomSheetMultibahasa';
function OtherNavbarMobile() {
    const { t } = useLanguage()
    const menus=[
        {
            icon:'/icons/heart-outline.svg',
            name:t('LabelnavbarResponsiveFavorit'),
            url:'/album'
        },
        {
            icon:'/icons/voucher-outline.svg',
            name:t('LabelnavbarResponsiveVoucher'),
            url:'/voucher/buyer'
        },
        {
            icon:'/icons/list-outline.svg',
            name:t('LabelnavbarResponsiveDaftarPesanan'),
            url:'/daftarpesanan'
        },
        {
            icon:'/icons/ulasan-outline.svg',
            name:t('LabelnavbarResponsiveUlasan'),
            url:'/ulasanbuyer'
        },
        {
            icon:'/icons/warning-outline.svg',
            name:t('LabelnavbarResponsivePengajuanKomplain'),
            url:'/'
        },
        {
            icon:'/icons/asuransi-produk-outline.svg',
            name:t('LabelnavbarResponsiveAsuransiProduk'),
            url:'/'
        },
        {
            icon:'/icons/pusat-bantuan-outline.svg',
            name:t('LabelnavbarResponsivePusatBantuan'),
            url:'/'
        },
    ]
    const {setAppBar}=useHeader()
    const router=useCustomRouter()
    function handleRoute(params) {
        setAppBar({appBarType:'',
            defaultType:'',
            blankBackground:false})
            router.push(params)
    }
    return (
        <ul className={`${style.main} containerMobile list-none !pt-1 bg-neutral-50 `}>
            {
                menus.map(val=><li key={val.name}>
                    <span onClick={()=>handleRoute(val.url)} className={`${style.link} flex gap-2 border-b border-neutral-400 items-center cursor-pointer`}>
                        <IconComponent width={20} height={20} src={val.icon} />
                        <span className='font-semibold text-xs text-neutral-900'>{val.name}</span>
                    </span>
                </li>)
            }
            <li>
                <BottomSheetMultibahasa/>
            </li>
        </ul>
    );
}

export default OtherNavbarMobile;
  