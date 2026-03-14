// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[2187px] h-[373px]", {
  variants: {
    type: {
      simply: "",
      textarea: "",
    },
    state: {
      default: "",
      error: "",
      focus: "",
      disabled: "",
      filled: "",
    },
  },
  defaultVariants: {
  },
})


export interface InputProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Input({ className, children, ...props }: InputProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Input