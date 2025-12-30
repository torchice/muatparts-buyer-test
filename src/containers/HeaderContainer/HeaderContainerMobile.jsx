import React, { useContext, useEffect, useRef, useState } from 'react'
import style from './HeaderContainer.module.scss'
import Image from 'next/image'
import IconComponent from '@/components/IconComponent/IconComponent'
import Input from '@/components/Input/Input'
import { headerProps } from './headerProps'
import { ResponsiveContext } from '@/common/ResponsiveContext'
import { userLocationZustan } from '@/store/manageLocation/managementLocationZustand'
import ModalComponent from '@/components/Modals/ModalComponent'
import ImageComponent from '@/components/ImageComponent/ImageComponent'
import Button from '@/components/Button/Button'
import { useCustomRouter } from '@/libs/CustomRoute'
import { useLanguage } from '@/context/LanguageContext'
import CustomLink from '@/components/CustomLink'
function HeaderContainerMobile({ location,isLogin }) {
  const { t } = useLanguage()
  const { setHeaderHeight, searchTitle, headerHeight } = headerProps()
  const router = useCustomRouter()
  const [getModal,setModal]=useState('')
  const headerRef = useRef(null)
  const { selectedLocation,resetLocation } = userLocationZustan()
  const {
    setAppBar,
    handleBack,
    clearScreen,
    handleAction,
    appBar,
    appBarType,
    screen,
    search,
    shadow,
    renderAppBarMobile,
    showReset,
    componentBackType,
    setSearch } = useContext(ResponsiveContext)
  useEffect(() => {
    if (headerRef?.current?.offsetHeight) setHeaderHeight?.(headerRef?.current?.offsetHeight)
  }, [appBarType, screen, appBar])
  useEffect(()=>{
    if(!isLogin) resetLocation()
  },[isLogin])
  return (
    <header className={style.main} ref={headerRef}>
      {/* 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer */}
      {/* LB - 0014 */}
      <ModalComponent isOpen={getModal==='scan_barcode'} setClose={()=>setModal('')} hideHeader full>
        <div className='flex flex-col py-4 px-2 items-center max-w-[276px]'>
          <span className='bold-base'>{t('LabelnavbarResponsivePencarianGambar')}</span>
          <span className='mt-4 medium-xs text-center'>{t('LabelnavbarResponsiveTemukanImpianmu')}</span>
          <ImageComponent className={'mt-5'} src={'/img/barcode.png'} width={140} height={140} alt={'barcode'} />
          <Button Class='semi-xs mt-5 max-w-none w-[192px] whitespace-nowrap' onClick={()=>router.push(process.env.NEXT_PUBLIC_INTERNAL_WEB+'register/download_apps')}>{t('LabelnavbarResponsiveUnduhAplikasimuatmuat')}</Button>
        </div>
      </ModalComponent>
      {
        appBarType === "header_custom" ? (
          <div className="w-full h-auto">
            {appBar?.renderAppBar ? appBar?.renderAppBar : null}
          </div>
        ) : null
      }
      {
        appBarType.includes('compact') && <HeaderMainCompact />
      }
      {
        !!(appBarType === 'header_title_secondary' | appBarType === 'header_search_secondary' | appBarType === 'header_title' | appBarType === 'header_search') && <HeaderTitleSearchMobile componentBackType={componentBackType} appBar={appBar} type={appBarType} title={appBar?.title} onBack={handleBack} setSearch={setSearch} searchPlaceholder={search?.placeholder} searchValue={search?.value} screen={screen} shadow={shadow} search={search} />
      }
      {
        !!(appBarType === 'header_title_blue' | appBarType === 'header_search_blue') && <HeaderBlueMobile componentBackType={componentBackType} appBar={appBar} type={appBarType} title={appBar?.title} onBack={handleBack} setSearch={setSearch} searchPlaceholder={search?.placeholder} searchValue={search?.value} screen={screen} shadow={shadow} />
      }
      {
        !!(appBarType === 'header_title_modal' | appBarType === 'header_search_modal' | appBarType === 'header_title_modal_secondary' | appBarType === 'header_search_modal_secondary') && <HeaderModalMobile componentBackType={componentBackType} shadow={shadow} handleAction={handleAction} setAppBar={setAppBar} appBar={appBar} type={appBarType} title={appBar?.title} onBack={handleBack} setSearch={setSearch} searchPlaceholder={search?.placeholder} searchValue={search?.value} showReset={showReset} screen={screen} search={search} />
      }
      {
        !appBarType && <div className={`bg-[#c22716] relative w-full h-auto max-h-[88px] p-4 pb-3 ${shadow ? 'shadow-lg' : ''}`}>
          {
            appBar?.renderAppBar ?
              appBar?.renderAppBar
              : <div className='flex flex-col'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-center gap-2 w-full'>
                    {appBar?.showBackButton && <span onClick={() => handleBack()} className='w-6 h-6 p-1 rounded-full bg-neutral-50 flex justify-center items-center cursor-pointer'>
                      <IconComponent src={'/icons/chevron-left.svg'} classname={style.iconBackRed} width={24} />
                    </span>}
                    <Input focusEvent={() => {
                      setAppBar({
                        onBack: () => clearScreen(),
                        title: t('LabelnavbarResponsiveCariberdasarkan'),
                        appBarType: 'header_title_secondary',
                        defaultType: 'default_search_navbar_mobile'
                      })
                    }} classname={style.inputMobile} placeholder={t('LabelnavbarResponsiveCariProduk')} icon={{ left: <span className='w-4 h-4'><IconComponent src={'/icons/search.svg'} /></span>, right: <span className='w-4 h-4 z-20' onClick={()=>setModal('scan_barcode')}><IconComponent src={'/icons/camera-outline.svg'} /></span> }} />
                  </div>
                  <div className='flex gap-4 items-start'>
                    <span onClick={()=>{
                      if(!isLogin) return router.push(process.env.NEXT_PUBLIC_INTERNAL_WEB + `login?from=mpbuyer&redirect=${window.location.href}`)
                      else router.push('/garasi')
                    }} className='gap-[2px] flex flex-col items-center z-20'>
                      <IconComponent classname={style.iconWhiteGarasi} src={'/icons/garasi.svg'} width={20} height={20} />
                      <span className='font-semibold text-neutral-50 text-[10px]'>{t('LabelnavbarResponsiveGarasi')}</span>
                    </span>
                    <span onClick={()=>{
                      if(!isLogin) return router.push(process.env.NEXT_PUBLIC_INTERNAL_WEB+ `login?from=mpbuyer&redirect=${window.location.href}`)
                      else router.push('/troli')
                    }} className='gap-[2px] flex flex-col items-center z-20'>
                      <IconComponent classname={style.iconCartMobile} src={'/icons/cart.svg'} width={20} height={20} />
                      <span className='font-semibold text-neutral-50 text-[10px]'>{t('LabelnavbarResponsiveTroli')}</span>
                    </span>
                    {isLogin&&<span className='gap-[2px] flex flex-col items-center z-20' onClick={() => {
                      setAppBar({
                        onBack: () => clearScreen(),
                        title: <Image width={100} className={style.muatMini} height={18} src={'/img/muatmuat-mini.png'} alt='mini' />,
                        appBarType: 'header_title',
                        defaultType: 'default_other_navbar_mobile',
                        blankBackground: true
                      })
                    }}>
                      <IconComponent classname={style.iconCartMobile} src={'/icons/burger.svg'} width={20} height={20} />
                      <span className='font-semibold text-neutral-50 text-[10px]'>{t('LabelnavbarResponsiveLainnya')}</span>
                    </span>}
                  </div>
                </div>
                <div className='w-auto max-w-[155px] h-6 p-2 rounded-md bg-neutral-50 flex items-center gap-1 ml-8 justify-between'>
                  <span onClick={() => setAppBar({
                    appBarType: 'header_title',
                    title: location?.length ? t('LabelnavbarResponsivePilihAlamatTujuan') : t('LabelnavbarResponsiveKemanapesananmaudikirim?'),
                    defaultType: 'default_location_navbar_mobile',
                    onBack: () => clearScreen()
                  })} className='font-semibold text-[9px] text-[#c22716] line-clamp-1 w-full'>{t('LabelnavbarResponsiveDikirimKe')}: {selectedLocation?.City ?? 'Surabaya'}</span>
                  <IconComponent src={'/icons/chevron-right.svg'} classname={style.iconBackRed} />
                </div>
                {!appBar?.blankBackground ? <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE + '/img/fallinstartheader.png'} width={153} height={62} alt='fallin' className='absolute right-0 bottom-0 fallin' /> : ''}
              </div>
          }
        </div>}

    </header>
  )
}

