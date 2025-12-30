import VoucherInfo from "./VoucherInfo";
import TermsAndConditions from "./TermsAndConditions";
import Image from "next/image";
import styles from "./VoucherDetailModal.module.scss"
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";

export default function VoucherDetailModal({ isOpen, setIsOpen, voucher }) {
    const hasQuota = true
    return (
        <div className={`fixed inset-0 z-[90] flex items-center justify-center ${!isOpen ? "hidden" : "block"}`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50"
            />
            <div className="relative rounded-xl w-[472px]">
                <div className="flex-none w-[472px] relative overflow-hidden">
                    <div className="flex overflow-hidden relative flex-col w-full aspect-[4] text-neutral-50">
                        <Image
                            src="/img/temp-voucher-detail-header.png"
                            className="object-cover absolute inset-0 size-full"
                            alt="Voucher banner"
                            width={472}
                            height={118}
                        />
                        <div className="flex relative gap-x-[61px] ml-[61px] w-full my-auto items-center">
                            <div className="flex flex-col gap-y-3 items-center w-[160px]">
                                <span className="font-bold text-[16px] leading-[19.2px]">
                                    Diskon 50%
                                </span>
                                <div className="flex gap-x-[3px]">
                                    <div className="flex flex-col items-end justify-center gap-y-1">
                                        <span className="font-medium text-[12px] leading-[14.4px]">
                                            hingga
                                        </span>
                                        <span className="font-bold text-[16px] leading-[19.2px]">
                                            Rp
                                        </span>
                                    </div>
                                    <span className="font-bold text-[48px] leading-[57.6px]">100</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <Image
                                    src="/img/temp-muatparts.png"
                                    alt="muatparts"
                                    height={20}
                                    width={100}
                                />
                                <div className="flex gap-x-1 items-center">
                                    <IconComponent classname={styles.icon_white} src="/icons/calendar.svg" />
                                    <span className="font-medium text-[10px] leading-[13px]">19 Okt 2024 - 28 Okt 2024</span>
                                </div>
                                <span className="font-medium text-[8px] leading-[10.4px] max-w-[157px]">
                                    *Kamu bisa langsung pakai voucher ini di halaman checkout
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-y-2.5 py-6 pl-6 w-full bg-white rounded-b-xl">
                    <div className="flex flex-col justify-center w-full gap-y-2.5">
                        {hasQuota ? (
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col gap-y-1.5">
                                    <div className="flex items-center self-center h-[10px] w-full px-0.5 bg-neutral-200 rounded-[5px] overflow-hidden">
                                        <div 
                                            className="h-1.5 bg-primary-700 rounded-lg"
                                            style={{ width: `${20}%` }}
                                        />
                                    </div>
                                    <div className="flex gap-1 items-center w-full">
                                        <div className="font-medium text-[10px] leading-[13px] my-auto text-ellipsis">
                                            Kuota Voucher Telah Terpakai
                                        </div>
                                        <div className="text-[10px] leading-[13px] my-auto text-ellipsis">
                                            <span className="font-bold">20%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        <div className="flex gap-3 justify-center items-start w-full h-[330px] mr-[14px]">
                            <div className="flex overflow-y-scroll pr-5 flex-col flex-1 shrink basis-0 h-[338px] w-full">
                                <VoucherInfo />
                                <TermsAndConditions />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button
                            color="primary"
                            className=" h-8 p-[29px]"
                            onClick={() => setIsOpen(false)}
                        >
                            Kembali
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}