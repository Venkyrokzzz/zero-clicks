const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Venkatesh Surampudi";
pres.title = "Zero Clicks — Market Opportunity";

// ── Theme ──
const BG = "0A0A0A";
const BG_CARD = "141414";
const BG_CARD2 = "1A1A1A";
const WHITE = "EFEFEF";
const MUTED = "888888";
const DIM = "555555";
const ACCENT = "3B82F6";
const ACCENT_DIM = "1E3A5F";
const GREEN = "22C55E";
const RED = "EF4444";
const AMBER = "F59E0B";
const FONT_DISPLAY = "Georgia";
const FONT_BODY = "Calibri";

// Helper: fresh shadow each time (pptxgenjs mutates objects)
const cardShadow = () => ({ type: "outer", blur: 8, offset: 2, angle: 135, color: "000000", opacity: 0.3 });

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Title
// ══════════════════════════════════════════════════════════════════════════════
let s1 = pres.addSlide();
s1.background = { color: BG };
// Top accent line
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: ACCENT } });
// Subtle glow circle
s1.addShape(pres.shapes.OVAL, { x: 2.5, y: 0.8, w: 5, h: 4, fill: { color: ACCENT, transparency: 95 } });
s1.addText("ZERO CLICKS", {
  x: 0.8, y: 1.2, w: 8.4, h: 1.0, fontSize: 48, fontFace: FONT_DISPLAY,
  color: WHITE, bold: true, charSpacing: 4, align: "center", margin: 0
});
s1.addText("Market Opportunity", {
  x: 0.8, y: 2.2, w: 8.4, h: 0.7, fontSize: 28, fontFace: FONT_DISPLAY,
  color: ACCENT, align: "center", margin: 0
});
s1.addText("AI Automation for UK Hospitality SMEs", {
  x: 0.8, y: 3.1, w: 8.4, h: 0.5, fontSize: 16, fontFace: FONT_BODY,
  color: MUTED, align: "center", margin: 0
});
s1.addShape(pres.shapes.RECTANGLE, { x: 4.2, y: 3.8, w: 1.6, h: 0.02, fill: { color: DIM } });
s1.addText("March 2026", {
  x: 0.8, y: 4.1, w: 8.4, h: 0.5, fontSize: 12, fontFace: FONT_BODY,
  color: DIM, align: "center", margin: 0
});
// Bottom bar
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.3, w: 10, h: 0.325, fill: { color: "111111" } });
s1.addText("zeroclicks.vercel.app", {
  x: 0.8, y: 5.3, w: 8.4, h: 0.325, fontSize: 10, fontFace: FONT_BODY,
  color: DIM, align: "center", valign: "middle", margin: 0
});

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — The Market
// ══════════════════════════════════════════════════════════════════════════════
let s2 = pres.addSlide();
s2.background = { color: BG };
s2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: ACCENT } });
s2.addText("THE MARKET", {
  x: 0.7, y: 0.35, w: 8.6, h: 0.4, fontSize: 11, fontFace: FONT_BODY,
  color: ACCENT, charSpacing: 4, margin: 0
});
s2.addText("UK Hospitality at a Glance", {
  x: 0.7, y: 0.7, w: 8.6, h: 0.6, fontSize: 30, fontFace: FONT_DISPLAY,
  color: WHITE, margin: 0
});

// Big stat cards — 3 across top row
const stats2_top = [
  { val: "176,685", label: "Hospitality\nBusinesses", col: ACCENT },
  { val: "99.6%", label: "Are SMEs", col: GREEN },
  { val: "\u00A3153B", label: "Sector\nTurnover", col: AMBER },
];
const stats2_bot = [
  { val: "3.5M", label: "Employees", col: ACCENT },
  { val: "45,000", label: "Pubs", col: RED },
  { val: "50,900", label: "Restaurants", col: GREEN },
];

