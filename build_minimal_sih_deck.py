import os
import win32com.client
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

OUTPUT_PPTX = r'C:\Users\anand\.gemini\antigravity\scratch\sih-artisan-app\SIH2026_Idea_Presentation_SOUL.pptx'
OUTPUT_PDF = r'C:\Users\anand\.gemini\antigravity\scratch\sih-artisan-app\SIH2026_Idea_Presentation_SOUL.pdf'
DESKTOP_PDF = os.path.expanduser(r'~\OneDrive\Desktop\SIH2026_Idea_Presentation_SOUL.pdf')
DESKTOP_PPTX = os.path.expanduser(r'~\OneDrive\Desktop\SIH2026_Idea_Presentation_SOUL.pptx')

# Assets
LOGO_SIH = r'C:\Users\anand\.gemini\antigravity\scratch\sih-artisan-app\Picture_1.png'
BULB_ART = r'C:\Users\anand\.gemini\antigravity\scratch\sih-artisan-app\sih_bulb_art.png'
STAGES_IMG = r'C:\Users\anand\.gemini\antigravity\scratch\sih-artisan-app\stages_infographic.png'
IMPACT_CHART = r'C:\Users\anand\.gemini\antigravity\scratch\sih-artisan-app\impact_chart.png'
TAB1_IMG = r'C:\Users\anand\.gemini\antigravity\scratch\sih-artisan-app\mockup_tab1.png'
TAB2_IMG = r'C:\Users\anand\.gemini\antigravity\scratch\sih-artisan-app\mockup_tab2.png'
TAB3_IMG = r'C:\Users\anand\.gemini\antigravity\scratch\sih-artisan-app\mockup_tab3.png'
SLIDE6_CHART = r'C:\Users\anand\.gemini\antigravity\scratch\sih-artisan-app\slide6_chart.png'
SLIDE6_ANALYTICS = r'C:\Users\anand\.gemini\antigravity\scratch\sih-artisan-app\slide6_analytics.png'

# Color Palette (Matching the Model Reference Presentation Exactly)
COLOR_WHITE = RGBColor(255, 255, 255)
COLOR_BG_LIGHT = RGBColor(255, 255, 255)
COLOR_NAVY_HEADING = RGBColor(29, 53, 87)       # #1D3557 Classic SIH Dark Blue / Navy
COLOR_PURPLE_PRIMARY = RGBColor(126, 34, 206)   # #7E22CE Rich Berry Purple
COLOR_PURPLE_DARK = RGBColor(59, 7, 100)        # #3B0764 Deep Plum / Midnight Purple
COLOR_PURPLE_PILL = RGBColor(168, 85, 247)      # #A855F7 Pill Badge
COLOR_PURPLE_TINT = RGBColor(245, 238, 253)     # #F5EEFD Soft Lavender Tint Card
COLOR_PURPLE_BORDER = RGBColor(216, 180, 226)   # #D8B4E2 Delicate Purple Border

COLOR_SLATE_DARK = RGBColor(15, 23, 42)         # #0F172A Primary text
COLOR_SLATE_BODY = RGBColor(51, 65, 85)         # #334155 Secondary body
COLOR_SLATE_MUTED = RGBColor(100, 116, 139)     # #64748B Subdued
COLOR_CARD_BORDER = RGBColor(226, 232, 240)     # #E2E8F0 Clean Card Border
COLOR_HEX_BG = RGBColor(241, 245, 249)          # #F1F5F9 Light Hexagon Graphic Background

def set_slide_background(slide, color=COLOR_BG_LIGHT):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = color
    bg.line.fill.background()
    slide.shapes._spTree.remove(bg._element)
    slide.shapes._spTree.insert(2, bg._element)
    return bg

def add_clean_card(slide, left, top, width, height, bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER, border_width_pt=1):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(border_width_pt)
    else:
        card.line.fill.background()
    card.text_frame.word_wrap = True
    card.text_frame.vertical_anchor = MSO_ANCHOR.TOP
    card.text_frame.paragraphs[0].alignment = PP_ALIGN.LEFT
    return card

