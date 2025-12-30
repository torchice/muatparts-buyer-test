import IconComponent from "@/components/IconComponent/IconComponent"
import Card from "./Card"
import { useState } from "react"
import Courier from "./Courier"
import Bottomsheet from "@/components/Bottomsheet/Bottomsheet"
import Modal from "@/components/Modals/modal"
import toast from "@/store/toast"
import Toast from "@/components/Toast/Toast"

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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [value, setValue] = useState(false)

    const {
        showBottomsheet,
        setShowBottomsheet,
        setTitleBottomsheet,
        setDataBottomsheet,
        setShowToast,
        setDataToast
    } = toast();

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

    return (
        <>
            <Card>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-[14px] leading-[16.8px]">
                        {name} <span className="text-primary-700">{`[${active_couriers} Aktif]`}</span>
                    </span>
                    <IconComponent
                        size="medium"
                        src={'/icons/three-dots.svg'}
                        onclick={() => {
                            setShowBottomsheet(!showBottomsheet)
                            setTitleBottomsheet("Atur")
                            setDataBottomsheet(
                                <div className="flex flex-col gap-y-4">
                                    <div
                                        className="font-semibold text-[14px] leading-[15.4px] pb-4 border-b border-b-neutral-400 cursor-pointer"
                                        onClick={() => {
                                            setValue(true)
                                            setIsModalOpen(true)
                                            setShowBottomsheet(false)
                                        }}
                                    >
                                        Aktifkan Semua 
                                    </div>
                                    <div
                                        className="font-semibold text-[14px] leading-[15.4px] text-error-400 cursor-pointer"
                                        onClick={() => {
                                            setValue(false)
                                            setIsModalOpen(true)
                                            setShowBottomsheet(false)
                                        }}
                                    >
                                        Nonaktifkan Semua
                                    </div>
                                </div>
                            )
                        }}
                    />
                </div>
                <span className="font-medium text-[14px] leading-[15.4px]">{description}</span>
                {couriers.map((courier, key) => {
                    const isLastChild = couriers.length - 1 === key
                    return (
                        <div className={`${!isLastChild ? "border-b border-b-neutral-400 py-4" : ""}`} key={key}>
                            <Courier {...courier} onRefresh={onRefresh} toogleItemExpedition={toogleItemExpedition} />
                        </div>
                    )
                })}
            </Card>
            <Toast/>
            {/* NANTI DITEST BISA GA PERLU INI TA GA */}
            {/* <Bottomsheet /> */}
            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                closeArea={false}
                closeBtn={true}
                title={`Konfirmasi ${value ? "Aktif" : "Nonaktif"}`}
                desc={value ?  `Apakah kamu yakin mengaktifkan semua pengiriman ${name}?` :  `Apakah kamu yakin menonaktifkan semua pengiriman ${name}?`}
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