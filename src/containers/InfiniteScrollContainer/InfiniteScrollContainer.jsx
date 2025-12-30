import React, { useState, useRef, useEffect, useCallback } from "react"

const InfiniteScrollContainer = ({ children, setPageChange = () => {}, className = "", loader, currentPage = 0 }) => {
  const [page, setPage] = useState(currentPage)
  const observer = useRef(null)

  useEffect(() => {
    if(typeof currentPage==='number') setPage(currentPage)
  }, [currentPage])

  useEffect(() => {
    if(page) setPageChange(page)
  }, [page])

  const lastItemRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    []
  )

  return (
    <div className={`h-full ${className}`}>
      {children}
      {children && <span ref={lastItemRef} />}
      {loader}
    </div>
  )
}

export default InfiniteScrollContainer