stats2_top.forEach((s, i) => {
  const cx = 0.7 + i * 3.05;
  s2.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.55, w: 2.75, h: 1.55, fill: { color: BG_CARD }, shadow: cardShadow() });
  s2.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.55, w: 2.75, h: 0.04, fill: { color: s.col } });
  s2.addText(s.val, { x: cx, y: 1.75, w: 2.75, h: 0.7, fontSize: 32, fontFace: FONT_DISPLAY, color: s.col, align: "center", bold: true, margin: 0 });
  s2.addText(s.label, { x: cx, y: 2.45, w: 2.75, h: 0.5, fontSize: 12, fontFace: FONT_BODY, color: MUTED, align: "center", margin: 0 });
});
stats2_bot.forEach((s, i) => {
  const cx = 0.7 + i * 3.05;
  s2.addShape(pres.shapes.RECTANGLE, { x: cx, y: 3.35, w: 2.75, h: 1.55, fill: { color: BG_CARD }, shadow: cardShadow() });
  s2.addShape(pres.shapes.RECTANGLE, { x: cx, y: 3.35, w: 2.75, h: 0.04, fill: { color: s.col } });
  s2.addText(s.val, { x: cx, y: 3.55, w: 2.75, h: 0.7, fontSize: 32, fontFace: FONT_DISPLAY, color: s.col, align: "center", bold: true, margin: 0 });
  s2.addText(s.label, { x: cx, y: 4.25, w: 2.75, h: 0.5, fontSize: 12, fontFace: FONT_BODY, color: MUTED, align: "center", margin: 0 });
});

s2.addText("Source: ONS, BBPA, House of Commons Library (2024-25)", {
  x: 0.7, y: 5.1, w: 8.6, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: DIM, margin: 0
});

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — The Crisis
// ══════════════════════════════════════════════════════════════════════════════
let s3 = pres.addSlide();
s3.background = { color: BG };
s3.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: RED } });
s3.addText("THE CRISIS", {
  x: 0.7, y: 0.35, w: 8.6, h: 0.4, fontSize: 11, fontFace: FONT_BODY,
  color: RED, charSpacing: 4, margin: 0
});
s3.addText("An Industry Under Pressure", {
  x: 0.7, y: 0.7, w: 8.6, h: 0.6, fontSize: 30, fontFace: FONT_DISPLAY,
  color: WHITE, margin: 0
});

const crisisItems = [
  { icon: "6", val: "pubs closing per week", sub: "300+ in 2024, accelerating to 1/day in 2025" },
  { icon: "12%", val: "of restaurants at risk of closure", sub: "6,128 businesses with maximum insolvency risk" },
  { icon: "60%", val: "business rates cut slashed to 25%", sub: "From April 2025 — single biggest cost shock" },
  { icon: "75%", val: "of operators face unprecedented pressure", sub: "Rising NI, wages, energy (+15%), food costs" },
];

crisisItems.forEach((item, i) => {
  const yPos = 1.55 + i * 0.95;
  s3.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: yPos, w: 8.6, h: 0.8, fill: { color: BG_CARD } });
  s3.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: yPos, w: 0.04, h: 0.8, fill: { color: RED } });
  s3.addText(item.icon, { x: 0.95, y: yPos + 0.05, w: 0.9, h: 0.7, fontSize: 22, fontFace: FONT_DISPLAY, color: RED, bold: true, valign: "middle", margin: 0 });
  s3.addText(item.val, { x: 2.0, y: yPos + 0.08, w: 7.1, h: 0.35, fontSize: 15, fontFace: FONT_BODY, color: WHITE, bold: true, margin: 0 });
  s3.addText(item.sub, { x: 2.0, y: yPos + 0.42, w: 7.1, h: 0.3, fontSize: 11, fontFace: FONT_BODY, color: MUTED, margin: 0 });
});

s3.addText("Sources: BBPA, Morning Advertiser, Price Bailey, Bald Consulting (2024-25)", {
  x: 0.7, y: 5.1, w: 8.6, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: DIM, margin: 0
});

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — The Pain Points
// ══════════════════════════════════════════════════════════════════════════════
let s4 = pres.addSlide();
s4.background = { color: BG };
s4.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: AMBER } });
s4.addText("PAIN POINTS", {
  x: 0.7, y: 0.35, w: 8.6, h: 0.4, fontSize: 11, fontFace: FONT_BODY,
  color: AMBER, charSpacing: 4, margin: 0
});
s4.addText("Where Time Gets Lost", {
  x: 0.7, y: 0.7, w: 8.6, h: 0.6, fontSize: 30, fontFace: FONT_DISPLAY,
  color: WHITE, margin: 0
});

