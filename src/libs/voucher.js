export function getVoucherValue(voucher, transactionAmount = 0) {

  const discountValue = +voucher?.discountValue || 0;
  const discountMax = +voucher?.discountMax || 0;
  const voucherType = voucher?.discountType || "Nominal";
  
  let calculatedDiscount;
  
  if (voucherType === "Nominal") {
    calculatedDiscount = discountValue;
  } else {
    // For "Persentase" type
    calculatedDiscount = (discountValue / 100) * transactionAmount;
    calculatedDiscount = discountMax ? Math.min(calculatedDiscount, discountMax) : calculatedDiscount;
  }
  
  // Apply the discount value, but ensure it doesn't exceed the transaction amount
  const appliedValue = Math.min(calculatedDiscount, transactionAmount);
  
  return appliedValue;
}