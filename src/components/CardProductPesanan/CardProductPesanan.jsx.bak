
'use client';
import Image from 'next/image';
import style from './CardProductPesanan.module.scss'
import { numberFormatMoney } from '@/libs/NumberFormat';
function CardProductPesanan({
    classname,
    image,
    name,
    varian,
    quantity,
    beforePrice,
    afterPrice,
    discount,
    catatan,
    children
}) {
    return (
        <div className={`${style.main} flex gap-[10px] items-start text-neutral-900 ${classname}`}>
            <Image src={`${image?image:'/img/chopper.png'}`} width={42} height={42} alt={name} />
            <div className='w-full flex flex-col gap-3'>
                <h1 className='semi-xs'>{name}</h1>
                <p className='font-semibold text-[10px] text-neutral-700'>{varian}</p>
                {
                discount&&<div className='flex flex-col gap-2'>
                        <span className='flex gap-'>
                            <strike className="font-medium text-[10px] text-neutral-700">{beforePrice}</strike>
                            <span className='font-semibold text-[8px] text-neutral-50 bg-error-400 px-1 rounded flex items-center'>{discount} OFF</span>
                        </span>
                        <p className='bold-sm'>{numberFormatMoney(afterPrice)}</p>
                    </div>
                }
                {!discount&&<p className='bold-sm'>{numberFormatMoney(afterPrice)}</p>}
                {catatan&&<span className='medium-xs'>Catatan : {catatan}</span>}
                {children}
            </div>
            {quantity>1&&<span className='medium-xs text-neutral-600'>x{quantity}</span>}
        </div>
    );
}

export default CardProductPesanan;
  