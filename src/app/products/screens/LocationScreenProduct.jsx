import { useHeader } from '@/common/ResponsiveContext'
import ButtonBottomMobile from '@/components/ButtonBottomMobile/ButtonBottomMobile'
import Checkbox from '@/components/Checkbox/Checkbox'
import React, { useEffect, useState } from 'react'

function LocationScreenProduct({getFilterProduct,data,handleInput}) {
    const [state,setState]=useState(getFilterProduct?.cityID)
    const {setScreen,search,setSearch}=useHeader()
    console.log(state)
  return (
    <div className='containerMobile pb-[80px] flex flex-col gap-3 bg-[#fcfcfc]'>
        {
            data?.filter(a=>a.description?.toLowerCase().includes(search?.value?.toLowerCase())).map(val=>{
                return(
                    <React.Fragment key={val.id}>
                        <Checkbox onChange={(a)=>{
                            if (!a?.checked) setState(state?.filter(a=>a!==a?.value))
                            else setState(prev=>[...prev,a?.value])
                        }} value={val?.id} classname={'font-semibold text-sm text-neutral-900 pb-3 border-b border-neutral-400'} label={val.description}/>
                    </React.Fragment>
                )
            })
        }
        <ButtonBottomMobile textLeft={'Reset'} textRight={'Terapkan'} onClickLeft={()=>setState([])} onClickRight={()=>{
            handleInput('cityID',state)
            setScreen('filter')
            }} />
    </div>
  )
}

export default LocationScreenProduct