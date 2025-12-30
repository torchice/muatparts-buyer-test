import IconComponent from "@/components/IconComponent/IconComponent"
import Card from "../Card"
import Button from "@/components/Button/Button"
import styles from "./ProvinceCard.module.scss"
import SWRHandler from "@/services/useSWRHook"
import { useState } from "react"
import Modal from "@/components/Modals/modal"
import toast from "@/store/toast.js"
import Toast from "@/components/Toast/Toast"

const baseUrl = process.env.NEXT_PUBLIC_API_FRIDAY

const ProvinceCard = ({
    count,
    onRefresh,
    provinceID,
    provinceName
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { setShowToast, setDataToast } = toast();
    const { useSWRMutateHook } = new SWRHandler();
    const { trigger: deleteProvince } = useSWRMutateHook(`${baseUrl}v1/muatparts/shipping_option/courier_store/province/${provinceID}`, "DELETE");
    
    const handleDeleteProvince = async () => {
        await deleteProvince()
            .then(() => {
                onRefresh()
                setIsModalOpen(false)
                setShowToast(true)
                setDataToast({
                    type: "success",
                    message: `Berhasil menghapus provinsi ${provinceName}`,
                });
            })
            .catch(() => {
                setIsModalOpen(false)
                setShowToast(true)
                setDataToast({
                    type: "error",
                    message: `Gagal menghapus provinsi ${provinceName}`,
                });
            })
    }

    return (
        <>
            <Card>
                <div className="flex flex-col gap-y-3">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-[14px] leading-[15.4px]">{provinceName}</span>
                        <span className="font-medium text-[14px] leading-[15.4px]">
                            {count > 0 ? `[${count} Kab/Kota]` : `[Belum Diatur]`}
                        </span>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <div className="flex-1">
                            <Button
                                color="primary_secondary"
                                Class="!max-w-full w-full h-7 !font-semibold flex items-center"
                                onClick={() => alert("KABOOM")}
                            >
                                Atur Biaya Pengiriman
                            </Button>
                        </div>
                        <IconComponent
                            classname={styles.icon_trash}
                            src="/icons/trash-az.svg"
                            size="medium"
                            onclick={() => setIsModalOpen(true)}
                        />
                    </div>
                </div>
            </Card>
            <Toast/>
            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                closeArea={false}
                closeBtn={true}
                title="Hapus Provinsi"
                desc={`Apakah kamu yakin ingin menghapus provinsi ${provinceName}? `}
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
                    action: handleDeleteProvince,
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

export default ProvinceCard