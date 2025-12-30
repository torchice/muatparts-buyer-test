
'use client';
import { Fragment, useEffect, useRef } from 'react';
import style from './ListOrderCardMobile.module.scss'
import IconComponent from '../IconComponent/IconComponent';
import Image from 'next/image';
import Button from '../Button/Button';
import { numberFormatMoney } from '@/libs/NumberFormat';
import ImageComponent from '../ImageComponent/ImageComponent';

function ListOrderCardMobile({
    nomorInvoice,
    tanggalPesan,
    namaToko,
    namaProduk,
    jumlah,
    totalHarga,
    status,
    statusInfo,
    tanggalJatuhTempo,
    jumlahProdukLain,
    informasiTambahan,
    status_pesanan,
    onClick,
    onClickMenu,
    val
}) {
    const statusTransaction = status_pesanan.find(value=>value.id===val?.transaction?.[0]?.statusBuyer)
    const statusPesanan = val?.transaction?.[0]?.statusInfo
    const threedots = useRef(null)
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0088
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (threedots.current && !threedots.current.contains(event.target)) {
                // setIsOpen(false);
                // setDatepicker(false)
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    return (
        <div className={`${style.main} flex flex-col w-full text-neutral-900 p-4 bg-neutral-50 gap-3`}>
            {/* {statusTransaction?.id!=='Menunggu Pembayaran'?<section className='flex justify-between items-center'>
                <div className='flex flex-col gap-2'>
                    <span className='font-bold text-[10px]'>{val?.transaction?.[0]?.invoiceLink}</span>
                    <span className='font-bold text-[10px]'>{val?.orderDate}</span>
                </div>
                <div className='flex flex-col gap-[2px] select-none cursor-pointer relative' onClick={onClickMenu} ref={threedots}>
                    <span className='w-[5px] h-[5px] rounded-full bg-neutral-700'></span>
                    <span className='w-[5px] h-[5px] rounded-full bg-neutral-700'></span>
                    <span className='w-[5px] h-[5px] rounded-full bg-neutral-700'></span>
                </div>
            </section>:<></>}
            {statusTransaction?.id!=='Menunggu Pembayaran'?<span className='w-full h-[1px] bg-neutral-400'></span>:''} */}
            <section className='flex flex-col gap-3'>
                {
                    val?.transaction?.map((value,i)=>{
                        // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0396
                        const image_data = value?.products[0]?.['photo']&&value?.products[0]?.['photo']?.includes('https')?value?.products[0]?.['photo']:false
                        return (
                            <Fragment key={i}>
                                <div className='flex justify-between items-center'>
                                    <div className='flex flex-col gap-2'>
                                        <span className='font-bold text-[10px]'>{value?.invoiceLink}</span>
                                        <span className='font-bold text-[10px]'>{val?.orderDate}</span>
                                    </div>
                                    <div className='flex flex-col gap-[2px] select-none cursor-pointer relative' onClick={onClickMenu} ref={threedots}>
                                        <span className='w-[5px] h-[5px] rounded-full bg-neutral-700'></span>
                                        <span className='w-[5px] h-[5px] rounded-full bg-neutral-700'></span>
                                        <span className='w-[5px] h-[5px] rounded-full bg-neutral-700'></span>
                                    </div>
                                </div>
                                <span className='w-full h-[1px] bg-neutral-400'></span>
                                <div className='flex gap-[3px]'>
                                    <IconComponent src={'/icons/product-house.svg'} />
                                    <span className='font-semibold text-[10px]'>{value?.storeName}</span>
                                </div>
                                <div className='flex w-full gap-3 items-start pb-3 border-b border-b-neutral-400'>
                                    {image_data?<ImageComponent width={68} height={68} src={image_data} alt='image' className='rounded' />:<span className='w-[68px] h-[68px] border border-neutral-400 rounded'></span>}
                                    <div className='flex flex-col gap-3 w-full'>
                                        <h1 className='bold-sm'>{value?.products?.[0]?.productName}</h1>
                                        <span className='medium-xs'>{value?.invoiceId}</span>
                                        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0395 */}
                                        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0395 */}
                                        {value?.products.length>1&&<span className='medium-xs text-primary-700 select-none leading-[8px]'>{'+'+(value?.products.length-1)} produk lainnya</span>}
                                        <span className={`
                                            py-1 px-2 semi-sm
                                            flex items-center rounded-md justify-center
                                            ${statusPesanan?.bg?`bg-${statusPesanan?.bg}`:''}
                                            ${statusPesanan?.textColor?`text-${statusPesanan?.textColor}`:'text-neutral-900'}
                                            `}>{value?.statusBuyer}</span>
                                    </div>
                                    {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0407 */}
                                    <span className='medium-xs text-neutral-600'>{value?.products?.[0]?.qty?`x${value?.products?.[0]?.qty}`:''}</span>
                                </div>
                            </Fragment>
                        )
                    })
                }
                {val?.transaction?.[0]?.statusInfo?.text&&<div className={`
                    p-3 rounded-md flex flex-col gap-[10px]
                    text-neutral-900 bg-${val?.transaction?.[0]?.statusInfo?.bgLabel}
                    `}>
                        <span className='semi-xs'>{val?.transaction?.[0]?.statusInfo?.text}</span>
                        {val?.transaction?.[0]?.statusInfo?.date&&<span className={`semi-xs text-${val?.transaction?.[0]?.statusInfo?.textColorLabel}`}>{val?.transaction?.[0]?.statusInfo?.date}</span>}
                    </div>}
                <div className='flex flex-col gap-2'>
                    <span className='medium-xs'>Total Pesanan</span>
                    <span className='bold-xs'>{numberFormatMoney(val?.grandTotal)}</span>
                </div>
                {
                    typeof statusTransaction?.action_button==='string'?
                    <Button onClick={()=>onClick(statusTransaction,val)} Class='!w-full !max-w-full'>{statusTransaction?.action_button}</Button>:
                    <div className='w-full gap-2 flex justify-between items-center'>
                        {!val?.transaction?.[0]?.isReview&&<Button onClick={()=>onClick({button:statusTransaction?.action_button?.left},val)} Class='!max-w-full !w-full !h-8' color='primary_secondary'>{statusTransaction?.action_button?.left}</Button>}
                        <Button onClick={()=>onClick({button:statusTransaction?.action_button?.right},val)} Class='!max-w-full !w-full !h-8'>{statusTransaction?.action_button?.right}</Button>
                    </div>
                }
            </section>
        </div>
    );
}

export default ListOrderCardMobile;
  