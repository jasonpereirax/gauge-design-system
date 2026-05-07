// @ts-nocheck
import * as React from "react"

export interface TabProps {
  state?: "Selected" | "Default"
  className?: string
  children?: React.ReactNode
}

const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  ({ state = "Selected", className, children, state, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "20px", padding: "20px 30px", borderRadius: "5px", background: "#ffffff", border: "1px solid #e4e4e7", fontFamily: "Avenir Next", fontSize: "16px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Tab"}
    </div>
    );
  }
)
Tab.displayName = "Tab"

export { Tab }
export default Tab