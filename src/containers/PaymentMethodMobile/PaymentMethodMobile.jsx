
'use client';
import PaymentInformationMobile from '@/components/PaymentInformationMobile/PaymentInformationMobile';
import style from './PaymentMethodMobile.module.scss'
import { useState } from 'react';
import IconComponent from '@/components/IconComponent/IconComponent';
function PaymentMethodMobile({detailPesanan}) {
    const [expanded,setExpanded]=useState(['atm'])
    function handelExpand(val) {
        if(expanded.includes(val)){
            let tmp = expanded?.filter(a=>a!==val)
            setExpanded(tmp)
        }else{
            setExpanded(a=>([...a,val]))
        }
    }
    return (
        <div className={`${style.main} flex flex-col gap-2 bg-neutral-200 w-full`}>
            <PaymentInformationMobile amount={detailPesanan?.paymentInfo?.totalBill} bankAccount={detailPesanan?.paymentInfo?.virtualAccount} bankName={detailPesanan?.paymentInfo?.paymentMethod} bankLogo={detailPesanan?.paymentInfo?.methodLogo} />
            <div className='containerMobile h-full text-neutral-900m flex flex-col gap-6 w-full bg-neutral-50 pb-6'>
                <span className='medium-sm'>Cara Pembayaran</span>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-4 border-b border-neutral-400 pb-4'>
                        <span className='flex justify-between items-center select-none' onClick={()=>handelExpand('atm')}>
                            <span>ATM</span>
                            <IconComponent src={`${expanded.includes('atm')?'/icons/chevron-up.svg':'/icons/chevron-down.svg'}`} />
                        </span>
                        {expanded.includes('atm')&&<ul className='list-none text-sm font-normal'>
                            <li>1. Masukkan Kartu ATM BCA & PIN</li>
                            <li>2. Pilih menu Transaksi Lainnya {'>'} Transfer {">"} Virtual Account</li>
                            <li>3. Masukkan Nomor Virtual Account di atas</li>
                            <li>4. Di halaman konfirmasi, pastikan detail pembayaran sudah sesuai seperti No. VA, Nama Perus/Produk, dan Total Tagihan</li>
                            <li>5. Masukkan Jumlah Transfer sesuai dengan Total Tagihan</li>
                            <li>6. Ikuti instruksi untuk menyelesaikan transaksi</li>
                            <li>7. Simpan struk transaksi sebagai bukti pembayaran</li>
                        </ul>}
                    </div>
                    <div className='flex flex-col gap-4 border-b border-neutral-400 pb-4'>
                        <span className='flex justify-between items-center select-none' onClick={()=>handelExpand('va')}>
                            <span>Virtual Account</span>
                            <IconComponent src={`${expanded.includes('va')?'/icons/chevron-up.svg':'/icons/chevron-down.svg'}`} />
                        </span>
                        {expanded.includes('va')&&<ul className='list-none text-sm font-normal'>
                            <li>1. Masukkan Kartu ATM BCA & PIN</li>
                            <li>2. Pilih menu Transaksi Lainnya {'>'} Transfer {">"} Virtual Account</li>
                            <li>3. Masukkan Nomor Virtual Account di atas</li>
                            <li>4. Di halaman konfirmasi, pastikan detail pembayaran sudah sesuai seperti No. VA, Nama Perus/Produk, dan Total Tagihan</li>
                            <li>5. Masukkan Jumlah Transfer sesuai dengan Total Tagihan</li>
                            <li>6. Ikuti instruksi untuk menyelesaikan transaksi</li>
                            <li>7. Simpan struk transaksi sebagai bukti pembayaran</li>
                        </ul>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentMethodMobile;
  