// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[148px] h-[70px]", {
  variants: {
    state: {
      default: "",
      focus: "",
    },
  },
  defaultVariants: {
  },
})


export interface ItemlistProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Itemlist({ className, children, ...props }: ItemlistProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Itemlist