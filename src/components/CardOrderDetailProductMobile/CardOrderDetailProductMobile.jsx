
'use client';
import { numberFormatMoney } from '@/libs/NumberFormat';
import ImageComponent from '../ImageComponent/ImageComponent';
import style from './CardOrderDetailProductMobile.module.scss'
function CardOrderDetailProductMobile({
    id,
    productName,
    photo,
    priceBeforeDiscount,
    priceAfterDiscount,
    discount,
    promoID,
    qty,
    notes,
    salesType,
    haveVariant,
    minPurchase,
    variant,
    subtotal,
    shippingType,
    shippingCostBy,
    assuranceType,
    note,
    onClickNote
}) {
    return (
        <div className={`${style.main} `}>
            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0395  */}
            <div className='flex gap-2 w-full'>
                {photo?<span className='w-[42px] h-[42px]'><ImageComponent width={42} height={42} src={photo} alt={'asd'} className={'w-[42px] h-[42px]'} /></span>:<span className='w-[42px] h-[42px]'></span>}
                <div style={{width:'calc(100% - 50px)'}} className='flex justify-between'>
                    <div className="flex flex-col gap-3 w-[calc(100% - 42px)]">
                        <span className="semi-xs">{productName}</span>
                        {haveVariant&& <span className='text-neutral-700 font-semibold text-[10px]'>{variant?.variantName}</span>}
                        {discount?<div className='flex flex-col gap-2'>
                            <div className='flex gap-1'>
                                <strike className='medium-xs text-[10px]'>{numberFormatMoney(priceBeforeDiscount)}</strike>
                                <span className='p-1 bg-error-400 text-neutral-50 rounded text-[8px] font-semibold'>{discount}% OFF</span>
                            </div>
                            <span className='bold-sm'>{numberFormatMoney(priceAfterDiscount)}</span>
                        </div>:<span className='bold-sm'>{numberFormatMoney(priceAfterDiscount)}</span>}
                        {note?.find(a=>a?.id===id)?.value&&<span className='medium-xs'>Catatan : {note?.find(a=>a?.id===id)?.value}</span>}
                        <span className='medium-xs text-primary-700 cursor-pointer' onClick={()=>onClickNote(id)}>{note?.find(a=>a?.id===id)?.value?'Ubah Catatan':'Tambah Catatan'}</span>
                    </div>
                    {qty>1&&<span className='medium-xs text-neutral-600'>x{qty}</span>}
                </div>
            </div>
        </div>
    );
}

export default CardOrderDetailProductMobile;
  