def add_header(slide, title, subtitle=None):
    # Oval Pill on Top-Left (Matching Reference "BYTE BRAWLERS")
    pill = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.8), Inches(0.35), Inches(1.8), Inches(0.95))
    pill.fill.solid()
    pill.fill.fore_color.rgb = COLOR_PURPLE_PILL
    pill.line.fill.background()
    tf_p = pill.text_frame
    tf_p.word_wrap = True
    tf_p.vertical_anchor = MSO_ANCHOR.MIDDLE
    
    p1 = tf_p.paragraphs[0]
    p1.text = "SOUL"
    p1.alignment = PP_ALIGN.CENTER
    p1.font.bold = True
    p1.font.size = Pt(13)
    p1.font.name = "Georgia"
    p1.font.color.rgb = COLOR_WHITE
    
    p2 = tf_p.add_paragraph()
    p2.text = "SIH-S-B1-063"
    p2.alignment = PP_ALIGN.CENTER
    p2.font.bold = True
    p2.font.size = Pt(8.5)
    p2.font.name = "Arial"
    p2.font.color.rgb = COLOR_WHITE

    # Official SIH Logo on Top-Right
    if os.path.exists(LOGO_SIH):
        slide.shapes.add_picture(LOGO_SIH, Inches(10.8), Inches(0.32), width=Inches(1.8))

    # Centered Title (Classic Serif Font - Georgia / Times)
    tb = slide.shapes.add_textbox(Inches(2.7), Inches(0.4), Inches(7.9), Inches(1.1))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_top = Inches(0)
    
    p_title = tf.paragraphs[0]
    p_title.text = title
    p_title.alignment = PP_ALIGN.CENTER
    p_title.font.bold = True
    p_title.font.size = Pt(24)
    p_title.font.name = "Georgia"
    p_title.font.color.rgb = COLOR_SLATE_DARK
    
    if subtitle:
        p_sub = tf.add_paragraph()
        p_sub.text = subtitle
        p_sub.alignment = PP_ALIGN.CENTER
        p_sub.font.bold = True
        p_sub.font.size = Pt(13.5)
        p_sub.font.name = "Arial"
        p_sub.font.color.rgb = COLOR_PURPLE_PRIMARY
        p_sub.space_before = Pt(3)

