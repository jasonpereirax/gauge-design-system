// @ts-nocheck
import * as React from "react"

export interface AccordionProps {
  title?: string
  defaultOpen?: boolean
  className?: string
  children?: React.ReactNode
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ defaultOpen = false, title = "Accordion", className, children, title, state, ...props }, ref) => {
    const [open, setOpen] = React.useState(defaultOpen);
    return (
      <div ref={ref} className={className} style={{ border: "1px solid #e4e4e7", borderRadius: "5px", overflow: "hidden", fontFamily: "Avenir Next LT Pro" }} {...props}>
      <button type="button" onClick={() => setOpen(!open)} style={{ width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", border: "none", background: "#fff", textAlign: "left" }}>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#18181b" }}>{title}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && <div style={{ padding: "12px 16px", background: "#fafafa", borderTop: "1px solid #e4e4e7", fontSize: "13px", color: "#71717a", lineHeight: "1.5" }}>{children}</div>}
    </div>
    );
  }
)
Accordion.displayName = "Accordion"

export { Accordion }
export default Accordion