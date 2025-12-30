
'use client';
import Button from '../Button/Button';
import style from './ListAddressCardMobile.module.scss'
function ListAddressCardMobile({classname,primary,name,pic,nomor,address,detailAddress,onEdit,onChoose}) {
    return (
        <div className={`${style.main} py-3 px-4 w-full flex flex-col gap-3 text-neutral-900 ${primary?'bg-primary-50':'bg-neutral-50'} ${classname}`}>
            {/* nama label alamat */}
            <div className='flex gap-2 items-center'>
                <span className='bold-xs line-clamp-1'>{name}</span>
                {primary&&<span className='semi-xs text-primary-50 bg-primary-700 p-1 rounded'>Utama</span>}
            </div>
            {/* nama & nomor */}
            <span className='flex medium-xs'>{pic+`(${nomor})`}</span>
            {/* alamat */}
            <span className='flex medium-xs'>{address}</span>
            {/* detail alamat */}
            <span className='flex medium-xs'>{detailAddress}</span>
            <div className='flex items-center justify-between'>
                <Button Class='!w-[160px] max-w-none h-7' color='primary_secondary'>Ubah</Button>
                <Button Class='!w-[160px] max-w-none h-7' color='primary_secondary' disabled={primary}>{primary?'Terpilih':'Pilih'}</Button>
            </div>
        </div>
    );
}

export default ListAddressCardMobile;
  