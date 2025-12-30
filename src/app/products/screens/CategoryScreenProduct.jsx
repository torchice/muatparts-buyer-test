import { useHeader } from '@/common/ResponsiveContext'
import ButtonBottomMobile from '@/components/ButtonBottomMobile/ButtonBottomMobile'
import Checkbox from '@/components/Checkbox/Checkbox'
import IconComponent from '@/components/IconComponent/IconComponent'
import React, { memo, useState } from 'react'
function CategoryScreenProduct({categories,getFilterProduct,setFilter,handleInput,search,setSearch}) {
  const constanta = ['groupCategory','categories','subCategories','items']
  const {setScreen}=useHeader()
  const [state,setState] = useState({
    subcategoryID:[],
    itemID:[]
  })
  function handleInputState(field,value) {
    setFilter(a=>({...a,[field]:value}))
  }
  const [getSelected,setSelected] = useState([])
  const [getExpand,setExpand] = useState([])
  function handleExpand(val) {
    if(getExpand?.includes(val)) setExpand(getExpand?.filter(a=>a!==val))
    else setExpand(a=>[...a,val])
  }
  function handleCheck(val) {
    if(getSelected?.some(a=>a===val?.id)){
      if(val?.children?.length){
        let children = val?.children
        let newArr = getSelected?.map(select=>{
          if(!children?.includes(select)) return select
          return null
        })?.filter(a=>a!==null)
        setSelected(newArr)
        handleInputState('subcategoryID',getFilterProduct?.['subcategoryID']?.filter(a=>a!=val?.id))
        handleInputState('itemID',newArr?.filter(a=>a!=val?.id))
      }else {
        handleInputState('subcategoryID',getFilterProduct?.['subcategoryID']?.filter(a=>a!=val?.id))
        setSelected(getSelected?.filter(a=>a!==val?.id))
      }
    }else{
      if(val?.children?.length){
        let children = val?.children
        let newArr = getSelected?.map(select=>{
          if(children?.includes(select)) return null
          return select
        })?.filter(a=>a!==null)
        setSelected(newArr.length?newArr:[val?.id,...children?.map(a=>a?.id)])
        handleInputState('subcategoryID',[...getFilterProduct?.['subcategoryID'],val?.id])
        handleInputState('itemID',newArr?.filter(a=>a!=val?.id))
      }else {
        handleInputState('subcategoryID',[...getFilterProduct?.['subcategoryID'],val?.id])
        setSelected(a=>[...a,val?.id])
      }
    }
  }
  return (
    <div className='containerMobile pb-[80px] flex flex-col gap-3'>
        {
          categories.map((val,i)=>{
            return <div className='flex flex-col gap-3 h-auto' key={i}>
              <div className='flex justify-between items-center'>
                <div className='flex gap-3'>
                  {val?.children?.length?<span onClick={()=>handleExpand(val?.id)}><IconComponent src={getExpand?.some(a=>a===val?.id)?'/icons/chevron-up.svg':'/icons/chevron-down.svg'} width={24} height={24} /></span>:<span className='w-6 h-6'></span>}
                  <span className='semi-sm w-fit'>{val.value}</span>
                </div>
                <Checkbox checked={getSelected.some(a=>a===val.id)} onChange={()=>handleCheck(val)} label='' />
              </div>
              {
                getExpand?.some(a=>a===val?.id)&&
                <>
                {
                  val?.children?.map(ch=>{
                    return (
                      <div className='flex justify-between items-center ml-5' key={ch.id}>
                        <div className='flex gap-3'>
                          {ch?.children?.length?<span onClick={()=>handleExpand(ch?.id)}><IconComponent src={'/icons/chevron-down.svg'} width={24} height={24} /></span>:<span className='w-6 h-6'></span>}
                          <span className='semi-sm w-fit'>{ch.value}</span>
                        </div>
                        <Checkbox checked={getSelected.some(a=>a===ch.id)} onChange={()=>handleCheck(val)} label='' />
                      </div>
                    )
                  })
                }
                </>
                
              }
            </div>
          })
        }
        <ButtonBottomMobile textLeft={'Reset'} textRight={'Terapkan'} onClickLeft={()=>setState([])} onClickRight={()=>{
          handleInputState('subcategoryID',state?.subcategoryID)
          handleInputState('itemID',state?.itemID)
          setScreen('filter')
        }} />
    </div>
  )
}

export default CategoryScreenProduct

