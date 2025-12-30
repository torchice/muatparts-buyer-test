import { useHeader } from "@/common/ResponsiveContext";
import React, { Fragment, useEffect, useState } from "react";
import style from "./DetailProductPage.module.scss";
import { numberFormatMoney } from "@/libs/NumberFormat";
import IconComponent from "@/components/IconComponent/IconComponent";
import Image from "next/image";
import Button from "@/components/Button/Button";
import ButtonBottomMobile from "@/components/ButtonBottomMobile/ButtonBottomMobile";
import KompatibilitasScreen from "./screens/KompatibilitasScreen";
import KompatibilitasSearchScreen from "./screens/KompatibilitasSearchScreen";
import MultipleAlamatScreen from "./screens/MultipleAlamatScreen";
import ListAddressContainerMobile from "../ListAddressContainerMobile/ListAddressContainerMobile";
import AddAddressContainerMobile from "../AddAddressContainerMobile/AddAddressContainerMobile";
import LocationManagementContainerMobile from "../LocationManagementContainerMobile/LocationManagementContainerMobile";
import ListLocationManagementMobile from "../LocationManagementContainerMobile/ListLocationManagementMobile";
import AddLocationManagementContainerMobile from "../LocationManagementContainerMobile/AddLocationManagementContainerMobile";
import ImageCarouselMobile from "@/components/ImageCarouselMobile/ImageCarouselMobile";
import ModalComponent from "@/components/Modals/ModalComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import SharedMediaSocial from "../SharedMediaSocial/SharedMediaSocial";
import Laporkan from "../LaporkanContainer/LaporkanContainer";
import ProductComponent from "@/components/ProductComponent/ProductComponent";
import { useCheckoutStore } from "@/store/checkout";
import { useCustomRouter } from "@/libs/CustomRoute";
import useTroliStore from "@/store/troli";
import { authZustand } from "@/store/auth/authZustand";
import { formatDate } from "@/libs/DateFormat";
import toast from "@/store/toast";
import SWRHandler from "@/services/useSWRHook";
import ToastApp from "@/components/ToastApp/ToastApp";
import { constructNow } from "date-fns";
import ConfigUrl from "@/services/baseConfig";
import { FavoriteWishlistResponsive } from "@/components/AlbumWishist/AlbumWishlist";
import { NewAlbumBottomsheet } from "@/app/album/AlbumResponsive";
import { lineClamp } from "@/libs/TypographServices";
import { useLanguage } from "@/context/LanguageContext";
// FIX BUG Pengecekan Ronda Muatparts LB-0089
import ReviewContainerResponsive from "./ReviewContainerResponsive";
import AllProductReviewScreen from "./screens/AllProductReviewScreen";
import Filter from "../Seller/Responsive/Review/Filter";
import { filterProduct } from "@/store/products/filter";
// LBM
import { generateThumbnail } from "@/libs/services";
// Improvement Impact Nonaktif User Seller Muatparts
import Modal from "@/components/Modals/modal";

