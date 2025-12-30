import { useEffect, useState } from "react";
import style from "./OrderCard.module.scss";
import { MapPin } from "lucide-react";
import ProductList from "./ProductList";
import IconComponent from "../IconComponent/IconComponent";
import SelectShippingOption from "./SelectShippingOption";
import { numberFormatMoney } from "@/libs/NumberFormat";
import LocationManagementModalWeb from "@/containers/LocationManagementModalWeb/LocationManagementModalWeb";
import ModalPilihVoucher from "../Voucher/checkout/ModalPilihVoucher";
import ImageComponent from "../ImageComponent/ImageComponent";
import { useCheckoutStore } from "@/store/checkout";
import SWRHandler from "@/services/useSWRHook";
import { useLanguage } from "@/context/LanguageContext";
import useVoucherMuatpartsStore from "@/store/useVoucherMuatpartsStore";

const OrderCard = ({
  order: initialOrder,
  orderIndex,
  updateOrderItemExplicit,
}) => {
  const { t } = useLanguage();
  const { useSWRMutateHook } = SWRHandler();

  const [order, setOrder] = useState();
  const [openShippingOptions, setOpenShippingOptions] = useState(false);

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  const { checkPay, setCheckPay } = useCheckoutStore();

  const { clearAllShipping } = useVoucherMuatpartsStore();

  const setVoucherSellerPurchase = (data) => {
    setOrder((prev) => {
      // Check if the current purchase data matches the incoming data
      const currentPurchase = prev.sellerVouchers?.purchase;
      const isSameData =
        JSON.stringify(currentPurchase) === JSON.stringify(data);

      return {
        ...prev,
        sellerVouchers: {
          ...prev.sellerVouchers, // Preserve other voucher properties
          purchase: isSameData ? null : data, // Toggle: clear if same, set if different
        },
      };
    });
  };

  const setVoucherSellerShipping = (data) => {
    setOrder((prev) => {
      // Check if the current shipping data matches the incoming data
      const currentShipping = prev.sellerVouchers?.shipping;
      const isSameData =
        JSON.stringify(currentShipping) === JSON.stringify(data);
      return {
        ...prev,
        sellerVouchers: {
          ...prev.sellerVouchers, // Preserve other voucher properties
          shipping: isSameData ? null : data, // Toggle: clear if same, set if different
        },
      };
    });
  };

  const [modalVoucher, setModalVoucher] = useState(false);

  const [changeAddress, setChangeAddress] = useState(false);

  const totalQuantity = order?.products?.reduce(
    (acc, product) => acc + product.qty,
    0
  );

  function renderVoucherConditions() {
    const voucherCount =
      (order?.sellerVouchers?.shipping &&
      Object.keys(order.sellerVouchers.shipping).length > 0
        ? 1
        : 0) +
      (order?.sellerVouchers?.purchase &&
      Object.keys(order.sellerVouchers.purchase).length > 0
        ? 1
        : 0);

    const buttonProps = { onClick: () => setModalVoucher(true) };

    if (voucherCount > 0) {
      return (
        <button
          {...buttonProps}
          className="flex items-center text-xs font-medium text-primary-700"
        >
          <div className="pt-px">
            {voucherCount} {t("labelVoucherTerpilih")}
          </div>
        </button>
      );
    }

    return (
      <button
        {...buttonProps}
        className={`${style.textButtonPrimary} ${style.active}`}
      >
        {t("labelGunakanVoucherPenjual")}
      </button>
    );
  }

  const SHIPPING_COST_EP =
    process.env.NEXT_PUBLIC_GLOBAL_API + "v1/muatparts/order/shipping_cost";

  const {
    data: resShippingCost,
    trigger: triggerShippingCost,
    error: errorShippingCost,
    isMutating: loadingShippingCost,
  } = useSWRMutateHook(SHIPPING_COST_EP, "POST");

  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0155
  const handleSaveAlamatMultiple = (val) => {
    setCheckPay(false);

    updateOrderItemExplicit(orderIndex, "shippingAddress", val);
    const payload = {
      sellerID: order.seller.id,
      locationID: val.ID,
      products: order.products.map((product) => ({
        id: product.id,
        variantID: product.variant?.id || "",
        salesType: product.salesType || "Satuan/Ecer",
        qty: product.qty,
      })),
    };

    triggerShippingCost(payload).then((res) => {
      updateOrderItemExplicit(
        orderIndex,
        "shippingOptions",
        res?.data?.Data?.shippingCost
      );
    });
  };

  return (
    <>
      <div className="px-8 py-5 shadow-muatmuat rounded-xl space-y-3 mt-6 first:mt-0">
        <div className="font-bold ">
          {t("AppKomplainBuyerIndexPesanan")} {orderIndex + 1}
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <IconComponent
              src={"/icons/product-house.svg"}
              width={24}
              height={24}
            />
            <div className="text-xs font-semibold">
              {order?.seller?.storeName}
            </div>
          </div>
          {renderVoucherConditions()}
        </div>
        <div className="flex items-center px-4 py-2 bg-neutral-200 gap-2 rounded-md">
          <MapPin size={16} className="text-neutral-700" />
          <div className="font-medium text-xs capitalize">
            {t("labelDikirimDari")} : {order?.seller?.cityName?.toLowerCase()}
          </div>
        </div>
        <div
          className={`flex items-center px-4 py-2 gap-2 rounded-md border ${
            // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer LB-0079
            !order?.shippingAddress?.ID && checkPay
              ? "border-error-400"
              : "border-neutral-400"
          }`}
        >
          <MapPin size={16} className="text-neutral-700" />
          <div className="font-medium text-xs capitalize">
            {t("labelDikirimKe")} :{" "}
            <strong>{order?.shippingAddress?.Name?.toLowerCase()}</strong>
          </div>
          <button
            className={`ml-auto ${style.textButtonPrimary} ${style.active}`}
            onClick={() => setChangeAddress(true)}
          >
            {t("labelUbahAlamatTujuan")}
          </button>
        </div>
        {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer LB-0079 */}
        {!order?.shippingAddress?.ID && checkPay && (
          <div className="text-xs font-medium text-error-400 !mt-1.5">
            Alamat tujuan wajib diisi
          </div>
        )}
        <div className="divide-y">
          {order?.products?.map((product, index) => (
            <ProductList
              key={product.id}
              item={product}
              updateProductNote={(notes) =>
                updateOrderItemExplicit(orderIndex, "product", {
                  index,
                  notes,
                })
              }
            />
          ))}
        </div>

        {/* <pre>
          {JSON.stringify(order?.selectedShipping, null, 2)}
        </pre> */}

        <SelectShippingOption
          selected={order?.selectedShipping}
          options={order?.shippingOptions}
          isOpen={openShippingOptions}
          setIsOpen={setOpenShippingOptions}
          onChange={(val) => {
            updateOrderItemExplicit(orderIndex, "selectedShipping", val);
          }}
        />
        <div className="font-semibold">{t("labelSubTotalBuyer")}</div>
        <div className="flex justify-between">
          <div className="text-neutral-600 font-medium text-xs">
            Harga Produk ({totalQuantity} item)
          </div>
          <div className="font-medium text-xs">
            {numberFormatMoney(order?.totalAmount)}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-neutral-600 font-medium text-xs">
            {t("AppKelolaProdukMuatpartsTambahBiayaPengiriman")}
          </div>
          <div className="font-medium text-xs">
            {order?.selectedShipping
              ? numberFormatMoney(order?.selectedShipping.buyerCost)
              : "-"}
          </div>
        </div>
      </div>

      <LocationManagementModalWeb
        isOpen={changeAddress}
        setClose={() => setChangeAddress(false)}
        onSaveChange={(val) => {
          setOpenShippingOptions(false);
          handleSaveAlamatMultiple(val);
          updateOrderItemExplicit(orderIndex, "selectedShipping", null);
        }}
        preventDefaultSave={true}
        defaultValue={order?.shippingAddress}
      />

      <ModalPilihVoucher
        isOpen={modalVoucher}
        setIsOpen={setModalVoucher}
        sellerId={order?.seller?.id}
        productIds={order?.products?.map((item) => item.id)}
        setUsedVoucher={setVoucherSellerShipping}
        setUsedTransaction={setVoucherSellerPurchase}
        usedVoucher={order?.sellerVouchers?.shipping}
        usedTransaction={order?.sellerVouchers?.purchase}
        totalUserTransaction={order?.totalAmount}
        sellerName={order?.seller?.storeName}
        onSubmit={() => {
          setModalVoucher(false);
          if (order.sellerVouchers?.shipping) clearAllShipping();
          updateOrderItemExplicit(orderIndex, "sellerVouchers", {
            shipping: order.sellerVouchers?.shipping,
            purchase: order.sellerVouchers?.purchase,
          });
        }}
      />
    </>
  );
};

export default OrderCard;
