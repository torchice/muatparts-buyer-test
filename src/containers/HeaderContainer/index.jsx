import { viewport } from '@/store/viewport'
import React, { useEffect } from 'react'
import HeaderContainerMobile from './HeaderContainerMobile'
import HeaderContainerWeb from './HeaderContainerWeb'
import SWRHandler from '@/services/useSWRHook'
import ProtectComponent from '@/common/ProtectComponent'
import { userLocationZustan } from '@/store/manageLocation/managementLocationZustand'
import { sortMainAddressOnTop } from '@/libs/services'

function HeaderContainer({
    renderAppBarMobile,
    renderAppBar,
    type,
    ...prop
}) {
    const {isLogin}=prop
    const {isMobile} = viewport()
    const {useSWRHook}=SWRHandler()
    const {data}=useSWRHook(isLogin?`v1/muatparts/profile/location`:null)
    const {setLocation,locations}=userLocationZustan()
    const manlok = userLocationZustan()
    useEffect(()=>{
        if(data?.Data?.length) setLocation(sortMainAddressOnTop(data?.Data))
    },[data])
    useEffect(()=>{
        if((!manlok?.selectedLocation?.ID&&isLogin)||(manlok?.selectedLocation?.ID&&isLogin)){
            let isMain = data?.Data?.some(a=>a?.IsMainAddress==1)?data?.Data?.find(a=>a?.IsMainAddress==1):{}
            manlok?.setSelectedLocation(isMain)
        }
        if((manlok?.selectedLocation?.ID&&!isLogin)||(!manlok?.selectedLocation?.ID&&!isLogin)){
            manlok?.setSelectedLocation({})
        }
    },[data])
    if(typeof isMobile!=='boolean') return <HeaderPlaceholder/>
    if(isMobile) return <HeaderContainerMobile location={locations} isLogin={isLogin} renderAppBarMobile={renderAppBarMobile} type={type} />
    return <HeaderContainerWeb renderAppBar={renderAppBar} location={locations} />
}

export default ProtectComponent(HeaderContainer)

function HeaderPlaceholder(){
    return <div className='fixed inset-0 h-[70px] w-full flex p-2'>
        <div className='h-10 w-full animate-pulse'></div>
    </div>
}