export function HeaderTitleSearchMobile({ appBar, type, title, onBack, searchPlaceholder, searchValue, setSearch, shadow, screen, componentBackType, search }) {
  const { t } = useLanguage()
  const RenderBack = appBar?.renderBack || null
  const ActionButton = appBar?.renderActionButton || null
  const isBgSecondary = type === 'header_title_secondary' || type === 'header_search_secondary'
  return (
    <div className={`${isBgSecondary ? 'bg-neutral-50' : 'bg-[#c22716]'} relative w-full h-auto max-h-[88px] p-4 pb-3 flex gap-2 ${shadow ? 'shadow-lg' : ''}`}>
      {!appBar?.blankBackground ? <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE + '/img/fallinstartheader.png'} width={153} height={62} alt='fallin' className='absolute right-0 bottom-0' /> : ''}
      {
        appBar?.renderAppBar ?
          appBar?.renderAppBar :
          <div className='flex gap-2 w-full items-center'>
            {
              (appBar.showBackButton) &&
                RenderBack ? <RenderBack />
                : componentBackType === 'back' ?
                  <span onClick={onBack} className={`w-6 p-1 h-6 ${isBgSecondary ? 'bg-[#176cf7]' : 'bg-neutral-50'} rounded-full flex justify-center items-center cursor-pointer whitespace-nowrap`}>
                    <IconComponent width={16} height={16} classname={`${isBgSecondary ? style.iconBackWhite : style.iconBackRed}`} src={'/icons/chevron-left.svg'} />
                  </span>
                  : componentBackType === 'close' ?
                    <span onClick={onBack} className={`w-6 p-1 h-6 ${isBgSecondary ? 'bg-[#176cf7]' : 'bg-neutral-50'} rounded-full flex justify-center items-center cursor-pointer whitespace-nowrap`}>
                      <IconComponent width={16} height={16} classname={`${isBgSecondary ? style.iconBackWhite : style.iconBackRed}`} src={'/icons/closes.svg'} />
                    </span>
                    : ''
            }
            <form onSubmit={(e) => {
              e.preventDefault()
              // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0207
              if(search?.tmp?.trim()){
                setSearch({ value: search?.tmp })
              }
            }} className='flex justify-between items-center w-full'>
              {(type === 'header_search' || type === 'header_search_secondary') && 
              <Input icon={{ 
                left: <span className='w-4 h-4'><IconComponent src={'/icons/search.svg'} /></span>, 
                right: (search?.value?.length || search?.tmp?.length) > 
              search?.minLen && <span className='w-2 h-2 z-10' onClick={() => setSearch({ value: '', tmp: "" })}>
                <IconComponent src={'/icons/closes.svg'} width={8} height={8} />
                </span> }} classname={style.inputSearchMobile} placeholder={searchPlaceholder} value={search?.onSubmitForm ? search?.tmp : search?.value} changeEvent={e => search?.onSubmitForm ? setSearch({ tmp: e.target.value }) : setSearch({ value: e.target.value })} />}
              {((type === 'header_title' || type === 'header_title_secondary') && typeof title === 'string') ? <span className={`font-bold text-base ${isBgSecondary ? 'text-[#176cf7]' : 'text-neutral-50'}`}>{title}</span> : ((type === 'header_title' || type === 'header_title_secondary') && typeof title !== 'string') ? title : ''}
              {
                ActionButton ? ActionButton : ''
              }
            </form>
          </div>
      }
    </div>
  )
}
export default HeaderContainerMobile

