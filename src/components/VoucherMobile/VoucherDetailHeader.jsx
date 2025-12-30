import IconComponent from "@/components/IconComponent/IconComponent";
import { dateFormatter } from "@/utils/date";
import { formatCurrency } from "@/utils/currency";
import ImageComponent from "../ImageComponent/ImageComponent";

const VoucherDetailHeader = ({voucher}) => {

    const SatuanDiskonCircle = ({nominal}) => {
        return (
            <div className="relative">
                <div className="min-w-[17px] min-h-[17px] max-w-[17px] max-h-[17px] bg-error-400 flex items-center justify-center rounded-full">
                    <label className="font-medium text-[10px] text-neutral-50">{nominal}</label>
                </div>
                <div className="
                    min-w-[12px] min-h-[12px] max-w-[12px] max-h-[12px] bg-error-400 flex
                    justify-center rounded-full 
                    absolute top-[-4px] right-[-8px]
                ">
                    <label className="font-medium text-[10px] text-neutral-50">*</label>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-no-repeat bg-center flex items-center justify-center h-[153px] w-[360px]" style={{backgroundImage: "url('/img/voucher-detail.png')", backgroundSize: "360px 153px"}}>
            <div className="grid grid-cols-12 items-center">
                {
                    voucher?.discountType === "Nominal" ? (
                        <div className="flex flex-col col-start-2 col-end-7">
                            <label className="bold-sm text-neutral-50">Diskon</label>
                            <div className="flex items-center gap-[2px] ">
                                <div className="flex items-end pl-2 relative">
                                    <div className="absolute top-[0px] right-[-20px]">
                                        <SatuanDiskonCircle 
                                            nominal={voucher?.discountNominalUnit}
                                        />
                                    </div>
                                    <label className="font-bold text-neutral-50 leading-4">Rp</label>
                                    <label className="text-[48px] font-bold text-neutral-50 leading-[48px] tracking-tighter">{formatCurrency(voucher?.discountValue).split(".")[0]}</label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`flex flex-col col-start-2 col-end-6 ${voucher?.isUnlimied && "pl-4"}`}>
                            <label className="bold-sm text-neutral-50">Diskon {!voucher?.isUnlimited && formatCurrency(voucher?.discountValue) + "%"}</label>
                            <div className="flex items-center gap-[2px] relative w-fit">
                                <div className="flex flex-col justify-end">
                                    <div className="absolute top-[0px] right-[-20px]">
                                        <SatuanDiskonCircle 
                                            nominal={voucher?.isUnlimited ? "%" : voucher?.discountNominalUnit}
                                        />
                                    </div>
                                    {
                                        !voucher?.isUnlimited && (
                                            <>
                                                <label className="font-medium text-[10px] text-neutral-50">hingga</label>
                                                <label className="bold-sm text-neutral-50 text-end">Rp</label>
                                            </>
                                        )
                                    }
                                </div>
                                <label className={`text-[42px] font-bold text-neutral-50 leading-[42px] tracking-tighter ${voucher?.isUnlimited && "ml-4"}`}>{voucher?.isUnlimited ? formatCurrency(voucher?.discountValue) : formatCurrency(voucher?.discountMax).split(".")[0]}</label>
                            </div>
                        </div>
                    )
                }
                <div className="flex items-center gap-4 col-start-7 col-end-12"> 
                    <ImageComponent width="5" height="153" src="/img/voucher-line.svg"/>
                    <div className="flex flex-col gap-2 items-start ">
                        <ImageComponent
                            src="/img/detail-voucher-logo-muatparts.svg"
                            width="85"
                            height="15"
                        />
                        <div className="flex items-center gap-1">
                            <IconComponent src="/icons/ic_calendar_white.svg" />
                            <label className="text-[10px] font-medium text-neutral-50 mb-[-2px]">{dateFormatter(voucher?.startDate, "dd MMMM yyyy")} - {dateFormatter(voucher?.expiredAt, "dd MMMM yyyy")}</label>
                        </div>
                        <label className="text-[8px] font-medium text-neutral-50">*Kamu bisa langsung pakai voucher ini di halaman checkout</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VoucherDetailHeader;