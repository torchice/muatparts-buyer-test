import Button from '@/components/Button/Button'
import ModalComponent from '@/components/Modals/ModalComponent'
import RadioButton from '@/components/Radio/RadioButton'
import React from 'react'

function ModalUrutkan({isShowSort,setShowSort,setSortActive,sortActive,handleTerapkan}) {
  return (
    <ModalComponent  full isOpen={isShowSort} setClose={()=>setShowSort(false)} type='BottomSheet' title='Urutkan'>
        <ul className='list-none px-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto'>
          <li>
            <div className='text-neutral-900 semi-sm flex justify-between w-full pb-4 border-b border-neutral-400'>
              <span>No. Invoice (A-Z, 0-9)</span>
              <RadioButton label={''} value={'No. Invoice (A-Z, 0-9)'} checked={sortActive==='No. Invoice (A-Z, 0-9)'} onClick={()=>setSortActive('No. Invoice (A-Z, 0-9)')} />
            </div>
          </li>
          <li>
            <div className='text-neutral-900 semi-sm flex justify-between w-full pb-4 border-b border-neutral-400'>
              <span>Tanggal Pembayaran Terbaru</span>
              <RadioButton label={''} value={'Tanggal Pembayaran Terbaru'} checked={sortActive==='Tanggal Pembayaran Terbaru'} onClick={()=>setSortActive('Tanggal Pembayaran Terbaru')} />
            </div>
          </li>
          <li>
            <div className='text-neutral-900 semi-sm flex justify-between w-full pb-4 border-b border-neutral-400'>
              <span>Tanggal Pembayaran Terlama</span>
              <RadioButton label={''} value={'Tanggal Pembayaran Terlama'} checked={sortActive==='Tanggal Pembayaran Terlama'} onClick={()=>setSortActive('Tanggal Pembayaran Terlama')} />
            </div>
          </li>
          <li>
            <div className='text-neutral-900 semi-sm flex justify-between w-full pb-4 border-b border-neutral-400'>
              <span>Batas Respon Terdekat</span>
              <RadioButton label={''} value={'Batas Respon Terdekat'} checked={sortActive==='Batas Respon Terdekat'} onClick={()=>setSortActive('Batas Respon Terdekat')} />
            </div>
          </li>
          <li>
            <div className='text-neutral-900 semi-sm flex justify-between w-full pb-4 border-b border-neutral-400'>
              <span>Batas Respon Terjauh</span>
              <RadioButton label={''} value={'Batas Respon Terjauh'} checked={sortActive==='Batas Respon Terjauh'} onClick={()=>setSortActive('Batas Respon Terjauh')} />
            </div>
          </li>
          <li>
            <div className='text-neutral-900 semi-sm flex justify-between w-full pb-4 border-b border-neutral-400'>
              <span>Jumlah Produk Terbesar</span>
              <RadioButton label={''} value={'Jumlah Produk Terbesar'} checked={sortActive==='Jumlah Produk Terbesar'} onClick={()=>setSortActive('Jumlah Produk Terbesar')} />
            </div>
          </li>
          <li>
            <div className='text-neutral-900 semi-sm flex justify-between w-full pb-4 border-b border-neutral-400'>
              <span>Jumlah Produk Terkecil</span>
              <RadioButton label={''} value={'Jumlah Produk Terkecil'} checked={sortActive==='Jumlah Produk Terkecil'} onClick={()=>setSortActive('Jumlah Produk Terkecil')} />
            </div>
          </li>
          <li>
            <div className='text-neutral-900 semi-sm flex justify-between w-full pb-4 border-b border-neutral-400'>
              <span>Total Pesanan Terbesar</span>
              <RadioButton label={''} value={'Total Pesanan Terbesar'} checked={sortActive==='Total Pesanan Terbesar'} onClick={()=>setSortActive('Total Pesanan Terbesar')} />
            </div>
          </li>
          <li>
            <div className='text-neutral-900 semi-sm flex justify-between w-full pb-4'>
              <span>Total Pesanan Terkecil</span>
              <RadioButton label={''} value={'Total Pesanan Terkecil'} checked={sortActive==='Total Pesanan Terkecil'} onClick={()=>setSortActive('Total Pesanan Terkecil')} />
            </div>
          </li>
        </ul>
        <div className='p-4 w-full'>
          <Button onClick={handleTerapkan} Class='!max-w-full !w-full'>Terapkan</Button>
        </div>
      </ModalComponent>
  )
}

export default ModalUrutkan