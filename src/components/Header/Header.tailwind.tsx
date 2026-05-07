// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[1320px] h-[211px]", {
  variants: {
    device: {
      desktop: "",
      mobile: "",
    },
  },
  defaultVariants: {
  },
})


export interface HeaderProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Header({ className, children, ...props }: HeaderProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Header