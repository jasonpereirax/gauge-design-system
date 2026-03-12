/* eslint-disable */
// @ts-nocheck
import { useState, useRef, useEffect } from "react"
import Frame1 from "./components/Frame1/Frame1"
import Frame2 from "./components/Frame2/Frame2"

type Tokens = { colors: string[]; typography: any[]; borderRadius: string[]; shadows: string[]; spacing: string[] }

interface ComponentDocProps {
  name: string; description: string; figmaUrl: string
  width: number; height: number
  reactCode: string; tailwindCode: string; htmlCode: string; cssCode: string
  svgCode?: string; aiCode?: string; tokens: Tokens
}

type CodeTab = "preview" | "tailwind" | "react" | "html" | "ai"

function ComponentPreview({ htmlCode, cssCode, svgCode, width, height }) {
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
  const baseCSS = "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html,body{width:100%;height:100%}body{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:32px;font-family:system-ui,sans-serif;background:transparent}"
  const h = Math.max(height * zoom + 96, 200)
  const doc = "<!DOCTYPE html><html><head><meta charset=UTF-8><style>" + baseCSS + (cssCode || "") + "</style></head><body>" + visual + "</body></html>"
  return (
    <div style={{ border: "1px solid #e4e4e7", borderRadius: "12px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderBottom: "1px solid #e4e4e7", background: "#fafafa" }}>
        <span style={{ fontSize: "12px", color: "#888" }}>Fundo</span>
        {["white", "checker", "dark"].map(b => (
          <button key={b} onClick={() => setBg(b)}
            style={{ width: "18px", height: "18px", borderRadius: "50%", border: bg === b ? "2px solid #3b82f6" : "2px solid #e4e4e7", cursor: "pointer", ...(bgMap[b]) }} />
        ))}
        <span style={{ width: "1px", height: "16px", background: "#e4e4e7", margin: "0 4px" }} />
        <span style={{ fontSize: "12px", color: "#888" }}>Zoom</span>
        {[0.5, 1, 1.5, 2].map(z => (
          <button key={z} onClick={() => setZoom(z)}
            style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px", border: "none", cursor: "pointer", background: zoom === z ? "#18181b" : "transparent", color: zoom === z ? "#fff" : "#888" }}>
            {z + "x"}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "11px", color: "#aaa", fontFamily: "monospace" }}>{width}x{height}px</span>
      </div>
      <div style={{ minHeight: h + "px", ...bgMap[bg] }}>
        <iframe key={zoom + "-" + bg} srcDoc={doc} style={{ width: "100%", height: h + "px", border: "none", display: "block" }} sandbox="allow-scripts" title="Preview" />
      </div>
    </div>
  )
}
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  if (!code || !code.trim()) return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-400">
      Nenhum código disponível
    </div>
  )
  return (
    <div className="rounded-xl border border-zinc-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 bg-zinc-50">
        <span className="text-xs font-mono text-zinc-400">{language}</span>
        <button onClick={copy} className="text-xs text-zinc-500 hover:text-zinc-900 px-2 py-1 rounded hover:bg-zinc-100 transition-colors">
          {copied ? "✓ Copiado!" : "Copiar"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto max-h-[480px] bg-zinc-900 text-xs leading-relaxed">
        <code className="text-zinc-100 font-mono">{code}</code>
      </pre>
    </div>
  )
}
function ComponentDoc({ name, description, figmaUrl, width, height, reactCode, tailwindCode, htmlCode, cssCode, svgCode, aiCode, tokens }: ComponentDocProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>("preview")
  const tabs: { id: CodeTab; label: string; show: boolean }[] = [
    { id: "preview", label: "Preview", show: true },
    { id: "tailwind", label: "Tailwind", show: !!tailwindCode },
    { id: "react", label: "React", show: !!reactCode },
    { id: "html", label: "HTML", show: !!htmlCode },
    { id: "ai", label: "✨ AI", show: !!aiCode },
  ]
  return (
    <div className="space-y-6">
      <div className="border-b pb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
          {figmaUrl && (
            <a href={figmaUrl} target="_blank" rel="noopener noreferrer"
               className="shrink-0 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border rounded-md px-3 py-1.5 transition-colors">
              <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor"><path d="M6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/><path fillRule="evenodd" d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 0 4 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1-2-2V2zm2 8a2 2 0 0 0 2 2h2a2 2 0 0 0 0-4H4a2 2 0 0 0-2 2zm4-6a2 2 0 0 0 2 2V2H6v2zm0 4a2 2 0 0 0-2 2h2v-2zm0-4V2H2v2a2 2 0 0 0 2 2h2zm-4 4a2 2 0 0 0 2 2H4a2 2 0 0 0-2-2z"/></svg>
              Figma
            </a>
          )}
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="text-xs bg-muted px-2 py-1 rounded font-mono">{width}×{height}px</span>
          {tokens.borderRadius?.[0] && <span className="text-xs bg-muted px-2 py-1 rounded font-mono">r: {tokens.borderRadius[0]}</span>}
          {tokens.colors?.slice(0,5).map(c => (
            <span key={c} className="inline-flex items-center gap-1.5 text-xs bg-muted px-2 py-1 rounded font-mono">
              <span className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{background:c}} />
              {c}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="flex gap-1 border-b mb-4">
          {tabs.filter(t => t.show).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "preview" && <ComponentPreview htmlCode={htmlCode} cssCode={cssCode} svgCode={svgCode} width={width} height={height} />}
        {activeTab === "tailwind" && <CodeBlock code={tailwindCode} language="tsx" />}
        {activeTab === "react" && <CodeBlock code={reactCode} language="tsx" />}
        {activeTab === "html" && (
          <div className="space-y-4">
            <CodeBlock code={htmlCode} language="html" />
            {cssCode && <CodeBlock code={cssCode} language="css" />}
          </div>
        )}
        {activeTab === "ai" && <CodeBlock code={aiCode || ""} language="tsx (AI)" />}
      </div>
    </div>
  )
}

const navItems = [
  { id: "Frame1", label: "Frame 1" },
  { id: "Frame2", label: "Frame 2" }
]

const componentNames = navItems.map(i => i.id)

function InstallationPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Getting Started</h1>
        <p className="text-muted-foreground mt-2">Install and configure the design system in your project.</p>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Installation</h2>
        <p className="text-sm text-muted-foreground">Clone or install the package dependencies:</p>
        <div style={{borderRadius:"12px",border:"1px solid #e4e4e7",overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 16px",borderBottom:"1px solid #e4e4e7",background:"#fafafa"}}>
            <span style={{fontSize:"12px",fontFamily:"monospace",color:"#888"}}>bash</span>
          </div>
          <pre style={{background:"#0d1117",color:"#e6edf3",padding:"16px",margin:0,fontSize:"13px",overflowX:"auto",fontFamily:"monospace"}}>
            <code>npm install</code>
          </pre>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Usage</h2>
        <p className="text-sm text-muted-foreground">Import components directly from the design system:</p>
        <div style={{borderRadius:"12px",border:"1px solid #e4e4e7",overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 16px",borderBottom:"1px solid #e4e4e7",background:"#fafafa"}}>
            <span style={{fontSize:"12px",fontFamily:"monospace",color:"#888"}}>tsx</span>
          </div>
          <pre style={{background:"#0d1117",color:"#e6edf3",padding:"16px",margin:0,fontSize:"13px",overflowX:"auto",fontFamily:"monospace"}}>
            <code>{`import { ${componentNames.join(", ")} } from "@/components"`}</code>
          </pre>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Components ({componentNames.length})</h2>
        <div className="grid gap-2">
          {navItems.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
              <div className="w-2 h-2 rounded-full bg-foreground/40 shrink-0" />
              <span className="text-sm font-mono font-medium">{item.id}</span>
              <span className="text-sm text-muted-foreground">— {item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const getInitialSection = () => {
    const hash = window.location.hash.replace("#", "")
    if (hash === "installation") return "installation"
    if (navItems.find(i => i.id === hash)) return hash
    return "installation"
  }
  const [activeSection, setActiveSection] = useState(getInitialSection)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigate = (id: string) => {
    setActiveSection(id)
    window.history.pushState(null, "", "#" + id)
  }

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash === "installation") setActiveSection("installation")
      else if (navItems.find(i => i.id === hash)) setActiveSection(hash)
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground flex">
        <aside className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-200 overflow-hidden border-r shrink-0`}>
          <div className="p-6 w-64">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-7 h-7 bg-foreground rounded-md" />
              <span className="font-semibold text-base">Design System</span>
            </div>
            <nav className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2">Overview</p>
              <button onClick={() => navigate("installation")}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${activeSection === "installation" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
                Installation
              </button>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-2 px-2">Components</p>
              {navItems.map(item => (
                <button key={item.id} onClick={() => navigate(item.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${activeSection === item.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>
        <div className="flex-1 overflow-auto">
          <header className="border-b px-6 py-3 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-md hover:bg-accent transition-colors">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">Design System</span>
              <button onClick={() => setDarkMode(!darkMode)} className="p-1.5 rounded-md hover:bg-accent transition-colors text-sm">{darkMode ? "☀️" : "🌙"}</button>
            </div>
          </header>
          <main className="p-8 max-w-4xl mx-auto">
      {activeSection === "installation" && <InstallationPage />}
      {activeSection === "Frame1" && (
        <ComponentDoc
          key="Frame1"
          name="Frame 1"
          description="Component from Figma Design System"
          figmaUrl="https://figma.com/file/undefined?node-id=318-1307"
          width={118}
          height={138}
          reactCode={`// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface Frame1Props {
  state?: "Default" | "Disabled";
  className?: string;
  children?: React.ReactNode
}

const Frame1 = React.forwardRef<HTMLDivElement, Frame1Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[118px] h-[138px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Frame1.displayName = "Frame1"

export { Frame1 }
export default Frame1`}
          tailwindCode={`// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[118px] h-[138px]", {
  variants: {
    state: {
      default: "",
      disabled: "",
    },
  },
  defaultVariants: {
  },
})


export interface Frame1Props extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Frame1({ className, children, ...props }: Frame1Props) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Frame1`}
          htmlCode={`<!-- Frame 1 -->
<div class="frame-1">
  <svg width="118" height="138" width="118" height="138" viewBox="0 0 118 138" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="117" height="137" rx="4.5" stroke="#9747FF" stroke-dasharray="10 5"/>
<rect width="78" height="39" transform="translate(20 20)" fill="#FC3D55"/>
<path d="M32.7324 39.752C32.7324 39.1035 32.8418 38.5059 33.0605 37.959C33.2832 37.4121 33.5898 36.9414 33.9805 36.5469C34.3711 36.1484 34.834 35.8379 35.3691 35.6152C35.9082 35.3887 36.4922 35.2754 37.1211 35.2754C37.7461 35.2754 38.3145 35.3809 38.8262 35.5918C39.3379 35.7988 39.7461 36.1055 40.0508 36.5117L39.5586 36.9688C39.3125 36.6562 38.9785 36.3984 38.5566 36.1953C38.1387 35.9922 37.666 35.8906 37.1387 35.8906C36.5684 35.8906 36.0547 35.9922 35.5977 36.1953C35.1445 36.3984 34.7598 36.6758 34.4434 37.0273C34.127 37.3789 33.8828 37.7891 33.7109 38.2578C33.5391 38.7266 33.4531 39.2246 33.4531 39.752C33.4531 40.2715 33.5391 40.7656 33.7109 41.2344C33.8828 41.7031 34.127 42.1133 34.4434 42.4648C34.7598 42.8164 35.1445 43.0957 35.5977 43.3027C36.0547 43.5098 36.5684 43.6133 37.1387 43.6133C37.6348 43.6133 38.0957 43.5234 38.5215 43.3438C38.9512 43.1641 39.3574 42.8379 39.7402 42.3652L40.209 42.7402C39.8496 43.1973 39.4238 43.5605 38.9316 43.8301C38.4395 44.0957 37.832 44.2285 37.1094 44.2285C36.4727 44.2285 35.8848 44.1172 35.3457 43.8945C34.8105 43.668 34.3496 43.3574 33.9629 42.9629C33.5762 42.5645 33.2734 42.0918 33.0547 41.5449C32.8398 40.998 32.7324 40.4004 32.7324 39.752ZM41.2168 41.2051C41.2168 40.7793 41.2891 40.3867 41.4336 40.0273C41.5781 39.668 41.7793 39.3594 42.0371 39.1016C42.2988 38.8398 42.6094 38.6348 42.9688 38.4863C43.3281 38.3379 43.7246 38.2637 44.1582 38.2637C44.5879 38.2637 44.9844 38.3379 45.3477 38.4863C45.7148 38.6348 46.0273 38.8398 46.2852 39.1016C46.5469 39.3594 46.748 39.668 46.8887 40.0273C47.0332 40.3867 47.1055 40.7793 47.1055 41.2051C47.1055 41.627 47.0332 42.0195 46.8887 42.3828C46.748 42.7422 46.5469 43.0547 46.2852 43.3203C46.0273 43.582 45.7148 43.7871 45.3477 43.9355C44.9844 44.084 44.5879 44.1582 44.1582 44.1582C43.7246 44.1582 43.3281 44.084 42.9688 43.9355C42.6094 43.7871 42.2988 43.582 42.0371 43.3203C41.7793 43.0547 41.5781 42.7422 41.4336 42.3828C41.2891 42.0195 41.2168 41.627 41.2168 41.2051ZM46.4375 41.2051C46.4375 40.8691 46.3848 40.5566 46.2793 40.2676C46.1738 39.9785 46.0215 39.7285 45.8223 39.5176C45.623 39.3066 45.3828 39.1387 45.1016 39.0137C44.8242 38.8887 44.5098 38.8262 44.1582 38.8262C43.8027 38.8262 43.4863 38.8887 43.209 39.0137C42.9355 39.1387 42.6992 39.3066 42.5 39.5176C42.3008 39.7285 42.1484 39.9785 42.043 40.2676C41.9414 40.5566 41.8906 40.8691 41.8906 41.2051C41.8906 41.541 41.9414 41.8535 42.043 42.1426C42.1484 42.4277 42.3008 42.6777 42.5 42.8926C42.6992 43.1035 42.9355 43.2695 43.209 43.3906C43.4863 43.5078 43.8027 43.5664 44.1582 43.5664C44.5098 43.5664 44.8242 43.5078 45.1016 43.3906C45.3828 43.2695 45.623 43.1035 45.8223 42.8926C46.0215 42.6777 46.1738 42.4277 46.2793 42.1426C46.3848 41.8535 46.4375 41.541 46.4375 41.2051ZM48.9512 39.6934C48.9512 39.5332 48.9453 39.3281 48.9336 39.0781C48.9258 38.8242 48.9141 38.6016 48.8984 38.4102H49.5254C49.541 38.5703 49.5527 38.7578 49.5605 38.9727C49.5684 39.1875 49.5723 39.3711 49.5723 39.5234H49.5957C49.6777 39.332 49.7871 39.1582 49.9238 39.002C50.0645 38.8457 50.2246 38.7148 50.4043 38.6094C50.584 38.5 50.7754 38.416 50.9785 38.3574C51.1855 38.2949 51.3926 38.2637 51.5996 38.2637C51.9668 38.2637 52.2812 38.3242 52.543 38.4453C52.8086 38.5625 53.0254 38.7266 53.1934 38.9375C53.3652 39.1445 53.4902 39.3906 53.5684 39.6758C53.6465 39.957 53.6855 40.2617 53.6855 40.5898V44H53.041V40.8301C53.041 40.5605 53.0156 40.3027 52.9648 40.0566C52.918 39.8066 52.834 39.5918 52.7129 39.4121C52.5957 39.2324 52.4336 39.0879 52.2266 38.9785C52.0234 38.8691 51.7676 38.8145 51.459 38.8145C51.2168 38.8145 50.9824 38.8633 50.7559 38.9609C50.5332 39.0547 50.3359 39.2012 50.1641 39.4004C49.9922 39.5957 49.8555 39.8398 49.7539 40.1328C49.6562 40.4219 49.6074 40.7637 49.6074 41.1582V44H48.9512V39.6934ZM56.041 42.6582V38.9609H54.8633V38.4102H56.0293V36.8105H56.6914V38.4102H58.2852V38.9609H56.6914V42.5C56.6914 42.8984 56.7734 43.1699 56.9375 43.3145C57.1016 43.459 57.3145 43.5312 57.5762 43.5312C57.8184 43.5312 58.0469 43.4805 58.2617 43.3789L58.2969 43.9414C58.1602 43.9883 58.0195 44.0254 57.875 44.0527C57.7344 44.0801 57.5801 44.0938 57.4121 44.0938C57.2441 44.0938 57.0781 44.0703 56.9141 44.0234C56.75 43.9766 56.6035 43.8965 56.4746 43.7832C56.3457 43.6699 56.2402 43.5215 56.1582 43.3379C56.0801 43.1543 56.041 42.9277 56.041 42.6582ZM59.4922 36.1895C59.4922 36.0449 59.541 35.9277 59.6387 35.8379C59.7402 35.7441 59.8516 35.6973 59.9727 35.6973C60.1016 35.6973 60.2148 35.7441 60.3125 35.8379C60.4141 35.9277 60.4648 36.0449 60.4648 36.1895C60.4648 36.334 60.4141 36.4531 60.3125 36.5469C60.2148 36.6367 60.1016 36.6816 59.9727 36.6816C59.8516 36.6816 59.7402 36.6367 59.6387 36.5469C59.541 36.4531 59.4922 36.334 59.4922 36.1895ZM59.6504 38.4102H60.3066V44H59.6504V38.4102ZM62.5684 39.6934C62.5684 39.5332 62.5625 39.3281 62.5508 39.0781C62.543 38.8242 62.5312 38.6016 62.5156 38.4102H63.1426C63.1582 38.5703 63.1699 38.7578 63.1777 38.9727C63.1855 39.1875 63.1895 39.3711 63.1895 39.5234H63.2129C63.2949 39.332 63.4043 39.1582 63.541 39.002C63.6816 38.8457 63.8418 38.7148 64.0215 38.6094C64.2012 38.5 64.3926 38.416 64.5957 38.3574C64.8027 38.2949 65.0098 38.2637 65.2168 38.2637C65.584 38.2637 65.8984 38.3242 66.1602 38.4453C66.4258 38.5625 66.6426 38.7266 66.8105 38.9375C66.9824 39.1445 67.1074 39.3906 67.1855 39.6758C67.2637 39.957 67.3027 40.2617 67.3027 40.5898V44H66.6582V40.8301C66.6582 40.5605 66.6328 40.3027 66.582 40.0566C66.5352 39.8066 66.4512 39.5918 66.3301 39.4121C66.2129 39.2324 66.0508 39.0879 65.8438 38.9785C65.6406 38.8691 65.3848 38.8145 65.0762 38.8145C64.834 38.8145 64.5996 38.8633 64.373 38.9609C64.1504 39.0547 63.9531 39.2012 63.7812 39.4004C63.6094 39.5957 63.4727 39.8398 63.3711 40.1328C63.2734 40.4219 63.2246 40.7637 63.2246 41.1582V44H62.5684V39.6934ZM69.4297 41.8262V38.4102H70.0918V41.5742C70.0918 41.8555 70.1152 42.1191 70.1621 42.3652C70.209 42.6074 70.293 42.8203 70.4141 43.0039C70.5352 43.1875 70.6973 43.334 70.9004 43.4434C71.1035 43.5488 71.3613 43.6016 71.6738 43.6016C71.916 43.6016 72.1484 43.5527 72.3711 43.4551C72.5938 43.3535 72.7891 43.2051 72.957 43.0098C73.125 42.8145 73.2617 42.5703 73.3672 42.2773C73.4727 41.9844 73.5254 41.6426 73.5254 41.252V38.4102H74.1699V42.7168C74.1699 42.877 74.1758 43.0859 74.1875 43.3438C74.1992 43.5977 74.2129 43.8164 74.2285 44H73.5957C73.5801 43.8477 73.5684 43.6621 73.5605 43.4434C73.5527 43.2207 73.5488 43.0391 73.5488 42.8984H73.5254C73.4434 43.0898 73.332 43.2637 73.1914 43.4199C73.0508 43.5762 72.8945 43.709 72.7227 43.8184C72.5508 43.9238 72.3633 44.0059 72.1602 44.0645C71.957 44.127 71.748 44.1582 71.5332 44.1582C71.1621 44.1582 70.8438 44.0977 70.5781 43.9766C70.3164 43.8555 70.0996 43.6914 69.9277 43.4844C69.7559 43.2773 69.6289 43.0312 69.5469 42.7461C69.4688 42.4609 69.4297 42.1543 69.4297 41.8262ZM76.0098 42.4883C76.0098 42.0898 76.1074 41.7676 76.3027 41.5215C76.498 41.2715 76.7559 41.0801 77.0762 40.9473C77.3965 40.8145 77.7578 40.7266 78.1602 40.6836C78.5664 40.6367 78.9805 40.6133 79.4023 40.6133H79.9707V40.3613C79.9707 39.834 79.832 39.4434 79.5547 39.1895C79.2773 38.9316 78.8867 38.8027 78.3828 38.8027C78.0469 38.8027 77.7363 38.8633 77.4512 38.9844C77.1699 39.1055 76.9258 39.2656 76.7188 39.4648L76.3555 39.0312C76.5898 38.8008 76.8887 38.6152 77.252 38.4746C77.6152 38.334 78.0137 38.2637 78.4473 38.2637C78.7559 38.2637 79.041 38.3066 79.3027 38.3926C79.5645 38.4746 79.791 38.5996 79.9824 38.7676C80.1738 38.9355 80.3223 39.1465 80.4277 39.4004C80.5371 39.6504 80.5918 39.9473 80.5918 40.291V42.7402C80.5918 42.9551 80.5996 43.1797 80.6152 43.4141C80.6309 43.6445 80.6562 43.8398 80.6914 44H80.0996C80.0762 43.8555 80.0547 43.6855 80.0352 43.4902C80.0156 43.2949 80.0059 43.1211 80.0059 42.9688H79.9824C79.748 43.375 79.4609 43.6758 79.1211 43.8711C78.7812 44.0625 78.3828 44.1582 77.9258 44.1582C77.7109 44.1582 77.4883 44.127 77.2578 44.0645C77.0312 44.0059 76.8262 43.9082 76.6426 43.7715C76.459 43.6348 76.3066 43.4629 76.1855 43.2559C76.0684 43.0488 76.0098 42.793 76.0098 42.4883ZM79.9707 41.5859V41.1348H79.5488C79.2207 41.1348 78.8887 41.1484 78.5527 41.1758C78.2168 41.2031 77.9082 41.2637 77.627 41.3574C77.3496 41.4473 77.1211 41.5801 76.9414 41.7559C76.7656 41.9316 76.6777 42.1641 76.6777 42.4531C76.6777 42.668 76.7188 42.8516 76.8008 43.0039C76.8867 43.1562 76.998 43.2773 77.1348 43.3672C77.2715 43.4531 77.4219 43.5156 77.5859 43.5547C77.75 43.5938 77.916 43.6133 78.084 43.6133C78.4043 43.6133 78.6836 43.5566 78.9219 43.4434C79.1641 43.3262 79.3613 43.1738 79.5137 42.9863C79.666 42.7988 79.7793 42.584 79.8535 42.3418C79.9316 42.0957 79.9707 41.8438 79.9707 41.5859ZM82.7715 39.6934C82.7715 39.5332 82.7656 39.3281 82.7539 39.0781C82.7461 38.8242 82.7344 38.6016 82.7188 38.4102H83.3457C83.3613 38.5703 83.373 38.7578 83.3809 38.9727C83.3887 39.1875 83.3926 39.3711 83.3926 39.5234H83.416C83.5762 39.1172 83.8203 38.8066 84.1484 38.5918C84.4766 38.373 84.8438 38.2637 85.25 38.2637C85.3398 38.2637 85.418 38.2656 85.4844 38.2695C85.5547 38.2734 85.625 38.2871 85.6953 38.3105L85.625 38.9141C85.5859 38.8984 85.5215 38.8867 85.4316 38.8789C85.3457 38.8672 85.2578 38.8613 85.168 38.8613C84.6562 38.8613 84.2383 39.0605 83.9141 39.459C83.5898 39.8535 83.4277 40.4121 83.4277 41.1348V44H82.7715V39.6934Z" fill="white"/>
<rect width="78" height="39" transform="translate(20 79)" fill="#CCCCCC"/>
<path d="M32.7324 98.752C32.7324 98.1035 32.8418 97.5059 33.0605 96.959C33.2832 96.4121 33.5898 95.9414 33.9805 95.5469C34.3711 95.1484 34.834 94.8379 35.3691 94.6152C35.9082 94.3887 36.4922 94.2754 37.1211 94.2754C37.7461 94.2754 38.3145 94.3809 38.8262 94.5918C39.3379 94.7988 39.7461 95.1055 40.0508 95.5117L39.5586 95.9688C39.3125 95.6562 38.9785 95.3984 38.5566 95.1953C38.1387 94.9922 37.666 94.8906 37.1387 94.8906C36.5684 94.8906 36.0547 94.9922 35.5977 95.1953C35.1445 95.3984 34.7598 95.6758 34.4434 96.0273C34.127 96.3789 33.8828 96.7891 33.7109 97.2578C33.5391 97.7266 33.4531 98.2246 33.4531 98.752C33.4531 99.2715 33.5391 99.7656 33.7109 100.234C33.8828 100.703 34.127 101.113 34.4434 101.465C34.7598 101.816 35.1445 102.096 35.5977 102.303C36.0547 102.51 36.5684 102.613 37.1387 102.613C37.6348 102.613 38.0957 102.523 38.5215 102.344C38.9512 102.164 39.3574 101.838 39.7402 101.365L40.209 101.74C39.8496 102.197 39.4238 102.561 38.9316 102.83C38.4395 103.096 37.832 103.229 37.1094 103.229C36.4727 103.229 35.8848 103.117 35.3457 102.895C34.8105 102.668 34.3496 102.357 33.9629 101.963C33.5762 101.564 33.2734 101.092 33.0547 100.545C32.8398 99.998 32.7324 99.4004 32.7324 98.752ZM41.2168 100.205C41.2168 99.7793 41.2891 99.3867 41.4336 99.0273C41.5781 98.668 41.7793 98.3594 42.0371 98.1016C42.2988 97.8398 42.6094 97.6348 42.9688 97.4863C43.3281 97.3379 43.7246 97.2637 44.1582 97.2637C44.5879 97.2637 44.9844 97.3379 45.3477 97.4863C45.7148 97.6348 46.0273 97.8398 46.2852 98.1016C46.5469 98.3594 46.748 98.668 46.8887 99.0273C47.0332 99.3867 47.1055 99.7793 47.1055 100.205C47.1055 100.627 47.0332 101.02 46.8887 101.383C46.748 101.742 46.5469 102.055 46.2852 102.32C46.0273 102.582 45.7148 102.787 45.3477 102.936C44.9844 103.084 44.5879 103.158 44.1582 103.158C43.7246 103.158 43.3281 103.084 42.9688 102.936C42.6094 102.787 42.2988 102.582 42.0371 102.32C41.7793 102.055 41.5781 101.742 41.4336 101.383C41.2891 101.02 41.2168 100.627 41.2168 100.205ZM46.4375 100.205C46.4375 99.8691 46.3848 99.5566 46.2793 99.2676C46.1738 98.9785 46.0215 98.7285 45.8223 98.5176C45.623 98.3066 45.3828 98.1387 45.1016 98.0137C44.8242 97.8887 44.5098 97.8262 44.1582 97.8262C43.8027 97.8262 43.4863 97.8887 43.209 98.0137C42.9355 98.1387 42.6992 98.3066 42.5 98.5176C42.3008 98.7285 42.1484 98.9785 42.043 99.2676C41.9414 99.5566 41.8906 99.8691 41.8906 100.205C41.8906 100.541 41.9414 100.854 42.043 101.143C42.1484 101.428 42.3008 101.678 42.5 101.893C42.6992 102.104 42.9355 102.27 43.209 102.391C43.4863 102.508 43.8027 102.566 44.1582 102.566C44.5098 102.566 44.8242 102.508 45.1016 102.391C45.3828 102.27 45.623 102.104 45.8223 101.893C46.0215 101.678 46.1738 101.428 46.2793 101.143C46.3848 100.854 46.4375 100.541 46.4375 100.205ZM48.9512 98.6934C48.9512 98.5332 48.9453 98.3281 48.9336 98.0781C48.9258 97.8242 48.9141 97.6016 48.8984 97.4102H49.5254C49.541 97.5703 49.5527 97.7578 49.5605 97.9727C49.5684 98.1875 49.5723 98.3711 49.5723 98.5234H49.5957C49.6777 98.332 49.7871 98.1582 49.9238 98.002C50.0645 97.8457 50.2246 97.7148 50.4043 97.6094C50.584 97.5 50.7754 97.416 50.9785 97.3574C51.1855 97.2949 51.3926 97.2637 51.5996 97.2637C51.9668 97.2637 52.2812 97.3242 52.543 97.4453C52.8086 97.5625 53.0254 97.7266 53.1934 97.9375C53.3652 98.1445 53.4902 98.3906 53.5684 98.6758C53.6465 98.957 53.6855 99.2617 53.6855 99.5898V103H53.041V99.8301C53.041 99.5605 53.0156 99.3027 52.9648 99.0566C52.918 98.8066 52.834 98.5918 52.7129 98.4121C52.5957 98.2324 52.4336 98.0879 52.2266 97.9785C52.0234 97.8691 51.7676 97.8145 51.459 97.8145C51.2168 97.8145 50.9824 97.8633 50.7559 97.9609C50.5332 98.0547 50.3359 98.2012 50.1641 98.4004C49.9922 98.5957 49.8555 98.8398 49.7539 99.1328C49.6562 99.4219 49.6074 99.7637 49.6074 100.158V103H48.9512V98.6934ZM56.041 101.658V97.9609H54.8633V97.4102H56.0293V95.8105H56.6914V97.4102H58.2852V97.9609H56.6914V101.5C56.6914 101.898 56.7734 102.17 56.9375 102.314C57.1016 102.459 57.3145 102.531 57.5762 102.531C57.8184 102.531 58.0469 102.48 58.2617 102.379L58.2969 102.941C58.1602 102.988 58.0195 103.025 57.875 103.053C57.7344 103.08 57.5801 103.094 57.4121 103.094C57.2441 103.094 57.0781 103.07 56.9141 103.023C56.75 102.977 56.6035 102.896 56.4746 102.783C56.3457 102.67 56.2402 102.521 56.1582 102.338C56.0801 102.154 56.041 101.928 56.041 101.658ZM59.4922 95.1895C59.4922 95.0449 59.541 94.9277 59.6387 94.8379C59.7402 94.7441 59.8516 94.6973 59.9727 94.6973C60.1016 94.6973 60.2148 94.7441 60.3125 94.8379C60.4141 94.9277 60.4648 95.0449 60.4648 95.1895C60.4648 95.334 60.4141 95.4531 60.3125 95.5469C60.2148 95.6367 60.1016 95.6816 59.9727 95.6816C59.8516 95.6816 59.7402 95.6367 59.6387 95.5469C59.541 95.4531 59.4922 95.334 59.4922 95.1895ZM59.6504 97.4102H60.3066V103H59.6504V97.4102ZM62.5684 98.6934C62.5684 98.5332 62.5625 98.3281 62.5508 98.0781C62.543 97.8242 62.5312 97.6016 62.5156 97.4102H63.1426C63.1582 97.5703 63.1699 97.7578 63.1777 97.9727C63.1855 98.1875 63.1895 98.3711 63.1895 98.5234H63.2129C63.2949 98.332 63.4043 98.1582 63.541 98.002C63.6816 97.8457 63.8418 97.7148 64.0215 97.6094C64.2012 97.5 64.3926 97.416 64.5957 97.3574C64.8027 97.2949 65.0098 97.2637 65.2168 97.2637C65.584 97.2637 65.8984 97.3242 66.1602 97.4453C66.4258 97.5625 66.6426 97.7266 66.8105 97.9375C66.9824 98.1445 67.1074 98.3906 67.1855 98.6758C67.2637 98.957 67.3027 99.2617 67.3027 99.5898V103H66.6582V99.8301C66.6582 99.5605 66.6328 99.3027 66.582 99.0566C66.5352 98.8066 66.4512 98.5918 66.3301 98.4121C66.2129 98.2324 66.0508 98.0879 65.8438 97.9785C65.6406 97.8691 65.3848 97.8145 65.0762 97.8145C64.834 97.8145 64.5996 97.8633 64.373 97.9609C64.1504 98.0547 63.9531 98.2012 63.7812 98.4004C63.6094 98.5957 63.4727 98.8398 63.3711 99.1328C63.2734 99.4219 63.2246 99.7637 63.2246 100.158V103H62.5684V98.6934ZM69.4297 100.826V97.4102H70.0918V100.574C70.0918 100.855 70.1152 101.119 70.1621 101.365C70.209 101.607 70.293 101.82 70.4141 102.004C70.5352 102.188 70.6973 102.334 70.9004 102.443C71.1035 102.549 71.3613 102.602 71.6738 102.602C71.916 102.602 72.1484 102.553 72.3711 102.455C72.5938 102.354 72.7891 102.205 72.957 102.01C73.125 101.814 73.2617 101.57 73.3672 101.277C73.4727 100.984 73.5254 100.643 73.5254 100.252V97.4102H74.1699V101.717C74.1699 101.877 74.1758 102.086 74.1875 102.344C74.1992 102.598 74.2129 102.816 74.2285 103H73.5957C73.5801 102.848 73.5684 102.662 73.5605 102.443C73.5527 102.221 73.5488 102.039 73.5488 101.898H73.5254C73.4434 102.09 73.332 102.264 73.1914 102.42C73.0508 102.576 72.8945 102.709 72.7227 102.818C72.5508 102.924 72.3633 103.006 72.1602 103.064C71.957 103.127 71.748 103.158 71.5332 103.158C71.1621 103.158 70.8438 103.098 70.5781 102.977C70.3164 102.855 70.0996 102.691 69.9277 102.484C69.7559 102.277 69.6289 102.031 69.5469 101.746C69.4688 101.461 69.4297 101.154 69.4297 100.826ZM76.0098 101.488C76.0098 101.09 76.1074 100.768 76.3027 100.521C76.498 100.271 76.7559 100.08 77.0762 99.9473C77.3965 99.8145 77.7578 99.7266 78.1602 99.6836C78.5664 99.6367 78.9805 99.6133 79.4023 99.6133H79.9707V99.3613C79.9707 98.834 79.832 98.4434 79.5547 98.1895C79.2773 97.9316 78.8867 97.8027 78.3828 97.8027C78.0469 97.8027 77.7363 97.8633 77.4512 97.9844C77.1699 98.1055 76.9258 98.2656 76.7188 98.4648L76.3555 98.0312C76.5898 97.8008 76.8887 97.6152 77.252 97.4746C77.6152 97.334 78.0137 97.2637 78.4473 97.2637C78.7559 97.2637 79.041 97.3066 79.3027 97.3926C79.5645 97.4746 79.791 97.5996 79.9824 97.7676C80.1738 97.9355 80.3223 98.1465 80.4277 98.4004C80.5371 98.6504 80.5918 98.9473 80.5918 99.291V101.74C80.5918 101.955 80.5996 102.18 80.6152 102.414C80.6309 102.645 80.6562 102.84 80.6914 103H80.0996C80.0762 102.855 80.0547 102.686 80.0352 102.49C80.0156 102.295 80.0059 102.121 80.0059 101.969H79.9824C79.748 102.375 79.4609 102.676 79.1211 102.871C78.7812 103.062 78.3828 103.158 77.9258 103.158C77.7109 103.158 77.4883 103.127 77.2578 103.064C77.0312 103.006 76.8262 102.908 76.6426 102.771C76.459 102.635 76.3066 102.463 76.1855 102.256C76.0684 102.049 76.0098 101.793 76.0098 101.488ZM79.9707 100.586V100.135H79.5488C79.2207 100.135 78.8887 100.148 78.5527 100.176C78.2168 100.203 77.9082 100.264 77.627 100.357C77.3496 100.447 77.1211 100.58 76.9414 100.756C76.7656 100.932 76.6777 101.164 76.6777 101.453C76.6777 101.668 76.7188 101.852 76.8008 102.004C76.8867 102.156 76.998 102.277 77.1348 102.367C77.2715 102.453 77.4219 102.516 77.5859 102.555C77.75 102.594 77.916 102.613 78.084 102.613C78.4043 102.613 78.6836 102.557 78.9219 102.443C79.1641 102.326 79.3613 102.174 79.5137 101.986C79.666 101.799 79.7793 101.584 79.8535 101.342C79.9316 101.096 79.9707 100.844 79.9707 100.586ZM82.7715 98.6934C82.7715 98.5332 82.7656 98.3281 82.7539 98.0781C82.7461 97.8242 82.7344 97.6016 82.7188 97.4102H83.3457C83.3613 97.5703 83.373 97.7578 83.3809 97.9727C83.3887 98.1875 83.3926 98.3711 83.3926 98.5234H83.416C83.5762 98.1172 83.8203 97.8066 84.1484 97.5918C84.4766 97.373 84.8438 97.2637 85.25 97.2637C85.3398 97.2637 85.418 97.2656 85.4844 97.2695C85.5547 97.2734 85.625 97.2871 85.6953 97.3105L85.625 97.9141C85.5859 97.8984 85.5215 97.8867 85.4316 97.8789C85.3457 97.8672 85.2578 97.8613 85.168 97.8613C84.6562 97.8613 84.2383 98.0605 83.9141 98.459C83.5898 98.8535 83.4277 99.4121 83.4277 100.135V103H82.7715V98.6934Z" fill="white"/>
</svg>
</div>`}
          cssCode={`:root {
  --color-primary: #9747ff;
  --color-secondary: #fc3d55;
  --color-accent-2: #ffffff;
  --color-accent-3: #cccccc;
  --radius: 5px;
}

.root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  width: 118px;
  height: 138px;
  border-radius: var(--radius, 5px);
  font-family: "Avenir Next LT Pro", system-ui, sans-serif;
  font-size: 12px;
  overflow: hidden;
}

.root svg {
  width: 100%;
  height: 100%;
  display: block;
}`}
          svgCode={`<svg width="118" height="138" viewBox="0 0 118 138" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="117" height="137" rx="4.5" stroke="#9747FF" stroke-dasharray="10 5"/>
<rect width="78" height="39" transform="translate(20 20)" fill="#FC3D55"/>
<path d="M32.7324 39.752C32.7324 39.1035 32.8418 38.5059 33.0605 37.959C33.2832 37.4121 33.5898 36.9414 33.9805 36.5469C34.3711 36.1484 34.834 35.8379 35.3691 35.6152C35.9082 35.3887 36.4922 35.2754 37.1211 35.2754C37.7461 35.2754 38.3145 35.3809 38.8262 35.5918C39.3379 35.7988 39.7461 36.1055 40.0508 36.5117L39.5586 36.9688C39.3125 36.6562 38.9785 36.3984 38.5566 36.1953C38.1387 35.9922 37.666 35.8906 37.1387 35.8906C36.5684 35.8906 36.0547 35.9922 35.5977 36.1953C35.1445 36.3984 34.7598 36.6758 34.4434 37.0273C34.127 37.3789 33.8828 37.7891 33.7109 38.2578C33.5391 38.7266 33.4531 39.2246 33.4531 39.752C33.4531 40.2715 33.5391 40.7656 33.7109 41.2344C33.8828 41.7031 34.127 42.1133 34.4434 42.4648C34.7598 42.8164 35.1445 43.0957 35.5977 43.3027C36.0547 43.5098 36.5684 43.6133 37.1387 43.6133C37.6348 43.6133 38.0957 43.5234 38.5215 43.3438C38.9512 43.1641 39.3574 42.8379 39.7402 42.3652L40.209 42.7402C39.8496 43.1973 39.4238 43.5605 38.9316 43.8301C38.4395 44.0957 37.832 44.2285 37.1094 44.2285C36.4727 44.2285 35.8848 44.1172 35.3457 43.8945C34.8105 43.668 34.3496 43.3574 33.9629 42.9629C33.5762 42.5645 33.2734 42.0918 33.0547 41.5449C32.8398 40.998 32.7324 40.4004 32.7324 39.752ZM41.2168 41.2051C41.2168 40.7793 41.2891 40.3867 41.4336 40.0273C41.5781 39.668 41.7793 39.3594 42.0371 39.1016C42.2988 38.8398 42.6094 38.6348 42.9688 38.4863C43.3281 38.3379 43.7246 38.2637 44.1582 38.2637C44.5879 38.2637 44.9844 38.3379 45.3477 38.4863C45.7148 38.6348 46.0273 38.8398 46.2852 39.1016C46.5469 39.3594 46.748 39.668 46.8887 40.0273C47.0332 40.3867 47.1055 40.7793 47.1055 41.2051C47.1055 41.627 47.0332 42.0195 46.8887 42.3828C46.748 42.7422 46.5469 43.0547 46.2852 43.3203C46.0273 43.582 45.7148 43.7871 45.3477 43.9355C44.9844 44.084 44.5879 44.1582 44.1582 44.1582C43.7246 44.1582 43.3281 44.084 42.9688 43.9355C42.6094 43.7871 42.2988 43.582 42.0371 43.3203C41.7793 43.0547 41.5781 42.7422 41.4336 42.3828C41.2891 42.0195 41.2168 41.627 41.2168 41.2051ZM46.4375 41.2051C46.4375 40.8691 46.3848 40.5566 46.2793 40.2676C46.1738 39.9785 46.0215 39.7285 45.8223 39.5176C45.623 39.3066 45.3828 39.1387 45.1016 39.0137C44.8242 38.8887 44.5098 38.8262 44.1582 38.8262C43.8027 38.8262 43.4863 38.8887 43.209 39.0137C42.9355 39.1387 42.6992 39.3066 42.5 39.5176C42.3008 39.7285 42.1484 39.9785 42.043 40.2676C41.9414 40.5566 41.8906 40.8691 41.8906 41.2051C41.8906 41.541 41.9414 41.8535 42.043 42.1426C42.1484 42.4277 42.3008 42.6777 42.5 42.8926C42.6992 43.1035 42.9355 43.2695 43.209 43.3906C43.4863 43.5078 43.8027 43.5664 44.1582 43.5664C44.5098 43.5664 44.8242 43.5078 45.1016 43.3906C45.3828 43.2695 45.623 43.1035 45.8223 42.8926C46.0215 42.6777 46.1738 42.4277 46.2793 42.1426C46.3848 41.8535 46.4375 41.541 46.4375 41.2051ZM48.9512 39.6934C48.9512 39.5332 48.9453 39.3281 48.9336 39.0781C48.9258 38.8242 48.9141 38.6016 48.8984 38.4102H49.5254C49.541 38.5703 49.5527 38.7578 49.5605 38.9727C49.5684 39.1875 49.5723 39.3711 49.5723 39.5234H49.5957C49.6777 39.332 49.7871 39.1582 49.9238 39.002C50.0645 38.8457 50.2246 38.7148 50.4043 38.6094C50.584 38.5 50.7754 38.416 50.9785 38.3574C51.1855 38.2949 51.3926 38.2637 51.5996 38.2637C51.9668 38.2637 52.2812 38.3242 52.543 38.4453C52.8086 38.5625 53.0254 38.7266 53.1934 38.9375C53.3652 39.1445 53.4902 39.3906 53.5684 39.6758C53.6465 39.957 53.6855 40.2617 53.6855 40.5898V44H53.041V40.8301C53.041 40.5605 53.0156 40.3027 52.9648 40.0566C52.918 39.8066 52.834 39.5918 52.7129 39.4121C52.5957 39.2324 52.4336 39.0879 52.2266 38.9785C52.0234 38.8691 51.7676 38.8145 51.459 38.8145C51.2168 38.8145 50.9824 38.8633 50.7559 38.9609C50.5332 39.0547 50.3359 39.2012 50.1641 39.4004C49.9922 39.5957 49.8555 39.8398 49.7539 40.1328C49.6562 40.4219 49.6074 40.7637 49.6074 41.1582V44H48.9512V39.6934ZM56.041 42.6582V38.9609H54.8633V38.4102H56.0293V36.8105H56.6914V38.4102H58.2852V38.9609H56.6914V42.5C56.6914 42.8984 56.7734 43.1699 56.9375 43.3145C57.1016 43.459 57.3145 43.5312 57.5762 43.5312C57.8184 43.5312 58.0469 43.4805 58.2617 43.3789L58.2969 43.9414C58.1602 43.9883 58.0195 44.0254 57.875 44.0527C57.7344 44.0801 57.5801 44.0938 57.4121 44.0938C57.2441 44.0938 57.0781 44.0703 56.9141 44.0234C56.75 43.9766 56.6035 43.8965 56.4746 43.7832C56.3457 43.6699 56.2402 43.5215 56.1582 43.3379C56.0801 43.1543 56.041 42.9277 56.041 42.6582ZM59.4922 36.1895C59.4922 36.0449 59.541 35.9277 59.6387 35.8379C59.7402 35.7441 59.8516 35.6973 59.9727 35.6973C60.1016 35.6973 60.2148 35.7441 60.3125 35.8379C60.4141 35.9277 60.4648 36.0449 60.4648 36.1895C60.4648 36.334 60.4141 36.4531 60.3125 36.5469C60.2148 36.6367 60.1016 36.6816 59.9727 36.6816C59.8516 36.6816 59.7402 36.6367 59.6387 36.5469C59.541 36.4531 59.4922 36.334 59.4922 36.1895ZM59.6504 38.4102H60.3066V44H59.6504V38.4102ZM62.5684 39.6934C62.5684 39.5332 62.5625 39.3281 62.5508 39.0781C62.543 38.8242 62.5312 38.6016 62.5156 38.4102H63.1426C63.1582 38.5703 63.1699 38.7578 63.1777 38.9727C63.1855 39.1875 63.1895 39.3711 63.1895 39.5234H63.2129C63.2949 39.332 63.4043 39.1582 63.541 39.002C63.6816 38.8457 63.8418 38.7148 64.0215 38.6094C64.2012 38.5 64.3926 38.416 64.5957 38.3574C64.8027 38.2949 65.0098 38.2637 65.2168 38.2637C65.584 38.2637 65.8984 38.3242 66.1602 38.4453C66.4258 38.5625 66.6426 38.7266 66.8105 38.9375C66.9824 39.1445 67.1074 39.3906 67.1855 39.6758C67.2637 39.957 67.3027 40.2617 67.3027 40.5898V44H66.6582V40.8301C66.6582 40.5605 66.6328 40.3027 66.582 40.0566C66.5352 39.8066 66.4512 39.5918 66.3301 39.4121C66.2129 39.2324 66.0508 39.0879 65.8438 38.9785C65.6406 38.8691 65.3848 38.8145 65.0762 38.8145C64.834 38.8145 64.5996 38.8633 64.373 38.9609C64.1504 39.0547 63.9531 39.2012 63.7812 39.4004C63.6094 39.5957 63.4727 39.8398 63.3711 40.1328C63.2734 40.4219 63.2246 40.7637 63.2246 41.1582V44H62.5684V39.6934ZM69.4297 41.8262V38.4102H70.0918V41.5742C70.0918 41.8555 70.1152 42.1191 70.1621 42.3652C70.209 42.6074 70.293 42.8203 70.4141 43.0039C70.5352 43.1875 70.6973 43.334 70.9004 43.4434C71.1035 43.5488 71.3613 43.6016 71.6738 43.6016C71.916 43.6016 72.1484 43.5527 72.3711 43.4551C72.5938 43.3535 72.7891 43.2051 72.957 43.0098C73.125 42.8145 73.2617 42.5703 73.3672 42.2773C73.4727 41.9844 73.5254 41.6426 73.5254 41.252V38.4102H74.1699V42.7168C74.1699 42.877 74.1758 43.0859 74.1875 43.3438C74.1992 43.5977 74.2129 43.8164 74.2285 44H73.5957C73.5801 43.8477 73.5684 43.6621 73.5605 43.4434C73.5527 43.2207 73.5488 43.0391 73.5488 42.8984H73.5254C73.4434 43.0898 73.332 43.2637 73.1914 43.4199C73.0508 43.5762 72.8945 43.709 72.7227 43.8184C72.5508 43.9238 72.3633 44.0059 72.1602 44.0645C71.957 44.127 71.748 44.1582 71.5332 44.1582C71.1621 44.1582 70.8438 44.0977 70.5781 43.9766C70.3164 43.8555 70.0996 43.6914 69.9277 43.4844C69.7559 43.2773 69.6289 43.0312 69.5469 42.7461C69.4688 42.4609 69.4297 42.1543 69.4297 41.8262ZM76.0098 42.4883C76.0098 42.0898 76.1074 41.7676 76.3027 41.5215C76.498 41.2715 76.7559 41.0801 77.0762 40.9473C77.3965 40.8145 77.7578 40.7266 78.1602 40.6836C78.5664 40.6367 78.9805 40.6133 79.4023 40.6133H79.9707V40.3613C79.9707 39.834 79.832 39.4434 79.5547 39.1895C79.2773 38.9316 78.8867 38.8027 78.3828 38.8027C78.0469 38.8027 77.7363 38.8633 77.4512 38.9844C77.1699 39.1055 76.9258 39.2656 76.7188 39.4648L76.3555 39.0312C76.5898 38.8008 76.8887 38.6152 77.252 38.4746C77.6152 38.334 78.0137 38.2637 78.4473 38.2637C78.7559 38.2637 79.041 38.3066 79.3027 38.3926C79.5645 38.4746 79.791 38.5996 79.9824 38.7676C80.1738 38.9355 80.3223 39.1465 80.4277 39.4004C80.5371 39.6504 80.5918 39.9473 80.5918 40.291V42.7402C80.5918 42.9551 80.5996 43.1797 80.6152 43.4141C80.6309 43.6445 80.6562 43.8398 80.6914 44H80.0996C80.0762 43.8555 80.0547 43.6855 80.0352 43.4902C80.0156 43.2949 80.0059 43.1211 80.0059 42.9688H79.9824C79.748 43.375 79.4609 43.6758 79.1211 43.8711C78.7812 44.0625 78.3828 44.1582 77.9258 44.1582C77.7109 44.1582 77.4883 44.127 77.2578 44.0645C77.0312 44.0059 76.8262 43.9082 76.6426 43.7715C76.459 43.6348 76.3066 43.4629 76.1855 43.2559C76.0684 43.0488 76.0098 42.793 76.0098 42.4883ZM79.9707 41.5859V41.1348H79.5488C79.2207 41.1348 78.8887 41.1484 78.5527 41.1758C78.2168 41.2031 77.9082 41.2637 77.627 41.3574C77.3496 41.4473 77.1211 41.5801 76.9414 41.7559C76.7656 41.9316 76.6777 42.1641 76.6777 42.4531C76.6777 42.668 76.7188 42.8516 76.8008 43.0039C76.8867 43.1562 76.998 43.2773 77.1348 43.3672C77.2715 43.4531 77.4219 43.5156 77.5859 43.5547C77.75 43.5938 77.916 43.6133 78.084 43.6133C78.4043 43.6133 78.6836 43.5566 78.9219 43.4434C79.1641 43.3262 79.3613 43.1738 79.5137 42.9863C79.666 42.7988 79.7793 42.584 79.8535 42.3418C79.9316 42.0957 79.9707 41.8438 79.9707 41.5859ZM82.7715 39.6934C82.7715 39.5332 82.7656 39.3281 82.7539 39.0781C82.7461 38.8242 82.7344 38.6016 82.7188 38.4102H83.3457C83.3613 38.5703 83.373 38.7578 83.3809 38.9727C83.3887 39.1875 83.3926 39.3711 83.3926 39.5234H83.416C83.5762 39.1172 83.8203 38.8066 84.1484 38.5918C84.4766 38.373 84.8438 38.2637 85.25 38.2637C85.3398 38.2637 85.418 38.2656 85.4844 38.2695C85.5547 38.2734 85.625 38.2871 85.6953 38.3105L85.625 38.9141C85.5859 38.8984 85.5215 38.8867 85.4316 38.8789C85.3457 38.8672 85.2578 38.8613 85.168 38.8613C84.6562 38.8613 84.2383 39.0605 83.9141 39.459C83.5898 39.8535 83.4277 40.4121 83.4277 41.1348V44H82.7715V39.6934Z" fill="white"/>
<rect width="78" height="39" transform="translate(20 79)" fill="#CCCCCC"/>
<path d="M32.7324 98.752C32.7324 98.1035 32.8418 97.5059 33.0605 96.959C33.2832 96.4121 33.5898 95.9414 33.9805 95.5469C34.3711 95.1484 34.834 94.8379 35.3691 94.6152C35.9082 94.3887 36.4922 94.2754 37.1211 94.2754C37.7461 94.2754 38.3145 94.3809 38.8262 94.5918C39.3379 94.7988 39.7461 95.1055 40.0508 95.5117L39.5586 95.9688C39.3125 95.6562 38.9785 95.3984 38.5566 95.1953C38.1387 94.9922 37.666 94.8906 37.1387 94.8906C36.5684 94.8906 36.0547 94.9922 35.5977 95.1953C35.1445 95.3984 34.7598 95.6758 34.4434 96.0273C34.127 96.3789 33.8828 96.7891 33.7109 97.2578C33.5391 97.7266 33.4531 98.2246 33.4531 98.752C33.4531 99.2715 33.5391 99.7656 33.7109 100.234C33.8828 100.703 34.127 101.113 34.4434 101.465C34.7598 101.816 35.1445 102.096 35.5977 102.303C36.0547 102.51 36.5684 102.613 37.1387 102.613C37.6348 102.613 38.0957 102.523 38.5215 102.344C38.9512 102.164 39.3574 101.838 39.7402 101.365L40.209 101.74C39.8496 102.197 39.4238 102.561 38.9316 102.83C38.4395 103.096 37.832 103.229 37.1094 103.229C36.4727 103.229 35.8848 103.117 35.3457 102.895C34.8105 102.668 34.3496 102.357 33.9629 101.963C33.5762 101.564 33.2734 101.092 33.0547 100.545C32.8398 99.998 32.7324 99.4004 32.7324 98.752ZM41.2168 100.205C41.2168 99.7793 41.2891 99.3867 41.4336 99.0273C41.5781 98.668 41.7793 98.3594 42.0371 98.1016C42.2988 97.8398 42.6094 97.6348 42.9688 97.4863C43.3281 97.3379 43.7246 97.2637 44.1582 97.2637C44.5879 97.2637 44.9844 97.3379 45.3477 97.4863C45.7148 97.6348 46.0273 97.8398 46.2852 98.1016C46.5469 98.3594 46.748 98.668 46.8887 99.0273C47.0332 99.3867 47.1055 99.7793 47.1055 100.205C47.1055 100.627 47.0332 101.02 46.8887 101.383C46.748 101.742 46.5469 102.055 46.2852 102.32C46.0273 102.582 45.7148 102.787 45.3477 102.936C44.9844 103.084 44.5879 103.158 44.1582 103.158C43.7246 103.158 43.3281 103.084 42.9688 102.936C42.6094 102.787 42.2988 102.582 42.0371 102.32C41.7793 102.055 41.5781 101.742 41.4336 101.383C41.2891 101.02 41.2168 100.627 41.2168 100.205ZM46.4375 100.205C46.4375 99.8691 46.3848 99.5566 46.2793 99.2676C46.1738 98.9785 46.0215 98.7285 45.8223 98.5176C45.623 98.3066 45.3828 98.1387 45.1016 98.0137C44.8242 97.8887 44.5098 97.8262 44.1582 97.8262C43.8027 97.8262 43.4863 97.8887 43.209 98.0137C42.9355 98.1387 42.6992 98.3066 42.5 98.5176C42.3008 98.7285 42.1484 98.9785 42.043 99.2676C41.9414 99.5566 41.8906 99.8691 41.8906 100.205C41.8906 100.541 41.9414 100.854 42.043 101.143C42.1484 101.428 42.3008 101.678 42.5 101.893C42.6992 102.104 42.9355 102.27 43.209 102.391C43.4863 102.508 43.8027 102.566 44.1582 102.566C44.5098 102.566 44.8242 102.508 45.1016 102.391C45.3828 102.27 45.623 102.104 45.8223 101.893C46.0215 101.678 46.1738 101.428 46.2793 101.143C46.3848 100.854 46.4375 100.541 46.4375 100.205ZM48.9512 98.6934C48.9512 98.5332 48.9453 98.3281 48.9336 98.0781C48.9258 97.8242 48.9141 97.6016 48.8984 97.4102H49.5254C49.541 97.5703 49.5527 97.7578 49.5605 97.9727C49.5684 98.1875 49.5723 98.3711 49.5723 98.5234H49.5957C49.6777 98.332 49.7871 98.1582 49.9238 98.002C50.0645 97.8457 50.2246 97.7148 50.4043 97.6094C50.584 97.5 50.7754 97.416 50.9785 97.3574C51.1855 97.2949 51.3926 97.2637 51.5996 97.2637C51.9668 97.2637 52.2812 97.3242 52.543 97.4453C52.8086 97.5625 53.0254 97.7266 53.1934 97.9375C53.3652 98.1445 53.4902 98.3906 53.5684 98.6758C53.6465 98.957 53.6855 99.2617 53.6855 99.5898V103H53.041V99.8301C53.041 99.5605 53.0156 99.3027 52.9648 99.0566C52.918 98.8066 52.834 98.5918 52.7129 98.4121C52.5957 98.2324 52.4336 98.0879 52.2266 97.9785C52.0234 97.8691 51.7676 97.8145 51.459 97.8145C51.2168 97.8145 50.9824 97.8633 50.7559 97.9609C50.5332 98.0547 50.3359 98.2012 50.1641 98.4004C49.9922 98.5957 49.8555 98.8398 49.7539 99.1328C49.6562 99.4219 49.6074 99.7637 49.6074 100.158V103H48.9512V98.6934ZM56.041 101.658V97.9609H54.8633V97.4102H56.0293V95.8105H56.6914V97.4102H58.2852V97.9609H56.6914V101.5C56.6914 101.898 56.7734 102.17 56.9375 102.314C57.1016 102.459 57.3145 102.531 57.5762 102.531C57.8184 102.531 58.0469 102.48 58.2617 102.379L58.2969 102.941C58.1602 102.988 58.0195 103.025 57.875 103.053C57.7344 103.08 57.5801 103.094 57.4121 103.094C57.2441 103.094 57.0781 103.07 56.9141 103.023C56.75 102.977 56.6035 102.896 56.4746 102.783C56.3457 102.67 56.2402 102.521 56.1582 102.338C56.0801 102.154 56.041 101.928 56.041 101.658ZM59.4922 95.1895C59.4922 95.0449 59.541 94.9277 59.6387 94.8379C59.7402 94.7441 59.8516 94.6973 59.9727 94.6973C60.1016 94.6973 60.2148 94.7441 60.3125 94.8379C60.4141 94.9277 60.4648 95.0449 60.4648 95.1895C60.4648 95.334 60.4141 95.4531 60.3125 95.5469C60.2148 95.6367 60.1016 95.6816 59.9727 95.6816C59.8516 95.6816 59.7402 95.6367 59.6387 95.5469C59.541 95.4531 59.4922 95.334 59.4922 95.1895ZM59.6504 97.4102H60.3066V103H59.6504V97.4102ZM62.5684 98.6934C62.5684 98.5332 62.5625 98.3281 62.5508 98.0781C62.543 97.8242 62.5312 97.6016 62.5156 97.4102H63.1426C63.1582 97.5703 63.1699 97.7578 63.1777 97.9727C63.1855 98.1875 63.1895 98.3711 63.1895 98.5234H63.2129C63.2949 98.332 63.4043 98.1582 63.541 98.002C63.6816 97.8457 63.8418 97.7148 64.0215 97.6094C64.2012 97.5 64.3926 97.416 64.5957 97.3574C64.8027 97.2949 65.0098 97.2637 65.2168 97.2637C65.584 97.2637 65.8984 97.3242 66.1602 97.4453C66.4258 97.5625 66.6426 97.7266 66.8105 97.9375C66.9824 98.1445 67.1074 98.3906 67.1855 98.6758C67.2637 98.957 67.3027 99.2617 67.3027 99.5898V103H66.6582V99.8301C66.6582 99.5605 66.6328 99.3027 66.582 99.0566C66.5352 98.8066 66.4512 98.5918 66.3301 98.4121C66.2129 98.2324 66.0508 98.0879 65.8438 97.9785C65.6406 97.8691 65.3848 97.8145 65.0762 97.8145C64.834 97.8145 64.5996 97.8633 64.373 97.9609C64.1504 98.0547 63.9531 98.2012 63.7812 98.4004C63.6094 98.5957 63.4727 98.8398 63.3711 99.1328C63.2734 99.4219 63.2246 99.7637 63.2246 100.158V103H62.5684V98.6934ZM69.4297 100.826V97.4102H70.0918V100.574C70.0918 100.855 70.1152 101.119 70.1621 101.365C70.209 101.607 70.293 101.82 70.4141 102.004C70.5352 102.188 70.6973 102.334 70.9004 102.443C71.1035 102.549 71.3613 102.602 71.6738 102.602C71.916 102.602 72.1484 102.553 72.3711 102.455C72.5938 102.354 72.7891 102.205 72.957 102.01C73.125 101.814 73.2617 101.57 73.3672 101.277C73.4727 100.984 73.5254 100.643 73.5254 100.252V97.4102H74.1699V101.717C74.1699 101.877 74.1758 102.086 74.1875 102.344C74.1992 102.598 74.2129 102.816 74.2285 103H73.5957C73.5801 102.848 73.5684 102.662 73.5605 102.443C73.5527 102.221 73.5488 102.039 73.5488 101.898H73.5254C73.4434 102.09 73.332 102.264 73.1914 102.42C73.0508 102.576 72.8945 102.709 72.7227 102.818C72.5508 102.924 72.3633 103.006 72.1602 103.064C71.957 103.127 71.748 103.158 71.5332 103.158C71.1621 103.158 70.8438 103.098 70.5781 102.977C70.3164 102.855 70.0996 102.691 69.9277 102.484C69.7559 102.277 69.6289 102.031 69.5469 101.746C69.4688 101.461 69.4297 101.154 69.4297 100.826ZM76.0098 101.488C76.0098 101.09 76.1074 100.768 76.3027 100.521C76.498 100.271 76.7559 100.08 77.0762 99.9473C77.3965 99.8145 77.7578 99.7266 78.1602 99.6836C78.5664 99.6367 78.9805 99.6133 79.4023 99.6133H79.9707V99.3613C79.9707 98.834 79.832 98.4434 79.5547 98.1895C79.2773 97.9316 78.8867 97.8027 78.3828 97.8027C78.0469 97.8027 77.7363 97.8633 77.4512 97.9844C77.1699 98.1055 76.9258 98.2656 76.7188 98.4648L76.3555 98.0312C76.5898 97.8008 76.8887 97.6152 77.252 97.4746C77.6152 97.334 78.0137 97.2637 78.4473 97.2637C78.7559 97.2637 79.041 97.3066 79.3027 97.3926C79.5645 97.4746 79.791 97.5996 79.9824 97.7676C80.1738 97.9355 80.3223 98.1465 80.4277 98.4004C80.5371 98.6504 80.5918 98.9473 80.5918 99.291V101.74C80.5918 101.955 80.5996 102.18 80.6152 102.414C80.6309 102.645 80.6562 102.84 80.6914 103H80.0996C80.0762 102.855 80.0547 102.686 80.0352 102.49C80.0156 102.295 80.0059 102.121 80.0059 101.969H79.9824C79.748 102.375 79.4609 102.676 79.1211 102.871C78.7812 103.062 78.3828 103.158 77.9258 103.158C77.7109 103.158 77.4883 103.127 77.2578 103.064C77.0312 103.006 76.8262 102.908 76.6426 102.771C76.459 102.635 76.3066 102.463 76.1855 102.256C76.0684 102.049 76.0098 101.793 76.0098 101.488ZM79.9707 100.586V100.135H79.5488C79.2207 100.135 78.8887 100.148 78.5527 100.176C78.2168 100.203 77.9082 100.264 77.627 100.357C77.3496 100.447 77.1211 100.58 76.9414 100.756C76.7656 100.932 76.6777 101.164 76.6777 101.453C76.6777 101.668 76.7188 101.852 76.8008 102.004C76.8867 102.156 76.998 102.277 77.1348 102.367C77.2715 102.453 77.4219 102.516 77.5859 102.555C77.75 102.594 77.916 102.613 78.084 102.613C78.4043 102.613 78.6836 102.557 78.9219 102.443C79.1641 102.326 79.3613 102.174 79.5137 101.986C79.666 101.799 79.7793 101.584 79.8535 101.342C79.9316 101.096 79.9707 100.844 79.9707 100.586ZM82.7715 98.6934C82.7715 98.5332 82.7656 98.3281 82.7539 98.0781C82.7461 97.8242 82.7344 97.6016 82.7188 97.4102H83.3457C83.3613 97.5703 83.373 97.7578 83.3809 97.9727C83.3887 98.1875 83.3926 98.3711 83.3926 98.5234H83.416C83.5762 98.1172 83.8203 97.8066 84.1484 97.5918C84.4766 97.373 84.8438 97.2637 85.25 97.2637C85.3398 97.2637 85.418 97.2656 85.4844 97.2695C85.5547 97.2734 85.625 97.2871 85.6953 97.3105L85.625 97.9141C85.5859 97.8984 85.5215 97.8867 85.4316 97.8789C85.3457 97.8672 85.2578 97.8613 85.168 97.8613C84.6562 97.8613 84.2383 98.0605 83.9141 98.459C83.5898 98.8535 83.4277 99.4121 83.4277 100.135V103H82.7715V98.6934Z" fill="white"/>
</svg>
`}
          aiCode={`// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface Frame1Props {
  state?: "Default" | "Disabled";
  className?: string;
  children?: React.ReactNode
}

const Frame1 = React.forwardRef<HTMLDivElement, Frame1Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[118px] h-[138px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Frame1.displayName = "Frame1"

export { Frame1 }
export default Frame1`}
          tokens={{
  "colors": [
    "#9747ff",
    "#fc3d55",
    "#ffffff",
    "#cccccc"
  ],
  "typography": [
    {
      "fontFamily": "Avenir Next LT Pro",
      "fontSize": 12,
      "fontWeight": "Light"
    },
    {
      "fontFamily": "Avenir Next LT Pro",
      "fontSize": 12,
      "fontWeight": "Light"
    }
  ],
  "spacing": [],
  "borderRadius": [
    "5px"
  ],
  "shadows": []
}}
        />
      )}
      {activeSection === "Frame2" && (
        <ComponentDoc
          key="Frame2"
          name="Frame 2"
          description="Component from Figma Design System"
          figmaUrl="https://figma.com/file/undefined?node-id=318-1315"
          width={118}
          height={138}
          reactCode={`// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface Frame2Props {
  property 1?: "Default" | "Variant2";
  className?: string;
  children?: React.ReactNode
}

const Frame2 = React.forwardRef<HTMLDivElement, Frame2Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[118px] h-[138px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Frame2.displayName = "Frame2"

export { Frame2 }
export default Frame2`}
          tailwindCode={`// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[118px] h-[138px]", {
  variants: {
    property 1: {
      default: "",
      variant2: "",
    },
  },
  defaultVariants: {
  },
})


export interface Frame2Props extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Frame2({ className, children, ...props }: Frame2Props) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Frame2`}
          htmlCode={`<!-- Frame 2 -->
<div class="frame-2">
  <svg width="118" height="138" width="118" height="138" viewBox="0 0 118 138" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="117" height="137" rx="4.5" stroke="#9747FF" stroke-dasharray="10 5"/>
<rect width="78" height="39" transform="translate(20 20)" fill="#FC3D55"/>
<path d="M32.7324 39.752C32.7324 39.1035 32.8418 38.5059 33.0605 37.959C33.2832 37.4121 33.5898 36.9414 33.9805 36.5469C34.3711 36.1484 34.834 35.8379 35.3691 35.6152C35.9082 35.3887 36.4922 35.2754 37.1211 35.2754C37.7461 35.2754 38.3145 35.3809 38.8262 35.5918C39.3379 35.7988 39.7461 36.1055 40.0508 36.5117L39.5586 36.9688C39.3125 36.6562 38.9785 36.3984 38.5566 36.1953C38.1387 35.9922 37.666 35.8906 37.1387 35.8906C36.5684 35.8906 36.0547 35.9922 35.5977 36.1953C35.1445 36.3984 34.7598 36.6758 34.4434 37.0273C34.127 37.3789 33.8828 37.7891 33.7109 38.2578C33.5391 38.7266 33.4531 39.2246 33.4531 39.752C33.4531 40.2715 33.5391 40.7656 33.7109 41.2344C33.8828 41.7031 34.127 42.1133 34.4434 42.4648C34.7598 42.8164 35.1445 43.0957 35.5977 43.3027C36.0547 43.5098 36.5684 43.6133 37.1387 43.6133C37.6348 43.6133 38.0957 43.5234 38.5215 43.3438C38.9512 43.1641 39.3574 42.8379 39.7402 42.3652L40.209 42.7402C39.8496 43.1973 39.4238 43.5605 38.9316 43.8301C38.4395 44.0957 37.832 44.2285 37.1094 44.2285C36.4727 44.2285 35.8848 44.1172 35.3457 43.8945C34.8105 43.668 34.3496 43.3574 33.9629 42.9629C33.5762 42.5645 33.2734 42.0918 33.0547 41.5449C32.8398 40.998 32.7324 40.4004 32.7324 39.752ZM41.2168 41.2051C41.2168 40.7793 41.2891 40.3867 41.4336 40.0273C41.5781 39.668 41.7793 39.3594 42.0371 39.1016C42.2988 38.8398 42.6094 38.6348 42.9688 38.4863C43.3281 38.3379 43.7246 38.2637 44.1582 38.2637C44.5879 38.2637 44.9844 38.3379 45.3477 38.4863C45.7148 38.6348 46.0273 38.8398 46.2852 39.1016C46.5469 39.3594 46.748 39.668 46.8887 40.0273C47.0332 40.3867 47.1055 40.7793 47.1055 41.2051C47.1055 41.627 47.0332 42.0195 46.8887 42.3828C46.748 42.7422 46.5469 43.0547 46.2852 43.3203C46.0273 43.582 45.7148 43.7871 45.3477 43.9355C44.9844 44.084 44.5879 44.1582 44.1582 44.1582C43.7246 44.1582 43.3281 44.084 42.9688 43.9355C42.6094 43.7871 42.2988 43.582 42.0371 43.3203C41.7793 43.0547 41.5781 42.7422 41.4336 42.3828C41.2891 42.0195 41.2168 41.627 41.2168 41.2051ZM46.4375 41.2051C46.4375 40.8691 46.3848 40.5566 46.2793 40.2676C46.1738 39.9785 46.0215 39.7285 45.8223 39.5176C45.623 39.3066 45.3828 39.1387 45.1016 39.0137C44.8242 38.8887 44.5098 38.8262 44.1582 38.8262C43.8027 38.8262 43.4863 38.8887 43.209 39.0137C42.9355 39.1387 42.6992 39.3066 42.5 39.5176C42.3008 39.7285 42.1484 39.9785 42.043 40.2676C41.9414 40.5566 41.8906 40.8691 41.8906 41.2051C41.8906 41.541 41.9414 41.8535 42.043 42.1426C42.1484 42.4277 42.3008 42.6777 42.5 42.8926C42.6992 43.1035 42.9355 43.2695 43.209 43.3906C43.4863 43.5078 43.8027 43.5664 44.1582 43.5664C44.5098 43.5664 44.8242 43.5078 45.1016 43.3906C45.3828 43.2695 45.623 43.1035 45.8223 42.8926C46.0215 42.6777 46.1738 42.4277 46.2793 42.1426C46.3848 41.8535 46.4375 41.541 46.4375 41.2051ZM48.9512 39.6934C48.9512 39.5332 48.9453 39.3281 48.9336 39.0781C48.9258 38.8242 48.9141 38.6016 48.8984 38.4102H49.5254C49.541 38.5703 49.5527 38.7578 49.5605 38.9727C49.5684 39.1875 49.5723 39.3711 49.5723 39.5234H49.5957C49.6777 39.332 49.7871 39.1582 49.9238 39.002C50.0645 38.8457 50.2246 38.7148 50.4043 38.6094C50.584 38.5 50.7754 38.416 50.9785 38.3574C51.1855 38.2949 51.3926 38.2637 51.5996 38.2637C51.9668 38.2637 52.2812 38.3242 52.543 38.4453C52.8086 38.5625 53.0254 38.7266 53.1934 38.9375C53.3652 39.1445 53.4902 39.3906 53.5684 39.6758C53.6465 39.957 53.6855 40.2617 53.6855 40.5898V44H53.041V40.8301C53.041 40.5605 53.0156 40.3027 52.9648 40.0566C52.918 39.8066 52.834 39.5918 52.7129 39.4121C52.5957 39.2324 52.4336 39.0879 52.2266 38.9785C52.0234 38.8691 51.7676 38.8145 51.459 38.8145C51.2168 38.8145 50.9824 38.8633 50.7559 38.9609C50.5332 39.0547 50.3359 39.2012 50.1641 39.4004C49.9922 39.5957 49.8555 39.8398 49.7539 40.1328C49.6562 40.4219 49.6074 40.7637 49.6074 41.1582V44H48.9512V39.6934ZM56.041 42.6582V38.9609H54.8633V38.4102H56.0293V36.8105H56.6914V38.4102H58.2852V38.9609H56.6914V42.5C56.6914 42.8984 56.7734 43.1699 56.9375 43.3145C57.1016 43.459 57.3145 43.5312 57.5762 43.5312C57.8184 43.5312 58.0469 43.4805 58.2617 43.3789L58.2969 43.9414C58.1602 43.9883 58.0195 44.0254 57.875 44.0527C57.7344 44.0801 57.5801 44.0938 57.4121 44.0938C57.2441 44.0938 57.0781 44.0703 56.9141 44.0234C56.75 43.9766 56.6035 43.8965 56.4746 43.7832C56.3457 43.6699 56.2402 43.5215 56.1582 43.3379C56.0801 43.1543 56.041 42.9277 56.041 42.6582ZM59.4922 36.1895C59.4922 36.0449 59.541 35.9277 59.6387 35.8379C59.7402 35.7441 59.8516 35.6973 59.9727 35.6973C60.1016 35.6973 60.2148 35.7441 60.3125 35.8379C60.4141 35.9277 60.4648 36.0449 60.4648 36.1895C60.4648 36.334 60.4141 36.4531 60.3125 36.5469C60.2148 36.6367 60.1016 36.6816 59.9727 36.6816C59.8516 36.6816 59.7402 36.6367 59.6387 36.5469C59.541 36.4531 59.4922 36.334 59.4922 36.1895ZM59.6504 38.4102H60.3066V44H59.6504V38.4102ZM62.5684 39.6934C62.5684 39.5332 62.5625 39.3281 62.5508 39.0781C62.543 38.8242 62.5312 38.6016 62.5156 38.4102H63.1426C63.1582 38.5703 63.1699 38.7578 63.1777 38.9727C63.1855 39.1875 63.1895 39.3711 63.1895 39.5234H63.2129C63.2949 39.332 63.4043 39.1582 63.541 39.002C63.6816 38.8457 63.8418 38.7148 64.0215 38.6094C64.2012 38.5 64.3926 38.416 64.5957 38.3574C64.8027 38.2949 65.0098 38.2637 65.2168 38.2637C65.584 38.2637 65.8984 38.3242 66.1602 38.4453C66.4258 38.5625 66.6426 38.7266 66.8105 38.9375C66.9824 39.1445 67.1074 39.3906 67.1855 39.6758C67.2637 39.957 67.3027 40.2617 67.3027 40.5898V44H66.6582V40.8301C66.6582 40.5605 66.6328 40.3027 66.582 40.0566C66.5352 39.8066 66.4512 39.5918 66.3301 39.4121C66.2129 39.2324 66.0508 39.0879 65.8438 38.9785C65.6406 38.8691 65.3848 38.8145 65.0762 38.8145C64.834 38.8145 64.5996 38.8633 64.373 38.9609C64.1504 39.0547 63.9531 39.2012 63.7812 39.4004C63.6094 39.5957 63.4727 39.8398 63.3711 40.1328C63.2734 40.4219 63.2246 40.7637 63.2246 41.1582V44H62.5684V39.6934ZM69.4297 41.8262V38.4102H70.0918V41.5742C70.0918 41.8555 70.1152 42.1191 70.1621 42.3652C70.209 42.6074 70.293 42.8203 70.4141 43.0039C70.5352 43.1875 70.6973 43.334 70.9004 43.4434C71.1035 43.5488 71.3613 43.6016 71.6738 43.6016C71.916 43.6016 72.1484 43.5527 72.3711 43.4551C72.5938 43.3535 72.7891 43.2051 72.957 43.0098C73.125 42.8145 73.2617 42.5703 73.3672 42.2773C73.4727 41.9844 73.5254 41.6426 73.5254 41.252V38.4102H74.1699V42.7168C74.1699 42.877 74.1758 43.0859 74.1875 43.3438C74.1992 43.5977 74.2129 43.8164 74.2285 44H73.5957C73.5801 43.8477 73.5684 43.6621 73.5605 43.4434C73.5527 43.2207 73.5488 43.0391 73.5488 42.8984H73.5254C73.4434 43.0898 73.332 43.2637 73.1914 43.4199C73.0508 43.5762 72.8945 43.709 72.7227 43.8184C72.5508 43.9238 72.3633 44.0059 72.1602 44.0645C71.957 44.127 71.748 44.1582 71.5332 44.1582C71.1621 44.1582 70.8438 44.0977 70.5781 43.9766C70.3164 43.8555 70.0996 43.6914 69.9277 43.4844C69.7559 43.2773 69.6289 43.0312 69.5469 42.7461C69.4688 42.4609 69.4297 42.1543 69.4297 41.8262ZM76.0098 42.4883C76.0098 42.0898 76.1074 41.7676 76.3027 41.5215C76.498 41.2715 76.7559 41.0801 77.0762 40.9473C77.3965 40.8145 77.7578 40.7266 78.1602 40.6836C78.5664 40.6367 78.9805 40.6133 79.4023 40.6133H79.9707V40.3613C79.9707 39.834 79.832 39.4434 79.5547 39.1895C79.2773 38.9316 78.8867 38.8027 78.3828 38.8027C78.0469 38.8027 77.7363 38.8633 77.4512 38.9844C77.1699 39.1055 76.9258 39.2656 76.7188 39.4648L76.3555 39.0312C76.5898 38.8008 76.8887 38.6152 77.252 38.4746C77.6152 38.334 78.0137 38.2637 78.4473 38.2637C78.7559 38.2637 79.041 38.3066 79.3027 38.3926C79.5645 38.4746 79.791 38.5996 79.9824 38.7676C80.1738 38.9355 80.3223 39.1465 80.4277 39.4004C80.5371 39.6504 80.5918 39.9473 80.5918 40.291V42.7402C80.5918 42.9551 80.5996 43.1797 80.6152 43.4141C80.6309 43.6445 80.6562 43.8398 80.6914 44H80.0996C80.0762 43.8555 80.0547 43.6855 80.0352 43.4902C80.0156 43.2949 80.0059 43.1211 80.0059 42.9688H79.9824C79.748 43.375 79.4609 43.6758 79.1211 43.8711C78.7812 44.0625 78.3828 44.1582 77.9258 44.1582C77.7109 44.1582 77.4883 44.127 77.2578 44.0645C77.0312 44.0059 76.8262 43.9082 76.6426 43.7715C76.459 43.6348 76.3066 43.4629 76.1855 43.2559C76.0684 43.0488 76.0098 42.793 76.0098 42.4883ZM79.9707 41.5859V41.1348H79.5488C79.2207 41.1348 78.8887 41.1484 78.5527 41.1758C78.2168 41.2031 77.9082 41.2637 77.627 41.3574C77.3496 41.4473 77.1211 41.5801 76.9414 41.7559C76.7656 41.9316 76.6777 42.1641 76.6777 42.4531C76.6777 42.668 76.7188 42.8516 76.8008 43.0039C76.8867 43.1562 76.998 43.2773 77.1348 43.3672C77.2715 43.4531 77.4219 43.5156 77.5859 43.5547C77.75 43.5938 77.916 43.6133 78.084 43.6133C78.4043 43.6133 78.6836 43.5566 78.9219 43.4434C79.1641 43.3262 79.3613 43.1738 79.5137 42.9863C79.666 42.7988 79.7793 42.584 79.8535 42.3418C79.9316 42.0957 79.9707 41.8438 79.9707 41.5859ZM82.7715 39.6934C82.7715 39.5332 82.7656 39.3281 82.7539 39.0781C82.7461 38.8242 82.7344 38.6016 82.7188 38.4102H83.3457C83.3613 38.5703 83.373 38.7578 83.3809 38.9727C83.3887 39.1875 83.3926 39.3711 83.3926 39.5234H83.416C83.5762 39.1172 83.8203 38.8066 84.1484 38.5918C84.4766 38.373 84.8438 38.2637 85.25 38.2637C85.3398 38.2637 85.418 38.2656 85.4844 38.2695C85.5547 38.2734 85.625 38.2871 85.6953 38.3105L85.625 38.9141C85.5859 38.8984 85.5215 38.8867 85.4316 38.8789C85.3457 38.8672 85.2578 38.8613 85.168 38.8613C84.6562 38.8613 84.2383 39.0605 83.9141 39.459C83.5898 39.8535 83.4277 40.4121 83.4277 41.1348V44H82.7715V39.6934Z" fill="white"/>
<rect width="78" height="39" transform="translate(20 79)" fill="#FC3D55"/>
<path d="M32.7324 98.752C32.7324 98.1035 32.8418 97.5059 33.0605 96.959C33.2832 96.4121 33.5898 95.9414 33.9805 95.5469C34.3711 95.1484 34.834 94.8379 35.3691 94.6152C35.9082 94.3887 36.4922 94.2754 37.1211 94.2754C37.7461 94.2754 38.3145 94.3809 38.8262 94.5918C39.3379 94.7988 39.7461 95.1055 40.0508 95.5117L39.5586 95.9688C39.3125 95.6562 38.9785 95.3984 38.5566 95.1953C38.1387 94.9922 37.666 94.8906 37.1387 94.8906C36.5684 94.8906 36.0547 94.9922 35.5977 95.1953C35.1445 95.3984 34.7598 95.6758 34.4434 96.0273C34.127 96.3789 33.8828 96.7891 33.7109 97.2578C33.5391 97.7266 33.4531 98.2246 33.4531 98.752C33.4531 99.2715 33.5391 99.7656 33.7109 100.234C33.8828 100.703 34.127 101.113 34.4434 101.465C34.7598 101.816 35.1445 102.096 35.5977 102.303C36.0547 102.51 36.5684 102.613 37.1387 102.613C37.6348 102.613 38.0957 102.523 38.5215 102.344C38.9512 102.164 39.3574 101.838 39.7402 101.365L40.209 101.74C39.8496 102.197 39.4238 102.561 38.9316 102.83C38.4395 103.096 37.832 103.229 37.1094 103.229C36.4727 103.229 35.8848 103.117 35.3457 102.895C34.8105 102.668 34.3496 102.357 33.9629 101.963C33.5762 101.564 33.2734 101.092 33.0547 100.545C32.8398 99.998 32.7324 99.4004 32.7324 98.752ZM41.2168 100.205C41.2168 99.7793 41.2891 99.3867 41.4336 99.0273C41.5781 98.668 41.7793 98.3594 42.0371 98.1016C42.2988 97.8398 42.6094 97.6348 42.9688 97.4863C43.3281 97.3379 43.7246 97.2637 44.1582 97.2637C44.5879 97.2637 44.9844 97.3379 45.3477 97.4863C45.7148 97.6348 46.0273 97.8398 46.2852 98.1016C46.5469 98.3594 46.748 98.668 46.8887 99.0273C47.0332 99.3867 47.1055 99.7793 47.1055 100.205C47.1055 100.627 47.0332 101.02 46.8887 101.383C46.748 101.742 46.5469 102.055 46.2852 102.32C46.0273 102.582 45.7148 102.787 45.3477 102.936C44.9844 103.084 44.5879 103.158 44.1582 103.158C43.7246 103.158 43.3281 103.084 42.9688 102.936C42.6094 102.787 42.2988 102.582 42.0371 102.32C41.7793 102.055 41.5781 101.742 41.4336 101.383C41.2891 101.02 41.2168 100.627 41.2168 100.205ZM46.4375 100.205C46.4375 99.8691 46.3848 99.5566 46.2793 99.2676C46.1738 98.9785 46.0215 98.7285 45.8223 98.5176C45.623 98.3066 45.3828 98.1387 45.1016 98.0137C44.8242 97.8887 44.5098 97.8262 44.1582 97.8262C43.8027 97.8262 43.4863 97.8887 43.209 98.0137C42.9355 98.1387 42.6992 98.3066 42.5 98.5176C42.3008 98.7285 42.1484 98.9785 42.043 99.2676C41.9414 99.5566 41.8906 99.8691 41.8906 100.205C41.8906 100.541 41.9414 100.854 42.043 101.143C42.1484 101.428 42.3008 101.678 42.5 101.893C42.6992 102.104 42.9355 102.27 43.209 102.391C43.4863 102.508 43.8027 102.566 44.1582 102.566C44.5098 102.566 44.8242 102.508 45.1016 102.391C45.3828 102.27 45.623 102.104 45.8223 101.893C46.0215 101.678 46.1738 101.428 46.2793 101.143C46.3848 100.854 46.4375 100.541 46.4375 100.205ZM48.9512 98.6934C48.9512 98.5332 48.9453 98.3281 48.9336 98.0781C48.9258 97.8242 48.9141 97.6016 48.8984 97.4102H49.5254C49.541 97.5703 49.5527 97.7578 49.5605 97.9727C49.5684 98.1875 49.5723 98.3711 49.5723 98.5234H49.5957C49.6777 98.332 49.7871 98.1582 49.9238 98.002C50.0645 97.8457 50.2246 97.7148 50.4043 97.6094C50.584 97.5 50.7754 97.416 50.9785 97.3574C51.1855 97.2949 51.3926 97.2637 51.5996 97.2637C51.9668 97.2637 52.2812 97.3242 52.543 97.4453C52.8086 97.5625 53.0254 97.7266 53.1934 97.9375C53.3652 98.1445 53.4902 98.3906 53.5684 98.6758C53.6465 98.957 53.6855 99.2617 53.6855 99.5898V103H53.041V99.8301C53.041 99.5605 53.0156 99.3027 52.9648 99.0566C52.918 98.8066 52.834 98.5918 52.7129 98.4121C52.5957 98.2324 52.4336 98.0879 52.2266 97.9785C52.0234 97.8691 51.7676 97.8145 51.459 97.8145C51.2168 97.8145 50.9824 97.8633 50.7559 97.9609C50.5332 98.0547 50.3359 98.2012 50.1641 98.4004C49.9922 98.5957 49.8555 98.8398 49.7539 99.1328C49.6562 99.4219 49.6074 99.7637 49.6074 100.158V103H48.9512V98.6934ZM56.041 101.658V97.9609H54.8633V97.4102H56.0293V95.8105H56.6914V97.4102H58.2852V97.9609H56.6914V101.5C56.6914 101.898 56.7734 102.17 56.9375 102.314C57.1016 102.459 57.3145 102.531 57.5762 102.531C57.8184 102.531 58.0469 102.48 58.2617 102.379L58.2969 102.941C58.1602 102.988 58.0195 103.025 57.875 103.053C57.7344 103.08 57.5801 103.094 57.4121 103.094C57.2441 103.094 57.0781 103.07 56.9141 103.023C56.75 102.977 56.6035 102.896 56.4746 102.783C56.3457 102.67 56.2402 102.521 56.1582 102.338C56.0801 102.154 56.041 101.928 56.041 101.658ZM59.4922 95.1895C59.4922 95.0449 59.541 94.9277 59.6387 94.8379C59.7402 94.7441 59.8516 94.6973 59.9727 94.6973C60.1016 94.6973 60.2148 94.7441 60.3125 94.8379C60.4141 94.9277 60.4648 95.0449 60.4648 95.1895C60.4648 95.334 60.4141 95.4531 60.3125 95.5469C60.2148 95.6367 60.1016 95.6816 59.9727 95.6816C59.8516 95.6816 59.7402 95.6367 59.6387 95.5469C59.541 95.4531 59.4922 95.334 59.4922 95.1895ZM59.6504 97.4102H60.3066V103H59.6504V97.4102ZM62.5684 98.6934C62.5684 98.5332 62.5625 98.3281 62.5508 98.0781C62.543 97.8242 62.5312 97.6016 62.5156 97.4102H63.1426C63.1582 97.5703 63.1699 97.7578 63.1777 97.9727C63.1855 98.1875 63.1895 98.3711 63.1895 98.5234H63.2129C63.2949 98.332 63.4043 98.1582 63.541 98.002C63.6816 97.8457 63.8418 97.7148 64.0215 97.6094C64.2012 97.5 64.3926 97.416 64.5957 97.3574C64.8027 97.2949 65.0098 97.2637 65.2168 97.2637C65.584 97.2637 65.8984 97.3242 66.1602 97.4453C66.4258 97.5625 66.6426 97.7266 66.8105 97.9375C66.9824 98.1445 67.1074 98.3906 67.1855 98.6758C67.2637 98.957 67.3027 99.2617 67.3027 99.5898V103H66.6582V99.8301C66.6582 99.5605 66.6328 99.3027 66.582 99.0566C66.5352 98.8066 66.4512 98.5918 66.3301 98.4121C66.2129 98.2324 66.0508 98.0879 65.8438 97.9785C65.6406 97.8691 65.3848 97.8145 65.0762 97.8145C64.834 97.8145 64.5996 97.8633 64.373 97.9609C64.1504 98.0547 63.9531 98.2012 63.7812 98.4004C63.6094 98.5957 63.4727 98.8398 63.3711 99.1328C63.2734 99.4219 63.2246 99.7637 63.2246 100.158V103H62.5684V98.6934ZM69.4297 100.826V97.4102H70.0918V100.574C70.0918 100.855 70.1152 101.119 70.1621 101.365C70.209 101.607 70.293 101.82 70.4141 102.004C70.5352 102.188 70.6973 102.334 70.9004 102.443C71.1035 102.549 71.3613 102.602 71.6738 102.602C71.916 102.602 72.1484 102.553 72.3711 102.455C72.5938 102.354 72.7891 102.205 72.957 102.01C73.125 101.814 73.2617 101.57 73.3672 101.277C73.4727 100.984 73.5254 100.643 73.5254 100.252V97.4102H74.1699V101.717C74.1699 101.877 74.1758 102.086 74.1875 102.344C74.1992 102.598 74.2129 102.816 74.2285 103H73.5957C73.5801 102.848 73.5684 102.662 73.5605 102.443C73.5527 102.221 73.5488 102.039 73.5488 101.898H73.5254C73.4434 102.09 73.332 102.264 73.1914 102.42C73.0508 102.576 72.8945 102.709 72.7227 102.818C72.5508 102.924 72.3633 103.006 72.1602 103.064C71.957 103.127 71.748 103.158 71.5332 103.158C71.1621 103.158 70.8438 103.098 70.5781 102.977C70.3164 102.855 70.0996 102.691 69.9277 102.484C69.7559 102.277 69.6289 102.031 69.5469 101.746C69.4688 101.461 69.4297 101.154 69.4297 100.826ZM76.0098 101.488C76.0098 101.09 76.1074 100.768 76.3027 100.521C76.498 100.271 76.7559 100.08 77.0762 99.9473C77.3965 99.8145 77.7578 99.7266 78.1602 99.6836C78.5664 99.6367 78.9805 99.6133 79.4023 99.6133H79.9707V99.3613C79.9707 98.834 79.832 98.4434 79.5547 98.1895C79.2773 97.9316 78.8867 97.8027 78.3828 97.8027C78.0469 97.8027 77.7363 97.8633 77.4512 97.9844C77.1699 98.1055 76.9258 98.2656 76.7188 98.4648L76.3555 98.0312C76.5898 97.8008 76.8887 97.6152 77.252 97.4746C77.6152 97.334 78.0137 97.2637 78.4473 97.2637C78.7559 97.2637 79.041 97.3066 79.3027 97.3926C79.5645 97.4746 79.791 97.5996 79.9824 97.7676C80.1738 97.9355 80.3223 98.1465 80.4277 98.4004C80.5371 98.6504 80.5918 98.9473 80.5918 99.291V101.74C80.5918 101.955 80.5996 102.18 80.6152 102.414C80.6309 102.645 80.6562 102.84 80.6914 103H80.0996C80.0762 102.855 80.0547 102.686 80.0352 102.49C80.0156 102.295 80.0059 102.121 80.0059 101.969H79.9824C79.748 102.375 79.4609 102.676 79.1211 102.871C78.7812 103.062 78.3828 103.158 77.9258 103.158C77.7109 103.158 77.4883 103.127 77.2578 103.064C77.0312 103.006 76.8262 102.908 76.6426 102.771C76.459 102.635 76.3066 102.463 76.1855 102.256C76.0684 102.049 76.0098 101.793 76.0098 101.488ZM79.9707 100.586V100.135H79.5488C79.2207 100.135 78.8887 100.148 78.5527 100.176C78.2168 100.203 77.9082 100.264 77.627 100.357C77.3496 100.447 77.1211 100.58 76.9414 100.756C76.7656 100.932 76.6777 101.164 76.6777 101.453C76.6777 101.668 76.7188 101.852 76.8008 102.004C76.8867 102.156 76.998 102.277 77.1348 102.367C77.2715 102.453 77.4219 102.516 77.5859 102.555C77.75 102.594 77.916 102.613 78.084 102.613C78.4043 102.613 78.6836 102.557 78.9219 102.443C79.1641 102.326 79.3613 102.174 79.5137 101.986C79.666 101.799 79.7793 101.584 79.8535 101.342C79.9316 101.096 79.9707 100.844 79.9707 100.586ZM82.7715 98.6934C82.7715 98.5332 82.7656 98.3281 82.7539 98.0781C82.7461 97.8242 82.7344 97.6016 82.7188 97.4102H83.3457C83.3613 97.5703 83.373 97.7578 83.3809 97.9727C83.3887 98.1875 83.3926 98.3711 83.3926 98.5234H83.416C83.5762 98.1172 83.8203 97.8066 84.1484 97.5918C84.4766 97.373 84.8438 97.2637 85.25 97.2637C85.3398 97.2637 85.418 97.2656 85.4844 97.2695C85.5547 97.2734 85.625 97.2871 85.6953 97.3105L85.625 97.9141C85.5859 97.8984 85.5215 97.8867 85.4316 97.8789C85.3457 97.8672 85.2578 97.8613 85.168 97.8613C84.6562 97.8613 84.2383 98.0605 83.9141 98.459C83.5898 98.8535 83.4277 99.4121 83.4277 100.135V103H82.7715V98.6934Z" fill="white"/>
</svg>
</div>`}
          cssCode={`:root {
  --color-primary: #9747ff;
  --color-secondary: #fc3d55;
  --color-accent-2: #ffffff;
  --radius: 5px;
}

.root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  width: 118px;
  height: 138px;
  border-radius: var(--radius, 5px);
  font-family: "Avenir Next LT Pro", system-ui, sans-serif;
  font-size: 12px;
  overflow: hidden;
}

.root svg {
  width: 100%;
  height: 100%;
  display: block;
}`}
          svgCode={`<svg width="118" height="138" viewBox="0 0 118 138" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="117" height="137" rx="4.5" stroke="#9747FF" stroke-dasharray="10 5"/>
<rect width="78" height="39" transform="translate(20 20)" fill="#FC3D55"/>
<path d="M32.7324 39.752C32.7324 39.1035 32.8418 38.5059 33.0605 37.959C33.2832 37.4121 33.5898 36.9414 33.9805 36.5469C34.3711 36.1484 34.834 35.8379 35.3691 35.6152C35.9082 35.3887 36.4922 35.2754 37.1211 35.2754C37.7461 35.2754 38.3145 35.3809 38.8262 35.5918C39.3379 35.7988 39.7461 36.1055 40.0508 36.5117L39.5586 36.9688C39.3125 36.6562 38.9785 36.3984 38.5566 36.1953C38.1387 35.9922 37.666 35.8906 37.1387 35.8906C36.5684 35.8906 36.0547 35.9922 35.5977 36.1953C35.1445 36.3984 34.7598 36.6758 34.4434 37.0273C34.127 37.3789 33.8828 37.7891 33.7109 38.2578C33.5391 38.7266 33.4531 39.2246 33.4531 39.752C33.4531 40.2715 33.5391 40.7656 33.7109 41.2344C33.8828 41.7031 34.127 42.1133 34.4434 42.4648C34.7598 42.8164 35.1445 43.0957 35.5977 43.3027C36.0547 43.5098 36.5684 43.6133 37.1387 43.6133C37.6348 43.6133 38.0957 43.5234 38.5215 43.3438C38.9512 43.1641 39.3574 42.8379 39.7402 42.3652L40.209 42.7402C39.8496 43.1973 39.4238 43.5605 38.9316 43.8301C38.4395 44.0957 37.832 44.2285 37.1094 44.2285C36.4727 44.2285 35.8848 44.1172 35.3457 43.8945C34.8105 43.668 34.3496 43.3574 33.9629 42.9629C33.5762 42.5645 33.2734 42.0918 33.0547 41.5449C32.8398 40.998 32.7324 40.4004 32.7324 39.752ZM41.2168 41.2051C41.2168 40.7793 41.2891 40.3867 41.4336 40.0273C41.5781 39.668 41.7793 39.3594 42.0371 39.1016C42.2988 38.8398 42.6094 38.6348 42.9688 38.4863C43.3281 38.3379 43.7246 38.2637 44.1582 38.2637C44.5879 38.2637 44.9844 38.3379 45.3477 38.4863C45.7148 38.6348 46.0273 38.8398 46.2852 39.1016C46.5469 39.3594 46.748 39.668 46.8887 40.0273C47.0332 40.3867 47.1055 40.7793 47.1055 41.2051C47.1055 41.627 47.0332 42.0195 46.8887 42.3828C46.748 42.7422 46.5469 43.0547 46.2852 43.3203C46.0273 43.582 45.7148 43.7871 45.3477 43.9355C44.9844 44.084 44.5879 44.1582 44.1582 44.1582C43.7246 44.1582 43.3281 44.084 42.9688 43.9355C42.6094 43.7871 42.2988 43.582 42.0371 43.3203C41.7793 43.0547 41.5781 42.7422 41.4336 42.3828C41.2891 42.0195 41.2168 41.627 41.2168 41.2051ZM46.4375 41.2051C46.4375 40.8691 46.3848 40.5566 46.2793 40.2676C46.1738 39.9785 46.0215 39.7285 45.8223 39.5176C45.623 39.3066 45.3828 39.1387 45.1016 39.0137C44.8242 38.8887 44.5098 38.8262 44.1582 38.8262C43.8027 38.8262 43.4863 38.8887 43.209 39.0137C42.9355 39.1387 42.6992 39.3066 42.5 39.5176C42.3008 39.7285 42.1484 39.9785 42.043 40.2676C41.9414 40.5566 41.8906 40.8691 41.8906 41.2051C41.8906 41.541 41.9414 41.8535 42.043 42.1426C42.1484 42.4277 42.3008 42.6777 42.5 42.8926C42.6992 43.1035 42.9355 43.2695 43.209 43.3906C43.4863 43.5078 43.8027 43.5664 44.1582 43.5664C44.5098 43.5664 44.8242 43.5078 45.1016 43.3906C45.3828 43.2695 45.623 43.1035 45.8223 42.8926C46.0215 42.6777 46.1738 42.4277 46.2793 42.1426C46.3848 41.8535 46.4375 41.541 46.4375 41.2051ZM48.9512 39.6934C48.9512 39.5332 48.9453 39.3281 48.9336 39.0781C48.9258 38.8242 48.9141 38.6016 48.8984 38.4102H49.5254C49.541 38.5703 49.5527 38.7578 49.5605 38.9727C49.5684 39.1875 49.5723 39.3711 49.5723 39.5234H49.5957C49.6777 39.332 49.7871 39.1582 49.9238 39.002C50.0645 38.8457 50.2246 38.7148 50.4043 38.6094C50.584 38.5 50.7754 38.416 50.9785 38.3574C51.1855 38.2949 51.3926 38.2637 51.5996 38.2637C51.9668 38.2637 52.2812 38.3242 52.543 38.4453C52.8086 38.5625 53.0254 38.7266 53.1934 38.9375C53.3652 39.1445 53.4902 39.3906 53.5684 39.6758C53.6465 39.957 53.6855 40.2617 53.6855 40.5898V44H53.041V40.8301C53.041 40.5605 53.0156 40.3027 52.9648 40.0566C52.918 39.8066 52.834 39.5918 52.7129 39.4121C52.5957 39.2324 52.4336 39.0879 52.2266 38.9785C52.0234 38.8691 51.7676 38.8145 51.459 38.8145C51.2168 38.8145 50.9824 38.8633 50.7559 38.9609C50.5332 39.0547 50.3359 39.2012 50.1641 39.4004C49.9922 39.5957 49.8555 39.8398 49.7539 40.1328C49.6562 40.4219 49.6074 40.7637 49.6074 41.1582V44H48.9512V39.6934ZM56.041 42.6582V38.9609H54.8633V38.4102H56.0293V36.8105H56.6914V38.4102H58.2852V38.9609H56.6914V42.5C56.6914 42.8984 56.7734 43.1699 56.9375 43.3145C57.1016 43.459 57.3145 43.5312 57.5762 43.5312C57.8184 43.5312 58.0469 43.4805 58.2617 43.3789L58.2969 43.9414C58.1602 43.9883 58.0195 44.0254 57.875 44.0527C57.7344 44.0801 57.5801 44.0938 57.4121 44.0938C57.2441 44.0938 57.0781 44.0703 56.9141 44.0234C56.75 43.9766 56.6035 43.8965 56.4746 43.7832C56.3457 43.6699 56.2402 43.5215 56.1582 43.3379C56.0801 43.1543 56.041 42.9277 56.041 42.6582ZM59.4922 36.1895C59.4922 36.0449 59.541 35.9277 59.6387 35.8379C59.7402 35.7441 59.8516 35.6973 59.9727 35.6973C60.1016 35.6973 60.2148 35.7441 60.3125 35.8379C60.4141 35.9277 60.4648 36.0449 60.4648 36.1895C60.4648 36.334 60.4141 36.4531 60.3125 36.5469C60.2148 36.6367 60.1016 36.6816 59.9727 36.6816C59.8516 36.6816 59.7402 36.6367 59.6387 36.5469C59.541 36.4531 59.4922 36.334 59.4922 36.1895ZM59.6504 38.4102H60.3066V44H59.6504V38.4102ZM62.5684 39.6934C62.5684 39.5332 62.5625 39.3281 62.5508 39.0781C62.543 38.8242 62.5312 38.6016 62.5156 38.4102H63.1426C63.1582 38.5703 63.1699 38.7578 63.1777 38.9727C63.1855 39.1875 63.1895 39.3711 63.1895 39.5234H63.2129C63.2949 39.332 63.4043 39.1582 63.541 39.002C63.6816 38.8457 63.8418 38.7148 64.0215 38.6094C64.2012 38.5 64.3926 38.416 64.5957 38.3574C64.8027 38.2949 65.0098 38.2637 65.2168 38.2637C65.584 38.2637 65.8984 38.3242 66.1602 38.4453C66.4258 38.5625 66.6426 38.7266 66.8105 38.9375C66.9824 39.1445 67.1074 39.3906 67.1855 39.6758C67.2637 39.957 67.3027 40.2617 67.3027 40.5898V44H66.6582V40.8301C66.6582 40.5605 66.6328 40.3027 66.582 40.0566C66.5352 39.8066 66.4512 39.5918 66.3301 39.4121C66.2129 39.2324 66.0508 39.0879 65.8438 38.9785C65.6406 38.8691 65.3848 38.8145 65.0762 38.8145C64.834 38.8145 64.5996 38.8633 64.373 38.9609C64.1504 39.0547 63.9531 39.2012 63.7812 39.4004C63.6094 39.5957 63.4727 39.8398 63.3711 40.1328C63.2734 40.4219 63.2246 40.7637 63.2246 41.1582V44H62.5684V39.6934ZM69.4297 41.8262V38.4102H70.0918V41.5742C70.0918 41.8555 70.1152 42.1191 70.1621 42.3652C70.209 42.6074 70.293 42.8203 70.4141 43.0039C70.5352 43.1875 70.6973 43.334 70.9004 43.4434C71.1035 43.5488 71.3613 43.6016 71.6738 43.6016C71.916 43.6016 72.1484 43.5527 72.3711 43.4551C72.5938 43.3535 72.7891 43.2051 72.957 43.0098C73.125 42.8145 73.2617 42.5703 73.3672 42.2773C73.4727 41.9844 73.5254 41.6426 73.5254 41.252V38.4102H74.1699V42.7168C74.1699 42.877 74.1758 43.0859 74.1875 43.3438C74.1992 43.5977 74.2129 43.8164 74.2285 44H73.5957C73.5801 43.8477 73.5684 43.6621 73.5605 43.4434C73.5527 43.2207 73.5488 43.0391 73.5488 42.8984H73.5254C73.4434 43.0898 73.332 43.2637 73.1914 43.4199C73.0508 43.5762 72.8945 43.709 72.7227 43.8184C72.5508 43.9238 72.3633 44.0059 72.1602 44.0645C71.957 44.127 71.748 44.1582 71.5332 44.1582C71.1621 44.1582 70.8438 44.0977 70.5781 43.9766C70.3164 43.8555 70.0996 43.6914 69.9277 43.4844C69.7559 43.2773 69.6289 43.0312 69.5469 42.7461C69.4688 42.4609 69.4297 42.1543 69.4297 41.8262ZM76.0098 42.4883C76.0098 42.0898 76.1074 41.7676 76.3027 41.5215C76.498 41.2715 76.7559 41.0801 77.0762 40.9473C77.3965 40.8145 77.7578 40.7266 78.1602 40.6836C78.5664 40.6367 78.9805 40.6133 79.4023 40.6133H79.9707V40.3613C79.9707 39.834 79.832 39.4434 79.5547 39.1895C79.2773 38.9316 78.8867 38.8027 78.3828 38.8027C78.0469 38.8027 77.7363 38.8633 77.4512 38.9844C77.1699 39.1055 76.9258 39.2656 76.7188 39.4648L76.3555 39.0312C76.5898 38.8008 76.8887 38.6152 77.252 38.4746C77.6152 38.334 78.0137 38.2637 78.4473 38.2637C78.7559 38.2637 79.041 38.3066 79.3027 38.3926C79.5645 38.4746 79.791 38.5996 79.9824 38.7676C80.1738 38.9355 80.3223 39.1465 80.4277 39.4004C80.5371 39.6504 80.5918 39.9473 80.5918 40.291V42.7402C80.5918 42.9551 80.5996 43.1797 80.6152 43.4141C80.6309 43.6445 80.6562 43.8398 80.6914 44H80.0996C80.0762 43.8555 80.0547 43.6855 80.0352 43.4902C80.0156 43.2949 80.0059 43.1211 80.0059 42.9688H79.9824C79.748 43.375 79.4609 43.6758 79.1211 43.8711C78.7812 44.0625 78.3828 44.1582 77.9258 44.1582C77.7109 44.1582 77.4883 44.127 77.2578 44.0645C77.0312 44.0059 76.8262 43.9082 76.6426 43.7715C76.459 43.6348 76.3066 43.4629 76.1855 43.2559C76.0684 43.0488 76.0098 42.793 76.0098 42.4883ZM79.9707 41.5859V41.1348H79.5488C79.2207 41.1348 78.8887 41.1484 78.5527 41.1758C78.2168 41.2031 77.9082 41.2637 77.627 41.3574C77.3496 41.4473 77.1211 41.5801 76.9414 41.7559C76.7656 41.9316 76.6777 42.1641 76.6777 42.4531C76.6777 42.668 76.7188 42.8516 76.8008 43.0039C76.8867 43.1562 76.998 43.2773 77.1348 43.3672C77.2715 43.4531 77.4219 43.5156 77.5859 43.5547C77.75 43.5938 77.916 43.6133 78.084 43.6133C78.4043 43.6133 78.6836 43.5566 78.9219 43.4434C79.1641 43.3262 79.3613 43.1738 79.5137 42.9863C79.666 42.7988 79.7793 42.584 79.8535 42.3418C79.9316 42.0957 79.9707 41.8438 79.9707 41.5859ZM82.7715 39.6934C82.7715 39.5332 82.7656 39.3281 82.7539 39.0781C82.7461 38.8242 82.7344 38.6016 82.7188 38.4102H83.3457C83.3613 38.5703 83.373 38.7578 83.3809 38.9727C83.3887 39.1875 83.3926 39.3711 83.3926 39.5234H83.416C83.5762 39.1172 83.8203 38.8066 84.1484 38.5918C84.4766 38.373 84.8438 38.2637 85.25 38.2637C85.3398 38.2637 85.418 38.2656 85.4844 38.2695C85.5547 38.2734 85.625 38.2871 85.6953 38.3105L85.625 38.9141C85.5859 38.8984 85.5215 38.8867 85.4316 38.8789C85.3457 38.8672 85.2578 38.8613 85.168 38.8613C84.6562 38.8613 84.2383 39.0605 83.9141 39.459C83.5898 39.8535 83.4277 40.4121 83.4277 41.1348V44H82.7715V39.6934Z" fill="white"/>
<rect width="78" height="39" transform="translate(20 79)" fill="#FC3D55"/>
<path d="M32.7324 98.752C32.7324 98.1035 32.8418 97.5059 33.0605 96.959C33.2832 96.4121 33.5898 95.9414 33.9805 95.5469C34.3711 95.1484 34.834 94.8379 35.3691 94.6152C35.9082 94.3887 36.4922 94.2754 37.1211 94.2754C37.7461 94.2754 38.3145 94.3809 38.8262 94.5918C39.3379 94.7988 39.7461 95.1055 40.0508 95.5117L39.5586 95.9688C39.3125 95.6562 38.9785 95.3984 38.5566 95.1953C38.1387 94.9922 37.666 94.8906 37.1387 94.8906C36.5684 94.8906 36.0547 94.9922 35.5977 95.1953C35.1445 95.3984 34.7598 95.6758 34.4434 96.0273C34.127 96.3789 33.8828 96.7891 33.7109 97.2578C33.5391 97.7266 33.4531 98.2246 33.4531 98.752C33.4531 99.2715 33.5391 99.7656 33.7109 100.234C33.8828 100.703 34.127 101.113 34.4434 101.465C34.7598 101.816 35.1445 102.096 35.5977 102.303C36.0547 102.51 36.5684 102.613 37.1387 102.613C37.6348 102.613 38.0957 102.523 38.5215 102.344C38.9512 102.164 39.3574 101.838 39.7402 101.365L40.209 101.74C39.8496 102.197 39.4238 102.561 38.9316 102.83C38.4395 103.096 37.832 103.229 37.1094 103.229C36.4727 103.229 35.8848 103.117 35.3457 102.895C34.8105 102.668 34.3496 102.357 33.9629 101.963C33.5762 101.564 33.2734 101.092 33.0547 100.545C32.8398 99.998 32.7324 99.4004 32.7324 98.752ZM41.2168 100.205C41.2168 99.7793 41.2891 99.3867 41.4336 99.0273C41.5781 98.668 41.7793 98.3594 42.0371 98.1016C42.2988 97.8398 42.6094 97.6348 42.9688 97.4863C43.3281 97.3379 43.7246 97.2637 44.1582 97.2637C44.5879 97.2637 44.9844 97.3379 45.3477 97.4863C45.7148 97.6348 46.0273 97.8398 46.2852 98.1016C46.5469 98.3594 46.748 98.668 46.8887 99.0273C47.0332 99.3867 47.1055 99.7793 47.1055 100.205C47.1055 100.627 47.0332 101.02 46.8887 101.383C46.748 101.742 46.5469 102.055 46.2852 102.32C46.0273 102.582 45.7148 102.787 45.3477 102.936C44.9844 103.084 44.5879 103.158 44.1582 103.158C43.7246 103.158 43.3281 103.084 42.9688 102.936C42.6094 102.787 42.2988 102.582 42.0371 102.32C41.7793 102.055 41.5781 101.742 41.4336 101.383C41.2891 101.02 41.2168 100.627 41.2168 100.205ZM46.4375 100.205C46.4375 99.8691 46.3848 99.5566 46.2793 99.2676C46.1738 98.9785 46.0215 98.7285 45.8223 98.5176C45.623 98.3066 45.3828 98.1387 45.1016 98.0137C44.8242 97.8887 44.5098 97.8262 44.1582 97.8262C43.8027 97.8262 43.4863 97.8887 43.209 98.0137C42.9355 98.1387 42.6992 98.3066 42.5 98.5176C42.3008 98.7285 42.1484 98.9785 42.043 99.2676C41.9414 99.5566 41.8906 99.8691 41.8906 100.205C41.8906 100.541 41.9414 100.854 42.043 101.143C42.1484 101.428 42.3008 101.678 42.5 101.893C42.6992 102.104 42.9355 102.27 43.209 102.391C43.4863 102.508 43.8027 102.566 44.1582 102.566C44.5098 102.566 44.8242 102.508 45.1016 102.391C45.3828 102.27 45.623 102.104 45.8223 101.893C46.0215 101.678 46.1738 101.428 46.2793 101.143C46.3848 100.854 46.4375 100.541 46.4375 100.205ZM48.9512 98.6934C48.9512 98.5332 48.9453 98.3281 48.9336 98.0781C48.9258 97.8242 48.9141 97.6016 48.8984 97.4102H49.5254C49.541 97.5703 49.5527 97.7578 49.5605 97.9727C49.5684 98.1875 49.5723 98.3711 49.5723 98.5234H49.5957C49.6777 98.332 49.7871 98.1582 49.9238 98.002C50.0645 97.8457 50.2246 97.7148 50.4043 97.6094C50.584 97.5 50.7754 97.416 50.9785 97.3574C51.1855 97.2949 51.3926 97.2637 51.5996 97.2637C51.9668 97.2637 52.2812 97.3242 52.543 97.4453C52.8086 97.5625 53.0254 97.7266 53.1934 97.9375C53.3652 98.1445 53.4902 98.3906 53.5684 98.6758C53.6465 98.957 53.6855 99.2617 53.6855 99.5898V103H53.041V99.8301C53.041 99.5605 53.0156 99.3027 52.9648 99.0566C52.918 98.8066 52.834 98.5918 52.7129 98.4121C52.5957 98.2324 52.4336 98.0879 52.2266 97.9785C52.0234 97.8691 51.7676 97.8145 51.459 97.8145C51.2168 97.8145 50.9824 97.8633 50.7559 97.9609C50.5332 98.0547 50.3359 98.2012 50.1641 98.4004C49.9922 98.5957 49.8555 98.8398 49.7539 99.1328C49.6562 99.4219 49.6074 99.7637 49.6074 100.158V103H48.9512V98.6934ZM56.041 101.658V97.9609H54.8633V97.4102H56.0293V95.8105H56.6914V97.4102H58.2852V97.9609H56.6914V101.5C56.6914 101.898 56.7734 102.17 56.9375 102.314C57.1016 102.459 57.3145 102.531 57.5762 102.531C57.8184 102.531 58.0469 102.48 58.2617 102.379L58.2969 102.941C58.1602 102.988 58.0195 103.025 57.875 103.053C57.7344 103.08 57.5801 103.094 57.4121 103.094C57.2441 103.094 57.0781 103.07 56.9141 103.023C56.75 102.977 56.6035 102.896 56.4746 102.783C56.3457 102.67 56.2402 102.521 56.1582 102.338C56.0801 102.154 56.041 101.928 56.041 101.658ZM59.4922 95.1895C59.4922 95.0449 59.541 94.9277 59.6387 94.8379C59.7402 94.7441 59.8516 94.6973 59.9727 94.6973C60.1016 94.6973 60.2148 94.7441 60.3125 94.8379C60.4141 94.9277 60.4648 95.0449 60.4648 95.1895C60.4648 95.334 60.4141 95.4531 60.3125 95.5469C60.2148 95.6367 60.1016 95.6816 59.9727 95.6816C59.8516 95.6816 59.7402 95.6367 59.6387 95.5469C59.541 95.4531 59.4922 95.334 59.4922 95.1895ZM59.6504 97.4102H60.3066V103H59.6504V97.4102ZM62.5684 98.6934C62.5684 98.5332 62.5625 98.3281 62.5508 98.0781C62.543 97.8242 62.5312 97.6016 62.5156 97.4102H63.1426C63.1582 97.5703 63.1699 97.7578 63.1777 97.9727C63.1855 98.1875 63.1895 98.3711 63.1895 98.5234H63.2129C63.2949 98.332 63.4043 98.1582 63.541 98.002C63.6816 97.8457 63.8418 97.7148 64.0215 97.6094C64.2012 97.5 64.3926 97.416 64.5957 97.3574C64.8027 97.2949 65.0098 97.2637 65.2168 97.2637C65.584 97.2637 65.8984 97.3242 66.1602 97.4453C66.4258 97.5625 66.6426 97.7266 66.8105 97.9375C66.9824 98.1445 67.1074 98.3906 67.1855 98.6758C67.2637 98.957 67.3027 99.2617 67.3027 99.5898V103H66.6582V99.8301C66.6582 99.5605 66.6328 99.3027 66.582 99.0566C66.5352 98.8066 66.4512 98.5918 66.3301 98.4121C66.2129 98.2324 66.0508 98.0879 65.8438 97.9785C65.6406 97.8691 65.3848 97.8145 65.0762 97.8145C64.834 97.8145 64.5996 97.8633 64.373 97.9609C64.1504 98.0547 63.9531 98.2012 63.7812 98.4004C63.6094 98.5957 63.4727 98.8398 63.3711 99.1328C63.2734 99.4219 63.2246 99.7637 63.2246 100.158V103H62.5684V98.6934ZM69.4297 100.826V97.4102H70.0918V100.574C70.0918 100.855 70.1152 101.119 70.1621 101.365C70.209 101.607 70.293 101.82 70.4141 102.004C70.5352 102.188 70.6973 102.334 70.9004 102.443C71.1035 102.549 71.3613 102.602 71.6738 102.602C71.916 102.602 72.1484 102.553 72.3711 102.455C72.5938 102.354 72.7891 102.205 72.957 102.01C73.125 101.814 73.2617 101.57 73.3672 101.277C73.4727 100.984 73.5254 100.643 73.5254 100.252V97.4102H74.1699V101.717C74.1699 101.877 74.1758 102.086 74.1875 102.344C74.1992 102.598 74.2129 102.816 74.2285 103H73.5957C73.5801 102.848 73.5684 102.662 73.5605 102.443C73.5527 102.221 73.5488 102.039 73.5488 101.898H73.5254C73.4434 102.09 73.332 102.264 73.1914 102.42C73.0508 102.576 72.8945 102.709 72.7227 102.818C72.5508 102.924 72.3633 103.006 72.1602 103.064C71.957 103.127 71.748 103.158 71.5332 103.158C71.1621 103.158 70.8438 103.098 70.5781 102.977C70.3164 102.855 70.0996 102.691 69.9277 102.484C69.7559 102.277 69.6289 102.031 69.5469 101.746C69.4688 101.461 69.4297 101.154 69.4297 100.826ZM76.0098 101.488C76.0098 101.09 76.1074 100.768 76.3027 100.521C76.498 100.271 76.7559 100.08 77.0762 99.9473C77.3965 99.8145 77.7578 99.7266 78.1602 99.6836C78.5664 99.6367 78.9805 99.6133 79.4023 99.6133H79.9707V99.3613C79.9707 98.834 79.832 98.4434 79.5547 98.1895C79.2773 97.9316 78.8867 97.8027 78.3828 97.8027C78.0469 97.8027 77.7363 97.8633 77.4512 97.9844C77.1699 98.1055 76.9258 98.2656 76.7188 98.4648L76.3555 98.0312C76.5898 97.8008 76.8887 97.6152 77.252 97.4746C77.6152 97.334 78.0137 97.2637 78.4473 97.2637C78.7559 97.2637 79.041 97.3066 79.3027 97.3926C79.5645 97.4746 79.791 97.5996 79.9824 97.7676C80.1738 97.9355 80.3223 98.1465 80.4277 98.4004C80.5371 98.6504 80.5918 98.9473 80.5918 99.291V101.74C80.5918 101.955 80.5996 102.18 80.6152 102.414C80.6309 102.645 80.6562 102.84 80.6914 103H80.0996C80.0762 102.855 80.0547 102.686 80.0352 102.49C80.0156 102.295 80.0059 102.121 80.0059 101.969H79.9824C79.748 102.375 79.4609 102.676 79.1211 102.871C78.7812 103.062 78.3828 103.158 77.9258 103.158C77.7109 103.158 77.4883 103.127 77.2578 103.064C77.0312 103.006 76.8262 102.908 76.6426 102.771C76.459 102.635 76.3066 102.463 76.1855 102.256C76.0684 102.049 76.0098 101.793 76.0098 101.488ZM79.9707 100.586V100.135H79.5488C79.2207 100.135 78.8887 100.148 78.5527 100.176C78.2168 100.203 77.9082 100.264 77.627 100.357C77.3496 100.447 77.1211 100.58 76.9414 100.756C76.7656 100.932 76.6777 101.164 76.6777 101.453C76.6777 101.668 76.7188 101.852 76.8008 102.004C76.8867 102.156 76.998 102.277 77.1348 102.367C77.2715 102.453 77.4219 102.516 77.5859 102.555C77.75 102.594 77.916 102.613 78.084 102.613C78.4043 102.613 78.6836 102.557 78.9219 102.443C79.1641 102.326 79.3613 102.174 79.5137 101.986C79.666 101.799 79.7793 101.584 79.8535 101.342C79.9316 101.096 79.9707 100.844 79.9707 100.586ZM82.7715 98.6934C82.7715 98.5332 82.7656 98.3281 82.7539 98.0781C82.7461 97.8242 82.7344 97.6016 82.7188 97.4102H83.3457C83.3613 97.5703 83.373 97.7578 83.3809 97.9727C83.3887 98.1875 83.3926 98.3711 83.3926 98.5234H83.416C83.5762 98.1172 83.8203 97.8066 84.1484 97.5918C84.4766 97.373 84.8438 97.2637 85.25 97.2637C85.3398 97.2637 85.418 97.2656 85.4844 97.2695C85.5547 97.2734 85.625 97.2871 85.6953 97.3105L85.625 97.9141C85.5859 97.8984 85.5215 97.8867 85.4316 97.8789C85.3457 97.8672 85.2578 97.8613 85.168 97.8613C84.6562 97.8613 84.2383 98.0605 83.9141 98.459C83.5898 98.8535 83.4277 99.4121 83.4277 100.135V103H82.7715V98.6934Z" fill="white"/>
</svg>
`}
          aiCode={`// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface Frame2Props {
  property 1?: "Default" | "Variant2";
  className?: string;
  children?: React.ReactNode
}

const Frame2 = React.forwardRef<HTMLDivElement, Frame2Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[118px] h-[138px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Frame2.displayName = "Frame2"

export { Frame2 }
export default Frame2`}
          tokens={{
  "colors": [
    "#9747ff",
    "#fc3d55",
    "#ffffff"
  ],
  "typography": [
    {
      "fontFamily": "Avenir Next LT Pro",
      "fontSize": 12,
      "fontWeight": "Light"
    },
    {
      "fontFamily": "Avenir Next LT Pro",
      "fontSize": 12,
      "fontWeight": "Light"
    }
  ],
  "spacing": [],
  "borderRadius": [
    "5px"
  ],
  "shadows": []
}}
        />
      )}
          </main>
        </div>
      </div>
    </div>
  )
}
