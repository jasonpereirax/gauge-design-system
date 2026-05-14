// @ts-nocheck
import * as React from "react"

export interface BusinessRulesProps {
  className?: string
  children?: React.ReactNode
}

const BusinessRules = React.forwardRef<HTMLDivElement, BusinessRulesProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderRadius: "4px", background: "#d9d9d9", border: "1px solid #e4e4e7", fontFamily: "Avenir Next LT Pro", fontSize: "12px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Business Rules"}
    </div>
    );
  }
)
BusinessRules.displayName = "BusinessRules"

export { BusinessRules }
export default BusinessRules