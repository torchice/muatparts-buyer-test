import { useState, useEffect, useMemo } from "react";
import useTroliStore from "@/store/troli";
import { numberFormatMoney } from "@/libs/NumberFormat";
import { ChevronRight } from "lucide-react";
import Button from "@/components/Button/Button";
import ImageComponent from "../ImageComponent/ImageComponent";
import { useCheckoutStore } from "@/store/checkout";
import { useCustomRouter } from "@/libs/CustomRoute";
import { getVoucherValue } from "@/libs/voucher";
import { useLanguage } from "@/context/LanguageContext";
import MuatpartsVoucher from "@/containers/MuatpartsVoucher/MuatpartsVoucher";
import useVoucherMuatpartsStore from "@/store/useVoucherMuatpartsStore";
import UsedVoucherList from "@/containers/MuatpartsVoucher/UsedVoucherList";
import { getVoucherValues as muatpartsVoucherValue } from "@/utils/voucher";

const OrderSummary = ({ summary, data }) => {
  const router = useCustomRouter();
  const { t } = useLanguage();
  const { setBuyNow } = useCheckoutStore();
  const { submittedVouchers, setPrice } = useVoucherMuatpartsStore();

  const totalSellerPurchaseVouchers = data.reduce((total, transaction) => {
    let voucherValue = 0;
    if (transaction.usedVouchers?.dataUsedTransaction) {
      voucherValue += getVoucherValue(transaction.usedVouchers.dataUsedTransaction, summary.subtotal);
    }
    return total + voucherValue;
  }, 0);


  const totalPayment = Math.max(0, summary.subtotal - totalSellerPurchaseVouchers);

  const totalMuatpartsPurchaseVouchers = muatpartsVoucherValue(submittedVouchers, totalPayment).purchase || 0;

  const finalPayment = totalPayment - totalMuatpartsPurchaseVouchers;

  useMemo(() => setPrice(totalPayment), [totalPayment])

  // console.log("penting", {
  //   "1 total awal": summary.subtotal,
  //   "2 total voucher penjual": totalSellerPurchaseVouchers,
  //   "3 total setelah voucher penjual": totalPayment,
  //   "4 total voucher muatparts": totalMuatpartsPurchaseVouchers,
  //   "5 total akhir": finalPayment,
  // })

  function transformCartData(inputData) {
    return inputData
      .filter((cartItem) =>
        cartItem?.items?.some((item) => item.Checked === true)
      )
      .map((cartItem) => {
        return {
          cartID: cartItem?.id || null,
          sellerID: cartItem?.seller?.id,
          locationID: cartItem?.destinationAddress?.id || "",
          usedVouchers: cartItem?.usedVouchers,
          products: cartItem?.items
            .filter((item) => item.Checked === true)
            .map((item) => ({
              id: item?.ProductID,
              variantID: item?.Variant?.id || "",
              qty: item?.Quantity,
              notes: item?.Notes || "",
            })),
          price: cartItem?.items
            .filter((item) => item.Checked === true)
            .reduce(
              (total, item) => total + item.Quantity * item.PriceAfterDiscount,
              0
            ),
        };
      });
  }

  const VoucherDisplay = ({
    dataUsedVoucher,
    dataUsedTransaction,
    subtotal,
  }) => {
    const vouchers = [dataUsedTransaction].filter(Boolean);

    return (
      <>
        {vouchers.map((voucher) => (
          <div
            key={voucher.uuid}
            className="flex justify-between text-xs font-medium"
          >
            <div className="w-[148px] text-neutral-600">
              <span>{t("AppMuatpartsDashboardSellerVoucher")} : </span>
              <span className="inline-block max-w-[80px] truncate align-bottom">
                {voucher.kode}
              </span>
            </div>
            <div className="text-right text-error-400">
              -{numberFormatMoney(getVoucherValue(voucher, subtotal))}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <div className="rounded-xl shadow-muatmuat px-5 py-6 space-y-6">
        <div className="font-bold">{t("labelRingkasanPesanan")}</div>
        <MuatpartsVoucher />
        <div className="flex justify-between text-xs font-medium">
          <div className="w-[148px] text-neutral-600">
            {t("labelTotalHarga")} ({summary.totalCheckedItems}{" "}
            {t("AppMuatpartsAnalisaProdukJumlahProduk")})
          </div>
          <div className="text-right">
            {numberFormatMoney(summary.subtotal)}
          </div>
        </div>

        {data?.map((transaction) => (
          <VoucherDisplay
            key={transaction.id}
            dataUsedTransaction={transaction.usedVouchers?.dataUsedTransaction}
            dataUsedVoucher={transaction.usedVouchers?.dataUsedVoucher}
            subtotal={transaction.subtotal}
          />
        ))}

        <UsedVoucherList
          voucherData={submittedVouchers}
          purchaseAmount={totalPayment}
          hideShipping
        />

        <div className="border-[0.5px] border-neutral-400"></div>
        <div className="flex justify-between font-bold">
          <div>{t("InfoPraTenderCreateLabelTotal")}</div>
          <div>{numberFormatMoney(finalPayment)}</div>
        </div>

        <Button
          Class="!max-w-full !w-full"
          disabled={summary.totalCheckedItems === 0}
          onClick={async () => {
            await setBuyNow(transformCartData(data));
            router.push("/checkout?from=troli");
          }}
        >
          {t("labelBeli")}
        </Button>
      </div>
    </>
  );
};

export default OrderSummary;
