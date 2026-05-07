// @ts-nocheck
import * as React from "react"

export interface ToastProps {
  title?: string
  className?: string
  children?: React.ReactNode
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, children, title, ...props }, ref) => {
    return (
      <div ref={ref} className={className} role="alert" style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 14px", borderRadius: "5px", background: "#eff6ff", border: "1px solid #bfdbfe", fontFamily: "Avenir Next LT Pro" }} {...props}>
      <span style={{ fontSize: "14px", color: "#1e40af", flexShrink: 0, marginTop: "1px" }}>ℹ</span>
      <div>
        {title && <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e40af", marginBottom: "2px" }}>{title}</div>}
        <div style={{ fontSize: "12px", color: "#1e40af", opacity: 0.8 }}>{children}</div>
      </div>
    </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast }
export default Toast