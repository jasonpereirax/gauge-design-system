// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const baseClasses = "inline-flex items-center justify-center rounded w-[200px] h-[245px]"

export interface BusinessRulesProps {
  className?: string
  children?: React.ReactNode
}

export function BusinessRules({ className, children, ...props }: BusinessRulesProps) {
  return (
    <div className={cn(baseClasses, className)}>
      {children}
    </div>
  )
}

export default BusinessRules