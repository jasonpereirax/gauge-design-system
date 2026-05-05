// @ts-nocheck
import * as React from "react"

export interface DropdownProps {
  state?: "open" | "Error" | "Disabled" | "Hover" | "Default" | "Filled"
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ state = "open", className, children, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "150px", padding: "150px 225px", borderRadius: "5px", background: "#0b1641", border: "1px solid #e4e4e7", fontFamily: "Avenir Next LT Pro", fontSize: "16px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Dropdown"}
    </div>
    )
  }
)
Dropdown.displayName = "Dropdown"

export { Dropdown }
export default Dropdown