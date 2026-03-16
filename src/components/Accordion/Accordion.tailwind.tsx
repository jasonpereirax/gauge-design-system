// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[574px] h-[275px]", {
  variants: {
    state: {
      default: "",
      open: "",
    },
  },
  defaultVariants: {
  },
})


export interface AccordionProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Accordion({ className, children, ...props }: AccordionProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Accordion