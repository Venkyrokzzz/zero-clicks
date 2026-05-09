from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import os

OUTPUT = os.path.expanduser("~/Desktop/ZeroClicks_Operations_Bible.pdf")

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    rightMargin=20*mm,
    leftMargin=20*mm,
    topMargin=20*mm,
    bottomMargin=20*mm
)

W, H = A4
styles = getSampleStyleSheet()

# Custom styles
DARK = colors.HexColor("#1a1a2e")
ACCENT = colors.HexColor("#e94560")
LIGHT_BG = colors.HexColor("#f5f5f5")
CODE_BG = colors.HexColor("#1e1e2e")
CODE_FG = colors.HexColor("#cdd6f4")
GREEN = colors.HexColor("#40a02b")
ORANGE = colors.HexColor("#fe640b")

title_style = ParagraphStyle("Title", parent=styles["Normal"],
    fontSize=26, fontName="Helvetica-Bold", textColor=DARK,
    spaceAfter=4, alignment=TA_LEFT)

subtitle_style = ParagraphStyle("Subtitle", parent=styles["Normal"],
    fontSize=11, fontName="Helvetica", textColor=colors.HexColor("#555555"),
    spaceAfter=2)

h1_style = ParagraphStyle("H1", parent=styles["Normal"],
    fontSize=16, fontName="Helvetica-Bold", textColor=ACCENT,
    spaceBefore=14, spaceAfter=6)

h2_style = ParagraphStyle("H2", parent=styles["Normal"],
    fontSize=12, fontName="Helvetica-Bold", textColor=DARK,
    spaceBefore=10, spaceAfter=4)

body_style = ParagraphStyle("Body", parent=styles["Normal"],
    fontSize=10, fontName="Helvetica", textColor=colors.HexColor("#333333"),
    spaceAfter=3, leading=15)

bullet_style = ParagraphStyle("Bullet", parent=styles["Normal"],
    fontSize=10, fontName="Helvetica", textColor=colors.HexColor("#333333"),
    spaceAfter=2, leading=14, leftIndent=12, bulletIndent=0)

code_style = ParagraphStyle("Code", parent=styles["Normal"],
    fontSize=8.5, fontName="Courier", textColor=CODE_FG,
    spaceAfter=2, leading=13, leftIndent=6)

italic_style = ParagraphStyle("Italic", parent=styles["Normal"],
    fontSize=9, fontName="Helvetica-Oblique", textColor=colors.HexColor("#777777"),
    spaceAfter=6)

def bullet(text):
    return Paragraph(f"&#8226;  {text}", bullet_style)

def numbered(n, text):
    return Paragraph(f"{n}.  {text}", bullet_style)

def code_block(lines):
    items = []
    items.append(Spacer(1, 3))
    data = [[Paragraph(line.replace(" ", "&nbsp;").replace("<", "&lt;").replace(">", "&gt;"), code_style)]
            for line in lines]
    t = Table(data, colWidths=[doc.width])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), CODE_BG),
        ("ROWPADDING", (0,0), (-1,-1), 5),
        ("BOX", (0,0), (-1,-1), 0.5, colors.HexColor("#444444")),
    ]))
    items.append(t)
    items.append(Spacer(1, 4))
    return items

def error_table(rows):
    header = ["Error", "Fix"]
    data = [header] + rows
    col_w = [doc.width * 0.35, doc.width * 0.65]
    t = Table(data, colWidths=col_w)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), DARK),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTSIZE", (0,0), (-1,-1), 9),
        ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
        ("BACKGROUND", (0,1), (-1,-1), LIGHT_BG),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ("GRID", (0,0), (-1,-1), 0.5, colors.HexColor("#cccccc")),
        ("PADDING", (0,0), (-1,-1), 6),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
    ]))
    return t

story = []

# ── COVER ──────────────────────────────────────────────────────────────────
story.append(Spacer(1, 20*mm))
story.append(Paragraph("Zero Clicks", title_style))
story.append(Paragraph("Operations Bible", ParagraphStyle("TitleSub",
    parent=styles["Normal"], fontSize=22, fontName="Helvetica",
    textColor=ACCENT, spaceAfter=8)))
story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=10))
story.append(Paragraph("<b>Owner:</b> Venkatesh (Venky) Surampudi", subtitle_style))
story.append(Paragraph("<b>Business:</b> Zero Clicks — AI Automation Agency, UK", subtitle_style))
story.append(Paragraph("<b>Last Updated:</b> April 2026", subtitle_style))
story.append(Spacer(1, 6))
story.append(Paragraph(
    "Keep this document somewhere accessible without Claude — "
    "Notion, Google Docs, or print it. This is your safety net when things break.",
    italic_style))
