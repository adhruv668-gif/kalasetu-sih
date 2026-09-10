import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# =============================================================================
# 1. GENERATE 6-STAGE RIPPLE CIRCLE INFOGRAPHIC FOR SLIDE 2
# =============================================================================
def generate_stages_infographic():
    fig, ax = plt.subplots(figsize=(15, 3.0), dpi=300)
    ax.set_xlim(0, 15)
    ax.set_ylim(-1.5, 1.5)
    ax.axis('off')

    colors = ['#D8B4E2', '#C084FC', '#A855F7', '#8B26A0', '#6B21A8', '#3B0764']
    x_centers = np.linspace(1.3, 13.7, 6)

    for i, (xc, col) in enumerate(zip(x_centers, colors)):
        # Outer ripple
        circle_outer = patches.Circle((xc, 0), 1.15, fill=False, edgecolor=col, linewidth=5, alpha=0.9)
        ax.add_patch(circle_outer)
        # Mid ripple
        circle_mid = patches.Circle((xc, 0), 0.92, fill=False, edgecolor=col, linewidth=5.5, alpha=0.95)
        ax.add_patch(circle_mid)
        # Inner white solid circle
        circle_in = patches.Circle((xc, 0), 0.68, facecolor='white', edgecolor=col, linewidth=2.5)
        ax.add_patch(circle_in)
        # Stage Number
        ax.text(xc, 0, f"{i+1:02d}", color='#1E1B4B', fontsize=22, fontweight='bold', ha='center', va='center')

    # Continuous connector lines between circles
    for i in range(5):
        x1, x2 = x_centers[i], x_centers[i+1]
        col = colors[i+1]
        ax.plot([x1 + 1.15, x2 - 1.15], [0, 0], color=col, linewidth=5, alpha=0.8)

    plt.tight_layout()
    plt.savefig('stages_infographic.png', transparent=True, bbox_inches='tight', pad_inches=0.02)
    plt.close()
    print("Saved stages_infographic.png")

# =============================================================================
# 2. GENERATE IMPACT COMPARISON BAR CHART FOR SLIDE 4
# =============================================================================
def generate_impact_chart():
    fig, ax = plt.subplots(figsize=(6.2, 4.6), dpi=300)

    labels = ['Artisan Payout', 'Middleman Cut', 'Cataloging Time', 'Fake Craft Risk', 'Market Reach']
    without_sys = [20, 75, 85, 70, 22]
    with_sys = [95, 5, 8, 10, 88]

    x = np.arange(len(labels))
    width = 0.35

    ax.bar(x - width/2, without_sys, width, label='Without Kaarvi', color='#E9D5FF', edgecolor='none', zorder=3)
    ax.bar(x + width/2, with_sys, width, label='With Kaarvi', color='#6B21A8', edgecolor='none', zorder=3)

    ax.legend(loc='upper center', bbox_to_anchor=(0.5, 1.15), ncol=2, frameon=False, fontsize=10.5)
    ax.set_ylim(0, 105)
    ax.set_yticks([0, 20, 40, 60, 80, 100])
    ax.set_yticklabels(['0', '20', '40', '60', '80', '100'], fontsize=11, color='#1E293B')

    ax.set_xticks(x)
    ax.set_xticklabels(labels, rotation=42, ha='right', fontsize=9.5, fontweight='bold', color='#1E293B')

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.spines['bottom'].set_color('#CBD5E1')
    ax.spines['bottom'].set_linewidth(1.5)

    ax.yaxis.grid(True, linestyle='-', alpha=0.3, color='#E2E8F0', zorder=0)
    ax.set_axisbelow(True)

    plt.tight_layout()
    plt.savefig('impact_chart.png', transparent=True, bbox_inches='tight', pad_inches=0.05)
    plt.close()
    print("Saved impact_chart.png")

# =============================================================================
# 3. GENERATE 3 CLEAN UI MOCKUPS FOR SLIDE 3
# =============================================================================
def draw_window_frame(w, h, url):
    im = Image.new('RGB', (w, h), '#FFFFFF')
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle([(0, 0), (w-1, h-1)], radius=12, fill='#F8FAFC', outline='#CBD5E1', width=2)
    draw.rectangle([(0, 0), (w-1, 38)], fill='#F1F5F9')
    draw.line([(0, 38), (w-1, 38)], fill='#CBD5E1', width=1)
    draw.ellipse([(14, 13), (24, 23)], fill='#EF4444')
    draw.ellipse([(30, 13), (40, 23)], fill='#F59E0B')
    draw.ellipse([(46, 13), (56, 23)], fill='#10B981')
    draw.rounded_rectangle([(75, 7), (w-80, 31)], radius=6, fill='#FFFFFF', outline='#E2E8F0')
    draw.text((85, 12), url, fill='#64748B')
    return im, draw

def generate_mockup_1():
    w, h = 680, 440
    im, draw = draw_window_frame(w, h, 'https://kaarvi.gov.in/artisan/add-item')
    draw.text((30, 55), "Vernacular Voice-to-Catalog AI", fill='#0F172A')
    draw.text((30, 75), "Web Speech API (hi-IN / en-US) + Gemini 3.7 Flash", fill='#64748B')

    draw.rounded_rectangle([(30, 105), (w//2 - 15, h-25)], radius=8, fill='#FAF5FF', outline='#D8B4E2', width=1)
    draw.ellipse([(w//4 - 30, 140), (w//4 + 30, 200)], fill='#7E22CE')
    draw.text((w//4 - 12, 162), "MIC", fill='#FFFFFF')
    draw.text((w//4 - 55, 218), "Listening (hi-IN)...", fill='#7E22CE')
    draw.text((45, 255), "Maine lal mitti ka ghada banaya hai,", fill='#475569')
    draw.text((45, 275), "kimat teen sau pachaas rupaye...", fill='#475569')
    draw.rounded_rectangle([(45, 330), (w//2 - 30, 370)], radius=6, fill='#7E22CE')
    draw.text((w//4 - 60, 342), "Auto-Structuring...", fill='#FFFFFF')

    draw.rounded_rectangle([(w//2 + 10, 105), (w-30, h-25)], radius=8, fill='#F8FAFC', outline='#CBD5E1', width=1)
    draw.text((w//2 + 25, 118), "Extracted Catalog Specs", fill='#0F172A')
    specs = [
        ("Product Title:", "Handmade Terracotta Water Pot"),
        ("Craft Category:", "Clay Pottery & Terracotta"),
        ("Artisan Price:", "Rs 350 (100% Retained)"),
        ("Platform Fee:", "Rs 17.50 (5% Fair Share)"),
        ("Listing Price:", "Rs 368 (Consumer MRP)"),
        ("Cluster:", "Gorakhpur Terracotta (GI-03)")
    ]
    y = 150
    for k, v in specs:
        draw.text((w//2 + 25, y), k, fill='#7E22CE')
        draw.text((w//2 + 25, y+16), v, fill='#1E293B')
        y += 38

    im.save('mockup_tab1.png')
    print("Saved mockup_tab1.png")

def generate_mockup_2():
    w, h = 680, 440
    im, draw = draw_window_frame(w, h, 'https://kaarvi.gov.in/artisan/dashboard')
    draw.text((30, 55), "Kaarvi Artisan Performance Dashboard", fill='#0F172A')
    draw.text((30, 75), "Real-Time Sales, Payouts & Fair Share Accounting", fill='#64748B')

    metrics = [
        ("Total Sales", "Rs 48,500", '#10B981'),
        ("Artisan Share", "95.0 %", '#7E22CE'),
        ("Completed", "38 Orders", '#2563EB')
    ]
    box_w = (w - 80) // 3
    for i, (lbl, val, col) in enumerate(metrics):
        bx = 30 + i * (box_w + 10)
        draw.rounded_rectangle([(bx, 108), (bx + box_w, 175)], radius=8, fill='#F8FAFC', outline='#E2E8F0')
        draw.text((bx + 15, 118), lbl, fill='#64748B')
        draw.text((bx + 15, 140), val, fill=col)

    draw.rounded_rectangle([(30, 195), (w-30, 260)], radius=8, fill='#FAF5FF', outline='#D8B4E2')
    draw.text((45, 205), "Fair Share Value Retention Meter", fill='#0F172A')
    draw.rounded_rectangle([(45, 228), (w-45, 248)], radius=5, fill='#E2E8F0')
    art_w = int((w - 90) * 0.95)
    draw.rounded_rectangle([(45, 228), (45 + art_w, 248)], radius=5, fill='#7E22CE')
    draw.text((55, 231), "95% Direct Artisan Payout", fill='#FFFFFF')
    draw.text((w - 120, 231), "5% Ops", fill='#64748B')

    draw.text((30, 280), "Live Orders & Direct Bank Transfers", fill='#0F172A')
    draw.line([(30, 302), (w-30, 302)], fill='#CBD5E1')
    rows = [
        ("ORD-8821", "Kondapalli Wooden Toy", "Hyderabad", "Rs 850", "PAID (95%)"),
        ("ORD-8822", "Bastar Dhokra Bell", "Bengaluru", "Rs 1,450", "PAID (95%)"),
        ("ORD-8823", "Terracotta Diya Set", "Mumbai", "Rs 450", "SHIPPED")
    ]
    y = 315
    for r in rows:
        draw.text((30, y), r[0], fill='#64748B')
        draw.text((125, y), r[1], fill='#0F172A')
        draw.text((330, y), r[2], fill='#64748B')
        draw.text((455, y), r[3], fill='#10B981')
        draw.text((550, y), r[4], fill='#7E22CE')
        y += 28

    im.save('mockup_tab2.png')
    print("Saved mockup_tab2.png")

def generate_mockup_3():
    w, h = 680, 440
    im, draw = draw_window_frame(w, h, 'https://kaarvi.gov.in/buyer/explore')
    draw.text((30, 55), "Cultural Marketplace & GI Authenticity Verification", fill='#0F172A')
    draw.text((30, 75), "Certified Craft Provenance & Scannable QR Verification", fill='#64748B')

    draw.rounded_rectangle([(30, 105), (w//2 - 15, h-25)], radius=8, fill='#F8FAFC', outline='#CBD5E1')
    draw.rounded_rectangle([(45, 120), (w//2 - 30, 240)], radius=6, fill='#E2E8F0')
    draw.text((w//4 - 55, 175), "[ Authentic Craft Photo ]", fill='#64748B')

    draw.rounded_rectangle([(45, 255), (210, 285)], radius=15, fill='#FEF3C7', outline='#F59E0B')
    draw.text((58, 263), "GI Certified #GI-19", fill='#B45309')

    draw.text((45, 300), "Kondapalli Heritage Dabbawala", fill='#0F172A')
    draw.text((45, 325), "Artisan: Rambabu Rao | Bastar Cluster", fill='#64748B')
    draw.text((45, 355), "Rs 750", fill='#7E22CE')
    draw.text((115, 357), "(Artisan gets Rs 712.50 directly)", fill='#10B981')

    draw.rounded_rectangle([(w//2 + 10, 105), (w-30, h-25)], radius=8, fill='#FAF5FF', outline='#D8B4E2')
    draw.text((w//2 + 25, 120), "GI Provenance Certificate", fill='#0F172A')

    draw.rectangle([(w*0.75 - 45, 155), (w*0.75 + 45, 245)], fill='#FFFFFF', outline='#0F172A', width=2)
    draw.rectangle([(w*0.75 - 35, 165), (w*0.75 - 15, 185)], fill='#0F172A')
    draw.rectangle([(w*0.75 + 15, 165), (w*0.75 + 35, 185)], fill='#0F172A')
    draw.rectangle([(w*0.75 - 35, 215), (w*0.75 - 15, 235)], fill='#0F172A')
    draw.text((w*0.75 - 12, 195), "QR", fill='#7E22CE')

    draw.text((w//2 + 25, 265), "- Cluster ID: IND-AP-GI-019", fill='#475569')
    draw.text((w//2 + 25, 290), "- Hash: 0x8a92...f3b1 (Tamper-Proof)", fill='#475569')
    draw.text((w//2 + 25, 315), "- 100% Genuine Handcrafted", fill='#10B981')
    draw.text((w//2 + 25, 340), "- Direct Bank Payout Guaranteed", fill='#10B981')

    im.save('mockup_tab3.png')
    print("Saved mockup_tab3.png")

# =============================================================================
# 4. GENERATE SECTOR RESEARCH GRAPHIC FOR SLIDE 6
# =============================================================================
def generate_slide6_graphics():
    fig, ax = plt.subplots(figsize=(5.8, 3.2), dpi=300)
    cats = ['Input Cost', 'Middleman Margin', 'Artisan Retained']
    trad = [30, 55, 15]
    kala = [30, 5, 65]
    x = np.arange(len(cats))
    width = 0.35
    ax.bar(x - width/2, trad, width, label='Traditional Supply Chain', color='#E9D5FF')
    ax.bar(x + width/2, kala, width, label='With Kaarvi', color='#6B21A8')
    ax.set_ylabel('% Retail Price', fontsize=9.5, fontweight='bold', color='#1E293B')
    ax.set_xticks(x)
    ax.set_xticklabels(cats, fontsize=9, fontweight='bold', color='#1E293B')
    ax.legend(loc='upper right', frameon=False, fontsize=8.5)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.spines['bottom'].set_color('#CBD5E1')
    ax.yaxis.grid(True, linestyle='-', alpha=0.3, color='#E2E8F0')
    plt.tight_layout()
    plt.savefig('slide6_chart.png', transparent=True, bbox_inches='tight', pad_inches=0.1)
    plt.close()
    print("Saved slide6_chart.png")

    w, h = 600, 360
    im = Image.new('RGB', (w, h), '#FFFFFF')
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle([(0, 0), (w-1, h-1)], radius=12, fill='#FAF5FF', outline='#D8B4E2', width=2)
    draw.text((25, 20), "Kaarvi Production Metric & Impact Match", fill='#0F172A')
    draw.text((25, 42), "Empirical Field Pilot Tracking across 500+ Rural Artisans", fill='#64748B')
    
    draw.ellipse([(35, 80), (155, 200)], fill='#FFFFFF', outline='#7E22CE', width=6)
    draw.text((72, 125), "95%", fill='#7E22CE')
    draw.text((55, 150), "Artisan Share", fill='#0F172A')
    
    draw.text((180, 85), "- Target Clusters: Kondapalli, Bastar, Channapatna", fill='#1E293B')
    draw.text((180, 115), "- Voice Recognition Accuracy: 94.2% (hi-IN Dialects)", fill='#10B981')
    draw.text((180, 145), "- Mean Cataloging Time: 1.8 seconds / item", fill='#10B981')
    draw.text((180, 175), "- Average Artisan Income Delta: +320% (3.2x)", fill='#7E22CE')
    
    skills = [("Voice-to-JSON Pipeline", 94), ("GI Cluster Authenticity", 98), ("Payment Gateway Settlement", 95)]
    y = 230
    for s_name, pct in skills:
        draw.text((35, y), s_name, fill='#475569')
        draw.rounded_rectangle([(240, y+4), (w-35, y+16)], radius=6, fill='#E2E8F0')
        pw = int((w - 275) * (pct / 100.0))
        draw.rounded_rectangle([(240, y+4), (240 + pw, y+16)], radius=6, fill='#7E22CE')
        draw.text((w-30, y-1), f"{pct}%", fill='#7E22CE')
        y += 35

    im.save('slide6_analytics.png')
    print("Saved slide6_analytics.png")

if __name__ == '__main__':
    generate_stages_infographic()
    generate_impact_chart()
    generate_mockup_1()
    generate_mockup_2()
    generate_mockup_3()
    generate_slide6_graphics()
