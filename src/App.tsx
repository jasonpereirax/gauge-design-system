/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect } from "react"
import Control from "./components/Control/Control"
import Checkbox from "./components/Checkbox/Checkbox"

type Tokens = { colors: string[]; typography: any[]; borderRadius: string[]; shadows: string[]; spacing: string[] }
type VariantProp = { name: string; values: string[] }
type AnatomyNode = { name: string; type: string; visible: boolean; children: AnatomyNode[] }
type A11yHint = { role: string; note: string }
type Status = "stable" | "beta" | "deprecated" | "wip" | "experimental"

interface ComponentDocProps {
  name: string; description: string; figmaUrl: string; status: Status; category: string
  width: number; height: number
  reactCode: string; tailwindCode: string; htmlCode: string; cssCode: string
  svgCode?: string; aiCode?: string
  tokens: Tokens; variantProperties: VariantProp[]; anatomy: AnatomyNode | null; a11y: A11yHint[]
}

type DocTab = "overview" | "variants" | "playground" | "tokens" | "props" | "anatomy" | "a11y" | "code"
type CodeTab = "tailwind" | "react" | "html" | "ai"
const STATUS_MAP: Record<Status, { label: string; bg: string; color: string }> = {
  stable:       { label: "Stable",       bg: "#dcfce7", color: "#15803d" },
  beta:         { label: "Beta",         bg: "#fef9c3", color: "#a16207" },
  deprecated:   { label: "Deprecated",   bg: "#fee2e2", color: "#b91c1c" },
  wip:          { label: "WIP",          bg: "#f3e8ff", color: "#7c3aed" },
  experimental: { label: "Experimental", bg: "#e0f2fe", color: "#0369a1" },
}

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.stable
  return <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", background: s.bg, color: s.color }}>{s.label}</span>
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  if (!code || !code.trim()) return <div style={{ padding: "24px", textAlign: "center", fontSize: "13px", color: "#a1a1aa", border: "1px solid #e4e4e7", borderRadius: "10px" }}>Nenhum código disponível</div>
  return (
    <div style={{ border: "1px solid #e4e4e7", borderRadius: "10px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 14px", borderBottom: "1px solid #e4e4e7", background: "#fafafa" }}>
        <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#a1a1aa" }}>{language}</span>
        <button onClick={copy} style={{ fontSize: "11px", color: copied ? "#16a34a" : "#666", background: copied ? "#f0fdf4" : "transparent", border: "none", cursor: "pointer", padding: "3px 8px", borderRadius: "5px" }}>{copied ? "✓ Copiado!" : "Copiar"}</button>
      </div>
      <pre style={{ margin: 0, padding: "18px", overflowX: "auto", maxHeight: "440px", background: "#0d1117", fontSize: "12px", lineHeight: "1.6" }}>
        <code style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace", color: "#e6edf3", whiteSpace: "pre" }}>{code}</code>
      </pre>
    </div>
  )
}

function ComponentPreview({ htmlCode, cssCode, svgCode, width, height, overrideHtml }: any) {
  const [bg, setBg] = React.useState("checker")
  const [zoom, setZoom] = React.useState(1)
  const checker = { backgroundImage: ["linear-gradient(45deg,#e5e7eb 25%,transparent 25%)","linear-gradient(-45deg,#e5e7eb 25%,transparent 25%)","linear-gradient(45deg,transparent 75%,#e5e7eb 75%)","linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)"].join(","), backgroundSize: "16px 16px", backgroundPosition: "0 0,0 8px,8px -8px,-8px 0", backgroundColor: "#f9fafb" }
  const bgMap: any = { white: { background: "#ffffff" }, checker, dark: { background: "#09090b" } }
  // Always prefer generated htmlCode over svgCode (which is a Figma screenshot)
  const visual = overrideHtml || (htmlCode && htmlCode.trim() ? htmlCode : (svgCode || ""))
  const baseCSS = "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html,body{width:100%;height:100%}body{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;font-family:system-ui,sans-serif;background:transparent}"
  const h = Math.max(height * zoom + 80, 180)
  const buildDoc = () => `<!DOCTYPE html><html><head><meta charset=UTF-8><style>${baseCSS}${cssCode||""}</style></head><body>${visual}</body></html>`
  const bgLabels: any = { white: "Branco", checker: "Grade", dark: "Escuro" }
  return (
    <div style={{ border: "1px solid #e4e4e7", borderRadius: "10px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 12px", borderBottom: "1px solid #e4e4e7", background: "#fafafa" }}>
        {(["white","checker","dark"] as const).map(b => (
          <button key={b} onClick={() => setBg(b)} style={{ padding: "2px 8px", borderRadius: "5px", border: bg===b?"1.5px solid #3b82f6":"1.5px solid #e4e4e7", cursor:"pointer", background: bg===b?"#eff6ff":"#fff", fontSize:"11px", color:bg===b?"#3b82f6":"#71717a", fontWeight:bg===b?600:400 }}>{bgLabels[b]}</button>
        ))}
        <span style={{ margin:"0 2px", color:"#e4e4e7" }}>|</span>
        {[0.5,1,1.5,2].map(z => (
          <button key={z} onClick={() => setZoom(z)} style={{ fontSize:"11px", padding:"2px 6px", borderRadius:"5px", border:"none", cursor:"pointer", background:zoom===z?"#18181b":"transparent", color:zoom===z?"#fff":"#a1a1aa", fontWeight:zoom===z?600:400 }}>{z}x</button>
        ))}
        <span style={{ marginLeft:"auto", fontSize:"11px", fontFamily:"monospace", color:"#a1a1aa" }}>{width}×{height}px</span>
      </div>
      <div style={{ minHeight: h+"px", ...bgMap[bg] }}>
        <iframe key={`${zoom}-${bg}-${overrideHtml||""}`} srcDoc={buildDoc()} style={{ width:"100%", height:h+"px", border:"none", display:"block" }} sandbox="allow-scripts" title="Preview" />
      </div>
    </div>
  )
}