// Left — big stat
s4.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.5, w: 3.5, h: 3.4, fill: { color: BG_CARD }, shadow: cardShadow() });
s4.addText("10-20", { x: 0.7, y: 1.8, w: 3.5, h: 1.0, fontSize: 56, fontFace: FONT_DISPLAY, color: AMBER, bold: true, align: "center", margin: 0 });
s4.addText("hrs/week", { x: 0.7, y: 2.7, w: 3.5, h: 0.5, fontSize: 20, fontFace: FONT_BODY, color: WHITE, align: "center", margin: 0 });
s4.addText("spent on manual admin\nby the average hospitality SME", { x: 0.7, y: 3.3, w: 3.5, h: 0.7, fontSize: 12, fontFace: FONT_BODY, color: MUTED, align: "center", margin: 0 });
s4.addText("132,000+ staff vacancies", { x: 0.9, y: 4.2, w: 3.1, h: 0.4, fontSize: 12, fontFace: FONT_BODY, color: RED, align: "center", bold: true, margin: 0 });

// Right — list
const painItems = [
  "Supplier ordering via email and phone",
  "Booking confirmations sent by hand",
  "Staff rotas managed in spreadsheets",
  "Invoice processing done manually",
  "Hotels lose $200K/yr on manual data entry",
  "No triage system — everything is urgent",
];
painItems.forEach((item, i) => {
  const yPos = 1.6 + i * 0.52;
  s4.addShape(pres.shapes.RECTANGLE, { x: 4.5, y: yPos, w: 0.04, h: 0.38, fill: { color: AMBER } });
  s4.addText(item, { x: 4.75, y: yPos, w: 4.75, h: 0.38, fontSize: 13, fontFace: FONT_BODY, color: WHITE, valign: "middle", margin: 0 });
});

s4.addText("Sources: NetSuite, Trail App, Growth Engineering (2024)", {
  x: 0.7, y: 5.1, w: 8.6, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: DIM, margin: 0
});

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — Tech Adoption Gap
// ══════════════════════════════════════════════════════════════════════════════
let s5 = pres.addSlide();
s5.background = { color: BG };
s5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: ACCENT } });
s5.addText("TECH ADOPTION", {
  x: 0.7, y: 0.35, w: 8.6, h: 0.4, fontSize: 11, fontFace: FONT_BODY,
  color: ACCENT, charSpacing: 4, margin: 0
});
s5.addText("The Digital Gap in Hospitality", {
  x: 0.7, y: 0.7, w: 8.6, h: 0.6, fontSize: 30, fontFace: FONT_DISPLAY,
  color: WHITE, margin: 0
});

// Bar chart — AI adoption
s5.addChart(pres.charts.BAR, [{
  name: "Adoption",
  labels: ["Using AI\nNow", "Plan to\nAutomate", "Use Some\nTech", "Wait for\nOthers"],
  values: [12, 44, 69, 57]
}], {
  x: 0.5, y: 1.5, w: 5, h: 3.3, barDir: "col",
  chartColors: [ACCENT],
  chartArea: { fill: { color: BG_CARD }, roundedCorners: true },
  catAxisLabelColor: MUTED, valAxisLabelColor: MUTED,
  catAxisLabelFontSize: 10, valAxisLabelFontSize: 10,
  valGridLine: { color: "222222", size: 0.5 },
  catGridLine: { style: "none" },
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: ACCENT,
  dataLabelFontSize: 14, dataLabelFontBold: true,
  showLegend: false, valAxisMaxVal: 100,
  catAxisLabelFontFace: FONT_BODY, valAxisLabelFontFace: FONT_BODY,
});

