
import { useHeader } from '@/common/ResponsiveContext'
import React, { useEffect, useState } from 'react'
import style from './Daftarpesananseller.module.scss'
import IconComponent from '@/components/IconComponent/IconComponent'
import CardManageOrderMobile from '@/components/CardManageOrderMobile/CardManageOrderMobile'
import ModalComponent from '@/components/Modals/ModalComponent'
import Checkbox from '@/components/Checkbox/Checkbox'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import RadioButton from '@/components/Radio/RadioButton'
import ButtonBottomMobile from '@/components/ButtonBottomMobile/ButtonBottomMobile'
import Toast from '@/components/Toast/Toast'
import ToastApp from '@/components/ToastApp/ToastApp'
import FilterkelolaPesanan from '../screens/FilterkelolaPesanan'
import DetailKelolaPesanan from '../screens/DetailKelolaPesanan'
import TrackOrderMobile from '@/containers/TrackOrderMobile/TrackOrderMobile'
import ModalUrutkan from './modals/ModalUrutkan'
import daftarpesanandummy from './daftarpesanan.json'

function DaftarpesanansellerResponsive({menus,data=daftarpesanandummy}) {
  const {
    setAppBar, // tambahkan payload seperti ini setAppBar({onBack:()=>setScreen('namaScreen'),title:'Title header',appBarType:'type'})
    clearScreen,// reset appBar
    setScreen, // set screen
    screen, // get screen,
    setSearch, // tambahkan payload seperti ini {placeholder:'Pencarian',value:'',type:'text'}
  }=useHeader()
  const [isShowSort,setShowSort]=useState(false)
  const [isShowOption,setShowOption]=useState('')
  const [showToast,setShowToast]=useState(false)
  const [getReasonRejected,setReasonRejected]=useState('')
  const [getReasonRejectedOther,setReasonRejectedOther]=useState('')
  const [getChecked,setChecked]=useState([])
  const [isAturMassal,setAturMassal]=useState(false)
  const [sortActive,setSortActive]=useState('')
  const [getMenu,setMenu]=useState('Semua')
  const [validation,setValidation]=useState([])
  useEffect(()=>{
    if(getReasonRejected!=='Lainnya') setValidation(validation.filter(val=>val!=='alasan_penolakan_validation'))
  },[getReasonRejected])
  useEffect(()=>{
    window.scrollTo(0,0)
    if(!screen){
      setAppBar({
        appBarType:'header_search',
        renderActionButton:<span className='flex flex-col gap-[2px] items-center ml-2 select-none z-10' onClick={()=>setShowSort(true)}>
          <IconComponent src={'/icons/sorting.svg'} classname={'icon-white'} width={24} height={24} />
          <span className='text-[10px] text-neutral-50 font-semibold'>Urutkan</span>
        </span>
      })
      setSearch({
        placeholder:'Cari No.Invoice/Nama produk'
      })
    }
    if(screen==='detailPesanan'){
      setAppBar({
        appBarType:'header_title',
        title:'Detail Pesanan',
        renderActionButton:<span className='flex flex-col gap-[2px] items-center ml-2 select-none z-10' onClick={()=>console.log('download')}>
        <IconComponent src={'/icons/download.svg'} classname={'icon-white'} width={24} height={24} />
        <span className='text-[10px] text-neutral-50 font-semibold'>Unduh</span>
        </span>,
        onBack:()=>clearScreen()
      })
    }
    if(screen==='filter'){
      setAppBar({
        appBarType:'header_title_modal_secondary',
        title:'Filter',
        onBack:()=>clearScreen(),
        componentBackType:'close'
      })
    }
    if(screen==='lacak_pesanan'){
      setAppBar({
        appBarType:'header_title',
        title:'Lacak Pesanan',
        onBack:()=>setScreen('detailPesanan'),
      })
    }
  },[screen])

  function handelCheck(value) {
    if(getChecked.includes(value)){
      const tmp = getChecked.filter(a=>a!==value)
      setChecked(tmp)
    }else setChecked(a=>([...a,value]))
  }
  function handelCheckAll(value) {
    if(getChecked.length===value.length){
      setChecked([])
    }else setChecked(value)
  }
  function handleTerapkan() {
    setShowSort(false)
  }
  function handleTerapkanPenolakan() {
    if(!getReasonRejectedOther) setValidation(['alasan_penolakan_validation'])
    if(getReasonRejectedOther){
      setValidation([])
      //hit api
    }
  }
  function handleBatal() {
    clearScreen()
  }
  function handleSimpan(val) {
    console.log(val)
    // hit api
  }
  if(screen==='filter') return <FilterkelolaPesanan onBatal={handleBatal} onSimpan={handleSimpan} />
  if(screen==='detailPesanan') return <DetailKelolaPesanan/>
  if(screen==='lacak_pesanan') return <TrackOrderMobile data={[{
      title:'Pengembalian Dana Berhasil',
      date:'26 Jan 2024 11:51 WIB',
      desc:'(Pengembalian Dana berhasil pada Date_pengembalian_dana)'
  }]} />
  // main screen
  return (
    <div className={`${style.main} flex flex-col bg-neutral-200 gap-2`}>
      {/* modals */}
      <ModalUrutkan isShowSort={isShowSort} setShowSort={setShowSort} setSortActive={setSortActive} sortActive={sortActive} handleTerapkan={handleTerapkan} />

      {/* body */}
      <div className='flex flex-col'>
        {/* menus */}
        <div className='flex pt-7 gap-1 overflow-x-scroll scrollbar-none bg-neutral-50'>
          {
            menus.map(val=>{
              return(
                <div className='flex gap-3'>
                  <span className={`flex bold-sm pb-3 px-4 gap-1 select-none whitespace-nowrap  ${getMenu===val.name?'border-b-muat-parts-non-800 text-muat-parts-non-800':'border-b-transparent text-neutral-700'} border-b-2 `} onClick={()=>setMenu(val.name)}>
                    <span>{val.name}</span>
                    {val.notif&&<span>({val.notif})</span>}
                  </span>
                  <span className='w-[1px] h-[80%] bg-neutral-400'></span>
                </div>
              )
            })
          }
        </div>
        {/* filter and massal */}
        <div className='p-4 flex justify-between items-center w-full bg-neutral-50 text-neutral-900'>
          {isAturMassal?<Checkbox label='Pilih Semua' checked={getChecked.length===data.length} onChange={()=>handelCheckAll(data.map(val=>val.id))} />:<div className='bg-neutral-200 rounded-3xl py-2 px-3 gap-[10px] select-none flex items-center h-[30px]' onClick={()=>setScreen('filter')}>
            <span className='medium-sm'>Filter</span>
            <IconComponent src={'/icons/filter.svg'} width={14} height={14} />
          </div>}
          <span className='text-primary-700 semi-sm select-none' onClick={()=>setAturMassal(!isAturMassal)}>{isAturMassal?'Batalkan':'Atur Massal'}</span>
        </div>
      </div>
      {/* list order */}
      <div className='flex flex-col gap-2 bg-neutral-200'>
        {
          data?.map(val=>{
            return <CardManageOrderMobile key={val.id}
            amount={val.amount} 
            amountOfAllProduct={val.amountOfAllProduct} 
            buyerName={val.buyerName}
            courier={val.courier}
            invoice={val.invoice}
            responseLimit={val.responseLimit}
            productName={val.productName}
            status={val.status}
            totalOrder={val.totalOrder}
            textButton={val.textButton}
            onClickMenu={()=>setShowOption('opsi')}
            withCheckBox={isAturMassal}
            valueChecked={val.valueChecked}
            isChecked={getChecked.includes(val.id)}
            onChecked={()=>handelCheck(val.id)}
            date={val.date}
            />
          })
        }
      </div>
      {getChecked.length?<ButtonBottomMobile onClickSingleButton={()=>setShowOption('atur_masal')} isSingleButton textSingleButton={`Atur ${getChecked.length} Produk Sekaligus`} />:''}

      {/* terima pesanan */}
      <ModalComponent isOpen={isShowOption==='terima_pesanan'} setClose={()=>setShowOption('')} full title='Terima Pesanan' hideHeader preventAreaClose>
        <div className='p-4 flex flex-col items-center max-w-[300px]'>
          <span className='font-bold text-base text-neutral-900 '>Terima Pesanan</span>
          <p className='medium-sm text-neutral-900 text-center mt-4'>Apakah kamu yakin menerima pesanan 2 sekaligus?</p>
          <div className='flex justify-between gap-2 mt-5'>
            <Button onClick={()=>setShowOption('')} Class='!max-w-full w-[112px] !min-h-7 !h-7' color='primary_secondary'>Tidak</Button>
            <Button onClick={()=>setShowToast(true)} Class='!max-w-full w-[112px] !min-h-7 !h-7'>Ya</Button>
          </div>
        </div>
      </ModalComponent>
      <ToastApp onClose={()=>setShowToast(false)} show={showToast} timer={6000} text={`${getChecked?.length} Pesanan berhasil diterima`} classname={'fixed'} bottom={'10%'} right={'16px'} />
        
      {/* atur massal */}
      <ModalComponent isOpen={isShowOption==='atur_masal'} setClose={()=>setShowOption('')} full title='Atur Massal' type='BottomSheet'>
        <ul className='list-none select-none text-neutral-900 flex flex-col gap-4 py-6 px-4'>
          <li>
            <div className="semi-sm pb-4 border-b border-neutral-400">Cetak Invoice</div>
          </li>
          <li>
            <div className="semi-sm pb-4 border-b border-neutral-400">Unduh Daftar Pesanan</div>
          </li>
          <li>
            <div className="semi-sm pb-4 border-b border-neutral-400" onClick={()=>setShowOption('terima_pesanan')}>Terima pesanan</div>
          </li>
          <li>
            <div className="semi-sm text-error-400">Tolak Pesanan</div>
          </li>
        </ul>
      </ModalComponent>

      {/* menu titik tiga */}
      <ModalComponent full type='BottomSheet' title='Opsi' isOpen={isShowOption==='opsi'} setClose={()=>setShowOption('')}>
          <ul className='py-6 px-4 list-none text-neutral-900 flex flex-col gap-4 w-full select-none'>
            <li><div className='w-full semi-sm pb-4 border-b border-neutral-400'>Detail</div></li>
            <li><div className='w-full semi-sm ' onClick={()=>setShowOption('rejected_reason')}>Tolak Pesanan</div></li>
          </ul>
      </ModalComponent>

      {/* alasan penolakan */}
      <ModalComponent full type='BottomSheet' title='Pilih Alasan Penolakan' isOpen={isShowOption==='rejected_reason'} setClose={()=>setShowOption('')}>
        <div className='py-3 px-4 flex flex-col gap-3 w-full max-h-[489px] overflow-y-auto'>
          <div className='w-full py-1 px-2 bg-error-50 rounded-md'>
            <span className='semi-sm text-error-400'>Penolak pesanan dapat dilakukan maks. 3 kali per 30 hari! <span className='text-primary-700'>Pelajari Batasan</span></span>
          </div>
          <ul className='list-none text-neutral-900 flex flex-col gap-4 w-full select-none'>
            <li>
              <div onClick={()=>setReasonRejected('Stok Habis')} className='pb-4 border-b border-neutral-400 w-full flex justify-between select-none'>
                <div className='flex flex-col gap-3'>
                  <span className='semi-sm'>Stok Habis</span>
                  <span className='medium-xs text-neutral-600'>Stok Produk akan diubah menjadi kosong</span>
                </div>
                <RadioButton label='' checked={getReasonRejected==='Stok Habis'} />
              </div>
            </li>
            <li>
              <div onClick={()=>setReasonRejected('Sedang Tutup')} className='pb-4 border-b border-neutral-400 w-full flex justify-between select-none'>
                <div className='flex flex-col gap-3'>
                  <span className='semi-sm'>Sedang Tutup</span>
                  <span className='medium-xs text-neutral-600'>Merchant akan ditutup untuk 3 hari kedepan</span>
                </div>
                <RadioButton label='' checked={getReasonRejected==='Sedang Tutup'} />
              </div>
            </li>
            <li>
              <div onClick={()=>setReasonRejected('Kendala Pengiriman')} className='pb-4 border-b border-neutral-400 w-full flex justify-between select-none'>
                <div className='flex flex-col gap-3'>
                  <span className='semi-sm'>Kendala Pengiriman</span>
                  <span className='medium-xs text-neutral-600'>Stok produk akan dikembalikan seperti semula</span>
                </div>
                <RadioButton label='' checked={getReasonRejected==='Kendala Pengiriman'} />
              </div>
            </li>
            <li>
              <div onClick={()=>setReasonRejected('Lainnya')} className='pb-4 w-full flex justify-between select-none'>
                <span className='semi-sm'>Lainnya</span>
                <RadioButton label='' checked={getReasonRejected==='Lainnya'} />
              </div>
              <Input
                classname={(validation.some(val=>val==='alasan_penolakan_validation')&&getReasonRejected==='Lainnya')&&'input-error'}
                supportiveText={{desc:getReasonRejectedOther?.length+'/80',title:(validation.some(val=>val==='alasan_penolakan_validation')&&getReasonRejected==='Lainnya')&&'Alasan lainnya wajib diisi'}} 
                placeholder='Masukkan alasan'
                disabled={getReasonRejected!=='Lainnya'} 
                value={getReasonRejectedOther} 
                changeEvent={(e) => {
                  const value = e?.target?.value || "";
                
                  if (value.length > 80) return;
                
                  setReasonRejectedOther(value);
                
                  if (value) {
                    setValidation((validation) =>
                      validation.filter((val) => val !== "alasan_penolakan_validation")
                    );
                  } else {
                    setValidation(["alasan_penolakan_validation"]);
                  }
                }} />
            </li>
          </ul>
          <Button Class='!max-w-full !w-full' onClick={handleTerapkanPenolakan}>Terapkan</Button>
        </div>
      </ModalComponent>
      
    </div>
  )
}

export default DaftarpesanansellerResponsive
  