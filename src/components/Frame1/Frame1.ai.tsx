// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface Frame1Props {
  state?: "Default" | "Disabled";
  className?: string;
  children?: React.ReactNode
}

const Frame1 = React.forwardRef<HTMLDivElement, Frame1Props>(
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
Frame1.displayName = "Frame1"

export { Frame1 }
export default Frame1