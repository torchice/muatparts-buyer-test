
'use client';
import style from './DetailOrderMobile.module.scss'
import OtherStatus from './OtherStatus';
import WaitingForPaymnet from './WaitingForPaymnet';
function DetailOrderMobile({
    statusPesanan,
    detailPesanan,
    onClick,
    onClickLeft,
    onClickRight,
    textLeftButton,
    textRightButton,
    hideBatalPesanan,
    multipleButtonBottom,
    leftColor,
    rightColor,
    onToggle,
    colorButton,    
    textButton,
    onClickSetLacakPesanan,
    action_button_detail,
    onShowAllProduct,
    handleActionsButton
}) {

    return (
        <div className={`${style.main} bg-neutral-200 flex flex-col gap-2 pb-20`}>
            {
                (statusPesanan?.status==='Menunggu Pembayaran')&&<WaitingForPaymnet detailPesanan={detailPesanan} handleTerapkan={onClick} showBatalPesanan={statusPesanan?.status==='Menunggu Pembayaran'} handleBatalPesanan={handleActionsButton}/>
            }
            {
                (statusPesanan?.status!=='Menunggu Pembayaran')&&<OtherStatus detailPesanan={detailPesanan} onClick={onClick} onClickLeft={onClickLeft} onClickRight={onClickRight} textLeftButton={textLeftButton} textRightButton={textRightButton} hideBatalPesanan={hideBatalPesanan} multipleButtonBottom={multipleButtonBottom} status={statusPesanan}  leftColor={leftColor} rightColor={rightColor} onToggle={onToggle} colorButton={colorButton} textButton={textButton} 
                onClickSetLacakPesanan={onClickSetLacakPesanan} action_button_detail={action_button_detail} onShowAllProduct={onShowAllProduct} />
            }
        </div>
    );
}

export default DetailOrderMobile;

