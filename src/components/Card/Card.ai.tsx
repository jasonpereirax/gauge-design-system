// @ts-nocheck
import * as React from "react"

export interface CardProps {
  title?: string
  description?: string
  image?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, title, description, image, typeVariant, ...props }, ref) => {
    return (
      <div ref={ref} className={className}
      style={{ borderRadius: "5px", border: "1px solid #e4e4e7", overflow: "hidden", fontFamily: "Avenir Next", background: "#fff" }}
      {...props}
    >
      {image && <div style={{ height: "120px", background: "#9747ff" }}>{image}</div>}
      <div style={{ padding: "16px" }}>
        {title && <div style={{ fontSize: "16px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>{title}</div>}
        {description && <p style={{ fontSize: "12px", color: "#71717a", margin: "0 0 12px", lineHeight: "1.5" }}>{description}</p>}
        {children}
      </div>
    </div>
    );
  }
)
Card.displayName = "Card"

export { Card }
export default Card