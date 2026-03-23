"use client"
import { useRef, useEffect, useState, useCallback } from "react"

const AGENTS_CONFIG = [
  { id: "code-reviewer", name: "Code Reviewer", code: "CR-01", color: "#60a5fa",
    icon: "🔍", description: "Reviews every changed file for bugs, security & performance",
    tasks: ["git diff HEAD~1 running...", "Scanning 247 lines...", "Checking type safety...", "Security audit...", "No CRITICALs found ✓"] },
  { id: "debugger", name: "Debugger", code: "DB-02", color: "#fbbf24",
    icon: "🐛", description: "Traces errors, fixes bugs, squashes stack traces",
    tasks: ["Reading error stack...", "Isolating failing test...", "Memory leak detected!", "Patching source...", "Bug squashed ✓"] },
  { id: "test-writer", name: "Test Writer", code: "TW-03", color: "#34d399",
    icon: "✅", description: "Generates unit tests and pushes coverage to 90%+",
    tasks: ["Reading source files...", "Generating unit tests...", "Coverage: 71% → 94%", "Running test suite...", "24 tests passing ✓"] },
  { id: "refactorer", name: "Refactorer", code: "RF-04", color: "#a78bfa",
    icon: "♻️", description: "Cleans, simplifies and restructures messy code",
    tasks: ["Scanning for duplication...", "Extracting functions...", "Optimising imports...", "Applying patterns...", "Code simplified ✓"] },
  { id: "doc-writer", name: "Doc Writer", code: "DW-05", color: "#f472b6",
    icon: "📝", description: "Writes JSDoc, READMEs and inline comments",
    tasks: ["Reading codebase...", "Generating JSDoc...", "Writing README.md...", "Adding examples...", "Docs published ✓"] },
  { id: "security-auditor", name: "Security Auditor", code: "SA-06", color: "#fb923c",
    icon: "🛡️", description: "Audits for secrets, broken auth & vulnerabilities",
    tasks: ["Scanning for secrets...", "Checking auth flows...", "Verifying Zod schemas...", "Testing endpoints...", "All clear ✓"] },
]

type Status = "idle" | "working" | "done"

interface Agent {
  id: string; name: string; code: string; color: string; icon: string
  description: string; tasks: string[]
  status: Status; currentTask: string; progress: number; completed: number; frame: number
}

