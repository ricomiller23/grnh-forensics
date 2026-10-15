import os, subprocess, shutil

pandoc_bin = '/Users/ericmiller/.homebrew/bin/pandoc'
chrome_bin = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

css_legal = """
@page {
    size: letter;
    margin: 16mm 14mm 16mm 14mm;
    @bottom-right {
        content: counter(page);
    }
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 8pt;
    line-height: 1.45;
    color: #1e293b;
    background: #ffffff;
    margin: 0;
    padding: 0;
}

h1 {
    color: #0f172a;
    font-size: 15pt;
    font-weight: 800;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 4px;
    margin-top: 22pt;
    margin-bottom: 10pt;
    page-break-after: avoid;
}

h1:first-of-type {
    margin-top: 0;
}

h2 {
    color: #1e293b;
    font-size: 11.5pt;
    font-weight: 700;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 3px;
    margin-top: 16pt;
    margin-bottom: 8pt;
    page-break-after: avoid;
}

h3 {
    color: #334155;
    font-size: 9.5pt;
    font-weight: 700;
    margin-top: 12pt;
    margin-bottom: 6pt;
    page-break-after: avoid;
}

h4 {
    color: #475569;
    font-size: 8.5pt;
    font-weight: 700;
    margin-top: 10pt;
    margin-bottom: 4pt;
    page-break-after: avoid;
}

h5 {
    color: #64748b;
    font-size: 8pt;
    font-weight: 700;
    margin-top: 8pt;
    margin-bottom: 3pt;
    page-break-after: avoid;
}

p {
    margin-top: 0;
    margin-bottom: 5pt;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 6pt;
    margin-bottom: 10pt;
    font-size: 7pt;
    page-break-inside: auto;
}

tr {
    page-break-inside: avoid;
    page-break-after: auto;
}

th, td {
    border: 1px solid #cbd5e1;
    padding: 3.5pt 5pt;
    text-align: left;
    vertical-align: top;
}

th {
    background-color: #f1f5f9;
    font-weight: 700;
    color: #0f172a;
}

code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 7.2pt;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 1px 3px;
    border-radius: 3px;
    color: #0f172a;
}

pre {
    background-color: #0f172a;
    color: #f8fafc;
    padding: 8pt 10pt;
    border-radius: 4pt;
    font-size: 6.8pt;
    line-height: 1.35;
    margin-top: 5pt;
    margin-bottom: 8pt;
    page-break-inside: avoid;
    overflow-x: auto;
}

pre code {
    background-color: transparent;
    border: none;
    color: #38bdf8;
    padding: 0;
}

ul, ol {
    margin-top: 0;
    margin-bottom: 6pt;
    padding-left: 16pt;
}

li {
    margin-bottom: 2pt;
}

blockquote {
    border-left: 3px solid #0284c7;
    margin: 6pt 0;
    padding-left: 8pt;
    color: #334155;
    font-style: italic;
    background-color: #f0f9ff;
    padding-top: 3pt;
    padding-bottom: 3pt;
}

hr {
    border: none;
    border-top: 1px solid #cbd5e1;
    margin: 14pt 0;
}
"""

def generate_pdf(md_path, html_temp, pdf_out, public_pdf):
    print(f"\n--- Generating PDF for: {md_path} ---")
    res = subprocess.run([pandoc_bin, md_path, '-f', 'gfm', '-t', 'html'], capture_output=True, text=True)
    if res.returncode != 0:
        print("Pandoc error:", res.stderr)
        return False
    
    html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
{css_legal}
</style>
</head>
<body>
{res.stdout}
</body>
</html>"""
    
    with open(html_temp, 'w') as f:
        f.write(html_content)
    
    cmd_chrome = [
        chrome_bin,
        '--headless=new',
        '--disable-gpu',
        '--no-pdf-header-footer',
        f'--print-to-pdf={pdf_out}',
        html_temp
    ]
    res_chrome = subprocess.run(cmd_chrome, capture_output=True, text=True)
    if res_chrome.returncode != 0:
        print("Chrome error:", res_chrome.stderr)
        return False
    
    shutil.copyfile(pdf_out, public_pdf)
    size_mb = os.path.getsize(pdf_out) / (1024 * 1024)
    print(f"SUCCESS: Generated {pdf_out} ({size_mb:.2f} MB)")
    print(f"COPIED TO: {public_pdf}")
    return True

# 1. Audit Report PDF
generate_pdf(
    '/Users/ericmiller/Downloads/GRNH_Forensic_Securities_Litigation_Report.md',
    '/tmp/grnh_audit_report.html',
    '/Users/ericmiller/Downloads/GRNH_Forensic_Securities_Litigation_Report.pdf',
    'public/GRNH_Forensic_Securities_Litigation_Report.pdf'
)

# 2. Lawyer Handbook PDF
generate_pdf(
    '/Users/ericmiller/Downloads/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md',
    '/tmp/grnh_lawyer_guide.html',
    '/Users/ericmiller/Downloads/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.pdf',
    'public/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.pdf'
)

print("\nAll PDF generations completed.")