// Right side callouts
const techCallouts = [
  { val: "\u00A32.6B", label: "Planned SME automation\nspend (2024)", col: GREEN },
  { val: "21%", label: "UK hotel tech spend\nincrease (2025)", col: ACCENT },
  { val: "85%", label: "Restaurant leaders expect\nAI in 2025", col: AMBER },
];
techCallouts.forEach((item, i) => {
  const yPos = 1.5 + i * 1.15;
  s5.addShape(pres.shapes.RECTANGLE, { x: 5.8, y: yPos, w: 3.7, h: 0.95, fill: { color: BG_CARD }, shadow: cardShadow() });
  s5.addText(item.val, { x: 5.9, y: yPos + 0.08, w: 3.5, h: 0.45, fontSize: 26, fontFace: FONT_DISPLAY, color: item.col, bold: true, margin: 0 });
  s5.addText(item.label, { x: 5.9, y: yPos + 0.52, w: 3.5, h: 0.35, fontSize: 11, fontFace: FONT_BODY, color: MUTED, margin: 0 });
});

s5.addText("Sources: GOV.UK SME Survey, Beaming, Capital Economics (2024-25)", {
  x: 0.7, y: 5.1, w: 8.6, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: DIM, margin: 0
});

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — The Automation Market
// ══════════════════════════════════════════════════════════════════════════════
let s6 = pres.addSlide();
s6.background = { color: BG };
s6.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: GREEN } });
s6.addText("MARKET SIZE", {
  x: 0.7, y: 0.35, w: 8.6, h: 0.4, fontSize: 11, fontFace: FONT_BODY,
  color: GREEN, charSpacing: 4, margin: 0
});
s6.addText("The Automation Opportunity", {
  x: 0.7, y: 0.7, w: 8.6, h: 0.6, fontSize: 30, fontFace: FONT_DISPLAY,
  color: WHITE, margin: 0
});

// 4 big stat boxes
const marketStats = [
  { val: "$16.3B", label: "Global BPA Market\n(2025)", sub: "15.4% CAGR", col: ACCENT },
  { val: "$270M", label: "UK Workflow\nAutomation", sub: "13.4% CAGR", col: GREEN },
  { val: "$3.5B", label: "SME Segment\nGlobally", sub: "34% share", col: AMBER },
  { val: "57.6%", label: "AI in Hospitality\nCAGR", sub: "$0.23B to $1.44B by 2034", col: RED },
];
marketStats.forEach((s, i) => {
  const cx = 0.7 + i * 2.35;
  s6.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.5, w: 2.05, h: 2.2, fill: { color: BG_CARD }, shadow: cardShadow() });
  s6.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.5, w: 2.05, h: 0.04, fill: { color: s.col } });
  s6.addText(s.val, { x: cx, y: 1.7, w: 2.05, h: 0.7, fontSize: 28, fontFace: FONT_DISPLAY, color: s.col, align: "center", bold: true, margin: 0 });
  s6.addText(s.label, { x: cx + 0.1, y: 2.4, w: 1.85, h: 0.5, fontSize: 11, fontFace: FONT_BODY, color: WHITE, align: "center", margin: 0 });
  s6.addText(s.sub, { x: cx + 0.1, y: 2.95, w: 1.85, h: 0.35, fontSize: 10, fontFace: FONT_BODY, color: MUTED, align: "center", italic: true, margin: 0 });
});

// Bottom callout
s6.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.0, w: 8.6, h: 0.8, fill: { color: ACCENT_DIM } });
s6.addText("85% of restaurant leaders expect to deploy AI/automation in 2025", {
  x: 0.7, y: 4.0, w: 8.6, h: 0.8, fontSize: 16, fontFace: FONT_BODY, color: WHITE, align: "center", valign: "middle", bold: true, margin: 0
});

s6.addText("Sources: Business Research Co, MarketsandMarkets, Statista, All About AI (2024-25)", {
  x: 0.7, y: 5.1, w: 8.6, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: DIM, margin: 0
});

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — The Pricing Gap
// ══════════════════════════════════════════════════════════════════════════════
let s7 = pres.addSlide();
s7.background = { color: BG };
s7.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: ACCENT } });
s7.addText("COMPETITOR ANALYSIS", {
  x: 0.7, y: 0.35, w: 8.6, h: 0.4, fontSize: 11, fontFace: FONT_BODY,
  color: ACCENT, charSpacing: 4, margin: 0
});
s7.addText("The Pricing Gap", {
  x: 0.7, y: 0.7, w: 8.6, h: 0.6, fontSize: 30, fontFace: FONT_DISPLAY,
  color: WHITE, margin: 0
});

