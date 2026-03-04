// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[118px] h-[138px]", {
  variants: {
    property 1: {
      default: "",
      variant2: "",
    },
  },
  defaultVariants: {
  },
})


export interface Frame2Props extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Frame2({ className, children, ...props }: Frame2Props) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Frame2