import React from "react"
import { cn } from "@/utils/cn"

const Badge = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    admitted: "bg-green-100 text-green-800",
    discharged: "bg-gray-100 text-gray-800",
    emergency: "bg-red-100 text-red-800",
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    available: "bg-green-100 text-green-800",
    occupied: "bg-yellow-100 text-yellow-800"
  }

  return (
    <span
      ref={ref}
      className={cn("status-badge", variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge