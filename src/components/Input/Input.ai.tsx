// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps {
  type?: "Simply" | "Text area";
  state?: "Default" | "Error" | "Focus" | "Disabled" | "Filled";
  className?: string;
  children?: React.ReactNode
}

const Input = React.forwardRef<HTMLDivElement, InputProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[2187px] h-[373px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
export default Input