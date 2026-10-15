import json, os

db_path = 'src/data/grnh_forensic_database.json'
with open(db_path, 'r') as f:
    db = json.load(f)

meta = db['meta']

lines = []
lines.append("# FORENSIC SECURITIES LITIGATION AUDIT REPORT: GREENGRO TECHNOLOGIES, INC. (OTC: GRNH)")
lines.append(f"**Prepared for:** Legal Counsel & Securities Litigation Team")
lines.append(f"**Generated:** {meta['generatedAt']}")
lines.append(f"**Auditor Desk:** {meta['auditorDesk']}")
lines.append(f"**Company / Ticker:** GreenGro Technologies, Inc. (OTC: GRNH)")
lines.append(f"**Total Shares Tracked:** {meta['totalSharesTracked']:,}")
lines.append(f"**Total Discovered Primary Source Files on Disk:** {meta['totalDiscoveredFiles']}")
lines.append(f"**Identified Evidentiary Anomalies:** {meta['anomaliesDetected']}\n")

lines.append("---")
lines.append("## I. APPLICABLE LITIGATION DOCKETS & REGULATORY PROCEEDINGS")
for c in meta['caseCaptions']:
    lines.append(f"- **{c}**")
lines.append("")

lines.append("---")
lines.append("## II. EXECUTIVE SUMMARY & TRANSITION FROM LEGAL TO HIGHLY ILLEGAL")
lines.append("This audit traces the complete evidentiary chain of GreenGro Technologies, Inc. (GRNH) common stock transactions from documented private placements in late 2016 through sham consulting agreements, opinion-letter shopping, massive offshore nominee distributions, and subsequent federal felony prosecutions and civil actions.\n")

lines.append("The evidentiary chronology establishes five distinct operational phases:\n")
for idx, p in enumerate(db['evidentiaryPhases']):
    lines.append(f"### Phase {idx+1}: {p['name']}")
    lines.append(f"- **Period:** {p['period']}")
    lines.append(f"- **Risk Level:** {p['riskLevel']}")
    lines.append(f"- **Operational Summary:** {p['summary']}")
    lines.append(f"- **Key Badges:** {', '.join(p['badges'])}\n")

lines.append("---")
lines.append("## III. PRIMARY STATUTORY FRAUD PATTERNS IDENTIFIED\n")
for pat in db['fraudPatterns']:
    lines.append(f"### {pat['title']}")
    lines.append(f"- **Statutory Violation:** `{pat['statutoryViolation']}`")
    lines.append(f"- **Severity Level:** {pat['severity']}")
    lines.append(f"- **Analysis:** {pat['description']}")
    lines.append(f"- **Affected Stock Certificates:** {', '.join(pat['affectedCertificates'])}")
    lines.append("- **Primary Source Evidence Files:**")
    for f in pat['primaryEvidenceFiles']:
        lines.append(f"  - `{f}`")
    lines.append("")

lines.append("---")
lines.append(f"## IV. COMPREHENSIVE TRANSACTION & CUSTODY CHRONOLOGY ({len(db['transactions'])} Transactions)\n")
lines.append("| Tx ID | Date | Cert # | Volume | Consideration | From -> To | Transfer Agent | Opinion / Basis | Anomalies |")
lines.append("|---|---|---|---|---|---|---|---|---|")
for tx in db['transactions']:
    anom_str = '; '.join(tx['anomalies']) if tx['anomalies'] else 'None'
    lines.append(f"| {tx['id']} | {tx['date']} | {tx['cert']} | {tx['shares']:,} | {tx['price']} | {tx['from']} -> {tx['to']} | {tx['ta']} | {tx['opinion']} | {anom_str} |")
lines.append("")

lines.append("---")
lines.append(f"## V. PRIMARY EVIDENTIARY SOURCE FILES CATALOGED FROM HARD DRIVE ({len(db['sourceFilesCatalog'])} Files)\n")
by_cat = {}
for f in db['sourceFilesCatalog']:
    c = f['category']
    by_cat.setdefault(c, []).append(f)

for cat_name, file_list in sorted(by_cat.items()):
    lines.append(f"### {cat_name} ({len(file_list)} Files)\n")
    for f in file_list[:25]:
        lines.append(f"- **{f['filename']}** ({f['sizeFormatted']})")
        lines.append(f"  - Local Path: `{f['path']}`")
        lines.append(f"  - Link: [{f['filename']}](file://{f['path']})")
    if len(file_list) > 25:
        lines.append(f"  - *... and {len(file_list)-25} additional files in category*")
    lines.append("")

out_path = '/Users/ericmiller/Downloads/GRNH_Forensic_Securities_Litigation_Report.md'
with open(out_path, 'w') as f:
    f.write('\n'.join(lines))

print(f"Exported executive litigation report to: {out_path} ({os.path.getsize(out_path):,} bytes)")
