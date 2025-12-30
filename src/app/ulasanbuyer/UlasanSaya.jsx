import React, { Fragment, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useRouter } from "next/navigation";
import { modal } from "@/store/modal";
import useUlasanStore from "./storeUlasan";
import { FormUlasan } from "./MenungguUlasan";
import styles from "./UlasanSaya.module.scss";
import { formatDate } from "@/libs/DateFormat";

const UlasanCard = ({ data }) => {
  const router = useRouter();
  const { resetForm } = useUlasanStore();
  const { setModalOpen, setModalConfig, setModalContent } = modal();
  const rating = data.review.rating;
  const maxRating = 5;

  return (
    <div className="flex flex-col rounded-[10px] border border-neutral-600">
      <div className="py-5 px-8 border-b border-b-neutral-600 flex flex-col gap-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center h-6 px-2 bg-primary-50">
            <span className="font-semibold text-[12px] leading-[14.4px] text-primary-700">
              {data.invoiceNumber}
            </span>
          </div>
          <span className="font-semibold text-[12px] leading-[14.4px]">
            <span className="text-neutral-600">
              Pesanan Diterima :
            </span>
            {(() => {
              const date = new Date(data.receivedDate);
              
              // Format: DD-MM-YYYY HH:MM
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear();
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              
              return `${day}/${month}/${year} ${hours}:${minutes}`;
            })() || ""}
            {/* {` ${formatDate(data.receivedDate)}`} */}
          </span>
        </div>
        
        <div className="flex gap-x-5">
          <Image
            className="rounded-md size-14"
            src={data.product.image}
            alt={data.product.name}
            width={100}
            height={100}
          />
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-4">
              <div className="flex h-6 items-center gap-x-1">
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
                <span className="font-semibold text-[12px] leading-[14.4px]">{`${rating}/5`}</span>
              </div>
              <span className="font-bold text-[12px] leading-[14.4px]">
                {data.product.name}
              </span>
              {console.log("Data Product Varian ulasan saya : ",data.product?.variant)}
              {Array.isArray(data.product.variant) ? (
                // If variant is an array, map through it
                data.product.variant.map((item, idx) => (
                  <span key={idx} className="font-medium text-[12px] leading-[14.4px] text-neutral-600">
                    {item.name} - {item.value}
                  </span>
                ))
              ) : (
                // If variant is an object with name and value properties
                data.product.variant?.name && data.product.variant?.value && (
                  <span className="font-medium text-[12px] leading-[14.4px] text-neutral-600">
                    {data.product.variant?.name} - {data.product.variant?.value}
                  </span>
                )
              )}
              {/* {data.product.variant?.name && (
                <span className="font-medium text-[12px] leading-[14.4px] text-neutral-600">
                  {data.product.variant.name} - {data.product.variant.value}
                </span>
              )} */}
            </div>
            
            <div className="flex items-start gap-x-2">
              {console.log("Data Andrew Ulasan Saya : ", data?.buyerInfo?.avatar)}
              <Image
                className="size-[30px] rounded-[30px]"
                src={data?.buyerInfo?.avatar}
                alt="reviewer"
                width={30}
                height={30}
              />
              <div className="flex flex-col gap-y-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-[14px] leading-[16.8px]">
                    {data.buyerInfo.name}
                  </span>
                  <span className="font-medium text-[12px] leading-[14.4px]">
                    {(() => {
                      const date = new Date(data.receivedDate);
                      
                      // Format: DD-MM-YYYY HH:MM
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = (date.getMonth() + 1).toString().padStart(2, '0');
                      const year = date.getFullYear();
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date.getMinutes().toString().padStart(2, '0');
                      
                      return `${day}-${month}-${year} ${hours}:${minutes}`;
                    })() || ""}
                    {/* {formatDate(data.receivedDate)} */}
                  </span>
                </div>
                {data.review.comment && (
                  <span className="font-medium text-[12px] leading-[14.4px]">
                    {data.review.comment}
                  </span>
                )}
                {data.review.photos?.length > 0 && (
                  <div className="flex items-center gap-x-1">
                    {data.review.photos.map((photo, idx) => (
                      <Image
                        key={idx}
                        src={photo}
                        alt={`review-${idx}`}
                        width={32}
                        height={32}
                        className="size-8 rounded-[4px] cursor-pointer"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-[18px] pb-5 px-8">
        {/* {console.log()} */}
        <div className="flex items-center gap-x-2">
          <Image
            src={
              (data.store.logo && data.store.logo.trim()
              ? data.store.logo
              : "/muatparts/icons/ulasanbuyeric.svg")
            }
            alt="store-red"
            width={24}
            height={24}
          />
          <span className="font-semibold text-[14px] leading-[16.8px]">
            {data.store.name}
          </span>
        </div>
        <div className="flex items-center gap-x-3">
          {data.review.can_edit && (
            <Button
              color="primary_secondary"
              Class="px-6 h-8 !font-semibold flex items-center"
              onClick={() => {
                setModalOpen(true);
                setModalConfig({
                  withHeader: false,
                  withClose: true,
                  classname: "max-w-[472px] min-h-[545px]",
                  onClose: resetForm,
                });
                setModalContent(<FormUlasan data={data} />);
              }}
            >
              Ubah Ulasan
            </Button>
          )}
          <Button
            Class="px-6 h-8 !font-semibold flex items-center"
            onClick={() => router.push(`/muatparts/seller/${data.store.id}`)}
          >
            Lihat Toko
          </Button>
        </div>
      </div>
    </div>
  );
};

const UlasanSaya = ({ sort, setSort, data }) => {
  return (
    <>
      {data?.map((review, index) => (
        <UlasanCard key={index} data={review} />
      ))}
    </>
  );
};

export default UlasanSaya;