def build_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # =========================================================================
    # SLIDE 1: TITLE SLIDE (Clean White + Bullet List + Large Bulb Art)
    # Exact replica of Page 1 from reference
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, COLOR_WHITE)

    # Top Header: SMART INDIA HACKATHON 2026 (Classic Serif)
    tb_h = s1.shapes.add_textbox(Inches(0.9), Inches(0.7), Inches(9.5), Inches(1.0))
    tf_h = tb_h.text_frame
    tf_h.word_wrap = True
    p_h = tf_h.paragraphs[0]
    p_h.text = "SMART INDIA HACKATHON 2026"
    p_h.font.bold = True
    p_h.font.size = Pt(32)
    p_h.font.name = "Georgia"
    p_h.font.color.rgb = COLOR_NAVY_HEADING

    # Top Right Official SIH Logo
    if os.path.exists(LOGO_SIH):
        s1.shapes.add_picture(LOGO_SIH, Inches(10.5), Inches(0.35), width=Inches(2.1))

    # Left Column: Structured Bullet Points (Exact match to reference layout)
    tb_b = s1.shapes.add_textbox(Inches(0.9), Inches(1.8), Inches(6.8), Inches(5.2))
    tf_b = tb_b.text_frame
    tf_b.word_wrap = True
    tf_b.margin_left = Inches(0)
    tf_b.margin_top = Inches(0)

    bullets_s1 = [
        ("Problem Statement ID –", "SIH26090"),
        ("Problem Statement Title-", "AI-Driven Market Linkage and Smart Cataloging Mobile Application for Marginalized Artisans"),
        ("Theme-", "Heritage & Culture"),
        ("PS Category-", "Software"),
        ("Team ID-", "SIH-S-B1-063"),
        ("Team Name-", "SOUL"),
        ("Team Leader-", "Dhruv"),
        ("Team Members-", "Vanshika, Angel, Shreya, Shravani, Kartik")
    ]

    for i, (label, val) in enumerate(bullets_s1):
        p = tf_b.paragraphs[0] if i == 0 else tf_b.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        if i > 0:
            p.space_before = Pt(8)
        r_b = p.add_run()
        r_b.text = "• " + label + " "
        r_b.font.bold = True
        r_b.font.size = Pt(13)
        r_b.font.name = "Arial"
        r_b.font.color.rgb = COLOR_SLATE_DARK

        r_v = p.add_run()
        r_v.text = val
        r_v.font.bold = (label in ["Team ID-", "Team Name-", "Team Leader-"])
        r_v.font.size = Pt(13)
        r_v.font.name = "Arial"
        r_v.font.color.rgb = COLOR_SLATE_DARK

    # Right Column: Large SIH Bulb Art inside a subtle hexagon frame
    hex_bg = s1.shapes.add_shape(MSO_SHAPE.HEXAGON, Inches(8.0), Inches(1.2), Inches(4.7), Inches(5.6))
    hex_bg.fill.solid()
    hex_bg.fill.fore_color.rgb = COLOR_HEX_BG
    hex_bg.line.fill.background()

    if os.path.exists(BULB_ART):
        s1.shapes.add_picture(BULB_ART, Inches(8.35), Inches(1.5), width=Inches(4.0))

    # =========================================================================
    # SLIDE 2: PROPOSED SOLUTION (6-Stage Circular Ripple Infographic)
    # Exact replica of Page 2 from reference
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, COLOR_WHITE)
    add_header(s2, "AI-DRIVEN MARKET LINKAGE & CATALOGING")

    # Center 6-Stage Ripple Graphic
    if os.path.exists(STAGES_IMG):
        s2.shapes.add_picture(STAGES_IMG, Inches(0.8), Inches(2.9), width=Inches(11.7))

    # Alternating Stages (Top: 2, 4, 6 | Bottom: 1, 3, 5)
    stages_top = [
        (2, "Stage 2", "Multimodal Gemini Structuring", "Extracts title, specs, materials & dimensions via strict JSON schema.", Inches(2.7)),
        (4, "Stage 4", "Dynamic Fair-Share Pricing", "Artisan dictates asking price; algorithmic 95% direct payout lock.", Inches(6.7)),
        (6, "Stage 6", "Continuous Scaling & Welfare", "Direct PM Vishwakarma linkage, ONDC Beckn network synchronization.", Inches(10.6))
    ]
    for num, stg_lbl, title, desc, left_pos in stages_top:
        tb = s2.shapes.add_textbox(left_pos - Inches(1.2), Inches(1.4), Inches(2.4), Inches(1.35))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0)
        p = tf.paragraphs[0]
        p.text = stg_lbl
        p.alignment = PP_ALIGN.CENTER
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.name = "Arial"
        p.font.color.rgb = COLOR_SLATE_DARK

        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.alignment = PP_ALIGN.CENTER
        p_t.font.bold = True
        p_t.font.size = Pt(9.5)
        p_t.font.name = "Arial"
        p_t.font.color.rgb = COLOR_PURPLE_PRIMARY

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.alignment = PP_ALIGN.CENTER
        p_d.font.size = Pt(8.5)
        p_d.font.name = "Arial"
        p_d.font.color.rgb = COLOR_SLATE_MUTED

    stages_bot = [
        (1, "Stage 1", "Cohort Ingestion & Onboarding", "Zero-literacy Hindi & English voice recording via Web Speech API.", Inches(0.8)),
        (3, "Stage 3", "GI Authenticity & Provenance", "Cluster verification, provenance hash & scannable physical QR.", Inches(4.7)),
        (5, "Stage 5", "Direct Consumer Linkage", "Disintermediates multi-tiered middlemen, routing 95% value directly.", Inches(8.7))
    ]
    for num, stg_lbl, title, desc, left_pos in stages_bot:
        tb = s2.shapes.add_textbox(left_pos - Inches(0.1), Inches(5.35), Inches(2.4), Inches(1.35))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0)
        p = tf.paragraphs[0]
        p.text = stg_lbl
        p.alignment = PP_ALIGN.CENTER
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.name = "Arial"
        p.font.color.rgb = COLOR_SLATE_DARK

        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.alignment = PP_ALIGN.CENTER
        p_t.font.bold = True
        p_t.font.size = Pt(9.5)
        p_t.font.name = "Arial"
        p_t.font.color.rgb = COLOR_PURPLE_PRIMARY

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.alignment = PP_ALIGN.CENTER
        p_d.font.size = Pt(8.5)
        p_d.font.name = "Arial"
        p_d.font.color.rgb = COLOR_SLATE_MUTED

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH (3 Browser Mockups + 3 Rounded Cards)
    # Exact replica of Page 3 from reference
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, COLOR_WHITE)
    add_header(s3, "TECHNICAL APPROACH", "CONNECTING THE ARTISAN NETWORK!!")

    # Link on top right
    tb_link = s3.shapes.add_textbox(Inches(9.2), Inches(1.28), Inches(3.4), Inches(0.35))
    p_l = tb_link.text_frame.paragraphs[0]
    p_l.text = "https://kaarvi.gov.in"
    p_l.alignment = PP_ALIGN.RIGHT
    p_l.font.size = Pt(10.5)
    p_l.font.name = "Arial"
    p_l.font.color.rgb = COLOR_PURPLE_PRIMARY

    col_data = [
        (TAB1_IMG, "Registration & Cataloging:", "Registers traditional craftspersons via zero-friction vernacular voice. AI structures specifications, dimensions, and materials in <2s, eliminating digital literacy barriers."),
        (TAB2_IMG, "Monitoring & Fair Share:", "Tracks real-time sales, order settlements, and delivery milestones. Enforces transparent 95% direct artisan payout while removing 60-80% exploitative middleman commission tiers."),
        (TAB3_IMG, "Marketplace & GI Trust:", "Enables conscious buyers to discover authentic heritage crafts directly from verified maker clusters, backed by scannable QR certificates of Geographical Indication authenticity.")
    ]
    c_w = 3.7
    c_gap = 0.35
    for i, (img_path, bold_lbl, desc_text) in enumerate(col_data):
        c_left = 0.8 + i * (c_w + c_gap)
        # Top: Browser mockup image
        if os.path.exists(img_path):
            s3.shapes.add_picture(img_path, Inches(c_left), Inches(1.75), width=Inches(c_w))
        
        # Bottom: Rounded text card (White with purple border)
        card = add_clean_card(s3, c_left, 4.45, c_w, 2.5, bg_color=COLOR_WHITE, border_color=COLOR_SLATE_DARK, border_width_pt=1.5)
        tf_c = card.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = Inches(0.22)
        tf_c.margin_right = Inches(0.22)
        tf_c.margin_top = Inches(0.2)
        
        p = tf_c.paragraphs[0]
        r1 = p.add_run(); r1.text = bold_lbl + " "; r1.font.bold = True; r1.font.size = Pt(10); r1.font.name = "Arial"; r1.font.color.rgb = COLOR_SLATE_DARK
        r2 = p.add_run(); r2.text = desc_text; r2.font.size = Pt(9.5); r2.font.name = "Arial"; r2.font.color.rgb = COLOR_SLATE_BODY

    # =========================================================================
    # SLIDE 4: IMPACT AND BENEFITS (8 Colored Cards + Grouped Bar Chart)
    # Exact replica of Page 4 from reference
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, COLOR_WHITE)
    add_header(s4, "IMPACT AND BENEFITS")

    # Left Side: 8 Colored Cards (4 rows x 2 columns)
    cards_data = [
        # Col 1
        ("Data-Driven Curriculum Alignment:", "Connects traditional craft cataloging directly to real-time national market needs.", 0.8, 1.7),
        ("Proactive Gap Resolution:", "Fixes pricing and digital discovery deficits during onboarding, not post-sale.", 0.8, 2.95),
        ("CLOSED-LOOP SYSTEM INTEGRATION:", "Uses consumer buying signals and reviews to refine artisan catalog suggestions continuously.", 0.8, 4.2),
        ("Elevated Institutional Credibility:", "Builds trust through verifiable Geographical Indication (GI) provenance and physical QR seals.", 0.8, 5.45),
        # Col 2
        ("Accelerated Artisan Market Placement:", "Rural craftspeople secure direct national buyer orders significantly faster.", 3.7, 1.7),
        ("Reduced Intermediary Leakage:", "Eliminates multi-tiered middlemen, returning 95% of retail price directly to the maker.", 3.7, 2.95),
        ("Agile Catalog Optimization:", "Artisans instantly refresh product listings using natural Hindi and regional dialects.", 3.7, 4.2),
        ("Enhanced Dignity & Direct Visibility:", "Artisan Story pages build emotional human-to-human connection between buyer and maker.", 3.7, 5.45),
    ]

    for title, desc, left_pos, top_pos in cards_data:
        # Subtle tint card (solid lavender/violet background matching reference)
        c = add_clean_card(s4, left_pos, top_pos, 2.65, 1.08, bg_color=RGBColor(243, 232, 255), border_color=None)
        tf_c = c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = Inches(0.12)
        tf_c.margin_right = Inches(0.12)
        tf_c.margin_top = Inches(0.1)

        p = tf_c.paragraphs[0]
        p.text = title
        p.alignment = PP_ALIGN.CENTER
        p.font.bold = True
        p.font.size = Pt(8.5)
        p.font.name = "Arial"
        p.font.color.rgb = COLOR_PURPLE_DARK

        p_d = tf_c.add_paragraph()
        p_d.text = desc
        p_d.alignment = PP_ALIGN.CENTER
        p_d.font.size = Pt(7.8)
        p_d.font.name = "Arial"
        p_d.font.color.rgb = COLOR_SLATE_DARK
        p_d.space_before = Pt(2)

    # Right Side: Comparison Bar Chart (Without Kaarvi vs With Kaarvi)
    # Adding vertical divider line
    div_line = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.6), Inches(1.7), Inches(0.02), Inches(5.1))
    div_line.fill.solid()
    div_line.fill.fore_color.rgb = COLOR_PURPLE_PRIMARY
    div_line.line.fill.background()

    if os.path.exists(IMPACT_CHART):
        s4.shapes.add_picture(IMPACT_CHART, Inches(6.8), Inches(1.7), width=Inches(5.8))

    # =========================================================================
    # SLIDE 5: FEASIBILITY AND VIABILITY (Clean Cards + Icons + Risk Pairs)
    # Exact replica of Page 5 from reference
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, COLOR_WHITE)
    add_header(s5, "FEASIBILITY AND VIABILITY")

    # Left Column: FEASIBILITY
    tb_feas = s5.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(5.5), Inches(0.4))
    p = tb_feas.text_frame.paragraphs[0]
    p.text = "FEASIBILITY"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.name = "Georgia"
    p.font.color.rgb = COLOR_NAVY_HEADING

    feas_cards = [
        ("Technical", "Built on proven components — Web Speech API, Google Gemini 3.7 Flash structured JSON schema, Firebase NoSQL Firestore, and VitePWA. No unproven tech required.", "⚙️"),
        ("Operational", "Rollout starts as recognized craft cluster pilots (Kondapalli, Bastar, Channapatna). Onboards artisans through existing Common Service Centres (CSCs) and Self-Help Groups (SHGs).", "👥"),
        ("Economic", "Ultra-low unit economics (< ₹0.02 per cataloging event). Zero-cost on-device speech transcription, serverless cloud scale, offset by direct artisan transaction volume.", "₹")
    ]
    for i, (title, desc, icon_sym) in enumerate(feas_cards):
        top_pos = 2.1 + i * 1.55
        card = add_clean_card(s5, 0.8, top_pos, 5.5, 1.38, bg_color=RGBColor(248, 250, 252), border_color=COLOR_CARD_BORDER)

        # Icon box on left
        ic_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.95), Inches(top_pos + 0.35), Inches(0.55), Inches(0.55))
        ic_box.fill.solid()
        ic_box.fill.fore_color.rgb = COLOR_WHITE
        ic_box.line.color.rgb = COLOR_PURPLE_PRIMARY
        ic_box.line.width = Pt(1.5)
        p_ic = ic_box.text_frame.paragraphs[0]
        p_ic.text = icon_sym
        p_ic.alignment = PP_ALIGN.CENTER
        p_ic.font.size = Pt(14)
        p_ic.font.name = "Segoe UI Symbol"
        p_ic.font.bold = True
        p_ic.font.color.rgb = COLOR_PURPLE_PRIMARY

        # Dedicated text box for title and description
        tb_c = s5.shapes.add_textbox(Inches(1.65), Inches(top_pos + 0.16), Inches(4.5), Inches(1.1))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = 0
        tf_c.margin_right = 0
        tf_c.margin_top = 0
        tf_c.margin_bottom = 0

        p = tf_c.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(11.5)
        p.font.name = "Segoe UI"
        p.font.color.rgb = COLOR_SLATE_DARK

        p_d = tf_c.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(8.8)
        p_d.font.name = "Arial"
        p_d.font.color.rgb = COLOR_SLATE_BODY
        p_d.space_before = Pt(3)

    # Right Column: VIABILITY — RISKS & MITIGATION
    tb_viab = s5.shapes.add_textbox(Inches(6.8), Inches(1.6), Inches(5.8), Inches(0.4))
    p = tb_viab.text_frame.paragraphs[0]
    p.text = "VIABILITY  —  RISKS & MITIGATION"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.name = "Georgia"
    p.font.color.rgb = COLOR_NAVY_HEADING

    risks = [
        ("Rural connectivity deficits in remote craft clusters", "Built-in offline-first PWA caching; queues listings locally with temporary IDs until reconnection."),
        ("Non-standardized vernacular accents across 700+ dialects", "Web Speech client capture combined with Gemini 3.7 Flash contextual phoneme correction."),
        ("Elderly master craftspersons hesitant toward digital apps", "Zero-typing voice interface, large visual tap targets, plus conversational WhatsApp audio bot."),
        ("Counterfeit factory goods attempting fraudulent GI claims", "Cluster artisan registry validation paired with tamper-evident physical QR provenance seals.")
    ]
    for i, (risk_txt, mit_txt) in enumerate(risks):
        top_pos = 2.1 + i * 1.18
        card = add_clean_card(s5, 6.8, top_pos, 5.8, 1.05, bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER)
        tf_c = card.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = Inches(0.2)
        tf_c.margin_right = Inches(0.2)
        tf_c.margin_top = Inches(0.12)

        # Risk line with Warning icon
        p = tf_c.paragraphs[0]
        r1 = p.add_run(); r1.text = "⚠️  "; r1.font.size = Pt(10)
        r2 = p.add_run(); r2.text = risk_txt; r2.font.bold = True; r2.font.size = Pt(9.5); r2.font.color.rgb = COLOR_SLATE_DARK

        # Mitigation line with Check icon
        p_m = tf_c.add_paragraph()
        p_m.space_before = Pt(3)
        r3 = p_m.add_run(); r3.text = "✅  "; r3.font.size = Pt(10)
        r4 = p_m.add_run(); r4.text = mit_txt; r4.font.size = Pt(8.8); r4.font.color.rgb = COLOR_SLATE_BODY

    # =========================================================================
    # SLIDE 6: RESEARCH AND REFERENCES (Links + Vision Box + Analytics Preview)
    # Exact replica of Page 6 from reference
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, COLOR_WHITE)
    add_header(s6, "RESEARCH AND REFERENCES")

    # Stamp / Subtitle: VISION BOARD
    tb_vb = s6.shapes.add_textbox(Inches(6.8), Inches(1.35), Inches(3.0), Inches(0.4))
    p_vb = tb_vb.text_frame.paragraphs[0]
    p_vb.text = "VISION BOARD~"
    p_vb.font.bold = True
    p_vb.font.size = Pt(16)
    p_vb.font.name = "Georgia"
    p_vb.font.color.rgb = RGBColor(234, 88, 12) # Warm Orange / Terracotta stamp

    # Left Column: Links and Source Studies
    # 3 Link Pills with icons
    links_data = [
        ("https://texmin.nic.in", "Ministry of Textiles, GoI (Annual Report 2022-23) — Verified 60–80% middleman margin leakage.", "📊"),
        ("https://pmvishwakarma.gov.in", "PM Vishwakarma Scheme (MSME) — Verification, modern toolkit grants & ₹3L credit.", "🏛️"),
        ("https://ipindia.gov.in", "Geographical Indications of Goods Act, 1999 — Statutory craft authenticity framework.", "⚖️")
    ]
    for i, (url, desc, sym) in enumerate(links_data):
        top_pos = 1.5 + i * 0.78
        card = add_clean_card(s6, 0.8, top_pos, 5.5, 0.68, bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER)
        tf_c = card.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = Inches(0.15)
        tf_c.margin_top = Inches(0.08)

        p = tf_c.paragraphs[0]
        r1 = p.add_run(); r1.text = sym + "  " + url; r1.font.bold = True; r1.font.size = Pt(9.5); r1.font.color.rgb = COLOR_PURPLE_PRIMARY
        
        p_d = tf_c.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(8.2)
        p_d.font.color.rgb = COLOR_SLATE_BODY
        p_d.space_before = Pt(1)

    # Mini Sectoral Study Chart on bottom left
    if os.path.exists(SLIDE6_CHART):
        s6.shapes.add_picture(SLIDE6_CHART, Inches(0.8), Inches(4.15), width=Inches(5.0))

    # Right Column: Vision Quote Bubble with rounded border + hand-drawn arrow
    # Quote Card
    quote_card = add_clean_card(s6, 7.8, 1.85, 4.8, 1.5, bg_color=RGBColor(245, 238, 253), border_color=COLOR_SLATE_DARK, border_width_pt=2)
    tf_q = quote_card.text_frame
    tf_q.word_wrap = True
    tf_q.margin_left = Inches(0.25)
    tf_q.margin_right = Inches(0.25)
    tf_q.margin_top = Inches(0.18)

    p_q = tf_q.paragraphs[0]
    p_q.text = "\"This AI-driven platform leverages Web Speech recognition and Google Gemini 3.7 Flash structured intelligence to evaluate regional craft disparities in real time, restoring fair pricing, economic dignity, and verifiable authenticity to India's marginalized artisans.\""
    p_q.font.size = Pt(9.2)
    p_q.font.name = "Arial"
    p_q.font.color.rgb = COLOR_SLATE_DARK

    # Arrow shape pointing from quote to prototype
    arrow = s6.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, Inches(7.1), Inches(2.2), Inches(0.45), Inches(1.1))
    arrow.fill.solid()
    arrow.fill.fore_color.rgb = COLOR_SLATE_DARK
    arrow.line.fill.background()
    arrow.rotation = 20

    # Analytics / Prototype Preview on bottom right
    if os.path.exists(SLIDE6_ANALYTICS):
        s6.shapes.add_picture(SLIDE6_ANALYTICS, Inches(6.8), Inches(3.65), width=Inches(5.8))

    # Save presentation
    prs.save(OUTPUT_PPTX)
    print(f"Refined SIH presentation saved: {OUTPUT_PPTX}")

    # Export to PDF via PowerPoint COM
    powerpoint = win32com.client.Dispatch('PowerPoint.Application')
    deck = powerpoint.Presentations.Open(os.path.abspath(OUTPUT_PPTX), WithWindow=False)
    deck.SaveAs(os.path.abspath(OUTPUT_PDF), 32)
    
    # Export slide images for QA inspection
    for i in range(len(deck.Slides)):
        img_out = os.path.abspath(f'slide_{i+1}_qa.png')
        deck.Slides[i].Export(img_out, 'PNG', 1920, 1080)
        
    deck.Close()
    powerpoint.Quit()
    print(f"PDF exported successfully to: {OUTPUT_PDF}")

    # Copy to Desktop
    desktop_dir = r'C:\Users\anand\OneDrive\Desktop'
    if os.path.exists(desktop_dir):
        import shutil
        def safe_copy(src, dst_base_name):
            target = os.path.join(desktop_dir, dst_base_name)
            try:
                shutil.copyfile(src, target)
                print(f"Copied to Desktop: {target}")
                return target
            except Exception:
                name, ext = os.path.splitext(dst_base_name)
                for ver in range(2, 20):
                    fallback = os.path.join(desktop_dir, f"{name}_v{ver}{ext}")
                    try:
                        shutil.copyfile(src, fallback)
                        print(f"Notice: {target} was locked, saved to {fallback}")
                        return fallback
                    except Exception:
                        continue
            return None

        safe_copy(OUTPUT_PDF, 'SIH2026_Idea_Presentation_SOUL.pdf')
        safe_copy(OUTPUT_PPTX, 'SIH2026_Idea_Presentation_SOUL.pptx')

if __name__ == '__main__':
    build_deck()
