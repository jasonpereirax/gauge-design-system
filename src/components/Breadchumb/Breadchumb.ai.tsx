// @ts-nocheck
import * as React from "react"

export interface BreadchumbProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Breadchumb = React.forwardRef<HTMLDivElement, BreadchumbProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "6px", background: "#d9d9d9", border: "1px solid #e4e4e7", fontFamily: "Avenir Next LT Pro", fontSize: "12px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Breadchumb"}
    </div>
    )
  }
)
Breadchumb.displayName = "Breadchumb"

export { Breadchumb }
export default Breadchumb