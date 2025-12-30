// FIX BUG Pengecekan Ronda Muatparts LB-0065
"use client";
import Toast from "@/components/Toast/Toast";
import toast from "@/store/toast";
import { formatCurrency } from "@/utils/currency";
import { customFetcherBuyer } from "@/utils/customFetcher";
import { useMemo } from "react";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

const fetcherClaimVoucher = async kode => {
    return customFetcherBuyer(
        `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/voucher/claim-voucher`,
        {
            method: "POST",
            body: JSON.stringify({ kode }),
        }
    );
};

// 24. THP 2 - MOD001 - MP - 024 - QC Plan - Web - MuatParts - Voucher Buyer - LB - 0025
export const VoucherCard = ({ voucher, onClickDetail, onRefreshVoucher }) => {
    const { setShowToast, setDataToast } = toast();

    const { trigger } = useSWRMutation(
        "/voucher/claim-voucher",
        (_url, { arg }) => fetcherClaimVoucher(arg),
        {
            // 24. THP 2 - MOD001 - MP - 024 - QC Plan - Web - MuatParts - Voucher Buyer - LB - 0025
            onSuccess: (e) => {
                if(e===undefined){
                    setDataToast({
                        type:"error",
                        message:"Gagal klaim voucher"
                    })
                    onRefreshVoucher()
                    setShowToast(true)
                } else {
                    setDataToast({
                        type: "success",
                        message: "Voucher berhasil diklaim",
                    });
                    onRefreshVoucher();
                    setShowToast(true);
                }
              
            },
        }
    );
    const handleClaimVoucher = () => {
        trigger(voucher.kode);
    };
    const discountValue = useMemo(() => {
        const value = voucher.discount_value;
        let valueStr =
            voucher.discount_type === "Persentase"
                ? `${new Intl.NumberFormat("id-ID").format(value)}%`
                : `${formatCurrency(value, true)}`;
        return `Diskon ${valueStr}${
            // 24. MP - 024 - Web - LB - 0024
            voucher.is_unlimited || Number(voucher.discount_max)===0
                ? ""
                : `, maks. potongan ${formatCurrency(
                        voucher.discount_max,
                        true
                  )}`
        }`;
    }, [voucher]);

    const isNoQuotaLeft = useMemo(() => {
        return voucher.usageCount >= voucher.usageQuota;
    }, [voucher]);
    const isLessThenAWeek = useMemo(() => voucher.daysLeft < 7, [voucher]);
    const isLessThanADay = useMemo(() => voucher.daysLeft <= 1, [voucher]);
    const expiredText = useMemo(() => {
        if (isNoQuotaLeft) return "Kuota Habis";

        const startDate = new Date(voucher.start_date);
        const expiredDate = new Date(voucher.end_date);
        //find daysleft from start date and expired date

		const daysLeft = voucher.daysLeft;
		const hoursLeft = voucher.hoursLeft;
		const format = new Intl.DateTimeFormat("id-ID", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
		
		if (daysLeft >= 7)
			return `${format.format(startDate)} - ${format.format(expiredDate)}`;
		
		if (daysLeft < 7 && daysLeft > 0) return `Berakhir ${daysLeft} Hari Lagi`;

		if (daysLeft === 0 && hoursLeft > 1) return `Sisa ${hoursLeft} Jam Lagi`;

		if (daysLeft === 0 && hoursLeft <= 1) return `Kurang 1 Jam Lagi`;

       
    }, [voucher]);

    const usagePercent = useMemo(() => {
        const max = voucher.usageQuota;
        const used = voucher.usageCount;
        const percent = (used / max) * 100;

        return percent;
    }, [voucher]);
    
    return (
        <>
            <div
                className={`flex flex-col flex-1 relative ${
                    voucher.used_status === "available"
                        ? "bg-white"
                        : "bg-neutral-200"
                }  rounded-md border border-solid border-neutral-200 shrink-0`}
            >
                <div className="flex relative items-start w-full px-4 pt-3 gap-2.5">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/1aea820f672fd9b16374ba94660630d13b187ef2e718ea7fd2387bfb30067d64"
                        className="object-contain size-16 rounded aspect-square"
                        alt="Cashback icon"
                    />
                    {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0355 */}
                    <div className="flex flex-col gap-y-2 w-full">
                        <div className="text-[10px] leading-[13px] text-neutral-900 font-bold">
                            {voucher.kode}
                        </div>
                        <ul className="list-disc pl-3 text-[8px] leading-[10.4px] text-neutral-700">
                            <li>{discountValue} </li>
                            <li>
                                {`Min. Transaksi ${formatCurrency(
                                    voucher.transaction_min,
                                    true
                                )}`}
                            </li>
                        </ul>
                        <div className="flex flex-col gap-y-1">
                            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0355 */}
                            <div className="w-full flex items-center px-0.5 h-[6px] bg-neutral-200 rounded-[5px] overflow-hidden">
                                <div 
                                    className="h-1 bg-primary-700 rounded-lg"
                                    style={{ width: `${usagePercent}%` }}
                                />
                            </div>
                            <span className="font-medium text-[8px] leading-[10.4px] text-neutral-900">
                                {`Terpakai ${usagePercent}%`}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0355
                        className="self-start absolute top-2 right-2"
                        onClick={() => onClickDetail(voucher)}
                    >
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/638933f567cf43d50a95ccdebbd68824143bf283cb86333ee9c8ecab035287b9"
                            alt="Info"
                            className="w-full h-full"
                        />
                    </button>
                </div>
                <div
                    className={`mt-3.5  w-full border-t border-dashed ${
                        voucher.used_status === "available"
                            ? "border-zinc-300"
                            : "border-neutral-400"
                    } relative z-100 after:block  after:h-4 after:w-4 after:bg-white after:border-r  after:rounded-full after:border-zinc-300 after:absolute after:-top-2 after:-left-2 
            before:block  before:h-4 before:w-4 before:bg-white before:border-l  before:rounded-full before:border-zinc-300 before:absolute before:-top-2 before:-right-2`}
                />
                <div className="flex mt-3 px-4 pt-2 pb-3 w-full">
                    <div
                        className={`text-xs font-medium ${
                            isLessThenAWeek || isNoQuotaLeft || isLessThanADay
                                ? "text-red-700"
                                : "text-neutral-500"
                        }`}
                    >
                        {expiredText}
                    </div>
                    <button
                        className="text-xs font-bold ml-auto text-right text-blue-600 disabled:text-neutral-400"
                        disabled={voucher.used_status === "used"}
                        onClick={handleClaimVoucher}
                    >
                        {voucher.used_status === "used"
                            ? "Telah diklaim"
                            : "Klaim"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default VoucherCard;
// FIX BUG Pengecekan Ronda Muatparts LB-0065