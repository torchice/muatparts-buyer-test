import { ResponsiveContext, useHeader } from '@/common/ResponsiveContext'
import ButtonBottomMobile from '@/components/ButtonBottomMobile/ButtonBottomMobile'
import DataNotFound from '@/components/DataNotFound/DataNotFound'
import RadioButton from '@/components/Radio/RadioButton'
import React, { useState } from 'react'

function GarageScreenProduct({data,getFilterProduct,handleInput,search,setSearch}) {
    const [state,setState]=useState(getFilterProduct?.garageID)
    const {setScreen}=useHeader()
  return (
    <div className='containerMobile pb-[80px] flex flex-col gap-3 bg-[#fcfcfc] h-screen'>
        {
            !data?.length?
            <DataNotFound type='data' title='Tidak ada data' classname={'mt-10'} />
            :data?.filter(val=> val.name.toLowerCase().includes(search?.value?.toLowerCase())).map(val=>{
                return(
                    <React.Fragment key={val.id}>
                        <RadioButton checked={val.value===state} value={val.name} onClick={a=>setState(val.value)} label={val.name} classnameLabel={'font-semibold text-sm text-neutral-900 pb-3 border-b border-neutral-400m w-full'} />
                    </React.Fragment>
                )
            })
        }
        
        <ButtonBottomMobile textLeft={'Reset'} textRight={'Terapkan'} onClickLeft={()=>setScreen('filter')} disableButtonLeft={!data?.length} disableButtonRight={!data?.length} onClickRight={()=>{
            handleInput('garageID',state)
            setScreen('filter')
        }} />
    </div>
  )
}

export default GarageScreenProduct
