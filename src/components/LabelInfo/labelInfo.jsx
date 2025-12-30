import Image from "next/image";

import warningOrange from './assets/warningOrange.svg';

export default function LabelInfo({text}){

    return (
        <div className='flex items-center bg-[#FFF9C1] w-[328px] px-[12px] py-[8px] gap-[10px] rounded-[6px]'>
            <Image src={warningOrange}/>
            <span className='text-black leading-[14.4px] text-[12px] font-[500]'>
                {text}
            </span>
        </div>
    )
}