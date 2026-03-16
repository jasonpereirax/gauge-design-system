// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps {
  state?: "Default" | "Disabled" | "Selected" | "Error";
  size?: "Large" | "Small";
  className?: string;
  children?: React.ReactNode
}

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[341px] h-[116px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
export default Checkbox