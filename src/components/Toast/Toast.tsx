// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  state?: "Alert" | "Error" | "Sucess";
  className?: string;
  children?: React.ReactNode
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[320px] h-[336px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast }
export default Toast