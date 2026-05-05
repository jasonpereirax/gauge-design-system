/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect } from "react"
import Component1 from "./components/Component1/Component1"
import Breadchumb from "./components/Breadchumb/Breadchumb"
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
    "#0b1641",
    "#d9d9d9",
    "#cccccc"
  ],
  typography: [
    { fontFamily: "Avenir Next LT Pro", fontSize: 12, fontWeight: "Light" }
  ],
  borderRadius: [
    "5px"
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
  { id: "Component1", label: "Component 1", category: "Colors", status: "stable" },
  { id: "Breadchumb", label: "Breadchumb", category: "Colors", status: "stable" }
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
      {activeSection === "Component1" && (
        <ComponentDoc
          key="Component1"
          name="Component 1"
          description=""
          figmaUrl="https://figma.com/file/undefined?node-id=60-700"
          status="stable"
          category="Colors"
          width={173}
          height={64}
          reactCode={`// @ts-nocheck
import * as React from "react"

export interface Component1Props {
  state?: "Active" | "Default"
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Component1 = React.forwardRef<HTMLDivElement, Component1Props>(
  ({ state = "Active", className, children, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "5px", background: "#0b1641", border: "1px solid #e4e4e7", fontFamily: "Avenir Next LT Pro", fontSize: "12px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Component 1"}
    </div>
    )
  }
)
Component1.displayName = "Component1"

export { Component1 }
export default Component1`}
          tailwindCode={`// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const variants = cva("inline-flex items-center justify-center rounded w-[173px] h-[64px]", {
  variants: {
    state: {
      active: "",
      default: "",
    },
  },
  defaultVariants: {
  },
})


export interface Component1Props extends VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
}

export function Component1({ className, children, ...props }: Component1Props) {
  return (
    <div className={cn(variants(props), className)}>
      {children}
    </div>
  )
}

export default Component1`}
          htmlCode={`<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:5px;background:#0b1641;border:1px solid #e4e4e7;font-family:Avenir Next LT Pro">
  <div style="display:flex;flex-direction:column;gap:2px">
    <span style="font-size:12px;font-weight:Light;color:#18181b">Component 1</span>
  </div>
</div>`}
          cssCode={`:root {
  --color-primary: #9747ff;
  --color-secondary: #0b1641;
  --color-accent-2: #d9d9d9;
  --color-accent-3: #cccccc;
  --radius: 5px;
}

.root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  width: 173px;
  height: 64px;
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
          svgCode={`<svg width="173" height="64" viewBox="0 0 173 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="172" height="63" rx="4.5" stroke="#9747FF" stroke-dasharray="10 5"/>
<path d="M21.1777 28.0039H23.5391C23.9336 28.0039 24.3027 28.0469 24.6465 28.1328C24.9902 28.2148 25.2852 28.3457 25.5312 28.5254C25.7812 28.7051 25.9766 28.9355 26.1172 29.2168C26.2617 29.498 26.334 29.834 26.334 30.2246C26.334 30.5996 26.2656 30.9277 26.1289 31.209C25.9961 31.4902 25.8066 31.7246 25.5605 31.9121C25.3184 32.0996 25.0273 32.2422 24.6875 32.3398C24.3477 32.4336 23.9766 32.4805 23.5742 32.4805H21.8574V36.5H21.1777V28.0039ZM23.5391 31.9062C24.1719 31.9062 24.6816 31.7676 25.0684 31.4902C25.459 31.2129 25.6543 30.791 25.6543 30.2246C25.6543 29.9355 25.5996 29.6895 25.4902 29.4863C25.3809 29.2832 25.2324 29.1152 25.0449 28.9824C24.8574 28.8496 24.6328 28.752 24.3711 28.6895C24.1133 28.623 23.832 28.5898 23.5273 28.5898H21.8574V31.9062H23.5391ZM26.9082 34.9883C26.9082 34.5898 27.0059 34.2676 27.2012 34.0215C27.3965 33.7715 27.6543 33.5801 27.9746 33.4473C28.2949 33.3145 28.6562 33.2266 29.0586 33.1836C29.4648 33.1367 29.8789 33.1133 30.3008 33.1133H30.8691V32.8613C30.8691 32.334 30.7305 31.9434 30.4531 31.6895C30.1758 31.4316 29.7852 31.3027 29.2812 31.3027C28.9453 31.3027 28.6348 31.3633 28.3496 31.4844C28.0684 31.6055 27.8242 31.7656 27.6172 31.9648L27.2539 31.5312C27.4883 31.3008 27.7871 31.1152 28.1504 30.9746C28.5137 30.834 28.9121 30.7637 29.3457 30.7637C29.6543 30.7637 29.9395 30.8066 30.2012 30.8926C30.4629 30.9746 30.6895 31.0996 30.8809 31.2676C31.0723 31.4355 31.2207 31.6465 31.3262 31.9004C31.4355 32.1504 31.4902 32.4473 31.4902 32.791V35.2402C31.4902 35.4551 31.498 35.6797 31.5137 35.9141C31.5293 36.1445 31.5547 36.3398 31.5898 36.5H30.998C30.9746 36.3555 30.9531 36.1855 30.9336 35.9902C30.9141 35.7949 30.9043 35.6211 30.9043 35.4688H30.8809C30.6465 35.875 30.3594 36.1758 30.0195 36.3711C29.6797 36.5625 29.2812 36.6582 28.8242 36.6582C28.6094 36.6582 28.3867 36.627 28.1562 36.5645C27.9297 36.5059 27.7246 36.4082 27.541 36.2715C27.3574 36.1348 27.2051 35.9629 27.084 35.7559C26.9668 35.5488 26.9082 35.293 26.9082 34.9883ZM30.8691 34.0859V33.6348H30.4473C30.1191 33.6348 29.7871 33.6484 29.4512 33.6758C29.1152 33.7031 28.8066 33.7637 28.5254 33.8574C28.248 33.9473 28.0195 34.0801 27.8398 34.2559C27.6641 34.4316 27.5762 34.6641 27.5762 34.9531C27.5762 35.168 27.6172 35.3516 27.6992 35.5039C27.7852 35.6562 27.8965 35.7773 28.0332 35.8672C28.1699 35.9531 28.3203 36.0156 28.4844 36.0547C28.6484 36.0938 28.8145 36.1133 28.9824 36.1133C29.3027 36.1133 29.582 36.0566 29.8203 35.9434C30.0625 35.8262 30.2598 35.6738 30.4121 35.4863C30.5645 35.2988 30.6777 35.084 30.752 34.8418C30.8301 34.5957 30.8691 34.3438 30.8691 34.0859ZM33.4297 38.3105L33.8457 37.8652C34.127 38.1699 34.4609 38.4082 34.8477 38.5801C35.2383 38.752 35.6484 38.8379 36.0781 38.8379C36.5039 38.8379 36.8613 38.7715 37.1504 38.6387C37.4434 38.5098 37.6777 38.3301 37.8535 38.0996C38.0293 37.873 38.1543 37.6094 38.2285 37.3086C38.3066 37.0078 38.3457 36.6934 38.3457 36.3652V35.2754H38.3223C38.0996 35.6855 37.7852 36 37.3789 36.2188C36.9766 36.4375 36.5469 36.5469 36.0898 36.5469C35.668 36.5469 35.2793 36.4746 34.9238 36.3301C34.5723 36.1855 34.2695 35.9863 34.0156 35.7324C33.7656 35.4746 33.5723 35.1699 33.4355 34.8184C33.3027 34.4668 33.2363 34.0879 33.2363 33.6816C33.2363 33.2715 33.3027 32.8906 33.4355 32.5391C33.5723 32.1875 33.7656 31.8809 34.0156 31.6191C34.2695 31.3535 34.5723 31.1445 34.9238 30.9922C35.2793 30.8398 35.668 30.7637 36.0898 30.7637C36.5391 30.7637 36.9648 30.873 37.3672 31.0918C37.7734 31.3066 38.0918 31.625 38.3223 32.0469H38.3457V30.9102H39.0078V36.3652C39.0078 36.7207 38.9629 37.0781 38.873 37.4375C38.7871 37.7969 38.6328 38.1211 38.4102 38.4102C38.1914 38.7031 37.8906 38.9434 37.5078 39.1309C37.125 39.3223 36.6406 39.418 36.0547 39.418C35.5273 39.418 35.0371 39.3184 34.584 39.1191C34.1309 38.9238 33.7461 38.6543 33.4297 38.3105ZM38.4219 33.6582C38.4219 33.3457 38.3652 33.0469 38.252 32.7617C38.1387 32.4766 37.9824 32.2266 37.7832 32.0117C37.584 31.7969 37.3438 31.625 37.0625 31.4961C36.7812 31.3672 36.4766 31.3027 36.1484 31.3027C35.7969 31.3027 35.4824 31.3672 35.2051 31.4961C34.9316 31.625 34.6992 31.7969 34.5078 32.0117C34.3164 32.2266 34.1699 32.4766 34.0684 32.7617C33.9707 33.0469 33.9219 33.3457 33.9219 33.6582C33.9219 33.9668 33.9707 34.2637 34.0684 34.5488C34.1699 34.834 34.3164 35.084 34.5078 35.2988C34.6992 35.5137 34.9316 35.6836 35.2051 35.8086C35.4824 35.9336 35.7969 35.9961 36.1484 35.9961C36.4766 35.9961 36.7812 35.9395 37.0625 35.8262C37.3438 35.709 37.584 35.5449 37.7832 35.334C37.9824 35.1191 38.1387 34.8711 38.252 34.5898C38.3652 34.3047 38.4219 33.9941 38.4219 33.6582ZM40.7949 33.6934C40.7949 33.2754 40.8672 32.8867 41.0117 32.5273C41.1562 32.168 41.3516 31.8594 41.5977 31.6016C41.8438 31.3398 42.1348 31.1348 42.4707 30.9863C42.8105 30.8379 43.1758 30.7637 43.5664 30.7637C44.0078 30.7637 44.3906 30.8379 44.7148 30.9863C45.043 31.1348 45.3164 31.3359 45.5352 31.5898C45.7578 31.8398 45.9238 32.1289 46.0332 32.457C46.1465 32.7852 46.2031 33.1328 46.2031 33.5V33.834H41.4629C41.4746 34.1309 41.5312 34.416 41.6328 34.6895C41.7383 34.959 41.8848 35.1992 42.0723 35.4102C42.2598 35.6172 42.4863 35.7832 42.752 35.9082C43.0215 36.0293 43.3203 36.0898 43.6484 36.0898C44.082 36.0898 44.4453 36.0078 44.7383 35.8438C45.0352 35.6797 45.3125 35.4473 45.5703 35.1465L46.0039 35.4922C45.6914 35.8984 45.3359 36.1953 44.9375 36.3828C44.543 36.5664 44.1055 36.6582 43.625 36.6582C43.2188 36.6582 42.8398 36.584 42.4883 36.4355C42.1406 36.2871 41.8398 36.082 41.5859 35.8203C41.3359 35.5547 41.1406 35.2402 41 34.877C40.8633 34.5098 40.7949 34.1152 40.7949 33.6934ZM45.5586 33.3184C45.543 33.0254 45.4863 32.7578 45.3887 32.5156C45.2949 32.2695 45.1641 32.0566 44.9961 31.877C44.8281 31.6934 44.623 31.5527 44.3809 31.4551C44.1426 31.3535 43.8672 31.3027 43.5547 31.3027C43.2422 31.3027 42.959 31.3652 42.7051 31.4902C42.4551 31.6152 42.2402 31.7734 42.0605 31.9648C41.8809 32.1562 41.7402 32.373 41.6387 32.6152C41.541 32.8535 41.4883 33.0879 41.4805 33.3184H45.5586Z" fill="#0B1641"/>
<mask id="mask0_60_700" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="55" y="20" width="24" height="24">
<rect x="55" y="20" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_60_700)">
<path d="M67.9463 32L63.3463 27.4L64.4 26.3462L70.0538 32L64.4 37.6537L63.3463 36.6L67.9463 32Z" fill="#0B1641"/>
</g>
<path d="M94.1777 28.0039H96.5391C96.9336 28.0039 97.3027 28.0469 97.6465 28.1328C97.9902 28.2148 98.2852 28.3457 98.5312 28.5254C98.7812 28.7051 98.9766 28.9355 99.1172 29.2168C99.2617 29.498 99.334 29.834 99.334 30.2246C99.334 30.5996 99.2656 30.9277 99.1289 31.209C98.9961 31.4902 98.8066 31.7246 98.5605 31.9121C98.3184 32.0996 98.0273 32.2422 97.6875 32.3398C97.3477 32.4336 96.9766 32.4805 96.5742 32.4805H94.8574V36.5H94.1777V28.0039ZM96.5391 31.9062C97.1719 31.9062 97.6816 31.7676 98.0684 31.4902C98.459 31.2129 98.6543 30.791 98.6543 30.2246C98.6543 29.9355 98.5996 29.6895 98.4902 29.4863C98.3809 29.2832 98.2324 29.1152 98.0449 28.9824C97.8574 28.8496 97.6328 28.752 97.3711 28.6895C97.1133 28.623 96.832 28.5898 96.5273 28.5898H94.8574V31.9062H96.5391ZM99.9082 34.9883C99.9082 34.5898 100.006 34.2676 100.201 34.0215C100.396 33.7715 100.654 33.5801 100.975 33.4473C101.295 33.3145 101.656 33.2266 102.059 33.1836C102.465 33.1367 102.879 33.1133 103.301 33.1133H103.869V32.8613C103.869 32.334 103.73 31.9434 103.453 31.6895C103.176 31.4316 102.785 31.3027 102.281 31.3027C101.945 31.3027 101.635 31.3633 101.35 31.4844C101.068 31.6055 100.824 31.7656 100.617 31.9648L100.254 31.5312C100.488 31.3008 100.787 31.1152 101.15 30.9746C101.514 30.834 101.912 30.7637 102.346 30.7637C102.654 30.7637 102.939 30.8066 103.201 30.8926C103.463 30.9746 103.689 31.0996 103.881 31.2676C104.072 31.4355 104.221 31.6465 104.326 31.9004C104.436 32.1504 104.49 32.4473 104.49 32.791V35.2402C104.49 35.4551 104.498 35.6797 104.514 35.9141C104.529 36.1445 104.555 36.3398 104.59 36.5H103.998C103.975 36.3555 103.953 36.1855 103.934 35.9902C103.914 35.7949 103.904 35.6211 103.904 35.4688H103.881C103.646 35.875 103.359 36.1758 103.02 36.3711C102.68 36.5625 102.281 36.6582 101.824 36.6582C101.609 36.6582 101.387 36.627 101.156 36.5645C100.93 36.5059 100.725 36.4082 100.541 36.2715C100.357 36.1348 100.205 35.9629 100.084 35.7559C99.9668 35.5488 99.9082 35.293 99.9082 34.9883ZM103.869 34.0859V33.6348H103.447C103.119 33.6348 102.787 33.6484 102.451 33.6758C102.115 33.7031 101.807 33.7637 101.525 33.8574C101.248 33.9473 101.02 34.0801 100.84 34.2559C100.664 34.4316 100.576 34.6641 100.576 34.9531C100.576 35.168 100.617 35.3516 100.699 35.5039C100.785 35.6562 100.896 35.7773 101.033 35.8672C101.17 35.9531 101.32 36.0156 101.484 36.0547C101.648 36.0938 101.814 36.1133 101.982 36.1133C102.303 36.1133 102.582 36.0566 102.82 35.9434C103.062 35.8262 103.26 35.6738 103.412 35.4863C103.564 35.2988 103.678 35.084 103.752 34.8418C103.83 34.5957 103.869 34.3438 103.869 34.0859ZM106.43 38.3105L106.846 37.8652C107.127 38.1699 107.461 38.4082 107.848 38.5801C108.238 38.752 108.648 38.8379 109.078 38.8379C109.504 38.8379 109.861 38.7715 110.15 38.6387C110.443 38.5098 110.678 38.3301 110.854 38.0996C111.029 37.873 111.154 37.6094 111.229 37.3086C111.307 37.0078 111.346 36.6934 111.346 36.3652V35.2754H111.322C111.1 35.6855 110.785 36 110.379 36.2188C109.977 36.4375 109.547 36.5469 109.09 36.5469C108.668 36.5469 108.279 36.4746 107.924 36.3301C107.572 36.1855 107.27 35.9863 107.016 35.7324C106.766 35.4746 106.572 35.1699 106.436 34.8184C106.303 34.4668 106.236 34.0879 106.236 33.6816C106.236 33.2715 106.303 32.8906 106.436 32.5391C106.572 32.1875 106.766 31.8809 107.016 31.6191C107.27 31.3535 107.572 31.1445 107.924 30.9922C108.279 30.8398 108.668 30.7637 109.09 30.7637C109.539 30.7637 109.965 30.873 110.367 31.0918C110.773 31.3066 111.092 31.625 111.322 32.0469H111.346V30.9102H112.008V36.3652C112.008 36.7207 111.963 37.0781 111.873 37.4375C111.787 37.7969 111.633 38.1211 111.41 38.4102C111.191 38.7031 110.891 38.9434 110.508 39.1309C110.125 39.3223 109.641 39.418 109.055 39.418C108.527 39.418 108.037 39.3184 107.584 39.1191C107.131 38.9238 106.746 38.6543 106.43 38.3105ZM111.422 33.6582C111.422 33.3457 111.365 33.0469 111.252 32.7617C111.139 32.4766 110.982 32.2266 110.783 32.0117C110.584 31.7969 110.344 31.625 110.062 31.4961C109.781 31.3672 109.477 31.3027 109.148 31.3027C108.797 31.3027 108.482 31.3672 108.205 31.4961C107.932 31.625 107.699 31.7969 107.508 32.0117C107.316 32.2266 107.17 32.4766 107.068 32.7617C106.971 33.0469 106.922 33.3457 106.922 33.6582C106.922 33.9668 106.971 34.2637 107.068 34.5488C107.17 34.834 107.316 35.084 107.508 35.2988C107.699 35.5137 107.932 35.6836 108.205 35.8086C108.482 35.9336 108.797 35.9961 109.148 35.9961C109.477 35.9961 109.781 35.9395 110.062 35.8262C110.344 35.709 110.584 35.5449 110.783 35.334C110.982 35.1191 111.139 34.8711 111.252 34.5898C111.365 34.3047 111.422 33.9941 111.422 33.6582ZM113.795 33.6934C113.795 33.2754 113.867 32.8867 114.012 32.5273C114.156 32.168 114.352 31.8594 114.598 31.6016C114.844 31.3398 115.135 31.1348 115.471 30.9863C115.811 30.8379 116.176 30.7637 116.566 30.7637C117.008 30.7637 117.391 30.8379 117.715 30.9863C118.043 31.1348 118.316 31.3359 118.535 31.5898C118.758 31.8398 118.924 32.1289 119.033 32.457C119.146 32.7852 119.203 33.1328 119.203 33.5V33.834H114.463C114.475 34.1309 114.531 34.416 114.633 34.6895C114.738 34.959 114.885 35.1992 115.072 35.4102C115.26 35.6172 115.486 35.7832 115.752 35.9082C116.021 36.0293 116.32 36.0898 116.648 36.0898C117.082 36.0898 117.445 36.0078 117.738 35.8438C118.035 35.6797 118.312 35.4473 118.57 35.1465L119.004 35.4922C118.691 35.8984 118.336 36.1953 117.938 36.3828C117.543 36.5664 117.105 36.6582 116.625 36.6582C116.219 36.6582 115.84 36.584 115.488 36.4355C115.141 36.2871 114.84 36.082 114.586 35.8203C114.336 35.5547 114.141 35.2402 114 34.877C113.863 34.5098 113.795 34.1152 113.795 33.6934ZM118.559 33.3184C118.543 33.0254 118.486 32.7578 118.389 32.5156C118.295 32.2695 118.164 32.0566 117.996 31.877C117.828 31.6934 117.623 31.5527 117.381 31.4551C117.143 31.3535 116.867 31.3027 116.555 31.3027C116.242 31.3027 115.959 31.3652 115.705 31.4902C115.455 31.6152 115.24 31.7734 115.061 31.9648C114.881 32.1562 114.74 32.373 114.639 32.6152C114.541 32.8535 114.488 33.0879 114.48 33.3184H118.559Z" fill="#CCCCCC"/>
<mask id="mask1_60_700" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="128" y="20" width="24" height="24">
<rect x="128" y="20" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask1_60_700)">
<path d="M140.946 32L136.346 27.4L137.4 26.3462L143.054 32L137.4 37.6537L136.346 36.6L140.946 32Z" fill="#CCCCCC"/>
</g>
</svg>
`}
          aiCode={`// @ts-nocheck
import * as React from "react"

export interface Component1Props {
  state?: "Active" | "Default"
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Component1 = React.forwardRef<HTMLDivElement, Component1Props>(
  ({ state = "Active", className, children, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "5px", background: "#0b1641", border: "1px solid #e4e4e7", fontFamily: "Avenir Next LT Pro", fontSize: "12px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Component 1"}
    </div>
    )
  }
)
Component1.displayName = "Component1"

export { Component1 }
export default Component1`}
          tokens={{
  "colors": [
    "#9747ff",
    "#0b1641",
    "#d9d9d9",
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
  "spacing": [
    "8px"
  ],
  "borderRadius": [
    "5px"
  ],
  "shadows": []
}}
          variantProperties={[
  {
    "name": "State",
    "values": [
      "Active",
      "Default"
    ]
  }
]}
          anatomy={{
  "name": "State=Active",
  "type": "COMPONENT",
  "visible": true,
  "children": [
    {
      "name": "Page",
      "type": "TEXT",
      "visible": true,
      "children": []
    },
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
    "role": "text",
    "note": "Texto visível — será lido por leitores de tela"
  },
  {
    "role": "img",
    "note": "Ícone decorativo — usar aria-hidden=\"true\""
  }
]}
        />
      )}
      {activeSection === "Breadchumb" && (
        <ComponentDoc
          key="Breadchumb"
          name="Breadchumb"
          description=""
          figmaUrl="https://figma.com/file/undefined?node-id=60-834"
          status="stable"
          category="Colors"
          width={429}
          height={24}
          reactCode={`// @ts-nocheck
import * as React from "react"

export interface BreadchumbProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Breadchumb = React.forwardRef<HTMLDivElement, BreadchumbProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "6px", background: "#d9d9d9", border: "1px solid #e4e4e7", fontFamily: "Avenir Next LT Pro", fontSize: "12px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Breadchumb"}
    </div>
    )
  }
)
Breadchumb.displayName = "Breadchumb"

