import React from 'react'
import style from './LocationManagementContainerMobile.module.scss'
import IconComponent from '@/components/IconComponent/IconComponent'
import Input from '@/components/Input/Input'
function ListLocationManagementMobile({data,onSelected,onEdit}) {
    const { t } = useLanguage()
    function onEditLocation(val) {
        if(typeof onEdit==='function') onEdit(val)
    }
    function onSelectLocation(params) {
        
    }
  return (
    <div className={`${style.main} flex flex-col py-5 px-4 gap-5 text-neutral-700 h-screen bg-neutral-50`}>
        <div className='py-1 flex flex-col gap-5'>
            <Input classname={'h-8 !w-full'} placeholder={t('LabelnavbarResponsiveCarilokasiyangdisimpan')} />
            <ul className='list-none'>
                <li>
                    <div className='flex justify-between items-start'>
                        <div className='flex gap-2 items-start' onClick={()=>onSelectLocation()}>
                            <span className='w-6'>
                                <IconComponent src={'/icons/map-location.svg'} width={24} height={24} />
                            </span>
                            <div className='flex flex-col '>
                                <span className='semi-sm text-neutral-900 line-clamp-1'>Graha Airi, Jl. Kedung Doro No.101 A, RT.001/RW.06, Kedungdoro, Kec. Tegalsari, Surabaya, Jawa Timur 60261
                                </span>
                                <span className='semi-xs line-clamp-1'>Graha Airi, Jl. Kedungdoro 101, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261</span>
                            </div>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <span className='bg-primary-700 py-1 px-2 rounded-md text-neutral-50 semi-sm'>{t('LabelnavbarResponsiveUtama')}</span>
                            <span onClick={()=>onEditLocation()}>
                                <IconComponent src={'/icons/edit.svg'} width={24} height={24} />
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    )
}

export default ListLocationManagementMobile