
'use client';
import Image from 'next/image';
import style from './GlobalLoading.module.scss'
import { headerProps } from '@/containers/HeaderContainer/headerProps';
function GlobalLoading() {
    const { headerHeight } = headerProps();
    return <div style={{top:headerHeight+'px',height:`calc(100vh - ${headerHeight}px)`}} className='fixed flex w-full justify-center items-center bg-transparent backdrop-blur-md left-0 z-[95]'>
        <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE+'/img/loading_animation.webp'} className={style.image} width={300} height={300} alt='loading' />
    </div>
}

export default GlobalLoading;
  