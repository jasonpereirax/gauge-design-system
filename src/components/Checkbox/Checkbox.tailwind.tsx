// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[341px] h-[116px]", {
  variants: {
    state: {
      default: "",
      disabled: "",
      selected: "",
      error: "",
    },
    size: {
      large: "",
      small: "",
    },
  },
  defaultVariants: {
  },
})


export interface CheckboxProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Checkbox