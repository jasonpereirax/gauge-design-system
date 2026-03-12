// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps {
  tipo?: "Pri Default" | "Pri Hover" | "Pri Focused" | "Pri Disabled" | "Sec Default" | "Sec Hover" | "Sec Focused" | "Sec Disabled" | "Ter Hover" | "Ter Focused" | "Ter Disabled" | "Ter Default" | "Text btn Default" | "Text btn Hover" | "Text btn Focused" | "Text btn Disabled";
  className?: string;
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLDivElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[471px] h-[240px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Button.displayName = "Button"

export { Button }
export default Button