story.append(Spacer(1, 8))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#dddddd")))
story.append(Spacer(1, 4))

# ── SECTION 1 ──────────────────────────────────────────────────────────────
story.append(Paragraph("1. n8n Troubleshooting Guide", h1_style))

story.append(Paragraph("<b>Workflow Shows &quot;Failed&quot;</b>", h2_style))
for i, step in enumerate([
    "Go to <b>localhost:5678</b> → Workflows → Find failing workflow",
    "Click the <b>Executions</b> tab",
    "Click the failed execution (shown in red)",
    "Look for the <b>red node</b> — that's where it broke",
    "Click the red node to see the exact error message",
], 1):
    story.append(numbered(i, step))
story.append(Spacer(1, 6))

story.append(Paragraph("<b>Common Errors</b>", h2_style))
story.append(error_table([
    ["401 Unauthorized", "Credential expired — reconnect in Settings → Credentials"],
    ["403 Forbidden", "API key wrong or rotated — update the credential"],
    ["Connection refused", "Service is down — check if n8n is running"],
    ["'undefined' in expression", "Data field name changed — check the node's input data"],
    ["Token validation failed", "Wrong webhook token — check N8N_WEBHOOK_TOKEN matches"],
]))
story.append(Spacer(1, 8))

story.append(Paragraph("<b>n8n Won't Start</b>", h2_style))
story.extend(code_block([
    "# Check if n8n is running",
    "ps aux | grep n8n",
    "",
    "# Start n8n",
    "npx n8n start",
    "",
    "# Or if installed globally",
    "n8n start",
]))

story.append(Paragraph("<b>Workflow Stopped Triggering</b>", h2_style))
for i, step in enumerate([
    "Check the webhook is still active — open the workflow, verify trigger node shows <b>Listening</b>",
    "Confirm n8n is running",
    "Check ngrok is running (if using ngrok for tunnels)",
    "Re-activate the workflow: toggle it <b>off → on</b>",
], 1):
    story.append(numbered(i, step))

story.append(PageBreak())

# ── SECTION 2 ──────────────────────────────────────────────────────────────
story.append(Paragraph("2. Credentials Rotation Checklist", h1_style))
story.append(Paragraph("Do this every 90 days or immediately if anything leaks.", italic_style))

creds = [
    ("Google OAuth (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)", [
        "Go to https://console.cloud.google.com → APIs &amp; Services → Credentials",
        "Click your OAuth client → Create new secret",
        "Update in Vercel env vars",
        "Reconnect Gmail credential in n8n (Settings → Credentials → Gmail)",
        "Test a workflow",
    ]),
    ("Anthropic API Key", [
        "Go to https://console.anthropic.com → API Keys",
        "Create new key → copy it",
        "Update in Vercel: <b>ANTHROPIC_API_KEY</b>",
        "Update in n8n: Settings → Credentials → Anthropic → paste new key",
        "Test a workflow with Claude node",
    ]),
    ("Dashboard Secret", [
        "Run in terminal: <font name='Courier'>openssl rand -hex 32</font>",
        "Update in Vercel: <b>DASHBOARD_SECRET</b>",
        "Click Redeploy in Vercel",
    ]),
    ("n8n Webhook Token", [
        "Generate new random string at uuidgenerator.net",
        "Update in Vercel: <b>N8N_WEBHOOK_TOKEN</b>",
        "Update inside n8n → Validate Token node → change the secret value",
        "Test with curl (include the new token header)",
    ]),
    ("Telegram Bot Token", [
        "Message @BotFather on Telegram → /mybots → select bot → API Token → Revoke",
        "Copy new token",
        "Update in Vercel: <b>TELEGRAM_BOT_TOKEN</b>",
        "Test a Telegram alert",
    ]),
]

for title, steps in creds:
    story.append(Paragraph(f"<b>{title}</b>", h2_style))
    for step in steps:
        story.append(bullet(step))
    story.append(Spacer(1, 4))

story.append(PageBreak())

# ── SECTION 3 ──────────────────────────────────────────────────────────────
story.append(Paragraph("3. When X Breaks, Do Y — Runbook", h1_style))

