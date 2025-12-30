// 24. THP 2 - MOD001 - MP - 020 - QC Plan - Web - MuatParts - Profil Seller Sisi Buyer - LB - 0051
import React, { useRef, useCallback } from "react"

const InfiniteScroll = ({ 
  children,
  isLoading,
  onScrollToBottom = () => {}, // New custom callback function
  hasMore = false, // New prop to indicate if all data is loaded
}) => {
    const observer = useRef(null)

    const lastItemRef = useCallback(
        (node) => {
            // Disconnect the previous observer if it exists
            if (observer.current) observer.current.disconnect()

            // Don't set up a new observer if all data is loaded
            if (!hasMore || isLoading) return

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    // Call the custom callback function
                    console.log("loadmore")
                    onScrollToBottom()
                }
            })

            if (node) observer.current.observe(node)
        },
        [hasMore, isLoading] // Add dependencies
    )

    return (
        <div>
            {children}
            {children && hasMore && <span ref={lastItemRef} />}
        </div>
    )
}

export default InfiniteScroll