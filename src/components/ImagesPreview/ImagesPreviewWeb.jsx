import { Fragment, useEffect, useState } from "react"
import IconComponent from "../IconComponent/IconComponent"
import styles from "./ImagesPreview.module.scss"
import ReactPlayer from "react-player"
import { generateThumbnail } from "@/libs/services"
import ImageComponent from "../ImageComponent/ImageComponent"

const ImagesPreviewWeb = ({
    images,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex
}) => {
    const [play,setPlay]=useState(false)
    const arrowButtons = [
        {
            src: "/icons/chevron-left.svg",
            onClick: () => {
                if (activeIndex === 0) {
                    setActiveIndex(images.length - 1)
                } else {
                    setActiveIndex(prevState => prevState - 1)
                }
            }
        },
        {
            src: "/icons/chevron-right.svg",
            onClick: () => {
                if (activeIndex === images.length - 1) {
                    setActiveIndex(0)
                } else {
                    setActiveIndex(prevState => prevState + 1)
                }
            }
        },
    ]
    useEffect(()=>{
        if(!isOpen) setPlay(isOpen)
        return ()=>setPlay(false)
    },[isOpen])
    return (
        <div className={`fixed inset-0 z-[90] -top-[15px] flex items-center justify-center ${!isOpen ? "hidden" : "block"}`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50"
            />
            {/* Modal */}
            <div className="relative bg-white rounded-xl px-6 pt-8 pb-3 flex flex-col gap-y-3 items-center">
                <button
                    className='absolute top-[8px] right-[8px]'
                    onClick={() => setIsOpen(false)}
                >
                    <IconComponent
                        classname={styles.icon_primary}
                        src="/icons/silang.svg"
                        width={12.5}
                        height={12.5}
                    />
                </button>
                <div className="absolute top-1/2 -translate-y-1/2 px-3 w-full flex justify-between z-[1]">
                    {arrowButtons.map((button, key) => (
                        <div
                            className="bg-neutral-50 p-1 shadow-muat rounded-3xl cursor-pointer flex items-center justify-center"
                            key={key}
                            onClick={button.onClick}
                        >
                            <IconComponent
                                src={button.src}
                                size="medium"
                            />
                        </div>
                    ))}
                </div>
                {
                    images[activeIndex]?.includes('youtube.com') || images[activeIndex]?.includes('youtu.be')?
                    <ReactPlayer url={images[activeIndex]} width={544} height={306} playing={play} muted onPause={()=>setPlay(false)} />
                    :<img
                        src={images[activeIndex]}
                        alt="active-review"
                        className="w-[544px] h-[306px] object-contain rounded-[9px] relative select-none bg-neutral-900"
                        />
                }
                <div className="flex gap-x-4 items-center">
                    {images.map((image, key) => (
                        <Fragment key={key}>
                            {
                                image?.includes('youtube.com')||image?.includes('youtu.be')?
                                <ReactPlayer url={images[activeIndex]} width={56} height={56} playing={play} muted onPause={()=>setPlay(false)} />
                                :
                                <ImageComponent
                                    width={56} 
                                    height={56}
                                    src={image?.includes('youtube.com')||image?.includes('youtu.be')?generateThumbnail(image):image}
                                    alt="review"
                                    // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0155
                                    className={`
                                        size-14 rounded-md hover:border-2 hover:border-primary-700 cursor-pointer select-none
                                        ${activeIndex === key ? "border-2 border-primary-700" : "border-2 border-neutral-400"}
                                    `}
                                    onClick={() => setActiveIndex(key)}
                                />
                            }
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ImagesPreviewWeb