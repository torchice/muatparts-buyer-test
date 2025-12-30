import DataNotFound from "@/components/DataNotFound/DataNotFound"
import IconComponent from "@/components/IconComponent/IconComponent"
import Input from "@/components/Input/Input"
import { useState } from "react"


const PilihProvinsi = ({

}) => {
    const [search, setSearch] = useState("")
    const [isAllChecked, setIsAllChecked] = useState(false)

    return (
        <div className="py-5 px-4 flex flex-col gap-y-5 bg-neutral-50 min-h-[calc(100vh_-_88px)]">
            <Input
                classname={`w-full`}
                placeholder="Cari Provinsi"
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
            <div className="min-h-[calc(100vh_-_200px)] flex">
                <DataNotFound
                    classname="gap-y-3 m-auto"
                    textClass="max-w-[111px] font-semibold text-[14px] leading-[16.8px]"
                    title="Keyword Tidak Ditemukan"
                />
            </div>
        </div>
    )
}

export default PilihProvinsi