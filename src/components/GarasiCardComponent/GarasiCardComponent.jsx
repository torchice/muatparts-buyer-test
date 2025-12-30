'use client';
import Image from 'next/image';
import style from './GarasiCardComponent.module.scss'
import IconComponent from '../IconComponent/IconComponent';
import { numberFormatMoney } from '@/libs/NumberFormat';
import { useCustomRouter } from '@/libs/CustomRoute';
import { viewport } from '@/store/viewport';

function GarasiCardComponent({
    ID,Logo,Name,IsOnline,VehicleBrands,Products,City,Rating,soldCount
}) {
    const router = useCustomRouter()
    const {isMobile}=viewport()
    return (
        <div className={`${style.main} py-4 px-3 rounded-md gap-2 h-fit border border-neutral-400 flex flex-col`}>
            <div className='flex justify-between items-start'>
                <div className='flex gap-3 items-start cursor-pointer' onClick={()=>router.push(`seller/${ID}`)}>
                    <div className='w-10 h-10 rounded-full overflow-hidden object-cover'>
                        {Logo?<Image src={Logo?Logo:'/img/chopper.png'} width={40} height={40} alt={Name} />:<span className='w-10 h-10 border border-neutral-400 rounded-full'></span>}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='font-bold text-neutral-900 text-xs'>{Name}</p>
                        {IsOnline&&<p className='font-medium text-xs text-neutral-700'>Online</p>}
                        <div className={style.truckMobile+' flex gap-1 items-center'}>
                            <Image width={16} height={16} src={'/icons/mini-truck.svg'} alt='truck' />
                            <p className='font-medium text-xs text-neutral-700'>{VehicleBrands}</p>
                        </div>
                    </div>
                </div>
                <span>
                    <IconComponent src={'/icons/three-dots.svg'} />
                </span>
            </div>
            <div className='flex gap-2'>
                {
                    Products?.slice(0,isMobile?3:4)?.map((val,i)=>{
                        return(
                            <div key={i} className='rounded-md overflow-hidden flex flex-col border border-neutral-400 bg-neutral-50 w-[100px]'>
                                <div className='w-full h-[100px]'>
                                    <Image src={val?.Photo?val?.Photo:'/img/chopper.png'} width={96} height={96} className='w-full h-full object-none' alt={Name} />
                                </div>
                                <div className='py-3 px-2 text-[10px] font-medium'>
                                    {
                                        numberFormatMoney(val?.Price)
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className='flex gap-3 items-center'>
                <div className='flex gap-1 items-center'>
                    <Image src={'/icons/product-marker.svg'} width={16} height={16} alt='City' />
                    <span className='text-neutral-700 font-medium text-[12px]'>{City}</span>
                </div>
                <div className='flex gap-1 items-center'>
                    <Image src={'/icons/product-star.svg'} width={16} height={16} alt='star' />
                    <span className='text-neutral-700 font-medium text-[12px]'>{Rating} &#183; Terjual {soldCount}</span>
                </div>
                <div className={style.truckWeb+' flex gap-1 items-center'}>
                    <Image width={16} height={16} src={'/icons/mini-truck.svg'} alt='truck' />
                    <p className='font-medium text-xs text-neutral-700'>{VehicleBrands}</p>
                </div>
            </div>
        </div>
    );
}

export default GarasiCardComponent;
  