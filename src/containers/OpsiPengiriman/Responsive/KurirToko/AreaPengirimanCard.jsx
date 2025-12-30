import Button from "@/components/Button/Button"

import Card from "../Card.jsx"


const AreaPengirimanCard = ({
    count
}) => {
    return (
        <Card>
            <span className="font-bold text-[14px] leading-[15.4px]">
                Batasan Area Pengiriman
            </span>
            <div className="font-semibold text-[14px] leading-[15.4px] mt-2">
                Provinsi*
            </div>
            {count > 0 ? (
                <div className="font-semibold text-[14px] leading-[15.4px]">
                    {`${count} Provinsi`}
                </div>
            ) : null}
            <Button
                Class="w-[112px] h-7 !font-semibold flex items-center"
                onClick={() => {
                    // resetForm();
                    // setModalOpen(false);
                }}
            >
                Tambah
            </Button>
        </Card>
    )
}

export default AreaPengirimanCard