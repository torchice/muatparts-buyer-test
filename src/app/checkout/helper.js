export function mapOrderData(sourceData) {
  // Helper function to format estimated date
  const getEstimatedDate = (minDays, maxDays) => {
    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() + minDays);
    end.setDate(end.getDate() + maxDays);

    // Format dates as "DD MMM YYYY"
    const formatDate = (date) => {
      return (
        date.getDate() +
        " " +
        date.toLocaleString("default", { month: "short" }) +
        " " +
        date.getFullYear()
      );
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  // Map each order
  const mappedOrders = sourceData.orders.map((order) => {
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0154
    const items = order.products.map((product) => ({
      productName: product.productName,
      productID: product.id,
      promoID: product.promoID,
      variantID: product.variant?.id || null,
      quantity: product.qty,
      unitPrice: product.priceBeforeDiscount,
      discountPercentage: product.discount || "0",
      totalPrice: product.subtotal,
      note: product.notes,
      shippingcostBy:
        product.shippingCostBy === "Ditanggung oleh Pembeli"
          ? "buyer"
          : "seller",
      lenght: 1, // Default dimensions
      height: 1,
      width: 1,
      weight: 1,
    }));

    // Extract voucher IDs from both dataUsedVoucher and purchase
    const vouchersList = [];
    if (order.sellerVouchers) {
      if (order.sellerVouchers.shipping) {
        vouchersList.push({
          voucherID: order.sellerVouchers.shipping.uuid,
        });
      }
      if (order.sellerVouchers.purchase) {
        vouchersList.push({
          voucherID: order.sellerVouchers.purchase.uuid,
        });
      }
    }
    return {
      destinationAddress: {
        id: parseInt(order.shippingAddress.ID),
        addressName: order.shippingAddress.Name,
        contactPerson: order.shippingAddress.PicName,
        phone: order.shippingAddress.PicNoTelp,
        address: order.shippingAddress.Address,
        detailedAddress: order.shippingAddress.AddressDetail,
        destinationLat: order.shippingAddress.Latitude,
        destinationLng: order.shippingAddress.Longitude,
        isDropship: sourceData.isDropship,
        dropshipName: sourceData.dropshipValues.name || null,
        dropshipPhone: sourceData.dropshipValues.phone || null,
      },
      cartID: order.cartID || null,
      sellerID: order.seller.id,
      originLat: order.seller.originLat,
      originLng: order.seller.originLng,
      storeName: order.seller.storeName,
      shipFrom: order.seller.cityName,
      items, // Now includes all products
      shipping: {
        shippingType:
          order.selectedShipping?.isPickup ||
          order.selectedShipping?.isStoreCourier
            ? order.selectedShipping.id
            : "expedition",
        shippingItemID:
          order.selectedShipping?.isPickup ||
          order.selectedShipping?.isStoreCourier
            ? null
            : order.selectedShipping?.id,
        method: order.selectedShipping?.courierName,
        serviceType: order.selectedShipping?.groupName,
        estimatedDate: getEstimatedDate(
          order.selectedShipping?.minEstimatedDay,
          order.selectedShipping?.maxEstimatedDay
        ),
        insurance: order.selectedShipping?.isUseInsurance,
        insuranceCost: order.selectedShipping?.originalInsurance,
        shippingCost: order.selectedShipping?.originalCost,
        note: "",
        originAreaId: order.selectedShipping?.originAreaId,
        destinationAreaId: order.selectedShipping?.destinationAreaId,
      },
      vouchers: vouchersList,
      subTotal: sourceData.totalPayment,
    };
  });

  

  return {
    orders: mappedOrders,
    payment: {
      paymentMethodID: sourceData.selectedPayment.id,
      channel: sourceData.selectedPayment.channel,
      method: sourceData.selectedPayment.name,
      total: sourceData.totalPayment,
      totalAfterDiscount: sourceData.totalPayment,
      applicationFee: 0,
      vouchers: sourceData.mappedVoucherIDs,
    },
    info: {
      chartID: null,
    },
  };
}
