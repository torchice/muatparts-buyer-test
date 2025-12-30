import { authZustand } from '@/store/auth/authZustand'
import { userZustand } from '@/store/auth/userZustand'
import React from 'react'

function ProtectComponent(Component) {
  return props=>{
    const {accessToken,refreshToken,clearToken}=authZustand()
    const user = userZustand()
    const isLogin = !!(accessToken&&user?.id)
    if(!isLogin) {
      // list bug mandiri multibahasa
      localStorage.removeItem('t-ash')
      localStorage.removeItem('t-l')
      localStorage.removeItem('t-ng')
    }
    return <Component {...props} accessToken={accessToken}
    refreshToken={refreshToken} user={user} isLogin={isLogin}/>
  }
}

export default ProtectComponent
