import { useHeader } from "@/common/ResponsiveContext";
import React, { Fragment, useEffect, useState } from "react";
import style from "./Ulasanbuyer.module.scss";
import TabMenu from "@/components/Menu/TabMenu";
import IconComponent from "@/components/IconComponent/IconComponent";
import Image from "next/image";
import Button from "@/components/Button/Button";
import menuZus from "@/store/menu";
import UlasanSayaResponsive from "./UlasanSayaResponsive";
import { Star, X } from "lucide-react";
import useUlasanStore from "./storeUlasan";
import ExpandableTextArea from "@/components/ExpandableTextArea/ExpandableTextArea";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import toast from "@/store/toast";
import Toast from "@/components/Toast/Toast";
import styles from "./Ulasanbuyer.module.scss";
import ConfigUrl from "@/services/baseConfig";
import SWRHandler from "@/services/useSWRHook";
import { useRouter } from "next/navigation";
import { formatDate } from "@/libs/DateFormat";
import BerikanUlasanResponsive from "./BerikanUlasanResponsive";
import { MenungguUlasanResponsiveSkeleton, UlasanCardResponsiveSkeleton } from "./UlasanResponsiveSkeleton";

// Fungsi helper untuk logging
// 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0017 LB - 0051 LB - 0013 LB - 0052
const logApiData = (data, prefix = "") => {
  if (!data) {
    console.log(`${prefix} Data is undefined or null`);
    return;
  }
  
  try {
    console.log(`${prefix} Data structure:`, {
      hasData: !!data,
      hasDataData: !!data?.Data,
      hasReviews: !!data?.Data?.reviews,
      reviewsLength: data?.Data?.reviews?.length || 0,
      pendingCount: data?.Data?.pendingCount,
      submittedCount: data?.Data?.submittedCount,
      pagination: data?.Data?.pagination
    });
    
    if (data?.Data?.reviews && data.Data.reviews.length > 0) {
      console.log(`${prefix} First review item:`, data.Data.reviews[0]);
    }
  } catch (error) {
    console.error("Error in logging:", error);
  }
};

