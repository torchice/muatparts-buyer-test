import { numberFormatMoney } from "@/libs/NumberFormat";
import React from "react";
import ProductPrice from "./ProductPrice";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useCustomRouter } from "@/libs/CustomRoute";
import SWRHandler from "@/services/useSWRHook";
import Button from "../Button/Button";
import { userLocationZustan } from "@/store/manageLocation/managementLocationZustand";
import toast from "@/store/toast";

const ProductItem = ({
  id = null,
  photo,
  productName,
  variant,
  notes,
  discount,
  priceAfterDiscount,
  priceBeforeDiscount,
  variantID,
  qty,
  atDetail = false,
  orderStatus = ''
}) => {
  const router = useCustomRouter();

  const { t } = useLanguage();
  const { selectedLocation } = userLocationZustan();
  const { setDataToast, setShowToast } = toast();

  const { useSWRMutateHook, useSWRHook } = SWRHandler();
  const { trigger: addToTroliBulk, error: errorAddToTroliBulk } =
    useSWRMutateHook(
      process.env.NEXT_PUBLIC_GLOBAL_API + "v1/muatparts/cart/bulk_item"
    );
  const beliLagiMethod = () => {
    addToTroliBulk({
      cart: [
        {
          locationId: selectedLocation.ID,
          items: [
            {
              isChecked: true,
              productId: id,
              variantId: variantID || null,
              quantity: qty,
              notes: notes,
            },
          ],
        },
      ],
    })
      .then(() => router.push("/troli"))
      .catch((err) => {
        if (err) {
          setShowToast(true);
          setDataToast({
            type: "error",
            message: err?.response?.data?.Message.Text,
          });
        }
      });
  };

  return (
    <div className="flex items-start gap-5">
      <Image
        src={
          photo.startsWith("http")
            ? photo
            : "https://placehold.co/250x250/blue/white.png"
        }
        alt={productName}
        className="w-14 h-14 object-cover rounded-md"
        width={56}
        height={56}
      />
      <div className="w-[460px]">
        <div className="font-bold text-xs mb-2">{productName}</div>
        <div className="text-xs text-neutral-600 font-medium mb-1">
          {variant}
        </div>
        {notes && (
          <div className="text-xs text-neutral-600 font-medium">
            {t("KontrakHargaIndexCatatan")} : {notes}
          </div>
        )}
      </div>
      <div className="flex-grow">
        <div className="text-right">
          <ProductPrice
            discount={discount}
            priceAfterDiscount={numberFormatMoney(priceAfterDiscount)}
            priceBeforeDiscount={numberFormatMoney(priceBeforeDiscount)}
            qty={qty}
          />
        </div>

        {(atDetail && orderStatus === 'Selesai') && (
          <Button
            color="primary"
            children={t("AppMuatpartsDaftarPesananBuyerBeliLagi")}
            Class="ml-auto mt-5 !h-8 !font-semibold !pb-2"
            onClick={() => beliLagiMethod()}
          />
        )}
      </div>
    </div>
  );
};

export default ProductItem;
