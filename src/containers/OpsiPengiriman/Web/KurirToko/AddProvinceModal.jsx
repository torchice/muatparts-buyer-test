import IconComponent from "@/components/IconComponent/IconComponent"
import Input from "@/components/Input/Input"
import styles from "./AddProvinceModal.module.scss"
import { Fragment, useEffect, useMemo, useState } from "react"
import Button from "@/components/Button/Button"
import Checkbox from "@/components/Checkbox/Checkbox"
import SWRHandler from "@/services/useSWRHook"
import DataNotFound from "@/components/DataNotFound/DataNotFound"

const baseUrl = process.env.NEXT_PUBLIC_API_FRIDAY

const AddProvinceModal = ({
    addCourierProvince,
    onRefresh,
    isOpen,
    setIsOpen,
    selectedProvinces,
    setSelectedProvinces
}) => {
    const [search, setSearch] = useState("")
    const [isAllChecked, setIsAllChecked] = useState(false)

    const { useSWRHook, useSWRMutateHook } = SWRHandler();
    const { data: provinceGroupData } = useSWRHook(`/province_group`);

    const provinces = Object.entries(provinceGroupData?.Data || {}).map(([key, value]) => ({ key, value }))
    const allProvinceIds = useMemo(() => provinces.reduce((arr, item) => [...arr, ...item.value.map(item => item.ProvinceID)], [], [provinces]))

    const filteredProvinces = useMemo(() => {
        if (search) {
            return provinces.reduce((arr, item) => {
                const value = item.value.filter(item => item.Province.toLowerCase().includes(search.toLowerCase()))
                if (value.length > 0) {
                    return [...arr, { ...item, value }]
                }
                return arr
            }, [])
        }
        return provinces
    }, [JSON.stringify(provinces), search])

    useEffect(() => {
        const sortedAllProvinceIds = allProvinceIds.sort((a, b) => b - a)
        const sortedSelectedProvinces = selectedProvinces.sort((a, b) => b - a)
        const isAllChecked = JSON.stringify(sortedAllProvinceIds) === JSON.stringify(sortedSelectedProvinces)
        setIsAllChecked(isAllChecked)
    }, [JSON.stringify(allProvinceIds), JSON.stringify(selectedProvinces)])

    const handleSave = async () => {
        await addCourierProvince({ provinceID: selectedProvinces })
            .then(() => {
                onRefresh()
                setIsOpen(false)
            })
            .catch(() => {
                onRefresh()
                setIsOpen(false)
            })
    }

    const handleToogleCheckAll = (checked) => {
        if (checked) {
            setSelectedProvinces(allProvinceIds)
        } else {
            setSelectedProvinces([])
        }
        setIsAllChecked(checked)
    }

    return (
        <div className={`fixed inset-0 z-[90] flex items-center justify-center ${!isOpen ? "hidden" : "block"}`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50"
            />
            {/* Modal */}
            <div className="relative bg-white rounded-xl p-6 flex flex-col gap-y-4 items-center">
                <button
                    className='absolute top-[8px] right-[9px]'
                    onClick={() => setIsOpen(false)}
                >
                    <IconComponent
                        classname={styles.icon_primary}
                        src="/icons/silang.svg"
                    />
                </button>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-[16px] leading-[19.2px]">Pilih Provinsi</span>
                    <div className={`p-3 pr-0 pb-0 border border-neutral-400 rounded-md mt-6 flex flex-col`}>
                        <Input
                            classname={`w-[386px] ${styles.input_search} pr-3`}
                            placeholder="Cari Kota/Kabupaten"
                            icon={{
                            left: (
                                <IconComponent src={"/icons/search.svg"} />
                            ),
                            right: search ? (
                                <IconComponent
                                    src={"/icons/silang.svg"}
                                    onclick={() => {
                                        setSearch("")
                                    }}
                                />
                            ) : null,
                            }}
                            value={search}
                            changeEvent={(e) => setSearch(e.target.value)}
                        />
                        {filteredProvinces.length > 0 ? (
                            <>
                                <div className="pt-3 pr-3">
                                    <div className="border-b border-b-neutral-800 pb-3">
                                        <Checkbox
                                            label="Pilih Semua"
                                            checked={isAllChecked}
                                            onChange={(e) => handleToogleCheckAll(e.checked)}
                                        />
                                    </div>
                                </div>
                                <div className="overflow-y-scroll h-[217px]">
                                    {filteredProvinces.map((item, index) => {
                                        return (
                                            <div className="py-4 flex flex-col gap-y-2" key={index}>
                                                <div className="ml-[25px] font-bold text-[14px] leading-[16.8px]">{item.key}</div>
                                                <div className="grid grid-cols-2 gap-[15px]">
                                                    {item.value.map((item, key) => {
                                                        const isChecked = selectedProvinces.includes(item.ProvinceID)
                                                        return (
                                                            <Fragment key={key}>
                                                                <Checkbox
                                                                    label={item.Province}
                                                                    checked={isChecked}
                                                                    onChange={(e) => setSelectedProvinces(prevState => {
                                                                        if (!e.checked) {
                                                                          return prevState.filter(provinceId => provinceId !== item.ProvinceID)
                                                                        } 
                                                                        return [...prevState, item.ProvinceID]
                                                                    })}
                                                                />
                                                            </Fragment>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="mb-3 mt-4 py-14">
                                <DataNotFound
                                    classname="flex flex-col items-center gap-y-5"
                                    textClass="max-w-[200px] font-semibold text-[14px] leading-[16.8px]"
                                    title="Keyword Tidak Ditemukan Di Sistem"
                                    type="search"
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-3 flex gap-x-3">
                        <Button
                            color="primary_secondary"
                            Class="h-8 px-[39.5px] !font-semibold flex items-center"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            Class="h-8 px-[31.5px] !font-semibold flex items-center"
                            onClick={handleSave}
                        >
                            Simpan
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProvinceModal