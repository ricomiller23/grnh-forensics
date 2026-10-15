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


lines.append("---")
lines.append("## VI. COMPREHENSIVE LEGAL ANALYSIS: SHARES NOT PURCHASED FROM THE COMPANY")
lines.append("**Governing Federal Statutes & Precedents:** 17 C.F.R. § 230.144(d)(1), 15 U.S.C. § 77b(a)(11), 17 C.F.R. § 230.144(i), *SEC v. Kern*, *SEC v. Ralston Purina Co.*, *In Pari Delicto* Doctrine.\n")

ncs = db.get('nonCompanySharesAnalysis', {})
metrics = ncs.get('summaryMetrics', {})
lines.append(f"### VI.A. Summary Metrics & Mechanism Distribution")
lines.append(f"- **Total Non-Company Shares Tracked:** {metrics.get('totalNonCompanyShares', 0):,} shares ({metrics.get('pctNonCompanySourced', '99.4%')} of total analyzed float)")
lines.append(f"- **Direct Cash Consideration Received by Issuer Treasury:** {metrics.get('directCompanyCashReceived', '$0.00')} (Zero capital entered corporate bank accounts)")
lines.append(f"- **Total Documented Non-Company Tranches:** {metrics.get('totalTranchesTracked', 0)}")
lines.append(f"- **Flagged Opinion Letter Attorneys:** {', '.join(metrics.get('flaggedOpinionAttorneys', []))}")
lines.append("")
lines.append("| Acquisition Mechanism | Shares | Percentage |")
lines.append("|---|---|---|")
for m in metrics.get('breakdownByMechanism', []):
    lines.append(f"| {m['mechanism']} | {m['shares']:,} | {m['percentage']} |")
lines.append("")

lines.append("### VI.B. Master Dossier Table: All Shares Not Purchased from Issuer\n")
lines.append("| Tranche ID | Recipient / Nominee | Cert # | Volume | Consideration | Stated Origin | Opinion Counsel / Date | Statutory Violations |")
lines.append("|---|---|---|---|---|---|---|---|")
for t in ncs.get('tranches', []):
    viols = '; '.join(t.get('statutoryViolations', []))
    lines.append(f"| {t['id']} | {t['recipient']} | {t['cert']} | {t['shares']:,} | {t['actualCompanyCash']} | {t['statedOrigin']} | {t['opinionAuthor']} ({t['opinionDate']}) | {viols} |")
lines.append("")

lines.append("### VI.C. Featured Case Spotlight 1: The John T. Root, Jr. 27M Share Opinion Fraud Autopsy")
root = ncs.get('rootOpinionAutopsy', {})
lines.append(f"**Attorney:** {root.get('attorney', 'John T. Root, Jr., Esq.')}")
lines.append(f"**Recipient:** {root.get('recipient', 'E.F. Romano III')} | **Cert:** CS1-8172 | **Volume:** {root.get('shares', 27000000):,} Shares")
lines.append(f"**Date:** {root.get('date', 'Jan 22 / Apr 22, 2019')}\n")
lines.append("#### The 5.74% Mathematical Falsification:")
lines.append("- Root represented to Fidelity Transfer Services: *\"I do not consider it to rise to the level of a distribution as it is **much less than one percent** of the outstanding shares of the Issuer.\"*")
lines.append(f"- Outstanding Common Shares: **{root.get('issuerOutstandingShares', 470220980):,}**")
lines.append(f"- Actual Share Ratio: **{root.get('actualPercentage', '5.7419%')}** (Exceeding the Rule 144(e) 1% volume limitation ceiling by 574%!)")
lines.append("")
lines.append("#### Fatal Legal Defects:")
for sv in root.get('statutoryViolations', []):
    lines.append(f"- **{sv['statute']}:** {sv['analysis']}")
lines.append("")
lines.append("#### Verbatim Excerpts from Root Opinion Letter:")
for ex in root.get('verbatimExcerpts', []):
    lines.append(f"> \"{ex}\"\n")
lines.append("")

lines.append("### VI.D. Featured Case Spotlight 2: The Cheryl Hintzen 6.79M Share Lawsuit Defense Autopsy")
cheryl = ncs.get('cherylHintzenLawsuitAutopsy', {})
lines.append(f"**Case Caption:** `{cheryl.get('caseCaption', 'Cheryl Hintzen v. James M. Haas, Maricopa County CV2025-013574')}`")
lines.append(f"**Stock Certificate:** `{cheryl.get('certificateNumber', 'CS1-7937')}` | **Volume:** {cheryl.get('shares', 6790000):,} Shares")
lines.append(f"**Plaintiff's Claim:** {cheryl.get('plaintiffClaim', 'Breach of contract seeking $1.8M damages.')}")
lines.append(f"**Opinion Counsel:** {cheryl.get('opinionAttorney', 'Stephen Mills, Esq.')}\n")
lines.append("#### The 44-Month Retroactive Backdating Fraud:")
lines.append(f"- **Claimed Provenance:** {cheryl.get('claimedProvenance', '')}")
lines.append(f"- **Documentary Reality:** {cheryl.get('evidentiaryDiscrepancy', '')}")
lines.append("")
lines.append("#### Defense Strategies for Counsel:")
for ds in cheryl.get('defenseStrategies', []):
    lines.append(f"##### {ds['doctrine']}")
    lines.append(f"- **Legal Rule:** {ds['legalRule']}")
    lines.append(f"- **Litigation Application:** {ds['application']}\n")
lines.append("")

lines.append("### VI.E. Statutory Securities Law Violations Framework\n")
for sv in ncs.get('statutoryVulnerabilities', []):
    lines.append(f"#### {sv['code']}: {sv['name']}")
    lines.append(f"- **Summary:** {sv['summary']}")
    lines.append(f"- **Litigation Impact:** {sv['relevanceToLitigation']}\n")
lines.append("")

lines.append("### VI.F. Cross-Examination Deposition Playbook for Defense Counsel\n")
for lp in ncs.get('litigationPlaybook', []):
    lines.append(f"#### Deposition Target: {lp['witness']}")
    lines.append(f"**Target Subject:** {lp['targetSubject']}")
    for q_idx, q in enumerate(lp['sampleQuestions']):
        lines.append(f"- **Q{q_idx+1}:** {q}")
    lines.append("")

out_path = '/Users/ericmiller/Downloads/GRNH_Forensic_Securities_Litigation_Report.md'
with open(out_path, 'w') as f:
    f.write('\n'.join(lines))

print(f"Exported executive litigation report to: {out_path} ({os.path.getsize(out_path):,} bytes)")
