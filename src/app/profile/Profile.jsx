
'use client'
import { viewport } from '@/store/viewport'
import React, { useState } from 'react'
import ProfileResponsive from './ProfileResponsive'
import ProfileWeb from './ProfileWeb'
import SWRHandler from '@/services/useSWRHook'

function Profile() {
  const [state,setState]=useState()
  const {useSWRHook,useSWRMutateHook}=SWRHandler()
  const {isMobile} = viewport()
  if(typeof isMobile!=='boolean') return <></> //buat skeleton
  if(isMobile) return <ProfileResponsive/>
  return <ProfileWeb/>
}

export default Profile
  