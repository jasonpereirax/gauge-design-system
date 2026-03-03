import React, { useState } from "react"
import BottomSheet from "./components/BottomSheet/BottomSheet"

type Tokens = { colors: string[]; typography: Array<{fontFamily:string|null;fontSize:number;fontWeight:string|null}>; borderRadius: string[]; shadows: string[] }

interface ComponentDocProps {
  name: string
  description: string
  figmaUrl: string
  width: number
  height: number
  reactCode: string
  tailwindCode: string
  aiCode?: string
  tokens: Tokens
}

type CodeTab = "react" | "tailwind" | "ai"

function ComponentDoc({ name, description, figmaUrl, width, height, reactCode, tailwindCode, aiCode, tokens }: ComponentDocProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>("tailwind")
  const [copied, setCopied] = useState(false)

  const currentCode = activeTab === "ai" ? (aiCode || "") : activeTab === "react" ? reactCode : tailwindCode

  const copy = () => {
    navigator.clipboard.writeText(currentCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <p className="text-muted-foreground mt-2 text-lg">{description}</p>
          </div>
          {figmaUrl && (
            <a href={figmaUrl} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border rounded-md px-3 py-1.5 transition-colors">
              <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor"><path d="M6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/><path fillRule="evenodd" d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 0 4 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1-2-2V2zm2 8a2 2 0 0 0 2 2h2a2 2 0 0 0 0-4H4a2 2 0 0 0-2 2zm4-6a2 2 0 0 0 2 2V2H6v2zm0 4a2 2 0 0 0-2 2h2v-2zm0-4V2H2v2a2 2 0 0 0 2 2h2zm-4 4a2 2 0 0 0 2 2H4a2 2 0 0 0-2-2z"/></svg>
              Figma
            </a>
          )}
        </div>
        <div className="flex gap-3 mt-4 text-sm text-muted-foreground">
          <span>{width}×{height}px</span>
          {tokens.colors.length > 0 && <span>• {tokens.colors.length} cores</span>}
          {tokens.borderRadius.length > 0 && <span>• border-radius: {tokens.borderRadius[0]}</span>}
        </div>
      </div>

      {tokens.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Tokens de cor</h3>
          <div className="flex flex-wrap gap-2">
            {tokens.colors.map(color => (
              <div key={color} className="flex items-center gap-2 border rounded-md px-2 py-1 text-xs font-mono">
                <div className="w-4 h-4 rounded-sm border" style={{ background: color }} />
                {color}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Código</h3>
        <div className="rounded-xl border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/40">
            <div className="flex gap-1">
              {(["tailwind","react","ai"] as CodeTab[]).filter(t => t !== "ai" || aiCode).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${activeTab === tab ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {tab === "ai" ? "✨ AI" : tab === "react" ? "React" : "Tailwind"}
                </button>
              ))}
            </div>
            <button onClick={copy} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {copied ? "✓ Copiado!" : "Copiar"}
            </button>
          </div>
          <pre className="p-4 text-sm overflow-x-auto bg-background max-h-96">
            <code className="text-foreground font-mono text-xs leading-relaxed">{currentCode}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

const navItems = [
  { id: "BottomSheet", label: "Bottom Sheet" }
]

export default function App() {
  const [activeSection, setActiveSection] = useState(navItems[0]?.id ?? "")
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-200 overflow-hidden border-r flex-shrink-0`}>
          <div className="p-6 w-64">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-7 h-7 bg-foreground rounded-md" />
              <span className="font-semibold text-base">Design System</span>
            </div>
            <nav className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2">Componentes</p>
              {navItems.map(item => (
                <button key={item.id} onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${activeSection === item.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 overflow-auto">
          <header className="border-b px-6 py-3 flex items-center justify-between sticky top-0 bg-background z-10">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-md hover:bg-accent transition-colors">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <a href="https://github.com" className="text-xs text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
              <button onClick={() => setDarkMode(!darkMode)} className="p-1.5 rounded-md hover:bg-accent transition-colors text-sm">
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </header>
          <main className="p-8 max-w-4xl">
      {activeSection === "BottomSheet" && (
        <ComponentDoc
          key="BottomSheet"
          name="Bottom Sheet"
          description="Tem a função de exibir conteúdo complementar e ações suplementares de algum item da tela"
          figmaUrl="https://figma.com/file/undefined?node-id=3867-76400"
          width={1866}
          height={803}
          reactCode={`import * as React from "react"
import { cn } from "@/lib/utils"

export interface BottomSheetProps {
  type?: "title" | "title+description" | "small tittle";
  version?: "light" | "dark";
  children?: React.ReactNode
}

const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[1866px] h-[803px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
BottomSheet.displayName = "BottomSheet"

export { BottomSheet }
export default BottomSheet`}
          tailwindCode={`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[1866px] h-[803px]", {
  variants: {
    type: {
      title: "",
      titledescription: "",
      smalltittle: "",
    },
    version: {
      light: "",
      dark: "",
    },
  },
  defaultVariants: {
  },
})


export interface BottomSheetProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function BottomSheet({ className, children, ...props }: BottomSheetProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default BottomSheet`}
          aiCode={`import * as React from "react"
import { cn } from "@/lib/utils"

export interface BottomSheetProps {
  type?: "title" | "title+description" | "small tittle";
  version?: "light" | "dark";
  children?: React.ReactNode
}

const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[1866px] h-[803px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
BottomSheet.displayName = "BottomSheet"

export { BottomSheet }
export default BottomSheet`}
          tokens={{
  "colors": [
    "#9747ff",
    "#ffffff",
    "#0d0d0d",
    "#404040",
    "#f2f2f2",
    "#d9d9d9"
  ],
  "typography": [
    {
      "fontFamily": "Suisse BP Int'l",
      "fontSize": 18,
      "fontWeight": "Regular"
    },
    {
      "fontFamily": "Suisse BP Int'l",
      "fontSize": 18,
      "fontWeight": "Regular"
    },
    {
      "fontFamily": "Degular",
      "fontSize": 32,
      "fontWeight": "Medium"
    },
    {
      "fontFamily": "Suisse BP Int'l",
      "fontSize": 16,
      "fontWeight": "Regular"
    },
    {
      "fontFamily": "Degular",
      "fontSize": 32,
      "fontWeight": "Medium"
    },
    {
      "fontFamily": "Suisse BP Int'l",
      "fontSize": 16,
      "fontWeight": "Regular"
    },
    {
      "fontFamily": "Degular",
      "fontSize": 32,
      "fontWeight": "Medium"
    },
    {
      "fontFamily": "Degular",
      "fontSize": 32,
      "fontWeight": "Medium"
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