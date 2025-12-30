import { useHeader } from "@/common/ResponsiveContext";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import styles from "./UlasanSayaResponsive.module.scss";
import ImagesPreview from "@/components/ImagesPreview/ImagesPreview";
import useUlasanStore from "./storeUlasan";
import { formatDate } from "@/libs/DateFormat";

const UlasanCard = ({
  // 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0017 LB - 0051 LB - 0013 LB - 0052
  data,
  setActiveIndex,
  setImages,
  setIsModalOpen
}) => {
  const { setAppBar, clearScreen, setScreen } = useHeader();
  const router = useRouter();
  const { setForm } = useUlasanStore();

  // Jika tidak ada data atau data review tidak valid, jangan render apapun
  if (!data || !data.review) {
    return null;
  }

  const { review, product, store, receivedDate } = data;
  const rating = review.rating || 0;
  const maxRating = 5;
  
  // Siapkan array foto jika ada
  const reviewPhotos = review.photos || [];

  return (
    <div className="bg-neutral-50 p-4 flex flex-col gap-y-3">
      <div className="flex justify-between items-center pb-3 border-b border-b-neutral-400">
        <span className="font-bold text-[10px] leading-[10px]">
          {data.invoiceNumber || ""}
        </span>
        <span className="font-medium text-[10px] leading-[10px]">
          {(() => {
            const date = new Date(receivedDate);
            
            // Format: DD-MM-YYYY HH:MM
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            
            return `${day}-${month}-${year} ${hours}:${minutes}`;
          })() || ""}
        </span>
      </div>
      <div className="flex gap-x-2">
        <img
          src={product?.image || "/img/temp-product-terlaris.png"}
          alt="product"
          className="rounded-[2.47px] size-[42px] object-cover"
        />
        <div className="flex flex-col gap-y-3">
          <span className="font-semibold text-[12px] leading-[13.2px] line-clamp-2">
            {product?.name || ""}
          </span>
          {product?.variant && (
            <span className="font-semibold text-[10px] leading-[10px] text-neutral-600">
              {typeof product.variant === 'string' 
                ? product.variant 
                : `${product.variant.type || ''} - ${product.variant.size || ''}`}
            </span>
          )}
          {data.variantCount > 1 && (
            <span
              className="font-medium text-[12px] leading-[13.2px] text-primary-700 cursor-pointer"
              onClick={() => {
                setScreen("listvarian");
                setAppBar({
                  title: "Varian Produk",
                  appBarType: "header_title",
                  onBack: () => clearScreen(),
                });
              }}
            >
              +{data.variantCount - 1} varian lainnya
            </span>
          )}
          <div className="flex gap-x-2 items-center">
            <div className="flex gap-x-1 items-center">
              {[...Array(rating)].map((_, key) => (
                <Fragment key={key}>
                  <IconComponent src="/icons/star.svg"/>
                </Fragment>
              ))}
              {[...Array(maxRating - rating)].map((_, key) => (
                <Fragment key={key}>
                  <IconComponent classname={styles.icon_rating_gray} src="/icons/star.svg"/>
                </Fragment>
              ))}
            </div>
            <span className="font-semibold text-[10px] leading-[10px] text-neutral-700">{`${rating}/5`}</span>
          </div>
          {review.comment && (
            <p className="font-medium text-[12px] leading-[14.4px]">
              {review.comment}
            </p>
          )}
          {reviewPhotos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {reviewPhotos.map((image, key) => (
                <Image
                  key={key}
                  src={image}
                  alt="review"
                  width={100}
                  height={100}
                  className="size-[42px] rounded-[2.47px] cursor-pointer object-cover"
                  onClick={() => {
                    setImages(reviewPhotos);
                    setActiveIndex(key);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-x-2 items-center">
        {review.can_edit && (
          <Button
            color="primary_secondary"
            Class="w-full max-w-full h-7 !font-semibold flex items-center"
            onClick={() => {
              // Menyiapkan data untuk form edit ulasan
              setForm({
                productId: product.id,
                transactionId: data.transactionId,
                productName: product.name,
                productImage: product.image,
                variant: typeof product.variant === 'string' 
                  ? product.variant 
                  : `${product.variant?.type || ''} - ${product.variant?.size || ''}`,
                reviewId: review.id,
                rating: review.rating,
                ulasanText: review.comment || "",
                // Pastikan semua foto dimuat dan slot kosong diisi dengan null
                uploadedPhotos: [...(review.photos || []), ...Array(5 - (review.photos?.length || 0)).fill(null)],
              });
              
              setScreen("ubahulasan");
              setAppBar({
                title: "Ubah Ulasan",
                appBarType: "header_title",
                onBack: () => clearScreen(),
              });
            }}
          >
            Ubah Ulasan
          </Button>
        )}
        {/* 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0065 */}
        <Button
          Class="w-full max-w-full h-7 !font-semibold flex items-center"
          onClick={() => {
            router.push(`/muatparts/seller/${store?.id || ""}`);
          }}
        >
          Lihat Toko
        </Button>
        {/* 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0065 */}
      </div>
    </div>
  )
};

const UlasanSayaResponsive = ({ reviews = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const previewImageProps = {
    setActiveIndex,
    setImages,
    setIsModalOpen
  };

  if (isModalOpen) {
    return (
      <ImagesPreview
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        images={images}
      />
    );
  }
  
  // Tampilkan pesan jika tidak ada ulasan
  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center bg-white">
        <IconComponent src="/icons/notulasan.svg" classname={"w-[96px] h-[77px]"} />
        <div className="font-semibold text-neutral-600 text-[16px] mt-[12px]">Belum Ada Ulasan</div>
        <div className="font-normal text-neutral-600 text-[12px] mt-[12px]">Tulis Ulasanmu saat pesanan diterima</div>
      </div>
    );
  }
  
  // Tampilkan daftar ulasan
  return (
    <div className="flex flex-col gap-y-2 bg-neutral-200">
      {reviews.map((review, key) => (
        <Fragment key={key}>
          <UlasanCard data={review} {...previewImageProps} />
        </Fragment>
      ))}
    </div>
  );
  // 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0017 LB - 0051 LB - 0013 LB - 0052
};

export default UlasanSayaResponsive;