// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[138px] h-[141px]", {
  variants: {
    state: {
      default: "",
      disabled: "",
    },
    size: {
      small: "",
      large: "",
    },
  },
  defaultVariants: {
  },
})


export interface ControlProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Control({ className, children, ...props }: ControlProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Control