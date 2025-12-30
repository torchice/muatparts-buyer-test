import Image from "next/image"
import { Fragment } from "react"
import IconComponent from "../IconComponent/IconComponent"
import styles from "./ImagesPreview.module.scss"
import ReactPlayer from "react-player"

const ImagesPreviewResponsive = ({
    images,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    full=false
}) => {
    if (!isOpen) {
        return null
    }

    return (
        <div className={`${full?'fixed':'absolute'} top-0 left-0 right-0 bottom-0 bg-neutral-900 z-[90] overflow-y-auto min-h-screen`}>
            <div 
                className="absolute left-4 top-4 z-[1] cursor-pointer"
                onClick={() => setIsOpen(false)}
            >   
                <IconComponent
                    classname={styles.icon_white}
                    src="/icons/silang.svg"
                    size="medium"
                />
            </div>
            <div className="min-h-[725px] flex flex-col justify-between bg-neutral-900 pb-12">
                {
                    images[activeIndex]?.includes('youtube.com') || images[activeIndex]?.includes('youtu.be')?
                    <ReactPlayer url={images[activeIndex]} width={360} height={553} stopOnUnmount playing={false} />
                    :<img
                    src={images[activeIndex]}
                    alt="active-review"
                    className="w-[360px] h-[553px] object-contain rounded-[9px] relative select-none bg-neutral-900 mx-auto"
                />
                }
                
                <div className={`pl-4 overflow-x-auto ${styles.images_container}`}>
                    <div className="flex flex-nowrap items-center gap-x-2.5 py-4">
                        {images.map((image, key) => (
                            <div
                                className={`flex-shrink-0 rounded-[4px] hover:border-4 hover:border-[#C22716]
                                    ${activeIndex === key ? "border-4 border-[#C22716]" : ""}
                                `}
                                key={key}
                            >
                                {
                                    image?.includes('youtube.com') || image?.includes('youtu.be')?
                                    <ReactPlayer url={image} width={80} height={80} stopOnUnmount playing={false} />
                                    :<img
                                    src={image}
                                    alt="review"
                                    className="w-20 h-20 rounded-[4px] cursor-pointer select-none object-cover"
                                    onClick={() => setActiveIndex(key)}
                                />
                                }
                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImagesPreviewResponsive