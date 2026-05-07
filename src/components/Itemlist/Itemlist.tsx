// @ts-nocheck
import * as React from "react"

export interface ItemlistProps {
  state?: "default" | "focus"
  className?: string
  children?: React.ReactNode
}

const Itemlist = React.forwardRef<HTMLDivElement, ItemlistProps>(
  ({ state = "default", className, children, state, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "10px 15px", borderRadius: "5px", background: "#0b1641", border: "1px solid #e4e4e7", fontFamily: "Avenir Next", fontSize: "14px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Item list"}
    </div>
    );
  }
)
Itemlist.displayName = "Itemlist"

export { Itemlist }
export default Itemlist