export { Breadchumb }
export default Breadchumb`}
          tailwindCode={`// @ts-nocheck
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const baseClasses = "inline-flex items-center justify-center w-[429px] h-[24px]"

export interface BreadchumbProps {
  className?: string
  children?: React.ReactNode
}

export function Breadchumb({ className, children, ...props }: BreadchumbProps) {
  return (
    <div className={cn(baseClasses, className)}>
      {children}
    </div>
  )
}

export default Breadchumb`}
          htmlCode={`<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:6px;background:#d9d9d9;border:1px solid #e4e4e7;font-family:Avenir Next LT Pro">
  <div style="display:flex;flex-direction:column;gap:2px">
    <span style="font-size:12px;font-weight:Light;color:#18181b">Breadchumb</span>
  </div>
</div>`}
          cssCode={`:root {
  --color-primary: #cccccc;
  --color-secondary: #d9d9d9;
  --color-accent-2: #0b1641;
}

.root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  width: 429px;
  height: 24px;
  font-family: "Avenir Next LT Pro", system-ui, sans-serif;
  font-size: 12px;
  overflow: hidden;
}

.root svg {
  width: 100%;
  height: 100%;
  display: block;
}`}
          svgCode={`<svg width="429" height="24" viewBox="0 0 429 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.17773 8.00391H3.53906C3.93359 8.00391 4.30273 8.04688 4.64648 8.13281C4.99023 8.21484 5.28516 8.3457 5.53125 8.52539C5.78125 8.70508 5.97656 8.93555 6.11719 9.2168C6.26172 9.49805 6.33398 9.83398 6.33398 10.2246C6.33398 10.5996 6.26562 10.9277 6.12891 11.209C5.99609 11.4902 5.80664 11.7246 5.56055 11.9121C5.31836 12.0996 5.02734 12.2422 4.6875 12.3398C4.34766 12.4336 3.97656 12.4805 3.57422 12.4805H1.85742V16.5H1.17773V8.00391ZM3.53906 11.9062C4.17188 11.9062 4.68164 11.7676 5.06836 11.4902C5.45898 11.2129 5.6543 10.791 5.6543 10.2246C5.6543 9.93555 5.59961 9.68945 5.49023 9.48633C5.38086 9.2832 5.23242 9.11523 5.04492 8.98242C4.85742 8.84961 4.63281 8.75195 4.37109 8.68945C4.11328 8.62305 3.83203 8.58984 3.52734 8.58984H1.85742V11.9062H3.53906ZM6.9082 14.9883C6.9082 14.5898 7.00586 14.2676 7.20117 14.0215C7.39648 13.7715 7.6543 13.5801 7.97461 13.4473C8.29492 13.3145 8.65625 13.2266 9.05859 13.1836C9.46484 13.1367 9.87891 13.1133 10.3008 13.1133H10.8691V12.8613C10.8691 12.334 10.7305 11.9434 10.4531 11.6895C10.1758 11.4316 9.78516 11.3027 9.28125 11.3027C8.94531 11.3027 8.63477 11.3633 8.34961 11.4844C8.06836 11.6055 7.82422 11.7656 7.61719 11.9648L7.25391 11.5312C7.48828 11.3008 7.78711 11.1152 8.15039 10.9746C8.51367 10.834 8.91211 10.7637 9.3457 10.7637C9.6543 10.7637 9.93945 10.8066 10.2012 10.8926C10.4629 10.9746 10.6895 11.0996 10.8809 11.2676C11.0723 11.4355 11.2207 11.6465 11.3262 11.9004C11.4355 12.1504 11.4902 12.4473 11.4902 12.791V15.2402C11.4902 15.4551 11.498 15.6797 11.5137 15.9141C11.5293 16.1445 11.5547 16.3398 11.5898 16.5H10.998C10.9746 16.3555 10.9531 16.1855 10.9336 15.9902C10.9141 15.7949 10.9043 15.6211 10.9043 15.4688H10.8809C10.6465 15.875 10.3594 16.1758 10.0195 16.3711C9.67969 16.5625 9.28125 16.6582 8.82422 16.6582C8.60938 16.6582 8.38672 16.627 8.15625 16.5645C7.92969 16.5059 7.72461 16.4082 7.54102 16.2715C7.35742 16.1348 7.20508 15.9629 7.08398 15.7559C6.9668 15.5488 6.9082 15.293 6.9082 14.9883ZM10.8691 14.0859V13.6348H10.4473C10.1191 13.6348 9.78711 13.6484 9.45117 13.6758C9.11523 13.7031 8.80664 13.7637 8.52539 13.8574C8.24805 13.9473 8.01953 14.0801 7.83984 14.2559C7.66406 14.4316 7.57617 14.6641 7.57617 14.9531C7.57617 15.168 7.61719 15.3516 7.69922 15.5039C7.78516 15.6562 7.89648 15.7773 8.0332 15.8672C8.16992 15.9531 8.32031 16.0156 8.48438 16.0547C8.64844 16.0938 8.81445 16.1133 8.98242 16.1133C9.30273 16.1133 9.58203 16.0566 9.82031 15.9434C10.0625 15.8262 10.2598 15.6738 10.4121 15.4863C10.5645 15.2988 10.6777 15.084 10.752 14.8418C10.8301 14.5957 10.8691 14.3438 10.8691 14.0859ZM13.4297 18.3105L13.8457 17.8652C14.127 18.1699 14.4609 18.4082 14.8477 18.5801C15.2383 18.752 15.6484 18.8379 16.0781 18.8379C16.5039 18.8379 16.8613 18.7715 17.1504 18.6387C17.4434 18.5098 17.6777 18.3301 17.8535 18.0996C18.0293 17.873 18.1543 17.6094 18.2285 17.3086C18.3066 17.0078 18.3457 16.6934 18.3457 16.3652V15.2754H18.3223C18.0996 15.6855 17.7852 16 17.3789 16.2188C16.9766 16.4375 16.5469 16.5469 16.0898 16.5469C15.668 16.5469 15.2793 16.4746 14.9238 16.3301C14.5723 16.1855 14.2695 15.9863 14.0156 15.7324C13.7656 15.4746 13.5723 15.1699 13.4355 14.8184C13.3027 14.4668 13.2363 14.0879 13.2363 13.6816C13.2363 13.2715 13.3027 12.8906 13.4355 12.5391C13.5723 12.1875 13.7656 11.8809 14.0156 11.6191C14.2695 11.3535 14.5723 11.1445 14.9238 10.9922C15.2793 10.8398 15.668 10.7637 16.0898 10.7637C16.5391 10.7637 16.9648 10.873 17.3672 11.0918C17.7734 11.3066 18.0918 11.625 18.3223 12.0469H18.3457V10.9102H19.0078V16.3652C19.0078 16.7207 18.9629 17.0781 18.873 17.4375C18.7871 17.7969 18.6328 18.1211 18.4102 18.4102C18.1914 18.7031 17.8906 18.9434 17.5078 19.1309C17.125 19.3223 16.6406 19.418 16.0547 19.418C15.5273 19.418 15.0371 19.3184 14.584 19.1191C14.1309 18.9238 13.7461 18.6543 13.4297 18.3105ZM18.4219 13.6582C18.4219 13.3457 18.3652 13.0469 18.252 12.7617C18.1387 12.4766 17.9824 12.2266 17.7832 12.0117C17.584 11.7969 17.3438 11.625 17.0625 11.4961C16.7812 11.3672 16.4766 11.3027 16.1484 11.3027C15.7969 11.3027 15.4824 11.3672 15.2051 11.4961C14.9316 11.625 14.6992 11.7969 14.5078 12.0117C14.3164 12.2266 14.1699 12.4766 14.0684 12.7617C13.9707 13.0469 13.9219 13.3457 13.9219 13.6582C13.9219 13.9668 13.9707 14.2637 14.0684 14.5488C14.1699 14.834 14.3164 15.084 14.5078 15.2988C14.6992 15.5137 14.9316 15.6836 15.2051 15.8086C15.4824 15.9336 15.7969 15.9961 16.1484 15.9961C16.4766 15.9961 16.7812 15.9395 17.0625 15.8262C17.3438 15.709 17.584 15.5449 17.7832 15.334C17.9824 15.1191 18.1387 14.8711 18.252 14.5898C18.3652 14.3047 18.4219 13.9941 18.4219 13.6582ZM20.7949 13.6934C20.7949 13.2754 20.8672 12.8867 21.0117 12.5273C21.1562 12.168 21.3516 11.8594 21.5977 11.6016C21.8438 11.3398 22.1348 11.1348 22.4707 10.9863C22.8105 10.8379 23.1758 10.7637 23.5664 10.7637C24.0078 10.7637 24.3906 10.8379 24.7148 10.9863C25.043 11.1348 25.3164 11.3359 25.5352 11.5898C25.7578 11.8398 25.9238 12.1289 26.0332 12.457C26.1465 12.7852 26.2031 13.1328 26.2031 13.5V13.834H21.4629C21.4746 14.1309 21.5312 14.416 21.6328 14.6895C21.7383 14.959 21.8848 15.1992 22.0723 15.4102C22.2598 15.6172 22.4863 15.7832 22.752 15.9082C23.0215 16.0293 23.3203 16.0898 23.6484 16.0898C24.082 16.0898 24.4453 16.0078 24.7383 15.8438C25.0352 15.6797 25.3125 15.4473 25.5703 15.1465L26.0039 15.4922C25.6914 15.8984 25.3359 16.1953 24.9375 16.3828C24.543 16.5664 24.1055 16.6582 23.625 16.6582C23.2188 16.6582 22.8398 16.584 22.4883 16.4355C22.1406 16.2871 21.8398 16.082 21.5859 15.8203C21.3359 15.5547 21.1406 15.2402 21 14.877C20.8633 14.5098 20.7949 14.1152 20.7949 13.6934ZM25.5586 13.3184C25.543 13.0254 25.4863 12.7578 25.3887 12.5156C25.2949 12.2695 25.1641 12.0566 24.9961 11.877C24.8281 11.6934 24.623 11.5527 24.3809 11.4551C24.1426 11.3535 23.8672 11.3027 23.5547 11.3027C23.2422 11.3027 22.959 11.3652 22.7051 11.4902C22.4551 11.6152 22.2402 11.7734 22.0605 11.9648C21.8809 12.1562 21.7402 12.373 21.6387 12.6152C21.541 12.8535 21.4883 13.0879 21.4805 13.3184H25.5586Z" fill="#CCCCCC"/>
