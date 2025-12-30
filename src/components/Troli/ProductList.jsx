import { useCallback, useEffect, useRef, useState } from "react";
import style from "./Troli.module.scss";
import Image from "next/image";
import Checkbox from "../Checkbox/Checkbox";
import IconComponent from "../IconComponent/IconComponent";
import QuantityInput from "../QuantityInput/QuantityInput";
import ModalComponent from "../Modals/ModalComponent";
import TextArea from "../TextArea/TextArea";
import Button from "../Button/Button";
import { numberFormatMoney } from "@/libs/NumberFormat";
import Modal from "../Modals/modal";
import debounce from "@/libs/debounce";
import SWRHandler from "@/services/useSWRHook";
import { useLanguage } from "@/context/LanguageContext";
import useWishlist from "@/store/wishlist";

const ProductList = ({
  product: initialProduct,
  index,
  locationId,
  onDeleteCart,
  onPutCart,
  onUpdateProduct,
  mutateCart,
}) => {
  const { t } = useLanguage();
  const [product, setProduct] = useState(initialProduct);
  const [note, setNote] = useState(initialProduct.Notes);
  const [modalNote, setModalNote] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const { setModalListFavorite, setIdProductWishlist } = useWishlist();

  useEffect(() => {
    setProduct(initialProduct);
    setNote(initialProduct.Notes);
  }, [initialProduct]);

  const debouncedEffect = useCallback(
    debounce((updatedProduct) => {
      onPutCart({
        itemId: updatedProduct.ID,
        quantity: updatedProduct.Quantity,
        notes: updatedProduct.Notes,
        locationId: locationId,
        isChecked: updatedProduct.Checked,
      });

      onUpdateProduct(index, updatedProduct);
    }, 500),
    []
  );

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === product?.Quantity) return;

    debouncedEffect({
      ...product,
      Quantity: newQuantity,
    });
  };

  const renderDiscount = (discount, originalPrice) => {
    if (discount > 0) {
      return (
        <div className="flex gap-2 items-center">
          <strike className="text-neutral-600">
            {numberFormatMoney(originalPrice)}
          </strike>
          <div className="bg-error-400 rounded p-1 font-semibold text-white leading-none">
            {discount}% OFF
          </div>
        </div>
      );
    }
    return null;
  };

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

  return (
    <>
      <div className="flex gap-5 items-start py-4">
        <Checkbox
          label=""
          checked={product?.Checked}
          onChange={(e) => {
            debouncedEffect({ ...product, Checked: e.checked });
          }}
          classname="!gap-0"
        />
        <div className="w-full">
          <div className="flex gap-5 w-full mb-5">
            <div className="relative w-[56px] h-[56px]">
              <Image
                src={product?.Photo}
                fill
                style={{ objectFit: "cover" }}
                alt={product?.Name}
              />
            </div>
            <div className="flex w-full justify-between">
              <div className="w-[450px] space-y-3 text-xs">
                <div className="font-bold">{product?.Name}</div>
                <div className="flex gap-3 items-center">
                  {product?.Stock < 10 && (
                    <>
                      <div className="text-error-400 font-bold">
                        Tersisa {product?.Stock} {t("labelProduk")}
                      </div>
                      <div className="w-px h-2 bg-black"></div>
                    </>
                  )}
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
                </div>
              </div>
              <div className="text-xs space-y-2">
                {renderDiscount(
                  product?.Discount,
                  product?.PriceBeforeDiscount
                )}
                <div className="font-bold text-right">
                  {numberFormatMoney(product?.PriceAfterDiscount)}
                </div>
              </div>
            </div>
          </div>
          {product?.Notes && (
            <div className="text-xs text-neutral-600 w-[500px] -mb-1 line-clamp-1">
              {t("KontrakHargaIndexCatatan")} : {product?.Notes}
            </div>
          )}
          <div className="flex justify-between items-center">
            <div
              className={`${style.textButtonPrimary} ${style.active}`}
              onClick={() => setModalNote(true)}
            >
              {product?.Notes ? t("AppMuatpartsDetailPembayaranUbahCatatan") : t("labelTambahCatatan")}
            </div>
            <div className="flex gap-6 items-center">
              <IconComponent
                src={"/icons/heart-outline.svg"}
                classname={product?.Wishlist ? style.liked : ""}
                onclick={() =>
                  product?.Wishlist
                    ? triggerWishlistDelete({
                        data: { productId: product?.ProductID },
                      })
                    : (() => {
                        setModalListFavorite(true);
                        setIdProductWishlist(product?.ProductID);
                        triggerWishlist({ productId: product?.ProductID });
                      })()
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
                onChange={handleQuantityChange}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalComponent
        hideHeader
        isOpen={modalNote}
        setClose={() => {
          setNote(initialProduct.Notes);
          setModalNote(false);
        }}
        classnameContent={"w-[471px]"}
      >
        <div className="pb-7 pt-3 px-5 space-y-4">
          <div className="font-bold text-center">{product?.Notes ? t("AppMuatpartsDetailPembayaranUbahCatatan") : t("labelTambahCatatan")}</div>
          {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0690 */}
          <TextArea
            value={note}
            placeholder={t("LabelmodalTambahNotesTuliscatatankamuuntukprodukini")}
            maxLength={250}
            hasCharCount
            resize="none"
            status={""}
            changeEvent={(e) =>
              !note && e.target.value.startsWith(" ")
                ? null
                : setNote(e.target.value)
            }
          />
          <Button
            Class="mx-auto !h-8 !font-semibold"
            onClick={() => {
              debouncedEffect({ ...product, Notes: note });
              setModalNote(false);
            }}
          >
            {t("LabelmodalTambahNotesSimpanCatatan")}
          </Button>
        </div>
      </ModalComponent>

      <Modal
        isOpen={modalDelete}
        setIsOpen={setModalDelete}
        closeArea={false}
        closeBtn={true}
      >
        <div className="space-y-6">
          <div className="text-center font-medium text-sm">
            Apakah kamu yakin ingin menghapus produk dari Troli?
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button
              color="primary_secondary"
              onClick={() => {
                setModalDelete(false);
              }}
              Class="!h-8 !font-semibold !pb-2"
            >
              {t("labelNo")}
            </Button>
            <Button
              onClick={() => {
                setModalDelete(false);
                onDeleteCart({
                  itemIds: [product?.ID],
                });
              }}
              Class="!h-8 !font-semibold !pb-2"
            >
              {t("labelYaHapus")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductList;
