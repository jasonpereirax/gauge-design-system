// @ts-nocheck
import * as React from "react"

export interface ButtonProps {
  tipo?: "Pri Default" | "Pri Hover" | "Pri Focused" | "Pri Disabled" | "Sec Default" | "Sec Hover" | "Sec Focused" | "Sec Disabled" | "Ter Hover" | "Ter Focused" | "Ter Disabled" | "Ter Default" | "Text btn Default" | "Text btn Hover" | "Text btn Focused" | "Text btn Disabled"
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Button = React.forwardRef<HTMLDivElement, ButtonProps>(
  ({ tipo = "Pri Default", className, children, onClick, ...props }, ref) => {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "8px 16px",
    borderRadius: "5px",
    fontFamily: "Avenir Next LT Pro",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    background: "#9747ff",
    color: "#ffffff",
    border: "none"
  }

    let styles: React.CSSProperties = baseStyle
    if (tipo === "Pri Default") styles = { ...baseStyle, background: "#9747ff", color: "#ffffff", border: "none" }
    if (tipo === "Pri Hover") styles = { ...baseStyle, background: "transparent", color: "#9747ff", border: "1px solid #9747ff" }
    if (tipo === "Pri Focused") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Pri Disabled") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Sec Default") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Sec Hover") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Sec Focused") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Sec Disabled") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Ter Hover") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Ter Focused") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Ter Disabled") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Ter Default") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Text btn Default") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Text btn Hover") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Text btn Focused") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    if (tipo === "Text btn Disabled") styles = { ...baseStyle, background: "#f4f4f5", color: "#18181b", border: "none" }
    return (
      <button
      ref={ref}
      onClick={onClick}
      className={className}
      style={styles}
      {...props}
    >
      {children ?? "Button"}
    </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
export default Button