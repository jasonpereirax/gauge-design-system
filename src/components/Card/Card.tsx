// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps {
  type?: "Select" | "Content" | "Review";
  className?: string;
  children?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[620px] h-[543px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

export { Card }
export default Card