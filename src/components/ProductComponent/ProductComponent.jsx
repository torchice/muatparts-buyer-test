import React, { useEffect, useState } from "react";
import style from "./ProductComponent.module.scss";
import Image from "next/image";
import SWRHandler from "@/services/useSWRHook";
import IconComponent from "../IconComponent/IconComponent";
import { numberFormatMoney } from "@/libs/NumberFormat";
import { useCustomRouter } from "@/libs/CustomRoute";
import CustomLink from "../CustomLink";
import AlbumWishlist, {
  FavoriteWishlistResponsive,
} from "../AlbumWishist/AlbumWishlist";
import useWishlist from "@/store/wishlist";
import { authZustand } from "@/store/auth/authZustand";
import { EllipsisVertical } from "lucide-react";
import Checkbox from "../Checkbox/Checkbox";
import useAlbumStore from "@/store/album";
import ConfigUrl from "@/services/baseConfig";
import Button from "../Button/Button";
import useTroliStore from "@/store/troli";
import { userLocationZustan } from "@/store/manageLocation/managementLocationZustand";
import { userZustand } from "@/store/auth/userZustand";
import { viewport } from "@/store/viewport";
import { NewAlbumBottomsheet } from "@/app/album/AlbumResponsive";
import toast from "@/store/toast";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