export function HeaderBlueMobile({ appBar, type, title, onBack, searchPlaceholder, searchValue, setSearch, shadow, screen, componentBackType, search }) {
  const { t } = useLanguage()
  const RenderBack = appBar?.renderBack || null
  const ActionButton = appBar?.renderActionButton || null
  return (
    <div className={`bg-primary-700 relative w-full h-auto max-h-[88px] p-4 pb-3 flex gap-2 ${shadow ? 'shadow-lg' : ''}`}>
      {!appBar?.blankBackground ? <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE + '/img/fallinstartheader.png'} width={153} height={62} alt='fallin' className='absolute right-0 bottom-0' /> : ''}
      {
        appBar?.renderAppBar ?
          appBar?.renderAppBar :
          <div className='flex gap-2 w-full items-center'>
            {
              (appBar.showBackButton) &&
                RenderBack ? <RenderBack />
                : componentBackType === 'back' ?
                  <span onClick={onBack} className={`w-6 p-1 h-6`}>
                    <IconComponent width={16} height={16} classname={style.iconBackWhite} src={'/icons/chevron-left.svg'} />
                  </span>
                  : componentBackType === 'close' ?
                    <span onClick={onBack} className={`w-6 p-1 h-6 `}>
                      <IconComponent width={16} height={16} classname={style.iconBackWhite} src={'/icons/closes.svg'} />
                    </span>
                    : ''
            }
            <form onSubmit={(e) => {
              e.preventDefault()
              // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0207
              if(search?.tmp?.trim()){
                setSearch({ value: search?.tmp })
              }
            }} className='flex justify-between items-center w-full'>
              {(type === 'header_search' || type === 'header_search_secondary') && <Input icon={{ left: <span className='w-4 h-4'><IconComponent src={'/icons/search.svg'} /></span>, right: (search?.value?.length || search?.tmp?.length) > search?.minLen && <span className='w-2 h-2 z-10' onClick={() => setSearch({ value: '', tmp: "" })}><IconComponent width={8} height={8} src={'/icons/closes.svg'} /></span> }} classname={style.inputSearchMobile} placeholder={searchPlaceholder} value={search?.onSubmitForm ? search?.tmp : search?.value} changeEvent={e => search?.onSubmitForm ? setSearch({ tmp: e.target.value }) : setSearch({ value: e.target.value })} />}
              {((type === 'header_title' || type === 'header_title_secondary') && typeof title === 'string') ? <span className={`font-bold text-base text-neutral-50`}>{title}</span> : ((type === 'header_title' || type === 'header_title_secondary') && typeof title !== 'string') ? title : ''}
              {
                ActionButton ? ActionButton : ''
              }
            </form>
          </div>
      }
      {!appBar?.blankBackground ? <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE + '/img/fallinstartheader.png'} width={153} height={62} alt='fallin' className='absolute right-0 bottom-0 fallin' /> : ''}
    </div>
  )
}

