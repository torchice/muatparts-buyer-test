import Image from "next/image"
import Card from "./Card"
import ToogleButton from "@/components/ToogleButton/ToogleButton"
import { Fragment, useEffect, useRef, useState } from "react"
import Courier from "./Courier"
import IconComponent from "@/components/IconComponent/IconComponent"
import toast from "@/store/toast"
import Toast from "@/components/Toast/Toast"
import Modal from "@/components/Modals/modal"

const ExpedisiCard = ({
    active_couriers,
    couriers,
    description,
    id,
    name,
    toogleGroupExpedition,
    toogleItemExpedition,
    onRefresh
}) => {
    const { setShowToast, setDataToast } = toast();
    const [isOpen, setIsOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [value, setValue] = useState(false)

    const dropdownRef = useRef(null);

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToogleGroup = async () => {
        await toogleGroupExpedition({ id, activate_all: value })
            .then(() => {
                onRefresh()
                setIsModalOpen(prevState => !prevState)
                setShowToast(true)
                setDataToast({
                    type: "success",
                    message: value ? `Berhasil mengaktifkan semua pengiriman ${name}` : `Berhasil menonaktifkan semua pengiriman ${name}`,
                });
            })
            .catch(() => {
                setIsModalOpen(prevState => !prevState)
                setShowToast(true)
                setDataToast({
                    type: "error",
                    message: value ? `Gagal mengaktifkan semua pengiriman ${name}` : `Gagal menonaktifkan semua pengiriman ${name}`,
                });
            })
    }

    const handleOpenModalConfirmation = (value) => {
        setValue(value)
        setIsModalOpen(true)
        setIsOpen(false)
    }

    const options = [
        {
            label: "Aktifkan Semua",
            onClick: () => handleOpenModalConfirmation(true)
        },
        {
            label: "Nonaktifkan Semua",
            onClick: () => handleOpenModalConfirmation(false)
        }
    ]

    return (
        <>
            <Card>
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <span className="font-bold text-[18px] leading-[21.6px]">
                                {name} <span className="text-primary-700">{`[${active_couriers} Aktif]`}</span>
                            </span>
                            <div className="mt-3 font-medium text-[12px] leading-[14.4px] text-neutral-600">{description}</div>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <IconComponent size="medium" src={'/icons/three-dots.svg'} onclick={() => setIsOpen(prevState => !prevState)} />
                            <div
                                className={`${isOpen ? "block" : "hidden"} 
                                    absolute right-1 top-[32px] w-[130px] z-10 shadow-muat border border-neutral-400 bg-neutral-50 rounded-md
                                `}
                            >
                                {options.map((option, key) => (
                                    <div className="px-2.5 hover:bg-neutral-200 h-8 cursor-pointer flex items-center" key={key} onClick={option.onClick}>
                                        <span className={`font-medium text-[12px] leading-[14.4px] ${options.length - 1 === key ? "text-[#C22716]" : ""}`}>
                                            {option.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        {couriers.map((courier, key) => {
                            const isLastChild = couriers.length - 1 === key
                            return (
                                <div className={`py-2 px-6 ${!isLastChild ? "border-b border-b-neutral-400" : ""}`} key={key}>
                                    <Courier {...courier} onRefresh={onRefresh} toogleItemExpedition={toogleItemExpedition} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Card>
            <Toast/>
            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                closeArea={false}
                closeBtn={true}
                desc={value ?  `Apakah kamu yakin mengaktifkan semua Pengiriman ${name}?` :  `Apakah kamu yakin menonaktifkan semua Pengiriman ${name}?`}
                action1={{
                    action: () => setIsModalOpen(false),
                    text: "Tidak",
                    style: "outline",
                    color: "#176CF7",
                        customStyle: {
                        width: "112px",
                    },
                }}
                action2={{
                    action: handleToogleGroup,
                    text: "Ya",
                    style: "full",
                    color: "#176CF7",
                    customStyle: {
                        width: "112px",
                        color: "#ffffff",
                    },
                }}
            />
       </>
    )
}

export default ExpedisiCard