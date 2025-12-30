
'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import style from './CarouselScrollComponent.module.scss'
import IconComponent from '../IconComponent/IconComponent'
function CarouselScrollComponent({
    children,
    className,
    classNameContent,
    scrollAmount = 200,
    buttonSize = 40,
    hideButtons = false, // Set true if you want to auto-hide buttons when not needed
    fixedButtons = false, // Set true if you want buttons to be always visible (fixed position)
    smoothScroll = true, // Toggle smooth scrolling
    iconLeft,
    renderIconLeft,
    iconRight,
    renderIconRight,
    isArrowAbsolute
}) {
    const scrollRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const checkScroll = useCallback(() => {
        if (scrollRef.current) {
            setCanScrollLeft(scrollRef.current.scrollLeft > 0)
            setCanScrollRight(scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth)
        }
    }, [])
    const scroll=(direction)=>{
        if (scrollRef.current) {
            let start= scrollRef.current.scrollLeft
            let end= direction==="left"? start - scrollAmount : start + scrollAmount
            let startTime = null
            const animateScroll = (time) => {
                if (!startTime) startTime = time
                let progress = time - startTime
                let position = start + (end - start) * (progress / 300) // 300ms duration
                scrollRef.current.scrollLeft = smoothScroll ? position : end
                if (progress < 300) requestAnimationFrame(animateScroll)
                else scrollRef.current.scrollLeft=end
                
            }
            requestAnimationFrame(animateScroll)
        }
    }
    useEffect(() => {
        checkScroll() 
        const handleScroll = () => checkScroll()
        scrollRef.current?.addEventListener("scroll", handleScroll)
        window.addEventListener("resize", checkScroll)
        return () => {
            scrollRef.current?.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", checkScroll)
        }
    }, [checkScroll,children])
    useEffect(() => {
        let startX=0
        let scrollLeft=0
        const touchStart=(e)=>{
            startX = e.touches[0].pageX
            scrollLeft = scrollRef.current.scrollLeft
        }
        const touchMove=(e)=>{
            const touchX=e.touches[0].pageX
            const move=touchX - startX
            scrollRef.current.scrollLeft=scrollLeft - move
        }
        if (scrollRef.current) {
            scrollRef.current.addEventListener("touchstart", touchStart)
            scrollRef.current.addEventListener("touchmove", touchMove)
        }
        return () => {
            if (scrollRef.current) {
                scrollRef.current.removeEventListener("touchstart", touchStart)
                scrollRef.current.removeEventListener("touchmove", touchMove)
            }
        }
    }, [])
    return (
        <div className={`relative flex items-center ${className}`}>
            {!hideButtons && canScrollLeft && (
                <>
                    {renderIconLeft?renderIconLeft:<span
                        className={`${isArrowAbsolute?'absolute left-0 z-10':'mr-1'} bg-neutral-50 border border-neutral-600  p-1 rounded-full shadow-md flex items-center justify-center cursor-pointer`}
                        style={{
                            width: buttonSize,
                            height: buttonSize,
                            ...(fixedButtons&&{ position: "fixed", left: 20 }),
                        }}
                        onClick={()=>scroll("left")}
                    >
                        <IconComponent src={iconLeft?iconLeft:"/icons/chevron-left.svg"} width={20} height={20} />
                    </span>}
                </>
            )}
            <div
                ref={scrollRef}
                className={`overflow-x-auto scrollbar-none flex gap-4 ${classNameContent}`}
            >
                {children}
            </div>
            {!hideButtons && canScrollRight && (
                <span
                    className={`${isArrowAbsolute?'absolute right-0 z-10':'ml-1'} bg-neutral-50 border border-neutral-600 p-1 rounded-full shadow-md flex items-center justify-center cursor-pointer`}
                    style={{
                        width: buttonSize,
                        height: buttonSize,
                        ...(fixedButtons&&{ position: "fixed", right: 20 }),
                    }}
                    onClick={()=>scroll("right")}
                >
                    <IconComponent src={iconRight?iconRight:"/icons/chevron-right.svg"} width={20} height={20} />
                </span>
            )}
        </div>
    )
}

export default CarouselScrollComponent
  