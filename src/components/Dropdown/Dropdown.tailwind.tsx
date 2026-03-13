// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[2893px] h-[365px]", {
  variants: {
    state: {
      open: "",
      error: "",
      disabled: "",
      hover: "",
      default: "",
      filled: "",
    },
  },
  defaultVariants: {
  },
})


export interface DropdownProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Dropdown({ className, children, ...props }: DropdownProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Dropdown