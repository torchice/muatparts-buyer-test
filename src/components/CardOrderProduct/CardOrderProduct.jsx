
'use client';
import Image from 'next/image';
import style from './CardOrderProduct.module.scss'
import { numberFormatMoney } from '@/libs/NumberFormat';
import ImageComponent from '../ImageComponent/ImageComponent';
import { useLanguage } from '@/context/LanguageContext';
function CardOrderProduct({
    classname,
    image,
    name,
    description,
    quantity,
    beforePrice,
    afterPrice,
    discount,
    catatan,
    children
}) {
    console.log(image)
    const {t}=useLanguage()
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0773
    return (
        <div className={`${style.main} flex gap-[10px] items-start text-neutral-900 bg-neutral-50 ${classname}`}>
            {(image&&image.includes('https'))?<ImageComponent src={`${image}`} width={42} height={42} alt={name} />:<span className='w-[42px] h-[42px] border border-neutral-400'> </span>}
            <div className='w-full flex flex-col gap-3'>
                <h1 className='semi-xs'>{name}</h1>
                {description&&<p className='font-semibold text-[10px] text-neutral-700'>{description}</p>}
                {  
                discount?<div className='flex flex-col gap-2'>
                        <span className='flex gap-'>
                            <strike className="font-medium text-[10px] text-neutral-700">{numberFormatMoney(beforePrice)}</strike>
                            <span className='font-semibold text-[8px] text-neutral-50 bg-error-400 px-1 rounded flex items-center'>{discount} OFF</span>
                        </span>
                        <p className='bold-sm'>{numberFormatMoney(afterPrice)}</p>
                    </div>:''
                }
                {!discount&&<p className='bold-sm'>{numberFormatMoney(afterPrice)}</p>}
                {catatan&&<span className='medium-xs'>{t('LelangMuatBuatHargaTransportLabelTitleCatatan')} : {catatan}</span>}
                {children}
            </div>
            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0430 */}
            {quantity&&<span className='medium-xs text-neutral-600'>x{quantity}</span>}
        </div>
    );
}

export default CardOrderProduct;
  