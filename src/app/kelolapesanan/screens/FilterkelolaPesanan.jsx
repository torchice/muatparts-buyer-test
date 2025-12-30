import Bubble from '@/components/Bubble/Bubble'
import ButtonBottomMobile from '@/components/ButtonBottomMobile/ButtonBottomMobile'
import React, { useState } from 'react'

function FilterkelolaPesanan({data, onBatal,onSimpan}) {
  const [getFilterPengiriman,setFilterPengiriman]=useState([])
  const [getFilterJasaPengiriman,setFilterJasaPengiriman]=useState([])
  const [getFilterBatasRespon,setFilterBatasRespon]=useState([])
  function handleSetFilter(type,value) {
    if(type==='pengiriman'){
      const check = getFilterPengiriman.some(val=>val===value)
      if(check){
        const tmp=getFilterPengiriman.filter(val!==value)
        setFilterPengiriman(tmp)
        return
      }
      setFilterPengiriman(a=>([...a,value]))
      return
    }
    if(type==='jasa_pengiriman'){
      const check = getFilterJasaPengiriman.some(val=>val===value)
      if(check){
        const tmp = getFilterJasaPengiriman.filter(val=>val!==value)
        setFilterJasaPengiriman(tmp)
        return
      }
      setFilterJasaPengiriman(a=>([...a,value]))
      return
    }
    if(type==='batas_respon'){
      const check = getFilterBatasRespon.some(val=>val===value)
      if(check){
        const tmp = getFilterBatasRespon.filter(val=>val!==value)
        setFilterBatasRespon(tmp)
        return
      }
      setFilterBatasRespon(a=>([...a,value]))
      return
    }
  }
  function handleSave() {
    onSimpan({
      pengiriman:getFilterPengiriman,
      jasaPengiriman:getFilterJasaPengiriman,
      batasRespon:getFilterBatasRespon
    })
  }
  return (
    <div className='flex flex-col w-full bg-neutral-50 py-5 px-4 text-neutral-900 gap-5'>
      <div className='flex flex-col gap-4 border-b border-neutral-400 pb-5'>
        <span className='semi-sm'>Pengiriman</span>
        <div className='flex flex-wrap gap-2'>
          {
            data?.pengiriman?.map(val=>{
              return <Bubble key={val?.id} onClick={()=>handleSetFilter('pengiriman',val?.id)} classname={`${getFilterPengiriman?.includes(val?.id)?'!bg-primary-50':'!text-neutral-900 !bg-neutral-200 border-transparent'}`}>{val?.name}</Bubble>
            })
          }
          
        </div>
      </div>
      <div className='flex flex-col gap-4 border-b border-neutral-400 pb-5'>
        <span className='semi-sm'>Jasa Pengiriman</span>
        <div className='flex flex-wrap gap-2'>
          {
            data?.jasaPengiriman?.map(val=>{
              return <Bubble key={val?.id} onClick={()=>handleSetFilter('jasa_pengiriman',val?.id)} classname={`${getFilterJasaPengiriman?.includes(val?.id)?'!bg-primary-50':'!text-neutral-900 !bg-neutral-200 border-transparent'}`}>{val?.name}</Bubble>
            })
          }
          
        </div>
      </div>
      <div className='flex flex-col gap-4 pb-5'>
        <span className='semi-sm'>Batas Respon</span>
        <div className='flex flex-wrap gap-2'>
          <Bubble onClick={()=>handleSetFilter('batas_respon','Kurang dari 24 Jam')} classname={`${getFilterBatasRespon?.some(val=>val==='Kurang dari 24 Jam')?'!bg-primary-50':'!text-neutral-900 !bg-neutral-200 border-transparent'}`}>Kurang dari 24 Jam</Bubble>
          <Bubble onClick={()=>handleSetFilter('batas_respon','Kurang dari 72 Jam')} classname={`${getFilterBatasRespon?.some(val=>val==='Kurang dari 72 Jam')?'!bg-primary-50':'!text-neutral-900 !bg-neutral-200 border-transparent'}`}>Kurang dari 72 Jam</Bubble>
          <Bubble onClick={()=>handleSetFilter('batas_respon','Lebih dari 72 Jam')} classname={`${getFilterBatasRespon?.some(val=>val==='Lebih dari 72 Jam')?'!bg-primary-50':'!text-neutral-900 !bg-neutral-200 border-transparent'}`}>Lebih dari 72 Jam</Bubble>
        </div>
      </div>
      <ButtonBottomMobile textLeft={'Batal'} textRight={'Simpan'} onClickLeft={onBatal} onClickRight={handleSave} />
    </div>
  )
}

export default FilterkelolaPesanan
