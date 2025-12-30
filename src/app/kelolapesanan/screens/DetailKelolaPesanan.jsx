import { useHeader } from '@/common/ResponsiveContext'
import Button from '@/components/Button/Button'
import ButtonBottomMobile from '@/components/ButtonBottomMobile/ButtonBottomMobile'
import { CardManageOrderDetailMobile } from '@/components/CardManageOrderMobile/CardManageOrderMobile'
import CardOrderProduct from '@/components/CardOrderProduct/CardOrderProduct'
import IconComponent from '@/components/IconComponent/IconComponent'
import React from 'react'

function DetailKelolaPesanan({
  buyerName,
  courier,
  orderDate,
  invoice,
  products
}) {
  const {setScreen}=useHeader()
  return (
    <div className='flex flex-col gap-2 w-full text-neutral-900 bg-neutral-200 pb-[70px]'>
      <div className='py-6 px-4 flex flex-col gap-4 bg-neutral-50'>
        <div className='flex justify-between pb-4 border-b border-neutral-400 items-center'>
          <span className='medium-xs text-neutral-600'>Nama Pembeli</span>
          <span className='semi-xs'>{buyerName}</span>
        </div>
        <div className='flex justify-between pb-4 border-b border-neutral-400 items-center'>
          <span className='medium-xs text-neutral-600'>Kurir</span>
          <span className='semi-xs'>{courier}</span>
        </div>
        <div className='flex justify-between pb-4 border-b border-neutral-400 items-center'>
          <span className='medium-xs text-neutral-600'>Tanggal Pesanan</span>
          <span className='semi-xs'>{orderDate}</span>
        </div>
        <div className='flex justify-between pb-4 border-b border-neutral-400 items-center'>
          <span className='medium-xs text-neutral-600'>No. Invoice</span>
          <span className='semi-xs flex gap-1'>{invoice} <span><IconComponent src={'/icons/download.svg'} classname={'icon-blue'} /></span></span>
        </div>
      </div>
      <div className='py-6 px-4 flex justify-between items-center bg-neutral-50'>
        <div className='flex gap-3 items-center'>
          <IconComponent src={'/icons/chat.svg'} width={24} height={24} />
          <span className='semi-sm'>Chat Pembeli</span>
        </div>
        <IconComponent src={'/icons/chevron-right.svg'} width={24} height={24} />
      </div>
      <div className='py-6 px-4 flex flex-col gap-6 bg-neutral-50'>
        <span className='semi-sm'>Rincian Pesanan</span>
        <CardManageOrderDetailMobile afterPrice={'Rp.10000'} beforePrice={'Rp.300000'} name={'Pasdihh dashhsadb'} tipe={'A/123'} SKU={"SDKhi ADSAD JASDJ"} amount={4} productName={'testing with playwright'} />
        {products?.length>1&&<span className='semi-xs text-primary-700 self-end'>+{products?.length-1} produk lainnya</span>}
      </div>
      <div className='py-6 px-4 flex flex-col gap-6 bg-neutral-50'>
        <span className='flex justify-between items-center'>
          <span className='semi-sm'>Rincian Pembayaran</span>
          <span className='bold-sm'>Rp30.000.000</span>
        </span>
        <div className='flex flex-col gap-4'>
          <span className='flex justify-between items-center pb-4 border-b border-neutral-400'>
            <span className='medium-xs text-neutral-600'>Total Harga (9 item)</span>
            <span className='semi-sm whitespace-nowrap'>Rp30.000.000</span>
          </span>
          <span className='flex justify-between items-center '>
            <span className='medium-xs text-neutral-600'>Voucher Merchant (DISKONPENGGUNABARU)</span>
            <span className='semi-sm whitespace-nowrap'>-Rp1.000.000</span>
          </span>
        </div>
      </div>
      <div className='py-6 px-4 flex justify-between items-center bg-neutral-50' onClick={()=>setScreen('lacak_pesanan')}>
        <div className='flex gap-3 items-center'>
          <IconComponent src={'/icons/posisi-truk.svg'} width={24} height={24} />
          <span className='semi-sm'>Lacak Pesanan</span>
        </div>
        <IconComponent src={'/icons/chevron-right.svg'} width={24} height={24} />
      </div>
      <ButtonBottomMobile classname={'py-3 px-4'}>
        <Button Class='!max-w-full !w-full'>Chat Pembeli</Button>
      </ButtonBottomMobile>
    </div>
  )
}

export default DetailKelolaPesanan
