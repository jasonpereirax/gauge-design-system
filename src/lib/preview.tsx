/* eslint-disable */
// @ts-nocheck
import { useState } from "react"

export function ComponentPreview({ htmlCode, cssCode, svgCode, width, height }) {
  const [bg, setBg] = useState("checker")
  const [zoom, setZoom] = useState(1)
  const checker = {
    backgroundImage: [
      "linear-gradient(45deg,#e5e7eb 25%,transparent 25%)",
      "linear-gradient(-45deg,#e5e7eb 25%,transparent 25%)",
      "linear-gradient(45deg,transparent 75%,#e5e7eb 75%)",
      "linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)"
    ].join(","),
    backgroundSize: "16px 16px",
    backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
    backgroundColor: "#f9fafb"
  }
  const bgMap = {
    white: { background: "#ffffff" },
    checker: checker,
    dark: { background: "#09090b" }
  }
  const visual = (htmlCode && htmlCode.includes("<svg")) ? htmlCode : svgCode ? svgCode : (htmlCode || "")
  const baseCSS = [
    "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}",
    "html,body{width:100%;height:100%}",
    "body{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:32px;font-family:system-ui,sans-serif;background:transparent}"
  ].join("")
  const h = Math.max(height * zoom + 96, 200)
  // Build srcdoc via DOM serialization to avoid any quote issues
  function buildDoc() {
    return (
      "<!DOCTYPE html><html><head>" +
      "<meta charset=UTF-8>" +
      "<style>" + baseCSS + (cssCode || "") + "</style>" +
      "</head><body>" +
      visual +
      "</body></html>"
    )
  }
  return (
    <div className="rounded-xl border overflow-hidden bg-background">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b bg-muted/20">
        <span className="text-xs text-muted-foreground">Fundo</span>
        {["white", "checker", "dark"].map(b => (
          <button key={b} onClick={() => setBg(b)}
            className={"w-5 h-5 rounded border-2 mr-1 " + (bg === b ? "border-blue-500 scale-110" : "border-muted-foreground/20")}
            style={bgMap[b]} />
        ))}
        <span className="mx-1 text-muted-foreground/40">|</span>
        {[0.5, 1, 1.5, 2].map(z => (
          <button key={z} onClick={() => setZoom(z)}
            className={"text-xs px-2 py-0.5 rounded " + (zoom === z ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:bg-muted")}>
            {z + "x"}
          </button>
        ))}
        <span className="ml-auto text-xs font-mono text-muted-foreground">{width}x{height}px</span>
      </div>
      <div style={{ minHeight: h + "px", ...bgMap[bg] }}>
        <iframe
          key={zoom + "-" + bg}
          srcDoc={buildDoc()}
          className="w-full border-0 block"
          style={{ height: h + "px" }}
          sandbox="allow-scripts"
          title="Preview"
        />
      </div>
    </div>
  )
}