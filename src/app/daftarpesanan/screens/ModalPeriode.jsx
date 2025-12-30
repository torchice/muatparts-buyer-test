import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input'
import ModalComponent from '@/components/Modals/ModalComponent';
import RadioButton from '@/components/Radio/RadioButton'
import { clasifyformatdate, formatDateInput } from '@/libs/DateFormat';
import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
const list_periode=[
    {
        name:'Semua Periode (Default)',
        value:'',
        format:'day'
    },
    {
        name:'Hari Ini',
        value:0,
        format:'day'
    },
    {
        name:'1 Minggu Terakhir',
        value:7,
        format:'day'
    },
    {
        name:'30 Hari Terakhir',
        value:30,
        format:'month'
    },
    {
        name:'90 Hari Terakhir',
        value:90,
        format:'month'
    },
    {
        name:'1 Tahun Terakhir',
        value:365,
        format:'year'
    },
    {
        name:'Pilih Periode',
        value:'custom',
        format:'year'
    },
    
]
function ModalPeriode({onSelected=()=>{},defaultValue,onClose}) {
    const [selected,setSelected]=useState(list_periode[0])
    const [focusCustom,setFocusCustom]=useState('')
    const [getFocusDate,setFocusDate]=useState('')
    const [getCustom,setCustom]=useState({
        start:null,
        end:null,
        format:'custom'
    })
    const [validation,setValidation]=useState([])
    function onSelectedCustom(val,label) {
        const tmp = getCustom
        const revalidate = validation.filter(val=>val!==label)
        setValidation(revalidate)
        tmp[label]=clasifyformatdate.getClasifyPeriodeByRange(val)
        setCustom(tmp)
    }
    function handleTerapkan(){
        // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0398
        if(selected.value==='custom'){
            if(!getCustom.start) {
                setValidation(a=>([...a,'start']))
                // onClose()
            }
            if(!getCustom.end) {
                setValidation(a=>([...a,'end']))
                // onClose()
            }
            if(getCustom.start&&getCustom.end) onSelected(getCustom,selected)
        }else if(selected.value==='') {
            onClose()
            onSelected('')
        }
        else onSelected(clasifyformatdate.getClasifyPeriode(selected.value,selected.format),selected)
    }
    useEffect(()=>{
        if(defaultValue?.end) {
            setSelected({
                format:defaultValue?.format,
                name:defaultValue?.name,
                value:defaultValue?.value
            })
            setCustom({
                end:defaultValue?.end,
                start:defaultValue?.start,
                format:defaultValue?.format
            })
        }//25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0187
        else if(!defaultValue?.end&&typeof defaultValue?.value==='number') setSelected(defaultValue)
    },[defaultValue])

  return (
    <div className='px-4 pt-6 flex flex-col gap-4 overflow-y-auto max-h-[386px] pb-4'>
        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0399 */}
        <ModalComponent hideHeader showButtonClose={false} bgTransparent isOpen={focusCustom==='start'||focusCustom==='end'} setClose={()=>setFocusCustom('')}>
            <div className='flex justify-center'>
                <Calendar className={'rounded-md'} value={getFocusDate?new Date(getFocusDate):new Date()} onChange={date=>{
                    onSelectedCustom(date,focusCustom)
                    setFocusCustom('')
                }} />
            </div>
        </ModalComponent>
        {list_periode.map(val=><div key={val.name} className='flex justify-between w-full pb-4 border-b border-neutral-400 select-none' onClick={()=>{
            setSelected(val)
        }}>
            <span className='semi-sm'>{val.name}</span>
            <RadioButton label={''} checked={val.name===selected?.name}  />
        </div>)}
        <div className='flex items-center gap-2 justify-between'>
            <div className='relative'>
                {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0400 */}
                <Input value={getCustom.start?formatDateInput(getCustom.start,['day','month','year'],false):''} focusEvent={()=>{
                    setFocusDate(getCustom.start)
                    setFocusCustom('start')}} disabled={selected?.value!=='custom'} classname={`!w-full ${validation.includes('start')?'input-error':''}`} classInput={'!w-full'} placeholder='Periode Awal' icon={{left:'/icons/calendar.svg'}} />
                {validation.includes('start')?<span className='medium-xs text-error-400 absolute -bottom-6'>Periode awal harus diisi</span>:''}
            </div>
            <span className='semi-xs text-[#676767]'>s/d</span>
            <div className='relative'>
                {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0400 */}
                <Input value={getCustom.end?formatDateInput(getCustom.end,['day','month','year'],false):''} focusEvent={()=>{
                    setFocusDate(getCustom.end)
                    setFocusCustom('end')}} disabled={selected?.value!=='custom'} classname={`!w-full ${validation.includes('end')?'input-error':''}`} classInput={'!w-full'} placeholder='Periode Akhir' icon={{left:'/icons/calendar.svg'}} />
                {validation.includes('end')?<span className='medium-xs text-error-400 absolute -bottom-6'>Periode akhir harus diisi</span>:''}
            </div>
        </div>
        <Button Class='!w-full !max-w-full h-10 mt-4' onClick={handleTerapkan}>Terapkan</Button>
    </div>
  )
}

export default ModalPeriode