// Comparison rows
const competitors = [
  { name: "Enterprise Agencies", price: "\u00A35,000\u2013\u00A325,000/project", monthly: "\u00A32,000\u2013\u00A38,000/mo", col: RED, barW: 8.6 },
  { name: "n8n Agencies", price: "\u00A3800/day", monthly: "\u00A35,000+ projects", col: AMBER, barW: 6.5 },
  { name: "Freelancers (Upwork)", price: "\u00A3200\u2013\u00A31,000", monthly: "No support / structure", col: DIM, barW: 3.0 },
  { name: "Zero Clicks", price: "\u00A3499\u2013\u00A31,200", monthly: "\u00A3350/mo retainer", col: ACCENT, barW: 3.8 },
];

competitors.forEach((c, i) => {
  const yPos = 1.5 + i * 0.9;
  // Price bar (width represents relative cost)
  s7.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: yPos, w: c.barW, h: 0.7, fill: { color: BG_CARD } });
  s7.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: yPos, w: c.barW, h: 0.04, fill: { color: c.col } });
  s7.addText(c.name, { x: 0.9, y: yPos + 0.06, w: 3, h: 0.3, fontSize: 13, fontFace: FONT_BODY, color: WHITE, bold: true, margin: 0 });
  s7.addText(c.price + "  |  " + c.monthly, { x: 0.9, y: yPos + 0.36, w: c.barW - 0.4, h: 0.25, fontSize: 11, fontFace: FONT_BODY, color: MUTED, margin: 0 });
});

// The gap callout
s7.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.2, w: 8.6, h: 0.7, fill: { color: ACCENT_DIM } });
s7.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.2, w: 0.04, h: 0.7, fill: { color: ACCENT } });
s7.addText("THE GAP: Nobody serves independent hospitality operators at \u00A3200\u2013\u00A3500/month", {
  x: 0.95, y: 4.2, w: 8.15, h: 0.7, fontSize: 15, fontFace: FONT_BODY, color: WHITE, bold: true, valign: "middle", margin: 0
});

s7.addText("Sources: Goodspeed Studio, HunterBI, Oreate AI, Latenode (2025)", {
  x: 0.7, y: 5.1, w: 8.6, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: DIM, margin: 0
});

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — Where Zero Clicks Fits
// ══════════════════════════════════════════════════════════════════════════════
let s8 = pres.addSlide();
s8.background = { color: BG };
s8.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: ACCENT } });
s8.addText("POSITIONING", {
  x: 0.7, y: 0.35, w: 8.6, h: 0.4, fontSize: 11, fontFace: FONT_BODY,
  color: ACCENT, charSpacing: 4, margin: 0
});
s8.addText("Where Zero Clicks Fits", {
  x: 0.7, y: 0.7, w: 8.6, h: 0.6, fontSize: 30, fontFace: FONT_DISPLAY,
  color: WHITE, margin: 0
});

