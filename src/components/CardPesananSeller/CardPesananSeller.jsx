
'use client';
import Image from 'next/image';
import IconComponent from '../IconComponent/IconComponent';
import style from './CardPesananSeller.module.scss'
import Button from '../Button/Button';
function CardPesananSeller() {
    return (
        <div className={`${style.main} flex-col border border-neutral-600 rounded-[10px] w-full bg-neutral-50 text-neutral-900`}>
            <div className='pb-5 pt-[18px] px-8 flex flex-col gap-5'>
                <div className="flex justify-between">
                    <div className='flex gap-1 items-center'>
                        <span className="py-1 px-8 rounded-md bg-primary-50 text-primary-700 semi-xs">MPMM2024/0001</span>
                        <div className="flex gap-1 select-none cursor-pointer">
                            <span className='medium-xs text-primary-700'>Cetak Invoice</span>
                            <IconComponent src={'/icons/document-blue.svg'}/>
                        </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <span className="medium-xs text-neutral-600">Pembayaran : <span className="text-neutral-900">28 Aug 2021 17.08 WIB</span></span>
                        <span className={`py-1 px-2 rounded-md bg-warning-100 text-warning-900 semi-xs`}>Perlu Respon 02:10:20</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <div className='flex gap-5 items-start'>
                            <Image width={56} height={56} src={process.env.NEXT_PUBLIC_ASSET_REVERSE+'/img/chopper.png'} alt='product' />
                            <div className="flex flex-col gap-3 py-[2px]">
                                <span className="bold-xs">Gajah Tunggal 1000x20 16PR Miler RFD Ban Truk Colt Diesel Engkel Bak Terbuka</span>
                                <span className='font-medium text-[10px]'>Tipe : A</span>
                                <span className='font-medium text-[10px]'>SKU : 19827381823499</span>
                                <span className='font-medium text-[10px] line-clamp-1'>Catatan : Saya pesan tipe A ukuran large large large large large large large large large large large large large large large large large </span>
                            </div>
                        </div>
                        <div className="flex gap-6 item-start">
                            <div className="flex flex-col gap-2 min-w-[114px]">
                                <div className="flex gap-2 item-center text-neutral-600">
                                    <IconComponent src={'/icons/troller.svg'} />
                                    <span className="medium-xs">Jumlah</span>
                                </div>
                                <span className='medium-xs'>1</span>
                            </div>
                            <div className="flex flex-col gap-2 min-w-[200px]">
                                <div className="flex gap-2 item-center text-neutral-600">
                                    <IconComponent src={'/icons/tangan-budha.svg'} />
                                    <span className="medium-xs">Harga Penjualan</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <strike className="medium-xs text-[10px]">Rp1.300.000</strike>
                                    <div className='flex gap-3 items-center'>
                                        <span className="text-error-400 bold-xs text-[10px]">Rp1.170.000.000</span>
                                        <span className="py-1 px-2 rounded-md bg-success-50 text-success-400">10%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 min-w-[140px]">
                                <div className="flex gap-2 item-center text-neutral-600">
                                    <IconComponent src={'/icons/troller.svg'} />
                                    <span className="medium-xs">Jumlah</span>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <span className='medium-xs'>Regular</span>
                                    <span className='medium-xs'>J&T Express</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 item-center text-primary-700 mt-6 select-none cursor-pointer">
                        <span className="medium-xs">+ 2 Produk Lainnya</span>
                        <IconComponent src={'/icons/chevron-down.svg'} classname={'icon-blue'} />
                    </div>
                </div>
            </div>
            <div className='pb-5 pt-[18px] px-8 flex justify-between items-center border-y border-neutral-600'>
                <span className="bold-sm">Total Pesanan</span>
                <span className="bold-sm">Rp10.000.000</span>
            </div>
            <div className='pb-5 pt-[18px] px-8 flex justify-between items-center'>
                <div className="flex gap-2 items-center">
                    <Image src={'/img/chopper.png'} width={30} height={30} alt='photo' />
                    <span className="semi-sm">Tony Chopper</span>
                </div>
                <div className="flex gap-3 item-center">
                    <Button>Button Custom</Button>
                </div>
            </div>
            <div>
                
            </div>
        </div>
    );
}

export default CardPesananSeller;
  