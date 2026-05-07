// @ts-nocheck
import * as React from "react"

export interface HeaderProps {
  device?: "Desktop" | "Mobile"
  className?: string
  children?: React.ReactNode
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ device = "Desktop", className, children, device, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "189px", padding: "189px 283.5px", borderRadius: "5px", background: "#ffffff", border: "1px solid #e4e4e7", fontFamily: "Avenir Next LT Pro", fontSize: "16px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Header"}
    </div>
    );
  }
)
Header.displayName = "Header"

export { Header }
export default Header