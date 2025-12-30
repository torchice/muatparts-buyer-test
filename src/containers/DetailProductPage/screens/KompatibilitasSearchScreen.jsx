import { useHeader } from '@/common/ResponsiveContext'
import Button from '@/components/Button/Button'
import ButtonBottomMobile from '@/components/ButtonBottomMobile/ButtonBottomMobile'
import DataNotFound from '@/components/DataNotFound/DataNotFound'
import RadioButton from '@/components/Radio/RadioButton'
// LBM - Multibahasa Optimization
import { useLanguage } from "@/context/LanguageContext";
import React, { useState } from 'react'

function KompatibilitasSearchScreen({data,onClick}) {
  const {t} = useLanguage()
  const {search}=useHeader()
  const [state,setState]=useState('')
  console.log(search)
  return (
    <div className='containerMobile h-screen flex flex-col gap-3'>
      {
        data.length?<>
        {data?.map(({brand,model,type,...rest})=>({name:`${brand}, ${model}, ${type}`,...rest}))?.filter(a=>a?.name?.toLowerCase()?.includes(search?.tmp?.toLowerCase()))?.map(val=><div key={val?.id} className='kompatibilitasCard pb-3 border-b border-neutral-400'>
          <RadioButton label={val?.name} checked={val?.id===state} onClick={a=>setState(a?.value)} value={val?.id} />
        </div>)}
        </>
        :<div className='flex flex-col gap-3'>
          <DataNotFound type='data' title={t("LabelmodalKompatibilitasSearchScreenBelumadadata")}/>
          <span className='font-medium text-neutral-600 text-center text-xs'>{t("LabelmodalKompatibilitasSearchScreenYuktambahdatakendaraankamuuntukmemudahkanpencarian")}</span>
          <Button Class='!h-7 !w-fit font-semibold text-xs self-center'>{t("LabelmodalKompatibilitasSearchScreenTambahDataKendaraan")}</Button>
        </div>
      }
      {state&&<ButtonBottomMobile isSingleButton textSingleButton={'Cek Kompatibilitas'} onClickSingleButton={()=>onClick(state)}/>}
    </div>
  )
}

export default KompatibilitasSearchScreen
