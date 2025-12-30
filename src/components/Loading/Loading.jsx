'use client'
import Image from 'next/image';
import loadingIcon from './assets/loading_animation.webp';
import useLoadingStore from '@/store/zustand/loading';

export default function Loading(){

    const { showLoading } = useLoadingStore();

    return(
        <div className={`absolute z-[1000] w-full min-h-screen left-0 top-0 bottom-0 bg-[black] bg-opacity-20 ${showLoading ? 'flex' : 'hidden'}`}>
            <div className={'sticky top-0 bottom-0 w-full h-screen flex items-center justify-center'}>
                <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE+loadingIcon}/>
            </div>
        </div>
    )
}