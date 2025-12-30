"use client";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import style from "./DetailProductPage.module.scss";
import Dropdown from "@/components/Dropdown/Dropdown";
import Button from "@/components/Button/Button";
import Image from "next/image";
import ButtonPlusMinus from "@/components/ButtonPlusMinus/ButtonPlusMinus";
import { numberFormatMoney } from "@/libs/NumberFormat";
import { laporkanProduk } from "@/store/laporkanProduk";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Fragment, useCallback, useEffect, useState } from "react";
import ProductComponent from "@/components/ProductComponent/ProductComponent";
import ImageDetailProductSlider from "@/components/ImageDetailProductSlider/ImageDetailProductSlider";
import ModalComponent from "@/components/Modals/ModalComponent";
import ButtonAddAddressProduct from "@/components/ButtonAddAddressProduct/ButtonAddAddressProduct";
import ButtonBottomMobile from "@/components/ButtonBottomMobile/ButtonBottomMobile";
import { useCustomRouter } from "@/libs/CustomRoute";
import toast from "@/store/toast";
import SWRHandler from "@/services/useSWRHook";
import { authZustand } from "@/store/auth/authZustand";
import { LaporkanWeb } from "../LaporkanContainer/LaporkanContainer";
import SharedMediaSocial from "../SharedMediaSocial/SharedMediaSocial";
import { useCheckoutStore } from "@/store/checkout";
import useWishlist from "@/store/wishlist";
import { useLanguage } from "@/context/LanguageContext";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { formatDate } from "@/libs/DateFormat";

// Ulasan Produk
import ReviewsContainer from "@/containers/Seller/Web/Review/ReviewsContainer";
import LocationManagementModalWeb from "../LocationManagementModalWeb/LocationManagementModalWeb";
import { filterProduct } from "@/store/products/filter";
import useAlbumStore from "@/store/album";
import { userLocationZustan } from "@/store/manageLocation/managementLocationZustand";
import Tooltip from "@/components/Tooltip/Tooltip";
import CarouselScrollComponent from "@/components/CarouselScrollComponent/CarouselScrollComponent";
import useCounterStore from "@/store/counter";
// Ulasan Produk

const baseUrl = `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/`;