scenarios = [
    ("Website (0-clicks.uk) is down", [
        "Check Vercel → vercel.com → zero-clicks project → look for failed deployment",
        "If deploy failed → click <b>Redeploy</b> on last working deployment",
        "If env vars issue → check all vars present (Settings → Environment Variables)",
        "Check Vercel status: https://vercel-status.com",
    ]),
    ("Reputation Manager not replying to reviews", [
        "Open n8n → Reputation Manager v3 → Executions tab",
        "Check last execution — did it run? Did it fail?",
        "No executions at all → webhook not receiving data → check n8n is running",
        "Failing at Claude node → check Anthropic API key in credentials",
        "Failing at Telegram node → check Telegram bot token",
        "Failing at Sheets node → reconnect Google Sheets credential",
    ]),
    ("Google OAuth errors on website", [
        "Go to Google Cloud Console → OAuth client",
        "Verify redirect URIs include https://www.0-clicks.uk/api/auth/google/callback",
        "Confirm GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel match the console",
        "If client was deleted → create new OAuth client and update all env vars",
    ]),
    ("n8n workflows failing with 401", [
        "Go to Settings → Credentials",
        "Find the red/warning credential",
        "Click it → Reconnect / Re-authenticate",
        "Test the workflow",
    ]),
    ("Telegram alerts stopped working", [
        "Message your bot on Telegram — if no response, the bot is down",
        "Check TELEGRAM_BOT_TOKEN in Vercel is correct",
        "Check TELEGRAM_ALERT_CHAT_ID is correct (1127066101)",
        "Test with the curl command below",
    ]),
    ("n8n is completely unresponsive", [
        "Restart n8n: kill the process and start again with <font name='Courier'>n8n start</font>",
        "Check port 5678 isn't blocked by firewall",
        "If workflows were lost — they're saved in <font name='Courier'>~/.n8n/</font> folder",
    ]),
]

for title, steps in scenarios:
    group = []
    group.append(Paragraph(f"<b>{title}</b>", h2_style))
    for i, step in enumerate(steps, 1):
        group.append(numbered(i, step))
    group.append(Spacer(1, 4))
    story.append(KeepTogether(group))

story.append(Paragraph("<b>Telegram Test Command</b>", h2_style))
story.extend(code_block([
    'curl "https://api.telegram.org/bot{YOUR_BOT_TOKEN}/sendMessage\\',
    '  ?chat_id=1127066101&text=ZeroClicks+Test+Alert"',
]))

story.append(PageBreak())

# ── SECTION 4 ──────────────────────────────────────────────────────────────
story.append(Paragraph("4. Monitoring Setup", h1_style))

story.append(Paragraph("<b>n8n Error Trigger Alert (Telegram)</b>", h2_style))
for i, step in enumerate([
    "In n8n, create a <b>new workflow</b>",
    "Add an <b>Error Trigger</b> node as the start",
    "Connect it to a <b>Telegram</b> node",
    "Use the message template below",
    "Activate the workflow — it will fire on any workflow failure",
], 1):
    story.append(numbered(i, step))
story.append(Spacer(1, 4))
story.extend(code_block([
    "Zero Clicks Alert",
    "Workflow: {{ $json.workflowName }}",
    "Error at: {{ $json.lastNodeExecuted }}",
    "Time: {{ $json.startedAt }}",
    "Fix it: localhost:5678",
]))

story.append(Paragraph("<b>Uptime Monitoring — UptimeRobot (Free)</b>", h2_style))
for i, step in enumerate([
    "Go to https://uptimerobot.com → create free account",
    "Add monitor → HTTPS → https://www.0-clicks.uk",
    "Add monitor → your ngrok webhook URL",
    "Set alert contacts: your email + Telegram bot",
    "Frequency: every 5 minutes — instant alert if down",
], 1):
    story.append(numbered(i, step))
story.append(Spacer(1, 8))

story.append(Paragraph("<b>Monthly Health Check</b>", h2_style))
checks = [
    "Run test webhook curl command → confirm Reputation Manager runs end-to-end",
    "Check Vercel env vars — any flagged as <b>Need to Rotate</b>?",
    "Check Google Cloud Console — any expired OAuth credentials?",
    "Check n8n Insights tab — review execution failure rate",
    "Check Anthropic console — API usage, approaching limits?",
    "Test Telegram alerts still firing",
    "Confirm 0-clicks.uk loads correctly on mobile and desktop",
]
for check in checks:
    story.append(bullet(f"&#9744;  {check}"))

story.append(Spacer(1, 12))
story.append(HRFlowable(width="100%", thickness=1, color=ACCENT, spaceAfter=8))
story.append(Paragraph(
    "Save this document in Notion, Google Docs, or print it. "
    "This is your safety net — no Claude needed.",
    italic_style))

doc.build(story)
print(f"PDF saved to: {OUTPUT}")
