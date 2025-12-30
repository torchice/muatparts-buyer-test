import IconComponent from "@/components/IconComponent/IconComponent"
import ToogleButton from "@/components/ToogleButton/ToogleButton"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const Courier = ({
    id,
    is_active,
    logo_url,
    name,
    terms,
    toogleItemExpedition,
    onRefresh
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [contentHeight, setContentHeight] = useState('auto')
    const termsRef = useRef(null)

    useEffect(() => {
            if (termsRef.current) {
              const height = termsRef.current.scrollHeight
              setContentHeight(height)
            }
          }, [])

    const handleToogleCourier = async() => {
        await toogleItemExpedition({ id, is_active: !is_active })
            .then(() => {
                onRefresh()
            })
    }

    const demoDesc = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
        when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
        and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. '\'n'\'n
        It is a long established fact that a reader will be distracted by the readable content of a page '\'n'\'n
        When an unknown printer took a galley of type and scrambled it to make a type specimen book
        At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
        At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
        and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. '\'n'\'n
        It is a long established fact that a reader will be distracted by the readable content of a page '\'n'\'n
        When an unknown printer took a galley of type and scrambled it to make a type specimen book
        At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
        At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
    `

    return (
        <>
            <div
                className="flex justify-between items-center"
            >
                <div className="relative w-fit h-fit">
                    <Image
                        className="!w-max !h-auto"
                        src={logo_url || "/img/gojek.png"}
                        alt={name}
                        height={100}
                        width={100}
                    />
                </div>
                <div className="flex gap-x-3 items-center">
                    <span className="font-semibold text-[12px] leading-[14.4px]">{name}</span>
                    <ToogleButton
                        onClick={handleToogleCourier}
                        value={is_active}
                    />
                    <IconComponent
                        onclick={() => {
                            setIsOpen(prevState => !prevState)
                        }}
                        classname={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                        src='/icons/chevron-down.svg'
                        size="medium"
                    />
                </div>
            </div>
            <div
                className={`overflow-hidden transition-[max-height] duration-[1200ms] ease-in-out`}
                ref={termsRef}
                style={{
                    maxHeight: isOpen ? contentHeight : "0px",
                }}
            >
                <div className="mt-6">
                    {demoDesc}
                    {/* {terms} */}
                </div>
            </div>
        </>
    )
}

export default Courier