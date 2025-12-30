import { useHeader } from '@/common/ResponsiveContext'
import Button from '@/components/Button/Button'
import ButtonAddAddressProduct from '@/components/ButtonAddAddressProduct/ButtonAddAddressProduct'
import ButtonBottomMobile from '@/components/ButtonBottomMobile/ButtonBottomMobile'
import ButtonPlusMinus from '@/components/ButtonPlusMinus/ButtonPlusMinus'
import DataNotFound from '@/components/DataNotFound/DataNotFound'
import IconComponent from '@/components/IconComponent/IconComponent'
import Input from '@/components/Input/Input'
import ModalComponent from '@/components/Modals/ModalComponent'
import ToastApp from '@/components/ToastApp/ToastApp'
import ListAddressContainerMobile from '@/containers/ListAddressContainerMobile/ListAddressContainerMobile'
import { numberFormatMoney } from '@/libs/NumberFormat'
import React, { useEffect, useState } from 'react'

function MultipleAlamatScreen({
  variants,
  locations,
  selectedLocation,
  getTotalStock,
  handleChangeStockMulti,
  handleMultipleAlamatVariantProduct,
  product,
  getMultipleAlamatProducts,
  getPrice,
  setIndexLocationMultiple,
  getIndexLocationMultiple,
  isMultiple,setIsMultiple,
  isGrosir,
  handleAddToTroli,
  handleBuyNow,
  showToastDrawer,
  setShowToastDrawer,
  validation,
  handleDeleteAlamatMultiple,
  setSelectedLocations=()=>{}
}) {
  const {setScreen}=useHeader()
  const [showDeleteModal,setShowDeleteModal]=useState(false)
  return (
    <div className='flex flex-col gap-2 bg-neutral-200 h-full text-neutral-900 pb-32'>
      <ToastApp timer={3000} status='error' show={showToastDrawer.show} text={showToastDrawer.msg} onClose={()=>setShowToastDrawer({msg:'',show:false})} />
      <ModalComponent isOpen={showDeleteModal} setClose={()=>setShowDeleteModal(false)} hideHeader full>
        <div className='py-4 px-2 flex flex-col gap-5 items-center max-w-[320px] w-full'>
          <span className='bold-base'>Hapus Alamat Tujuan</span>
          <span className='medium-sm text-center'>Apakah kamu yakin ingin menghapus pesanan dengan Alamat tujuan <b>{getIndexLocationMultiple.location?.Name}</b>?</span>
          <div className='flex gap-2'>
            <Button color='primary_secondary' onClick={()=>setShowDeleteModal(false)}>Batal</Button>
            <Button color='primary' onClick={()=>{
              handleDeleteAlamatMultiple(getIndexLocationMultiple)
              setShowDeleteModal(false)
              }}>Ya</Button>
          </div>
        </div>
      </ModalComponent>
      <div className='py-6 px-4 flex flex-col gap-4 bg-neutral-50'>
          {
            getMultipleAlamatProducts?.map((val,idx)=>{
              return(
                <div key={idx} className='flex flex-col pb-6 border-b border-neutral-400 gap-4 last:border-transparent'>
                  <div className='flex flex-col gap-6'>
                    {
                      isMultiple&&
                      <ButtonAddAddressProduct 
                        number={idx+1} 
                        isError={!val?.location?.ID&&validation?.find(a => a?.index == idx)}
                        address={val?.location} 
                        onAddAddress={()=>{
                          let location = val?.location
                          setIndexLocationMultiple({ index: idx })
                          setScreen('list_address')
                          setSelectedLocations(location?.ID?[location]:[])
                        }} 
                        onDelete={() => {
                          setShowDeleteModal(true)
                          setIndexLocationMultiple({ index: idx, location: '' })
                          setSelectedLocations([])
                        }}
                        />
                    }
                      {
                        val?.products?.map((product,i)=>{
                          return(
                            <div className='flex justify-between w-full' key={i}>
                              <div className='flex flex-col gap-3'>
                                <span className='medium-sm'>{product?.Code}</span>
                                {product?.DiscountPercentage?<span className='flex items-center gap-1'>
                                  <strike className='text-neutral-600 font-medium text-[10px]'>{numberFormatMoney(product?.OriginalPrice)}</strike>
                                  <span className='bg-error-400 rounded text-neutral-50 semi-xs px-1'>{product?.DiscountPercentage} OFF</span>
                                </span>:''}
                                <span className='bold-sm'>{numberFormatMoney(product?.OriginalPrice)}</span>
                                {getTotalStock?.totalStock?.find(a=>a?.id===product?.ID)?.Amount<5?<span className='text-error-400 text-[10px] font-bold'>Tersisa {getTotalStock?.totalStock?.find(a=>a?.id===product?.ID)?.Amount} produk</span>:''}
                              </div>
                              <ButtonPlusMinus
                                increment={(newValue) => handleChangeStockMulti(product?.ID, newValue, idx, true)}
                                decrement={(newValue) => handleChangeStockMulti(product?.ID, newValue, idx)}
                                // onNumber={a=>handleChangeStockMulti(val?.ID,a,i)}
                                min={0}
                                disableInput
                                number={product?.Quantity}
                                disableMax={!getTotalStock?.totalStock?.find(a => a?.id === product?.ID)?.Amount}
                              />
                            </div>
                          )
                        })
                      }
                  </div>
                </div>
              )
            })
          }
      </div>
      {isMultiple?<div className='flex py-6 justify-center items-center select-none gap-4 bg-neutral-50' onClick={() => handleMultipleAlamatVariantProduct({ location: {}, products: product?.Variants?.Combinations.length?product?.Variants?.Combinations?.map(({ ...rest }) => ({ Amount: getMultipleAlamatProducts?.[0]?.products?.[0]?.Amount, Quantity: 0, ...rest })) : [{ ...getPrice, Amount: getMultipleAlamatProducts?.[0]?.products?.[0]?.Amount, Quantity: 0 }] }, isMultiple)}>
        <IconComponent src={'/icons/Plus.svg'} classname={'icon-blue'} />
        <span className='medium-sm text-primary-700'>Tambah Alamat</span>
      </div>:''}
      <ButtonBottomMobile onToggle={() => {
          let price_grosir=0
          if(isGrosir){
            let grosir=product?.Wholesales
            for (let i = 0; i < product?.Wholesales?.length; i++) {
              if(product?.ProductInfo?.MinOrder>=grosir[i]?.minPurchase && grosir[i]?.maxPurchase==0) price_grosir=grosir[i]?.price
              if(product?.ProductInfo?.MinOrder>=grosir[i]?.minPurchase && product?.ProductInfo?.MinOrder<=grosir[i]?.maxPurchase) price_grosir=grosir[i]?.price
            }
          }
          setIsMultiple(!isMultiple)
          handleMultipleAlamatVariantProduct({ location: {}, products: product?.Variants?.Combinations.length ? product?.Variants?.Combinations?.map(({ ...rest }) => ({ Amount: getMultipleAlamatProducts?.[0]?.products?.[0]?.Amount, Quantity: 0, ...rest })) : [{ ...getPrice, Amount: product?.Stock, Quantity: 0 ,PriceGrosir:price_grosir}] }, !isMultiple)
        }} 
        defaultValueToggle={isMultiple} 
        toggleLabelActive={'Saya ingin mengirim ke banyak alamat'} 
        textLeft={'Tambah ke Troli'} 
        onClickLeft={handleAddToTroli}
        onClickRight={handleBuyNow}
        textRight={'Beli Sekarang'} />
    </div>
  )
}

export default MultipleAlamatScreen
