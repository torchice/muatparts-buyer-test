
'use client';
import Image from 'next/image';
import style from './CardManageOrderMobile.module.scss'
import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import IconComponent from '../IconComponent/IconComponent';
import CountDownMobile from '../CountDownMobile/CountDownMobile';
function CardManageOrderMobile({
    id,
    statusOrder,
    paymentLimit,
    responseLimit,
    date,
    image='/img/chopper.png',
    productName,
    invoice,
    courier,
    buyerName,
    amount,
    amountOfAllProduct,
    totalOrder,
    onClick,
    withCheckBox,
    isChecked,
    onChecked,
    valueChecked,
    status,
    textButton='Detail',
    twoButton,
    onClickMenu,
    onClickLeft,
    textButtonLeft,
    onClickRight,
    textButtonRight,
    colorButtonLeft='primary',
    colorButtonRight='primary_secondary',
    colorButton='primary'
}) {
    return (
        <div className={`${style.main} flex gap-3 items-start w-full bg-neutral-50 py-3 px-4 relative`}>
            {
                withCheckBox&&<Checkbox checked={isChecked} value={valueChecked} onChange={onChecked} label='' />
            }
            <div className={`flex flex-col gap-5 text-neutral-900 bg-neutral-50 w-full`}>
                {!withCheckBox&&status?<div className='w-full justify-between flex items-center'>
                    {(!withCheckBox&&status)&&<span className='medium-xs'>{status}</span>}
                    {/* {(!withCheckBox&&responseLimit&&!statusOrder)&&<span className='medium-xs'>Batas Respon</span>}
                    {(!withCheckBox&&responseLimit&&statusOrder)&&<span className='medium-xs'>{statusOrder}</span>} */}
                    {
                        <span onClick={onClickMenu}><IconComponent src={'/icons/three-dots.svg'} /></span>
                    }
                </div>:''}

                <div className='flex gap-3'>
                    <span className='w-[68px] h-[68px] rounded border border-ne'>
                        <Image width={68} height={68} src={image} alt='img' className='rounded w-full h-full' />
                    </span>
                    <div className='flex flex-col flex-1 gap-3'>
                        <span className='flex w-full justify-between'>
                            <span className='bold-sm'>{productName}</span>
                            {amount&&<span className='medium-xs text-neutral-600'>+{amount}</span>}
                        </span>
                        {
                            !withCheckBox&&status==='Menunggu Pembayaran'?<>
                                <span className='medium-xs'>{invoice}</span>
                                {amountOfAllProduct>1&&<span className='medium-xs text-primary-700'>+{amountOfAllProduct-1} produk lainnya</span>}
                            </>
                            :status==='menunggPembayaran'?<div className='flex flex-col gap-3 w-1/2'>
                                <span className='text-neutral-600 medium-xs'>Batas Pembayaran</span>
                                <span className='semi-xs line-clamp-1'>{paymentLimit}</span>
                            </div>
                            :''
                        }
                        {
                            !withCheckBox&&status!=='menunggPembayaran'?<>
                                <span className='medium-xs'>{invoice}</span>
                                {amountOfAllProduct>1&&<span className='medium-xs text-primary-700'>+{amountOfAllProduct-1} produk lainnya</span>}
                                <span className={`w-full rounded-md bg-error-50 text-error-400 semi-sm flex justify-center`}><CountDownMobile withoutIcon date={responseLimit} /></span>
                            </>
                            :withCheckBox&&status!=='menunggPembayaran'?<>
                                <span className='medium-xs'>{date}</span>
                                {amountOfAllProduct>1&&<span className='medium-xs text-primary-700'>+{amountOfAllProduct-1} produk lainnya</span>}
                                <span className={`w-full rounded-md bg-primary-50 text-primary-700 semi-sm flex justify-center`}>{invoice}</span>
                            </>
                            :status!=='menunggPembayaran'?<div className='flex flex-col gap-3 w-1/2'>
                                <span className='text-neutral-600 medium-xs'>Batas Pembayaran</span>
                                <span className='semi-xs line-clamp-1'>{paymentLimit}</span>
                            </div>
                            :''
                        }
                    </div>
                </div>
                <div className={`grid ${withCheckBox&&status==='Menunggu Pembayaran'?'grid-cols-3':'grid-cols-2'} gap-2`}>
                    <div className='flex flex-col gap-3 w-full'>
                        <span className='text-neutral-600 medium-xs'>Kurir</span>
                        <span className='semi-xs line-clamp-1'>{courier}</span>
                    </div>
                    <div className='flex flex-col gap-3 items-start w-full'>
                        <span className='text-neutral-600 medium-xs'>Pembeli</span>
                        <span className='semi-xs line-clamp-1'>{buyerName}</span>
                    </div>
                    {(!withCheckBox||status!=='menunggPembayaran')&&<div className='flex flex-col gap-3 w-full'>
                        <span className='text-neutral-600 medium-xs'>Jumlah Produk</span>
                        <span className='semi-xs line-clamp-1'>{amountOfAllProduct}</span>
                    </div>}
                    <div className='flex flex-col gap-3 items-start w-full'>
                        <span className='text-neutral-600 medium-xs'>Total Pesanan</span>
                        <span className='semi-xs line-clamp-1'>{totalOrder}</span>
                    </div>
                </div>
                {(!withCheckBox&&!twoButton)&&<Button onClick={onClick} color={colorButton} Class='!max-w-full !h-8'>{textButton}</Button>}
                {(!withCheckBox&&twoButton)&&<div className='flex justify-between gap-2'>
                    <Button onClick={onClickLeft} color={colorButtonLeft} Class='!max-w-full !w-full !h-8'>{textButtonLeft}</Button>
                    <Button onClick={onClickRight} color={colorButtonRight} Class='!max-w-full !w-full !h-8'>{textButtonRight}</Button>
                    </div>}
            </div>
            {!withCheckBox&&<span className='w-2 h-6 rounded-xl bg-muat-parts-member-800 absolute top-0 -left-1'></span>}
        </div>
    );
}

export default CardManageOrderMobile;


export const CardManageOrderDetailMobile=({
    image='/img/chopper.png',
    productName,
    amount,
    SKU,
    tipe,
    beforePrice,
    afterPrice
})=>{
    return (
        <div className={`flex flex-col gap-5 text-neutral-900 bg-neutral-50 w-full`}>
            <div className='flex gap-3'>
                <span className='w-[68px] h-[68px]'>
                    <Image width={68} height={68} src={image} alt='img' className='rounded w-full h-full' />
                </span>
                <div className='flex flex-col'>
                    <span className='flex w-full justify-between'>
                        <span className='bold-sm'>{productName}</span>
                        <span className='medium-xs text-neutral-600'>{amount}</span>
                    </span>
                    <span className='medium-xs'>SKU : {SKU}</span>
                    <span className='medium-xs'>Tipe : {tipe}</span>
                    <strike className='medium-xs !text-[10px] text-neutral-600'>{beforePrice}</strike>
                    <span className='semi-sm text-error-400'>{afterPrice}</span>
                </div>
            </div>
        </div>
    )
}