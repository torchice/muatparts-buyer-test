import React, { useState, useEffect } from "react";
import SWRHandler from "@/services/useSWRHook";
import { useSearchParams } from 'next/navigation';
import { numberFormatMoney } from "@/libs/NumberFormat";

// 24. THP 2 - MOD001 - MP - 027 - QC Plan - Web - MuatParts - Komplain Buyer
// LB - 0007
// LB - 0008
// LB - 0011
// LB - 0012
// LB - 0014
// LB - 0015
// LB - 0016
// LB - 0017
// LB - 0021
// LB - 0022
// LB - 0034
// 24. THP 2 - MOD001 - MP - 027 - QC Plan - Web - MuatParts - Komplain Buyer

export const ProductList = ({ onProductSelect }) => {
  // LB - 0001 Excel Bug Komplain Buyer Web
  const [selectedProducts, setSelectedProducts] = useState([]);
  const searchParams = useSearchParams();
  const { useSWRHook } = SWRHandler();
  
  const orderID = searchParams.get('OrderID');
  const transactionID = searchParams.get('TransactionID');
  
  const { data: orderData } = useSWRHook(
    orderID && transactionID 
      ? `/v1/muatparts/buyer/orders/detail?orderID=${orderID}&transactionID=${transactionID}`
      : null
  );

  // Get products from the new data structure
  const products = orderData?.Data?.storeOrders?.[0]?.items || [];

  const handleSelectProduct = (product, isChecked) => {
    const updatedProducts = isChecked
      ? [...selectedProducts, { 
          id: product.orderProductID,
          quantity: 1,
          name: product.productName,
          price: product.originalPrice,
          variant: product.productDetails,
          image_url: product.imageUrl
        }]
      : selectedProducts.filter(p => p.id !== product.orderProductID);
    
    setSelectedProducts(updatedProducts);
    onProductSelect(updatedProducts);
  };

  const handleQuantityChange = (productId, changeAmount) => {
    const product = products.find(p => p.orderProductID === productId);
    if (!product) return;

    const updatedProducts = selectedProducts.map(p => {
      if (p.id === productId) {
        const newQuantity = p.quantity + changeAmount;
        if (newQuantity <= product.quantity && newQuantity >= 1) {
          return { ...p, quantity: newQuantity };
        }
      }
      return p;
    });

    setSelectedProducts(updatedProducts);
    onProductSelect(updatedProducts);
  };

  if (!products.length) {
    return null;
  }
  // LB - 0001 Excel Bug Komplain Buyer Web

  return (
    // LB - 0001 Excel Bug Komplain Buyer Web
    <div className="w-full">
      <div className="justify-center items-center border-b-[color:var(--Neutral-400,#C4C4C4)] bg-white flex w-full gap-3 flex-wrap px-6 py-3 border-b border-solid">
        <div className="w-4">
          <input
            type="checkbox"
            checked={selectedProducts.length === products.length}
            onChange={(e) => {
              const isChecked = e.target.checked;
              const allProducts = isChecked 
                ? products.map(p => ({
                    id: p.orderProductID,
                    quantity: 1,
                    name: p.productName,
                    price: p.originalPrice,
                    variant: p.productDetails,
                    image_url: p.imageUrl
                  }))
                : [];
              
              setSelectedProducts(allProducts);
              onProductSelect(allProducts);
            }}
            className="rounded border border-[color:var(--Neutral-600,#7B7B7B)] w-4 h-4 border-solid cursor-pointer"
          />
        </div>
        <div className="self-stretch flex min-w-60 items-center gap-5 text-xs text-black font-bold leading-[1.2] flex-wrap flex-1">
          <div className="AvenirBold12px Color7B7B7B self-stretch w-[63px] my-auto">Produk</div>
          <div className="AvenirBold12px Color7B7B7B self-stretch flex min-w-60 w-[276px] shrink h-4 gap-2 flex-1" />
          <div className="AvenirBold12px Color7B7B7B self-stretch gap-2 w-[136px] my-auto">
            Jumlah yang Dipesan
          </div>
          <div className="AvenirBold12px Color7B7B7B self-stretch w-[147px] my-auto">
            Jumlah yang Dikomplain
          </div>
        </div>
      </div>

      {products.map((product, index) => (
        <div
          key={product.orderProductID}
          className={`min-h-[84px] w-full px-6 ${
            index === products.length - 1 ? "" : "border-b border-b-[color:var(--Neutral-400,#C4C4C4)]"
          }`}
        >
          <div className="flex w-full gap-3">
            <div className="flex min-w-60 w-full gap-5 flex-wrap flex-1 py-2">
              <div className="w-4">
                <input
                  type="checkbox"
                  checked={selectedProducts.some(p => p.id === product.orderProductID)}
                  onChange={(e) => handleSelectProduct(product, e.target.checked)}
                  className="rounded border border-[color:var(--Neutral-600,#7B7B7B)] w-4 h-4 border-solid cursor-pointer"
                />
              </div>
              <img
                src={product.imageUrl}
                className="aspect-[1] object-contain w-[56px] h-[56px] shrink-0"
                alt={product.productName}
              />
              <div className="flex min-w-60 flex-col items-stretch text-[10px] text-black font-medium leading-[1.3] justify-center w-[300px] py-1 gap-[12px]">
                <div className="AvenirBold12px Color000000 leading-[1.2]">
                  {product.productName}
                </div>
                <div className="AvenirNormal10px Color000000">
                  {product.productDetails || ''}
                </div>
                <div className="AvenirNormal10px Color000000">
                  {/* Rp{product.originalPrice?.toLocaleString()} */}
                  {numberFormatMoney(+product.originalPrice)}
                </div>
              </div>
              <div className="self-stretch min-h-5 gap-1 text-[10px] text-black font-medium whitespace-nowrap leading-[1.3] w-[133px] py-[7px]">
                {product.quantity}
              </div>
              <div className="flex text-xs text-black font-medium whitespace-nowrap text-center leading-[1.2] w-[110px]">
                <div className="items-center border border-[color:var(--Neutral-600,#7B7B7B)] bg-white flex max-h-[32px] w-[110px] gap-2 px-3 py-2 rounded-md border-solid">
                  <button
                    onClick={() => {
                      if (selectedProducts.some(p => p.id === product.orderProductID)) {
                        handleQuantityChange(product.orderProductID, -1);
                      }
                    }}
                    className="cursor-pointer AvenirNormal18px"
                  >
                    -
                  </button>
                  <span className="flex-1">
                    {selectedProducts.find(p => p.id === product.orderProductID)?.quantity || 1}
                  </span>
                  <button
                    onClick={() => {
                      if (!selectedProducts.some(p => p.id === product.orderProductID)) {
                        handleSelectProduct(product, true);
                      } else {
                        handleQuantityChange(product.orderProductID, 1);
                      }
                    }}
                    className="cursor-pointer AvenirNormal18px"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    // LB - 0001 Excel Bug Komplain Buyer Web
  );
};

export default ProductList;