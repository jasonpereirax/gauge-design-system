// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[118px] h-[138px]", {
  variants: {
    state: {
      default: "",
      disabled: "",
    },
  },
  defaultVariants: {
  },
})


export interface Frame1Props extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Frame1({ className, children, ...props }: Frame1Props) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Frame1