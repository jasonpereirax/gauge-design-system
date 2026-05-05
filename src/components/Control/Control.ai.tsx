// @ts-nocheck
import * as React from "react"

export interface ControlProps {
  state?: "Default" | "Disabled"
  size?: "Small" | "Large"
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Control = React.forwardRef<HTMLDivElement, ControlProps>(
  ({ state = "Default", size = "Small", className, children, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "5px", background: "#e8e8e8", border: "1px solid #e4e4e7", fontFamily: "system-ui", fontSize: "14px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Control"}
    </div>
    )
  }
)
Control.displayName = "Control"

export { Control }
export default Control