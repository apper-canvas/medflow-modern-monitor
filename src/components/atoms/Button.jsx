import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-[1.02] active:scale-[0.98]",
    success: "bg-green-500 text-white hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98]",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 hover:scale-[1.02] active:scale-[0.98]",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98]"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-2.5",
    lg: "px-8 py-3 text-lg"
  }

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button