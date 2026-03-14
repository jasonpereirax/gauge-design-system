// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TabProps {
  state?: "Selected" | "Default";
  className?: string;
  children?: React.ReactNode
}

const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[158px] h-[75px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Tab.displayName = "Tab"

export { Tab }
export default Tab