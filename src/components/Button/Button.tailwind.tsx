// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[471px] h-[240px]", {
  variants: {
    tipo: {
      pridefault: "",
      prihover: "",
      prifocused: "",
      pridisabled: "",
      secdefault: "",
      sechover: "",
      secfocused: "",
      secdisabled: "",
      terhover: "",
      terfocused: "",
      terdisabled: "",
      terdefault: "",
      textbtndefault: "",
      textbtnhover: "",
      textbtnfocused: "",
      textbtndisabled: "",
    },
  },
  defaultVariants: {
  },
})


export interface ButtonProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Button