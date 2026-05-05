// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const baseClasses = "inline-flex items-center justify-center w-[429px] h-[24px]"

export interface BreadchumbProps {
  className?: string
  children?: React.ReactNode
}

export function Breadchumb({ className, children, ...props }: BreadchumbProps) {
  return (
    <div className={cn(baseClasses, className)}>
      {children}
    </div>
  )
}

export default Breadchumb