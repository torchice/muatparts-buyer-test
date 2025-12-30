import { useHeader } from '@/common/ResponsiveContext'
import CustomLink from '@/components/CustomLink'
import DataNotFound from '@/components/DataNotFound/DataNotFound'
import IconComponent from '@/components/IconComponent/IconComponent'
import { useCustomRouter } from '@/libs/CustomRoute'
import Link from 'next/link'
import React, { useState } from 'react'
function ScreenCategories({data,withExpand=false,onClick,directlyClick=false}) {
  const router = useCustomRouter()
  const {
      setAppBar,
      clearScreen, // reset appBar
      setScreen, // set screen
      screen, // get screen,
      setGlobalPadding,
    } = useHeader()
  const [expanded,setExpanded]=useState([])
  const [subCategory,setSubCategory]=useState({})
  function handleClick(params,state) {
    if(params?.children?.length&&!directlyClick){
      setSubCategory(params)
      if(expanded?.some(a=>a===params?.id)) setExpanded(expanded?.filter(a=>a!==params?.id))
      else setExpanded(a=>[...a,params?.id])
    }else{
      if (typeof onClick==='function'&&!directlyClick) {
        if(Object.keys(subCategory).length) return onClick(state)
        return onClick(state)
      }
      else {
        setAppBar({appBarType:'',})
        router.push('/'+data?.id+'/'+params.id)
      }
    }
  }
  return (
    <div className='w-full h-full flex flex-col bg-neutral-100 containerMobile'>
      <ul className='list-none flex flex-col gap-4'>
        {
            withExpand?
            data?.children?.map(val=><li key={val.id}>
              <div className='w-full h-fit border-b border-neutral-400 font-semibold text-sm text-neutral-900 pb-4 flex flex-col'>
                <div className='w-full justify-between items-center flex' onClick={()=> handleClick(val,[val])}>
                  <span>{val?.value}</span>
                  {val?.children?.length?<span><IconComponent classname={'icon-black'} src={expanded.includes(val?.id)?'/icons/chevron-up.svg':'/icons/chevron-down.svg'} /></span>:''}
                </div>
                {
                  expanded.includes(val?.id)&&
                  <ul className='pl-4 flex flex-col gap-4 mt-4'>
                    {
                      val?.children?.map(item=><li key={item.id}>
                        <span onClick={()=>handleClick(item,[val,item])} className='w-full h-fit border-b border-neutral-400 font-semibold text-sm text-neutral-900 pb-4 flex flex-col'>
                          {item?.value}
                        </span>
                      </li>)
                    }
                  </ul>
                }
              </div>
            </li>)
            :data?.children?.map(val=><li key={val.id}>
                <span onClick={()=> handleClick(val)} className='w-full h-[26px] border-b border-neutral-400 font-semibold text-sm text-neutral-900 pb-4 flex'>{val.value}</span>
            </li>)
        }
        {
          !data?.children?.length&&<DataNotFound title='Category kosong' />
        }
      </ul>
    </div>
  )
}

export default ScreenCategories
