import ButtonBottomMobile from '@/components/ButtonBottomMobile/ButtonBottomMobile'
import Checkbox from '@/components/Checkbox/Checkbox'
import DefaultInputComponent from '@/components/DefaultInputComponent/DefaultInputComponent'
import Dropdown from '@/components/Dropdown/Dropdown'
import IconComponent from '@/components/IconComponent/IconComponent'
import TextArea from '@/components/TextArea/TextArea'
import React from 'react'

function AddLocationManagementContainerMobile({data,onCancel,onSave}) {
  return (
    <div className='flex flex-col py-6 pb-20 px-4 gap-4 text-neutral-900 h-full bg-neutral-50'>
        <div className='flex flex-col gap-4'>
            <span className='semi-sm'>Label Alamat*</span>
            <TextArea placeholder='Label Alamat' hasCharCount resize='none' height={'47px'} maxLength={225}/>
        </div>
        <div className='flex flex-col gap-4'>
            <span className='semi-sm'>Lokasi*</span>
            <div className='flex items-center gap-3'>
                <span className='w-auto'>
                    <IconComponent src={'/icons/marker.svg'} width={30} height={30} />
                </span>
                <span className='semi-sm'>Graha Airi, Jl. Kedung Doro No.101 A, RT.001/RW.06, Kedungdoro, Kec. Tegalsari, Surabaya, Jawa Timur 60261</span>
            </div>
        </div>
        <div className='flex flex-col gap-4'>
            <span className='semi-sm'>Alamat*</span>
            <TextArea placeholder='Masukkan alamat lengkap dengan detail.&#10;Contoh : &#10;Nama Jalan (bila tidak ditemukan). Gedung, No. Rumah/Patokan, Blok/Unit' hasCharCount resize='none' maxLength={225}/>
        </div>
        <div className='flex flex-col gap-4'>
            <span className='semi-sm'>Kecamatan</span>
            <span className='semi-sm'>Tegalsari</span>
        </div>
        <div className='flex flex-col gap-4'>
            <span className='semi-sm'>Kota</span>
            <span className='semi-sm'>Surabaya</span>
        </div>
        <div className='flex flex-col gap-4'>
            <span className='semi-sm'>Provinsi</span>
            <span className='semi-sm'>Jawa Timur</span>
        </div>
        <div className='flex flex-col gap-4'>
            <span className='semi-sm'>Kode Pos*</span>
            <Dropdown placeholder='Pilih Kode Pos' classname={'!w-full'} />
        </div>
        <DefaultInputComponent label={'Nama PIC*'} placeholder={'Nama PIC Lokasi'}  />
        <DefaultInputComponent label={'No. HP PIC*'} placeholder={'Contoh : 08xxxxxxxxxx'}  />
        <Checkbox label='Jadikan alamat sebagai alamat utama' />
        <ButtonBottomMobile textLeft={'Batal'} textRight={'Simpan'} onClickLeft={()=>{}} onClickRight={()=>{}} />
    </div>
  )
}

export default AddLocationManagementContainerMobile