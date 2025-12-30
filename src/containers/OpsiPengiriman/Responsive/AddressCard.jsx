import Card from "./Card"

const AddressCard = ({
    fullAddress
}) => {
    return (
        <Card>
            <span className="font-semibold text-[14px] leading-[15.4px] text-neutral-700">Alamat Toko</span>
            <div className="font-semibold text-[14px] leading-[15.4px]">
                {fullAddress}
            </div>
        </Card>
    )
}

export default AddressCard