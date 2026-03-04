// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface Frame2Props {
  property 1?: "Default" | "Variant2";
  className?: string;
  children?: React.ReactNode
}

const Frame2 = React.forwardRef<HTMLDivElement, Frame2Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[118px] h-[138px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Frame2.displayName = "Frame2"

export { Frame2 }
export default Frame2