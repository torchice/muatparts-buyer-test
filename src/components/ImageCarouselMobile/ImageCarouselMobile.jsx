import Image from 'next/image';
import React, { useState } from 'react';
import Slider from 'react-slick';
import ModalComponent from '../Modals/ModalComponent';
import IconComponent from '../IconComponent/IconComponent';
import ImageComponent from '../ImageComponent/ImageComponent';
import { generateThumbnail } from '@/libs/services';
import ImagesPreview from '../ImagesPreview/ImagesPreview';

function ImageCarouselMobile({ images, width = '100%', height = '360px', onIndex,hideIndikator=false,onClick }) {
    const [slideIndex, setSlideIndex] = useState(0);
    const [updateCount, setUpdateCount] = useState(0);
    const [show,setShow]=useState(false)
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: () => setUpdateCount(updateCount + 1),
        beforeChange: (current, next) => setSlideIndex(next),
    };
    const settings2 = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div style={{ width: width, height: height }} className="relative">
            <ImagesPreview full images={images} isOpen={show} setIsOpen={()=>setShow(false)} activeIndex={slideIndex} setActiveIndex={setSlideIndex} />
            {/* <ModalComponent classname={'bg-black'} classnameContent={'!h-full !m-0 !p-0 '} full isOpen={show} setClose={()=>setShow(false)} hideHeader showButtonClose={false} bgTransparent preventAreaClose >
                <span className='absolute top-4 left-4' onClick={()=>setShow(false)}><IconComponent src={'/icons/closes.svg'} classname={'icon-white'} /></span>
                <Slider {...settings2} arrows={false} className='mt-[25%]'>
                    {images?.map((val, index) => (
                    <div key={index} className="w-full h-full">
                        <div className="relative w-full" style={{ height }}>
                        <ImageComponent
                            src={val}
                            alt={`${index}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                        </div>
                    </div>
                    ))}
                </Slider>
            </ModalComponent> */}
            <Slider {...settings} arrows={false}>
                {images?.map((val, index) => (
                <div key={index} className="w-full h-full" onClick={()=>{
                    setShow(true)
                    onClick({img:val,index:slideIndex})
                    }}>
                    <div className="relative w-full" style={{ height }}>
                    {
                        val?.includes('youtube.com')||val?.includes('youtu.be')?
                        <img
                            src={generateThumbnail(val)}
                            alt={`Slide ${index}`}
                            className="object-contain w-full h-full"
                        />
                        :<ImageComponent
                            src={val}
                            alt={`Slide ${index}`}
                            fill
                            className="object-contain"
                        />
                    }
                    
                    </div>
                </div>
                ))}
            </Slider>
            {!hideIndikator?<span style={{left:'calc(50% - 16px)'}} className='bg-neutral-900 rounded-[10px] px-2 py-1 semi-xs text-neutral-50 absolute bottom-3'>{slideIndex+1}/{images?.length}</span>:''}
        </div>
    );
}

export default ImageCarouselMobile;
