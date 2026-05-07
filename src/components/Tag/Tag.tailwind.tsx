// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[182px] h-[254px]", {
  variants: {
    type: {
      default: "",
      icon: "",
    },
    size: {
      large: "",
      small: "",
    },
  },
  defaultVariants: {
  },
})


export interface TagProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Tag({ className, children, ...props }: TagProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Tag