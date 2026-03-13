// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface DropdownProps {
  state?: "open" | "Error" | "Disabled" | "Hover" | "Default" | "Filled";
  className?: string;
  children?: React.ReactNode
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[2893px] h-[365px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Dropdown.displayName = "Dropdown"

export { Dropdown }
export default Dropdown