
'use client';
import Image from 'next/image';
import style from './ImageDetailProductSlider.module.scss'
import { useEffect, useMemo, useRef, useState } from 'react';
import IconComponent from '../IconComponent/IconComponent';
import { generateThumbnail } from '@/libs/services';
import ReactPlayer from 'react-player';
import ImageComponent from '../ImageComponent/ImageComponent';
import Slider from 'react-slick';
import './ImageDetailProductSlider.scss'
import ModalComponent from '../Modals/ModalComponent';
import ImagesPreview from '../ImagesPreview/ImagesPreview';
function ImageDetailProductSlider({images=[]}) {
    const imgRef=useRef(null)
    const [initSlide,setInitSlide]=useState(0)
    const [getImages,setImages]=useState([])
    const [getImagesModal,setImagesModal]=useState([])
    const [selected,setSelected]=useState('')
    const [selectedModal,setSelectedModal]=useState()
    const [showModal,setShowModal]=useState(false)
    const [play,setPlay]=useState(false)
    const PrevArrow = (prop)=>{
        if(images.length<6) return<></>
        return <span onClick={prop?.onClick} style={{left:'-9px',top:'16px'}} className={style.shadow+' absolute w-6 h-6 rounded-full bg-neutral-50 grid place-content-center cursor-pointer z-20'}>
        <ImageComponent width={16} height={16} alt='arrow' src={'/icons/chevron-left.svg'} />
    </span>
    }
    const NextArrow = (prop)=>{
        if(images.length<6) return<></>
        return <span onClick={prop?.onClick} style={{right:'-9px',top:'16px'}} className={style.shadow+' absolute w-6 h-6 rounded-full bg-neutral-50 grid place-content-center cursor-pointer'}>
        <ImageComponent width={16} height={16} alt='arrow' src={'/icons/chevron-right.svg'} />
    </span>
    }
    useEffect(()=>{
        if (images?.length) {
            setImages(images)
            setImagesModal(images)
            setSelected(0)
            setSelectedModal(0)
        }
    },[images])
    return (
        <div style={{width:'350px'}} className={`${style.main} flex flex-col gap-2 h-auto`}>
            <ImagesPreview  images={getImagesModal} isOpen={showModal} setIsOpen={()=>setShowModal(false)} activeIndex={selected} setActiveIndex={setSelected} />

            <div className={`w-full h-[350px] rounded-md overflow-hidden select-none relative ${getImages?.[selected]?.includes('youtube.com')||getImages?.[selected]?.includes('youtu.be')?'':'cursor-pointer'} border border-neutral-400 relative`} onClick={(e)=>{
                e.stopPropagation()
                setShowModal(true)}}>
                {
                    getImages?.[selected]?.includes('youtube.com')||getImages?.[selected]?.includes('youtu.be')&&play?
                    <>
                    {/* LBM */}
                    {/* 25. 07 - QC Plan - Web Apps - Marketing Muatparts - LB - 0004 */}
                    <div className=' w-full h-full absolute z-50 cursor-pointer'>
                    </div>
                    <ReactPlayer url={getImages?.[selected]} width={350} height={350} playing={false}  />
                    </>
                    :<Image src={getImages?.[selected]?.includes('youtube.com')||getImages?.[selected]?.includes('youtu.be')?generateThumbnail(getImages?.[selected]):getImages?.[selected]} width={350} height={350} alt='image' className='h-full w-full object-contain' />
                }
                {
                    (getImages?.[selected]?.includes('youtube.com')||getImages?.[selected]?.includes('youtu.be')&&!play)&&<span onClick={(e)=>{
                        e.stopPropagation()
                    }} style={{top:'calc(50% - 24px)',left:'calc(50% - 24px)'}} className='w-12 h-12 absolute rounded-full bg-neutral-50 grid place-content-center cursor-pointer'><IconComponent src={'/icons/play.svg'} /></span>
                }
            </div>
            <div className='relative ' >
                <Slider
                    dots={false}
                    infinite={false}
                    speed={500}
                    initialSlide={initSlide}
                    slidesToShow={getImages.length>6?6:getImages.length}
                    slidesToScroll={1}
                    className={'slickContainer'}
                    focusOnSelect
                    draggable={false}
                    arrows
                    nextArrow={<NextArrow/>}
                    prevArrow={<PrevArrow/>}
                 >
                    {
                        getImages?.map((val,index)=>{
                            if(val?.includes('youtube.com')||val?.includes('youtu.be')) console.log('gmbn : ',generateThumbnail(val))
                            return (
                                <div key={index} className={`w-14 h-14 rounded-md border ${index===selected?'border-primary-700':'border-neutral-400'} overflow-hidden select-none cursor-pointer`} onClick={()=>setSelected(index)}>
                                    {val?.includes('youtube.com')||val?.includes('youtu.be')?<ReactPlayer url={getImages?.[selected]} width={56} height={56} stopOnUnmount playing={false} />:val?
                                        <ImageComponent src={val} width={56} height={56} alt='ch' className='h-full w-full object-contain' />:''
                                    }
                                </div>
                            )
                        })
                    }
                </Slider>
            </div>
        </div>
    );
}

export default ImageDetailProductSlider;
  