function DetailProductPageWeb({
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
  // Ulasan
  search,
  setSearch,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  reviews,
  reviewSummary,
  sellerProfile,
  // Ulasan
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
  setSelectedLocations=()=>{},
  setCompatibility=()=>{},
  setTotalStock = () => { }
}) {

  const router = useCustomRouter();
  const { t } = useLanguage();
  const tabmenu = [
    {
      id: "detail_product",
      name: t("labelDetailProduk"),
    },
    {
      id: "kompabilitas",
      name: t("labelKompatibilitasBuyer"),
    },
    {
      id: "deskrisi_product",
      name: t("labelDeskripsiProdukBuyer"),
    },
    {
      id: "ulasan_product",
      name: t("labelUlasanProduk"),
    },
  ];
  const [getModal, setModal] = useState("");
  const [getIndexLocationMultiple, setIndexLocationMultiple] = useState({ index: 0, location: {} });
  const { accessToken } = authZustand();
  const { setFetchCounter } = useCounterStore()


  const isSameAccount = product?.sellerInfo?.id === product?.ownedByCurrentUser

  const [wishlist, setWishlist] = useState(product?.Wishlist);

  useEffect(() => {
    setWishlist(product?.Wishlist)
  }, [product?.Wishlist]);

  const [cekCompatibilitas, setCekCompatibilitas] = useState("");
  const [isMultiple, setIsMultiple] = useState(false);
  const [getMenuTab, setMenuTab] = useState("");
  const [showToastDrawer,setShowToastDrawer]=useState({show:false,msg:''})
  const [getVariants, setVariants] = useState({
    variant_one: product?.Variants?.variant_1_value[0] || "",
    variant_two: product?.Variants?.variant_2_value[0] || "",
  });
  const [getPrice, setPrice] = useState(product?.Pricing?.Price);
  const [getAmountProduct, setAmountProduct] = useState(product?.ProductInfo?.MinOrder);

  const { setShowToast, setDataToast } = toast();
  const get_filter=filterProduct()
  // const [validation, setValidation] = useState([])

  // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0176
  const manlok = userLocationZustan()

  const { useSWRHook, useSWRMutateHook } = SWRHandler();

  const { trigger: submitReport } = useSWRMutateHook(
    `${baseUrl}muatparts/report_product`,
    "POST"
  );

  const {
    modalNewAlbum,
    setModalNewAlbum,
    modalListFavorite,
    setIdProductWishlist,
    setModalListFavorite,
  } = useWishlist();
  const { trigger: triggerWishlist } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/wishlist`,
    "POST"
  );

  const { data: resWishlistDelete, trigger: triggerWishlistDelete } =
    useSWRMutateHook(`v1/muatparts/wishlist`, "DELETE");

  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0147
  const {setAddItems} = useAlbumStore()

  // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0048
  const handleFavorit = () => {
    // First check if user is logged in
    if (!accessToken) {
      router.push(process.env.NEXT_PUBLIC_INTERNAL_WEB + `login?from=mpbuyer&redirect=${window.location.href}`)
      return false
    }
    
    // If current state is NOT in wishlist (wishlist is false)
    if (!wishlist) {
      // Adding to wishlist
      triggerWishlist({
        productId: product.ID,
      });
      setAddItems([product.ID])
      setIdProductWishlist(product.ID)
      setModalListFavorite(true);
      setWishlist(true) // Update state AFTER action
    } else {
      // Removing from wishlist
      triggerWishlistDelete({
        data: { productId: product.ID },
      })
      setWishlist(false) // Update state AFTER action
    }
  };
  // LBM - Handle Ingatkan Saya
  const handleIngatkanSaya = () => {
    triggerWishlist({
      productId: product.ID,
    });
    setAddItems([product.ID])
    setIdProductWishlist(product.ID)
    setModalListFavorite(true);
    setWishlist(true) // Update state AFTER action
  }

  // chat titip
  const { trigger: submitDataRoom } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_CHAT_API}api/rooms/muat-muat`,
    "POST",
    null,
    null,
    { loginas: "buyer" }
  );
  const directChatRoom = () => {
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 LB - 0365
    if(!accessToken){
        location.href = process.env.NEXT_PUBLIC_INTERNAL_WEB+`login?from=mpbuyer&redirect=${window.location.href}`;
        return;
    }
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

  const { setBuyNow,buyNow } = useCheckoutStore();
  const POST_CART_ENDPOINT =
    process.env.NEXT_PUBLIC_GLOBAL_API + "v1/muatparts/cart/items";
  const { trigger: triggerPostCart } = useSWRMutateHook(
    POST_CART_ENDPOINT,
    "POST"
  );

  const categories = product?.Category?.length
    ? [
      ...product?.Category?.map((val, i) => {
        if (val)
          return {
            id: product?.CategoryID?.[i],
            name: val,
          };
      }),
    ]?.filter((val) => typeof val !== "undefined")
    : [];
    
  function handleClickBreadcrumb(val) {
    const base_level = ['groupcategoryID','categoryID','subcategoryID','itemID']
    const getIndex = product?.CategoryID?.indexOf(val?.id)
    // 25. 07 - QC Plan - Web Apps - Marketing Muatparts - LB - 0008
    if(getIndex%2==1){
      router.push(`/${categories[0]?.['id']}/${categories[1]?.['id']}`)
    }else{
      get_filter?.setFilterProduct(base_level[getIndex],[val?.id])
      router.push('/products')
    }
  }

  function handleDrawer() {
    // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0149
    if (!isLogin) return router.push(`${process.env.NEXT_PUBLIC_INTERNAL_WEB}/login?from=mpbuyer&redirect=${window.location.href}`)
    setModal("drawer")
    if (getMultipleAlamatProducts?.length>1) {
      setIsMultiple(true)
      return
    }
    let price_grosir=0
    if(isGrosir){
      let grosir=product?.Wholesales
      for (let i = 0; i < product?.Wholesales?.length; i++) {
        if(product?.ProductInfo?.MinOrder>=grosir[i]?.minPurchase && grosir[i]?.maxPurchase==0) price_grosir=grosir[i]?.price
        if(product?.ProductInfo?.MinOrder>=grosir[i]?.minPurchase && product?.ProductInfo?.MinOrder<=grosir[i]?.maxPurchase) price_grosir=grosir[i]?.price
      }
    }
    setMultipleAlamatProducts([
      {
        location: selectedLocation,
        products: product?.Variants?.Combinations.length ? product?.Variants?.Combinations?.map(val => ({ ...val, Quantity: 0, Amount: val?.Stock ? parseInt(val?.Stock) : 0 })) : [{ ID: product?.ID, Quantity: 0, Amount: product?.Stock ? parseInt(product?.Stock) : 0, Stock: product?.Stock ? parseInt(product?.Stock) : 0, DiscountPercentage: product?.Pricing?.DiscountPercentage, OriginalPrice: product?.Pricing?.OriginalPrice, Price: product?.Pricing?.Price, Code: product?.ProductInfo?.Title,PriceGrosir:price_grosir }]
      }
    ])
    setTotalStock({ totalStock: product?.Variants?.Combinations?.length ? product?.Variants?.Combinations?.map(val => ({ id: val?.ID, Amount: val?.Stock ? parseInt(val?.Stock) : 0, Stock: val?.Stock ? parseInt(val?.Stock) : 0 })) : [{ id: product?.ID, Quantity: 0, Amount: product?.Stock ? parseInt(product?.Stock) : 0, Stock: product?.Stock ? parseInt(product?.Stock) : 0 ,PriceGrosir:price_grosir}], })
  }
  
  function handleChangeStockMulti(id,val,idx,increment=false){
    let get_products=[...getMultipleAlamatProducts],tmp_product={...get_products[idx]},get_total_stock=[...getTotalStock?.totalStock],stockItem=get_total_stock.find(a=>a?.id===id);
    if(!stockItem) return;
    let price_grosir=0
    if(isGrosir){
      let grosir=product?.Wholesales
      for (let i = 0; i < product?.Wholesales?.length; i++) {
        if(val>=grosir[i]?.minPurchase && grosir[i]?.maxPurchase==0) price_grosir=grosir[i]?.price
        if(val>=grosir[i]?.minPurchase && val<=grosir[i]?.maxPurchase) price_grosir=grosir[i]?.price
      }
    }
    if(increment){
      if(stockItem.Stock===val) get_total_stock=get_total_stock.map(a=>a?.id===id&&a?.Amount>0?{...a,Amount:a?.Amount-1,PriceGrosir:price_grosir}:a)
      else get_total_stock=get_total_stock.map(a=>a?.id===id?{...a,Amount:a?.Amount-1}:a)
      tmp_product.products=tmp_product.products.map(a=>a?.ID===id&&(a?.Quantity+1)<=stockItem.Stock?{...a,Quantity:a?.Quantity+1,Amount:get_total_stock?.find(a=>a?.id==id)?.Amount,PriceGrosir:price_grosir}:a)
    }else{
      get_total_stock=get_total_stock.map(a=>a?.id===id?{...a,Amount:a?.Amount+1}:a)
      tmp_product.products=tmp_product.products.map(a=>a?.ID===id&&a?.Quantity>0?{...a,Quantity:a?.Quantity-1,Amount:get_total_stock?.find(a=>a?.id==id)?.Amount,PriceGrosir:price_grosir}:a)
    }
    get_products[idx]=tmp_product
    setMultipleAlamatProducts([...get_products])
    setTotalStock({totalStock:get_total_stock})
  }
  function handleToggleMultiAlamat(){
    let price_grosir=0
    if(isGrosir){
      let grosir=product?.Wholesales
      for (let i = 0; i < product?.Wholesales?.length; i++) {
        if(product?.ProductInfo?.MinOrder>=grosir[i]?.minPurchase && grosir[i]?.maxPurchase==0) price_grosir=grosir[i]?.price
        if(product?.ProductInfo?.MinOrder>=grosir[i]?.minPurchase && product?.ProductInfo?.MinOrder<=grosir[i]?.maxPurchase) price_grosir=grosir[i]?.price
      }
    }
    setIsMultiple(!isMultiple)
    handleMultipleAlamatVariantProduct({ location: {}, products: product?.Variants?.Combinations.length ? product?.Variants?.Combinations?.map(({ ...rest }) => ({ Amount: getMultipleAlamatProducts?.[0]?.products?.[0]?.Amount, Quantity: 0, ...rest })) : [{ ...getPrice, Amount: product?.Stock, Quantity: 0 ,PriceGrosir:price_grosir, ID:product?.ID}] }, !isMultiple)
  }
  
  const handleSubmitLaporkan = async (isDesktop) => {
    const { validateForm, dataLaporkan, setApiValidationErrors } =
      laporkanProduk.getState();
    const isValid = validateForm({ setShowToast, setDataToast }, isDesktop);

    if (isValid) {
      try {
        const payload = {
          option: dataLaporkan.OpsiPelanggaran.value,
          details: dataLaporkan.DetailPelanggaran.value,
          link: dataLaporkan.LinkPelanggaran.value,
          productID: product?.ID,
          photo: dataLaporkan.FotoPelanggaran.value,
        };

        const response = await submitReport(payload);

        if (response?.data?.Message?.Code === 200) {
          setModal("");
          setDataToast({
            type: "success",
            message: "Berhasil melaporkan produk",
          });
          setShowToast(true);
        }
      } catch (error) {
        if (error?.response?.status === 400 && error?.response?.data?.Data) {
          setApiValidationErrors(error.response.data.Data);
        }
      }
    }
  };

  const handleScrollTo = (id) => {
    const section = document.getElementById(id);
    setMenuTab(id);
    window.scrollTo({
      top: section.offsetTop,
      behavior: "smooth",
    });
  };
  const setLaporkan = () => {
    if (accessToken) {
      setModal("laporkan");
      return;
    }
    location.href = process.env.NEXT_PUBLIC_INTERNAL_WEB + `login?from=mpbuyer&redirect=${window.location.href}`;
  }
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
      setPrice(product?.Variants?.Combinations?.find((a) => a?.Code === tmp))
    }
    if (!product?.Variants?.Combinations?.length && !getVariants?.variant_one) setPrice({ ...product?.Pricing, Stock: product?.Stock, Code: product?.ProductInfo?.Title })
  }
  useEffect(() => {
    if (product?.Variants?.Combinations?.length && getVariants?.variant_one) {
      let tmp =
        `${product?.Variants?.variant_1_value?.[0]}` +
        `${product?.Variants?.variant_2_value?.[0] ?? ''}`;
      setVariants({
        variant_one: product?.Variants?.variant_1_value[0],
        variant_two: product?.Variants?.variant_2_value[0],
      });
      setPrice(product?.Variants?.Combinations?.find((a) => a?.Code === tmp));
    }
    if (!product?.Variants?.Combinations?.length && !getVariants?.variant_one) setPrice({ ...product?.Pricing, ID: "", Stock: product?.Stock, Code: product?.ProductInfo?.Title })
  }, []);
  useEffect(() => {
    // 25. 07 - QC Plan - Web Apps - Marketing Muatparts - LB - 0010
    window.scrollTo(0, 0)
    setMenuTab('detail_product')
  }, [])
  // console.log(getPrice)
  // console.log(product)

  // Ulasan Produk

  // Common search handler for all tabs
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(search);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchQuery("");
  };
  const searchProps = {
    search,
    setSearch,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleClearSearch,
    filter,
    setFilter
  };

  const reviewProps = {
    sellerProfile,
    reviews
  }
  function handleSaveAlamatMultiple(loc) {
    const tmp = getMultipleAlamatProducts.map((val, i) => {
      // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0176
      if (i == getIndexLocationMultiple.index) return { ...val, location: getIndexLocationMultiple.location||manlok.selectedLocations[0] }
      return val
    })
    setValidation(validation?.filter(a=>a?.index!=getIndexLocationMultiple?.index))
    setMultipleAlamatProducts(tmp)
  }
  function onDeleteMultipleAlmt() {
    let tmp = getMultipleAlamatProducts
    let newTmp = tmp[getIndexLocationMultiple.index]
    newTmp['location'] = {}
    tmp[getIndexLocationMultiple.id] = newTmp
    setMultipleAlamatProducts(tmp)
  }

  function handleAddToTroliMultipleAddress() {
    let tmp = getMultipleAlamatProducts
    let validation_address=tmp?.map((val, i) => !Object.keys(val?.location).length ? { index: i, text: 'Alamat tujuan wajib diisi' }: null)?.filter(a => a !== null)
    let validation_min_purchase=tmp?.map((val, i) => val?.products?.map(pro=>pro?.Quantity<product?.ProductInfo?.MinOrder)).flat()?.filter(a=>a)
    let validation_same_address = tmp?.some((val,idx,arr)=> arr.filter(a=>a?.location?.ID==val?.location.ID).length>1)
    // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0177
    if (validation_address.length) {
      setValidation(validation_address)
      return setShowToastDrawer({show:true,msg:'Periksa alamat tujuan kamu'})
    }
    if(validation_same_address) return setShowToastDrawer({show:true,msg:'Alamat Tidak Boleh Sama'})
    if(validation_min_purchase.length) return setShowToastDrawer({show:true,msg:'Minimal 1 produk ditambahkan'})

    // if(isMultiple){
    //   setValidation(tmp?.map((val, i) => !Object.keys(val?.location).length ? { index: i, text: 'Alamat tujuan wajib diisi' } : null)?.filter(a => a !== null))
    // }
    addToTroliBulk({cart:tmp?.map(val=>{
      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0446
      let newitems = val?.products?.map(a=>({productId:product?.ID,variantId:isVariant?a?.ID:'',quantity:a?.Quantity,notes:''}))
      return {
        locationId:isMultiple?val?.location?.ID:selectedLocation?.ID,
        items:newitems
      }
    })}).then(()=>{
      router.push('/troli')
    })
    if(errorAddToTroliBulk&&errorAddToTroliBulk?.status!==200) setShowToastDrawer({show:true,msg:'Terjadi Kesalahan Server'})
    
  }

  function handleBuyNowMultipleAddress() {
    let tmp = getMultipleAlamatProducts
    let validation_address=tmp?.map((val, i) => !Object.keys(val?.location).length ? { index: i, text: 'Alamat tujuan wajib diisi' } : null)?.filter(a => a !== null)
    let validation_min_purchase=tmp?.map((val, i) => val?.products?.map(pro=>pro?.Quantity<product?.ProductInfo?.MinOrder)).flat()?.filter(a=>a)
    let validation_same_address = tmp?.some((val,idx,arr)=> arr.filter(a=>a?.location?.ID==val?.location.ID).length>1)
    // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0177
    if (validation_address.length) {
      setValidation(validation_address)
      return setShowToastDrawer({show:true,msg:'Periksa alamat tujuan kamu'})
    }
    if(validation_same_address) return setShowToastDrawer({show:true,msg:'Alamat Tidak Boleh Sama'})
    // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0180
    if(validation_min_purchase.length) return setShowToastDrawer({show:true,msg:'Minimal 1 produk ditambahkan'})

    // if(isMultiple){
    //   setValidation(tmp?.map((val, i) => !Object.keys(val?.location).length ? { index: i, text: 'Alamat tujuan wajib diisi' } : null)?.filter(a => a !== null))
    // }
    // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0119
    setBuyNow(tmp?.map(val=>{
      return {
        sellerID:product?.sellerInfo?.id,
        locationID:val?.location?.ID,
        price: val?.products?.reduce((total, item) => total + item?.Quantity * item?.Price, 0),
        products:val?.products?.map(pro=>({id:product?.ID,qty:pro?.Quantity,note:'',...(isVariant&&{variantID:pro?.ID})}))
      }
    }))
    router.push('/checkout')
  }

  useEffect(()=>{
    // setSelectedLocations([])
    if(isGrosir){
      let grosir=product?.Wholesales
      for (let i = 0; i < product?.Wholesales?.length; i++) {
        if(getAmountProduct>=grosir[i]?.minPurchase && grosir[i]?.maxPurchase==0) setPrice(a=>({...a,ID:product?.ID,OriginalPrice:grosir[i]?.price,Price:grosir[i]?.price}))
        if(getAmountProduct>=grosir[i]?.minPurchase && getAmountProduct<=grosir[i]?.maxPurchase) setPrice(a=>({...a,ID:product?.ID,OriginalPrice:grosir[i]?.price,Price:grosir[i]?.price}))
      }
    }
  },[getAmountProduct])
  useEffect(()=>{
    if(showToastDrawer.show){
      setTimeout(() => {
        setShowToastDrawer({show:false,msg:''})
      }, 3000);
    }
  },[showToastDrawer])
  return (
    <div className={style.main}>
      <LocationManagementModalWeb
        isOpen={getModal === 'location'}
        setClose={() => setModal('drawer')}
        onSaveChange={handleSaveAlamatMultiple}
        onSelectLocation={(e) => setIndexLocationMultiple(a => ({ ...a, location: e }))}
        showMultipleSelection
        preventDefaultSave={true} />
      {/* Opsi Pengiriman Lainnya */}
      {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer */}
      {/* LB - 0011
      LB - 0012
      LB - 0021
      LB - 0022
      LB - 0023
      LB - 0024
      LB - 0026
      LB - 0027
      LB - 0029 */}
      <ModalComponent
        full
        isOpen={getModal === 'opsi_pengiriman_lainnya'}
        setClose={() => setModal('')}
        hideHeader
      >
        <div className="py-6 px-4 flex flex-col gap-4 overflow-y-auto h-full max-h-[500px]">
          {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0721 */}
          <span className="bold-base">{t('LabelfilterProdukDetailPengiriman')}</span>
          <div className="flex rounded w-[423px] h-8 border border-neutral-400 px-2 gap-2 items-center">
            <IconComponent src={'/icons/marker-outline.svg'} />
            <span className="medium-xs text-neutral-600">Lokasi  Penjual</span>
            <span className="medium-xs ">{product?.sellerInfo?.Location}</span>
          </div>
          <div className="flex flex-col border-b border-neutral-400">
            <span className="bold-xs py-3">{t('AppKelolaProdukMuatpartsInstantDelivery')}</span>
          </div>
          <div className="flex flex-col">
            <span className="bold-xs py-3">{t('AppKelolaProdukMuatpartsReguler')}</span>
            {
              product?.sellerInfo?.ShippingInfo?.options?.shippingInfo?.map((val, i) => {
                return (
                  <div key={i} className="flex w-full justify-between pl-3 py-3 items-center">
                    <div className="flex flex-col gap-[10px]">
                      <span className="medium-xs">{val?.courier}</span>
                      {val?.estimatedDelivery?.end ? <span className="font-medium text-[10px] text-neutral-600">{t('AppKomplainBuyerLabelEstimatedArrival')} {val?.estimatedDelivery?.end}</span> : ''}
                    </div>
                    <span className="medium-xs">{val?.price}</span>
                  </div>
                )
              })
            }
          </div>

        </div>
      </ModalComponent>
      {/* kompatibilitas modal */}
      <ModalComponent
        full
        isOpen={getModal === "cek_kompatibilitas"}
        // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0154
        classnameContent={"!pt-[106px] !pb-[36px] !px-6 !w-[386px]"}
        setClose={() => setModal("")}
      >
        {check_compatibility?.Data?.Message ? (
          <span className="medium-sm text-center flex justify-center">{check_compatibility?.Data?.Message}</span>
        ) : (
          <span className="medium-sm text-center flex justify-center">
            {/*  25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0702  */}
            {t('LabelfilterProdukPenjualbelummenambahkaninformasitentangkompatibilitasproduk')}
          </span>
        )}
      </ModalComponent>

      {/* bagikan modal */}
      <ModalComponent
        full
        isOpen={getModal === "bagikan"}
        classnameContent={""}
        setClose={() => setModal("")}
      >
        {/* 25. 07 - QC Plan - Web Apps - Marketing Muatparts - LB - 0034 */}
        <SharedMediaSocial
          brand={product?.ProductInfo?.Brand}
          image={product?.Images?.[0]?.includes("www.youtube.com")||product?.Images?.[0]?.includes('youtu.be')?product?.Images?.[1]:product?.Images?.[0]}
          name={product?.ProductInfo?.Title}
          price={getPrice?.Price}
          priceLabel={numberFormatMoney(getPrice?.OriginalPrice)}
          id={product?.ID}
        />
      </ModalComponent>
      {/* hapus alamat modal */}
      <ModalComponent
        isOpen={getModal === "modal_hapus_alamat"}
        setClose={() => setModal("drawer")}
        full
        drawerPosition="right"
      >
        <div className="flex flex-col items-center gap-4 py-5 px-4 w-[380px]">
          <span className="bold-base">Hapus Alamat Tujuan</span>
          <span className="medium-sm text-center">Apakah kamu yakin ingin menghapus pesanan dengan Alamat tujuan <b>{getIndexLocationMultiple.location?.Name}</b></span>
          <div className="mt-1 flex gap-2">
            <Button onClick={() => setModal('drawer')} Class="!h-8" color="primary_secondary">{t('AppMuatpartsProfilSellerIndexBatal')}</Button>
            <Button onClick={() => {
              setModal('drawer')
              onDeleteMultipleAlmt()
            }} Class="!h-8">{t('AppMuatpartsProfilSellerIndexYes')}</Button>
          </div>
        </div>
      </ModalComponent>
      {/* LB - 0067 */}
      {/* 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 */}
      {/* LB - 0273
      LB - 0268
      LB - 0230  */}
      {/* multiple alamat modal */}
      <ModalComponent
        type="Drawer"
        isOpen={getModal === "drawer"}
        setClose={() => {
          setIsMultiple(false)
          setModal("")
        }}
        full
        drawerPosition="right"
        classnameContent={'relative'}
      >
        {showToastDrawer?.show&&<div className="h-12 w-[440px] flex item-center bg-error-50 border border-error-400 rounded-md bottom-16 right-8 absolute z-[60] justify-between p-3">
          <div className="flex gap-3 items-center">
            <IconComponent src={'/icons/error-toast.svg'} />
            <span className="semi-xs">{showToastDrawer.msg}</span>
          </div>
          <span className="cursor-pointer" onClick={()=>setShowToastDrawer({show:false,msg:''})}><IconComponent src={'/icons/silang.svg'} /></span>
        </div>}
        <div className="relative flex flex-col bg-neutral-50 p-4 pr-0 gap-4 text-neutral-900 overflow-y-auto w-[400px]">
          <div className="flex flex-col gap-2">
            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0726 */}
            {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0727 */}
            <span className="text-xl font-bold">{t("LabeldrawerPilihVarianDanAlamatPilihVariandanJumlah")}</span>
            <span className="medium-xs">
              {t("LabeldrawerPilihVarianDanAlamatPilihVariandaninputkanjumlahyanginginkamupesan")}
            </span>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto pb-[108px] pr-4">
            {
              getMultipleAlamatProducts?.map((item, i) => {
                return (
                  <div className="flex flex-col gap-4 border-b border-neutral-400 last:border-b-0" key={i}>
                    {isMultiple && <ButtonAddAddressProduct isError={validation?.find(a => a?.index == i)} address={item?.location} number={i + 1} onAddAddress={() => {
                      let location = item?.location
                      setIndexLocationMultiple({ index: i })
                      setModal('location')
                      setSelectedLocations(location?.ID?[location]:[])
                    }} onDelete={() => {
                      setModal('modal_hapus_alamat')
                      setIndexLocationMultiple({ index: i, location: item.location })
                      setSelectedLocations([])
                    }} />}
                    <div className="flex flex-col pb-6 border-b border-neutral-400 gap-4 last:border-transparent">
                      {/* <div className="flex gap-1 semi-xs">
                        <span>Tipe :</span>
                        <span>On Road</span>
                      </div> */}
                      <div className="flex flex-col gap-6">
                        {
                          item?.products?.map(val => {
                            return (
                              <div className="flex justify-between w-full select-none" key={val?.ID}>
                                <div className="flex flex-col gap-2">
                                  <span className="semi-xs">{val?.Code}</span>
                                  {val?.DiscountPercentage ? <span className="flex items-center gap-1">
                                    <strike className="text-neutral-600 medium-xs">
                                      {isGrosir?numberFormatMoney(val?.PriceGrosir):numberFormatMoney(val?.Price,val?.Quantity==0?1:val?.Quantity)}
                                    </strike>
                                    {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0181 */}
                                    <span className="bg-error-400 rounded text-neutral-50 semi-xs p-1 !leading-3">
                                      {val?.DiscountPercentage}% OFF
                                    </span>
                                  </span> : ''}
                                  <span className="bold-xs">
                                    {isGrosir? numberFormatMoney(val?.PriceGrosir):numberFormatMoney(val?.OriginalPrice,val?.Quantity==0?1:val?.Quantity)}
                                  </span>
                                  {getTotalStock?.totalStock?.find(a => a?.id === val?.ID)?.Amount < 5 ? <span className="text-error-400 text-[10px] font-bold">
                                    Tersisa {getTotalStock?.totalStock?.find(a => a?.id === val?.ID)?.Amount} produk
                                  </span> : ''}
                                </div>
                                
                                <ButtonPlusMinus
                                  increment={(newValue) => handleChangeStockMulti(val?.ID, newValue, i, true)}
                                  decrement={(newValue) => handleChangeStockMulti(val?.ID, newValue, i)}
                                  // onNumber={a=>handleChangeStockMulti(val?.ID,a,i)}
                                  min={0}
                                  number={val?.Quantity}
                                  disableMax={!getTotalStock?.totalStock?.find(a => a?.id === val?.ID)?.Amount}
                                />

                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
                )
              })
            }
            {
              getMultipleAlamatProducts?.length > 1 && <div className="flex items-center gap-2 cursor-pointer justify-center" onClick={() =>{
                let price_grosir=0
                if(!isVariant&&!getTotalStock?.totalStock?.[0]?.Amount) return
                if(isGrosir){
                  let grosir=product?.Wholesales
                  for (let i = 0; i < product?.Wholesales?.length; i++) {
                    if(product?.ProductInfo?.MinOrder>=grosir[i]?.minPurchase && grosir[i]?.maxPurchase==0) price_grosir=grosir[i]?.price
                    if(product?.ProductInfo?.MinOrder>=grosir[i]?.minPurchase && product?.ProductInfo?.MinOrder<=grosir[i]?.maxPurchase) price_grosir=grosir[i]?.price
                  }
                } 
                handleMultipleAlamatVariantProduct({ location: {}, products: product?.Variants?.Combinations.length ? product?.Variants?.Combinations?.map(({ ...rest }) => ({ Amount: getMultipleAlamatProducts?.[0]?.products?.[0]?.Amount, Quantity: 0, ...rest })) : [{ ...getPrice, Amount: product?.Stock, Quantity: 0 ,PriceGrosir:price_grosir, ID:product?.ID}] }, isMultiple)
              }}>
                <IconComponent src={'/icons/plus.svg'} classname={'icon-blue'} />
                <span className="text-primary-700">{t('labelTambahAlamat')}</span>
              </div>
            }
          </div>
          
          <ButtonBottomMobile
            onToggle={handleToggleMultiAlamat}
            disableButtonLeft={isClosedStore}
            disableButtonRight={isClosedStore}
            onClickRight={handleAddToTroliMultipleAddress}
            onClickLeft={handleBuyNowMultipleAddress}
            defaultValueToggle={isMultiple}
            toggleLabelActive={t("LabeldrawerPilihVarianDanAlamatSayainginmengirimkebanyakalamat")}
            leftColor={"primary"}
            rightColor={"primary_secondary"}
            textRight={t("LabeldrawerPilihVarianDanAlamatTambahkeTroli")}
            textLeft={t('labelBeliSekarang')}
            isFixed={false}
            classname={
              "absolute bottom-0 left-0 !rounded-t-none border-t border-neutral-400"
            }
          />
        </div>
      </ModalComponent>

      {/* modal laporkan */}
      {/* LB - 0043, 24. THP 2 - MOD001 - MP - 011 - QC Plan - Web - MuatParts - Paket 028 A - Buyer - Laporkan Produk */}
      <ModalComponent
        full
        isOpen={getModal === "laporkan"}
        setClose={() => setModal("")}
        hideHeader
        classnameContent="!w-fit"
      >
        <LaporkanWeb
          opsiList={DataPelanggaran?.map((val) => ({
            name: val?.value,
            value: val?.id,
          }))}
          onSubmit={handleSubmitLaporkan}
          onClickCancel={() => setModal("")}
        />
      </ModalComponent>

      <div className="w-full max-w-[1200px] self-center">
        {!isSameAccount && <BreadCrumb
          data={[{ id: "home", name: "Home" }, ...categories]}
          maxWidth={"unset"}
          onclick={handleClickBreadcrumb}
          classname={style.breadcrumb}
        />}
        <div className="flex justify-between gap-4 relative">
          <div className="flex flex-col gap-6 min-w-[898px] w-full">
            {isClosedStore&&<div className="flex items-center gap-2 bg-secondary-200 rounded-md py-4 px-6">
              <IconComponent src={'/icons/warning.svg'} classname={'icon-warning-900'} />
              <span className="medium-xs"><b>{t('titleStoreIsClosed')}.</b> Barang ini bisa kamu beli setelah toko buka pada <b>{getDateStoreOpen}</b></span>
            </div>}
            {/* kompabilitas */}
            {(isLogin && !isSameAccount) && (
              <CardDetailProduct>
                <div className="flex gap-3">
                  <Dropdown
                    placeholder={t("labelKendaraanSaya")}
                    options={DataKompatibilitas?.map(({ id, brand,model,type, ...rest }) => ({ name: `${brand}, ${model}, ${type}`, value: id, ...rest }))}
                    onSelected={(a) => setCekCompatibilitas(a)}
                    classname={'!w-[262px]'}
                    defaultValue={cekCompatibilitas}
                  />
                  <Button
                    Class="!h-8 !w-[171px] !max-w-none !whitespace-nowrap"
                    onClick={() => {
                      if(!cekCompatibilitas) return setModal("cek_kompatibilitas")
                      setCompatibility({garageID:cekCompatibilitas?.[0]?.value,productID:product?.ID})
                      setModal("cek_kompatibilitas")
                    }}
                  >
                    {t("labelCekKompatibilitas")}
                  </Button>
                </div>
                <div className="flex items-center gap-1 cursor-pointer" onClick={()=>setCekCompatibilitas([{value: "",name: "",title: ""}])}>
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/reset.svg"
                    }
                    width={16}
                    height={16}
                    alt="reset"
                    className=""
                  />
                  <span className="text-xs font-medium text-primary-700">
                    {t("labelResetPengecekan")}
                  </span>
                </div>
              </CardDetailProduct>
            )}
            {/* detail */}
            <div className="bg-neutral-50 rounded-xl shadow-muatmuat py-5 px-8 justify-between items-start flex gap-[23px] w-full">
              {/* pictures */}
              <div className="flex flex-col w-[350px]">
                {/* LBM */}
                {product?.Images?.some(a=>typeof a==='string' && a.length)&&<ImageDetailProductSlider images={product?.Images} />}
              </div>
              {/* Desc */}
              <div className="w-full flex flex-col gap-4">
                {/* title desc */}
                <div className="flex flex-col gap-4 border-b border-neutral-400 pb-4 text-neutral-900">
                  <h1 className="font-bold text-[18px]">
                    {product?.ProductInfo?.Title}
                  </h1>
                  <span className="font-medium text-xs flex">
                    <span className="flex items-center gap-1">
                      {t("labelTerjualBuyer")}{" "}
                      <span className="text-neutral-700">
                        {product?.SoldCount > 9999
                          ? "9.999+"
                          : product?.SoldCount}
                      </span>{" "}
                      &#183;{" "}
                      <Image
                        src={
                          process.env.NEXT_PUBLIC_ASSET_REVERSE +
                          "/icons/product-star.svg"
                        }
                        width={16}
                        height={16}
                        alt="Rating"
                      />{" "}
                      {product?.Rating?.toFixed(1)}{" "}
                      <span className="text-neutral-700">
                        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0719 */}
                        ({product?.ReviewCount} {t('LabelfilterProdukRating')})
                      </span>
                    </span>
                  </span>
                  {getPrice?.DiscountPercentage ? (
                    <>
                      <div className="flex gap-1 items-center">
                        <strike className="text-neutral-600 medium-xs">
                          {numberFormatMoney(getPrice?.OriginalPrice)}
                        </strike>

                        <p className={`${style.discount} bg-error-400 semi-xs text-neutral-50 p-1 rounded`}>
                          {getPrice?.DiscountPercentage}% OFF
                        </p>
                      </div>
                      <h1 className="text-neutral-900 text-[20px] font-bold">
                        {numberFormatMoney(getPrice?.Price)}
                      </h1>
                    </>
                  ) : (
                    <h1 className="text-neutral-900 text-[20px] font-bold">
                      {numberFormatMoney(getPrice?.Price)}
                    </h1>
                  )}
                </div>
                {!!product?.Bonus?.length && (
                  <div className="flex flex-col gap-2 border-b border-neutral-400 pb-4 text-neutral-900">
                    <span className="text-xs font-medium text-neutral-600">
                      Bonus
                    </span>
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
                  </div>
                )}
                {!!product?.Variants?.variant_1_value?.length && (
                  <div className="flex flex-col gap-4 border-b border-neutral-400 pb-4 text-neutral-900">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-medium text-neutral-600 gap-1 flex">
                        {product?.Variants?.variant_1_name}:
                        <span className="text-neutral-900">
                          {getVariants.variant_one}
                        </span>
                      </span>
                      <div className="flex overflow-auto gap-[7px]">
                        {product?.Variants?.variant_1_value?.map((val, i) => (
                          <span
                            key={i}
                            className={`!h-[28px] px-3 ${getVariants.variant_one === val
                                ? "bg-primary-50 border-primary-700 text-primary-700"
                                : "bg-neutral-200 border-neutral-200 text-neutral-600"
                              } border font-semibold text-[10px] flex items-center rounded-2xl cursor-pointer`}
                            onClick={() => handleSelectVariant('variant_one', val)}
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                    {!!product?.Variants?.variant_2_name?.length && (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-neutral-600 gap-1 flex">
                          {product?.Variants?.variant_2_name}:
                          <span className="text-neutral-900">
                            {getVariants.variant_two}
                          </span>
                        </span>
                        <div className="flex overflow-auto gap-[7px]">
                          {product?.Variants?.variant_2_value?.map((val, i) => (
                            <span
                              key={i}
                              className={`!h-[28px] px-3 ${getVariants.variant_two === val
                                  ? "bg-primary-50 border-primary-700 text-primary-700"
                                  : "bg-neutral-200 border-neutral-200 text-neutral-600"
                                } border font-semibold text-[10px] flex items-center rounded-2xl cursor-pointer`}
                              onClick={() =>
                                handleSelectVariant('variant_two', val)
                              }
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-4 border-b border-neutral-400 pb-4 text-neutral-900">
                  {<span className="flex gap-4">
                    <span className="w-[100px] text-xs text-neutral-600">
                      {t("labelkualitasBuyer")}
                    </span>
                    <span className="text-xs flex gap-1">
                      <span>{product?.ProductInfo?.Grade||"-"}</span>
                      {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0172 & LB - 0717 */}
                      <Tooltip  
                        text={(
                          // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0172
                            <p>{t("LabeltooltipKualitasProdukSukucadangyangdiproduksiolehperusahaanlainatasnamapabrikankendaraan")}</p>
                        )} 
                        trigger='click'
                        position={'right'}>
                        <span className="cursor-pointer">
                          <Image
                            src={
                              process.env.NEXT_PUBLIC_ASSET_REVERSE +
                              "/icons/tips-gray.svg"
                            }
                            width={16}
                            height={16}
                            alt="tips"
                          />
                        </span>
                      </Tooltip>
                    </span>
                  </span>}
                  <span className="flex gap-4">
                    <span className="w-[100px] text-xs text-neutral-600">
                      {t("labelKondisiBuyer")}
                    </span>
                    <span className="text-xs flex gap-1">
                      {product?.ProductInfo?.Condition||"-"}
                    </span>
                  </span>
                  <span className="flex gap-4">
                    <span className="w-[100px] text-xs text-neutral-600">
                      {t("labelBrandBuyer")}
                    </span>
                    <span className="text-xs flex gap-1">
                      {product?.ProductInfo?.Brand||"-"}
                    </span>
                  </span>
                  {product?.ProductInfo?.Etalase && (
                    <span className="flex gap-4">
                      <span className="w-[100px] text-xs text-neutral-600">
                        {t("labelEtalaseBuyer")}
                      </span>
                      <span className="text-xs flex gap-1">
                        {product?.ProductInfo?.Etalase||"-"}
                      </span>
                    </span>
                  )}
                  <span className="flex gap-4">
                    <span className="w-[100px] text-xs text-neutral-600">
                      {t("labelMinPesananBuyer")}
                    </span>
                    <span className="text-xs flex gap-1">
                      {product?.ProductInfo?.MinOrder} pcs
                    </span>
                  </span>
                </div>
                {/* toko */}
                <div className="flex gap-2 border-b border-neutral-400 pb-4 text-neutral-900">
                  <div className="w-11 h-11 rounded-full border border-neutral-500 overflow-hidden">
                    {product?.sellerInfo?.Logo ? <ImageComponent
                      src={product?.sellerInfo?.Logo}
                      width={44}
                      height={44}
                      objectFit="cover"
                      alt="cover"
                      className={'w-full h-full'}
                    /> : <span className="w-11 h-11 rounded-full border border-neutral-400"></span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p
                      className="font-semibold text-sm cursor-pointer"
                      onClick={() => {
                        router.push(`/seller/${product?.sellerInfo?.id}`);
                      }}
                    >
                      {product?.sellerInfo?.Name}
                    </p>
                    <span className="font-medium text-xs gap-1 flex">
                      {
                        IsJamOperationalOpen() ?
                          <span className="text-neutral-600">Online</span>
                          : <span className="text-neutral-600">Online</span>

                      }
                      {/* <span>{product?.sellerInfo?.LastOnline}</span> */}
                    </span>
                    <div className="flex gap-1 text-xs">
                      <Image
                        src={
                          process.env.NEXT_PUBLIC_ASSET_REVERSE +
                          "/icons/product-star.svg"
                        }
                        width={16}
                        height={16}
                        alt="Rating"
                      />
                      <span>{product?.sellerInfo?.Rating?.toFixed(1)}</span>
                      <span className="text-neutral-700">
                      {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0719 */}
                        ({product?.sellerInfo?.ReviewCount} {t('LabelfilterProdukRating')})
                      </span>
                    </div>
                  </div>
                </div>
                {/* lokasi */}
                <div className="flex flex-col gap-4 border-b border-neutral-400 pb-4 text-neutral-900 text-xs font-medium">
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
                    <span className="text-neutral-600">{t("labelLokasiPenjual")}</span>
                    <span>{product?.sellerInfo?.Location}</span>
                  </div>
                  <div className="flex gap-2 items-center select-none">
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_ASSET_REVERSE +
                        "/icons/time.svg"
                      }
                      width={16}
                      height={16}
                      alt="marker"
                    />
                    <span className="text-neutral-600">{t("labelOperasionalBuyer")}</span>
                    {IsJamOperationalOpen() ? (
                      <span className="text-success-400">{t("labelBukaBuyer")}</span>
                    ) : (
                      <span className="text-error-400">{t("labeltutupbuyer")}</span>
                    )}
                    {IsJamOperationalOpen() && <>&#183;</>}
                    {IsJamOperationalOpen() && (
                      <span>
                        {product?.sellerInfo?.OperationalHours?.[today]}
                      </span>
                    )}
                    <span className="cursor-pointer group relative">
                      <IconComponent src={"/icons/chevron-down.svg"} />
                      <div className="hidden group-hover:flex flex-col  bg-neutral-50 border border-neutral-300 rounded-md gap-3 py-2 px-3 shadow-md absolute right-0 w-[230px] medium-sm">
                        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0720 */}
                        <span>{t("LabelfilterProdukJamOperasionalPenjual")}</span>
                        {Object.entries(weekDays).map((val) => {
                          return (
                            <span
                              key={val[0]}
                              className="flex justify-between items-center"
                            >
                              <span>{weekDays?.[val[0]]}</span>
                              <span>
                                {
                                  product?.sellerInfo?.OperationalHours?.[
                                  val[0]
                                  ]
                                }
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    </span>
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
                      <span className="text-neutral-600">{t("labelOpsiPengiriman")}</span>
                    </div>
                    {product?.sellerInfo?.ShippingInfo?.options?.shippingInfo?.map(
                      (val, i) => {
                        return (
                          <div className="flex gap-2 ml-6" key={i}>
                            <span>
                              {val?.courier} : {t('AppJadwalOperasionalMuatpartsMulai')} {val?.price}{" "}
                            </span>
                            <span className="text-neutral-600">
                              ({t('AppKomplainBuyerLabelEstimatedArrival')} {val?.estimatedDelivery?.["start"] ? formatDate(val?.estimatedDelivery?.["start"], ['day', 'month', 'year'], false) : ''} -{" "}
                              {val?.estimatedDelivery?.["end"] ? formatDate(val?.estimatedDelivery?.["end"], ['day', 'month', 'year'], false) : ''})
                            </span>
                          </div>
                        );
                      }
                    )}
                    {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0173 */}
                    {product?.sellerInfo?.Insurance==='Wajib' && <Button
                      Class="ml-6 !bg-primary-50 !text-xs !font-semibold !rounded-md !py-1 !px-2 !w-[calc(100% - 24px)] !max-w-none !border-none"
                      color="primary_secondary"
                    >
                      {t("labelWajibAsuransiPengiriman")}
                    </Button>}
                    <span className="text-primary-700 text-xs font-medium ml-6 select-none cursor-pointer" onClick={() => setModal('opsi_pengiriman_lainnya')}>
                      {t("labelLIhatOpsiPegirimanBuyer")}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-5 text-sm text-neutral-900">
                  <span>{t("labelProdukBermasalah")}</span>
                  <div
                    className="flex items-center gap-[2px] select-none text-primary-700 cursor-pointer"
                    onClick={setLaporkan}
                  >
                    <IconComponent src={"/icons/flag-blue.svg"} />
                    <span>{t("labellaporkanBuyer")}</span>
                  </div>
                </div>
              </div>
            </div>
            <CardDetailProduct classname={`!py-5 !px-8`}>
              <div className="flex ">
              {tabmenu
                .filter(tab => tab.id !== "ulasan_product" || !isSameAccount)
                .map((val, i) => (
                  <>
                    {i > 0 ? <span className="h-10 w-[1px] bg-neutral-400 ml-1"></span> : ''}
                    <span
                      key={val.id}
                      onClick={() => handleScrollTo(val.id)}
                      className={`cursor-pointer px-6 h-10 border-b-2 text-base font-semibold ${
                        getMenuTab === val?.id
                          ? "border-primary-700 text-primary-700"
                          : "border-neutral-50 text-neutral-900"
                      } flex gap-2 items-center first:ml-0 ml-1`}
                    >
                      {val.name}
                    </span>
                  </>
              ))}
              </div>
            </CardDetailProduct>
            <DetailProdukCard details={product?.ProductDetail ?? {}} />
            <DeskripsiProduk
              desc={product?.Description}
              setShowDescription={setShowDescription}
              showDescription={showDescription}
            />
            <Kompatibilitas
              getExpanded={getExpanded}
              handleExpanded={handleExpanded}
              data={product?.Compability}
            />
            {!isSameAccount && <UlasanProduk
              // loading={loading}
              {...searchProps}
              {...reviewProps}
            />}
          </div>
          <div
            style={{ top: "calc(16px * 10)" }}
            className="flex flex-col min-w-[286px] py-6 px-5 gap-6 bg-neutral-50 rounded-xl shadow-muatmuat text-neutral-900 h-fit sticky"
          >
            <span className="font-semibold text-[18px] ">{t("labelAturJumlah")}</span>
              {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer -  LB-0182 */}
              {!!(product?.Variants?.Combinations?.length) && 
                <span className="font-medium text-xs ">
                  {getVariants?.variant_one}
                  {getVariants?.variant_two ? `, ${getVariants.variant_two}` : ''}
                </span>
              }
            <div className="flex gap-2 items-center">
              <ButtonPlusMinus
                max={parseInt(getPrice?.Stock)}
                min={product?.ProductInfo?.MinOrder}
                // increment={(a) => setAmountProduct(a)}
                // decrement={(a) => setAmountProduct(a)}
                onNumber={a=>{
                  setAmountProduct(a)
                }}
                number={getAmountProduct}
                
                disable={isClosedStore}
              />
              {getPrice?.Stock == 0 ? (
                <span className="bold-xs text-error-400">Stock habis</span>
              ) : (
                <div className="text-xs flex items-center select-none gap-1">
                  <span className="text-neutral-600 font-normal">
                    {t("labeltersediabuyer")} :
                  </span>
                  <span className="text-neutral-900 font-bold">
                    {getPrice?.Stock}
                  </span>
                </div>
              )}
            </div>
            <span className="flex justify-between items-center text-neutral-900 select-none">
              <span className="font-medium text-xs ">{t("labelSubTotalBuyer")}</span>
              <span className="font-bold text-base ">
                {isGrosir ? numberFormatMoney(getPrice?.Price) : numberFormatMoney(getPrice?.Price, getAmountProduct > getPrice?.Stock?getPrice?.Stock : getAmountProduct)}
              </span>
            </span>
            {!isClosedStore&&<div className="flex flex-col w-full gap-3 pb-6 border-b border-neutral-400 select-none">
              {getPrice?.Stock == 0 ? (
                <Button
                // LBM - Handle Ingatkan Saya
                  onClick={()=>{
                    if(wishlist){
                      router.push(`/album`)
                    } else {
                      handleIngatkanSaya()
                    }
                  }}
                  Class="!w-full !max-w-none"
                  color="primary_secondary"
                  iconLeft={"/img/cart-add-blue.png"}
                >
                  {/* LBM - Handle Ingatkan Saya */}
                  {wishlist?'Cek Favorit':t("labelIngatkanSayaBuyer")}
                </Button>
              ) :(
                <>
                  {isSameAccount ? (<Button
                    onClick={() => {
                      // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0487
                      window.location.href = process.env.NEXT_PUBLIC_SELLER_WEB + `muatparts/kelolaproduk/daftarproduk?tab=1&lang=${localStorage.getItem("lang")}`
                    }}
                    Class="!w-full !max-w-none flex gap-1"
                    color="primary_secondary"
                  >
                    <span>{t("AppJadwalOperasionalMuatpartsBukaToko")}</span>
                  </Button>):(
                  <Button
                    onClick={() => {
                      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0146
                      if (!accessToken) {
                        // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0450 & LB - 0149
                        router.push(`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=mpbuyer&redirect=${window.location.href}`)
                      } else {
                        triggerPostCart({
                          quantity: getAmountProduct,
                          productId: product?.ID,
                          notes: "",
                          locationId: selectedLocation?.ID,
                          ...(getPrice?.ID && { variantId: isVariant?getPrice.ID:'' })
                        }).then(() => {
                          setFetchCounter(true)
                          setDataToast({
                            type: "success",
                            message: "Berhasil ditambahkan ke troli",
                          });
                          setShowToast(true);
                        });
                      }
                    }}
                    Class="!w-full !max-w-none flex gap-1"
                    color="primary_secondary"
                    iconLeft={"/img/cart-add-blue.png"}
                  >
                    <IconComponent src={'/icons/cart.svg'} classname={`icon-blue icon-stroke-2 icon-fill-none`} />
                    <span>{t("labelTambahKeTroli")}</span>
                  </Button>)}
                  {isSameAccount ? (
                  <Button
                    onClick={() => {
                      // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0487
                      window.location.href = process.env.NEXT_PUBLIC_SELLER_WEB + `muatparts/kelolaproduk/tambahproduk?page=1&share=true&id=${product.ID}&type=edit&lang=${localStorage.getItem("lang")}`
                    }}
                    Class="!w-full !max-w-none"
                  >
                    {t("AppKelolaProdukMuatpartsTambahUbahProduk")}
                  </Button>) : (
                  <Button
                    // disabled={!accessToken}
                    onClick={() => {
                       //  25. 11 - Web - LB - 0130
                      if(accessToken) {
                        setBuyNow([{
                          sellerID: product?.sellerInfo?.id,
                          locationID: selectedLocation?.ID,
                          price: getAmountProduct * getPrice?.Price,
                          products: [
                            {
                              id: product?.ID,
                              qty: getAmountProduct,
                              notes: "",
                              ...(getPrice?.ID && { variantID: getPrice.ID }),
                            },
                          ],
                        }]);
                        router.push("/checkout");
                      } else {
                        router.push(`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=mpbuyer&redirect=${window.location.href}`)
                      }
                    }}
                    Class="!w-full !max-w-none"
                  >
                    {t("labelBeliSekarang")}
                  </Button>)}
                </>
              )}
            </div>}
            {!isClosedStore && !isSameAccount &&<span className="flex gap-[5px] font-medium text-xs text-neutral-900 select-none">
              <span>{t("labelinginpesanmulti")}</span>
              <span
                className="text-primary-700 cursor-pointer select-none"
                onClick={handleDrawer}
              >
                {t("labelklikdisinibuyer")}
              </span>
            </span>}
            <div className="flex items-center divide-x divide-neutral-400 gap-3 self-center select-none">
              {!isSameAccount && <span
                className="flex gap-1 cursor-pointer items-center"
                onClick={directChatRoom}
              >
                <IconComponent src={"/icons/chat.svg"} />
                <span className="text-sm font-semibold text-neutral-900 select-none">
                  {t("labelPesanBuyer")}
                </span>
              </span>}
              {!isSameAccount && <span
                onClick={handleFavorit}
                className="flex gap-1 cursor-pointer items-center pl-3"
              >
                <IconComponent src={wishlist ? "/icons/icon-love-wishlist.svg" : "/icons/heart-outline.svg"} />
                <span className="text-sm font-semibold text-neutral-900 select-none">
                  {t("titleHeaderFavorit")}
                </span>
              </span>}
              <span
                onClick={() => setModal("bagikan")}
                className="flex gap-1 cursor-pointer items-center pl-3"
              >
                <IconComponent src={"/icons/share.svg"} />
                <span className="text-sm font-semibold text-neutral-900 select-none">
                  {t("labelShareBuyer")}
                </span>
              </span>
            </div>
          </div>
        </div>
        {product?.similarProduct?.length ? (!isSameAccount && <RekomendasiSerupa data={product?.similarProduct} />) : ''}
      </div>
      {/* // Improvement Impact Nonaktif User Seller Muatparts */}
      <ModalComponent classname="!w-full" classnameContent={"!w-full max-w-[398px] !px-0 pb-0"} isOpen={!product?.sellerInfo?.StoreisActive} preventAreaClose={true} setClose={()=>{router.back()}} >
        <div className="flex flex-col items-center justify-center px-6 py-9 !w-full gap-6">
          <p className="text-sm font-medium leading-3">{t("LabeldetailProductTidakDitemukanProduktidaktersedia")}</p>
          <Button onClick={()=>{router.back()}} Class="!leading-3">Oke</Button>
        </div>
      </ModalComponent>
    </div>
  );
}

export default DetailProductPageWeb;

const CardDetailProduct = ({ children, classname, id }) => {
  return (
    <div
      id={id}
      className={`flex items-center justify-between  bg-neutral-50 rounded-xl shadow-muatmuat py-6 px-5 ${classname}`}
    >
      {children}
    </div>
  );
};

const DetailProdukCard = ({ details }) => {
  const { t } = useLanguage();
  return (
    <CardDetailProduct
      id={"detail_product"}
      classname={"gap-6 text-neutral-900 flex flex-col !items-start !py-5 !px-8"}
    >
      <p className="font-semibold text-[18px] ">{t("labelDetailProduk")}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="w-full grid grid-cols-2 gap-4">
          {Object.entries(details)?.map((val, i) => (
            <Fragment key={i}>
              <span className="text-neutral-600 font-medium text-xs w-[150px]">
                {val[0]?.replace("_", " ")}
              </span>
              {val[1] ? <span className="font-medium text-xs">{val[1]}</span> : <span className="font-medium text-xs">Tidak Ada {val[0]?.replace("_", " ")}</span>}
            </Fragment>
          ))}
        </div>
      </div>
    </CardDetailProduct>
  );
};

const UlasanProduk = (
  {
    // Ulasan
    search,
    setSearch,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    reviews,
    reviewSummary,
    sellerProfile
    // Ulasan
  }
) => {
  // Ulasan Produk

  // Common search handler for all tabs
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(search);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchQuery("");
  };
  const searchProps = {
    search,
    setSearch,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleClearSearch,
    filter,
    setFilter
  };

  const reviewProps = {
    sellerProfile,
    reviews
  }
  // Ulasan Produk
  return (
    <CardDetailProduct
      className="flex justify-between gap-8 !py-5 !px-8"
      id={"ulasan_product"}
    >
      {/* <RatingFilter  />  Di Kerjakan Oliver */}

      <ReviewsContainer
        // loading={loading}
        {...searchProps}
        {...reviewProps}
      />
    </CardDetailProduct>
  );
};

const DeskripsiProduk = ({ desc, showDescription, setShowDescription }) => {
  const { t } = useLanguage();
  return (
    <CardDetailProduct
      id={"deskrisi_product"}
      classname={
        "flex flex-col gap-6 text-xs font-medium text-neutral-900 items-start !py-5 !px-8"
      }
    >
      <p className="text-[18px] self-start">{t("labelDeskripsiProdukBuyer")}</p>
      <div className="flex flex-col items-start gap-[14px] w-full">
        {desc ? <p className={`${showDescription ? "" : "line-clamp-6"}`}>{desc}</p> : <span className="text-neutral-600 ">{t("labeltidakadaProductDeskripsi")}</span>}
        {desc?.length >= 1000 ? (
          <span
            className="flex gap-2 items-center text-primary-700 select-none cursor-pointer"
            onClick={() => setShowDescription(!showDescription)}
          >
            <span>
              Lihat {showDescription ? "Lebih Sedikit" : "Selengkapnya"}
            </span>
            <IconComponent
              classname={"icon-blue"}
              src={`${showDescription
                  ? "/icons/chevron-up.svg"
                  : "/icons/chevron-down.svg"
                }`}
              width={12}
              height={12}
            />
          </span>
        ) : (
          ''
        )}
      </div>
    </CardDetailProduct>
  );
};

const Kompatibilitas = ({ data, getExpanded, handleExpanded }) => {
  const { t } = useLanguage()
  return (
    <CardDetailProduct
      id={"kompabilitas"}
      classname={
        "flex flex-col gap-6 w-full font-medium text-xs text-neutral-900 !py-5 !px-8"
      }
    >
      <span className="font-semibold text-[18px] self-start">
        {t("labelKompatibilitasBuyer")}
      </span>
      <div className="flex flex-col gap-4 w-full">
        {data?.length ? <div
          onClick={() => handleExpanded("scania")}
          className="flex w-full justify-between h-6 items-center select-none cursor-pointer"
        >
          <span>Scania</span>
          <IconComponent
            src={"/icons/chevron-down.svg"}
            width={24}
            height={24}
          />
        </div> : ''}
        {(!!getExpanded.includes("scania") && data?.length) ? (
          <div className="rounded-[12px] border border-neutral-400 py-4 px-3">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="text-left pl-6 font-bold text-neutral-600 border-b border-neutral-400">
                    Model
                  </th>
                  <th className="text-left pl-6 font-bold text-neutral-600 border-b border-neutral-400">
                    Tahun
                  </th>
                  <th className="text-left pl-6 font-bold text-neutral-600 border-b border-neutral-400">
                    Tipe
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-4 px-6 border-b border-neutral-400">
                    asdsd
                  </td>
                  <td className="py-4 px-6 border-b border-neutral-400">
                    asdsd
                  </td>
                  <td className="py-4 px-6 border-b border-neutral-400">
                    asdsd
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-neutral-400">
                    asdsd
                  </td>
                  <td className="py-4 px-6 border-b border-neutral-400">
                    asdsd
                  </td>
                  <td className="py-4 px-6 border-b border-neutral-400">
                    asdsd
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-neutral-400">
                    asdsd
                  </td>
                  <td className="py-4 px-6 border-b border-neutral-400">
                    asdsd
                  </td>
                  <td className="py-4 px-6 border-b border-neutral-400">
                    asdsd
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0723
        ) : <span>{t("LabelkompatibilitasBuyerTidakadadataKompatibilitas")}</span>}
      </div>
    </CardDetailProduct>
  );
};

const RekomendasiSerupa = ({ data }) => {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col gap-[25px] w-full mt-6">
      <span className="font-bold text-[18px] text-[#1b1b1b]">
        {t("labelRekomendasiSerupa")}
      </span>
      <CarouselScrollComponent isArrowAbsolute className="flex w-full overflow-auto gap-3 scrollbar-none">
        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 LB - 0577 */}
        {data?.slice(0, 5).map((val, i) => {
          return <ProductComponent key={i} {...val} />;
        })}
      </CarouselScrollComponent>
    </div>
  );
};
