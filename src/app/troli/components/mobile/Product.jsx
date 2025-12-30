import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import ModalComponent from "@/components/Modals/ModalComponent";
import QuantityInput from "@/components/QuantityInput/QuantityInput";
import { numberFormatMoney } from "@/libs/NumberFormat";
import toast from "@/store/toast";
import useTroliStore from "@/store/troli";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import style from "../TroliComponents.module.scss";
import Input from "@/components/Input/Input";
import ExpandableTextArea from "@/components/ExpandableTextArea/ExpandableTextArea";
import TextArea from "@/components/TextArea/TextArea";
import debounce from "@/libs/debounce";
import SWRHandler from "@/services/useSWRHook";

const Product = ({
  product: initialProduct,
  address,
  onPutCart,
  mutateCart,
}) => {
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0379
  const [product, setProduct] = useState(initialProduct);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalNote, setModalNote] = useState(false);

  const [tempNote, setTempNote] = useState("");

  const { setShowToast, setDataToast } = toast();
  const { setCartDelete } = useTroliStore();

  const { useSWRMutateHook, useSWRHook } = SWRHandler();

  const { data: resWishlist, trigger: triggerWishlist } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/wishlist`,
    "POST"
  );

  const { data: resWishlistDelete, trigger: triggerWishlistDelete } =
    useSWRMutateHook(`v1/muatparts/wishlist`, "DELETE");

  const GET_WISHLISTS_ENDPOINT = "v1/muatparts/cart/wishlists";

  const { data: resOnWishList, mutate: mutateOnWishlist } = useSWRHook(
    GET_WISHLISTS_ENDPOINT
  );

  const GET_RECOMMENDATIONS_ENDPOINT = "v1/muatparts/cart/recommendations";
  const { data: resRecommendations, mutate: mutateRecommendations } =
    useSWRHook(GET_RECOMMENDATIONS_ENDPOINT);

  useEffect(() => {
    if (resWishlist?.data?.Message.Code === 200) {
      mutateCart();
      mutateOnWishlist();
      mutateRecommendations();
    }
  }, [resWishlist]);

  useEffect(() => {
    if (resWishlistDelete?.data?.Message.Code === 200) {
      mutateCart();
      mutateOnWishlist();
      mutateRecommendations();
    }
  }, [resWishlistDelete]);

  useEffect(() => {
    setProduct(initialProduct);
    setTempNote(initialProduct.Notes);
  }, [initialProduct]);

  const renderDiscount = (discount, originalPrice) => {
    return (
      <>
        {discount > 0 && (
          <div className="flex gap-2 items-center">
            <strike className="text-neutral-600">
              {numberFormatMoney(originalPrice)}
            </strike>
            <div className="bg-error-400 rounded p-1 font-semibold text-white leading-none">
              {discount}% OFF
            </div>
          </div>
        )}
        <div className="font-bold text-sm">
          {numberFormatMoney(product?.PriceAfterDiscount)}
        </div>
      </>
    );
  };

  const debouncedEffect = useCallback(
    debounce((updatedProduct) => {
      onPutCart({
        itemId: updatedProduct.ID,
        quantity: updatedProduct.Quantity,
        notes: updatedProduct.Notes,
        locationId: address?.id,
        isChecked: updatedProduct.Checked,
      });
    }, 500),
    []
  );

  const handleDeleteProduct = () => {
    setCartDelete({
      itemIds: [product?.ID],
    });
    setModalDelete(false);
    setShowToast(true);
    setDataToast({
      type: "success",
      message: "1 produk telah terhapus",
    });
  };

  const handleSaveNote = () => {
    debouncedEffect({ ...product, Notes: tempNote });
    setModalNote(false);
  };

  return (
    <>
      <div className="space-y-2">
        {/* <pre>{JSON.stringify(product, null, 2)}</pre> */}
        <div className="flex items-start">
          <Checkbox
            label={null}
            checked={product?.Checked}
            onChange={(e) => {
              debouncedEffect({ ...product, Checked: e.checked });
            }}
          />
          <div className="">
            <div className="flex gap-3">
              <Image
                width={80}
                height={80}
                src={product?.Photo}
                className="border border-neutral-400 rounded"
              />
              <div className="text-xs space-y-2">
                <div className="font-medium">{product?.Name}</div>
                {product?.Variant && (
                  <div className="font-medium text-neutral-600">
                    {[
                      product?.Variant.variant_1_value,
                      product?.Variant.variant_2_value,
                    ]
                      .filter((val) => val)
                      .join(", ")}
                  </div>
                )}
                <div>
                  {renderDiscount(
                    product?.Discount,
                    product?.PriceBeforeDiscount
                  )}
                </div>
                {product?.Stock < 10 && (
                  <>
                    <div className="text-error-400 font-bold">
                      Tersisa {product?.Stock} produk
                    </div>
                  </>
                )}
              </div>
            </div>
            {product?.Notes && (
              <div className="text-xs font-medium mt-3">
                Catatan : {product?.Notes}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button
            className="text-xs text-primary-700 font-medium"
            onClick={() => setModalNote(true)}
          >
            {product?.Notes ? "Ubah Catatan" : "Tambah Catatan"}
          </button>
          <div className="flex items-center gap-2">
            <IconComponent
              src={"/icons/heart-outline.svg"}
              classname={product?.Wishlist ? style.liked : ""}
              onclick={
                () =>
                  product?.Wishlist
                    ? triggerWishlistDelete({
                        data: { productId: product?.ProductID },
                      })
                    : triggerWishlist({ productId: product?.ProductID })
                // setProduct({
                //   ...product,
                //   Wishlist: !product?.Wishlist,
                // })
              }
            />
            <IconComponent
              src={"/icons/trash-az.svg"}
              onclick={() => setModalDelete(true)}
            />
            <QuantityInput
              maxStock={product?.Stock}
              minQuantity={product?.MinPurchase}
              initialValue={product?.Quantity}
              onChange={(val) => {
                if (val === product?.Quantity) return;
                debouncedEffect({ ...product, Quantity: val });
              }}
            />
          </div>
        </div>
      </div>

      <ModalComponent
        isOpen={modalDelete}
        setClose={() => setModalDelete(false)}
        hideHeader
        classnameContent={"py-6 px-4 text-center w-[296px] space-y-3"}
      >
        <div className="font-bold !mt-0">Hapus produk</div>
        <div className="text-sm font-medium">
          Apakah kamu yakin ingin menghapus produk dari troli?
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            Class="h-7 !font-semibold"
            children="Batal"
            color="primary_secondary"
            onClick={() => setModalDelete(false)}
          />
          <Button
            Class="h-7 !font-semibold"
            children="Ya"
            color="primary"
            onClick={() => handleDeleteProduct()}
          />
        </div>
      </ModalComponent>
      <ModalComponent
        isOpen={modalNote}
        setClose={() => setModalNote(false)}
        type="BottomSheet"
        hideHeader
        title="Tambah Catatan"
      >
        <div className="px-4 pb-6 space-y-3 h-min">
          <ExpandableTextArea
            value={tempNote}
            placeholder="Masukkan Catatan"
            textareaClassname="font-semibold text-sm"
            maxLength={250}
            onChange={(e) =>
              !tempNote && e.target.value.startsWith(" ")
                ? null
                : setTempNote(e.target.value)
            }
          />

          <div className="text-right font-medium text-xs text-neutral-600">{`${tempNote.length} / 250`}</div>

          <Button
            Class="h-10 !font-semibold min-w-full"
            children="Simpan Catatan"
            color="primary"
            onClick={() => handleSaveNote()}
          />
        </div>
      </ModalComponent>
    </>
  );
};

export default Product;