<mask id="mask0_60_834" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="35" y="0" width="24" height="24">
<rect x="35" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_60_834)">
<path d="M47.9463 12L43.3463 7.4L44.4 6.34625L50.0538 12L44.4 17.6538L43.3463 16.6L47.9463 12Z" fill="#CCCCCC"/>
</g>
<path d="M68.1777 8.00391H70.5391C70.9336 8.00391 71.3027 8.04688 71.6465 8.13281C71.9902 8.21484 72.2852 8.3457 72.5312 8.52539C72.7812 8.70508 72.9766 8.93555 73.1172 9.2168C73.2617 9.49805 73.334 9.83398 73.334 10.2246C73.334 10.5996 73.2656 10.9277 73.1289 11.209C72.9961 11.4902 72.8066 11.7246 72.5605 11.9121C72.3184 12.0996 72.0273 12.2422 71.6875 12.3398C71.3477 12.4336 70.9766 12.4805 70.5742 12.4805H68.8574V16.5H68.1777V8.00391ZM70.5391 11.9062C71.1719 11.9062 71.6816 11.7676 72.0684 11.4902C72.459 11.2129 72.6543 10.791 72.6543 10.2246C72.6543 9.93555 72.5996 9.68945 72.4902 9.48633C72.3809 9.2832 72.2324 9.11523 72.0449 8.98242C71.8574 8.84961 71.6328 8.75195 71.3711 8.68945C71.1133 8.62305 70.832 8.58984 70.5273 8.58984H68.8574V11.9062H70.5391ZM73.9082 14.9883C73.9082 14.5898 74.0059 14.2676 74.2012 14.0215C74.3965 13.7715 74.6543 13.5801 74.9746 13.4473C75.2949 13.3145 75.6562 13.2266 76.0586 13.1836C76.4648 13.1367 76.8789 13.1133 77.3008 13.1133H77.8691V12.8613C77.8691 12.334 77.7305 11.9434 77.4531 11.6895C77.1758 11.4316 76.7852 11.3027 76.2812 11.3027C75.9453 11.3027 75.6348 11.3633 75.3496 11.4844C75.0684 11.6055 74.8242 11.7656 74.6172 11.9648L74.2539 11.5312C74.4883 11.3008 74.7871 11.1152 75.1504 10.9746C75.5137 10.834 75.9121 10.7637 76.3457 10.7637C76.6543 10.7637 76.9395 10.8066 77.2012 10.8926C77.4629 10.9746 77.6895 11.0996 77.8809 11.2676C78.0723 11.4355 78.2207 11.6465 78.3262 11.9004C78.4355 12.1504 78.4902 12.4473 78.4902 12.791V15.2402C78.4902 15.4551 78.498 15.6797 78.5137 15.9141C78.5293 16.1445 78.5547 16.3398 78.5898 16.5H77.998C77.9746 16.3555 77.9531 16.1855 77.9336 15.9902C77.9141 15.7949 77.9043 15.6211 77.9043 15.4688H77.8809C77.6465 15.875 77.3594 16.1758 77.0195 16.3711C76.6797 16.5625 76.2812 16.6582 75.8242 16.6582C75.6094 16.6582 75.3867 16.627 75.1562 16.5645C74.9297 16.5059 74.7246 16.4082 74.541 16.2715C74.3574 16.1348 74.2051 15.9629 74.084 15.7559C73.9668 15.5488 73.9082 15.293 73.9082 14.9883ZM77.8691 14.0859V13.6348H77.4473C77.1191 13.6348 76.7871 13.6484 76.4512 13.6758C76.1152 13.7031 75.8066 13.7637 75.5254 13.8574C75.248 13.9473 75.0195 14.0801 74.8398 14.2559C74.6641 14.4316 74.5762 14.6641 74.5762 14.9531C74.5762 15.168 74.6172 15.3516 74.6992 15.5039C74.7852 15.6562 74.8965 15.7773 75.0332 15.8672C75.1699 15.9531 75.3203 16.0156 75.4844 16.0547C75.6484 16.0938 75.8145 16.1133 75.9824 16.1133C76.3027 16.1133 76.582 16.0566 76.8203 15.9434C77.0625 15.8262 77.2598 15.6738 77.4121 15.4863C77.5645 15.2988 77.6777 15.084 77.752 14.8418C77.8301 14.5957 77.8691 14.3438 77.8691 14.0859ZM80.4297 18.3105L80.8457 17.8652C81.127 18.1699 81.4609 18.4082 81.8477 18.5801C82.2383 18.752 82.6484 18.8379 83.0781 18.8379C83.5039 18.8379 83.8613 18.7715 84.1504 18.6387C84.4434 18.5098 84.6777 18.3301 84.8535 18.0996C85.0293 17.873 85.1543 17.6094 85.2285 17.3086C85.3066 17.0078 85.3457 16.6934 85.3457 16.3652V15.2754H85.3223C85.0996 15.6855 84.7852 16 84.3789 16.2188C83.9766 16.4375 83.5469 16.5469 83.0898 16.5469C82.668 16.5469 82.2793 16.4746 81.9238 16.3301C81.5723 16.1855 81.2695 15.9863 81.0156 15.7324C80.7656 15.4746 80.5723 15.1699 80.4355 14.8184C80.3027 14.4668 80.2363 14.0879 80.2363 13.6816C80.2363 13.2715 80.3027 12.8906 80.4355 12.5391C80.5723 12.1875 80.7656 11.8809 81.0156 11.6191C81.2695 11.3535 81.5723 11.1445 81.9238 10.9922C82.2793 10.8398 82.668 10.7637 83.0898 10.7637C83.5391 10.7637 83.9648 10.873 84.3672 11.0918C84.7734 11.3066 85.0918 11.625 85.3223 12.0469H85.3457V10.9102H86.0078V16.3652C86.0078 16.7207 85.9629 17.0781 85.873 17.4375C85.7871 17.7969 85.6328 18.1211 85.4102 18.4102C85.1914 18.7031 84.8906 18.9434 84.5078 19.1309C84.125 19.3223 83.6406 19.418 83.0547 19.418C82.5273 19.418 82.0371 19.3184 81.584 19.1191C81.1309 18.9238 80.7461 18.6543 80.4297 18.3105ZM85.4219 13.6582C85.4219 13.3457 85.3652 13.0469 85.252 12.7617C85.1387 12.4766 84.9824 12.2266 84.7832 12.0117C84.584 11.7969 84.3438 11.625 84.0625 11.4961C83.7812 11.3672 83.4766 11.3027 83.1484 11.3027C82.7969 11.3027 82.4824 11.3672 82.2051 11.4961C81.9316 11.625 81.6992 11.7969 81.5078 12.0117C81.3164 12.2266 81.1699 12.4766 81.0684 12.7617C80.9707 13.0469 80.9219 13.3457 80.9219 13.6582C80.9219 13.9668 80.9707 14.2637 81.0684 14.5488C81.1699 14.834 81.3164 15.084 81.5078 15.2988C81.6992 15.5137 81.9316 15.6836 82.2051 15.8086C82.4824 15.9336 82.7969 15.9961 83.1484 15.9961C83.4766 15.9961 83.7812 15.9395 84.0625 15.8262C84.3438 15.709 84.584 15.5449 84.7832 15.334C84.9824 15.1191 85.1387 14.8711 85.252 14.5898C85.3652 14.3047 85.4219 13.9941 85.4219 13.6582ZM87.7949 13.6934C87.7949 13.2754 87.8672 12.8867 88.0117 12.5273C88.1562 12.168 88.3516 11.8594 88.5977 11.6016C88.8438 11.3398 89.1348 11.1348 89.4707 10.9863C89.8105 10.8379 90.1758 10.7637 90.5664 10.7637C91.0078 10.7637 91.3906 10.8379 91.7148 10.9863C92.043 11.1348 92.3164 11.3359 92.5352 11.5898C92.7578 11.8398 92.9238 12.1289 93.0332 12.457C93.1465 12.7852 93.2031 13.1328 93.2031 13.5V13.834H88.4629C88.4746 14.1309 88.5312 14.416 88.6328 14.6895C88.7383 14.959 88.8848 15.1992 89.0723 15.4102C89.2598 15.6172 89.4863 15.7832 89.752 15.9082C90.0215 16.0293 90.3203 16.0898 90.6484 16.0898C91.082 16.0898 91.4453 16.0078 91.7383 15.8438C92.0352 15.6797 92.3125 15.4473 92.5703 15.1465L93.0039 15.4922C92.6914 15.8984 92.3359 16.1953 91.9375 16.3828C91.543 16.5664 91.1055 16.6582 90.625 16.6582C90.2188 16.6582 89.8398 16.584 89.4883 16.4355C89.1406 16.2871 88.8398 16.082 88.5859 15.8203C88.3359 15.5547 88.1406 15.2402 88 14.877C87.8633 14.5098 87.7949 14.1152 87.7949 13.6934ZM92.5586 13.3184C92.543 13.0254 92.4863 12.7578 92.3887 12.5156C92.2949 12.2695 92.1641 12.0566 91.9961 11.877C91.8281 11.6934 91.623 11.5527 91.3809 11.4551C91.1426 11.3535 90.8672 11.3027 90.5547 11.3027C90.2422 11.3027 89.959 11.3652 89.7051 11.4902C89.4551 11.6152 89.2402 11.7734 89.0605 11.9648C88.8809 12.1562 88.7402 12.373 88.6387 12.6152C88.541 12.8535 88.4883 13.0879 88.4805 13.3184H92.5586Z" fill="#CCCCCC"/>
<mask id="mask1_60_834" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="102" y="0" width="24" height="24">
<rect x="102" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask1_60_834)">
<path d="M114.946 12L110.346 7.4L111.4 6.34625L117.054 12L111.4 17.6538L110.346 16.6L114.946 12Z" fill="#CCCCCC"/>
</g>
<path d="M135.178 8.00391H137.539C137.934 8.00391 138.303 8.04688 138.646 8.13281C138.99 8.21484 139.285 8.3457 139.531 8.52539C139.781 8.70508 139.977 8.93555 140.117 9.2168C140.262 9.49805 140.334 9.83398 140.334 10.2246C140.334 10.5996 140.266 10.9277 140.129 11.209C139.996 11.4902 139.807 11.7246 139.561 11.9121C139.318 12.0996 139.027 12.2422 138.688 12.3398C138.348 12.4336 137.977 12.4805 137.574 12.4805H135.857V16.5H135.178V8.00391ZM137.539 11.9062C138.172 11.9062 138.682 11.7676 139.068 11.4902C139.459 11.2129 139.654 10.791 139.654 10.2246C139.654 9.93555 139.6 9.68945 139.49 9.48633C139.381 9.2832 139.232 9.11523 139.045 8.98242C138.857 8.84961 138.633 8.75195 138.371 8.68945C138.113 8.62305 137.832 8.58984 137.527 8.58984H135.857V11.9062H137.539ZM140.908 14.9883C140.908 14.5898 141.006 14.2676 141.201 14.0215C141.396 13.7715 141.654 13.5801 141.975 13.4473C142.295 13.3145 142.656 13.2266 143.059 13.1836C143.465 13.1367 143.879 13.1133 144.301 13.1133H144.869V12.8613C144.869 12.334 144.73 11.9434 144.453 11.6895C144.176 11.4316 143.785 11.3027 143.281 11.3027C142.945 11.3027 142.635 11.3633 142.35 11.4844C142.068 11.6055 141.824 11.7656 141.617 11.9648L141.254 11.5312C141.488 11.3008 141.787 11.1152 142.15 10.9746C142.514 10.834 142.912 10.7637 143.346 10.7637C143.654 10.7637 143.939 10.8066 144.201 10.8926C144.463 10.9746 144.689 11.0996 144.881 11.2676C145.072 11.4355 145.221 11.6465 145.326 11.9004C145.436 12.1504 145.49 12.4473 145.49 12.791V15.2402C145.49 15.4551 145.498 15.6797 145.514 15.9141C145.529 16.1445 145.555 16.3398 145.59 16.5H144.998C144.975 16.3555 144.953 16.1855 144.934 15.9902C144.914 15.7949 144.904 15.6211 144.904 15.4688H144.881C144.646 15.875 144.359 16.1758 144.02 16.3711C143.68 16.5625 143.281 16.6582 142.824 16.6582C142.609 16.6582 142.387 16.627 142.156 16.5645C141.93 16.5059 141.725 16.4082 141.541 16.2715C141.357 16.1348 141.205 15.9629 141.084 15.7559C140.967 15.5488 140.908 15.293 140.908 14.9883ZM144.869 14.0859V13.6348H144.447C144.119 13.6348 143.787 13.6484 143.451 13.6758C143.115 13.7031 142.807 13.7637 142.525 13.8574C142.248 13.9473 142.02 14.0801 141.84 14.2559C141.664 14.4316 141.576 14.6641 141.576 14.9531C141.576 15.168 141.617 15.3516 141.699 15.5039C141.785 15.6562 141.896 15.7773 142.033 15.8672C142.17 15.9531 142.32 16.0156 142.484 16.0547C142.648 16.0938 142.814 16.1133 142.982 16.1133C143.303 16.1133 143.582 16.0566 143.82 15.9434C144.062 15.8262 144.26 15.6738 144.412 15.4863C144.564 15.2988 144.678 15.084 144.752 14.8418C144.83 14.5957 144.869 14.3438 144.869 14.0859ZM147.43 18.3105L147.846 17.8652C148.127 18.1699 148.461 18.4082 148.848 18.5801C149.238 18.752 149.648 18.8379 150.078 18.8379C150.504 18.8379 150.861 18.7715 151.15 18.6387C151.443 18.5098 151.678 18.3301 151.854 18.0996C152.029 17.873 152.154 17.6094 152.229 17.3086C152.307 17.0078 152.346 16.6934 152.346 16.3652V15.2754H152.322C152.1 15.6855 151.785 16 151.379 16.2188C150.977 16.4375 150.547 16.5469 150.09 16.5469C149.668 16.5469 149.279 16.4746 148.924 16.3301C148.572 16.1855 148.27 15.9863 148.016 15.7324C147.766 15.4746 147.572 15.1699 147.436 14.8184C147.303 14.4668 147.236 14.0879 147.236 13.6816C147.236 13.2715 147.303 12.8906 147.436 12.5391C147.572 12.1875 147.766 11.8809 148.016 11.6191C148.27 11.3535 148.572 11.1445 148.924 10.9922C149.279 10.8398 149.668 10.7637 150.09 10.7637C150.539 10.7637 150.965 10.873 151.367 11.0918C151.773 11.3066 152.092 11.625 152.322 12.0469H152.346V10.9102H153.008V16.3652C153.008 16.7207 152.963 17.0781 152.873 17.4375C152.787 17.7969 152.633 18.1211 152.41 18.4102C152.191 18.7031 151.891 18.9434 151.508 19.1309C151.125 19.3223 150.641 19.418 150.055 19.418C149.527 19.418 149.037 19.3184 148.584 19.1191C148.131 18.9238 147.746 18.6543 147.43 18.3105ZM152.422 13.6582C152.422 13.3457 152.365 13.0469 152.252 12.7617C152.139 12.4766 151.982 12.2266 151.783 12.0117C151.584 11.7969 151.344 11.625 151.062 11.4961C150.781 11.3672 150.477 11.3027 150.148 11.3027C149.797 11.3027 149.482 11.3672 149.205 11.4961C148.932 11.625 148.699 11.7969 148.508 12.0117C148.316 12.2266 148.17 12.4766 148.068 12.7617C147.971 13.0469 147.922 13.3457 147.922 13.6582C147.922 13.9668 147.971 14.2637 148.068 14.5488C148.17 14.834 148.316 15.084 148.508 15.2988C148.699 15.5137 148.932 15.6836 149.205 15.8086C149.482 15.9336 149.797 15.9961 150.148 15.9961C150.477 15.9961 150.781 15.9395 151.062 15.8262C151.344 15.709 151.584 15.5449 151.783 15.334C151.982 15.1191 152.139 14.8711 152.252 14.5898C152.365 14.3047 152.422 13.9941 152.422 13.6582ZM154.795 13.6934C154.795 13.2754 154.867 12.8867 155.012 12.5273C155.156 12.168 155.352 11.8594 155.598 11.6016C155.844 11.3398 156.135 11.1348 156.471 10.9863C156.811 10.8379 157.176 10.7637 157.566 10.7637C158.008 10.7637 158.391 10.8379 158.715 10.9863C159.043 11.1348 159.316 11.3359 159.535 11.5898C159.758 11.8398 159.924 12.1289 160.033 12.457C160.146 12.7852 160.203 13.1328 160.203 13.5V13.834H155.463C155.475 14.1309 155.531 14.416 155.633 14.6895C155.738 14.959 155.885 15.1992 156.072 15.4102C156.26 15.6172 156.486 15.7832 156.752 15.9082C157.021 16.0293 157.32 16.0898 157.648 16.0898C158.082 16.0898 158.445 16.0078 158.738 15.8438C159.035 15.6797 159.312 15.4473 159.57 15.1465L160.004 15.4922C159.691 15.8984 159.336 16.1953 158.938 16.3828C158.543 16.5664 158.105 16.6582 157.625 16.6582C157.219 16.6582 156.84 16.584 156.488 16.4355C156.141 16.2871 155.84 16.082 155.586 15.8203C155.336 15.5547 155.141 15.2402 155 14.877C154.863 14.5098 154.795 14.1152 154.795 13.6934ZM159.559 13.3184C159.543 13.0254 159.486 12.7578 159.389 12.5156C159.295 12.2695 159.164 12.0566 158.996 11.877C158.828 11.6934 158.623 11.5527 158.381 11.4551C158.143 11.3535 157.867 11.3027 157.555 11.3027C157.242 11.3027 156.959 11.3652 156.705 11.4902C156.455 11.6152 156.24 11.7734 156.061 11.9648C155.881 12.1562 155.74 12.373 155.639 12.6152C155.541 12.8535 155.488 13.0879 155.48 13.3184H159.559Z" fill="#CCCCCC"/>
<mask id="mask2_60_834" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="169" y="0" width="24" height="24">
<rect x="169" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask2_60_834)">
<path d="M181.946 12L177.346 7.4L178.4 6.34625L184.054 12L178.4 17.6538L177.346 16.6L181.946 12Z" fill="#CCCCCC"/>
</g>
<path d="M202.178 8.00391H204.539C204.934 8.00391 205.303 8.04688 205.646 8.13281C205.99 8.21484 206.285 8.3457 206.531 8.52539C206.781 8.70508 206.977 8.93555 207.117 9.2168C207.262 9.49805 207.334 9.83398 207.334 10.2246C207.334 10.5996 207.266 10.9277 207.129 11.209C206.996 11.4902 206.807 11.7246 206.561 11.9121C206.318 12.0996 206.027 12.2422 205.688 12.3398C205.348 12.4336 204.977 12.4805 204.574 12.4805H202.857V16.5H202.178V8.00391ZM204.539 11.9062C205.172 11.9062 205.682 11.7676 206.068 11.4902C206.459 11.2129 206.654 10.791 206.654 10.2246C206.654 9.93555 206.6 9.68945 206.49 9.48633C206.381 9.2832 206.232 9.11523 206.045 8.98242C205.857 8.84961 205.633 8.75195 205.371 8.68945C205.113 8.62305 204.832 8.58984 204.527 8.58984H202.857V11.9062H204.539ZM207.908 14.9883C207.908 14.5898 208.006 14.2676 208.201 14.0215C208.396 13.7715 208.654 13.5801 208.975 13.4473C209.295 13.3145 209.656 13.2266 210.059 13.1836C210.465 13.1367 210.879 13.1133 211.301 13.1133H211.869V12.8613C211.869 12.334 211.73 11.9434 211.453 11.6895C211.176 11.4316 210.785 11.3027 210.281 11.3027C209.945 11.3027 209.635 11.3633 209.35 11.4844C209.068 11.6055 208.824 11.7656 208.617 11.9648L208.254 11.5312C208.488 11.3008 208.787 11.1152 209.15 10.9746C209.514 10.834 209.912 10.7637 210.346 10.7637C210.654 10.7637 210.939 10.8066 211.201 10.8926C211.463 10.9746 211.689 11.0996 211.881 11.2676C212.072 11.4355 212.221 11.6465 212.326 11.9004C212.436 12.1504 212.49 12.4473 212.49 12.791V15.2402C212.49 15.4551 212.498 15.6797 212.514 15.9141C212.529 16.1445 212.555 16.3398 212.59 16.5H211.998C211.975 16.3555 211.953 16.1855 211.934 15.9902C211.914 15.7949 211.904 15.6211 211.904 15.4688H211.881C211.646 15.875 211.359 16.1758 211.02 16.3711C210.68 16.5625 210.281 16.6582 209.824 16.6582C209.609 16.6582 209.387 16.627 209.156 16.5645C208.93 16.5059 208.725 16.4082 208.541 16.2715C208.357 16.1348 208.205 15.9629 208.084 15.7559C207.967 15.5488 207.908 15.293 207.908 14.9883ZM211.869 14.0859V13.6348H211.447C211.119 13.6348 210.787 13.6484 210.451 13.6758C210.115 13.7031 209.807 13.7637 209.525 13.8574C209.248 13.9473 209.02 14.0801 208.84 14.2559C208.664 14.4316 208.576 14.6641 208.576 14.9531C208.576 15.168 208.617 15.3516 208.699 15.5039C208.785 15.6562 208.896 15.7773 209.033 15.8672C209.17 15.9531 209.32 16.0156 209.484 16.0547C209.648 16.0938 209.814 16.1133 209.982 16.1133C210.303 16.1133 210.582 16.0566 210.82 15.9434C211.062 15.8262 211.26 15.6738 211.412 15.4863C211.564 15.2988 211.678 15.084 211.752 14.8418C211.83 14.5957 211.869 14.3438 211.869 14.0859ZM214.43 18.3105L214.846 17.8652C215.127 18.1699 215.461 18.4082 215.848 18.5801C216.238 18.752 216.648 18.8379 217.078 18.8379C217.504 18.8379 217.861 18.7715 218.15 18.6387C218.443 18.5098 218.678 18.3301 218.854 18.0996C219.029 17.873 219.154 17.6094 219.229 17.3086C219.307 17.0078 219.346 16.6934 219.346 16.3652V15.2754H219.322C219.1 15.6855 218.785 16 218.379 16.2188C217.977 16.4375 217.547 16.5469 217.09 16.5469C216.668 16.5469 216.279 16.4746 215.924 16.3301C215.572 16.1855 215.27 15.9863 215.016 15.7324C214.766 15.4746 214.572 15.1699 214.436 14.8184C214.303 14.4668 214.236 14.0879 214.236 13.6816C214.236 13.2715 214.303 12.8906 214.436 12.5391C214.572 12.1875 214.766 11.8809 215.016 11.6191C215.27 11.3535 215.572 11.1445 215.924 10.9922C216.279 10.8398 216.668 10.7637 217.09 10.7637C217.539 10.7637 217.965 10.873 218.367 11.0918C218.773 11.3066 219.092 11.625 219.322 12.0469H219.346V10.9102H220.008V16.3652C220.008 16.7207 219.963 17.0781 219.873 17.4375C219.787 17.7969 219.633 18.1211 219.41 18.4102C219.191 18.7031 218.891 18.9434 218.508 19.1309C218.125 19.3223 217.641 19.418 217.055 19.418C216.527 19.418 216.037 19.3184 215.584 19.1191C215.131 18.9238 214.746 18.6543 214.43 18.3105ZM219.422 13.6582C219.422 13.3457 219.365 13.0469 219.252 12.7617C219.139 12.4766 218.982 12.2266 218.783 12.0117C218.584 11.7969 218.344 11.625 218.062 11.4961C217.781 11.3672 217.477 11.3027 217.148 11.3027C216.797 11.3027 216.482 11.3672 216.205 11.4961C215.932 11.625 215.699 11.7969 215.508 12.0117C215.316 12.2266 215.17 12.4766 215.068 12.7617C214.971 13.0469 214.922 13.3457 214.922 13.6582C214.922 13.9668 214.971 14.2637 215.068 14.5488C215.17 14.834 215.316 15.084 215.508 15.2988C215.699 15.5137 215.932 15.6836 216.205 15.8086C216.482 15.9336 216.797 15.9961 217.148 15.9961C217.477 15.9961 217.781 15.9395 218.062 15.8262C218.344 15.709 218.584 15.5449 218.783 15.334C218.982 15.1191 219.139 14.8711 219.252 14.5898C219.365 14.3047 219.422 13.9941 219.422 13.6582ZM221.795 13.6934C221.795 13.2754 221.867 12.8867 222.012 12.5273C222.156 12.168 222.352 11.8594 222.598 11.6016C222.844 11.3398 223.135 11.1348 223.471 10.9863C223.811 10.8379 224.176 10.7637 224.566 10.7637C225.008 10.7637 225.391 10.8379 225.715 10.9863C226.043 11.1348 226.316 11.3359 226.535 11.5898C226.758 11.8398 226.924 12.1289 227.033 12.457C227.146 12.7852 227.203 13.1328 227.203 13.5V13.834H222.463C222.475 14.1309 222.531 14.416 222.633 14.6895C222.738 14.959 222.885 15.1992 223.072 15.4102C223.26 15.6172 223.486 15.7832 223.752 15.9082C224.021 16.0293 224.32 16.0898 224.648 16.0898C225.082 16.0898 225.445 16.0078 225.738 15.8438C226.035 15.6797 226.312 15.4473 226.57 15.1465L227.004 15.4922C226.691 15.8984 226.336 16.1953 225.938 16.3828C225.543 16.5664 225.105 16.6582 224.625 16.6582C224.219 16.6582 223.84 16.584 223.488 16.4355C223.141 16.2871 222.84 16.082 222.586 15.8203C222.336 15.5547 222.141 15.2402 222 14.877C221.863 14.5098 221.795 14.1152 221.795 13.6934ZM226.559 13.3184C226.543 13.0254 226.486 12.7578 226.389 12.5156C226.295 12.2695 226.164 12.0566 225.996 11.877C225.828 11.6934 225.623 11.5527 225.381 11.4551C225.143 11.3535 224.867 11.3027 224.555 11.3027C224.242 11.3027 223.959 11.3652 223.705 11.4902C223.455 11.6152 223.24 11.7734 223.061 11.9648C222.881 12.1562 222.74 12.373 222.639 12.6152C222.541 12.8535 222.488 13.0879 222.48 13.3184H226.559Z" fill="#CCCCCC"/>
<mask id="mask3_60_834" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="236" y="0" width="24" height="24">
<rect x="236" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask3_60_834)">
<path d="M248.946 12L244.346 7.4L245.4 6.34625L251.054 12L245.4 17.6538L244.346 16.6L248.946 12Z" fill="#CCCCCC"/>
</g>
<path d="M269.178 8.00391H271.539C271.934 8.00391 272.303 8.04688 272.646 8.13281C272.99 8.21484 273.285 8.3457 273.531 8.52539C273.781 8.70508 273.977 8.93555 274.117 9.2168C274.262 9.49805 274.334 9.83398 274.334 10.2246C274.334 10.5996 274.266 10.9277 274.129 11.209C273.996 11.4902 273.807 11.7246 273.561 11.9121C273.318 12.0996 273.027 12.2422 272.688 12.3398C272.348 12.4336 271.977 12.4805 271.574 12.4805H269.857V16.5H269.178V8.00391ZM271.539 11.9062C272.172 11.9062 272.682 11.7676 273.068 11.4902C273.459 11.2129 273.654 10.791 273.654 10.2246C273.654 9.93555 273.6 9.68945 273.49 9.48633C273.381 9.2832 273.232 9.11523 273.045 8.98242C272.857 8.84961 272.633 8.75195 272.371 8.68945C272.113 8.62305 271.832 8.58984 271.527 8.58984H269.857V11.9062H271.539ZM274.908 14.9883C274.908 14.5898 275.006 14.2676 275.201 14.0215C275.396 13.7715 275.654 13.5801 275.975 13.4473C276.295 13.3145 276.656 13.2266 277.059 13.1836C277.465 13.1367 277.879 13.1133 278.301 13.1133H278.869V12.8613C278.869 12.334 278.73 11.9434 278.453 11.6895C278.176 11.4316 277.785 11.3027 277.281 11.3027C276.945 11.3027 276.635 11.3633 276.35 11.4844C276.068 11.6055 275.824 11.7656 275.617 11.9648L275.254 11.5312C275.488 11.3008 275.787 11.1152 276.15 10.9746C276.514 10.834 276.912 10.7637 277.346 10.7637C277.654 10.7637 277.939 10.8066 278.201 10.8926C278.463 10.9746 278.689 11.0996 278.881 11.2676C279.072 11.4355 279.221 11.6465 279.326 11.9004C279.436 12.1504 279.49 12.4473 279.49 12.791V15.2402C279.49 15.4551 279.498 15.6797 279.514 15.9141C279.529 16.1445 279.555 16.3398 279.59 16.5H278.998C278.975 16.3555 278.953 16.1855 278.934 15.9902C278.914 15.7949 278.904 15.6211 278.904 15.4688H278.881C278.646 15.875 278.359 16.1758 278.02 16.3711C277.68 16.5625 277.281 16.6582 276.824 16.6582C276.609 16.6582 276.387 16.627 276.156 16.5645C275.93 16.5059 275.725 16.4082 275.541 16.2715C275.357 16.1348 275.205 15.9629 275.084 15.7559C274.967 15.5488 274.908 15.293 274.908 14.9883ZM278.869 14.0859V13.6348H278.447C278.119 13.6348 277.787 13.6484 277.451 13.6758C277.115 13.7031 276.807 13.7637 276.525 13.8574C276.248 13.9473 276.02 14.0801 275.84 14.2559C275.664 14.4316 275.576 14.6641 275.576 14.9531C275.576 15.168 275.617 15.3516 275.699 15.5039C275.785 15.6562 275.896 15.7773 276.033 15.8672C276.17 15.9531 276.32 16.0156 276.484 16.0547C276.648 16.0938 276.814 16.1133 276.982 16.1133C277.303 16.1133 277.582 16.0566 277.82 15.9434C278.062 15.8262 278.26 15.6738 278.412 15.4863C278.564 15.2988 278.678 15.084 278.752 14.8418C278.83 14.5957 278.869 14.3438 278.869 14.0859ZM281.43 18.3105L281.846 17.8652C282.127 18.1699 282.461 18.4082 282.848 18.5801C283.238 18.752 283.648 18.8379 284.078 18.8379C284.504 18.8379 284.861 18.7715 285.15 18.6387C285.443 18.5098 285.678 18.3301 285.854 18.0996C286.029 17.873 286.154 17.6094 286.229 17.3086C286.307 17.0078 286.346 16.6934 286.346 16.3652V15.2754H286.322C286.1 15.6855 285.785 16 285.379 16.2188C284.977 16.4375 284.547 16.5469 284.09 16.5469C283.668 16.5469 283.279 16.4746 282.924 16.3301C282.572 16.1855 282.27 15.9863 282.016 15.7324C281.766 15.4746 281.572 15.1699 281.436 14.8184C281.303 14.4668 281.236 14.0879 281.236 13.6816C281.236 13.2715 281.303 12.8906 281.436 12.5391C281.572 12.1875 281.766 11.8809 282.016 11.6191C282.27 11.3535 282.572 11.1445 282.924 10.9922C283.279 10.8398 283.668 10.7637 284.09 10.7637C284.539 10.7637 284.965 10.873 285.367 11.0918C285.773 11.3066 286.092 11.625 286.322 12.0469H286.346V10.9102H287.008V16.3652C287.008 16.7207 286.963 17.0781 286.873 17.4375C286.787 17.7969 286.633 18.1211 286.41 18.4102C286.191 18.7031 285.891 18.9434 285.508 19.1309C285.125 19.3223 284.641 19.418 284.055 19.418C283.527 19.418 283.037 19.3184 282.584 19.1191C282.131 18.9238 281.746 18.6543 281.43 18.3105ZM286.422 13.6582C286.422 13.3457 286.365 13.0469 286.252 12.7617C286.139 12.4766 285.982 12.2266 285.783 12.0117C285.584 11.7969 285.344 11.625 285.062 11.4961C284.781 11.3672 284.477 11.3027 284.148 11.3027C283.797 11.3027 283.482 11.3672 283.205 11.4961C282.932 11.625 282.699 11.7969 282.508 12.0117C282.316 12.2266 282.17 12.4766 282.068 12.7617C281.971 13.0469 281.922 13.3457 281.922 13.6582C281.922 13.9668 281.971 14.2637 282.068 14.5488C282.17 14.834 282.316 15.084 282.508 15.2988C282.699 15.5137 282.932 15.6836 283.205 15.8086C283.482 15.9336 283.797 15.9961 284.148 15.9961C284.477 15.9961 284.781 15.9395 285.062 15.8262C285.344 15.709 285.584 15.5449 285.783 15.334C285.982 15.1191 286.139 14.8711 286.252 14.5898C286.365 14.3047 286.422 13.9941 286.422 13.6582ZM288.795 13.6934C288.795 13.2754 288.867 12.8867 289.012 12.5273C289.156 12.168 289.352 11.8594 289.598 11.6016C289.844 11.3398 290.135 11.1348 290.471 10.9863C290.811 10.8379 291.176 10.7637 291.566 10.7637C292.008 10.7637 292.391 10.8379 292.715 10.9863C293.043 11.1348 293.316 11.3359 293.535 11.5898C293.758 11.8398 293.924 12.1289 294.033 12.457C294.146 12.7852 294.203 13.1328 294.203 13.5V13.834H289.463C289.475 14.1309 289.531 14.416 289.633 14.6895C289.738 14.959 289.885 15.1992 290.072 15.4102C290.26 15.6172 290.486 15.7832 290.752 15.9082C291.021 16.0293 291.32 16.0898 291.648 16.0898C292.082 16.0898 292.445 16.0078 292.738 15.8438C293.035 15.6797 293.312 15.4473 293.57 15.1465L294.004 15.4922C293.691 15.8984 293.336 16.1953 292.938 16.3828C292.543 16.5664 292.105 16.6582 291.625 16.6582C291.219 16.6582 290.84 16.584 290.488 16.4355C290.141 16.2871 289.84 16.082 289.586 15.8203C289.336 15.5547 289.141 15.2402 289 14.877C288.863 14.5098 288.795 14.1152 288.795 13.6934ZM293.559 13.3184C293.543 13.0254 293.486 12.7578 293.389 12.5156C293.295 12.2695 293.164 12.0566 292.996 11.877C292.828 11.6934 292.623 11.5527 292.381 11.4551C292.143 11.3535 291.867 11.3027 291.555 11.3027C291.242 11.3027 290.959 11.3652 290.705 11.4902C290.455 11.6152 290.24 11.7734 290.061 11.9648C289.881 12.1562 289.74 12.373 289.639 12.6152C289.541 12.8535 289.488 13.0879 289.48 13.3184H293.559Z" fill="#CCCCCC"/>
<mask id="mask4_60_834" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="303" y="0" width="24" height="24">
<rect x="303" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask4_60_834)">
<path d="M315.946 12L311.346 7.4L312.4 6.34625L318.054 12L312.4 17.6538L311.346 16.6L315.946 12Z" fill="#CCCCCC"/>
</g>
<path d="M336.178 8.00391H338.539C338.934 8.00391 339.303 8.04688 339.646 8.13281C339.99 8.21484 340.285 8.3457 340.531 8.52539C340.781 8.70508 340.977 8.93555 341.117 9.2168C341.262 9.49805 341.334 9.83398 341.334 10.2246C341.334 10.5996 341.266 10.9277 341.129 11.209C340.996 11.4902 340.807 11.7246 340.561 11.9121C340.318 12.0996 340.027 12.2422 339.688 12.3398C339.348 12.4336 338.977 12.4805 338.574 12.4805H336.857V16.5H336.178V8.00391ZM338.539 11.9062C339.172 11.9062 339.682 11.7676 340.068 11.4902C340.459 11.2129 340.654 10.791 340.654 10.2246C340.654 9.93555 340.6 9.68945 340.49 9.48633C340.381 9.2832 340.232 9.11523 340.045 8.98242C339.857 8.84961 339.633 8.75195 339.371 8.68945C339.113 8.62305 338.832 8.58984 338.527 8.58984H336.857V11.9062H338.539ZM341.908 14.9883C341.908 14.5898 342.006 14.2676 342.201 14.0215C342.396 13.7715 342.654 13.5801 342.975 13.4473C343.295 13.3145 343.656 13.2266 344.059 13.1836C344.465 13.1367 344.879 13.1133 345.301 13.1133H345.869V12.8613C345.869 12.334 345.73 11.9434 345.453 11.6895C345.176 11.4316 344.785 11.3027 344.281 11.3027C343.945 11.3027 343.635 11.3633 343.35 11.4844C343.068 11.6055 342.824 11.7656 342.617 11.9648L342.254 11.5312C342.488 11.3008 342.787 11.1152 343.15 10.9746C343.514 10.834 343.912 10.7637 344.346 10.7637C344.654 10.7637 344.939 10.8066 345.201 10.8926C345.463 10.9746 345.689 11.0996 345.881 11.2676C346.072 11.4355 346.221 11.6465 346.326 11.9004C346.436 12.1504 346.49 12.4473 346.49 12.791V15.2402C346.49 15.4551 346.498 15.6797 346.514 15.9141C346.529 16.1445 346.555 16.3398 346.59 16.5H345.998C345.975 16.3555 345.953 16.1855 345.934 15.9902C345.914 15.7949 345.904 15.6211 345.904 15.4688H345.881C345.646 15.875 345.359 16.1758 345.02 16.3711C344.68 16.5625 344.281 16.6582 343.824 16.6582C343.609 16.6582 343.387 16.627 343.156 16.5645C342.93 16.5059 342.725 16.4082 342.541 16.2715C342.357 16.1348 342.205 15.9629 342.084 15.7559C341.967 15.5488 341.908 15.293 341.908 14.9883ZM345.869 14.0859V13.6348H345.447C345.119 13.6348 344.787 13.6484 344.451 13.6758C344.115 13.7031 343.807 13.7637 343.525 13.8574C343.248 13.9473 343.02 14.0801 342.84 14.2559C342.664 14.4316 342.576 14.6641 342.576 14.9531C342.576 15.168 342.617 15.3516 342.699 15.5039C342.785 15.6562 342.896 15.7773 343.033 15.8672C343.17 15.9531 343.32 16.0156 343.484 16.0547C343.648 16.0938 343.814 16.1133 343.982 16.1133C344.303 16.1133 344.582 16.0566 344.82 15.9434C345.062 15.8262 345.26 15.6738 345.412 15.4863C345.564 15.2988 345.678 15.084 345.752 14.8418C345.83 14.5957 345.869 14.3438 345.869 14.0859ZM348.43 18.3105L348.846 17.8652C349.127 18.1699 349.461 18.4082 349.848 18.5801C350.238 18.752 350.648 18.8379 351.078 18.8379C351.504 18.8379 351.861 18.7715 352.15 18.6387C352.443 18.5098 352.678 18.3301 352.854 18.0996C353.029 17.873 353.154 17.6094 353.229 17.3086C353.307 17.0078 353.346 16.6934 353.346 16.3652V15.2754H353.322C353.1 15.6855 352.785 16 352.379 16.2188C351.977 16.4375 351.547 16.5469 351.09 16.5469C350.668 16.5469 350.279 16.4746 349.924 16.3301C349.572 16.1855 349.27 15.9863 349.016 15.7324C348.766 15.4746 348.572 15.1699 348.436 14.8184C348.303 14.4668 348.236 14.0879 348.236 13.6816C348.236 13.2715 348.303 12.8906 348.436 12.5391C348.572 12.1875 348.766 11.8809 349.016 11.6191C349.27 11.3535 349.572 11.1445 349.924 10.9922C350.279 10.8398 350.668 10.7637 351.09 10.7637C351.539 10.7637 351.965 10.873 352.367 11.0918C352.773 11.3066 353.092 11.625 353.322 12.0469H353.346V10.9102H354.008V16.3652C354.008 16.7207 353.963 17.0781 353.873 17.4375C353.787 17.7969 353.633 18.1211 353.41 18.4102C353.191 18.7031 352.891 18.9434 352.508 19.1309C352.125 19.3223 351.641 19.418 351.055 19.418C350.527 19.418 350.037 19.3184 349.584 19.1191C349.131 18.9238 348.746 18.6543 348.43 18.3105ZM353.422 13.6582C353.422 13.3457 353.365 13.0469 353.252 12.7617C353.139 12.4766 352.982 12.2266 352.783 12.0117C352.584 11.7969 352.344 11.625 352.062 11.4961C351.781 11.3672 351.477 11.3027 351.148 11.3027C350.797 11.3027 350.482 11.3672 350.205 11.4961C349.932 11.625 349.699 11.7969 349.508 12.0117C349.316 12.2266 349.17 12.4766 349.068 12.7617C348.971 13.0469 348.922 13.3457 348.922 13.6582C348.922 13.9668 348.971 14.2637 349.068 14.5488C349.17 14.834 349.316 15.084 349.508 15.2988C349.699 15.5137 349.932 15.6836 350.205 15.8086C350.482 15.9336 350.797 15.9961 351.148 15.9961C351.477 15.9961 351.781 15.9395 352.062 15.8262C352.344 15.709 352.584 15.5449 352.783 15.334C352.982 15.1191 353.139 14.8711 353.252 14.5898C353.365 14.3047 353.422 13.9941 353.422 13.6582ZM355.795 13.6934C355.795 13.2754 355.867 12.8867 356.012 12.5273C356.156 12.168 356.352 11.8594 356.598 11.6016C356.844 11.3398 357.135 11.1348 357.471 10.9863C357.811 10.8379 358.176 10.7637 358.566 10.7637C359.008 10.7637 359.391 10.8379 359.715 10.9863C360.043 11.1348 360.316 11.3359 360.535 11.5898C360.758 11.8398 360.924 12.1289 361.033 12.457C361.146 12.7852 361.203 13.1328 361.203 13.5V13.834H356.463C356.475 14.1309 356.531 14.416 356.633 14.6895C356.738 14.959 356.885 15.1992 357.072 15.4102C357.26 15.6172 357.486 15.7832 357.752 15.9082C358.021 16.0293 358.32 16.0898 358.648 16.0898C359.082 16.0898 359.445 16.0078 359.738 15.8438C360.035 15.6797 360.312 15.4473 360.57 15.1465L361.004 15.4922C360.691 15.8984 360.336 16.1953 359.938 16.3828C359.543 16.5664 359.105 16.6582 358.625 16.6582C358.219 16.6582 357.84 16.584 357.488 16.4355C357.141 16.2871 356.84 16.082 356.586 15.8203C356.336 15.5547 356.141 15.2402 356 14.877C355.863 14.5098 355.795 14.1152 355.795 13.6934ZM360.559 13.3184C360.543 13.0254 360.486 12.7578 360.389 12.5156C360.295 12.2695 360.164 12.0566 359.996 11.877C359.828 11.6934 359.623 11.5527 359.381 11.4551C359.143 11.3535 358.867 11.3027 358.555 11.3027C358.242 11.3027 357.959 11.3652 357.705 11.4902C357.455 11.6152 357.24 11.7734 357.061 11.9648C356.881 12.1562 356.74 12.373 356.639 12.6152C356.541 12.8535 356.488 13.0879 356.48 13.3184H360.559Z" fill="#CCCCCC"/>
<mask id="mask5_60_834" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="370" y="0" width="24" height="24">
<rect x="370" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask5_60_834)">
<path d="M382.946 12L378.346 7.4L379.4 6.34625L385.054 12L379.4 17.6538L378.346 16.6L382.946 12Z" fill="#CCCCCC"/>
</g>
<path d="M403.178 8.00391H405.539C405.934 8.00391 406.303 8.04688 406.646 8.13281C406.99 8.21484 407.285 8.3457 407.531 8.52539C407.781 8.70508 407.977 8.93555 408.117 9.2168C408.262 9.49805 408.334 9.83398 408.334 10.2246C408.334 10.5996 408.266 10.9277 408.129 11.209C407.996 11.4902 407.807 11.7246 407.561 11.9121C407.318 12.0996 407.027 12.2422 406.688 12.3398C406.348 12.4336 405.977 12.4805 405.574 12.4805H403.857V16.5H403.178V8.00391ZM405.539 11.9062C406.172 11.9062 406.682 11.7676 407.068 11.4902C407.459 11.2129 407.654 10.791 407.654 10.2246C407.654 9.93555 407.6 9.68945 407.49 9.48633C407.381 9.2832 407.232 9.11523 407.045 8.98242C406.857 8.84961 406.633 8.75195 406.371 8.68945C406.113 8.62305 405.832 8.58984 405.527 8.58984H403.857V11.9062H405.539ZM408.908 14.9883C408.908 14.5898 409.006 14.2676 409.201 14.0215C409.396 13.7715 409.654 13.5801 409.975 13.4473C410.295 13.3145 410.656 13.2266 411.059 13.1836C411.465 13.1367 411.879 13.1133 412.301 13.1133H412.869V12.8613C412.869 12.334 412.73 11.9434 412.453 11.6895C412.176 11.4316 411.785 11.3027 411.281 11.3027C410.945 11.3027 410.635 11.3633 410.35 11.4844C410.068 11.6055 409.824 11.7656 409.617 11.9648L409.254 11.5312C409.488 11.3008 409.787 11.1152 410.15 10.9746C410.514 10.834 410.912 10.7637 411.346 10.7637C411.654 10.7637 411.939 10.8066 412.201 10.8926C412.463 10.9746 412.689 11.0996 412.881 11.2676C413.072 11.4355 413.221 11.6465 413.326 11.9004C413.436 12.1504 413.49 12.4473 413.49 12.791V15.2402C413.49 15.4551 413.498 15.6797 413.514 15.9141C413.529 16.1445 413.555 16.3398 413.59 16.5H412.998C412.975 16.3555 412.953 16.1855 412.934 15.9902C412.914 15.7949 412.904 15.6211 412.904 15.4688H412.881C412.646 15.875 412.359 16.1758 412.02 16.3711C411.68 16.5625 411.281 16.6582 410.824 16.6582C410.609 16.6582 410.387 16.627 410.156 16.5645C409.93 16.5059 409.725 16.4082 409.541 16.2715C409.357 16.1348 409.205 15.9629 409.084 15.7559C408.967 15.5488 408.908 15.293 408.908 14.9883ZM412.869 14.0859V13.6348H412.447C412.119 13.6348 411.787 13.6484 411.451 13.6758C411.115 13.7031 410.807 13.7637 410.525 13.8574C410.248 13.9473 410.02 14.0801 409.84 14.2559C409.664 14.4316 409.576 14.6641 409.576 14.9531C409.576 15.168 409.617 15.3516 409.699 15.5039C409.785 15.6562 409.896 15.7773 410.033 15.8672C410.17 15.9531 410.32 16.0156 410.484 16.0547C410.648 16.0938 410.814 16.1133 410.982 16.1133C411.303 16.1133 411.582 16.0566 411.82 15.9434C412.062 15.8262 412.26 15.6738 412.412 15.4863C412.564 15.2988 412.678 15.084 412.752 14.8418C412.83 14.5957 412.869 14.3438 412.869 14.0859ZM415.43 18.3105L415.846 17.8652C416.127 18.1699 416.461 18.4082 416.848 18.5801C417.238 18.752 417.648 18.8379 418.078 18.8379C418.504 18.8379 418.861 18.7715 419.15 18.6387C419.443 18.5098 419.678 18.3301 419.854 18.0996C420.029 17.873 420.154 17.6094 420.229 17.3086C420.307 17.0078 420.346 16.6934 420.346 16.3652V15.2754H420.322C420.1 15.6855 419.785 16 419.379 16.2188C418.977 16.4375 418.547 16.5469 418.09 16.5469C417.668 16.5469 417.279 16.4746 416.924 16.3301C416.572 16.1855 416.27 15.9863 416.016 15.7324C415.766 15.4746 415.572 15.1699 415.436 14.8184C415.303 14.4668 415.236 14.0879 415.236 13.6816C415.236 13.2715 415.303 12.8906 415.436 12.5391C415.572 12.1875 415.766 11.8809 416.016 11.6191C416.27 11.3535 416.572 11.1445 416.924 10.9922C417.279 10.8398 417.668 10.7637 418.09 10.7637C418.539 10.7637 418.965 10.873 419.367 11.0918C419.773 11.3066 420.092 11.625 420.322 12.0469H420.346V10.9102H421.008V16.3652C421.008 16.7207 420.963 17.0781 420.873 17.4375C420.787 17.7969 420.633 18.1211 420.41 18.4102C420.191 18.7031 419.891 18.9434 419.508 19.1309C419.125 19.3223 418.641 19.418 418.055 19.418C417.527 19.418 417.037 19.3184 416.584 19.1191C416.131 18.9238 415.746 18.6543 415.43 18.3105ZM420.422 13.6582C420.422 13.3457 420.365 13.0469 420.252 12.7617C420.139 12.4766 419.982 12.2266 419.783 12.0117C419.584 11.7969 419.344 11.625 419.062 11.4961C418.781 11.3672 418.477 11.3027 418.148 11.3027C417.797 11.3027 417.482 11.3672 417.205 11.4961C416.932 11.625 416.699 11.7969 416.508 12.0117C416.316 12.2266 416.17 12.4766 416.068 12.7617C415.971 13.0469 415.922 13.3457 415.922 13.6582C415.922 13.9668 415.971 14.2637 416.068 14.5488C416.17 14.834 416.316 15.084 416.508 15.2988C416.699 15.5137 416.932 15.6836 417.205 15.8086C417.482 15.9336 417.797 15.9961 418.148 15.9961C418.477 15.9961 418.781 15.9395 419.062 15.8262C419.344 15.709 419.584 15.5449 419.783 15.334C419.982 15.1191 420.139 14.8711 420.252 14.5898C420.365 14.3047 420.422 13.9941 420.422 13.6582ZM422.795 13.6934C422.795 13.2754 422.867 12.8867 423.012 12.5273C423.156 12.168 423.352 11.8594 423.598 11.6016C423.844 11.3398 424.135 11.1348 424.471 10.9863C424.811 10.8379 425.176 10.7637 425.566 10.7637C426.008 10.7637 426.391 10.8379 426.715 10.9863C427.043 11.1348 427.316 11.3359 427.535 11.5898C427.758 11.8398 427.924 12.1289 428.033 12.457C428.146 12.7852 428.203 13.1328 428.203 13.5V13.834H423.463C423.475 14.1309 423.531 14.416 423.633 14.6895C423.738 14.959 423.885 15.1992 424.072 15.4102C424.26 15.6172 424.486 15.7832 424.752 15.9082C425.021 16.0293 425.32 16.0898 425.648 16.0898C426.082 16.0898 426.445 16.0078 426.738 15.8438C427.035 15.6797 427.312 15.4473 427.57 15.1465L428.004 15.4922C427.691 15.8984 427.336 16.1953 426.938 16.3828C426.543 16.5664 426.105 16.6582 425.625 16.6582C425.219 16.6582 424.84 16.584 424.488 16.4355C424.141 16.2871 423.84 16.082 423.586 15.8203C423.336 15.5547 423.141 15.2402 423 14.877C422.863 14.5098 422.795 14.1152 422.795 13.6934ZM427.559 13.3184C427.543 13.0254 427.486 12.7578 427.389 12.5156C427.295 12.2695 427.164 12.0566 426.996 11.877C426.828 11.6934 426.623 11.5527 426.381 11.4551C426.143 11.3535 425.867 11.3027 425.555 11.3027C425.242 11.3027 424.959 11.3652 424.705 11.4902C424.455 11.6152 424.24 11.7734 424.061 11.9648C423.881 12.1562 423.74 12.373 423.639 12.6152C423.541 12.8535 423.488 13.0879 423.48 13.3184H427.559Z" fill="#0B1641"/>
</svg>
`}
          aiCode={`// @ts-nocheck
