'use client';
import Image from 'next/image';
import style from './TrackOrderMobile.module.scss'
import ModalComponent from '@/components/Modals/ModalComponent';
import { useState } from 'react';
import IconComponent from '@/components/IconComponent/IconComponent';
import ImageComponent from '@/components/ImageComponent/ImageComponent';
import { convertDate } from '@/libs/DateFormat';
const dummy=[
    {
        status:'Pengembalian Dana Berhasil',
        timestamp:'26 Jan 2024 11:51 WIB',
        description:'(Pengembalian Dana berhasil pada Date_pengembalian_dana)'
    },
    {
        status:'Pengembalian Dana Berhasil',
        timestamp:'26 Jan 2024 11:51 WIB',
        description:'(Pengembalian Dana berhasil pada Date_pengembalian_dana)',
        proofUrl:['/img/chopper.png']
    },
    {
        status:'Pengembalian Dana Berhasil',
        timestamp:'26 Jan 2024 11:51 WIB',
        description:'(Pengembalian Dana berhasil pada Date_pengembalian_dana)'
    },
    {
        status:'Pengembalian Dana Berhasil',
        timestamp:'26 Jan 2024 11:51 WIB',
        description:'(Pengembalian Dana berhasil pada Date_pengembalian_dana)'
    },
]
function TrackOrderMobile({data}) {
    const [getImage,setImage]=useState([])
    return (
        <div className={`${style.main} py-6 px-4 flex-col`}>
            <ModalComponent classname={'bg-black'} classnameContent={'!h-full !m-0 !p-0'} full isOpen={getImage?.length} setClose={()=>{
                setImage([])}
                } hideHeader showButtonClose={false} bgTransparent preventAreaClose >
                <div className='flex flex-col relative h-full'>
                    <ImageComponent src={getImage?.[0]} width={360} height={500} alt='view' className='w-full h-full object-contain' />
                    <span onClick={()=>{
                        setImage([])
                    }} className='grid place-content-center w-6 h-6 bg-neutral-50 rounded-full absolute top-4 left-6'><IconComponent src={'/icons/chevron-left.svg'} classname={'icon-error-400'} /></span>
                    <span style={{left:'calc(50% - 25px)'}} className='bg-black absolute w-12 top-4 py-1 px-3 rounded-3xl text-neutral-50 bold-xs'>
                        1/{getImage.length}
                    </span>
                    {/* <div className='py-6 px-4 bg-black text-neutral-50 semi-xs'>
                        {getDesc}
                    </div> */}
                </div>

            </ModalComponent>
            {
                data?.map((val,i)=>{
                    return(
                        <div className='flex relative' key={i}>
                            {i<data.length-1&&<div className='absolute left-0 w-[9px] h-full border-r-2 border-neutral-400 border-dotted'></div>}
                            <div className='flex items-start gap-3 pb-[20px]'>
                                <div className='bg-transparent z-10'>
                                    <div className={`border-[5px] ${i==0?'border-muat-parts-non-800':'border-neutral-700'} rounded-full grid place-content-center`}>
                                        <span className='bg-neutral-50 w-[6px] h-[6px] rounded-full'></span>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <span className={`semi-xs ${i==0?'text-primary-700':'text-neutral-900'}`}>{val?.status}</span>
                                    <span className={`medium-xs text-neutral-600`}>{convertDate(val?.timestamp)}</span>
                                    <span className={`medium-xs text-neutral-600`}>{val.description}</span>
                                    {
                                        val?.proofUrl&&
                                        <div className='p-2 rounded-md border border-neutral-400 flex gap-[10px] items-center '>
                                            <ImageComponent width={32} height={32} alt={val.status} src={val?.proofUrl?.[0]} className='rounded' />
                                            <span onClick={()=>{
                                                setImage(val.proofUrl)
                                            }} className='text-primary-700 medium-xs select-none'>Lihat Bukti Pengiriman</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default TrackOrderMobile;
  