function DetailProductPageResponsive({
  product,
  weekDays,
  locations,
  getExpanded,
  handleExpanded,
  showDescription,
  setShowDescription,
  today,
  DataPelanggaran,
  DataKompatibilitas,
  isLogin,
  IsJamOperationalOpen,
  selectedLocation,
  handleMultipleAlamatVariantProduct,
  setMultipleAlamatProducts,
  getMultipleAlamatProducts,
  isClosedStore,
  getTotalStock,
  validation,
  setValidation,
  getDateStoreOpen,
  isGrosir,
  addToTroliBulk,
  isVariant,
  errorAddToTroliBulk,
  check_compatibility,
  setSelectedLocations = () => {},
  setCompatibility = () => {},
  setTotalStock = () => {},
  // Ulasan
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 LB-0089
  reviews,
  sellerProfile,
  filter,
  setFilter,
  defaultFilter
}) {
  const router = useCustomRouter();
  const {
    setAppBar, // tambahkan payload seperti ini setAppBar({onBack:()=>setScreen('namaScreen'),title:'Title header',appBarType:'type'})
    setScreen, // set screen
    screen, // get screen,
    search,
    setSearch, // tambahkan payload seperti ini {placeholder:'Pencarian',value:'',type:'text'}
  } = useHeader();
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0419
  const filter_product = filterProduct()

  const { accessToken } = authZustand();
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 LB-0089
  const [tempRating, setTempRating] = useState([]);
  const [getModal, setModal] = useState("");
  const [getLocation, setLocation] = useState({
    labelAlamat: "",
    alamat: "",
  });
  const { setBuyNow } = useCheckoutStore();
  const { setCartBody } = useTroliStore();
  const [getSelectedVariant, setSelectedVariant] = useState();
  const [showCompleteDescription, setShowCompleteDescription] = useState(false);
  const [onLoad,setOnLoad]=useState(false)
  const [isMultiple, setIsMultiple] = useState(false);
  const [getVariants, setVariants] = useState({
    variant_one: product?.Variants?.variant_1_value[0],
    variant_two: product?.Variants?.variant_2_value[0],
  });
  const [getAmountProduct, setAmountProduct] = useState(1);
  const [getSelectedVariantName, setSelectedVariantName] = useState({
    variantName: "",
    variantValue: "",
  });
  const [getSelectedAddress, setSelectedAddress] = useState();
  const [getSelectedAddressEdit, setSelectedAddressEdit] = useState();
  const [getIndexLocationMultiple, setIndexLocationMultiple] = useState({
    index: 0,
    location: {},
  });
  const [showToastDrawer, setShowToastDrawer] = useState({
    show: false,
    msg: "",
  });
  const {t} = useLanguage()
  // FIX BUG Pengecekan Ronda Muatparts LB-0089
  const searchProps = {
    filter,
    setFilter,
    defaultFilter,
  };

  const {
    setShowToast,
    setDataToast,
    setShowBottomsheet,
    setDataBottomsheet,
    setTitleBottomsheet,
  } = toast();
  const { post, deleted } = ConfigUrl();
  const { useSWRHook,useSWRMutateHook } = SWRHandler();
  // chat titip
  const { trigger: submitDataRoom } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_CHAT_API}api/rooms/muat-muat`,
    "POST",
    null,
    null,
    { loginas: "buyer" }
  );
  // LB - 0194 / 25.03
  const directChatRoom = () => {
      const body = {
        recipientMuatId: product.sellerInfo.id,
        recipientRole: "seller",
        menuName: "Muatparts",
        subMenuName: "Muatparts",
        message: "",
        initiatorRole: "buyer",
      };
      submitDataRoom(body).then((x) => {
        setTimeout(() => {
          router.push(
            `${process.env.NEXT_PUBLIC_CHAT_URL}initiate?initiatorId=&initiatorRole=${body.initiatorRole
            }&recipientId=${body.recipientMuatId}&recipientRole=${body.recipientRole
            }&menuName=${body.menuName}&subMenuName=${body.subMenuName
            }&accessToken=${authZustand.getState().accessToken}&refreshToken=${authZustand.getState().refreshToken
            }`
          );
        }, 2000);
      });
    };
  // chat titip

  function handleLocation(label, value) {
    setLocation((a) => ({ ...a, [label]: value }));
  }

  // Improvement Ubah Design Variant UAT
  // function handleSelectVariant(value) {
  //   setSelectedVariantName((a) => ({ ...a, variantValue: value?.KeyName }));
  //   setSelectedVariant(value);
  // }
  const handleSelectVariant = (field, value) => {
    if (product?.Variants?.Combinations?.length && getVariants?.variant_one) {
      let tmp =
        `${getVariants.variant_one}` +
        `${getVariants.variant_two ? getVariants.variant_two : ''}`
      if(field==='variant_one') tmp=`${value}`+`${getVariants.variant_two ? getVariants.variant_two : ''}`
      if(field==='variant_two') tmp=`${getVariants.variant_one}`+`${value}`
      let stock = product?.Variants?.Combinations?.find((a) => a?.Code === tmp)?.Stock
      if(getAmountProduct>stock)  setAmountProduct(stock)
      setVariants(a => ({ ...a, [field]: value }))
      setSelectedVariant(
        product?.Variants?.Combinations?.find((a) => a?.Code === tmp)
      );
    }
    if (!product?.Variants?.Combinations?.length && !getVariants?.variant_one) setPrice({ ...product?.Pricing, Stock: product?.Stock, Code: product?.ProductInfo?.Title })
  }
  function handleClickHere() {
    // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0149
    if (!isLogin)
      return router.push(`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=mpbuyer&redirect=${window.location.href}`);
    setScreen("multiple_alamat");
    if (getMultipleAlamatProducts?.length > 1) {
      setIsMultiple(true);
      return;
    }
    let price_grosir = 0;
    if (isGrosir) {
      let grosir = product?.Wholesales;
      for (let i = 0; i < product?.Wholesales?.length; i++) {
        if (
          product?.ProductInfo?.MinOrder >= grosir[i]?.minPurchase &&
          grosir[i]?.maxPurchase == 0
        )
          price_grosir = grosir[i]?.price;
        if (
          product?.ProductInfo?.MinOrder >= grosir[i]?.minPurchase &&
          product?.ProductInfo?.MinOrder <= grosir[i]?.maxPurchase
        )
          price_grosir = grosir[i]?.price;
      }
    }
    setMultipleAlamatProducts([
      {
        location: selectedLocation,
        products: product?.Variants?.Combinations.length
          ? product?.Variants?.Combinations?.map((val) => ({
              ...val,
              Quantity: 0,
              Amount: val?.Stock ? parseInt(val?.Stock) : 0,
            }))
          : [
              {
                ID: product?.ID,
                Quantity: 0,
                Amount: product?.Stock ? parseInt(product?.Stock) : 0,
                Stock: product?.Stock ? parseInt(product?.Stock) : 0,
                DiscountPercentage: product?.Pricing?.DiscountPercentage,
                OriginalPrice: product?.Pricing?.OriginalPrice,
                Price: product?.Pricing?.Price,
                Code: product?.ProductInfo?.Title,
                PriceGrosir: price_grosir,
              },
            ],
      },
    ]);
    setTotalStock({
      totalStock: product?.Variants?.Combinations?.length
        ? product?.Variants?.Combinations?.map((val) => ({
            id: val?.ID,
            Amount: val?.Stock ? parseInt(val?.Stock) : 0,
            Stock: val?.Stock ? parseInt(val?.Stock) : 0,
          }))
        : [
            {
              id: product?.ID,
              Quantity: 0,
              Amount: product?.Stock ? parseInt(product?.Stock) : 0,
              Stock: product?.Stock ? parseInt(product?.Stock) : 0,
              PriceGrosir: price_grosir,
            },
          ],
    });
  }

  function handleChangeStockMulti(id, val, idx, increment = false) {
    let get_products = [...getMultipleAlamatProducts],
      tmp_product = { ...get_products[idx] },
      get_total_stock = [...getTotalStock?.totalStock],
      stockItem = get_total_stock.find((a) => a?.id === id);
    if (!stockItem) return;
    let price_grosir = 0;
    if (isGrosir) {
      let grosir = product?.Wholesales;
      for (let i = 0; i < product?.Wholesales?.length; i++) {
        if (val >= grosir[i]?.minPurchase && grosir[i]?.maxPurchase == 0)
          price_grosir = grosir[i]?.price;
        if (val >= grosir[i]?.minPurchase && val <= grosir[i]?.maxPurchase)
          price_grosir = grosir[i]?.price;
      }
    }
    if (increment) {
      if (stockItem.Stock === val)
        get_total_stock = get_total_stock.map((a) =>
          a?.id === id && a?.Amount > 0
            ? { ...a, Amount: a?.Amount - 1, PriceGrosir: price_grosir }
            : a
        );
      else
        get_total_stock = get_total_stock.map((a) =>
          a?.id === id ? { ...a, Amount: a?.Amount - 1 } : a
        );
      tmp_product.products = tmp_product.products.map((a) =>
        a?.ID === id && a?.Quantity + 1 <= stockItem.Stock
          ? {
              ...a,
              Quantity: a?.Quantity + 1,
              Amount: get_total_stock?.find((a) => a?.id == id)?.Amount,
              PriceGrosir: price_grosir,
            }
          : a
      );
    } else {
      get_total_stock = get_total_stock.map((a) =>
        a?.id === id ? { ...a, Amount: a?.Amount + 1 } : a
      );
      tmp_product.products = tmp_product.products.map((a) =>
        a?.ID === id && a?.Quantity > 0
          ? {
              ...a,
              Quantity: a?.Quantity - 1,
              Amount: get_total_stock?.find((a) => a?.id == id)?.Amount,
              PriceGrosir: price_grosir,
            }
          : a
      );
    }
    get_products[idx] = tmp_product;
    setMultipleAlamatProducts([...get_products]);
    setTotalStock({ totalStock: get_total_stock });
  }
  function handleSaveAlamatMultiple() {
    const tmp = getMultipleAlamatProducts.map((val, i) => {
      if (i == getIndexLocationMultiple.index)
        return { ...val, location: getIndexLocationMultiple.location };
      return val;
    });
    setMultipleAlamatProducts(tmp);
    setScreen("multiple_alamat");
  }
  function handleDeleteAlamatMultiple(data) {
    const tmp = getMultipleAlamatProducts.map((val, i) => {
      if (i == data.index)
        return { ...val, location: data.location };
      return val;
    })
    setMultipleAlamatProducts(tmp);
    setScreen("multiple_alamat");
  }
  function handleAddToTroliMultipleAddress() {
    let tmp = getMultipleAlamatProducts;
    let validation_address = tmp
      ?.map((val, i) =>
        !Object.keys(val?.location).length
          ? { index: i, text: "Alamat tujuan wajib diisi" }
          : null
      )
      ?.filter((a) => a !== null);
    let validation_min_purchase = tmp
      ?.map((val, i) =>
        val?.products?.map(
          (pro) => pro?.Quantity < product?.ProductInfo?.MinOrder
        )
      )
      .flat()
      ?.filter((a) => a);
    let validation_same_address = tmp?.some(
      (val, idx, arr) =>
        arr.filter((a) => a?.location?.ID == val?.location.ID).length > 1
    );

    if (validation_same_address)
      return setShowToastDrawer({ show: true, msg: "Alamat Tidak Boleh Sama" });
    if (validation_address.length) {
      setValidation(validation_address);
      return setShowToastDrawer({
        show: true,
        msg: "Periksa alamat tujuan kamu",
      });
    }
    if (validation_min_purchase.length)
      return setShowToastDrawer({
        show: true,
        msg: "Pesanan kurang dari minimal pembelian. Silakan tambahkan pesanan kamu.",
      });

    // if(isMultiple){
    //   setValidation(tmp?.map((val, i) => !Object.keys(val?.location).length ? { index: i, text: 'Alamat tujuan wajib diisi' } : null)?.filter(a => a !== null))
    // }
    addToTroliBulk({
      cart: tmp?.map((val) => {
        let newitems = val?.products?.map((a) => ({
          // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0259
          productId: product?.ID,
          variantId: isVariant ? a?.ID : "",
          quantity: a?.Quantity,
          notes: "",
        }));
        return {
          locationId: isMultiple ? val?.location?.ID : selectedLocation?.ID,
          items: newitems,
        };
      }),
    }).then(() => {
      router.push("/troli");
    });
    if (errorAddToTroliBulk && errorAddToTroliBulk?.status !== 200)
      setShowToastDrawer({ show: true, msg: "Terjadi Kesalahan Server" });
  }
  function handleBuyNow() {
    let tmp = getMultipleAlamatProducts;
    let validation_address = tmp
      ?.map((val, i) =>
        !Object.keys(val?.location).length
          ? { index: i, text: "Alamat tujuan wajib diisi" }
          : null
      )
      ?.filter((a) => a !== null);
    let validation_min_purchase = tmp
      ?.map((val, i) =>
        val?.products?.map(
          (pro) => pro?.Quantity < product?.ProductInfo?.MinOrder
        )
      )
      .flat()
      ?.filter((a) => a);
    let validation_same_address = tmp?.some(
      (val, idx, arr) =>
        arr.filter((a) => a?.location?.ID == val?.location.ID).length > 1
    );

    if (validation_same_address)
      return setShowToastDrawer({ show: true, msg: "Alamat Tidak Boleh Sama" });
    if (validation_address.length) {
      setValidation(validation_address);
      return setShowToastDrawer({
        show: true,
        msg: "Periksa alamat tujuan kamu",
      });
    }
    if (validation_min_purchase.length)
      return setShowToastDrawer({
        show: true,
        msg: "Pesanan kurang dari minimal pembelian. Silakan tambahkan pesanan kamu.",
      });

    // if(isMultiple){
    //   setValidation(tmp?.map((val, i) => !Object.keys(val?.location).length ? { index: i, text: 'Alamat tujuan wajib diisi' } : null)?.filter(a => a !== null))
    // }
    setBuyNow(
      tmp?.map((val) => {
        return {
          sellerID: product?.sellerInfo?.id,
          locationID: val?.location?.ID,
          price: val?.products?.reduce((total, item) => total + item?.Quantity + item?.Price, 0),
          products: val?.products?.map((pro) => ({
            // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0259
            id: product?.ID,
            qty: pro?.Quantity,
            note: "",
            ...(isVariant && { variantID: pro?.ID }),
          })),
        };
      })
    );
    router.push("/checkout");
  }
  // FIX BUG Pengecekan Ronda Muatparts LB-0089
  const handleCancelFilter = () => {
    setTempRating([])
    setScreen("ulasan")
  }
  // FIX BUG Pengecekan Ronda Muatparts LB-0089
  const handleSaveFilter = () => {
    setFilter(prevState => ({ ...prevState, rating: tempRating }))
    setScreen("ulasan")
  }
  const [wishlistState, setWishlistState] = useState(product.Wishlist);
 

  const { data: resAlbum, mutate: mutateAlbum } = useSWRHook(
    "v1/muatparts/albums"
  );

  const handleWishlist = async (e, val) => {
    if (!wishlistState) {
      await post({
        path: "v1/muatparts/wishlist",
        data: { productId: val.ID },
      }).then((x) => {
        if (x.status === 200) {
          setWishlistState(true);
          setShowBottomsheet(true);
          setTitleBottomsheet(t("AppMuatpartsWishlistTersimpanDiFavorit"));
          setDataBottomsheet(
            <FavoriteWishlistResponsive
              data={resAlbum.Data.albums}
              product={val.ID}
              mutateAlbum={mutateAlbum}
              onAddNewAlbum={() => {
                setShowBottomsheet(true);
                setTitleBottomsheet(t("labelTambahalbumBaru"));
                setDataBottomsheet(
                  <NewAlbumBottomsheet
                    data={resAlbum.Data.albums}
                    product={val.ID}
                    mutateAlbum={mutateAlbum}
                    onSuccess={() => {
                      mutateAlbum();
                      setShowBottomsheet(false);
                      setDataToast({
                        type: "success",
                        message: t("labelBerhasilCreateAlbum"),
                      });
                      setShowToast(true);
                    }}
                  />
                );
              }}
            />
          );
          mutateAlbum();
        }
      });
    } else {
      try {
        await deleted({
          path: `v1/muatparts/wishlist`,
          options: { data: { productId: val.ID } },
        }).then(async (x) => {
          if (x.status === 200) {
            setWishlistState(false);
            await mutateAlbum();
          }
        });
      } catch (error) {
        setShowToast(true);
        if (error.status === 400)
          setDataToast({ type: "error", message: error.response.data.Data });
        else setDataToast({ type: "error", message: error.message });
      }
    }
  };
  useEffect(() => {
    let tmp = `${getVariants.variant_one}${getVariants.variant_two ?? ""}`;
    if (product?.Variants?.Combinations?.length) {
      setSelectedVariant(
        product?.Variants?.Combinations?.find((a) => a?.Code === tmp)
      );
      // setStock(product?.Variants?.Combinations?.find(a=>a?.code===tmp)?.stock)
      // setAmountProduct(1)
    }
  }, [getVariants]);
  useEffect(() => {
    if (product?.Variants?.Combinations?.length) {
      let variantCombine =
        `${product?.Variants?.variant_1_name}` +
        `${
          product?.Variants?.variant_2_name
            ? `${product?.Variants?.variant_2_name}`
            : ""
        }`;
      let tmp =
        `${product?.Variants?.variant_1_value[0]}` +
        `${product?.Variants?.variant_2_value?.[0] ?? ""}`;
      setVariants({
        variant_one: product?.Variants?.variant_1_value[0],
        variant_two: product?.Variants?.variant_2_value[0],
      });
      // let variantValue = generateVariantCombination(product?.Variants?.Combinations?.[0],product?.Variants?.variant_1_value,product?.Variants?.variant_2_value)
      setSelectedVariantName({
        variantName: variantCombine,
        variantValue: product?.Variants?.Combinations?.[0]?.KeyName,
      });
      setSelectedVariant(
        product?.Variants?.Combinations?.find((a) => a?.Code === tmp)
      );
    }
    if (!product?.Variants?.Combinations?.length) {
      setSelectedVariant({
        ID: product?.ID,
        Code: product?.ProductInfo?.Title,
        KeyName: product?.ProductInfo?.Title,
        Stock: product?.Stock,
        DiscountPercentage: product?.Pricing?.DiscountPercentage,
        OriginalPrice: product?.Pricing?.OriginalPrice,
        Price: product?.Pricing?.Price,
      });
    }
    setAmountProduct(product?.ProductInfo?.MinOrder)
  }, []);
  useEffect(() => {
    if (isGrosir) {
      let grosir = product?.Wholesales;
      for (let i = 0; i < product?.Wholesales?.length; i++) {
        if (
          getAmountProduct >= grosir[i]?.minPurchase &&
          grosir[i]?.maxPurchase == 0
        )
          setSelectedVariant((a) => ({
            ...a,
            ID: product?.ID,
            Code: product?.ProductInfo?.Title,
            KeyName: product?.ProductInfo?.Title,
            Stock: product?.Stock,
            DiscountPercentage: product?.Pricing?.DiscountPercentage,
            ID: product?.ID,
            OriginalPrice: grosir[i]?.price,
            Price: grosir[i]?.price,
          }));
        if (
          getAmountProduct >= grosir[i]?.minPurchase &&
          getAmountProduct <= grosir[i]?.maxPurchase
        )
          setSelectedVariant((a) => ({
            ...a,
            ID: product?.ID,
            Code: product?.ProductInfo?.Title,
            KeyName: product?.ProductInfo?.Title,
            Stock: product?.Stock,
            DiscountPercentage: product?.Pricing?.DiscountPercentage,
            ID: product?.ID,
            OriginalPrice: grosir[i]?.price,
            Price: grosir[i]?.price,
          }));
      }
    }
  }, [getAmountProduct]);
 
  useEffect(()=>{
    if(!onLoad) setSearch({tmp:'',value:''})
    if(search?.value&&!screen&&onLoad) {
      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0419
      filter_product?.setFilterProduct('q',search?.value)
      router.push('/products?q='+search?.value)
    }
    setOnLoad(true)
  },[search])

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!screen) {
      setAppBar({
        appBarType: "compact",
        renderActionButton: (
          <div className="flex gap-2">
            <span
              className="flex flex-col z-30 justify-center items-center gap-[2px] select-none cursor-pointer"
              onClick={() => setModal("bagikan_sosmed")}
            >
              <IconComponent
                classname={"icon-white"}
                width={20}
                height={20}
                src={"/icons/share.svg"}
              />
              <span className="font-semibold text-neutral-50 text-[10px]">
                {t('labelShareBuyer')}
              </span>
            </span>
            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB-0306 */}
            <span
              className="flex flex-col z-30 justify-center items-center gap-[2px] select-none cursor-pointer"
              onClick={() => router.push("/troli")}
            >
              <Image
                alt="ssd"
                width={20}
                height={20}
                src={
                  process.env.NEXT_PUBLIC_ASSET_REVERSE +
                  "/img/cart-outline.png"
                }
              />
              {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0769 */}
              <span className="font-semibold text-neutral-50 text-[10px] whitespace-nowrap">
                {t('AppMuatpartsAnalisaProdukTroli')}
              </span>
            </span>
          </div>
        ),
      });
      setSearch({
        placeholder: t('AppMuatpartsWishlistCariProduk'),
        onSubmitForm: true,
      });
    }else{
      setSearch({
        onSubmitForm: false,
      });
    }
    if (screen) {
      setAppBar({
        renderActionButton: null,
      });
    }
    if (screen === "kompatibilitas") {
      setAppBar({
        appBarType: "header_title",
        title: t('AppKelolaProdukMuatpartsTambahKompatibilitas'),
        onBack: () => setScreen(""),
      });
    }
    if (screen === "kompatibilitas_search") {
      setAppBar({
        appBarType: "header_search_secondary",
        onBack: () => setScreen(""),
      });
      setSearch({
        placeholder: t("LabelmodalKompatibilitasSearchScreenCaridiGarasisaya"),
      });
    }
    if (screen === "multiple_alamat") {
      setAppBar({
        appBarType: "header_title",
        title: "Pilih Multi Alamat",
        onBack: () => setScreen(""),
      });
    }
    if (screen === "list_address") {
      setAppBar({
        appBarType: "header_title",
        title: t('labelAlamatTujuan'),
        onBack: () => setScreen("multiple_alamat"),
      });
    }
    if (screen === "add_address") {
      setAppBar({
        appBarType: "header_title",
        title: t('labelDetailAlamat'),
        onBack: () => setScreen("list_address"),
      });
    }
    if (screen === "manloc") {
      setAppBar({
        appBarType: "header_search_secondary",
        onBack: () => setScreen("add_address"),
      });
      setSearch({
        placeholder: t('LocationManagementLabelTitleSearchAddress'),
        onSubmitForm: true,
      })
    }
    if (screen === "list_manloc") {
      setAppBar({
        appBarType: "header_title_modal_secondary",
        title: t('LocationManagementLabelLocationManagement'),
        renderActionbutton: "",
        onBack: () => setScreen("manloc"),
      });
    }
    if (screen === "add_manloc") {
      setAppBar({
        appBarType: "header_title_modal_secondary",
        title: t('BFTMRegisterAddressDetail'),
        renderActionbutton: "",
        onBack: () => setScreen("manloc"),
      });
    }
    if (screen === "laporkan") {
      setAppBar({
        appBarType: "header_title_modal_secondary",
        title: (
          <span className="w-full text-center semi-sm">
            {t("AppMuatpartsLaporkanProdukLabelAppBar")}
          </span>
        ),
        renderActionbutton: "",
        onBack: () => setScreen(""),
      });
    }
    // FIX BUG Pengecekan Ronda Muatparts LB-0089
    if (screen === "ulasan") {
      setAppBar({
        appBarType: "header_title",
        title: "Ulasan Pelanggan",
        onBack: () => setScreen(""),
      });
    }
    if (screen === "filter") {
      setAppBar({
        appBarType: "header_title_secondary",
        renderAppBar: (
            <div className="relative flex justify-center items-center w-full h-6">
                <button
                    className="absolute left-0 top-[24px] -translate-y-full"
                    onClick={() => setScreen("ulasan")}
                >
                    <IconComponent
                        classname={`icon-blue-fill`}
                        src="/icons/silang.svg"
                        size="medium"
                    />
                </button>
                <span className="font-semibold text-[14px] leading-[16.8px]">
                    {t("labelFilterInternal")}
                </span>
            </div>
        )
      })
    }
  },[screen])
  
  if (screen==='kompatibilitas') return <KompatibilitasScreen getExpanded={getExpanded} handleExpanded={handleExpanded} data={product?.Compability} />
  if (screen==='kompatibilitas_search') return <KompatibilitasSearchScreen data={DataKompatibilitas} onClick={a=>{
      setCompatibility({garageID:a,productID:product?.ID})
      setScreen('')
      setModal("cek_kompatibilitas")
    }} />
  if (screen==='multiple_alamat') return <MultipleAlamatScreen handleDeleteAlamatMultiple={handleDeleteAlamatMultiple} setSelectedLocations={setSelectedLocations} validation={validation} showToastDrawer={showToastDrawer} setShowToastDrawer={setShowToastDrawer} handleAddToTroli={handleAddToTroliMultipleAddress} handleBuyNow={handleBuyNow} isGrosir={isGrosir} isMultiple={isMultiple} setIsMultiple={setIsMultiple} getIndexLocationMultiple={getIndexLocationMultiple} setIndexLocationMultiple={setIndexLocationMultiple} product={product} getMultipleAlamatProducts={getMultipleAlamatProducts} getPrice={getSelectedVariant} handleMultipleAlamatVariantProduct={handleMultipleAlamatVariantProduct} handleChangeStockMulti={handleChangeStockMulti} getTotalStock={getTotalStock} selectedLocation={selectedLocation} variants={product?.Variants?.Combinations} locations={locations} />

  if(screen==='list_address') return <ListAddressContainerMobile preventDefaultSelected onChoose={(e) => setIndexLocationMultiple(a => ({ ...a, location: e }))} address={locations} onAddAddress={()=>{
    setScreen('add_address')
    setSelectedAddressEdit(null)
  }} onSave={handleSaveAlamatMultiple} onChange={(val)=>{
    setScreen('add_address')
    setSelectedAddressEdit(val)
  }} />

  if (screen === "add_address")
    return (
      <AddAddressContainerMobile
        onFocusLocation={(val) => {
          setScreen("manloc");
          setSearch({
            value: val,
          });
        }}
        setState={handleLocation}
        state={getSelectedAddressEdit ? getSelectedAddressEdit : {}}
        onSave={() => setScreen("list_address")}
      />
    );
  if (screen === "manloc")
    return (
      <LocationManagementContainerMobile
        onSelect={(val) => {
          setScreen("add_address")
          setSelectedAddressEdit(val)
        }}
        onClickVieManloc={() => setScreen("list_manloc")}
      />
    );
  if (screen === "list_manloc")
    return (
      <ListLocationManagementMobile onEdit={() => setScreen("add_manloc")} />
    );
  // if (screen === "add_manloc") return <AddLocationManagementContainerMobile />;
  if (screen === "laporkan") return <Laporkan  idProduct={product?.ID} />;
  // FIX BUG Pengecekan Ronda Muatparts LB-0089
  if (screen === "ulasan") {
    return (
      <AllProductReviewScreen
        filter={filter}
        setFilter={setFilter}
        reviews={reviews}
        setTempRating={setTempRating}
      />
    )
  }
  if(screen==='filter') {
    return (
      <Filter
        {...searchProps}
        onCancelFilter={handleCancelFilter}
        onSaveFilter={handleSaveFilter}
        tempRating={tempRating}
        setTempRating={setTempRating}
      />
    )
  }
  // main screen

  return (
    <div className={"relative pb-24 bg-neutral-200"}>
      {/* LBM */}
      {product?.Images?.some(a=>typeof a==='string' && a.length)&&<ImageCarouselMobile
        onClick={(a) => console.log(a)}
        images={product?.Images}
      />}
      <div className="flex flex-col gap-2 text-neutral-900 bg-neutral-200">
        {isClosedStore && (
          <SectionCard
            classname={
              "bg-warning-100 px-3 flex items-center gap-1 h-[38px] !flex-row"
            }
          >
            <ImageComponent
              width={20}
              height={20}
              src={process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/warning.svg"}
              alt="warning"
            />
            <span className="text-xs font-medium">
              <b>{t('titleStoreIsClosed')}</b>. Barang ini bisa kamu beli setelah toko
              buka pada <b>{getDateStoreOpen}</b>
            </span>
          </SectionCard>
        )}

        {/* section-product */}
        <SectionCard>
          {product?.Pricing?.DiscountPercentage ||
          product?.Variants?.Combinations?.[0]?.DiscountPercentage ? (
            <div className="flex gap-2">
              <h1 className="text-neutral-900 text-sm font-bold">
                {numberFormatMoney(getSelectedVariant?.Price)}
              </h1>
              <div className="flex gap-1 items-center">
                <strike className="text-neutral-600 text-[10px] font-medium">
                  {numberFormatMoney(getSelectedVariant?.OriginalPrice)}
                </strike>
                <p className={`${style.discount} bg-error-400 semi-xs text-neutral-50 p-1 rounded`}>
                  {getSelectedVariant?.DiscountPercentage
                    ? getSelectedVariant?.DiscountPercentage
                    : product?.Pricing?.DiscountPercentage}% OFF
                </p>
              </div>
            </div>
          ) : (
            <h1 className="text-neutral-900 text-sm font-bold">
              {numberFormatMoney(getSelectedVariant?.Price)}
            </h1>
          )}
          <div className="flex items-center justify-between w-full">
            <h1 className="font-semibold text-base w-fit">
              {product?.ProductInfo?.Title}
            </h1>
            <span
              className="w-7 h-7 bg-neutral-200 rounded-full flex justify-center items-center select-none cursor-pointer"
              onClick={(e) => {
                handleWishlist(e, product);
              }}
            >
              <IconComponent
                src={
                  wishlistState
                    ? "/icons/icon-love-wishlist.svg"
                    : "/icons/heart-outline.svg"
                }
              />
            </span>
          </div>
          <span className="font-medium text-xs flex">
            <span className="flex items-center gap-1">
              {t('labelTerjualBuyer')}
              <span className="text-neutral-700">
                {product?.SoldCount > 9999 ? "9.999+" : product?.SoldCount}
              </span>{" "}
              &#183;{" "}
              <span className="py-2 px-3 flex gap-1 items-center bg-neutral-200 rounded-[24px]">
                <ImageComponent
                  src={"/icons/product-star.svg"}
                  width={16}
                  height={16}
                  alt="Rating"
                />{" "}
                {product?.Rating}{" "}
                <span className="text-neutral-700">
                  ({product?.ReviewCount})
                </span>
              </span>
            </span>
          </span>
          {/* {Bonus?.length&&<div className='flex flex-wrap gap-2 border-b border-neutral-400 pb-4 text-neutral-900'> */}
          {product?.Bonus?.length ? (
            <div className="flex overflow-auto gap-[7px]">
              {product?.Bonus.map((val, i) => (
                <div
                  key={i}
                  className="bg-success-50 py-1 px-2 rounded-md text-success-400 font-semibold text-xs"
                >
                  {val}
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
          {/* </div>} */}
        </SectionCard>

        {/* section-cekCompatibilitas */}
        {isLogin && (
          <SectionCard>
            <div className="flex justify-between">
              <span className="text-sm font-semibold">{t('labelCekKompatibilitas')}</span>
              <span className="font-medium text-sm text-primary-700 select-none cursor-pointer">
                {t('AppMuatpartsAnalisaProdukReset')}
              </span>
            </div>
            <Button
              onClick={() => setScreen("kompatibilitas_search")}
              Class="!h-8 !p-3 !border !border-neutral-600 !rounded-md !max-w-none !w-full !text-neutral-600 !font-semibold !text-sm !bg-neutral-50 !justify-between"
              iconRight={"/icons/chevron-right.svg"}
            >
              {t("labelKendaraanSaya")}
            </Button>
          </SectionCard>
        )}

        {/* section-variant */}
        <SectionCard>
          {/* // Improvement Ubah Design Variant UAT */}
          {!!product?.Variants?.variant_1_value?.length ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold leading-4">{product?.Variants?.variant_1_name} : {getVariants.variant_one}</p>
              <div className="flex flex-wrap gap-2 ">
                {
                  product?.Variants?.variant_1_value?.map((variant_1, index)=>(
                    <span 
                      key={`variant-1-${index}`} 
                      className={`${
                      getVariants.variant_one===variant_1
                        ? "text-primary-700  bg-primary-50 border border-primary-700"
                        : "text-neutral-900 bg-neutral-200 border-neutral-200"
                      } py-2 px-3 h-[30px]  font-medium text-sm flex justify-center items-center rounded-[24px] select-none cursor-pointer`}
                      onClick={()=> { 
                        handleSelectVariant('variant_one', variant_1)
                      }}
                    >
                      {variant_1}
                    </span>
                  ))
                }
              </div>
              {!!product?.Variants?.variant_2_value?.length &&(
                <>
                  <p className="text-sm font-semibold leading-4">{product?.Variants?.variant_2_name} : {getVariants.variant_two}</p>
                  <div className="flex flex-wrap gap-2 pb-3 border-b border-neutral-400">
                    {
                      product?.Variants?.variant_2_value?.map((variant_2, index)=>(
                        <span 
                          key={`variant-1-${index}`} 
                          className={`${
                          getVariants.variant_two===variant_2
                            ? "text-primary-700  bg-primary-50 border border-primary-700"
                            : "text-neutral-900 bg-neutral-200 border-neutral-200"
                          } py-2 px-3 h-[30px]  font-medium text-sm flex justify-center items-center rounded-[24px] select-none cursor-pointer`}
                          onClick={()=> { 
                            handleSelectVariant('variant_two', variant_2)
                          }}
                        >
                          {variant_2}
                        </span>
                      ))
                    }
                  </div>  
                </>
              )}
            </div>
          ) : (
            ""
          )}
          <div className="flex w-full justify-between items-center">
            <span className="text-sm font-semibold">
              {t('labelinginpesanmulti')}
            </span>
            <span
              onClick={() => (!isClosedStore ? handleClickHere() : "")}
              className={`text-sm font-medium ${
                isClosedStore ? "text-neutral-500" : "text-primary-700"
              } select-none cursor-pointer`}
            >
              {t('labelklikdisinibuyer')}
            </span>
          </div>
        </SectionCard>
        {/* section-info */}
        <SectionCard>
          <span className="text-sm font-semibold">{t('titleProductInfo')}</span>
          <div className="w-full grid grid-cols-2 gap-4">
            {product?.ProductInfo?.Grade?<><span className="text-neutral-600 font-medium text-xs w-[150px]">
              {t('AppMuatpartsWishlistKualitas')}
            </span>
            <span className="font-medium text-xs">{product?.ProductInfo?.Grade}</span></>:''}
            {product?.ProductInfo?.Condition?<><span className="text-neutral-600 font-medium text-xs w-[150px]">
              {t('BuyerIndexKondisi')}
            </span>
            <span className="font-medium text-xs">{product?.ProductInfo?.Condition}</span></>:''}
            {product?.ProductInfo?.Brand?<><span className="text-neutral-600 font-medium text-xs w-[150px]">
            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0770 */}
            {t("LabeldetailProductResponsiveBrand")}
            </span>
            <span className="font-medium text-xs">{product?.ProductInfo?.Brand}</span></>:''}
            {product?.ProductInfo?.Etalase?<><span className="text-neutral-600 font-medium text-xs w-[150px]">
              {t('labelEtalase')}
            </span>
            <span className="font-medium text-xs">{product?.ProductInfo?.Etalase}</span></>:''}
            {product?.ProductInfo?.MinOrder?<><span className="text-neutral-600 font-medium text-xs w-[150px]">
              {t('labelMinPesananBuyer')}
            </span>
            <span className="font-medium text-xs">{product?.ProductInfo?.MinOrder}</span></>:''}
          </div>
        </SectionCard>

        {/* section-detailProduk*/}
        <SectionCard>
          <span className="text-sm font-semibold">{t('titleDetails')}</span>
            {!!(Object.entries(product?.ProductDetail)?.length)&&Object.entries(product?.ProductDetail)?.slice(0,getExpanded?.includes('section-detailProduk')?Object.entries(product?.ProductDetail)?.length:3)?.map((val,i)=><div key={i} className="w-full grid grid-cols-2 gap-4">
              <span className="text-neutral-600 font-medium text-xs w-[150px]">
                {val[0]?.replace('_',' ')}
              </span>
              <span className="font-medium text-xs">{val[1]??'-'}</span>
            </div>)}
          {Object.entries(product?.ProductDetail)?.length>3&&<span
            className="flex justify-end gap-2 items-center text-primary-700 select-none cursor-pointer text-sm font-medium"
            onClick={() => handleExpanded('section-detailProduk')}
          >
            <span>{t('AppMuatpartsDashboardSellerLihatSelengkapnya')}</span>
            <IconComponent
              classname={"icon-blue"}
              src={`/icons/chevron-down.svg`}
              width={12}
              height={12}
            />
          </span>}
          <span className="text-sm font-semibold">{t('labelDeskripsiProduk')}</span>
          <p
            className={`${
              // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0122
              !showCompleteDescription ? "line-clamp-6" : ""
            } font-normal text-sm`}
          >
            {lineClamp(product?.Description,!showCompleteDescription?256:product?.Description?.length)}
          </p>
          {(product?.Description&&product?.Description?.length>256) && (
            <span
              className="flex justify-end gap-2 items-center text-primary-700 select-none cursor-pointer text-sm font-medium"
              onClick={() =>
                setShowCompleteDescription(!showCompleteDescription)
              }
            >
              {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0122 */}
              <span>
                {showCompleteDescription
                  ? "Lihat Sedikit"
                  : t('ButtonViewMore')
                  }
              </span>
              <IconComponent
                classname={"icon-blue"}
                src={
                  showCompleteDescription
                    ? `/icons/chevron-up.svg`
                    : `/icons/chevron-down.svg`
                }
                width={12}
                height={12}
              />
            </span>
          )}
        </SectionCard>

        {/* section-compatibilitas */}
        <SectionCard>
          <Button
            onClick={() => setScreen("kompatibilitas")}
            Class="!h-8 !p-3 !border-none !rounded-md !max-w-none !w-full !text-neutral-900 !font-semibold !text-sm !bg-neutral-50 !justify-between"
            iconRight={"/icons/chevron-right.svg"}
          >
            {t('AppKelolaProdukMuatpartsTambahKompatibilitas')}
          </Button>
        </SectionCard>

        {/* section-seller */}
        <SectionCard>
          <div className="flex gap-2 text-neutral-900">
            <div className="w-11 h-11 rounded-full border border-neutral-500 overflow-hidden">
              <ImageComponent
                src={product?.sellerInfo?.Logo}
                width={44}
                height={44}
                objectFit="cover"
                alt="as"
              />
            </div>
            {/* 25. 05 - QC Plan - Web - Pengecekan Muatparts - Ronda Tahap 1 - LB - 0278 */}
            <div className="flex flex-col gap-2" style={{width:'calc(100% - 44px)'}}>
              <p className="font-semibold text-sm" onClick={()=>router.push(`/seller/${product?.sellerInfo?.id}`)}>
                {product?.sellerInfo?.Name}
              </p>
              {product?.sellerInfo?.LastOnline&&<span className="font-medium text-xs gap-1 flex text-neutral-600">
                <span>{product?.sellerInfo?.LastOnline}</span>
              </span>}
            </div>
          </div>
          <div className="flex gap-1 text-xs">
            {!!product?.sellerInfo?.Rating && (
              <ImageComponent
                src={"/icons/product-star.svg"}
                width={16}
                height={16}
                alt="Rating"
              />
            )}
            {!!product?.sellerInfo?.Rating && (
              <span>{product?.sellerInfo?.Rating}</span>
            )}
            {!!product?.sellerInfo?.ReviewCount && (
              // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0770
              <span>({product?.sellerInfo?.ReviewCount + ` ${t("LabeldetailProductResponsiveRating")}`})</span>
            )}
          </div>
        </SectionCard>

        {/* section-lokasi */}
        <SectionCard>
          <div className="flex flex-col gap-4 text-neutral-900 text-xs font-medium">
            <div className="border-b border-neutral-400 pb-4 flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <Image
                  src={
                    process.env.NEXT_PUBLIC_ASSET_REVERSE +
                    "/icons/marker-outline.svg"
                  }
                  width={16}
                  height={16}
                  alt="marker"
                />
                <span className="text-neutral-600">{t('labelLokasiPenjual')}</span>
                {product?.sellerInfo?.Location && (
                  <span>{product?.sellerInfo?.Location}</span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <Image
                  src={
                    process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/time.svg"
                  }
                  width={16}
                  height={16}
                  alt="marker"
                />
                <span className="text-neutral-600">{t('titleOperationalHours')}</span>
                {IsJamOperationalOpen() ? (
                  <>
                    <span className="text-success-400">{t('labelBukaBuyer')}</span>
                    &#183;
                    <span>
                      {product?.sellerInfo?.OperationalHours?.[today]?.replace(
                        "Buka",
                        ""
                      )}
                    </span>
                  </>
                ) : (
                  <span className="text-error-400">{t('labeltutupbuyer')}</span>
                )}
                {IsJamOperationalOpen() && <>&#183;</>}
                {/* {IsJamOperationalOpen() && (
                      <span>
                        {product?.sellerInfo?.OperationalHours?.[today]}
                      </span>
                    )} */}
                <span
                  className="cursor-pointer"
                  onClick={() => setModal("jam_operasional")}
                >
                  <IconComponent src={"/icons/chevron-down.svg"} />
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <Image
                  src={
                    process.env.NEXT_PUBLIC_ASSET_REVERSE +
                    "/icons/truck-outline.svg"
                  }
                  width={16}
                  height={16}
                  alt="marker"
                />
                <span className="text-neutral-600">{t('radioShippingOption')}</span>
              </div>
              {product?.sellerInfo?.ShippingInfo?.options?.shippingInfo?.map(
                (val, i) => {
                  return (
                    <div className="flex gap-2 ml-6" key={i}>
                      <span className="medium-xs whitespace-nowrap">
                        {val?.courier} :{" "}
                      </span>
                      <div className="flex flex-col gap-2">
                        <span className="medium-xs">
                          {t('AppPromosiSellerMuatpartsMulai')}{" "}
                          {val?.price === "-"
                            ? val?.price
                            : numberFormatMoney(val?.price)}
                        </span>
                        <span className="text-neutral-600">
                          (est. tiba{" "}
                          {val?.estimatedDelivery?.["start"]
                            ? formatDate(
                                val?.estimatedDelivery?.["start"],
                                ["day", "month", "year"],
                                false
                              )
                            : ""}{" "}
                          -{" "}
                          {val?.estimatedDelivery?.["end"]
                            ? formatDate(
                                val?.estimatedDelivery?.["end"],
                                ["day", "month", "year"],
                                false
                              )
                            : ""}
                          )
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
              <span className="text-primary-700 text-xs font-medium ml-6">
                {t('labelLIhatOpsiPegirimanBuyer')}
              </span>
              {product?.sellerInfo?.ShippingInfo?.requiresInsurance && (
                <Button
                  Class="ml-6 !bg-primary-50 !text-xs !font-semibold !rounded-md !py-1 !px-2 !w-[calc(100% - 24px)] !max-w-none !border-none"
                  color="primary_secondary"
                >
                  {t('labelWajibAsuransiPengiriman')}
                </Button>
              )}
            </div>
          </div>
        </SectionCard>
        {/* FIX BUG Pengecekan Ronda Muatparts LB-0089 */}
        <ReviewContainerResponsive
          sellerProfile={sellerProfile}
          sellerId={product?.sellerInfo?.id}
          productName={product?.ProductInfo?.Title}
        />
        <SectionCard classname={""}>
          <div className="flex justify-between items-center">
            <span className="semi-sm">{t('labelProdukBermasalah')} </span>
            <div
              className="text-primary-700 flex gap-1 items-center cursor-pointer"
              onClick={() => {
                if (accessToken) {
                  setScreen("laporkan");
                } else {
                  // 24. THP 2 - MOD001 - MP - 011 - QC Plan - Web - MuatParts - Paket 028 A - Buyer - Laporkan Produk - LB - 0032
                  location.href = process.env.NEXT_PUBLIC_INTERNAL_WEB + `login?from=mpbuyer&redirect=${window.location.href}`;
                }
              }}
            >
              <IconComponent src={"/icons/flag-blue.svg"} />
              <span className="medium-sm">{t('labellaporkanBuyer')}</span>
            </div>
          </div>
        </SectionCard>
        {!!product?.similarProduct?.length && (
          <div className="flex flex-col gap-4 pl-4">
            <span className="semi-base">{t('labelRekomendasiSerupa')}</span>
            <div className="flex overflow-x-auto scrollbar-none gap-2 pr-4">
              {product?.similarProduct?.map((val) => (
                <div key={val?.id}>
                  <ProductComponent {...val} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ButtonBottomMobile
        classname={"flex gap-[10px] p-4 border-t border-neutral-200"}
      >
        <span  onClick={directChatRoom} className="p-3 rounded-[20px] border border-primary-700 bg-neutral-50 select-none cursor-pointer h-10 grid place-content-center">
          <IconComponent
            src={"/icons/chat.svg"}
            width={24}
            height={24}
            classname={"icon-blue"}
          />
        </span>
        {/* // Improvement Ubah Design Variant UAT */}
        {getSelectedVariant?.Stock?
          <>
            <span
              onClick={() => {
                if(accessToken) {
                  setCartBody({
                    quantity: getAmountProduct,
                    productId: product?.ID,
                    notes: "",
                    locationId: selectedLocation?.ID,
                    variantId: isVariant ? getSelectedVariant?.ID : "",
                  });
                  router.push("/troli");
                } else {
                  router.push(`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=mpbuyer&redirect=${window.location.href}`)
                }
              }}
              className={`p-3 rounded-[20px] border ${
                isClosedStore ? "border-neutral-500" : "border-primary-700"
              } bg-neutral-50 select-none cursor-pointer h-10 grid place-content-center`}
            >
              {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0156 & LB - 0123 */}
        
                {isClosedStore ? (
                  <Image
                    alt="ds"
                    src={
                      process.env.NEXT_PUBLIC_ASSET_REVERSE + "/img/cart-add-gray.png"
                    }
                    width={45}
                    height={45}
                  />
                ) : (
                  <Image
                    alt="ds"
                    src={
                      process.env.NEXT_PUBLIC_ASSET_REVERSE + "/img/cart-add-blue.png"
                    }
                    width={45}
                    height={45}
                  />
                )}
            

            </span>
          </>
        :''}
        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0156 & LB - 0123 */}
        {!getSelectedVariant?.Stock ? (
          <Button Class="h-10 w-full max-w-none" color="primary_secondary" onClick={e=>handleWishlist(e, product)}>
            {wishlistState?'Cek Favorit':t("labelIngatkanSayaBuyer")}
          </Button>
        ):(
          <Button
            Class="h-10 w-full max-w-none"
            disabled={isClosedStore}
            onClick={() => {
              if(isVariant) setModal("beli_sekarang")
              else{
                if (isLogin) {
                  setBuyNow([
                    {
                      sellerID: product?.sellerInfo?.id,
                      locationID: selectedLocation?.ID,
                      price: getAmountProduct * getSelectedVariant?.Price,
                      products: [
                        {
                          id: product?.ID,
                          variantID: isVariant ? getSelectedVariant?.ID : "",
                          qty: getAmountProduct,
                          notes: "",
                        },
                      ],
                    },
                  ])
                  router.push("/checkout")
                }else  {
                  router.push(`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=mpbuyer&redirect=${window.location.href}`)
                }
              }
            }}
          >
            {t('labelBeliSekarang')}
          </Button>
        )}
      </ButtonBottomMobile>

      {/* modal jam operasional */}
      <ModalComponent
        full
        isOpen={getModal === "jam_operasional"}
        setClose={() => setModal("")}
        type="BottomSheet"
        title="Jam Operasional Penjual"
      >
        <div className="flex flex-col gap-6 px-4 py-4">
          {Object.entries(weekDays).map((val) => {
            return (
              <span
                key={val[0]}
                className="flex justify-between items-center medium-sm"
              >
                <span>{weekDays?.[val[0]]}</span>
                <span>{product?.sellerInfo?.OperationalHours?.[val[0]]}</span>
              </span>
            );
          })}
        </div>
      </ModalComponent>

      {/* modal bagikan */}
      <ModalComponent
        full
        isOpen={getModal === "bagikan_sosmed"}
        setClose={() => setModal("")}
        type="BottomSheet"
        title={t('AppKelolaProdukMuatpartsBagikanProduct')}
      >
        <div className="flex flex-col gap-6">
          {/* 25. 07 - QC Plan - Web Apps - Marketing Muatparts - LB - 0034 */}
          <SharedMediaSocial
            brand={product?.ProductInfo?.Brand}
            image={product?.Images?.[0]?.includes("www.youtube.com")||product?.Images?.[0]?.includes('youtu.be')?product?.Images?.[1]:product?.Images?.[0]}
            name={product?.ProductInfo?.Title}
            price={getSelectedVariant?.Price}
            priceLabel={numberFormatMoney(getSelectedVariant?.OriginalPrice)}
            id={product?.ID}
          />
        </div>
      </ModalComponent>

      {/* modal beli sekarang */}
      <ModalComponent
        full
        isOpen={getModal === "beli_sekarang"}
        setClose={() => setModal("")}
        type="BottomSheet"
        title="Variant Produk"
      >
        <div className="flex flex-col gap-6 pb-[96px] px-4">
          <div className="flex gap-3 item-center">
            <span className="rounded overflow-hidden w-[68px] h-[68px]">
              <ImageComponent
                src={
                  product?.Images?.[0]?.includes("www.youtube.com")
                    ? generateThumbnail(product?.Images?.[0])
                    : product?.Images?.[0]
                }
                width={68}
                height={68}
                alt={""}
              />
            </span>
            <div className="flex flex-col gap-1">
              <span className="semi-xs text-neutral-700">
                {product?.ProductInfo?.Title}
              </span>
              <span className="bold-sm">
                {numberFormatMoney(product?.Pricing?.Price)}
              </span>
              <span className="medium-sm">
                Stock : {getSelectedVariant?.Stock}
              </span>
            </div>
          </div>

          {product?.Variants?.variant_1_name && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <span className="bold-sm">
                  {product?.Variants?.variant_1_name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product?.Variants?.variant_1_value?.map((val, i) => {
                    return (
                      <span
                        key={i}
                        onClick={() =>
                          setVariants((a) => ({ ...a, variant_one: val }))
                        }
                        className={`${
                          getVariants.variant_one === val
                            ? "text-primary-700  bg-primary-50 border border-primary-700"
                            : "text-neutral-900 bg-neutral-200 border-neutral-200"
                        } py-2 px-3 h-[30px]  font-medium text-sm flex justify-center items-center rounded-[24px] select-none cursor-pointer`}
                      >
                        {val}
                      </span>
                    );
                  })}
                </div>
              </div>
              {product?.Variants?.variant_2_name && (
                <div className="flex flex-col gap-3">
                  <span className="bold-sm">
                    {product?.Variants?.variant_2_name}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product?.Variants?.variant_2_value?.map((val, i) => {
                      return (
                        <span
                          key={i}
                          onClick={() =>
                            setVariants((a) => ({ ...a, variant_two: val }))
                          }
                          className={`${
                            getVariants.variant_two === val
                              ? "text-primary-700  bg-primary-50 border border-primary-700"
                              : "text-neutral-900 bg-neutral-200 border-neutral-200"
                          } py-2 px-3 h-[30px]  font-medium text-sm flex justify-center items-center rounded-[24px] select-none cursor-pointer`}
                        >
                          {val}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          <ButtonBottomMobile
            classname={"flex gap-[10px] p-4 border-t border-neutral-200"}
          >
            <span className="p-3 rounded-[20px] border border-primary-700 bg-neutral-50 select-none cursor-pointer h-10 grid place-content-center">
              <IconComponent
                src={"/icons/chat.svg"}
                width={24}
                height={24}
                classname={"icon-blue"}
              />
            </span>
            {/* // Improvement Ubah Design Variant UAT */}
            {getSelectedVariant?.Stock?
              <>
                <span
                  onClick={() => {
                    //  25. 11 - Web - LB - 0131
                    if(accessToken) {
                      setCartBody({
                        quantity: getAmountProduct,
                        productId: product?.ID,
                        notes: "",
                        locationId: selectedLocation?.ID,
                        variantId: isVariant ? getSelectedVariant?.ID : "",
                      });
                      router.push("/troli");
                    } else {
                      router.push(`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=mpbuyer&redirect=${window.location.href}`)
                    }
                  }}
                  className={`p-3 rounded-[20px] border ${
                    isClosedStore ? "border-neutral-500" : "border-primary-700"
                  } bg-neutral-50 select-none cursor-pointer h-10 grid place-content-center`}
                >
                  {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0156 & LB - 0123 */}
            
                    {isClosedStore ? (
                      <Image
                        alt="ds"
                        src={
                          process.env.NEXT_PUBLIC_ASSET_REVERSE +
                          "/img/cart-add-gray.png"
                        }
                        width={45}
                        height={45}
                      />
                    ) : (
                      <Image
                        alt="ds"
                        src={
                          process.env.NEXT_PUBLIC_ASSET_REVERSE +
                          "/img/cart-add-blue.png"
                        }
                        width={45}
                        height={45}
                      />
                    )}
                  
                </span>
              </>
            :''}
            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0156 & LB - 0123 */}
            {!getSelectedVariant?.Stock?(
              <Button 
                Class="h-10 w-full max-w-none" 
                color="primary_secondary" 
                onClick={
                  e=>handleWishlist(e, product)}>{wishlistState?'Check Favorit':t("titleHeaderFavorit")}
              </Button>
            ):(
              <Button
                Class="h-10 w-full max-w-none"
                disabled={isClosedStore}
                onClick={() => {
                  if (isLogin) {
                    setBuyNow([
                      {
                        sellerID: product?.sellerInfo?.id,
                        locationID: selectedLocation?.ID,
                        price: getAmountProduct * getSelectedVariant?.Price,
                        products: [
                          {
                            id: product?.ID,
                            variantID: isVariant ? getSelectedVariant?.ID : "",
                            qty: getAmountProduct,
                            notes: "",
                          },
                        ],
                      },
                    ])
                    router.push("/checkout")
                  }else {
                    router.push(`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=mpbuyer&redirect=${window.location.href}`)
                  }
                }}
              >
                {t('labelBeliSekarang')}
              </Button>
            )}
          </ButtonBottomMobile>
        </div>
      </ModalComponent>
      {/* // Improvement Impact Nonaktif User Seller Muatparts */}
      <Modal isOpen={!product?.sellerInfo?.StoreisActive} setIsOpen={()=>{router.back()}}>
        <div className="flex flex-col gap-4 items-center">
          <p className="text-sm font-medium">{t("LabeldetailProductTidakDitemukanProduktidaktersedia")}</p>
          <Button onClick={()=>{router.back()}} Class="!leading-3">Ok</Button>
        </div>
      </Modal>
      <ModalComponent
        full
        isOpen={getModal === "cek_kompatibilitas"}
        classnameContent={"!py-4 !pt-[86px] w-8"}
        setClose={() => setModal("")}
      >
        {check_compatibility?.Data?.Message ? (
          <span className="medium-sm text-center flex justify-center">
            {check_compatibility?.Data?.Message}
          </span>
        ) : (
          <span className="medium-sm text-center flex justify-center">
            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0702 */}
            {t('LabelfilterProdukPenjualbelummenambahkaninformasitentangkompatibilitasproduk')}
          </span>
        )}
      </ModalComponent>
      <ModalComponent isOpen={getModal==='modal_login'} setClose={()=>setModal('')} full preventAreaClose hideHeader>
        <div className="flex flex-col gap-4 w-[360px] items-center py-4 px-2">
          <span className="bold-sm">{t('BuyerIndexInginMelihatLebihBanyak')}</span>
          <span className="medium-sm text-center">{t('BuyerIndexAlertBelumLogin')}</span>
          <div className="flex gap-2">
            <Button onClick={()=> router.push(`${process.env.NEXT_PUBLIC_INTERNAL_WEB}register/email?from=mpbuyer&redirect=${window.location.href}`)} color="primary_secondary">{t('BuyerIndexDaftar')}</Button>
            <Button onClick={()=> router.push(`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=mpbuyer&redirect=${window.location.href}`)} >{t('BuyerIndexMasuk')}</Button>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}

export default DetailProductPageResponsive;

export const SectionCard = ({ children, classname }) => {
  return (
    <div
      className={`py-6 px-4 bg-neutral-50 flex flex-col gap-4 text-neutral-900 ${classname}`}
    >
      {children}
    </div>
  );
};
