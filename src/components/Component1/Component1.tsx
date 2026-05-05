// @ts-nocheck
import * as React from "react"

export interface Component1Props {
  state?: "Active" | "Default"
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Component1 = React.forwardRef<HTMLDivElement, Component1Props>(
  ({ state = "Active", className, children, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "5px", background: "#0b1641", border: "1px solid #e4e4e7", fontFamily: "Avenir Next LT Pro", fontSize: "12px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Component 1"}
    </div>
    )
  }
)
Component1.displayName = "Component1"

export { Component1 }
export default Component1