export function HeaderModalMobile({ appBar, handleAction, type, title, onBack, searchPlaceholder, searchValue, setSearch, shadow, showReset, screen, componentBackType, search }) {
  const { t } = useLanguage()
  const RenderBack = appBar?.renderBack || null
  const ActionButton = appBar?.renderActionButton || null
  const isSecondary = type === 'header_title_modal_secondary' || type === 'header_search_modal_secondary'
  return (
    <div className={`${isSecondary ? 'bg-neutral-50' : 'bg-[#c22716]'} relative w-full h-fit p-4 pb-3 ${shadow ? 'shadow-lg' : ''}`}>
      {
        appBar?.renderAppBar ?
          appBar?.renderAppBar :
          <form onSubmit={(e) => {
            e.preventDefault()
            // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0207
            if(search?.tmp?.trim()){
              setSearch({ value: search?.tmp })
            }
          }} className='flex flex-col gap-4'>
            <div className='flex items-center justify-between gap-2'>
              {
                (appBar.showBackButton) &&
                  RenderBack ? <RenderBack />
                  : componentBackType === 'close' ?
                    <span onClick={() => onBack()} className={`bg-none z-30 w-6 h-6 rounded-full flex justify-center items-center cursor-pointer`}>
                      <IconComponent width={24} src={'/icons/closes.svg'} classname={`${isSecondary ? style.iconBackBlue : style.iconBackWhite}`} />
                    </span>
                    : componentBackType === 'back' ?
                      <span onClick={() => onBack()} className={`${isSecondary ? 'bg-primary-700' : 'bg-neutral-50'} z-30 w-6 h-6 rounded-full flex justify-center items-center cursor-pointer`}>
                        <IconComponent width={24} src={'/icons/chevron-left.svg'} classname={`${isSecondary ? style.iconBackWhite : style.iconBackRed}`} />
                      </span>
                      : ''
              }
              <form onSubmit={(e) => {
                e.preventDefault()
                // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0207
                if(search?.tmp?.trim()){
                  setSearch({ value: search?.tmp })
                }
              }} className='flex items-center justify-center w-full' style={{ marginLeft: 'calc(-8px - 24px)' }}>
                {type === 'header_title_modal' || type === 'header_title_modal_secondary' ?
                  <span className={`font-semibold text-sm ${isSecondary ? 'text-neutral-900' : 'text-neutral-50'}`}>{title}</span>
                  : ''}
                {type === 'header_search_modal' || type === 'header_search_modal_secondary' ? <Input
                  value={search?.onSubmitForm ? search?.tmp : search?.value} changeEvent={e => search?.onSubmitForm ? setSearch({ tmp: e.target.value }) : setSearch({ value: e.target.value })} classname={style.inputMobile} placeholder={searchPlaceholder ? searchPlaceholder : t('LabelnavbarResponsiveCariProduk')} icon={{ left: '/icons/search.svg', right: (search?.value?.length || search?.tmp?.length) > search?.minLen && <span className='w-2 h-2 z-10' onClick={() => setSearch({ value: '', tmp: "" })}><IconComponent src={'/icons/closes.svg'} width={8} height={8} /></span> }} /> : ''}
              </form>
              {
                typeof ActionButton === 'string' ? <span className='w-6 h-6 bg-transparent'></span> : typeof ActionButton !== 'string' ? ActionButton : showReset ? <span onClick={handleAction} className={`font-semibold text-sm cursor-pointer ${isSecondary ? 'text-primary-700' : 'text-neutral-50'}`}>Reset</span> : ''
              }
            </div>
            {appBar?.withSearchBottom && <Input value={search?.onSubmitForm ? search?.tmp : search?.value} changeEvent={e => search?.onSubmitForm ? setSearch({ tmp: e.target.value }) : setSearch({ value: e.target.value })} classname={style.inputMobile} placeholder={searchPlaceholder ? searchPlaceholder : t('LabelnavbarResponsiveCariProduk')} icon={{ left: '/icons/search.svg', right: (search?.value?.length || search?.tmp?.length) > search?.minLen && <span className='w-2 h-2 z-10 ' onClick={() => setSearch({ value: '', tmp: "" })}><IconComponent src={'/icons/closes.svg'} width={8} height={8} classname={'bg-transparent'} /></span> }} />}
            {!isSecondary && <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE + '/img/fallinstartheader.png'} width={153} height={62} alt='fallin' className='absolute right-0 bottom-0' />}
          </form>
      }
    </div>
  )
}


