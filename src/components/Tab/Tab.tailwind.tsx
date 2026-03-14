// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[158px] h-[75px]", {
  variants: {
    state: {
      selected: "",
      default: "",
    },
  },
  defaultVariants: {
  },
})


export interface TabProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Tab({ className, children, ...props }: TabProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Tab