function UlasanbuyerResponsive({ menu }) {
  const {
    appBarType,
    appBar,
    renderAppBarMobile,
    setAppBar,
    handleBack,
    clearScreen,
    setScreen,
    screen,
    search,
    setSearch,
  } = useHeader();
  
  const router = useRouter();
  const { useSWRHook } = SWRHandler();
  const { menuZ, setMenuZ } = menuZus();
  const { form, setForm } = useUlasanStore();

  // State untuk pagination dan sorting
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // State untuk menyimpan varian yang dipilih
  const [selectedVariants, setSelectedVariants] = useState([]);
  // State untuk menyimpan nama produk untuk ditampilkan di halaman varian
  const [selectedProductName, setSelectedProductName] = useState("");

  const getEndpoint = () => {
    const baseUrl = "/v1/muatparts/reviews";
    const path = menuZ?.id === 2 ? "submitted" : "pending";
    const queryString = `?limit=${perPage}&page=${currentPage}&sort=${sort}${search?.value ? `&search=${search.value}` : ''}`;
    return `${baseUrl}/${path}${queryString}`;
  };

  const { data: listData, mutate, isLoading } = useSWRHook(getEndpoint());

  // Debug log untuk memeriksa struktur data
  useEffect(() => {
    if (listData) {
      logApiData(listData, "API Response:");
    }
  }, [listData]);

  const menus = [
    {
      id: 1,
      name: "Menunggu Ulasan",
      notif: listData?.Data?.pendingCount ?? 0,
    },
    {
      id: 2,
      name: "Ulasan Saya",
      notif: listData?.Data?.submittedCount ?? 0,
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (screen === "") {
      setAppBar({
        title: "Ulasan",
        appBarType: "header_search",
        renderAppBar: "",
        renderActionButton: (
          <div className="ml-4 z-[30]">
            <button 
              className="flex flex-col items-center gap-y-0.5 cursor-pointer"
              onClick={() => {
                const newSort = sort === "newest" ? "oldest" : "newest";
                setSort(newSort);
              }}
            >
              <IconComponent classname={styles.icon_white} src="/icons/sorting.svg" size="medium" />
              <span className="font-semibold text-[10px] leading-[10px] text-neutral-50">Urutkan</span>
            </button>
          </div>
        )
      });
      setSearch({
        placeholder: "Cari Ulasan",
      });
    }
    if (screen === "form") {
      setAppBar({
        title: "Tulis Ulasan",
        appBarType: "header_title",
        onBack: () => clearScreen(),
      });
    }
    if (screen === "listvarian") {
      setAppBar({
        title: "Varian Produk",
        appBarType: "header_title",
        onBack: () => clearScreen(),
      });
    }
    if (screen === "ubahulasan") {
      setAppBar({
        title: "Ubah Ulasan",
        appBarType: "header_title",
        onBack: () => clearScreen(),
      });
    }
  }, [screen]);

  // Inisialisasi menuZ jika belum terdefinisi
  useEffect(() => {
    if (!menuZ || !menuZ.id) {
      setMenuZ({ id: 1, value: "Menunggu Ulasan" });
    }
  }, []);

  // Refresh data saat parameter berubah
  useEffect(() => {
    mutate();
  }, [menuZ?.id, currentPage, perPage, sort, search?.value]);

  if (screen === "form" || screen === "ubahulasan") return <Form />;
  
  // Menggunakan state selectedVariants untuk halaman listvarian, bukan langsung dari listData
  if (screen === "listvarian") return <ListVarian variants={selectedVariants} productName={selectedProductName} />;

  // main screen
  return (
    <div className={style.main}>
      <div className="bg-white pt-4">
        <TabMenu 
          type="buyer" 
          menu={menus} 
          onclick={(val) => {
            if (val && val.id) {
              setMenuZ({ id: val.id, value: val.name || '' });
            }
          }} 
        />
      </div>
      <div className="bg-white min-h-[720px]">
        {/* Improvement fix wording Pak Brian */}
        {isLoading ? (
          <>
          {
            menuZ?.id===1?
              Array(3).fill('').map((_,index)=>(
                <MenungguUlasanResponsiveSkeleton key={`menunggu-ulasan-skeleton-${index}`}/>
              )):
              Array(3).fill('').map((_,index)=>(
                <UlasanCardResponsiveSkeleton key={`menunggu-ulasan-skeleton-${index}`}/>
              ))
          }
          {/* <div className="flex flex-col justify-center items-center">
            <span>Memuat...</span>
          </div> */}
          </>
        ) : (
          <>
            {menuZ?.id === 1 && (
              <>
                {listData?.Data?.reviews && listData.Data.reviews.length > 0 ? (
                  listData.Data.reviews.map((item, index) => (
                    <UlasanBuyerCardResponsive 
                      key={index} 
                      data={item} 
                      setSelectedVariants={setSelectedVariants} 
                      setSelectedProductName={setSelectedProductName}
                    />
                  ))
                ) : (
                  <div className="flex flex-col h-[80vh] items-center justify-center">
                    <IconComponent src="/icons/notulasan.svg" classname={"w-[96px] h-[77px]"} />
                    <div className="font-semibold text-neutral-600 text-[16px] mt-[12px]">Belum Ada Ulasan</div>
                    <div className="font-normal text-neutral-600 text-[12px] mt-[12px]">Tulis Ulasanmu saat pesanan diterima</div>
                  </div>
                )}
              </>
            )}
            {menuZ?.id === 2 &&( 
              <>
                
                <UlasanSayaResponsive reviews={listData?.Data?.reviews || []} />
              </>
            )}
          </>
        )}
      </div>
      <Toast />
    </div>
  );
}

export default UlasanbuyerResponsive;

