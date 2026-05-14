// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded shadow-md w-[2400px] h-[916px]", {
  variants: {
    tipo: {
      primary: "",
      secondary: "",
      tertiary: "",
      text: "",
      danger: "",
      ghost: "",
    },
    state: {
      default: "",
      hover: "",
      focused: "",
      disabled: "",
    },
    size: {
      large: "",
      medium: "",
      small: "",
    },
    icon: {
      none: "",
      left: "",
      right: "",
      only: "",
    },
  },
  defaultVariants: {
  },
})


export interface Button2Props extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Button2({ className, children, ...props }: Button2Props) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Button2