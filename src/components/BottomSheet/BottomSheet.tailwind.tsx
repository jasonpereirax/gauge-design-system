import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[1866px] h-[803px]", {
  variants: {
    type: {
      title: "",
      titledescription: "",
      smalltittle: "",
    },
    version: {
      light: "",
      dark: "",
    },
  },
  defaultVariants: {
  },
})


export interface BottomSheetProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function BottomSheet({ className, children, ...props }: BottomSheetProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default BottomSheet