// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[173px] h-[64px]", {
  variants: {
    state: {
      active: "",
      default: "",
    },
  },
  defaultVariants: {
  },
})


export interface Component1Props extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Component1({ className, children, ...props }: Component1Props) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Component1