// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[320px] h-[336px]", {
  variants: {
    state: {
      alert: "",
      error: "",
      sucess: "",
    },
  },
  defaultVariants: {
  },
})


export interface ToastProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Toast({ className, children, ...props }: ToastProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Toast