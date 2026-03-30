from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.colors import HexColor

import re

def markdown_to_html(text):
    # Match **anything** and replace with <b>anything</b>
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    # Simplify other common markdown elements if needed
    return text

def generate_pdf(input_file, output_file):
    doc = SimpleDocTemplate(output_file, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=HexColor('#2E7D32'),
        alignment=TA_CENTER,
        spaceAfter=20
    )
    
    heading2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Heading2'],
        fontSize=18,
        textColor=HexColor('#1B5E20'),
        spaceBefore=15,
        spaceAfter=10
    )
    
    heading3_style = ParagraphStyle(
        'Heading3',
        parent=styles['Heading3'],
        fontSize=14,
        textColor=HexColor('#388E3C'),
        spaceBefore=10,
        spaceAfter=5
    )
    
    body_style = styles['Normal']
    body_style.fontSize = 11
    body_style.leading = 14
    
    q_style = ParagraphStyle(
        'Question',
        parent=body_style,
        leftIndent=20,
        fontName='Helvetica-Bold',
        spaceBefore=5
    )
    
    a_style = ParagraphStyle(
        'Answer',
        parent=body_style,
        leftIndent=40,
        fontName='Helvetica-Oblique',
        spaceAfter=10
    )

    content = []
    
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for line in lines:
        line = line.strip()
        if not line:
            content.append(Spacer(1, 12))
            continue
            
        if line.startswith('# '):
            content.append(Paragraph(markdown_to_html(line[2:]), title_style))
        elif line.startswith('## '):
            content.append(Paragraph(markdown_to_html(line[3:]), heading2_style))
        elif line.startswith('### '):
            content.append(Paragraph(markdown_to_html(line[4:]), heading3_style))
        elif line.startswith('- '):
            content.append(Paragraph("• " + markdown_to_html(line[2:]), body_style))
        elif line.startswith('1.  **Q:') or line.startswith('2.  **Q:') or line.startswith('3.  **Q:'):
            # Parse questions
            q_match = re.search(r'\*\*Q:(.*?)\*\*', line)
            if q_match:
                content.append(Paragraph("Q: " + q_match.group(1).strip(), q_style))
            else:
                content.append(Paragraph(markdown_to_html(line), body_style))
        elif line.startswith('*   **A:**'):
            a_text = line.replace('*   **A:**', '').strip()
            content.append(Paragraph("A: " + markdown_to_html(a_text), a_style))
        elif line.startswith('---'):
            content.append(PageBreak())
        else:
            content.append(Paragraph(markdown_to_html(line), body_style))
            
    doc.build(content)
    print(f"PDF generated: {output_file}")

if __name__ == "__main__":
    generate_pdf('FitSense_Project_Guide.md', 'FitSense_Project_Guide.pdf')