// 6 positioning cards — 3x2
const posCards = [
  { title: "Target Market", body: "Independent pubs, restaurants,\ncafes (175,000+)", col: ACCENT },
  { title: "Price Sweet Spot", body: "\u00A3200\u2013\u00A3500/month\nAffordable for SME, too small for agencies", col: GREEN },
  { title: "Margin Advantage", body: "70\u201380% solo operator\nvs 20\u201330% agency", col: AMBER },
  { title: "Infrastructure Cost", body: "n8n self-hosted:\n\u00A350\u2013\u00A3130/mo", col: ACCENT },
  { title: "Scalability", body: "Build once, deploy to\nhundreds with minor changes", col: GREEN },
  { title: "Model", body: "Productised service\u2014\nfixed scope, fixed price", col: AMBER },
];
posCards.forEach((c, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const cx = 0.7 + col * 3.05;
  const cy = 1.5 + row * 1.75;
  s8.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 2.75, h: 1.5, fill: { color: BG_CARD }, shadow: cardShadow() });
  s8.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 2.75, h: 0.04, fill: { color: c.col } });
  s8.addText(c.title, { x: cx + 0.15, y: cy + 0.15, w: 2.45, h: 0.35, fontSize: 13, fontFace: FONT_BODY, color: c.col, bold: true, margin: 0 });
  s8.addText(c.body, { x: cx + 0.15, y: cy + 0.55, w: 2.45, h: 0.75, fontSize: 11, fontFace: FONT_BODY, color: MUTED, margin: 0 });
});

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — The Product
// ══════════════════════════════════════════════════════════════════════════════
let s9 = pres.addSlide();
s9.background = { color: BG };
s9.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: ACCENT } });
s9.addText("THE PRODUCT", {
  x: 0.7, y: 0.35, w: 8.6, h: 0.4, fontSize: 11, fontFace: FONT_BODY,
  color: ACCENT, charSpacing: 4, margin: 0
});
s9.addText("What We Build", {
  x: 0.7, y: 0.7, w: 8.6, h: 0.6, fontSize: 30, fontFace: FONT_DISPLAY,
  color: WHITE, margin: 0
});

// 3 product cards
const products = [
  { title: "Email Automation", body: "Auto-route, reply, and categorise\ninbound emails. Never miss a\nlead or deadline.", col: ACCENT },
  { title: "Lead & CRM Workflows", body: "Capture leads from any source,\nenrich them, push to CRM.\nZero manual entry.", col: GREEN },
  { title: "Custom AI Pipelines", body: "Document processing, AI\nclassification, Slack alerts,\nand more.", col: AMBER },
];
products.forEach((p, i) => {
  const cx = 0.7 + i * 3.05;
  s9.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.5, w: 2.75, h: 1.8, fill: { color: BG_CARD }, shadow: cardShadow() });
  s9.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.5, w: 0.04, h: 1.8, fill: { color: p.col } });
  s9.addText(p.title, { x: cx + 0.2, y: 1.6, w: 2.35, h: 0.35, fontSize: 14, fontFace: FONT_BODY, color: WHITE, bold: true, margin: 0 });
  s9.addText(p.body, { x: cx + 0.2, y: 2.0, w: 2.35, h: 1.0, fontSize: 11, fontFace: FONT_BODY, color: MUTED, margin: 0 });
});

// Tech stack + case study
s9.addText("Built on: n8n + Claude AI + Gmail + Sheets + Telegram", {
  x: 0.7, y: 3.55, w: 8.6, h: 0.4, fontSize: 12, fontFace: FONT_BODY, color: MUTED, margin: 0
});

// Case study callout
s9.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.1, w: 8.6, h: 0.85, fill: { color: ACCENT_DIM } });
s9.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.1, w: 0.04, h: 0.85, fill: { color: ACCENT } });
s9.addText("CASE STUDY", { x: 0.95, y: 4.15, w: 2, h: 0.3, fontSize: 10, fontFace: FONT_BODY, color: ACCENT, charSpacing: 3, margin: 0 });
s9.addText("Pub inbox: 90 min/day \u2192 15 min/day  |  Running cost: \u00A38/month  |  Deployed in < 5 min", {
  x: 0.95, y: 4.45, w: 8.15, h: 0.4, fontSize: 13, fontFace: FONT_BODY, color: WHITE, bold: true, margin: 0
});

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — Revenue Model
// ══════════════════════════════════════════════════════════════════════════════
let s10 = pres.addSlide();
s10.background = { color: BG };
s10.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: GREEN } });
s10.addText("REVENUE MODEL", {
  x: 0.7, y: 0.35, w: 8.6, h: 0.4, fontSize: 11, fontFace: FONT_BODY,
  color: GREEN, charSpacing: 4, margin: 0
});
s10.addText("How the Money Works", {
  x: 0.7, y: 0.7, w: 8.6, h: 0.6, fontSize: 30, fontFace: FONT_DISPLAY,
  color: WHITE, margin: 0
});

