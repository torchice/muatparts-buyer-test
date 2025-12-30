import IconComponent from '@/components/IconComponent/IconComponent'
import style from './HeaderMobile.module.scss' 
import Image from 'next/image'
import ImageComponent from '@/components/ImageComponent/ImageComponent'
const HeaderMobile = ({
    onBack,
    title,
    children
})=>{ 
    return ( 
        <div className={style.main}>
            <div className='relative w-full h-full flex items-center'>
            {
                children?children:
                <div className='flex items-end gap-2 '>
                    <span className='w-6 h-6 rounded-full bg-white flex justify-center items-center cursor-pointer' onClick={onBack}>
                        <IconComponent src='/icons/chevron-left.svg' classname={style.icon} />
                    </span>
                    <span className='text-neutral-50 text-base font-bold'>{title}</span>
                </div>
            }
            <ImageComponent src={'/img/fallinstartheader.png'} width={153} height={62} className='absolute -right-4 -top-4' alt="Next.js logo" />
            </div>
        </div> 
    ) 
}
export default HeaderMobile