const FormItem = ({
  children,
  helperText,
  required,
  title
}) => {
  return (
    <div className="flex flex-col">
      <div className="font-semibold text-[14px] leading-[15.4px]">
        {`${title}${required ? "*" : ""}`}
        {!required ? <span className="font-semibold text-[10px] leading-[12px]">{` (Opsional)`}</span> : null}
      </div>
      {helperText ? <div className="mt-3 font-medium text-[10px] leading-[10px]">{helperText}</div> : null}
      <div className="mt-4">
        {children}
      </div>
    </div>
  )
}

// Bagian Form dari UlasanbuyerResponsive.jsx
export const Form = () => {
  const {
    form,
    setForm,
    setRating,
    addPhoto,
    removePhoto,
    resetForm,
    validateForm,
  } = useUlasanStore();
  
  const { setDataToast, setShowToast } = toast();
  const { screen, setScreen } = useHeader();
  const [uploaderKey, setUploaderKey] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const config = ConfigUrl();
  const { useSWRMutateHook, useSWRHook } = SWRHandler();
  
  const api = process.env.NEXT_PUBLIC_GLOBAL_API;
  
  // Cek apakah dalam mode edit
  const isEditMode = form.reviewId ? true : false;
  
  // Fetch data review jika dalam mode edit
  const { data: reviewData, isLoading } = useSWRHook(
    isEditMode ? `${api}v1/muatparts/reviews/${form.reviewId}` : null
  );
  
  const { trigger: uploadImage } = useSWRMutateHook(
    `${api}v1/muatparts/reviews/upload_photo_review`,
    "POST"
  );
  
  // Effect untuk mengisi form saat mode edit dan data sudah tersedia
  useEffect(() => {
    if (isEditMode && reviewData?.Data && !isLoadingData) {
      setIsLoadingData(true);
      
      const review = reviewData.Data;
      setForm({
        ...form,
        rating: review.rating || form.rating,
        ulasanText: review.comment || form.ulasanText,
        uploadedPhotos: review.photos?.length ? 
          [...review.photos, ...Array(5 - review.photos.length).fill(null)] : 
          form.uploadedPhotos
      });
    }
  }, [reviewData, isEditMode]);

  const handleUploadImage = async (base64String, index) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", await (await fetch(base64String)).blob());

      const response = await uploadImage(formData);
      if (response?.data?.Data?.url) {
        addPhoto(response.data.Data.url, index);
        setUploaderKey((prev) => prev + 1);
      }
    } catch (err) {
      setShowToast(true);
      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0495
      setDataToast({ type: "error", message: err.response.data.Data.Message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      setShowToast(true);
      setDataToast({ type: "error", message: validation.error });
      return;
    }

    try {
      const { productId, transactionId, rating, ulasanText, uploadedPhotos, reviewId } = form;
      
      // Format foto menjadi array (konsisten di semua file)
      const photosArray = uploadedPhotos.filter(photo => photo !== null);
      
      const bodyParams = {
        productId: productId,
        transactionId: transactionId,
        rating: rating,
        photos: photosArray // Kirim sebagai array, bukan photos[0], photos[1], dll
      };

      if (ulasanText?.trim()) {
        bodyParams.comment = ulasanText;
      }
      
      if (isEditMode) {
        await config.put({
          path: `v1/muatparts/reviews/${reviewId}`,
          data: bodyParams,
        });
      } else {
        await config.post({
          path: 'v1/muatparts/reviews',
          data: bodyParams,
        });
      }

      setScreen('');
      setShowToast(true);
      setDataToast({
        type: "success",
        message: `Berhasil ${isEditMode ? "mengubah" : "membuat"} ulasan`,
      });
      resetForm();
      
      // Gunakan timeout untuk reload setelah toast muncul
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
      setShowToast(true);
      setDataToast({
        type: "error",
        message: error?.response?.data?.Data?.Message || "Terjadi kesalahan",
      });
    }
  };

  const handleCancel = () => {
    setScreen('');
    resetForm();
  };
  
  // Loading indicator saat mengambil data ulasan
  if (isEditMode && isLoading && !isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-sm font-medium">Memuat data ulasan...</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={`
          py-5 px-4 flex flex-col gap-y-6
          ${screen === "ubahulasan" ? "pb-28" : "pb-20"}
        `}
      >
        <div className="pb-3 border-b border-b-neutral-400 flex gap-x-2">
          <img
            src={form.productImage || "/img/temp-product-terlaris.png"}
            alt="product"
            className="size-[42px] rounded-[2.47px]"
          />
          <div className="flex flex-col justify-between">
            <span className="font-semibold text-[12px] leading-[13.2px]">
              {form.productName || "Nama Produk"}
            </span>
            <span className="font-semibold text-[10px] leading-[10px] text-neutral-700">
              {form.variant || ""}
            </span>
          </div>
        </div>

        <FormItem
          title="Kualitas Produk"
          required={true}
        >
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-w-6 cursor-pointer transition-colors duration-200 ${
                  (form.hover || form.rating) >= star
                    ? "fill-yellow-400 stroke-yellow-400"
                    : "fill-gray-200 stroke-gray-200"
                }`}
                onMouseEnter={() => setForm({ hover: star })}
                onMouseLeave={() => setForm({ hover: 0 })}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </FormItem>

        <FormItem
          title="Berikan ulasan produk ini"
          required={false}
        >
          <ExpandableTextArea
            placeholder="Tulis ulasan kamu mengenai produk ini"
            onChange={(e) => setForm({ ulasanText: e.target.value })}
            value={form.ulasanText}
          />
        </FormItem>

        <FormItem
          title="Bagikan foto-foto dari produk kamu yang terima"
          required={false}
          helperText="Format file jpg/png, ukuran file maks. 10MB"
        >
          <div className="flex flex-wrap gap-3">
            {form.uploadedPhotos.map((url, idx) => (
              <div key={`container-${uploaderKey}-${idx}`} className="relative">
                <div className={url ? "hidden" : "block"}>
                  <ImageUploader
                    key={`uploader-${uploaderKey}-${idx}`}
                    className="!rounded-xl !size-[72px] border-2 border-dashed !border-neutral-400"
                    getImage={(e) => handleUploadImage(e, idx)}
                    maxSize={10000}
                    uploadText={`Foto ${idx+1}`}
                    isCircle={true}
                    onUpload={(e) => handleUploadImage(e, idx)}
                    onError={(err) => {
                      console.error(err);
                      setShowToast(true);
                      setDataToast({ type: "error", message: "Gagal memproses foto" });
                    }}
                    error={false}
                    isLoading={isUploading}
                  />
                </div>
                {url && (
                  <div className="relative border-2 border-dashed border-neutral-400 rounded-xl">
                    <img
                      src={url}
                      className="!rounded-xl !size-[72px] object-cover"
                      alt={`Foto ${idx + 1}`}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(idx);
                      }}
                      className="absolute top-[1px] right-[3px] rounded-full size-4 flex items-center justify-center z-10 bg-white"
                    >
                      <X color="black" size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FormItem>

        <div className="fixed bottom-0 left-0 w-full shadow-muat flex flex-col gap-y-2.5 py-3 px-4 bg-neutral-50">
          {screen === "ubahulasan" ? (
            <span className="font-medium text-[12px] leading-[13.2px] text-neutral-600 self-center">
              Perubahan ulasan hanya bisa dilakukan 1x
            </span>
          ) : null}
          <div className="flex gap-x-2 items-center">
            <Button
                color="primary_secondary"
                Class="w-full max-w-full h-10 !font-semibold flex items-center"
                onClick={handleCancel}
            >
              {screen === "ubahulasan" ? "Batal" : "Batalkan"}
            </Button>
            <Button
                Class="w-full max-w-full h-10 !font-semibold flex items-center"
                onClick={handleSubmit}
            >
              {screen === "ubahulasan" ? "Simpan" : "Kirim"}
            </Button>
          </div>
        </div>
      </div>
      <Toast/>
    </>
  )
};

export const ListVarian = ({ variants = [], productName = "" }) => {
  console.log("Varian yang ditampilkan:", variants);
  
  if (!variants || variants.length === 0) {
    return (
      <div className="flex flex-col min-h-[720px] justify-center py-10 bg-neutral-100">
        <span className="font-semibold text-neutral-600">Tidak ada varian produk</span>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-2 bg-neutral-100">
      {/* Tampilkan nama produk di bagian atas */}
      {productName && (
        <div className="bg-white px-4 py-3">
          <h2 className="font-semibold text-sm">{productName}</h2>
        </div>
      )}
      
      {variants.map((variant, index) => (
        <VarianProdukCardResponsive key={index} variant={variant} />
      ))}
    </div>
  );
};

export const UlasanBuyerCardResponsive = ({ data, setSelectedVariants, setSelectedProductName }) => {
  const { setAppBar, clearScreen, setScreen } = useHeader();
  const router = useRouter();
  const { setForm } = useUlasanStore();
  
  // Jika tidak ada data, jangan render apa-apa
  if (!data) {
    console.log("Data is undefined");
    return null;
  }

  // Fallback data untuk menghindari error jika struktur data tidak sesuai
  const defaultProduct = {
    id: "",
    name: "Nama Produk",
    image: "/img/chopper.png",
    variant: []
  };

  const defaultSeller = {
    id: "",
    name: "Nama Toko",
    logo: "/img/chopper.png"
  };

  // Ekstrak data dengan aman
  let transaction, seller, product;
  
  try {
    // Periksa struktur data untuk menyesuaikan dengan respons API
    if (data.transaction && Array.isArray(data.transaction) && data.transaction.length > 0) {
      transaction = data.transaction[0];
      seller = transaction.store || defaultSeller;
      
      // Jika ada data produk dalam format baru (di luar transaction)
      if (data.product) {
        product = data.product;
      } 
      // Jika tidak, coba cari di dalam transaction
      else if (transaction.products && Array.isArray(transaction.products) && transaction.products.length > 0) {
        // Konversi struktur lama ke struktur baru
        product = {
          id: transaction.products[0].id || "",
          name: transaction.products[0].productName || "Nama Produk",
          image: transaction.products[0].photo || "/img/chopper.png",
          variant: transaction.products[0].variant ? 
            (typeof transaction.products[0].variant === 'string' ? 
              [{ name: transaction.products[0].variant, value: "" }] : 
              transaction.products[0].variant) : []
        };
      } else {
        product = defaultProduct;
      }
    } else {
      // Struktur alternatif
      transaction = data;
      seller = data.store || defaultSeller;
      
      if (data.product) {
        product = data.product;
      } else {
        product = defaultProduct;
      }
    }
  } catch (error) {
    console.error("Error processing data:", error);
    transaction = {};
    seller = defaultSeller;
    product = defaultProduct;
  }

  // Format varian untuk ditampilkan
  const displayVariant = 
    Array.isArray(product.variant) && product.variant.length > 0 
      ? product.variant[0].name + (product.variant[0].value ? ` - ${product.variant[0].value}` : "") 
      : "";

  // Hitung jumlah varian untuk tampilan "+X varian lainnya"
  const variantCount = Array.isArray(product.variant) ? product.variant.length : 0;

  return (
    <div className="p-4 space-y-3 bg-white">
      <div className="flex flex-col gap-2">
        <span className="font-bold text-[10px] text-neutral-900">
          {transaction?.invoiceNumber || transaction?.transactionID || ""}
        </span>
        <span className="font-medium text-[10px] text-neutral-900">
          Pesanan Diterima : {formatDate(transaction?.receivedDate) || ""}
        </span>
      </div>
      <hr className="border-neutral-400" />
      <div className="flex flex-col space-y-3">
        {/* store identity */}
        <div className="flex items-center gap-1.5">
          <Image
            width={16}
            height={16}
            alt="Toko"
            src={seller?.logo || "/img/chopper.png"}
          />
          <span className="font-semibold text-[10px] text-neutral-900">
            {seller?.name || "Nama Toko"}
          </span>
        </div>
        
        {/* Produk - selalu ditampilkan meski tidak ada data produk */}
        <div className="flex gap-2">
          <div className="rounded-md h-[42px] w-[42px] overflow-hidden">
            <Image
              className="h-full w-full object-cover"
              width={42}
              height={42}
              alt="Produk"
              src={product?.image || "/img/chopper.png"}
            />
          </div>
          <div className="flex flex-col space-y-2 w-[278px]">
            <div className="h-[42px] flex flex-col justify-between">
              <span className="font-semibold text-xs text-neutral-900 leading-[12px] line-clamp-2">
                {product?.name || "Nama Produk"}
              </span>
              {displayVariant && (
                <span className="font-semibold text-[10px] text-neutral-700">
                  {displayVariant}
                </span>
              )}
            </div>
            {variantCount > 1 && (
              <span
                className="font-medium text-xs text-primary-700 cursor-pointer"
                onClick={() => {
                  // Simpan variants dan nama produk sebelum navigasi
                  setSelectedVariants(product.variant || []);
                  setSelectedProductName(product.name || "");
                  
                  setScreen("listvarian");
                  setAppBar({
                    title: "Varian Produk",
                    appBarType: "header_title",
                    onBack: () => clearScreen(),
                  });
                }}
              >
                +{variantCount - 1} varian lainnya
              </span>
            )}
          </div>
        </div>
      </div>
      <hr className="border-neutral-400" />
      {/* label */}
      <div className="bg-warning-100 rounded-md p-3 space-y-2">
        <div className="flex items-center gap-2 text-neutral-600 font-medium text-xs">
          <IconComponent
            src={
              process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/ulasanbuyeric.svg"
            }
          />
          Ulasan
        </div>
        <span className="text-warning-900 text-xs font-semibold block">
          Kamu belum menulis ulasan untuk produk ini
        </span>
      </div>
      {/* tombol */}
      <div className="flex gap-2 w-full justify-between">
      {/*  24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0065 */}
        <Button
          color="primary_secondary"
          children="Lihat Toko"
          Class="!h-8 !font-semibold !pb-2 !min-w-[160px]"
          onClick={() => router.push(`/muatparts/seller/${seller?.id || ""}`)}
        />
      {/* 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0065 */}
        <Button
          children="Tulis Ulasan"
          Class="!h-8 !font-semibold !pb-2 !min-w-[160px]"
          onClick={() => {
            // Menyiapkan data untuk form ulasan
            setForm({
              productId: product?.id || "",
              transactionId: transaction?.transactionID || transaction?.transactionId || "",
              productName: product?.name || "Nama Produk",
              productImage: product?.image || "/img/chopper.png",
              variant: displayVariant,
              rating: 0,
              ulasanText: "",
              uploadedPhotos: Array(5).fill(null),
              hover: 0,
            });
            
            setScreen("form");
            setAppBar({
              title: "Tulis Ulasan",
              appBarType: "header_title",
              onBack: () => clearScreen(),
            });
          }}
        />
      </div>
    </div>
  );
};

export const VarianProdukCardResponsive = ({ variant }) => {
  // Jika tidak ada variant, gunakan objek default
  if (!variant) {
    return null;
  }
  
  return (
    <div className="p-4 space-y-3 bg-white">
      <div className="flex flex-col space-y-3">
        {/* store product */}
        <div className="flex gap-2">
          <Image
            className="rounded-md h-[42px] w-[42px] object-cover"
            width={42}
            height={42}
            alt="product"
            src="/img/chopper.png" // Default image for variants
          />
          <div className="flex flex-col space-y-2 w-full">
            <div className="h-[42px] flex flex-col justify-between">
              <div className="flex w-full justify-between items-baseline text-neutral-600 font-medium text-xs">
                <span className="font-semibold text-xs text-neutral-900 leading-[12px] line-clamp-2">
                  {variant.name || ""}
                </span>
              </div>
              {variant.value && (
                <span className="font-semibold text-[10px] text-neutral-700">
                  {variant.value}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0017 LB - 0051 LB - 0013 LB - 0052
};  