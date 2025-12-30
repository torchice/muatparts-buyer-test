"use client"
import React, { startTransition, useCallback, useEffect, useMemo, useState } from "react"
import ResponsiveProvider from "./ResponsiveContext"
import { viewport } from "@/store/viewport"
import { headerProps } from "@/containers/HeaderContainer/headerProps"
import SWRHandler from "@/services/useSWRHook"
import { categoriesZustand } from "@/store/products/categoriesZustand"
import { notFound, useSearchParams,useParams,usePathname } from "next/navigation"
import { authZustand } from "@/store/auth/authZustand"
import { userZustand } from "@/store/auth/userZustand"
import Bottomsheet from "@/components/Bottomsheet/Bottomsheet"
import Modal from "@/components/AI/Modal"
import { useCustomRouter } from "@/libs/CustomRoute"
import { filterProduct } from "@/store/products/filter"
function App({ children }) {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const params = useParams()
  const router = useCustomRouter()
  const { headerHeight } = headerProps()

  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0283
  const [getTmpToken,setTmpToken]=useState({accessToken:'',
    refreshToken:''})
  // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0288
  const [isReady, setIsReady] = useState(false)

  const { setIsmobile, setWidthScreen } = viewport()
  
  const { setUser, setUserBy, photo, id,removeUser } = userZustand()
  const { setCategories, categories } = categoriesZustand()
  const { accessToken, refreshToken, setToken, clearToken } = authZustand()
  const {resetFilter}=filterProduct()
  const { useSWRHook, useSWRMutateHook } = SWRHandler()

  const searchAccessToken = searchParams.get("accessToken")
  const searchRefreshToken = searchParams.get("refreshToken")

  const currentParams = useMemo(() => {
    return params?.routes?.length && searchAccessToken
      ? params.routes.toString().replaceAll(",", "/")
      : ""
  }, [params, searchAccessToken])

  useEffect(() => {
    if (searchAccessToken && searchRefreshToken) {
      setTmpToken({ accessToken: searchAccessToken, refreshToken: searchRefreshToken })
    // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0288
    } else if (accessToken & refreshToken){
      setIsReady(true)
    } else {
      setIsReady(true)
    }
  }, [searchAccessToken, searchRefreshToken, accessToken, refreshToken])
  
  const { data: auth } = useSWRHook(
    getTmpToken.accessToken ? "v1/muatparts/auth/credential-check" : null,
    null,
    null,
    {
      headers: {
        Authorization: `Bearer ${getTmpToken.accessToken}`,
        refreshtoken: getTmpToken.refreshToken,
      },
    }
  )

  const { data } = useSWRHook(!categories?.length ? "v1/muatparts/product_category_list" : null)
  const { trigger: user_data_trigger } = useSWRMutateHook(
    process.env.NEXT_PUBLIC_GLOBAL_API + "v1/user/getUserStatusV3"
  )

  useEffect(() => {
    if (auth?.Data) {
      const { accessToken: newAccessToken, refreshtoken: newRefreshToken, ...userData } = auth.Data
      if (newAccessToken && newRefreshToken) {
        setToken({ accessToken: newAccessToken, refreshToken: newRefreshToken })
        setUser(userData)
        // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0288
        setIsReady(true)
        if (searchAccessToken && searchRefreshToken) {
          const updatedParams = new URLSearchParams(searchParams.toString())
          updatedParams.delete("accessToken")
          updatedParams.delete("refreshToken")
          router.replace(`${pathName}?${updatedParams.toString()}`)
        }
      }
    }
  }, [auth])
  

  useEffect(() => {
    if (id && !photo) {
      user_data_trigger().then((res) => {
        if (res?.data?.Data?.Avatar) {
          setUserBy("photo", res.data.Data.Avatar)
        }
      })
    }
  }, [id])

  useEffect(() => {
    if (data?.Data?.length && !categories?.length) {
      setCategories(data.Data)
    }
  }, [data])

  // const handleResize = useCallback(() => {
  //   if (typeof window !== "undefined") {
  //     // const width = pathName.includes("/garasi") ? window.screen.width : window.innerWidth
  //     const width = window.innerWidth

  //     setWidthScreen(width)
  //     setIsmobile(width < 500)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (!navigator.onLine) notFound()

  //   window.addEventListener("resize", handleResize)
  //   handleResize()
  //   return () => window.removeEventListener("resize", handleResize)
  // }, [handleResize])
  
 
  useEffect(() => {
    if (!id) {
      // list bug mandiri multibahasa
      localStorage.removeItem('t-ash')
      localStorage.removeItem('t-l')
      localStorage.removeItem('t-ng')
    }
  }, [id])
  // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0288
  if(!isReady) return null
  return (
    <>
      <Modal />
      <ResponsiveProvider>
        <Bottomsheet />
        <div
          style={{
            marginTop: `${headerHeight}px`,
            // height: `calc(100vh - ${headerHeight}px)`,
          }}
          className={`w-full bg-neutral-50 MainApp`}
        >
          {children}
        </div>

      </ResponsiveProvider>
    </>
  )
}

export default App