export function HeaderMainCompact() {
  const {
    setAppBar,
    handleBack,
    clearScreen,
    handleAction,
    appBar,
    appBarType,
    screen,
    search,
    shadow,
    setSearch } = useContext(ResponsiveContext)
  const ActionButton = appBar?.renderActionButton || null
  const { t } = useLanguage()
  return (
    <div className={`bg-[#c22716] relative w-full h-auto max-h-[88px] p-4 pb-3 ${shadow ? 'shadow-lg' : ''}`}>
      {
        appBar?.renderAppBar ?
          appBar?.renderAppBar
          :
          <div className='flex flex-col'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex items-center gap-2 w-full relative'>
                {appBar?.showBackButton && <span onClick={() => handleBack()} className='w-6 p-1 h-6 rounded-full bg-neutral-50 flex justify-center items-center cursor-pointer'>
                  <IconComponent src={'/icons/chevron-left.svg'} classname={style.iconBackRed} width={24} />
                </span>}
                <form onSubmit={(e) => {
                  e.preventDefault()
                  // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0207
                  if(search?.tmp?.trim()){
                    setSearch({ value: search?.tmp })
                  }
                }} className='flex items-center justify-between w-full'>
                  <Input
                    value={search?.onSubmitForm ? search?.tmp : search?.value}
                    changeEvent={e => search?.onSubmitForm ? setSearch({ tmp: e.target.value }) : setSearch({ value: e.target.value })}
                    // 24. THP 2 - MOD001 - MP - 020 - QC Plan - Web - MuatParts - Profil Seller Sisi Buyer - LB - 0039
                    classname={`${style.inputMobileCompact} borderless-input items-center z-[51]`}
                    placeholder={search?.placeholder ? search?.placeholder : 'Cari produk'}
                    icon={{ left: <IconComponent width={20} height={20} src={'/icons/search.svg'} />, right: (search?.value?.length || search?.tmp?.length) > search?.minLen && <span className='z-10' onClick={() => setSearch({ value: '', tmp: "" })}><IconComponent width={8} height={8} src={'/icons/closes.svg'} /></span> }} />
                  {/* {
                    search?.value?<span className='absolute right-3 z-50' onClick={()=>setSearch({value:'',tmp:""})}><IconComponent width={10} height={10} src={'/icons/closes.svg'}/></span>:''
                  } */}
                  <div className='flex gap-4 items-start ml-2'>
                    {
                      ActionButton ?
                        ActionButton :
                        <>
                        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0419 */}
                          <CustomLink href={'/garasi'} className='gap-[2px] flex flex-col items-center z-20'>
                            <IconComponent classname={style.iconWhiteGarasi} src={'/icons/garasi.svg'} width={20} height={20} />
                            <span className='font-semibold text-neutral-50 text-[10px]'>{t('LabelnavbarResponsiveGarasi')}</span>
                          </CustomLink>
                          <CustomLink href={'/troli'} className='gap-[2px] flex flex-col items-center z-20'>
                            <IconComponent classname={style.iconCartMobile} src={'/icons/cart.svg'} width={20} height={20} />
                            <span className='font-semibold text-neutral-50 text-[10px]'>{t('LabelnavbarResponsiveTroli')}</span>
                          </CustomLink>
                        </>
                    }
                  </div>
                </form>
              </div>
            </div>

            {!appBar?.blankBackground ? <Image src={process.env.NEXT_PUBLIC_ASSET_REVERSE + '/img/fallinstartheader.png'} width={153} height={62} alt='fallin' className='absolute right-0 bottom-0' /> : ''}
          </div>
      }
    </div>
  )
}