// 3 pricing cards
const pricing = [
  { name: "Starter", price: "\u00A3499", timeline: "3 days", desc: "Single workflow build", highlight: false },
  { name: "Pro", price: "\u00A31,200", timeline: "7 days", desc: "3 connected workflows\n+ AI classification", highlight: true },
  { name: "Monthly", price: "\u00A3350/mo", timeline: "Ongoing", desc: "2 workflows/month\n+ priority support", highlight: false },
];
pricing.forEach((p, i) => {
  const cx = 0.7 + i * 3.05;
  const borderCol = p.highlight ? ACCENT : "222222";
  s10.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.5, w: 2.75, h: 2.2, fill: { color: BG_CARD }, shadow: cardShadow() });
  s10.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.5, w: 2.75, h: 0.04, fill: { color: borderCol } });
  if (p.highlight) {
    s10.addShape(pres.shapes.RECTANGLE, { x: cx + 0.6, y: 1.38, w: 1.55, h: 0.25, fill: { color: ACCENT } });
    s10.addText("MOST POPULAR", { x: cx + 0.6, y: 1.38, w: 1.55, h: 0.25, fontSize: 8, fontFace: FONT_BODY, color: WHITE, align: "center", valign: "middle", bold: true, margin: 0 });
  }
  s10.addText(p.name, { x: cx, y: 1.65, w: 2.75, h: 0.35, fontSize: 14, fontFace: FONT_BODY, color: MUTED, align: "center", margin: 0 });
  s10.addText(p.price, { x: cx, y: 2.0, w: 2.75, h: 0.6, fontSize: 32, fontFace: FONT_DISPLAY, color: p.highlight ? ACCENT : WHITE, align: "center", bold: true, margin: 0 });
  s10.addText(p.timeline, { x: cx, y: 2.55, w: 2.75, h: 0.3, fontSize: 11, fontFace: FONT_BODY, color: MUTED, align: "center", italic: true, margin: 0 });
  s10.addText(p.desc, { x: cx + 0.2, y: 2.9, w: 2.35, h: 0.6, fontSize: 11, fontFace: FONT_BODY, color: MUTED, align: "center", margin: 0 });
});

// Targets
s10.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.0, w: 4.15, h: 0.7, fill: { color: BG_CARD } });
s10.addText("3 clients in 90 days", { x: 0.8, y: 4.05, w: 3.95, h: 0.3, fontSize: 14, fontFace: FONT_BODY, color: WHITE, bold: true, margin: 0 });
s10.addText("= \u00A33,600+ revenue", { x: 0.8, y: 4.35, w: 3.95, h: 0.25, fontSize: 12, fontFace: FONT_BODY, color: GREEN, margin: 0 });

s10.addShape(pres.shapes.RECTANGLE, { x: 5.15, y: 4.0, w: 4.15, h: 0.7, fill: { color: BG_CARD } });
s10.addText("10 monthly retainers", { x: 5.25, y: 4.05, w: 3.95, h: 0.3, fontSize: 14, fontFace: FONT_BODY, color: WHITE, bold: true, margin: 0 });
s10.addText("= \u00A33,500/mo recurring", { x: 5.25, y: 4.35, w: 3.95, h: 0.25, fontSize: 12, fontFace: FONT_BODY, color: GREEN, margin: 0 });

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — Go-to-Market
// ══════════════════════════════════════════════════════════════════════════════
let s11 = pres.addSlide();
s11.background = { color: BG };
s11.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: ACCENT } });
s11.addText("GO-TO-MARKET", {
  x: 0.7, y: 0.35, w: 8.6, h: 0.4, fontSize: 11, fontFace: FONT_BODY,
  color: ACCENT, charSpacing: 4, margin: 0
});
s11.addText("How We Get Clients", {
  x: 0.7, y: 0.7, w: 8.6, h: 0.6, fontSize: 30, fontFace: FONT_DISPLAY,
  color: WHITE, margin: 0
});