// Pixel character drawer
function drawPixelChar(
  ctx: CanvasRenderingContext2D, x: number, y: number,
  color: string, frame: number, status: Status
) {
  const P = 4
  const skin = "#ffd4a3"
  const hair = "#3b2314"
  const dark = "#1a1a2e"
  const shoe = "#111"

  // Sprite: 8 cols × 14 rows
  const idleA: (string | null)[][] = [
    [null,null,null,skin,skin,null,null,null],
    [null,null,hair,hair,hair,hair,null,null],
    [null,null,hair,skin,skin,hair,null,null],
    [null,null,skin,"#222",skin,"#222",null,null],
    [null,null,skin,skin,skin,skin,null,null],
    [null,color,color,color,color,color,color,null],
    [null,color,color,color,color,color,color,null],
    [skin,color,color,color,color,color,color,skin],
    [null,color,color,color,color,color,color,null],
    [null,null,dark,dark,dark,dark,null,null],
    [null,null,dark,dark,dark,dark,null,null],
    [null,null,shoe,null,null,shoe,null,null],
    [null,null,shoe,null,null,shoe,null,null],
    [null,null,null,null,null,null,null,null],
  ]
  const idleB: (string | null)[][] = [
    [null,null,null,skin,skin,null,null,null],
    [null,null,hair,hair,hair,hair,null,null],
    [null,null,hair,skin,skin,hair,null,null],
    [null,null,skin,"#222",skin,"#222",null,null],
    [null,null,skin,skin,skin,skin,null,null],
    [null,color,color,color,color,color,color,null],
    [null,color,color,color,color,color,color,null],
    [null,color,color,color,color,color,color,null],
    [skin,color,color,color,color,color,color,skin],
    [null,null,dark,dark,dark,dark,null,null],
    [null,null,dark,null,null,dark,null,null],
    [null,shoe,shoe,null,null,null,shoe,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
  ]
  const workA: (string | null)[][] = [
    [null,null,null,skin,skin,null,null,null],
    [null,null,hair,hair,hair,hair,null,null],
    [null,null,hair,skin,skin,hair,null,null],
    [null,null,skin,"#222",skin,"#222",null,null],
    [null,null,skin,skin,skin,skin,null,null],
    [skin,color,color,color,color,color,color,skin],
    [null,color,color,color,color,color,color,null],
    [null,color,color,color,color,color,color,null],
    [null,color,color,color,color,color,color,null],
    [null,null,dark,dark,dark,dark,null,null],
    [null,null,dark,dark,dark,dark,null,null],
    [null,null,shoe,null,null,shoe,null,null],
    [null,null,shoe,null,null,shoe,null,null],
    [null,null,null,null,null,null,null,null],
  ]
  const workB: (string | null)[][] = [
    [null,null,null,skin,skin,null,null,null],
    [null,null,hair,hair,hair,hair,null,null],
    [null,null,hair,skin,skin,hair,null,null],
    [null,null,skin,"#222",skin,"#222",null,null],
    [null,null,skin,skin,skin,skin,null,null],
    [null,color,color,color,color,color,color,null],
    [skin,color,color,color,color,color,color,skin],
    [null,color,color,color,color,color,color,null],
    [null,color,color,color,color,color,color,null],
    [null,null,dark,dark,dark,dark,null,null],
    [null,null,dark,dark,dark,dark,null,null],
    [null,null,shoe,null,null,shoe,null,null],
    [null,null,shoe,null,null,shoe,null,null],
    [null,null,null,null,null,null,null,null],
  ]
  const done: (string | null)[][] = [
    [null,null,null,skin,skin,null,null,null],
    [null,null,hair,hair,hair,hair,null,null],
    [null,null,hair,skin,skin,hair,null,null],
    [null,null,skin,null,"#f0f",null,null,null],
    [null,null,skin,skin,skin,skin,null,null],
    [null,color,color,"#fff","#fff",color,color,null],
    [skin,color,color,"#fff","#fff",color,color,skin],
    [null,color,color,color,color,color,color,null],
    [null,color,color,color,color,color,color,null],
    [null,null,dark,dark,dark,dark,null,null],
    [null,null,dark,dark,dark,dark,null,null],
    [null,null,shoe,null,null,shoe,null,null],
    [null,null,shoe,null,null,shoe,null,null],
    [null,null,null,null,null,null,null,null],
  ]

  let sprite = idleA
  if (status === "done") sprite = done
  else if (status === "working") sprite = frame % 2 === 0 ? workA : workB
  else sprite = frame % 2 === 0 ? idleA : idleB

  sprite.forEach((row, r) => {
    row.forEach((c, col) => {
      if (!c) return
      ctx.fillStyle = c
      ctx.fillRect(x + col * P, y + r * P, P - 1, P - 1)
    })
  })
}

function AgentCard({ agent, onActivate }: { agent: Agent; onActivate: (id: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isActive = agent.status !== "idle"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // terminal background
    ctx.fillStyle = agent.status === "working" ? `${agent.color}11` : "#050510"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // scanlines
    for (let y = 0; y < canvas.height; y += 3) {
      ctx.fillStyle = "rgba(0,0,0,0.15)"
      ctx.fillRect(0, y, canvas.width, 1)
    }
    // draw character centered
    drawPixelChar(ctx, 24, 8, agent.color, agent.frame, agent.status)
    // glow behind character when working
    if (agent.status === "working") {
      ctx.shadowColor = agent.color
      ctx.shadowBlur = 20
      ctx.fillStyle = agent.color + "22"
      ctx.fillRect(16, 0, 56, canvas.height)
      ctx.shadowBlur = 0
    }
    if (agent.status === "done") {
      ctx.fillStyle = agent.color + "44"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [agent.frame, agent.status, agent.color])

  return (
    <div
      onClick={() => agent.status === "idle" && onActivate(agent.id)}
      style={{
        background: "#050510",
        border: `1px solid ${isActive ? agent.color + "66" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "10px",
        overflow: "hidden",
        cursor: agent.status === "idle" ? "pointer" : "default",
        transition: "all 0.2s ease",
        boxShadow: isActive ? `0 0 24px ${agent.color}33, 0 4px 20px rgba(0,0,0,0.6)` : "0 4px 20px rgba(0,0,0,0.4)",
        transform: agent.status === "done" ? "scale(1.02)" : "scale(1)",
        userSelect: "none",
      }}
    >
      {/* Terminal title bar */}
      <div style={{
        background: isActive ? agent.color + "22" : "#0a0a1a",
        borderBottom: `1px solid ${isActive ? agent.color + "44" : "rgba(255,255,255,0.05)"}`,
        padding: "7px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: agent.status === "working" ? "#22c55e" : agent.status === "done" ? agent.color : "#444" ,
            boxShadow: agent.status === "working" ? "0 0 6px #22c55e" : "none", animation: agent.status === "working" ? "pulse 1s infinite" : "none" }} />
          <span style={{ fontFamily: "monospace", fontSize: 10, color: agent.color, letterSpacing: 2 }}>{agent.code}</span>
        </div>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
          {agent.status === "idle" ? "STANDBY" : agent.status === "working" ? "RUNNING" : "DONE ✓"}
        </span>
      </div>

      {/* Pixel character display */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
        <canvas ref={canvasRef} width={88} height={68} style={{ display: "block", imageRendering: "pixelated" }} />
        <div style={{ flex: 1, padding: "8px 12px 8px 8px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)", fontFamily: "monospace", letterSpacing: 0.5 }}>
            {agent.icon} {agent.name}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", lineHeight: 1.4 }}>
            {agent.description}
          </div>
          <div style={{
            fontSize: 9, color: agent.status === "idle" ? "rgba(255,255,255,0.25)" : agent.color,
            fontFamily: "monospace", marginTop: 2,
            textShadow: agent.status === "working" ? `0 0 8px ${agent.color}` : "none",
          }}>
            {">"} {agent.currentTask}
            {agent.status === "working" && <span style={{ animation: "blink 0.7s infinite" }}>_</span>}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.05)" }}>
        <div style={{
          height: "100%", width: `${agent.progress}%`,
          background: agent.status === "done" ? "#22c55e" : agent.color,
          transition: "width 0.8s ease, background 0.3s",
          boxShadow: agent.status !== "idle" ? `0 0 8px ${agent.color}` : "none",
        }} />
      </div>

      {/* Footer: tasks completed + click hint */}
      <div style={{
        padding: "5px 12px", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#03030e",
      }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>
          {agent.completed} tasks run
        </span>
        {agent.status === "idle" && (
          <span style={{ fontSize: 9, color: agent.color + "88", fontFamily: "monospace", animation: "pulse 2s infinite" }}>
            CLICK TO RUN ▶
          </span>
        )}
      </div>
    </div>
  )
}

export default function AgentsPage() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)
  const [agents, setAgents] = useState<Agent[]>(
    AGENTS_CONFIG.map(a => ({
      ...a, status: "idle" as Status, currentTask: "Standby...", progress: 0, completed: 0, frame: 0
    }))
  )
  const [log, setLog] = useState<string[]>([
    "> [SYSTEM] Agent Control Centre v1.0 initialised",
    "> [SYSTEM] 6 agents online and ready",
    "> [SYSTEM] Click any agent to deploy it",
    "> [SYSTEM] Awaiting instructions...",
  ])
  const [totalTasks, setTotalTasks] = useState(0)
  const [uptime, setUptime] = useState("00:00:00")
  const [startTime] = useState(Date.now())

  // Matrix rain
  useEffect(() => {
    const canvas = bgCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const chars = "アイウエオカキクケコ01ABCDEFGHIJKLMNOP◆●○□▲▼"
    const fontSize = 11
    const cols = Math.floor(canvas.width / fontSize)
    const drops = Array(cols).fill(1)
    const interval = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.06)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px monospace`
      drops.forEach((drop, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillStyle = `rgba(0,200,100,${Math.random() * 0.15 + 0.05})`
        ctx.fillText(char, i * fontSize, drop * fontSize)
        if (drop * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }, 60)
    return () => { clearInterval(interval); window.removeEventListener("resize", resize) }
  }, [])

  // Pixel character frame animation
  useEffect(() => {
    const interval = setInterval(() => setAgents(p => p.map(a => ({ ...a, frame: a.frame + 1 }))), 450)
    return () => clearInterval(interval)
  }, [])

  // Uptime
  useEffect(() => {
    const interval = setInterval(() => {
      const e = Date.now() - startTime
      const h = String(Math.floor(e / 3600000)).padStart(2, "0")
      const m = String(Math.floor((e % 3600000) / 60000)).padStart(2, "0")
      const s = String(Math.floor((e % 60000) / 1000)).padStart(2, "0")
      setUptime(`${h}:${m}:${s}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  // Activate agent
  const activateAgent = useCallback((agentId: string) => {
    const config = AGENTS_CONFIG.find(a => a.id === agentId)!
    setAgents(p => p.map(a => a.id === agentId ? { ...a, status: "working", currentTask: config.tasks[0], progress: 0 } : a))
    setLog(p => [`> [${config.code}] Agent deployed — ${config.tasks[0]}`, ...p.slice(0, 49)])

    let step = 0
    const iv = setInterval(() => {
      step++
      if (step >= config.tasks.length) {
        clearInterval(iv)
        setAgents(p => p.map(a => a.id === agentId
          ? { ...a, status: "done", currentTask: config.tasks[config.tasks.length - 1], progress: 100, completed: a.completed + 1 }
          : a))
        setTotalTasks(t => t + 1)
        setLog(p => [`> [${config.code}] ✓ COMPLETE: ${config.tasks[config.tasks.length - 1]}`, ...p.slice(0, 49)])
        setTimeout(() => setAgents(p => p.map(a => a.id === agentId
          ? { ...a, status: "idle", currentTask: "Standby...", progress: 0 }
          : a)), 2500)
      } else {
        const prog = Math.round((step / (config.tasks.length - 1)) * 100)
        setAgents(p => p.map(a => a.id === agentId ? { ...a, currentTask: config.tasks[step], progress: prog } : a))
        setLog(p => [`> [${config.code}] ${config.tasks[step]}`, ...p.slice(0, 49)])
      }
    }, 1100)
  }, [])

  // Run all agents at once
  const runAll = useCallback(() => {
    AGENTS_CONFIG.forEach((a, i) => {
      if (agents.find(ag => ag.id === a.id)?.status === "idle") {
        setTimeout(() => activateAgent(a.id), i * 300)
      }
    })
  }, [agents, activateAgent])

  const activeCount = agents.filter(a => a.status === "working").length

  return (
    <div style={{ minHeight: "100vh", background: "#000814", position: "relative", overflow: "hidden", fontFamily: "monospace" }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes scanline { 0%{top:0} 100%{top:100%} }
      `}</style>

      {/* Matrix background */}
      <canvas ref={bgCanvasRef} style={{ position: "fixed", inset: 0, opacity: 0.6, pointerEvents: "none", zIndex: 0 }} />

      {/* CRT scanline sweep */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "linear-gradient(transparent 50%, rgba(0,0,0,0.03) 50%)",
        backgroundSize: "100% 4px",
      }} />

      <div style={{ position: "relative", zIndex: 2, padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          background: "rgba(0,0,0,0.8)", border: "1px solid rgba(0,255,100,0.2)", borderRadius: "10px",
          padding: "14px 20px", marginBottom: "20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 30px rgba(0,255,100,0.05)",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#00ff64", letterSpacing: 4, textShadow: "0 0 10px #00ff64" }}>
              ◈ ZERO CLICKS — AGENT CONTROL CENTRE
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 3, letterSpacing: 2 }}>
              BUILD FASTER. SHIP SMARTER. ZERO MANUAL WORK.
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {[
              { label: "TOTAL TASKS", value: totalTasks, color: "#60a5fa" },
              { label: "ACTIVE", value: activeCount, color: "#22c55e" },
              { label: "UPTIME", value: uptime, color: "#a78bfa" },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: stat.color, textShadow: `0 0 10px ${stat.color}` }}>{stat.value}</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>{stat.label}</div>
              </div>
            ))}
            <button
              onClick={runAll}
              style={{
                background: "rgba(0,255,100,0.1)", border: "1px solid rgba(0,255,100,0.3)",
                borderRadius: "6px", padding: "8px 16px", color: "#00ff64",
                fontSize: 10, letterSpacing: 2, cursor: "pointer",
                boxShadow: "0 0 12px rgba(0,255,100,0.1)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,255,100,0.2)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,255,100,0.1)")}
            >
              ▶ RUN ALL
            </button>
          </div>
        </div>

        {/* Main layout: agents + log */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "16px" }}>

          {/* Agent grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} onActivate={activateAgent} />
            ))}
          </div>

          {/* Task log */}
          <div style={{
            background: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column",
            backdropFilter: "blur(20px)",
          }}>
            <div style={{
              padding: "8px 12px", background: "#0a0a1a",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 3,
            }}>
              ◆ TASK LOG
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px", display: "flex", flexDirection: "column", gap: 3 }}>
              {log.map((entry, i) => {
                const isComplete = entry.includes("✓")
                const isSystem = entry.includes("[SYSTEM]")
                const color = isComplete ? "#22c55e" : isSystem ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.6)"
                return (
                  <div key={i} style={{
                    fontSize: 9, color, fontFamily: "monospace", lineHeight: 1.5,
                    opacity: 1 - i * 0.03, padding: "1px 4px",
                    borderLeft: i === 0 ? `2px solid ${isComplete ? "#22c55e" : "#60a5fa"}` : "2px solid transparent",
                    background: i === 0 ? "rgba(255,255,255,0.03)" : "transparent",
                    transition: "all 0.2s",
                  }}>
                    {entry}
                  </div>
                )
              })}
            </div>
            <div style={{
              padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.05)",
              fontSize: 9, color: "rgba(0,255,100,0.5)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ animation: "blink 1s infinite" }}>█</span>
              <span>READY</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 16, textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.15)", letterSpacing: 3 }}>
          ZERO CLICKS AUTOMATION · AGENT SDK v1.0 · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}