function ProductComponent({
  ID,
  Photo,
  Stock,
  Favorite,
  Name,
  Store,
  PriceBeforeDiscount,
  PriceAfterDiscount,
  Discount,
  Rating,
  ReviewCount,
  SalesType,
  SellerID,
  Views,
  Quality,
  City,
  SoldCount,
  Bonus,
  CreatedAt,
  Variant,
  Wishlist,
  MinPurchase,
  parentClassname,
  classname,
  AtAlbum = false,
  AtTroli = false,
  Selected = false,
  IsBatch = false,
  AlbumType,
  Grade,
  OnSelect,
}) {
  const { isMobile } = viewport();
  const { t } = useLanguage();
  const router = useCustomRouter();
  const { useSWRHook, useSWRMutateHook } = SWRHandler();
  const { id } = userZustand();
  const [wishlistState, setWishlistState] = useState(Wishlist);
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    setModalMoveAlbum,
    setAddItems,
    setMoveAlbumItems,
    setFetchDetail,
    setFetchAlbum,
  } = useAlbumStore();
  const { setModalListFavorite, setIdProductWishlist } = useWishlist();
  const { accessToken } = authZustand();
  const {
    setShowBottomsheet,
    setDataBottomsheet,
    setTitleBottomsheet,
    setShowToast,
    setDataToast,
  } = toast();

  const pathname = usePathname();
  const albumID = pathname.split("/").pop();

  const { data: resDeleteAlbumItems, trigger: deleteAlbumItems } =
    useSWRMutateHook(`v1/muatparts/albums/${albumID}/items`, "DELETE");

  const { locations, setLocation, selectedLocation } = userLocationZustan();

  const { setCartBody } = useTroliStore();

  const { data: resWishlist, trigger: triggerWishlist } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/wishlist`,
    "POST"
  );

  const GET_WISHLISTS_ENDPOINT = id ? "v1/muatparts/cart/wishlists" : null;
  const { data: resOnWishList, mutate: mutateOnWishlist } = useSWRHook(
    GET_WISHLISTS_ENDPOINT
  );

  const ALBUM_ENDPOINT = id ? "v1/muatparts/albums" : null;
  const { data: resAlbum, mutate: mutateAlbum } = useSWRHook(ALBUM_ENDPOINT);

  const GET_CART_ENDPOINT = id ? "v1/muatparts/cart" : null;
  const { data: resCart, mutate: mutateCart } = useSWRHook(GET_CART_ENDPOINT);

  const GET_RECOMMENDATIONS_ENDPOINT = id
    ? "v1/muatparts/cart/recommendations"
    : null;
  const { data: resRecommendations, mutate: mutateRecommendations } =
    useSWRHook(GET_RECOMMENDATIONS_ENDPOINT);

  useEffect(() => {
    if (resWishlist?.data?.Message.Code === 200) {
      mutateAlbum();
      mutateOnWishlist();
      mutateRecommendations();
      mutateCart();
    }
  }, [resWishlist]);

  const { data: resWishlistDelete, trigger: triggerWishlistDelete } =
    useSWRMutateHook(`v1/muatparts/wishlist`, "DELETE");

  useEffect(() => {
    if (resWishlistDelete) {
      setFetchDetail(true);
    }
  }, [resWishlistDelete]);

  useEffect(() => {
    if (resDeleteAlbumItems) {
      setFetchDetail(true);
    }
  }, [resDeleteAlbumItems]);

  const { deleted } = ConfigUrl();

  const klikWishlist = (e) => {
    if (!accessToken) {
      router.push(process.env.NEXT_PUBLIC_INTERNAL_WEB + "login");
      return false;
    }
    const data = {
      productId: ID,
    };
    if (accessToken) {
      e.preventDefault();
      if (!wishlistState) {
        triggerWishlist(data);
        setIdProductWishlist(ID);
        setAddItems([ID]);
        if (!isMobile) {
          setModalListFavorite(true);
        } else {
          // gae responsive e favorit bottomsheet
          setShowBottomsheet(true);
          setTitleBottomsheet("Tersimpan di Favorit!");
          setDataBottomsheet(
            <FavoriteWishlistResponsive
              data={resAlbum?.Data?.albums}
              product={ID}
              mutateAlbum={mutateAlbum}
              onAddNewAlbum={() => {
                setShowBottomsheet(true);
                setTitleBottomsheet("Tambah Album Baru");
                setDataBottomsheet(
                  <NewAlbumBottomsheet
                    data={resAlbum?.Data?.albums}
                    product={ID}
                    mutateAlbum={mutateAlbum}
                    onSuccess={() => {
                      mutateAlbum();
                      setShowBottomsheet(false);
                      setDataToast({
                        type: "success",
                        message: "Berhasil membuat album baru",
                      });
                      setShowToast(true);
                    }}
                  />
                );
              }}
            />
          );
        }
        setWishlistState(true);
      } else {
        deleted({
          path: "v1/muatparts/wishlist",
          options: {
            data,
          },
        })
          .catch((a) => console.log(a))
          .then((a) => {
            mutateAlbum();
            mutateOnWishlist();
            mutateRecommendations();
            mutateCart();
            setWishlistState(false);
          });
      }
    }
  };

  const handleClickOutside = (event) => {
    if (menuOpen && !event.target.closest(`.toggle-menu-${ID}`)) {
      setMenuOpen(false);
    }
  };

  // chat titip
  const { trigger: submitDataRoom } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_CHAT_API}api/rooms/muat-muat`,
    "POST",
    null,
    null,
    { loginas: "buyer" }
  );
  const directChatRoom = () => {
    const body = {
      recipientMuatId: SellerID || null,
      recipientRole: "seller",
      menuName: "Muatparts",
      subMenuName: "Muatparts",
      message: "",
      initiatorRole: "buyer",
    };
    submitDataRoom(body).then((x) => {
      setTimeout(() => {
        router.push(
          `${
            process.env.NEXT_PUBLIC_CHAT_URL
          }initiate?initiatorId=&initiatorRole=${
            body.initiatorRole
          }&recipientId=${body.recipientMuatId}&recipientRole=${
            body.recipientRole
          }&menuName=${body.menuName}&subMenuName=${
            body.subMenuName
          }&accessToken=${authZustand.getState().accessToken}&refreshToken=${
            authZustand.getState().refreshToken
          }`
        );
      }, 2000);
    });
  };
  // chat titip

  const productButton = () => {
    if (Stock > 0) {
      return {
        text: t("labelTambahKeTroli"),
        action: async () => {
          await setCartBody({
            quantity: MinPurchase,
            productId: ID,
            notes: "",
            locations: selectedLocation?.ID,
            variantId: Variant?.id || Variant?.ID,
          });
        },
      };
    }

    return {
      text: Wishlist
        ? t("AppMuatpartsDaftarPesananBuyerChatPenjual")
        : t("labelIngatkanSayaBuyer"),
      action: () => {
        Wishlist
          ? directChatRoom()
          : triggerWishlist({
              productId: ID,
            });
      },
    };
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0600
    <div className={`${style.parent} ${parentClassname}`}>
      {IsBatch && (
        <div className="absolute z-30 w-4 h-4 ml-2 mt-2">
          <Checkbox
            label=""
            checked={Selected}
            onChange={() => OnSelect(ID)}
            classname="w-full !gap-0 bg-white rounded-md"
          />
        </div>
      )}

      {IsBatch && (
        <div
          className={`absolute inset-0  z-10 rounded-[5px] cursor-pointer ${
            Selected ? "" : "bg-black/30"
          }`}
          onClick={() => OnSelect(ID)}
        ></div>
      )}

      {AtAlbum ? (
        !IsBatch ? (
          <div className={`absolute top-0 right-0 m-2 z-10 toggle-menu-${ID}`}>
            <div
              className="bg-white rounded-full p-2 cursor-pointer shadow-muatmuat"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <EllipsisVertical size={18} className="text-neutral-700" />
            </div>
            {menuOpen && (
              <div className="absolute top-10 right-[-2px] w-[159px] bg-white border border-gray-200 rounded-md shadow-lg z-10 text-xs">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setModalMoveAlbum(true);
                    if (AlbumType === "GENERAL") {
                      setAddItems([ID]);
                    }
                    if (AlbumType === "CUSTOM") {
                      setMoveAlbumItems([ID]);
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-t-md text-neutral-900 hover:bg-gray-100"
                >
                  {AlbumType === "GENERAL"
                    ? t("AppMuatpartsWishlistTambahkanKe")
                    : t("AppMuatpartsWishlistPindahkanKe")}
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (AlbumType === "GENERAL") {
                      triggerWishlistDelete({ data: { productId: ID } });
                    }
                    if (AlbumType === "CUSTOM") {
                      deleteAlbumItems({
                        data: {
                          itemIds: [ID],
                        },
                      })
                        .then(() => {
                          setDataToast({
                            type: "success",
                            message: "Berhasil menghapus barang",
                          });
                          setShowToast(true);
                        })
                        .catch(() => {
                          setDataToast({
                            type: "error",
                            message: "Gagal menghapus barang",
                          });
                          setShowToast(true);
                        });
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-b-md text-error-400 hover:bg-gray-100"
                >
                  {t("AppMuatpartsWishlistHapus")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`absolute top-0 right-0 m-2 z-20 toggle-menu-${ID}`}
          ></div>
        )
      ) : (
        <span className="absolute right-0 m-2 w-7 h-7 rounded-full bg-neutral-50 grid place-content-center z-20">
          <IconComponent
            onclick={(event) => klikWishlist(event)}
            src={
              wishlistState
                ? "/icons/icon-love-wishlist.svg"
                : "/icons/heart-outline.svg"
            }
          />
        </span>
      )}

      <CustomLink
        className={`${style.main} ${classname}  ${
          AtTroli || AtAlbum ? "!h-[420px]" : ""
        }`}
        href={`/${Store}/${Name}`}
      >
        <div className={style.sectionTop}>
          <Image
            src={Photo ? Photo : "https://prd.place/170?id=1.png"}
            width={200}
            height={200}
            alt={Name}
            className="rounded-t-[5px] object-contain aspect-square"
          />
          <div className="absolute bottom-1 left-1 flex gap-x-1">
            {SalesType === "Grosir" && (
              <div className="h-6 px-1 bg-primary-50 rounded-md flex">
                <div className="my-auto font-semibold text-[12px] leading-[14.4px] text-primary-700">
                  {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0529 */}
                  {t("LabelproductCardGrosir")}
                </div>
              </div>
            )}
            {Stock < 10 ? (
              <div className="h-6 px-1 bg-error-50 rounded-md flex">
                <div className="my-auto font-semibold text-[12px] leading-[14.4px] text-error-400">
                  {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0529 */}
                  {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0980 */}
                  {Stock === 0
                    ? t("HomepageBuyerMuatpartsOutofStock")
                    : `${t("LabelproductCardSisa")} ${Stock} Pcs`}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className={style.sectionBottom}>
          <span className="bg-warning-100 py-1 px-3 my-2 w-fit rounded-r-[20px] text-xs font-semibold text-warning-900 capitalize">
            {t("labelkualitasBuyer")} : {Quality || Grade}
          </span>
          <div className="px-2">
            <h1 className="text-xs font-medium text-neutral-900 w-full line-clamp-2 leading-tight mb-0.5">
              {Name}
            </h1>
            {PriceBeforeDiscount !== PriceAfterDiscount ? (
              <>
                <div className="flex gap-1 items-center mb-0.5">
                  <strike className="text-neutral-600 text-[10px] font-medium">
                    {numberFormatMoney(PriceBeforeDiscount)}
                  </strike>
                  <p className={style.discount}>
                    {typeof Discount === "number"
                      ? `${Discount}% OFF`
                      : Discount}
                  </p>
                </div>
                <h1 className="text-neutral-900 text-sm font-bold">
                  {numberFormatMoney(PriceAfterDiscount)}
                </h1>
              </>
            ) : (
              <h1 className="text-neutral-900 text-sm font-bold">
                {numberFormatMoney(PriceBeforeDiscount)}
              </h1>
            )}
            <div className="space-y-1 mt-1">
              {Bonus?.length ? (
                <div className="flex gap-1 items-center">
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/gift.svg"
                    }
                    width={16}
                    height={16}
                    alt="gift"
                  />
                  {Bonus && (
                    <span className="text-neutral-700 font-medium text-[12px]">
                      {typeof Bonus === "string"
                        ? Bonus
                        : Bonus?.[0]?.["description"]}
                    </span>
                  )}
                </div>
              ) : (
                ""
              )}
              <div className="flex gap-1 items-center">
                <Image
                  src={
                    process.env.NEXT_PUBLIC_ASSET_REVERSE +
                    "/icons/product-house.svg"
                  }
                  width={16}
                  height={16}
                  alt="house"
                />
                <span className="text-neutral-700 font-medium text-[12px] line-clamp-1">
                  {Store}
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <Image
                  src={
                    process.env.NEXT_PUBLIC_ASSET_REVERSE +
                    "/icons/product-marker.svg"
                  }
                  width={16}
                  height={16}
                  alt="City"
                />
                {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0684*/}
                <span className="text-neutral-700 font-medium text-[12px] capitalize line-clamp-1">
                  {City?.toLowerCase()}
                </span>
              </div>

              <div className="flex gap-1 items-center">
                {Rating > 0 && (
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_ASSET_REVERSE +
                      "/icons/product-star.svg"
                    }
                    width={16}
                    height={16}
                    alt="Rating"
                  />
                )}
                <span className="text-neutral-700 font-medium text-[12px] pt-0.5">
                  {Rating > 0 && `${Rating}${SoldCount > 0 ? " · " : ""}`}
                  {SoldCount > 0 && `${t("labelTerjualBuyer")} ${SoldCount}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CustomLink>

      {(AtTroli || AtAlbum) && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Button
            children={productButton().text}
            color="primary_secondary"
            Class="!min-w-[144px] xl:!min-w-[154px] !h-8 !text-xs xl:!text-sm !font-semibold"
            onClick={productButton().action}
          />
        </div>
      )}
    </div>
  );
}

export default ProductComponent;
