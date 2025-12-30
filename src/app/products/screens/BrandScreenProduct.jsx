import { useHeader } from '@/common/ResponsiveContext'
import ButtonBottomMobile from '@/components/ButtonBottomMobile/ButtonBottomMobile'
import Checkbox from '@/components/Checkbox/Checkbox'
import React, { useState } from 'react'

function BrandScreenProduct({data,getFilterProduct,handleInput}) {
    const [state,setState]=useState(getFilterProduct?.brandProductID)
    const {setScreen,search,setSearch}=useHeader()
  return (
    <div className='containerMobile pb-[80px] flex flex-col gap-3 w-full h-full bg-[#fcfcfc]'>
        {
            data?.filter(a=>a.value?.toLowerCase().includes(search?.value?.toLowerCase())).map(val=>{
                return <Checkbox key={val?.id} value={val?.id} onChange={(a)=>{
                    if (!a?.checked) setState(state?.filter(a=>a!==a?.value))
                    else setState(prev=>[...prev,a?.value])
                }} classname={'font-semibold text-sm text-neutral-900 pb-3 border-b border-neutral-400'} label={val.value}/>
                    
            })
        }
        <ButtonBottomMobile textLeft={'Reset'} textRight={'Terapkan'} onClickLeft={()=>setState([])} onClickRight={()=>{
            handleInput('brandProductID',state)
            setScreen('filter')
        }} />
    </div>
  )
}

export default BrandScreenProduct