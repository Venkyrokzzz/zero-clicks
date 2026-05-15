"""
Zero Clicks — Legal Pack PDF Generator
Dark premium design matching Zero Clicks brand (dark bg, amber accent)
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfgen import canvas as rl_canvas

OUTPUT = "/Users/venky/zero-clicks/legal/zero-clicks-legal-pack.pdf"

W, H = A4
MARGIN = 22 * mm

# ── Brand colours ─────────────────────────────────────────────────────────────
C_BG        = colors.HexColor("#0f0f0f")   # near black
C_SURFACE   = colors.HexColor("#1a1a1a")   # card bg
C_BORDER    = colors.HexColor("#2a2a2a")   # subtle border
C_ACCENT    = colors.HexColor("#f59e0b")   # amber
C_ACCENT2   = colors.HexColor("#fbbf24")   # amber light
C_TEXT      = colors.HexColor("#e8e8e8")   # body text
C_MUTED     = colors.HexColor("#6b7280")   # secondary text
C_WHITE     = colors.white
C_GREEN     = colors.HexColor("#22c55e")
C_TABLE_HDR = colors.HexColor("#1f1f1f")

# ── Styles ────────────────────────────────────────────────────────────────────
def S(name, **kw):
    base = dict(fontName="Helvetica", fontSize=10, textColor=C_TEXT,
                leading=16, spaceAfter=6, spaceBefore=0)
    base.update(kw)
    return ParagraphStyle(name, **base)

STYLES = {
    "body":     S("body", leading=15, spaceAfter=8),
    "body_sm":  S("body_sm", fontSize=9, textColor=C_MUTED, leading=14),
    "h1":       S("h1", fontSize=18, fontName="Helvetica-Bold", spaceAfter=4, spaceBefore=0),
    "h2":       S("h2", fontSize=11, fontName="Helvetica-Bold", textColor=C_ACCENT,
                  spaceBefore=16, spaceAfter=6),
    "h3":       S("h3", fontSize=10, fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=4),
    "meta":     S("meta", fontSize=9, textColor=C_MUTED, spaceAfter=14),
    "label":    S("label", fontSize=9, fontName="Helvetica-Bold"),
    "sig":      S("sig", fontSize=9, leading=22),
    "note":     S("note", fontSize=8.5, fontName="Helvetica-Oblique", textColor=C_MUTED, leading=13),
    "num":      S("num", fontSize=9, fontName="Helvetica-Bold", textColor=C_ACCENT, spaceAfter=2),
    "center":   S("center", alignment=TA_CENTER),
}

def sp(n=8):   return Spacer(1, n)
def rule(c=C_BORDER, t=0.5): return HRFlowable(width="100%", thickness=t, color=c, spaceAfter=8, spaceBefore=4)
def accent_rule(): return HRFlowable(width="100%", thickness=1.5, color=C_ACCENT, spaceAfter=12, spaceBefore=0)

# ── Page canvas (header stripe + footer) ─────────────────────────────────────
def page_canvas(canv, doc):
    canv.saveState()
    # dark background
    canv.setFillColor(C_BG)
    canv.rect(0, 0, W, H, fill=1, stroke=0)

    # amber top stripe
    canv.setFillColor(C_ACCENT)
    canv.rect(0, H - 3, W, 3, fill=1, stroke=0)

    # left accent bar
    canv.setFillColor(C_SURFACE)
    canv.rect(0, 0, 8, H, fill=1, stroke=0)
    canv.setFillColor(C_ACCENT)
    canv.rect(0, 0, 3, H, fill=1, stroke=0)

    # footer bar
    canv.setFillColor(C_SURFACE)
    canv.rect(0, 0, W, 14*mm, fill=1, stroke=0)
    canv.setFillColor(C_ACCENT)
    canv.rect(0, 14*mm, W, 0.5, fill=1, stroke=0)

    # footer text
    canv.setFont("Helvetica", 7.5)
    canv.setFillColor(C_MUTED)
    canv.drawString(MARGIN, 5*mm, "Zero Clicks  ·  zeroclicks.hq@gmail.com  ·  0-clicks.uk  ·  Venkatesh Surampudi  ·  May 2026")
    canv.setFillColor(C_ACCENT)
    canv.drawRightString(W - MARGIN, 5*mm, f"{doc.page}")

    canv.restoreState()

def cover_canvas(canv, doc):
    canv.saveState()
    # full dark bg
    canv.setFillColor(C_BG)
    canv.rect(0, 0, W, H, fill=1, stroke=0)

    # amber left bar — thick on cover
    canv.setFillColor(C_ACCENT)
    canv.rect(0, 0, 6, H, fill=1, stroke=0)

    # top strip
    canv.setFillColor(C_SURFACE)
    canv.rect(0, H - 50*mm, W, 50*mm, fill=1, stroke=0)
    canv.setFillColor(C_ACCENT)
    canv.rect(0, H - 50*mm, W, 1.5, fill=1, stroke=0)

    # "ZERO CLICKS" large ghost text top right
    canv.setFont("Helvetica-Bold", 72)
    canv.setFillColor(colors.HexColor("#1c1c1c"))
    canv.drawRightString(W - MARGIN, H - 40*mm, "ZERO CLICKS")

    # bottom dark bar
    canv.setFillColor(C_SURFACE)
    canv.rect(0, 0, W, 30*mm, fill=1, stroke=0)
    canv.setFillColor(C_ACCENT)
    canv.rect(0, 30*mm, W, 1, fill=1, stroke=0)

    # footer on cover
    canv.setFont("Helvetica", 8)
    canv.setFillColor(C_MUTED)
    canv.drawString(MARGIN, 10*mm, "zeroclicks.hq@gmail.com  ·  0-clicks.uk")
    canv.setFillColor(C_ACCENT)
    canv.drawRightString(W - MARGIN, 10*mm, "Confidential  ·  May 2026")

    canv.restoreState()

# ── Table helper ──────────────────────────────────────────────────────────────
def dark_table(data, col_widths, hdr=True):
    t = Table(data, colWidths=col_widths)
    style = [
        ("FONTNAME",    (0,0), (-1,-1), "Helvetica"),
        ("FONTSIZE",    (0,0), (-1,-1), 8.5),
        ("TEXTCOLOR",   (0,0), (-1,-1), C_TEXT),
        ("TOPPADDING",  (0,0), (-1,-1), 7),
        ("BOTTOMPADDING",(0,0),(-1,-1), 7),
        ("LEFTPADDING", (0,0), (-1,-1), 9),
        ("RIGHTPADDING",(0,0), (-1,-1), 9),
        ("VALIGN",      (0,0), (-1,-1), "TOP"),
        ("GRID",        (0,0), (-1,-1), 0.3, C_BORDER),
    ]
    if hdr:
        style += [
            ("BACKGROUND", (0,0), (-1,0), C_ACCENT),
            ("TEXTCOLOR",  (0,0), (-1,0), C_BG),
            ("FONTNAME",   (0,0), (-1,0), "Helvetica-Bold"),
            ("FONTSIZE",   (0,0), (-1,0), 9),
            ("ROWBACKGROUNDS", (0,1), (-1,-1), [C_SURFACE, colors.HexColor("#161616")]),
        ]
    else:
        style += [
            ("FONTNAME",   (0,0), (0,-1), "Helvetica-Bold"),
            ("TEXTCOLOR",  (0,0), (0,-1), C_ACCENT),
            ("ROWBACKGROUNDS", (0,0), (-1,-1), [C_SURFACE, colors.HexColor("#161616")]),
        ]
    t.setStyle(TableStyle(style))
    return t

# ── COVER PAGE ────────────────────────────────────────────────────────────────
story = []

story.append(sp(55))
story.append(Paragraph("LEGAL DOCUMENT PACK", ParagraphStyle("cv_kicker",
    fontSize=10, fontName="Helvetica-Bold", textColor=C_ACCENT,
    alignment=TA_CENTER, spaceAfter=10, letterSpacing=3)))

story.append(Paragraph("Zero Clicks", ParagraphStyle("cv_title",
    fontSize=44, fontName="Helvetica-Bold", textColor=C_WHITE,
    alignment=TA_CENTER, spaceAfter=6, leading=48)))

story.append(Paragraph("Venkatesh Surampudi  ·  venkateshsurampudi1@gmail.com", ParagraphStyle("cv_sub",
    fontSize=11, fontName="Helvetica", textColor=C_MUTED,
    alignment=TA_CENTER, spaceAfter=4)))

story.append(Paragraph("0-clicks.uk", ParagraphStyle("cv_url",
    fontSize=11, fontName="Helvetica-Bold", textColor=C_ACCENT,
    alignment=TA_CENTER, spaceAfter=40)))

story.append(HRFlowable(width="50%", thickness=1, color=C_ACCENT,
    spaceAfter=40, spaceBefore=0, hAlign="CENTER"))

# Contents box
contents = [
    ["#", "Document", "Purpose"],
    ["01", "Terms of Service", "Governs use of the Zero Clicks service"],
    ["02", "Client Service Agreement", "Sign-off doc sent to each new client"],
    ["03", "Data Processing Agreement", "UK GDPR compliance — you as processor"],
    ["04", "UK Tax & Registration Reference", "Internal thresholds and actions"],
]
ct = dark_table(contents, [12*mm, 65*mm, 80*mm])
story.append(ct)
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# DOC 1 — TERMS OF SERVICE
# ═══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("01", STYLES["num"]))
story.append(Paragraph("Terms of Service", STYLES["h1"]))
story.append(accent_rule())
story.append(Paragraph(
    "Last updated: 15 May 2026  ·  Operator: Venkatesh Surampudi trading as Zero Clicks, United Kingdom",
    STYLES["meta"]))

tos_sections = [
    ("1. The Service",
     "Zero Clicks provides automated Google review reply drafting and management for UK hospitality businesses. "
     "The service connects to your Google Business Profile via OAuth, detects new reviews, and generates draft "
     "replies using AI. You review and approve replies via your Zero Clicks dashboard before they are posted, "
     "unless you have enabled the auto-send feature for positive reviews."),
    ("2. Trial Period",
     "New clients receive a 60-day free trial. No payment is required during the trial. At the end of the trial "
     "period, continued use of the service requires a paid subscription. We will notify you by email at least "
     "7 days before your trial expires. You may cancel at any time during the trial at no cost."),
    ("3. Fees and Payment",
     "Our standard pricing is a one-off setup fee of £499 plus a monthly subscription of £49 per month, per venue. "
     "Prices are exclusive of VAT (we are not currently VAT registered). Monthly subscriptions are billed in advance. "
     "Invoices are issued on the first of each month. Payment is due within 14 days of the invoice date. We reserve "
     "the right to suspend the service for accounts overdue by more than 30 days."),
    ("4. Your Responsibilities",
     "You are responsible for: (a) ensuring you have the right to connect your Google Business Profile to our service; "
     "(b) reviewing AI-generated draft replies before approving them for posting; (c) ensuring any replies posted comply "
     "with Google's review policies and applicable UK law; (d) keeping your account credentials secure. You must not use "
     "Zero Clicks to post false, misleading, or defamatory content. You remain solely responsible for all replies posted "
     "through our service."),
    ("5. AI-Generated Content",
     "Zero Clicks uses AI (Anthropic Claude) to draft review replies. AI-generated content is a starting point, not a "
     "finished product. We do not guarantee drafts will be factually accurate, tonally appropriate, or free from errors. "
     "You are responsible for reviewing all drafts before approval. We accept no liability for replies posted without "
     "human review."),
    ("6. Google Business Profile Access",
     "You grant Zero Clicks limited OAuth access to your Google Business Profile solely to read reviews and post "
     "approved replies. We do not access or store any other Google account data. You may revoke access at any time "
     "via your Zero Clicks dashboard or at myaccount.google.com/permissions."),
    ("7. Data and Confidentiality",
     "We process review text, reviewer names, and your business details to provide the service. Data is stored "
     "securely on UK/EU infrastructure. We do not sell or share your data with third parties except as required to "
     "operate the service. See our Privacy Policy at 0-clicks.uk/privacy."),
    ("8. Cancellation",
     "You may cancel at any time by emailing zeroclicks.hq@gmail.com. Cancellations take effect at the end of the "
     "current billing month. No refunds for partial months. On cancellation, data is retained for 30 days then "
     "permanently deleted. Immediate deletion available on request."),
    ("9. Limitation of Liability",
     "Our total liability is limited to fees paid in the 3 months preceding the claim. We are not liable for: loss "
     "of revenue or profits; reputational damage from approved replies; service interruptions beyond our reasonable "
     "control (including Google API outages); or indirect or consequential losses."),
    ("10. Changes to the Service",
     "Material changes to these Terms will be communicated by email at least 14 days before taking effect. "
     "Continued use after that date constitutes acceptance. You may cancel without penalty during the notice period."),
    ("11. Governing Law",
     "These Terms are governed by the laws of England and Wales. Disputes will be subject to the exclusive "
     "jurisdiction of the courts of England and Wales."),
    ("12. Contact",
     "Zero Clicks is operated by Venkatesh Surampudi, United Kingdom. Email: zeroclicks.hq@gmail.com"),
]

for title, text in tos_sections:
    story.append(KeepTogether([
        Paragraph(title, STYLES["h2"]),
        Paragraph(text, STYLES["body"]),
    ]))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# DOC 2 — CLIENT SERVICE AGREEMENT
# ═══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("02", STYLES["num"]))
story.append(Paragraph("Client Service Agreement", STYLES["h1"]))
story.append(accent_rule())
story.append(Paragraph("Version 1.0  ·  May 2026  ·  Zero Clicks (Venkatesh Surampudi)", STYLES["meta"]))

story.append(Paragraph(
    "This Agreement is between Zero Clicks (Venkatesh Surampudi) and the client named below. "
    "By signing or replying \"I agree — [name] — [date]\" by email, you confirm acceptance of these terms.",
    STYLES["body"]))

story.append(Paragraph("CLIENT DETAILS", STYLES["h2"]))
client_rows = [
    ["Business name", ""],
    ["Trading name (if different)", ""],
    ["Venue address", ""],
    ["Contact name", ""],
    ["Contact email", ""],
    ["Contact phone", ""],
    ["Google Business Profile URL", ""],
]
ct2 = Table(client_rows, colWidths=[70*mm, 97*mm], rowHeights=9.5*mm)
ct2.setStyle(TableStyle([
    ("FONTNAME",    (0,0), (0,-1), "Helvetica-Bold"),
    ("FONTNAME",    (1,0), (1,-1), "Helvetica"),
    ("FONTSIZE",    (0,0), (-1,-1), 9),
    ("TEXTCOLOR",   (0,0), (-1,-1), C_TEXT),
    ("TEXTCOLOR",   (0,0), (0,-1), C_ACCENT),
    ("BACKGROUND",  (0,0), (0,-1), C_SURFACE),
    ("ROWBACKGROUNDS", (1,0), (1,-1), [colors.HexColor("#111"), colors.HexColor("#141414")]),
    ("GRID",        (0,0), (-1,-1), 0.3, C_BORDER),
    ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
    ("LEFTPADDING", (0,0), (-1,-1), 9),
]))
story.append(ct2)

story.append(Paragraph("WHAT WE WILL DO", STYLES["h2"]))
story.append(Paragraph(
    "Zero Clicks will: connect to your Google Business Profile via secure OAuth; detect new reviews within "
    "minutes of posting; generate a draft reply in your business's voice using AI; present drafts in your "
    "dashboard for approval; post approved replies to Google on your behalf; flag 1-2 star reviews for "
    "immediate attention.", STYLES["body"]))

story.append(Paragraph("WHAT YOU WILL DO", STYLES["h2"]))
story.append(Paragraph(
    "You agree to: provide accurate business information at onboarding; review AI-generated drafts before "
    "approval; not post false or misleading content; keep login credentials secure; notify us if your "
    "Google Business Profile access changes; pay invoices within 14 days of issue.", STYLES["body"]))

story.append(Paragraph("FEES", STYLES["h2"]))
fees = [
    ["Item", "Amount", "Notes"],
    ["One-off setup fee", "£499", "Invoiced after trial, on confirmation to continue"],
    ["Monthly subscription", "£49 / venue / month", "Billed in advance, due within 14 days"],
    ["Trial period", "60 days — FREE", "No setup fee until you confirm continuation"],
    ["VAT", "Not applicable", "Zero Clicks is not VAT registered"],
]
story.append(dark_table(fees, [50*mm, 50*mm, 67*mm]))

story.append(sp(8))
story.append(Paragraph("CANCELLATION", STYLES["h2"]))
story.append(Paragraph(
    "Cancel any time by emailing zeroclicks.hq@gmail.com. Cancellations take effect end of current billing "
    "month. No refunds for partial months. Data deleted within 30 days of cancellation.", STYLES["body"]))

story.append(Paragraph("AI-GENERATED CONTENT", STYLES["h2"]))
story.append(Paragraph(
    "Reply drafts are AI-generated starting points. You are responsible for reviewing before approval. "
    "Zero Clicks is not liable for replies you approve and post. If you enable auto-send for 4-5 star "
    "reviews, you accept full responsibility for those automated posts.", STYLES["body"]))

story.append(Paragraph("GOVERNING LAW", STYLES["h2"]))
story.append(Paragraph("England and Wales.", STYLES["body"]))

story.append(sp(12))
story.append(rule(C_ACCENT, 1))
story.append(Paragraph("SIGNATURES", STYLES["h2"]))

sig_rows = [
    ["Client signature", "_" * 38, "Date", "_" * 18],
    ["Client name (print)", "_" * 38, "", ""],
    ["Position / Title", "_" * 38, "", ""],
    ["", "", "", ""],
    ["Zero Clicks\n(Venkatesh Surampudi)", "_" * 38, "Date", "_" * 18],
]
st = Table(sig_rows, colWidths=[45*mm, 72*mm, 16*mm, 34*mm])
st.setStyle(TableStyle([
    ("FONTNAME",    (0,0), (-1,-1), "Helvetica"),
    ("FONTSIZE",    (0,0), (-1,-1), 9),
    ("TEXTCOLOR",   (0,0), (-1,-1), C_TEXT),
    ("FONTNAME",    (0,0), (0,-1), "Helvetica-Bold"),
    ("TEXTCOLOR",   (0,0), (0,-1), C_ACCENT),
    ("FONTNAME",    (2,0), (2,-1), "Helvetica-Bold"),
    ("TEXTCOLOR",   (2,0), (2,-1), C_MUTED),
    ("TOPPADDING",  (0,0), (-1,-1), 11),
    ("BOTTOMPADDING",(0,0),(-1,-1), 4),
    ("VALIGN",      (0,0), (-1,-1), "BOTTOM"),
]))
story.append(st)
story.append(sp(10))
story.append(Paragraph(
    "Send signed copy to zeroclicks.hq@gmail.com  ·  "
    "Email acceptance: reply \"I agree — [your name] — [date]\" (legally valid, UK)",
    STYLES["note"]))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# DOC 3 — DATA PROCESSING AGREEMENT
# ═══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("03", STYLES["num"]))
story.append(Paragraph("Data Processing Agreement", STYLES["h1"]))
story.append(accent_rule())
story.append(Paragraph("Version 1.0  ·  May 2026  ·  UK GDPR Compliant", STYLES["meta"]))

parties = [
    ["Role", "Party", "Contact"],
    ["Data Controller", "The client (hospitality business using Zero Clicks)", "As per Client Agreement"],
    ["Data Processor", "Venkatesh Surampudi trading as Zero Clicks", "zeroclicks.hq@gmail.com"],
]
story.append(dark_table(parties, [35*mm, 95*mm, 37*mm]))
story.append(sp(4))

dpa_sections = [
    ("1. What Data We Process",
     "Reviewer names, review text, ratings, and timestamps (from Google Business Profile). Your business "
     "details, manager name, and login credentials (from onboarding). We do not process payment card data, "
     "national insurance numbers, or sensitive personal data categories under UK GDPR Article 9."),
    ("2. Purpose of Processing",
     "Solely to: generate AI draft replies; present drafts in your dashboard; post approved replies to Google; "
     "flag negative reviews; provide dashboard metrics. We will not process your data for any other purpose "
     "without your written instruction."),
    ("4. Data Retention",
     "Review data, profile and settings: duration of contract + 30 days. Opt-out records: indefinitely. "
     "On cancellation or written request, all data permanently deleted within 30 days."),
    ("5. Security Measures",
     "All data transmitted over HTTPS/TLS 1.2+. Database encrypted at rest. Data scoped per client — "
     "no client can access another's data. OAuth tokens stored securely, access limited to review API calls only."),
    ("6. Breach Notification",
     "In the event of a personal data breach, Zero Clicks will notify you within 72 hours with details of: "
     "what was affected, likely consequences, and measures taken."),
    ("7. Compliance",
     "UK GDPR, Data Protection Act 2018, Privacy and Electronic Communications Regulations 2003 (PECR)."),
    ("8. Acceptance",
     "This DPA is incorporated into the Client Service Agreement. Signing the Client Agreement constitutes "
     "acceptance of this DPA."),
]

story.append(Paragraph("3. Sub-processors", STYLES["h2"]))
sub = [
    ["Sub-processor", "Purpose", "Location"],
    ["Supabase", "Database storage", "EU (Ireland/France)"],
    ["Vercel", "Web hosting & API", "EU data residency"],
    ["Anthropic Claude API", "AI reply generation — no data retained post-processing", "US"],
    ["Clerk", "Authentication", "US"],
    ["Google OAuth", "Business Profile API access", "US"],
]
story.append(dark_table(sub, [40*mm, 90*mm, 37*mm]))
story.append(Paragraph("We will notify you of any sub-processor changes with at least 14 days notice.", STYLES["body_sm"]))

for title, text in dpa_sections:
    story.append(KeepTogether([
        Paragraph(title, STYLES["h2"]),
        Paragraph(text, STYLES["body"]),
    ]))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# DOC 4 — UK TAX REFERENCE
# ═══════════════════════════════════════════════════════════════════════════════
story.append(Paragraph("04", STYLES["num"]))
story.append(Paragraph("UK Tax & Registration Reference", STYLES["h1"]))
story.append(accent_rule())
story.append(Paragraph("Internal use only  ·  May 2026  ·  Verify annually with your accountant", STYLES["meta"]))

story.append(Paragraph("Sole Trader Thresholds — 2025/26 Tax Year", STYLES["h2"]))
tax = [
    ["Threshold", "Amount", "What it means for you"],
    ["Trading Allowance", "£1,000/yr", "Under this — nothing to register or file"],
    ["Self-Assessment trigger", "Over £1,000 profit", "Must register with HMRC"],
    ["Personal Allowance", "£12,570/yr", "No income tax below this figure"],
    ["VAT registration", "£90,000/yr turnover", "Do not register early — not needed for years"],
    ["Basic rate income tax", "£12,571-£50,270", "20% on profit in this band"],
    ["Class 4 National Insurance", "Over £12,570 profit", "6% up to £50,270 threshold"],
]
story.append(dark_table(tax, [52*mm, 38*mm, 77*mm]))

story.append(Paragraph("Zero Clicks Revenue Milestones", STYLES["h2"]))
milestones = [
    ["Clients", "Annual revenue", "Tax position"],
    ["0-2 clients", "Under ~£1,176/yr", "Below trading allowance. No registration, no tax."],
    ["3-21 clients", "~£1,177-£12,570/yr", "Register for self-assessment. No income tax (personal allowance covers it)."],
    ["22+ clients", "£12,570+/yr", "Income tax at 20% on profit above £12,570."],
    ["183+ clients", "Over £90,000/yr", "VAT registration required."],
]
story.append(dark_table(milestones, [28*mm, 42*mm, 97*mm]))

story.append(Paragraph("Sole Trader vs Limited Company", STYLES["h2"]))
structure = [
    ["", "Sole Trader", "Limited Company"],
    ["Best for", "Under ~£30k profit", "Over ~£30-35k profit"],
    ["Tax on profit", "Income tax (20-45%)", "Corporation tax (19% under £50k)"],
    ["Pay yourself", "All profit is yours", "Salary (£12,570 tax-free) + dividends (8.75%)"],
    ["Admin", "Simple — HMRC only", "Companies House + accounts"],
    ["Liability", "Personal liability", "Limited liability"],
]
story.append(dark_table(structure, [35*mm, 57*mm, 75*mm]))

story.append(Paragraph("Three Actions to Take Now", STYLES["h2"]))
actions = [
    ("1.  Register as sole trader with HMRC",
     "Free. 10 minutes online. gov.uk/set-up-sole-trader"),
    ("2.  Open a separate business bank account",
     "Monzo Business or Starling — both free. Keeps Zero Clicks money separate from day one."),
    ("3.  Register with the ICO",
     "£40/year. Required when processing personal data for commercial purposes. ico.org.uk/registration"),
]
for a_title, a_detail in actions:
    story.append(KeepTogether([
        Paragraph(a_title, STYLES["h3"]),
        Paragraph(a_detail, STYLES["body"]),
    ]))

story.append(sp(8))
story.append(rule(C_ACCENT, 1))
story.append(Paragraph(
    "Deductible expenses: n8n Pro (£27/mo), Supabase (£20/mo), Claude API (~£5/mo), domain, any software. "
    "Total running costs: £52/month = £624/year. Deduct these before calculating taxable profit.",
    STYLES["note"]))

# ── Build ─────────────────────────────────────────────────────────────────────
class ZCDocTemplate(SimpleDocTemplate):
    def __init__(self, *args, **kwargs):
        self._is_cover = True
        super().__init__(*args, **kwargs)

    def handle_pageBegin(self):
        super().handle_pageBegin()

    def afterPage(self):
        self._is_cover = False

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    leftMargin=MARGIN + 6,   # account for amber left bar
    rightMargin=MARGIN,
    topMargin=MARGIN,
    bottomMargin=20*mm,
    title="Zero Clicks — Legal Document Pack",
    author="Venkatesh Surampudi",
    subject="Terms of Service, Client Agreement, DPA, Tax Reference",
)

# Build with cover canvas for page 1, regular for rest
def first_page(canv, doc):
    cover_canvas(canv, doc)

def later_pages(canv, doc):
    page_canvas(canv, doc)

doc.build(story, onFirstPage=first_page, onLaterPages=later_pages)
print(f"Done → {OUTPUT}")
