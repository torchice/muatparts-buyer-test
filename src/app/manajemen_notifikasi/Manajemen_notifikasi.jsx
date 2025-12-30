
'use client'
import { viewport } from '@/store/viewport'
import React, { useState } from 'react'
import Manajemen_notifikasiResponsive from './Manajemen_notifikasiResponsive'
import Manajemen_notifikasiWeb from './Manajemen_notifikasiWeb'
import SWRHandler from '@/services/useSWRHook'

function Manajemen_notifikasi() {
  const [state,setState]=useState()
  const {useSWRHook,useSWRMutateHook}=SWRHandler()
  const {isMobile} = viewport()
  if(typeof isMobile!=='boolean') return <></> //buat skeleton
  if(isMobile) return <Manajemen_notifikasiResponsive/>
  return <Manajemen_notifikasiWeb/>
}

export default Manajemen_notifikasi
  