// Funnel steps
const funnel = [
  { step: "01", title: "LinkedIn Content", body: "Post 3-4x/week about automation wins", w: 8.6, col: ACCENT },
  { step: "02", title: "Direct Outreach", body: "DM 5 prospects/week — ask, don't pitch", w: 7.4, col: ACCENT },
  { step: "03", title: "Free Audit Call", body: "30 min — map their bottleneck, show the fix", w: 6.2, col: ACCENT },
  { step: "04", title: "Paid Project", body: "Deliver, document, get testimonial", w: 5.0, col: GREEN },
  { step: "05", title: "Referral Loop", body: "Ask for 1 referral + post case study", w: 3.8, col: GREEN },
];
funnel.forEach((f, i) => {
  const yPos = 1.5 + i * 0.72;
  const cx = (10 - f.w) / 2;
  s11.addShape(pres.shapes.RECTANGLE, { x: cx, y: yPos, w: f.w, h: 0.58, fill: { color: BG_CARD } });
  s11.addShape(pres.shapes.RECTANGLE, { x: cx, y: yPos, w: 0.04, h: 0.58, fill: { color: f.col } });
  s11.addText(f.step, { x: cx + 0.15, y: yPos + 0.05, w: 0.5, h: 0.48, fontSize: 18, fontFace: FONT_DISPLAY, color: f.col, valign: "middle", margin: 0 });
  s11.addText(f.title, { x: cx + 0.7, y: yPos + 0.05, w: 2.5, h: 0.48, fontSize: 14, fontFace: FONT_BODY, color: WHITE, bold: true, valign: "middle", margin: 0 });
  s11.addText(f.body, { x: cx + 3.3, y: yPos + 0.05, w: f.w - 3.6, h: 0.48, fontSize: 11, fontFace: FONT_BODY, color: MUTED, valign: "middle", margin: 0 });
});

s11.addText("Total time: 5-6 hrs/week alongside MBA", {
  x: 0.7, y: 5.0, w: 8.6, h: 0.35, fontSize: 12, fontFace: FONT_BODY, color: DIM, align: "center", italic: true, margin: 0
});

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — Summary
// ══════════════════════════════════════════════════════════════════════════════
let s12 = pres.addSlide();
s12.background = { color: BG };
s12.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: ACCENT } });
s12.addShape(pres.shapes.OVAL, { x: 2.5, y: 0.8, w: 5, h: 4, fill: { color: ACCENT, transparency: 95 } });

s12.addText("THE OPPORTUNITY", {
  x: 0.7, y: 0.5, w: 8.6, h: 0.4, fontSize: 11, fontFace: FONT_BODY,
  color: ACCENT, charSpacing: 4, align: "center", margin: 0
});

const summaryLines = [
  { text: "175,000+ hospitality SMEs drowning in manual admin", col: WHITE },
  { text: "Only 12% use AI \u2014 massive greenfield opportunity", col: ACCENT },
  { text: "Agencies charge \u00A35K+ \u2014 out of reach for independents", col: RED },
  { text: "Zero Clicks fills the gap: affordable, specific, AI-powered", col: GREEN },
  { text: "First-mover advantage in a niche vertical", col: AMBER },
];
summaryLines.forEach((line, i) => {
  const yPos = 1.3 + i * 0.6;
  s12.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: yPos, w: 0.04, h: 0.4, fill: { color: line.col } });
  s12.addText(line.text, { x: 1.75, y: yPos, w: 7, h: 0.4, fontSize: 16, fontFace: FONT_BODY, color: WHITE, valign: "middle", margin: 0 });
});

s12.addShape(pres.shapes.RECTANGLE, { x: 2.5, y: 4.3, w: 5, h: 0.02, fill: { color: DIM } });
s12.addText("One workflow at a time.", {
  x: 0.7, y: 4.5, w: 8.6, h: 0.6, fontSize: 24, fontFace: FONT_DISPLAY,
  color: ACCENT, align: "center", italic: true, margin: 0
});
s12.addText("zeroclicks.vercel.app", {
  x: 0.7, y: 5.1, w: 8.6, h: 0.3, fontSize: 11, fontFace: FONT_BODY, color: DIM, align: "center", margin: 0
});

// ── Save ──
pres.writeFile({ fileName: "/Users/venky/zero-clicks/Zero_Clicks_Market_Opportunity.pptx" })
  .then(() => console.log("Presentation saved!"))
  .catch(err => console.error("Error:", err));
