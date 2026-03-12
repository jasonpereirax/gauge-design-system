// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[620px] h-[543px]", {
  variants: {
    type: {
      select: "",
      content: "",
      review: "",
    },
  },
  defaultVariants: {
  },
})


export interface CardProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Card