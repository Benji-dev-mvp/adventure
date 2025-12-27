"""PDF generation service for reports and documents."""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
from typing import List, Dict, Any


class PDFGenerator:
    """Service for generating PDF documents."""
    
    @staticmethod
    def generate_campaign_report(campaign_data: Dict[str, Any]) -> BytesIO:
        """Generate campaign performance report PDF."""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a73e8'),
            spaceAfter=30,
        )
        title = Paragraph(f"Campaign Report: {campaign_data['name']}", title_style)
        elements.append(title)
        elements.append(Spacer(1, 0.2 * inch))
        
        # Campaign Info
        info_data = [
            ['Campaign ID:', str(campaign_data['id'])],
            ['Status:', campaign_data['status']],
            ['Created:', campaign_data['created_at']],
            ['Total Leads:', str(campaign_data['total_leads'])],
            ['Emails Sent:', str(campaign_data['emails_sent'])],
        ]
        
        info_table = Table(info_data, colWidths=[2*inch, 4*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ]))
        elements.append(info_table)
        elements.append(Spacer(1, 0.3 * inch))
        
        # Performance Metrics
        elements.append(Paragraph("Performance Metrics", styles['Heading2']))
        elements.append(Spacer(1, 0.1 * inch))
        
        metrics_data = [
            ['Metric', 'Value', 'Percentage'],
            ['Open Rate', str(campaign_data.get('open_rate', 0)), f"{campaign_data.get('open_rate', 0)}%"],
            ['Click Rate', str(campaign_data.get('click_rate', 0)), f"{campaign_data.get('click_rate', 0)}%"],
            ['Response Rate', str(campaign_data.get('response_rate', 0)), f"{campaign_data.get('response_rate', 0)}%"],
            ['Bounce Rate', str(campaign_data.get('bounce_rate', 0)), f"{campaign_data.get('bounce_rate', 0)}%"],
        ]
        
        metrics_table = Table(metrics_data, colWidths=[2*inch, 2*inch, 2*inch])
        metrics_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a73e8')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9f9f9')]),
        ]))
        elements.append(metrics_table)
        
        # Build PDF
        doc.build(elements)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_analytics_report(analytics_data: Dict[str, Any]) -> BytesIO:
        """Generate analytics report PDF."""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        elements = []
        styles = getSampleStyleSheet()
        
        # Title
        title = Paragraph("Analytics Report", styles['Title'])
        elements.append(title)
        elements.append(Spacer(1, 0.2 * inch))
        
        # Date Range
        date_info = Paragraph(
            f"Period: {analytics_data['start_date']} to {analytics_data['end_date']}",
            styles['Normal']
        )
        elements.append(date_info)
        elements.append(Spacer(1, 0.3 * inch))
        
        # Summary Section
        elements.append(Paragraph("Executive Summary", styles['Heading2']))
        elements.append(Spacer(1, 0.1 * inch))
        
        summary_text = f"""
        Total Campaigns: {analytics_data['total_campaigns']}<br/>
        Total Leads: {analytics_data['total_leads']}<br/>
        Total Emails Sent: {analytics_data['total_emails_sent']}<br/>
        Average Response Rate: {analytics_data['avg_response_rate']}%<br/>
        """
        elements.append(Paragraph(summary_text, styles['Normal']))
        elements.append(PageBreak())
        
        # Detailed Metrics
        elements.append(Paragraph("Detailed Metrics", styles['Heading2']))
        # Add more detailed data here
        
        doc.build(elements)
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_audit_log_report(logs: List[Dict[str, Any]]) -> BytesIO:
        """Generate audit log report PDF."""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        elements = []
        styles = getSampleStyleSheet()
        
        # Title
        title = Paragraph(f"Audit Log Report - {datetime.now().strftime('%Y-%m-%d')}", styles['Title'])
        elements.append(title)
        elements.append(Spacer(1, 0.3 * inch))
        
        # Logs Table
        table_data = [['Timestamp', 'User', 'Action', 'Status']]
        for log in logs[:50]:  # Limit to 50 entries
            table_data.append([
                log.get('timestamp', '')[:19],
                log.get('user_email', 'System'),
                log.get('action', ''),
                'Success' if log.get('success') else 'Failed'
            ])
        
        logs_table = Table(table_data, colWidths=[2*inch, 2*inch, 2*inch, 1*inch])
        logs_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elements.append(logs_table)
        
        doc.build(elements)
        buffer.seek(0)
        return buffer


# Global instance
pdf_generator = PDFGenerator()