function Playground({ htmlCode, cssCode, svgCode, width, height, variantProperties }: any) {
  const [selections, setSelections] = useState<Record<string,string>>(() => {
    const init: Record<string,string> = {}
    variantProperties.forEach((p: VariantProp) => { init[p.name] = p.values[0] || "" })
    return init
  })
  const setVal = (name: string, val: string) => setSelections(s => ({...s, [name]: val}))
  if (!variantProperties || variantProperties.length === 0) return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      <div style={{ padding:"20px", background:"#fafafa", borderRadius:"10px", border:"1px solid #e4e4e7", fontSize:"13px", color:"#71717a" }}>Este componente não tem variantes — o preview abaixo é o estado padrão.</div>
      <ComponentPreview htmlCode={htmlCode} cssCode={cssCode} svgCode={svgCode} width={width} height={height} />
    </div>
  )
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"16px", padding:"16px", background:"#fafafa", borderRadius:"10px", border:"1px solid #e4e4e7" }}>
        {variantProperties.map((prop: VariantProp) => (
          <div key={prop.name}>
            <div style={{ fontSize:"11px", fontWeight:600, color:"#71717a", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"6px" }}>{prop.name}</div>
            <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
              {prop.values.map((v: string) => (
                <button key={v} onClick={() => setVal(prop.name, v)}
                  style={{ fontSize:"12px", padding:"4px 10px", borderRadius:"6px", border: selections[prop.name]===v?"1.5px solid #18181b":"1px solid #e4e4e7", background:selections[prop.name]===v?"#18181b":"#fff", color:selections[prop.name]===v?"#fff":"#52525b", cursor:"pointer", fontFamily:"monospace" }}>{v}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize:"11px", color:"#a1a1aa", marginBottom:"8px", fontFamily:"monospace" }}>
          {Object.entries(selections).map(([k,v]) => `${k}="${v}"`).join("  ")}
        </div>
        <ComponentPreview htmlCode={htmlCode} cssCode={cssCode} svgCode={svgCode} width={width} height={height} />
      </div>
    </div>
  )
}

function TokensTable({ tokens }: { tokens: Tokens }) {
  type Row = { category: string; token: string; value: string; preview?: any }
  const rows: Row[] = []
  ;(tokens.colors||[]).forEach((c,i) => rows.push({ category:"Color", token:`color-${i+1}`, value:c, preview:<div style={{width:"20px",height:"20px",borderRadius:"5px",background:c,border:"1px solid rgba(0,0,0,0.1)",flexShrink:0}}/> }))
  ;(tokens.spacing||[]).forEach((s,i) => rows.push({ category:"Spacing", token:`space-${i+1}`, value:s, preview:<div style={{width:Math.min(parseInt(s)||4,80)+"px",height:"8px",borderRadius:"2px",background:"#3b82f6",flexShrink:0}}/> }))
  ;(tokens.borderRadius||[]).forEach((r,i) => rows.push({ category:"Radius", token:`radius-${i+1}`, value:r, preview:<div style={{width:"24px",height:"24px",borderRadius:r,border:"2px solid #e4e4e7",background:"#f4f4f5",flexShrink:0}}/> }))
  ;(tokens.shadows||[]).forEach((s,i) => rows.push({ category:"Shadow", token:`shadow-${i+1}`, value:s, preview:<div style={{width:"24px",height:"24px",borderRadius:"5px",background:"#fff",boxShadow:s,flexShrink:0}}/> }))
  ;(tokens.typography||[]).slice(0,8).forEach((t,i) => rows.push({ category:"Typography", token:`text-${i+1}`, value:[t.fontFamily,t.fontSize?t.fontSize+"px":null,t.fontWeight?"w"+t.fontWeight:null].filter(Boolean).join(" / "), preview:<span style={{fontFamily:t.fontFamily||"inherit",fontSize:Math.min(t.fontSize||14,20)+"px",fontWeight:t.fontWeight||400,lineHeight:1}}>Aa</span> }))
  if (rows.length === 0) return <div style={{ padding:"32px",textAlign:"center",fontSize:"13px",color:"#a1a1aa",border:"1px solid #e4e4e7",borderRadius:"10px" }}>Nenhum token detectado.</div>
  return (
    <div style={{ border:"1px solid #e4e4e7",borderRadius:"10px",overflow:"hidden" }}>
      <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"13px" }}>
        <thead><tr style={{ background:"#fafafa",borderBottom:"1px solid #e4e4e7" }}>
          {["Categoria","Token","Valor","Preview"].map(h => <th key={h} style={{ textAlign:"left",padding:"9px 14px",fontWeight:600,color:"#52525b",fontSize:"11px",textTransform:"uppercase",letterSpacing:"0.06em" }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {rows.map((row,i) => (
            <tr key={i} style={{ borderBottom: i<rows.length-1?"1px solid #f4f4f5":"none", background:i%2===0?"#fff":"#fafafa" }}>
              <td style={{ padding:"9px 14px",color:"#71717a",fontSize:"12px" }}>{i===0||rows[i-1].category!==row.category?<span style={{fontWeight:600,color:"#18181b",fontSize:"11px"}}>{row.category}</span>:null}</td>
              <td style={{ padding:"9px 14px",fontFamily:"monospace",color:"#3b82f6",fontSize:"12px" }}>{row.token}</td>
              <td style={{ padding:"9px 14px",fontFamily:"monospace",color:"#18181b",fontSize:"12px",wordBreak:"break-all" }}>{row.value}</td>
              <td style={{ padding:"9px 14px" }}><div style={{ display:"flex",alignItems:"center" }}>{row.preview}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PropsTable({ variantProperties }: { variantProperties: VariantProp[] }) {
  if (!variantProperties||variantProperties.length===0) return <div style={{padding:"24px",textAlign:"center",fontSize:"13px",color:"#a1a1aa",border:"1px solid #e4e4e7",borderRadius:"10px"}}>Nenhuma prop detectada.</div>
  return (
    <div style={{ border:"1px solid #e4e4e7",borderRadius:"10px",overflow:"hidden" }}>
      <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"13px" }}>
        <thead><tr style={{ background:"#fafafa",borderBottom:"1px solid #e4e4e7" }}>
          {["Prop","Tipo","Valores","Default"].map(h => <th key={h} style={{ textAlign:"left",padding:"9px 14px",fontWeight:600,color:"#52525b",fontSize:"11px",textTransform:"uppercase",letterSpacing:"0.06em" }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {variantProperties.map((p,i) => (
            <tr key={i} style={{ borderBottom:i<variantProperties.length-1?"1px solid #f4f4f5":"none",background:i%2===0?"#fff":"#fafafa" }}>
              <td style={{ padding:"10px 14px",fontFamily:"monospace",color:"#18181b",fontWeight:600 }}>{p.name}</td>
              <td style={{ padding:"10px 14px",color:"#6366f1",fontFamily:"monospace",fontSize:"12px" }}>string</td>
              <td style={{ padding:"10px 14px" }}><div style={{ display:"flex",flexWrap:"wrap",gap:"4px" }}>{p.values.map((v,j) => <span key={j} style={{ fontSize:"11px",fontFamily:"monospace",background:"#f4f4f5",color:"#18181b",padding:"2px 7px",borderRadius:"4px",border:"1px solid #e4e4e7" }}>"{v}"</span>)}</div></td>
              <td style={{ padding:"10px 14px",fontFamily:"monospace",fontSize:"12px",color:"#a1a1aa" }}>{p.values[0]?`"${p.values[0]}"`:"-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const NODE_ICON: Record<string,string> = { FRAME:"⬜",GROUP:"◻",COMPONENT:"◈",INSTANCE:"◇",TEXT:"T",RECTANGLE:"▭",ELLIPSE:"○",VECTOR:"✦",LINE:"—",COMPONENT_SET:"◈◈" }

function AnatomyTree({ node, depth=0, index, onHover }: { node:AnatomyNode; depth?:number; index:number; onHover:(i:number|null)=>void }) {
  const [open,setOpen] = useState(depth<2)
  const has = node.children&&node.children.length>0
  return (
    <div>
      <div onClick={()=>has&&setOpen(!open)} onMouseEnter={()=>onHover(index)} onMouseLeave={()=>onHover(null)}
        style={{ display:"flex",alignItems:"center",gap:"6px",padding:"5px 12px",paddingLeft:(depth*18+12)+"px",cursor:has?"pointer":"default",borderRadius:"5px",transition:"background 0.1s" }}>
        <span style={{ fontSize:"10px",color:"#a1a1aa",width:"12px",flexShrink:0 }}>{has?(open?"▾":"▸"):""}</span>
        <span style={{ width:"16px",fontSize:"11px",color:"#6366f1",fontFamily:"monospace",textAlign:"center",flexShrink:0 }}>{NODE_ICON[node.type]||"◻"}</span>
        <span style={{ fontSize:"12px",color:node.visible===false?"#a1a1aa":"#18181b",fontStyle:node.visible===false?"italic":"normal",flex:1 }}>{node.name}</span>
        <span style={{ width:"20px",height:"20px",borderRadius:"50%",background:"#18181b",color:"#fff",fontSize:"10px",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{index+1}</span>
      </div>
      {has&&open&&<div style={{ borderLeft:"1px solid #f4f4f5",marginLeft:(depth*18+20)+"px" }}>{node.children.map((c,i)=><AnatomyTree key={i} node={c} depth={depth+1} index={i} onHover={onHover}/>)}</div>}
    </div>
  )
}

function A11yTable({ a11y }: { a11y: A11yHint[] }) {
  if (!a11y||a11y.length===0) return (
    <div style={{ padding:"24px",fontSize:"13px",color:"#71717a",border:"1px solid #e4e4e7",borderRadius:"10px",lineHeight:1.6 }}>
      Nenhuma dica de acessibilidade detectada automaticamente. Revise manualmente os layer names no Figma para incluir palavras como "button", "icon", "input", "label" ou "checkbox" para gerar hints automáticos.<br/>Você também pode adicionar descrições de acessibilidade nas descriptions dos layers no Figma.
    </div>
  )
  const roleColors: Record<string,{bg:string;color:string}> = {
    button:   {bg:"#eff6ff",color:"#1d4ed8"},
    img:      {bg:"#f0fdf4",color:"#15803d"},
    textbox:  {bg:"#fef9c3",color:"#a16207"},
    text:     {bg:"#f4f4f5",color:"#52525b"},
    checkbox: {bg:"#f3e8ff",color:"#7c3aed"},
    list:     {bg:"#fff7ed",color:"#c2410c"},
    note:     {bg:"#f4f4f5",color:"#52525b"},
  }
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>
      {a11y.map((hint,i) => {
        const c = roleColors[hint.role]||roleColors.note
        return (
          <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:"12px",padding:"12px 14px",border:"1px solid #e4e4e7",borderRadius:"10px",background:"#fff" }}>
            <span style={{ fontSize:"10px",fontWeight:700,padding:"3px 8px",borderRadius:"999px",background:c.bg,color:c.color,flexShrink:0,marginTop:"1px",fontFamily:"monospace" }}>{hint.role}</span>
            <span style={{ fontSize:"13px",color:"#18181b",lineHeight:1.5 }}>{hint.note}</span>
          </div>
        )
      })}
      <div style={{ padding:"10px 14px",fontSize:"12px",color:"#a1a1aa",lineHeight:1.5 }}>
        Dicas geradas automaticamente a partir dos layer names do Figma. Sempre revise com um especialista em acessibilidade.
      </div>
    </div>
  )
}

function ComponentDoc({ name,description,figmaUrl,status,category,width,height,reactCode,tailwindCode,htmlCode,cssCode,svgCode,aiCode,tokens,variantProperties,anatomy,a11y }: ComponentDocProps) {
  const [docTab,setDocTab] = useState<DocTab>("overview")
  const [codeTab,setCodeTab] = useState<CodeTab>("tailwind")
  const [hoveredNode,setHoveredNode] = useState<number|null>(null)

  const codeTabs = [
    {id:"tailwind" as CodeTab,label:"Tailwind",show:!!tailwindCode},
    {id:"react" as CodeTab,label:"React",show:!!reactCode},
    {id:"html" as CodeTab,label:"HTML",show:!!htmlCode},
    {id:"ai" as CodeTab,label:"✨ AI",show:!!aiCode},
  ].filter(t=>t.show)

  const docTabs: {id:DocTab;label:string;badge?:string}[] = [
    {id:"overview",label:"Overview"},
    {id:"variants",label:"Variantes",badge:variantProperties?.length>0?String(variantProperties.reduce((a:number,p:VariantProp)=>a*p.values.length,1)):undefined},
    {id:"playground",label:"Playground"},
    {id:"tokens",label:"Tokens"},
    {id:"props",label:"Props",badge:variantProperties?.length>0?String(variantProperties.length):undefined},
    {id:"anatomy",label:"Anatomia"},
    {id:"a11y",label:"Acessibilidade"},
    {id:"code",label:"Código"},
  ]

  const pkg = name.toLowerCase().replace(/[^a-z0-9]/g,"-")
  const importSnippet = `// npm install\nnpm install @design-system/${pkg}\n\n// Uso\nimport { ${name.replace(/[^a-zA-Z0-9]/g,"")} } from "@design-system/${pkg}"`

  return (
    <div>
      <div style={{ borderBottom:"1px solid #e4e4e7",marginBottom:"0" }}>
        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"16px",paddingBottom:"18px" }}>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"6px",flexWrap:"wrap" }}>
              <h1 style={{ fontSize:"24px",fontWeight:700,letterSpacing:"-0.02em",margin:0 }}>{name}</h1>
              <StatusBadge status={status} />
              <span style={{ fontSize:"11px",background:"#f4f4f5",color:"#71717a",padding:"2px 8px",borderRadius:"999px",fontFamily:"monospace",border:"1px solid #e4e4e7" }}>{width}×{height}px</span>
              <span style={{ fontSize:"11px",color:"#a1a1aa" }}>{category}</span>
            </div>
            {description && <p style={{ margin:0,fontSize:"14px",color:"#71717a",lineHeight:"1.5",maxWidth:"560px" }}>{description}</p>}
          </div>
          <div style={{ display:"flex",gap:"8px",flexShrink:0 }}>
            {figmaUrl&&<a href={figmaUrl} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"12px",color:"#71717a",border:"1px solid #e4e4e7",borderRadius:"7px",padding:"5px 10px",textDecoration:"none",background:"#fafafa" }}><svg width="10" height="14" viewBox="0 0 12 16" fill="currentColor"><path d="M6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/><path fillRule="evenodd" d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 0 4 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1-2-2V2zm2 8a2 2 0 0 0 2 2h2a2 2 0 0 0 0-4H4a2 2 0 0 0-2 2zm4-6a2 2 0 0 0 2 2V2H6v2zm0 4a2 2 0 0 0-2 2h2v-2zm0-4V2H2v2a2 2 0 0 0 2 2h2zm-4 4a2 2 0 0 0 2 2H4a2 2 0 0 0-2-2z"/></svg>Figma</a>}
          </div>
        </div>
        <div style={{ display:"flex",gap:"0",overflowX:"auto",scrollbarWidth:"none" }}>
          {docTabs.map(t=>(
            <button key={t.id} onClick={()=>setDocTab(t.id)} style={{ display:"flex",alignItems:"center",gap:"5px",padding:"7px 12px",fontSize:"13px",fontWeight:docTab===t.id?600:400,color:docTab===t.id?"#18181b":"#71717a",background:"none",border:"none",borderBottom:docTab===t.id?"2px solid #18181b":"2px solid transparent",cursor:"pointer",marginBottom:"-1px",whiteSpace:"nowrap" }}>
              {t.label}
              {t.badge&&<span style={{ fontSize:"10px",background:docTab===t.id?"#18181b":"#e4e4e7",color:docTab===t.id?"#fff":"#71717a",padding:"1px 5px",borderRadius:"999px",fontWeight:600 }}>{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>
      <div style={{ paddingTop:"24px" }}>
        {docTab==="overview"&&(
          <div style={{ display:"flex",flexDirection:"column",gap:"24px" }}>
            <ComponentPreview htmlCode={htmlCode} cssCode={cssCode} svgCode={svgCode} width={width} height={height} />
            {variantProperties&&variantProperties.length>0&&(
              <div>
                <div style={{ fontSize:"12px",fontWeight:600,color:"#71717a",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"10px" }}>Variantes</div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:"6px" }}>
                  {variantProperties.map((p,i)=>(
                    <div key={i} style={{ padding:"6px 12px",background:"#fafafa",border:"1px solid #e4e4e7",borderRadius:"8px" }}>
                      <span style={{ fontSize:"12px",fontFamily:"monospace",fontWeight:600,color:"#18181b" }}>{p.name}</span>
                      <span style={{ fontSize:"12px",color:"#d4d4d8",margin:"0 5px" }}>·</span>
                      <span style={{ fontSize:"12px",color:"#71717a" }}>{p.values.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tokens.colors&&tokens.colors.length>0&&(
              <div>
                <div style={{ fontSize:"12px",fontWeight:600,color:"#71717a",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"10px" }}>Cores</div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:"8px" }}>
                  {tokens.colors.map((c,i)=>(
                    <div key={i} style={{ display:"flex",alignItems:"center",gap:"7px",padding:"5px 10px",background:"#fafafa",border:"1px solid #e4e4e7",borderRadius:"8px" }}>
                      <div style={{ width:"14px",height:"14px",borderRadius:"3px",background:c,border:"1px solid rgba(0,0,0,0.1)" }}/>
                      <span style={{ fontSize:"11px",fontFamily:"monospace",color:"#52525b" }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div style={{ fontSize:"12px",fontWeight:600,color:"#71717a",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"10px" }}>Importar</div>
              <CodeBlock code={importSnippet} language="bash / tsx" />
            </div>
          </div>
        )}
        {docTab==="playground"&&<Playground htmlCode={htmlCode} cssCode={cssCode} svgCode={svgCode} width={width} height={height} variantProperties={variantProperties} />}
        {docTab==="variants"&&(
          <div style={{ display:"flex",flexDirection:"column",gap:"24px" }}>
            {!variantProperties||variantProperties.length===0?(
              <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
                <p style={{ margin:0,fontSize:"13px",color:"#71717a" }}>Componente sem variantes — renderização do estado padrão.</p>
                <ComponentPreview htmlCode={htmlCode} cssCode={cssCode} svgCode={svgCode} width={width} height={height} />
              </div>
            ):variantProperties.map((prop:VariantProp,pi:number)=>(
              <div key={pi}>
                <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px" }}>
                  <h2 style={{ fontSize:"14px",fontWeight:600,margin:0 }}>{prop.name}</h2>
                  <span style={{ fontSize:"11px",color:"#a1a1aa" }}>{prop.values.length} variante{prop.values.length!==1?"s":""}</span>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"12px" }}>
                  {prop.values.map((v:string,vi:number)=>(
                    <div key={vi} style={{ border:"1px solid #e4e4e7",borderRadius:"10px",overflow:"hidden" }}>
                      <div style={{ background:"#f9fafb",borderBottom:"1px solid #f4f4f5",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100px" }}>
                        <iframe
                          srcDoc={`<!DOCTYPE html><html><head><meta charset=UTF-8><style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px;font-family:system-ui,sans-serif;background:transparent}${cssCode||""}</style></head><body>${htmlCode||""}</body></html>`}
                          style={{ width:"100%",height:"100px",border:"none",display:"block" }}
                          sandbox="allow-scripts"
                          title={`${prop.name}=${v}`}
                        />
                      </div>
                      <div style={{ padding:"8px 12px",background:"#fff" }}>
                        <span style={{ fontSize:"11px",fontFamily:"monospace",color:"#52525b",fontWeight:500 }}>{prop.name}=</span>
                        <span style={{ fontSize:"11px",fontFamily:"monospace",color:"#18181b",fontWeight:700 }}>"{v}"</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {docTab==="tokens"&&<TokensTable tokens={tokens} />}
        {docTab==="props"&&(
          <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
            <p style={{ margin:0,fontSize:"13px",color:"#71717a" }}>Props extraídas das variantes do Figma.</p>
            <PropsTable variantProperties={variantProperties} />
          </div>
        )}
        {docTab==="anatomy"&&(
          <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
            <p style={{ margin:0,fontSize:"13px",color:"#71717a" }}>Estrutura de layers. Passe o mouse sobre um item para destacá-lo.</p>
            {anatomy?(
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px" }}>
                <div style={{ border:"1px solid #e4e4e7",borderRadius:"10px",overflow:"hidden",padding:"6px 0" }}>
                  {anatomy.children&&anatomy.children.length>0
                    ?anatomy.children.map((c,i)=><AnatomyTree key={i} node={c} depth={0} index={i} onHover={setHoveredNode}/>)
                    :<AnatomyTree node={anatomy} depth={0} index={0} onHover={setHoveredNode}/>}
                </div>
                <div style={{ border:"1px solid #e4e4e7",borderRadius:"10px",overflow:"hidden",background:"#f9fafb",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",minHeight:"180px" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"32px",fontWeight:700,color:"#18181b",marginBottom:"4px" }}>{hoveredNode!==null?hoveredNode+1:"—"}</div>
                    <div style={{ fontSize:"12px",color:"#a1a1aa" }}>{hoveredNode!==null?((anatomy.children&&anatomy.children[hoveredNode])||anatomy).name:"Passe o mouse em um layer"}</div>
                  </div>
                </div>
              </div>
            ):(
              <div style={{ padding:"24px",textAlign:"center",fontSize:"13px",color:"#a1a1aa",border:"1px solid #e4e4e7",borderRadius:"10px" }}>Sem anatomia disponível.</div>
            )}
          </div>
        )}
        {docTab==="a11y"&&<A11yTable a11y={a11y} />}
        {docTab==="code"&&(
          <div style={{ display:"flex",flexDirection:"column",gap:"14px" }}>
            {codeTabs.length>0&&(
              <div style={{ display:"flex",gap:"0",borderBottom:"1px solid #e4e4e7" }}>
                {codeTabs.map(t=>(
                  <button key={t.id} onClick={()=>setCodeTab(t.id)} style={{ padding:"7px 12px",fontSize:"13px",fontWeight:codeTab===t.id?600:400,color:codeTab===t.id?"#18181b":"#71717a",background:"none",border:"none",borderBottom:codeTab===t.id?"2px solid #18181b":"2px solid transparent",cursor:"pointer",marginBottom:"-1px" }}>{t.label}</button>
                ))}
              </div>
            )}
            <div>
              {codeTab==="tailwind"&&<CodeBlock code={tailwindCode} language="tsx" />}
              {codeTab==="react"&&<CodeBlock code={reactCode} language="tsx" />}
              {codeTab==="html"&&<div style={{display:"flex",flexDirection:"column",gap:"10px"}}><CodeBlock code={htmlCode} language="html" />{cssCode&&<CodeBlock code={cssCode} language="css" />}</div>}
              {codeTab==="ai"&&<CodeBlock code={aiCode||""} language="tsx (AI)" />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const globalTokens = {
  colors: [
    "#9747ff",
    "#e8e8e8",
    "#d9d9d9",
    "#262626",
    "#f2f2f2"
  ],
  typography: [],
  borderRadius: [
    "5px",
    "1000px"
  ],
  shadows: [],
  spacing: [
    "8px"
  ]
}

function GlobalTokensPage() {
  const [activeCategory,setActiveCategory] = useState("Color")
  const cats = ["Color","Spacing","Radius","Shadow","Typography"]
  return (
    <div>
      <div style={{ borderBottom:"1px solid #e4e4e7",paddingBottom:"0",marginBottom:"0" }}>
        <h1 style={{ fontSize:"24px",fontWeight:700,letterSpacing:"-0.02em",margin:"0 0 6px" }}>Design Tokens</h1>
        <p style={{ margin:"0 0 16px",fontSize:"14px",color:"#71717a" }}>Todos os tokens visuais extraídos dos componentes do Figma.</p>
        <div style={{ display:"flex",gap:"0" }}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setActiveCategory(c)} style={{ padding:"7px 12px",fontSize:"13px",fontWeight:activeCategory===c?600:400,color:activeCategory===c?"#18181b":"#71717a",background:"none",border:"none",borderBottom:activeCategory===c?"2px solid #18181b":"2px solid transparent",cursor:"pointer",marginBottom:"-1px",whiteSpace:"nowrap" }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ paddingTop:"24px" }}>
        {activeCategory==="Color"&&(
          <div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:"12px" }}>
              {(globalTokens.colors||[]).map((c,i)=>(
                <div key={i} style={{ width:"80px" }}>
                  <div style={{ width:"80px",height:"80px",borderRadius:"10px",background:c,border:"1px solid rgba(0,0,0,0.08)",marginBottom:"6px" }}/>
                  <div style={{ fontSize:"10px",fontFamily:"monospace",color:"#52525b",wordBreak:"break-all",textAlign:"center" }}>{c}</div>
                </div>
              ))}
            </div>
            {!globalTokens.colors?.length&&<div style={{ padding:"24px",textAlign:"center",color:"#a1a1aa",fontSize:"13px" }}>Nenhuma cor detectada.</div>}
          </div>
        )}
        {activeCategory==="Spacing"&&(
          <div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>
            {(globalTokens.spacing||[]).map((s,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:"16px",padding:"10px 0",borderBottom:"1px solid #f4f4f5" }}>
                <span style={{ fontSize:"12px",fontFamily:"monospace",color:"#3b82f6",width:"60px",flexShrink:0 }}>{s}</span>
                <div style={{ width:Math.min(parseInt(s)||4,320)+"px",height:"12px",borderRadius:"3px",background:"#3b82f6",opacity:0.7 }}/>
                <span style={{ fontSize:"11px",color:"#a1a1aa" }}>{parseInt(s)/16}rem</span>
              </div>
            ))}
            {!globalTokens.spacing?.length&&<div style={{ padding:"24px",textAlign:"center",color:"#a1a1aa",fontSize:"13px" }}>Nenhum espaçamento detectado. Use Auto Layout no Figma.</div>}
          </div>
        )}
        {activeCategory==="Radius"&&(
          <div style={{ display:"flex",flexWrap:"wrap",gap:"20px",alignItems:"flex-end" }}>
            {(globalTokens.borderRadius||[]).map((r,i)=>(
              <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"8px" }}>
                <div style={{ width:Math.min(Math.max(parseInt(r)*3+24,32),96)+"px",height:Math.min(Math.max(parseInt(r)*3+24,32),96)+"px",borderRadius:r,background:"#f4f4f5",border:"2px solid #e4e4e7" }}/>
                <span style={{ fontSize:"11px",fontFamily:"monospace",color:"#52525b" }}>{r}</span>
              </div>
            ))}
            {!globalTokens.borderRadius?.length&&<div style={{ padding:"24px",textAlign:"center",color:"#a1a1aa",fontSize:"13px" }}>Nenhum radius detectado.</div>}
          </div>
        )}
        {activeCategory==="Shadow"&&(
          <div style={{ display:"flex",flexWrap:"wrap",gap:"20px" }}>
            {(globalTokens.shadows||[]).map((s,i)=>(
              <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"10px" }}>
                <div style={{ width:"80px",height:"80px",borderRadius:"10px",background:"#fff",boxShadow:s }}/>
                <span style={{ fontSize:"10px",fontFamily:"monospace",color:"#888",maxWidth:"120px",textAlign:"center",wordBreak:"break-all" }}>{s}</span>
              </div>
            ))}
            {!globalTokens.shadows?.length&&<div style={{ padding:"24px",textAlign:"center",color:"#a1a1aa",fontSize:"13px" }}>Nenhuma sombra detectada.</div>}
          </div>
        )}
        {activeCategory==="Typography"&&(
          <div style={{ display:"flex",flexDirection:"column",gap:"0" }}>
            {(globalTokens.typography||[]).map((t,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"baseline",gap:"20px",padding:"14px 0",borderBottom:"1px solid #f4f4f5" }}>
                <span style={{ fontFamily:t.fontFamily||"inherit",fontSize:Math.min(t.fontSize||14,36)+"px",fontWeight:t.fontWeight||400,lineHeight:1.2,color:"#18181b",minWidth:"80px" }}>Aa</span>
                <div style={{ display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap" }}>
                  {t.fontFamily&&<span style={{ fontSize:"12px",fontFamily:"monospace",color:"#52525b" }}>{t.fontFamily}</span>}
                  {t.fontSize&&<span style={{ fontSize:"11px",background:"#f4f4f5",padding:"1px 7px",borderRadius:"4px",fontFamily:"monospace",color:"#18181b" }}>{t.fontSize}px</span>}
                  {t.fontWeight&&<span style={{ fontSize:"11px",background:"#f4f4f5",padding:"1px 7px",borderRadius:"4px",fontFamily:"monospace",color:"#18181b" }}>w{t.fontWeight}</span>}
                  <span style={{ fontSize:"11px",color:"#a1a1aa",fontFamily:"monospace" }}>{t.fontSize?Math.round(t.fontSize/16*100)/100+"rem":""}</span>
                </div>
              </div>
            ))}
            {!globalTokens.typography?.length&&<div style={{ padding:"24px",textAlign:"center",color:"#a1a1aa",fontSize:"13px" }}>Nenhuma tipografia detectada.</div>}
          </div>
        )}
      </div>
    </div>
  )
}

const navItems = [
  { id: "Checkbox", label: "Checkbox", category: "Checkbox", status: "stable" },
  { id: "Control", label: "Control", category: "Control", status: "stable" }
]
const componentNames = navItems.map(i=>i.id)

function InstallationPage() {
  const installSnippet = "npm install\nnpm run dev"
  const importSnippet = `import { ${componentNames.join(", ")} } from "@/components"`
  return (
    <div style={{ maxWidth:"680px" }}>
      <div style={{ borderBottom:"1px solid #e4e4e7",paddingBottom:"24px",marginBottom:"28px" }}>
        <h1 style={{ fontSize:"24px",fontWeight:700,letterSpacing:"-0.02em",margin:"0 0 6px" }}>Primeiros Passos</h1>
        <p style={{ margin:0,fontSize:"14px",color:"#71717a" }}>Design system gerado automaticamente via Figma Design System Publisher.</p>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:"28px" }}>
        <div>
          <h2 style={{ fontSize:"15px",fontWeight:600,margin:"0 0 8px" }}>Instalação</h2>
          <CodeBlock code={installSnippet} language="bash" />
        </div>
        <div>
          <h2 style={{ fontSize:"15px",fontWeight:600,margin:"0 0 8px" }}>Uso</h2>
          <CodeBlock code={importSnippet} language="tsx" />
        </div>
        <div>
          <h2 style={{ fontSize:"15px",fontWeight:600,margin:"0 0 10px" }}>Componentes ({componentNames.length})</h2>
          <div style={{ display:"flex",flexDirection:"column",gap:"3px" }}>
            {navItems.map(item=>(
              <div key={item.id} style={{ display:"flex",alignItems:"center",gap:"10px",padding:"9px 12px",borderRadius:"8px",border:"1px solid #f4f4f5",background:"#fafafa" }}>
                <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:"#a1a1aa" }}/>
                <span style={{ fontSize:"13px",fontFamily:"monospace",fontWeight:500 }}>{item.id}</span>
                <span style={{ fontSize:"13px",color:"#a1a1aa" }}>—</span>
                <span style={{ fontSize:"13px",color:"#71717a",flex:1 }}>{item.label}</span>
                <StatusBadge status={item.status as Status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

class ErrorBoundary extends React.Component<{children:any},{error:any}> {
  constructor(p:any){super(p);this.state={error:null}}
  static getDerivedStateFromError(e:any){return {error:e}}
  render(){
    if(this.state.error) return (
      <div style={{padding:"32px",maxWidth:"600px",margin:"40px auto",border:"1px solid #fecaca",borderRadius:"12px",background:"#fff5f5"}}>
        <div style={{fontSize:"16px",fontWeight:600,color:"#b91c1c",marginBottom:"8px"}}>Erro ao renderizar componente</div>
        <pre style={{fontSize:"12px",color:"#7f1d1d",background:"#fee2e2",padding:"12px",borderRadius:"8px",overflow:"auto",whiteSpace:"pre-wrap"}}>{String(this.state.error)}</pre>
      </div>
    )
    return this.props.children
  }
}

export default function App() {
  const getInitialSection = () => {
    const hash = window.location.hash.replace("#","")
    if (!hash||hash==="installation") return "installation"
    if (hash==="tokens") return "tokens"
    if (navItems.find(i=>i.id===hash)) return hash
    return "installation"
  }
  const [activeSection,setActiveSection] = useState(getInitialSection)
  const [darkMode,setDarkMode] = useState(false)
  const [sidebarOpen,setSidebarOpen] = useState(true)
  const [search,setSearch] = useState("")

  const navigate = (id:string) => { setActiveSection(id); window.history.pushState(null,"","#"+id); setSearch("") }

  useEffect(()=>{
    const h = ()=>{
      const hash = window.location.hash.replace("#","")
      if (!hash||hash==="installation") setActiveSection("installation")
      else if (hash==="tokens") setActiveSection("tokens")
      else if (navItems.find(i=>i.id===hash)) setActiveSection(hash)
    }
    window.addEventListener("hashchange",h)
    return ()=>window.removeEventListener("hashchange",h)
  },[])

  const filtered = navItems.filter(i=>!search||i.label.toLowerCase().includes(search.toLowerCase())||i.id.toLowerCase().includes(search.toLowerCase()))
  const categories = [...new Set(filtered.map(i=>i.category))]

  return (
    <div className={darkMode?"dark":""}>
      <div className="min-h-screen bg-background text-foreground flex">
        <aside className={`${sidebarOpen?"w-64":"w-0"} transition-all duration-200 overflow-hidden border-r shrink-0`}>
          <div className="p-4 w-64 flex flex-col h-screen sticky top-0">
            <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"20px" }}>
              <div style={{ width:"28px",height:"28px",background:"#18181b",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
              </div>
              <div>
                <div style={{ fontSize:"13px",fontWeight:600,lineHeight:1 }}>Design System</div>
                <div style={{ fontSize:"11px",color:"#a1a1aa",lineHeight:1,marginTop:"2px" }}>{navItems.length} components</div>
              </div>
            </div>
            <div style={{ position:"relative",marginBottom:"16px" }}>
              <svg style={{ position:"absolute",left:"8px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{ width:"100%",padding:"6px 8px 6px 26px",fontSize:"12px",border:"1px solid #e4e4e7",borderRadius:"7px",outline:"none",background:"#fafafa",color:"#18181b" }} />
              {search&&<button onClick={()=>setSearch("")} style={{ position:"absolute",right:"6px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:"14px",color:"#a1a1aa",lineHeight:1 }}>×</button>}
            </div>
            <nav style={{ flex:1,overflowY:"auto",scrollbarWidth:"none" }}>
              <div style={{ fontSize:"10px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",color:"#a1a1aa",marginBottom:"4px",padding:"0 6px" }}>Geral</div>
              {[{id:"installation",label:"Instalação"},{id:"tokens",label:"Tokens"}].map(item=>(
                <button key={item.id} onClick={()=>navigate(item.id)}
                  style={{ width:"100%",textAlign:"left",padding:"5px 8px",borderRadius:"6px",fontSize:"13px",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",marginBottom:"1px",background:activeSection===item.id?"#18181b":activeSection===item.id?"#18181b":"transparent",color:activeSection===item.id?"#fff":"#52525b",fontWeight:activeSection===item.id?500:400 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  {item.label}
                </button>
              ))}
              {categories.map(cat=>(
                <div key={cat} style={{ marginTop:"14px" }}>
                  <div style={{ fontSize:"10px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",color:"#a1a1aa",marginBottom:"4px",padding:"0 6px" }}>{cat}</div>
                  {filtered.filter(i=>i.category===cat).map(item=>(
                    <button key={item.id} onClick={()=>navigate(item.id)}
                      style={{ width:"100%",textAlign:"left",padding:"5px 8px",borderRadius:"6px",fontSize:"13px",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",marginBottom:"1px",background:activeSection===item.id?"#18181b":"transparent",color:activeSection===item.id?"#fff":"#52525b",fontWeight:activeSection===item.id?500:400 }}>
                      <span style={{ width:"5px",height:"5px",borderRadius:"50%",background:"currentColor",opacity:0.4,flexShrink:0 }}/>
                      <span style={{ flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{item.label}</span>
                      {item.status!=="stable"&&<StatusBadge status={item.status as Status}/>}
                    </button>
                  ))}
                </div>
              ))}
              {search&&filtered.length===0&&<div style={{ padding:"16px 8px",fontSize:"12px",color:"#a1a1aa" }}>Nenhum resultado para "{search}"</div>}
            </nav>
          </div>
        </aside>
        <div style={{ flex:1,overflow:"auto" }}>
          <header style={{ borderBottom:"1px solid #e4e4e7",padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(8px)",zIndex:10 }}>
            <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{ padding:"6px",borderRadius:"6px",border:"none",background:"transparent",cursor:"pointer",display:"flex" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
              <span style={{ fontSize:"13px",color:"#a1a1aa" }}>
                {activeSection==="installation"?"Instalação":activeSection==="tokens"?"Design Tokens":navItems.find(i=>i.id===activeSection)?.label||""}
              </span>
              <button onClick={()=>setDarkMode(!darkMode)} style={{ padding:"6px",borderRadius:"6px",border:"none",background:"transparent",cursor:"pointer",fontSize:"14px" }}>{darkMode?"☀️":"🌙"}</button>
            </div>
          </header>
          <main style={{ padding:"32px",maxWidth:"900px",margin:"0 auto" }}>
            <ErrorBoundary>
            {activeSection==="installation"&&<InstallationPage />}
            {activeSection==="tokens"&&<GlobalTokensPage />}
      {activeSection === "Control" && (
        <ComponentDoc
          key="Control"
          name="Control"
          description=""
          figmaUrl="https://figma.com/file/undefined?node-id=74-943"
          status="stable"
          category="Control"
          width={138}
          height={141}
          reactCode={`// @ts-nocheck
import * as React from "react"

export interface ControlProps {
  state?: "Default" | "Disabled"
  size?: "Small" | "Large"
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Control = React.forwardRef<HTMLDivElement, ControlProps>(
  ({ state = "Default", size = "Small", className, children, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "5px", background: "#e8e8e8", border: "1px solid #e4e4e7", fontFamily: "system-ui", fontSize: "14px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Control"}
    </div>
    )
  }
)
Control.displayName = "Control"

export { Control }
export default Control`}
          tailwindCode={`// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[138px] h-[141px]", {
  variants: {
    state: {
      default: "",
      disabled: "",
    },
    size: {
      small: "",
      large: "",
    },
  },
  defaultVariants: {
  },
})


export interface ControlProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Control({ className, children, ...props }: ControlProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Control`}
          htmlCode={`<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:5px;background:#e8e8e8;border:1px solid #e4e4e7;font-family:system-ui">
  <div style="display:flex;flex-direction:column;gap:2px">
    <span style="font-size:14px;font-weight:400;color:#18181b">Control</span>
  </div>
</div>`}
          cssCode={`:root {
  --color-primary: #9747ff;
  --color-secondary: #e8e8e8;
  --color-accent-2: #d9d9d9;
  --color-accent-3: #262626;
  --color-accent-4: #f2f2f2;
  --radius: 5px;
}

.root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  width: 138px;
  height: 141px;
  border-radius: var(--radius, 5px);
  overflow: hidden;
}

.root svg {
  width: 100%;
  height: 100%;
  display: block;
}`}
          svgCode={`<svg width="138" height="141" viewBox="0 0 138 141" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="137" height="140" rx="4.5" stroke="#9747FF" stroke-dasharray="10 5"/>
<path d="M20 103C20 94.1634 27.1634 87 36 87C44.8366 87 52 94.1634 52 103C52 111.837 44.8366 119 36 119C27.1634 119 20 111.837 20 103Z" fill="#E8E8E8"/>
<mask id="mask0_74_943" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="24" y="91" width="24" height="24">
<rect x="24" y="91" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_74_943)">
<path d="M36.9463 103L32.3463 98.4L33.4 97.3463L39.0538 103L33.4 108.654L32.3463 107.6L36.9463 103Z" fill="#262626"/>
</g>
<path d="M20 40C20 28.9543 28.9543 20 40 20C51.0457 20 60 28.9543 60 40C60 51.0457 51.0457 60 40 60C28.9543 60 20 51.0457 20 40Z" fill="#E8E8E8"/>
<mask id="mask1_74_943" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="28" y="28" width="24" height="24">
<rect x="28" y="28" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask1_74_943)">
<path d="M40.9463 40L36.3463 35.4L37.4 34.3462L43.0538 40L37.4 45.6537L36.3463 44.6L40.9463 40Z" fill="#262626"/>
</g>
<path d="M78 40C78 28.9543 86.9543 20 98 20C109.046 20 118 28.9543 118 40C118 51.0457 109.046 60 98 60C86.9543 60 78 51.0457 78 40Z" fill="#F2F2F2"/>
<mask id="mask2_74_943" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="86" y="28" width="24" height="24">
<rect x="86" y="28" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask2_74_943)">
<path d="M98.9463 40L94.3463 35.4L95.4 34.3462L101.054 40L95.4 45.6537L94.3463 44.6L98.9463 40Z" fill="#262626" fill-opacity="0.4"/>
</g>
<path d="M82 103C82 94.1634 89.1634 87 98 87C106.837 87 114 94.1634 114 103C114 111.837 106.837 119 98 119C89.1634 119 82 111.837 82 103Z" fill="#F2F2F2"/>
<mask id="mask3_74_943" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="86" y="91" width="24" height="24">
<rect x="86" y="91" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask3_74_943)">
<path d="M98.9463 103L94.3463 98.4L95.4 97.3463L101.054 103L95.4 108.654L94.3463 107.6L98.9463 103Z" fill="#262626" fill-opacity="0.4"/>
</g>
</svg>
`}
          aiCode={`// @ts-nocheck
import * as React from "react"

export interface ControlProps {
  state?: "Default" | "Disabled"
  size?: "Small" | "Large"
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Control = React.forwardRef<HTMLDivElement, ControlProps>(
  ({ state = "Default", size = "Small", className, children, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "5px", background: "#e8e8e8", border: "1px solid #e4e4e7", fontFamily: "system-ui", fontSize: "14px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Control"}
    </div>
    )
  }
)
Control.displayName = "Control"

export { Control }
export default Control`}
          tokens={{
  "colors": [
    "#9747ff",
    "#e8e8e8",
    "#d9d9d9",
    "#262626",
    "#f2f2f2"
  ],
  "typography": [],
  "spacing": [
    "8px"
  ],
  "borderRadius": [
    "5px",
    "1000px"
  ],
  "shadows": []
}}
          variantProperties={[
  {
    "name": "State",
    "values": [
      "Default",
      "Disabled"
    ]
  },
  {
    "name": "Size",
    "values": [
      "Small",
      "Large"
    ]
  }
]}
          anatomy={{
  "name": "State=Default, Size=Small",
  "type": "COMPONENT",
  "visible": true,
  "children": [
    {
      "name": "chevron_forward",
      "type": "INSTANCE",
      "visible": true,
      "children": [
        {
          "name": "Bounding box",
          "type": "RECTANGLE",
          "visible": true,
          "children": []
        },
        {
          "name": "chevron_forward",
          "type": "VECTOR",
          "visible": true,
          "children": []
        }
      ]
    }
  ]
}}
          a11y={[
  {
    "role": "img",
    "note": "Ícone decorativo — usar aria-hidden=\"true\""
  }
]}
        />
      )}
      {activeSection === "Checkbox" && (
        <ComponentDoc
          key="Checkbox"
          name="Checkbox"
          description=""
          figmaUrl="https://figma.com/file/undefined?node-id=79-962"
          status="stable"
          category="Checkbox"
          width={341}
          height={116}
          reactCode={`// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps {
  state?: "Default" | "Disabled" | "Selected" | "Error";
  size?: "Large" | "Small";
  className?: string;
  children?: React.ReactNode
}

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[341px] h-[116px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
export default Checkbox`}
          tailwindCode={`// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[341px] h-[116px]", {
  variants: {
    state: {
      default: "",
      disabled: "",
      selected: "",
      error: "",
    },
    size: {
      large: "",
      small: "",
    },
  },
  defaultVariants: {
  },
})


export interface CheckboxProps extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Checkbox`}
          htmlCode={`<!-- Checkbox -->
<div class="checkbox">
  <svg width="341" height="116" width="341" height="116" viewBox="0 0 341 116" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="340" height="115" rx="4.5" stroke="#9747FF" stroke-dasharray="10 5"/>
<path d="M26 20.5H42C43.933 20.5 45.5 22.067 45.5 24V40C45.5 41.933 43.933 43.5 42 43.5H26C24.067 43.5 22.5 41.933 22.5 40V24C22.5 22.067 24.067 20.5 26 20.5Z" fill="white" stroke="#D5D5D5"/>
<path d="M277 20.5H293C294.933 20.5 296.5 22.067 296.5 24V40C296.5 41.933 294.933 43.5 293 43.5H277C275.067 43.5 273.5 41.933 273.5 40V24C273.5 22.067 275.067 20.5 277 20.5Z" fill="white" stroke="#DA0202"/>
<path d="M24 64.7H48C49.933 64.7 51.5 66.267 51.5 68.2V92.2C51.5 94.1329 49.933 95.7 48 95.7H24C22.067 95.7 20.5 94.1329 20.5 92.2V68.2C20.5 66.267 22.067 64.7 24 64.7Z" fill="white" stroke="#D5D5D5"/>
<path d="M277 61.5H301C302.933 61.5 304.5 63.067 304.5 65V89C304.5 90.933 302.933 92.5 301 92.5H277C275.067 92.5 273.5 90.933 273.5 89V65C273.5 63.067 275.067 61.5 277 61.5Z" fill="white" stroke="#DA0202"/>
<path d="M198 20.5H214C215.933 20.5 217.5 22.067 217.5 24V40C217.5 41.933 215.933 43.5 214 43.5H198C196.067 43.5 194.5 41.933 194.5 40V24C194.5 22.067 196.067 20.5 198 20.5Z" fill="#E8E8E8" stroke="#D5D5D5"/>
<path d="M198 64.7H222C223.933 64.7 225.5 66.267 225.5 68.2V92.2C225.5 94.1329 223.933 95.7 222 95.7H198C196.067 95.7 194.5 94.1329 194.5 92.2V68.2C194.5 66.267 196.067 64.7 198 64.7Z" fill="#E8E8E8" stroke="#D5D5D5"/>
<path d="M119 20.5H135C136.933 20.5 138.5 22.067 138.5 24V40C138.5 41.933 136.933 43.5 135 43.5H119C117.067 43.5 115.5 41.933 115.5 40V24C115.5 22.067 117.067 20.5 119 20.5Z" fill="white" stroke="#D5D5D5"/>
<path d="M136 27L124 39L118.5 33.5L119.91 32.09L124 36.17L134.59 25.59L136 27Z" fill="#FC3D55"/>
<path d="M119 64.7H143C144.933 64.7 146.5 66.267 146.5 68.2V92.2C146.5 94.1329 144.933 95.7 143 95.7H119C117.067 95.7 115.5 94.1329 115.5 92.2V68.2C115.5 66.267 117.067 64.7 119 64.7Z" fill="white" stroke="#D5D5D5"/>
<path d="M143 73.5333L127 89.5333L119.667 82.2L121.547 80.32L127 85.76L141.12 71.6533L143 73.5333Z" fill="#FC3D55"/>
</svg>
</div>`}
          cssCode={`:root {
  --color-primary: #9747ff;
  --color-secondary: #ffffff;
  --color-accent-2: #d5d5d5;
  --color-accent-3: #da0202;
  --color-accent-4: #e8e8e8;
  --color-accent-5: #fc3d55;
  --radius: 5px;
}

.root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  width: 341px;
  height: 116px;
  border-radius: var(--radius, 5px);
  overflow: hidden;
}

.root svg {
  width: 100%;
  height: 100%;
  display: block;
}`}
          svgCode={`<svg width="341" height="116" viewBox="0 0 341 116" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="340" height="115" rx="4.5" stroke="#9747FF" stroke-dasharray="10 5"/>
<path d="M26 20.5H42C43.933 20.5 45.5 22.067 45.5 24V40C45.5 41.933 43.933 43.5 42 43.5H26C24.067 43.5 22.5 41.933 22.5 40V24C22.5 22.067 24.067 20.5 26 20.5Z" fill="white" stroke="#D5D5D5"/>
<path d="M277 20.5H293C294.933 20.5 296.5 22.067 296.5 24V40C296.5 41.933 294.933 43.5 293 43.5H277C275.067 43.5 273.5 41.933 273.5 40V24C273.5 22.067 275.067 20.5 277 20.5Z" fill="white" stroke="#DA0202"/>
<path d="M24 64.7H48C49.933 64.7 51.5 66.267 51.5 68.2V92.2C51.5 94.1329 49.933 95.7 48 95.7H24C22.067 95.7 20.5 94.1329 20.5 92.2V68.2C20.5 66.267 22.067 64.7 24 64.7Z" fill="white" stroke="#D5D5D5"/>
<path d="M277 61.5H301C302.933 61.5 304.5 63.067 304.5 65V89C304.5 90.933 302.933 92.5 301 92.5H277C275.067 92.5 273.5 90.933 273.5 89V65C273.5 63.067 275.067 61.5 277 61.5Z" fill="white" stroke="#DA0202"/>
<path d="M198 20.5H214C215.933 20.5 217.5 22.067 217.5 24V40C217.5 41.933 215.933 43.5 214 43.5H198C196.067 43.5 194.5 41.933 194.5 40V24C194.5 22.067 196.067 20.5 198 20.5Z" fill="#E8E8E8" stroke="#D5D5D5"/>
<path d="M198 64.7H222C223.933 64.7 225.5 66.267 225.5 68.2V92.2C225.5 94.1329 223.933 95.7 222 95.7H198C196.067 95.7 194.5 94.1329 194.5 92.2V68.2C194.5 66.267 196.067 64.7 198 64.7Z" fill="#E8E8E8" stroke="#D5D5D5"/>
<path d="M119 20.5H135C136.933 20.5 138.5 22.067 138.5 24V40C138.5 41.933 136.933 43.5 135 43.5H119C117.067 43.5 115.5 41.933 115.5 40V24C115.5 22.067 117.067 20.5 119 20.5Z" fill="white" stroke="#D5D5D5"/>
<path d="M136 27L124 39L118.5 33.5L119.91 32.09L124 36.17L134.59 25.59L136 27Z" fill="#FC3D55"/>
<path d="M119 64.7H143C144.933 64.7 146.5 66.267 146.5 68.2V92.2C146.5 94.1329 144.933 95.7 143 95.7H119C117.067 95.7 115.5 94.1329 115.5 92.2V68.2C115.5 66.267 117.067 64.7 119 64.7Z" fill="white" stroke="#D5D5D5"/>
<path d="M143 73.5333L127 89.5333L119.667 82.2L121.547 80.32L127 85.76L141.12 71.6533L143 73.5333Z" fill="#FC3D55"/>
</svg>
`}
          aiCode={`// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps {
  state?: "Default" | "Disabled" | "Selected" | "Error";
  size?: "Large" | "Small";
  className?: string;
  children?: React.ReactNode
}

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[341px] h-[116px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
export default Checkbox`}
          tokens={{
  "colors": [
    "#9747ff",
    "#ffffff",
    "#d5d5d5",
    "#da0202",
    "#e8e8e8",
    "#fc3d55"
  ],
  "typography": [],
  "spacing": [],
  "borderRadius": [
    "5px",
    "4px"
  ],
  "shadows": []
}}
          variantProperties={[
  {
    "name": "State",
    "values": [
      "Default",
      "Disabled",
      "Selected",
      "Error"
    ]
  },
  {
    "name": "Size",
    "values": [
      "Large",
      "Small"
    ]
  }
]}
          anatomy={{
  "name": "State=Default, Size=Small",
  "type": "COMPONENT",
  "visible": true,
  "children": [
    {
      "name": "Checkbox",
      "type": "RECTANGLE",
      "visible": true,
      "children": []
    }
  ]
}}
          a11y={[
  {
    "role": "checkbox",
    "note": "Estado â requer aria-checked"
  }
]}
        />
      )}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  )
}