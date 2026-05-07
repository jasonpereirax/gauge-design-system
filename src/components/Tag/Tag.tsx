// @ts-nocheck
import * as React from "react"

export interface TagProps {
  typeVariant?: "Default" | "Icon"
  sizeVariant?: "Large" | "Small"
  className?: string
  children?: React.ReactNode
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ typeVariant = "Default", sizeVariant = "Large", className, children, typeVariant, sizeVariant, ...props }, ref) => {
    return (
      <span
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: "5px", background: "#9747ff", color: "#ffffff", fontSize: "11px", fontWeight: 600, fontFamily: "Avenir Next LT Pro" }}
      {...props}
    >
      {children ?? "Tag"}
    </span>
    );
  }
)
Tag.displayName = "Tag"

export { Tag }
export default Tag