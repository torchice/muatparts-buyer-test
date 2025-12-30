
'use client';
import Button from '@/components/Button/Button';
import style from './Daftarpesananseller.module.scss'
import Dropdown from '@/components/Dropdown/Dropdown';
import IconComponent from '@/components/IconComponent/IconComponent';
import TabMenu from '@/components/Menu/TabMenu';
import Input from '@/components/Input/Input';
import { useState } from 'react';
import CardPesananSeller from '@/components/CardPesananSeller/CardPesananSeller';
const OpsiMassal = [
    {name:'Cetak Label',value:'Cetak Label'},
    {name:'Cetak Invoice',value:'Cetak Invoice'},
    {name:'Unduh Daftar Pesanan',value:'Unduh Daftar Pesanan'},
    {name:'Request Pick Up',value:'Request Pick Up'},
    ]
function DaftarpesanansellerWeb({menus}) {
    const [getSearch,setSearch]=useState('')
    const getOpsiMassal=()=>{
        const data = OpsiMassal
        return data
    }
    return (
        <div className={`${style.main} flex flex-col text-neutral-900 bg-neutral-200`}>
            <div className='py-6 w-full m-auto max-w-[1280px] flex flex-col'>
                {/* head */}
                <div className='flex flex-col gap-4'>
                    <div className="flex w-full justify-between item-center">
                        <span className='font-bold text-xl'>Daftar Pesanan</span>
                        <div className="flex gap-3">
                            <Dropdown options={["01 jan 1995","05 jan 2008"]} dateStartEnd={["01 jan 1995","05 jan 2008"]} optionsOther={["01 jan 1995","05 jan 2008"]} optionsOtherText='Pilih Periode' />
                            <Button Class='!h-8' iconLeft={<IconComponent src={'/icons/download.svg'} classname={'icon-white'} width={20} height={20} />}>Unduh</Button>
                        </div>
                    </div>
                    <TabMenu menu={menus}  />
                </div>
                <div className="bg-neutral-50 p-8 rounded-xl flex flex-col gap-6">
                    <div className="flex w-full justify-between">
                        <div className="flex gap-3 item-center">
                            <Input classname={'!w-[262px]'} icon={{left:'/icons/search.svg'}} placeholder='Cari No.Invoice/ Nama Produk / SKU' value={getSearch} changeEvent={e=>setSearch(e.target.value)} />
                            <Dropdown classname={'!w-[134px]'} placeholder='No. Invoice' leftIconElement={<IconComponent src={'/icons/sorting.svg'} />} />
                        </div>
                        <div className="flex gap-3 item-center">
                            <Dropdown classname={style.dropdownAturMassal} placeholder='Atur Massal' options={()=>getOpsiMassal()}  />
                            <Button Class='!h-8' iconLeft={<IconComponent src={'/icons/download.svg'} classname={'icon-white'} width={20} height={20} />}>Cetak Invoice</Button>
                        </div>
                    </div>
                    <CardPesananSeller/>
                </div>
            </div>
            
        </div>
    );
}

export default DaftarpesanansellerWeb;
