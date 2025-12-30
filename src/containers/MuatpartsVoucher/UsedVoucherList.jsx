import { useLanguage } from "@/context/LanguageContext";
import { numberFormatMoney } from "@/libs/NumberFormat";

/**
 * Calculate voucher value based on discount type
 *
 * @param {Object} voucher - Individual voucher object
 * @param {number} purchaseAmount - Purchase amount
 * @returns {number} Calculated voucher value
 */
export const calculateVoucherValue = (voucher, purchaseAmount) => {
  if (!voucher || !voucher.details) return 0;

  const { discountType, discountValue, discountMax, minPurchase } =
    voucher.details;

  // Check if minimum purchase requirement is met
  if (purchaseAmount < minPurchase) {
    return 0; // Minimum purchase requirement not met
  }

  let calculatedVoucherValue = 0;

  // Calculate discount based on type
  if (discountType === "nominal") {
    // For nominal type, return the direct discount value
    calculatedVoucherValue = discountValue;
  } else if (discountType === "percentage") {
    // For percentage type, calculate discount based on purchase amount
    const calculatedDiscount = (discountValue / 100) * purchaseAmount;

    // Apply discount max if it exists
    if (discountMax !== null && calculatedDiscount > discountMax) {
      calculatedVoucherValue = discountMax;
    } else {
      calculatedVoucherValue = calculatedDiscount;
    }
  }

  // If voucher value is greater than purchase amount, cap it at purchase amount
  if (calculatedVoucherValue > purchaseAmount) {
    return purchaseAmount;
  }

  return calculatedVoucherValue;
};

/**
 * UsedVoucherList component that displays voucher information
 */
const UsedVoucherList = ({
  voucherData,
  purchaseAmount = 0,
  hideShipping = false,
  shippingCostAmount = 0,
}) => {
  const { t } = useLanguage();

  if (!voucherData || (!voucherData.shipping && !voucherData.purchase)) {
    return <></>;
  }

  return (
    <>
      {voucherData.purchase && (
        <div className="flex justify-between text-xs font-medium">
          <div className="w-[148px] text-neutral-600">
            <span>{t("AppMuatpartsDashboardSellerVoucher")} : </span>
            <span className="inline-block max-w-[80px] truncate align-bottom">
              {voucherData.purchase.details.kodeVoucher}
            </span>
          </div>
          <div className="text-right text-error-400">
            -
            {numberFormatMoney(
              calculateVoucherValue(voucherData.purchase, purchaseAmount)
            )}
          </div>
        </div>
      )}
      {voucherData.shipping && !hideShipping && (
        <div className="flex justify-between text-xs font-medium">
          <div className="w-[148px] text-neutral-600">
            <span>{t("AppMuatpartsDashboardSellerVoucher")} : </span>
            <span className="inline-block max-w-[80px] truncate align-bottom">
              {voucherData.shipping.details.kodeVoucher}
            </span>
          </div>
          <div className="text-right text-error-400">
            -
            {numberFormatMoney(
              calculateVoucherValue(voucherData.shipping, shippingCostAmount)
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UsedVoucherList;
