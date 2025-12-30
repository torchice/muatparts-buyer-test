import Button from "@/components/Button/Button"
import Modal from "@/components/Modals/modal"
import AddressCard from "@/containers/OpsiPengiriman/Responsive/AddressCard"
import AreaPengirimanCard from "@/containers/OpsiPengiriman/Responsive/KurirToko/AreaPengirimanCard"
import CariProvinsiCard from "@/containers/OpsiPengiriman/Responsive/KurirToko/CariProvinsiCard"
import ProvinceCard from "@/containers/OpsiPengiriman/Responsive/KurirToko/ProvinceCard"
import { Fragment, useMemo, useState } from "react"

const AturKurirToko = ({
    validateFormData,
    address,
    count,
    formData,
    // lists,
    onRefresh,
    onSave
}) => {
    const [search, setSearch] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    console.log("list",formData)
    const filteredFormData = useMemo(() => {
        if (search === "") {
            return formData
        }
        return formData.filter(item => item.provinceName.toLowerCase().includes(search.toLowerCase()))
    }, [JSON.stringify(formData), search])


    return (
        <>
            <div className="flex flex-col gap-y-2 pb-16">
                <AddressCard fullAddress={address}/>
                <AreaPengirimanCard count={count}/>
                {formData.length > 0 ? (
                    <CariProvinsiCard
                        search={search}
                        setSearch={setSearch}
                    />
                ) : null}
                {filteredFormData.map((province, key) => (
                    <Fragment key={key}>
                        <ProvinceCard {...province} onRefresh={onRefresh}/>
                    </Fragment>
                ))}
                <div className="fixed bottom-0 left-0 py-3 px-4 bg-neutral-50 w-full">
                    <Button
                        Class="!max-w-full w-full h-10 !font-semibold flex items-center"
                        onClick={() => {
                            if (validateFormData()) {
                                setIsModalOpen(true)
                                // setModalType("saveConfirmation")
                            }
                        }}
                    >
                        Simpan
                    </Button>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                closeArea={false}
                closeBtn={true}
                title="Konfirmasi Simpan"
                desc={`Apakah kamu yakin menyimpan data ini?`}
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
                    action: onSave,
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

export default AturKurirToko