import IconComponent from "@/components/IconComponent/IconComponent"
import Card from "../Card"
import Input from "@/components/Input/Input"


const CariProvinsiCard = ({
    search,
    setSearch
}) => {
    return (
        <Card>
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
        </Card>
    )
}

export default CariProvinsiCard