import * as React from "react"

export interface BreadchumbProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Breadchumb = React.forwardRef<HTMLDivElement, BreadchumbProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "6px", background: "#d9d9d9", border: "1px solid #e4e4e7", fontFamily: "Avenir Next LT Pro", fontSize: "12px", color: "#18181b" }}
      {...props}
    >
      {children ?? "Breadchumb"}
    </div>
    )
  }
)
Breadchumb.displayName = "Breadchumb"

export { Breadchumb }
export default Breadchumb`}
          tokens={{
  "colors": [
    "#cccccc",
    "#d9d9d9",
    "#0b1641"
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
    },
    {
      "fontFamily": "Avenir Next LT Pro",
      "fontSize": 12,
      "fontWeight": "Light"
    },
    {
      "fontFamily": "Avenir Next LT Pro",
      "fontSize": 12,
      "fontWeight": "Light"
    },
    {
      "fontFamily": "Avenir Next LT Pro",
      "fontSize": 12,
      "fontWeight": "Light"
    },
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
  "spacing": [
    "8px"
  ],
  "borderRadius": [],
  "shadows": []
}}
          variantProperties={[]}
          anatomy={{
  "name": "Breadchumb",
  "type": "COMPONENT",
  "visible": true,
  "children": [
    {
      "name": "Level 1",
      "type": "INSTANCE",
      "visible": true,
      "children": [
        {
          "name": "Page",
          "type": "TEXT",
          "visible": true,
          "children": []
        },
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
    },
    {
      "name": "Level 2",
      "type": "INSTANCE",
      "visible": true,
      "children": [
        {
          "name": "Page",
          "type": "TEXT",
          "visible": true,
          "children": []
        },
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
    },
    {
      "name": "Level 3",
      "type": "INSTANCE",
      "visible": true,
      "children": [
        {
          "name": "Page",
          "type": "TEXT",
          "visible": true,
          "children": []
        },
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
    },
    {
      "name": "Level 4",
      "type": "INSTANCE",
      "visible": true,
      "children": [
        {
          "name": "Page",
          "type": "TEXT",
          "visible": true,
          "children": []
        },
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
    },
    {
      "name": "Level 5",
      "type": "INSTANCE",
      "visible": true,
      "children": [
        {
          "name": "Page",
          "type": "TEXT",
          "visible": true,
          "children": []
        },
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
    },
    {
      "name": "Level 6",
      "type": "INSTANCE",
      "visible": true,
      "children": [
        {
          "name": "Page",
          "type": "TEXT",
          "visible": true,
          "children": []
        },
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
    },
    {
      "name": "Level 7",
      "type": "INSTANCE",
      "visible": true,
      "children": [
        {
          "name": "Page",
          "type": "TEXT",
          "visible": true,
          "children": []
        },
        {
          "name": "chevron_forward",
          "type": "INSTANCE",
          "visible": false,
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
    }
  ]
}}
          a11y={[
  {
    "role": "text",
    "note": "Texto visível — será lido por leitores de tela"
  },
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