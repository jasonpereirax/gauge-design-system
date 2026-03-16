// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface AccordionProps {
  state?: "Default" | "Open";
  className?: string;
  children?: React.ReactNode
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[574px] h-[275px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Accordion.displayName = "Accordion"

export { Accordion }
export default Accordion