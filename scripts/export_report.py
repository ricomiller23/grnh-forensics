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
    for f in pat.get('primaryEvidenceFiles', []):
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


lines.append("---")
lines.append("## VII. CERTIFICATE LINEAGE, NEW SELLERS ANALYSIS & VISUAL TRANSFER PATTERNS")
lines.append("This section documents the traceable custody pedigree for each individual certificate and analyzes the systematic reliance on 'New Sellers' (secondary intermediaries) who transferred restricted blocks without proceeds entering the corporate treasury.\n")

lineage = db.get('certificateLineage', {})
metrics = lineage.get('summaryMetrics', {})

lines.append("### VII.A. Summary Metrics: The 'New Sellers' Reality")
lines.append(f"- **Total Non-Company Shares Sold via New Sellers:** **{metrics.get('totalNewSellerVolume', 107040000):,} Shares**")
lines.append(f"- **Casa de Dinero, LLC / Inc. (Ruben Sanchez FTS) Volume:** **{metrics.get('casaDeDineroVolume', 40540000):,} Shares**")
lines.append(f"- **Proceeds Directed to Issuer Treasury:** **$0.00** (100% of proceeds were captured by promoters and nominees)")
lines.append(f"- **Big Thunder LLC Nominee Liquidation Volume:** **{metrics.get('bigThunderVolume', 8000000):,} Shares**")
lines.append(f"- **Motivated Minds / SagePoint Volume:** **{metrics.get('motivatedMindsVolume', 1000000):,} Shares**")
lines.append(f"- **Foreign / Canadian Straw Amalgamation Volume:** **{metrics.get('canadianStrawVolume', 30450000):,} Shares**")
lines.append(f"- **Total Cataloged Traceable Certificates:** **{metrics.get('totalCertificatesCataloged', 31)} Distinct Stock Certificates**\n")

lines.append("### VII.B. Master Dossier of 'New Sellers' (Secondary Intermediaries)")
lines.append("| ID | Seller Entity | Controller / Proxy | Operational Role | Volume Sold | Issuer Cash | Key Affected Certs | Key Receipts |")
lines.append("|---|---|---|---|---|---|---|---|")
for s in lineage.get('newSellersAnalysis', []):
    certs_str = ', '.join(s['affectedCertificates'][:3])
    if len(s['affectedCertificates']) > 3:
        certs_str += f" (+{len(s['affectedCertificates'])-3} more)"
    ev_str = ', '.join(s['primaryEvidenceFiles'][:2])
    lines.append(f"| {s['id']} | **{s['name']}** | {s['controller']} | {s['role']} | {s['totalSharesSoldOrTransferred']:,} | {s['considerationReceived']} | {certs_str} | {ev_str} |")
lines.append("")

lines.append("#### Special Entity Dossier 0: Casa de Dinero, LLC / Inc. (The 40.54M Share Transfer Agent Spigot)")
lines.append("- **Entity Names:** Casa de Dinero, LLC / Casa de Dinero, Inc.")
lines.append("- **Controller / Signatory:** Ruben Sanchez (Operating with email `rsanchez.fts@gmail.com` at Fidelity Transfer Services, Inc.)")
lines.append("- **Total Volume Channeled:** **40,540,000 Shares** across 18+ certificates and private SPAs")
lines.append("- **Cash Consideration Diverted:** **$403,500.00** collected from purchasers ($0.00 to GreenGro Technologies)")
lines.append("- **Primary Transferees & Recipients:**")
lines.append("  - **Cheryl Hintzen:** 11,790,000 shares (5.0M shares via $125k SPA on 3/14/2017; 6.79M shares under CS1-7937 in *Hintzen v. Haas* lawsuit)")
lines.append("  - **Joshua Hintzen:** 12,250,000 shares (6.5M shares across CS1-7960 to 7972; 5.5M shares via $137.5k SPA on 8/9/2017; 250k shares via $35k SPA on 3/20/2017)")
lines.append("  - **Big Thunder, LLC (Tom McCluskey):** 4,000,000 shares under CS1-8002 on 11/2/2017 (cleared through Forest & Alpine)")
lines.append("  - **Paradise Wire & Cable DBPP:** 4,000,000 shares under CS1-7908 via $106k SPA on 4/5/2017")
lines.append("  - **Paula Marie Poe (Canadian Straw):** 8,500,000 shares under CS1-8161 (3.5M) and CS1-8162 (5.0M) on 4/4/2019")
lines.append("- **Operational Mechanics:** Operating as an insider at transfer agent Fidelity Transfer Services (FTS), Ruben Sanchez packaged shares into Casa de Dinero and executed private purchase agreements selling stock to insiders and nominees, while transfer agent records suppressed the true nature of the transactions.")
lines.append("- **Primary Evidence Receipts:** `GRNH data.xlsx`, `GRNH Purchase agreement Casa de Dinero, LLC.docx`, `Stock Purchase Agreement Casa Dinero.pdf`, `STOCK INVENTORY JULY 16  (version 1) (Autosaved) 2.xlsx` (noting `rsanchez.fts@gmail.com`), `GRNH 7905 2.5 million pkg for Ruben for lenged lift.pdf`, `GRNH going to Ruben to be put in Big thunder with LOI's.pdf`\n")
lines.append("#### Special Entity Dossier 1: Big Thunder, LLC (Nominee Vehicle)")
lines.append("- **Formation Date:** August 30, 2017 (Nevada LLC)")
lines.append("- **Managing Member:** Tom McCluskey (Husband of Sue McCluskey, Ira Gaines' personal bookkeeper)")
lines.append("- **Concealed Beneficial Owners:** Ira Gaines, Cheryl Hintzen, Stevie Ray McCluskey")
lines.append("- **Operational Rationale:** Formed specifically because Ira Gaines and Cheryl Hintzen faced widespread broker account closures and freezes at Wilson-Davis, Pershing, and Manning-Napier.")
lines.append("- **Brokerage Warning & Alteration:** The original operating agreement page 14 named Ira Gaines as Initial Manager. Broker David Adams at Forest Securities warned the parties that Gaines' name would trigger compliance rejection. Sue McCluskey substituted Tom McCluskey to evade scrutiny.")
lines.append("- **Brokerages Used:** Forest Securities (David Adams) and Alpine Securities.")
lines.append("- **Certificates Channeled:** CS1-8002 (4,000,000 shares), CS1-7910, 7960, 7961, 7962, 7963, 7964, 7965, 7966, 7967, 7968 (totaling 8,000,000 shares).")
lines.append("- **Primary Evidence:** `Big Thunder LLC CHAPTER.docx`, `NARRATIVE V1.docx`, `GRNH request for legal 4MM GRNH BIg Thunder.docx`, `GRNH SENT TO TA to be put in Big Thunder Name 9 certs.pdf`\n")

lines.append("#### Special Entity Dossier 2: Motivated Minds (Wells Fargo & Bankers Trust Conduit)")
lines.append("- **Operational Vehicle:** Motivated Minds operated payroll and commercial accounts at Wells Fargo Bank and Bankers Trust.")
lines.append("- **Clearing Brokerage:** SagePoint Financial, Inc.")
lines.append("- **Clearing Volume:** 1,000,000 shares under Promissory Note transfer mechanisms.")
lines.append("- **Primary Evidence:** `SagePoint Motivated Minds.pdf`, `GRNH for Sage point 1MM shares.pdf`, `Eric Miller Compensation 03-14-21.xlsx` (Sheet 'SUMMARY')\n")

lines.append("### VII.C. The Six Core Visual Transfer Flow Patterns\n")
for pat in lineage.get('visualPatterns', []):
    lines.append(f"#### Pattern {pat['id']}: {pat['title']}")
    lines.append(f"- **Subtitle:** {pat['subtitle']}")
    lines.append(f"- **Severity:** `{pat['severity']}`")
    lines.append(f"- **Statutory Violations:** {', '.join(pat['statutoryViolations'])}")
    lines.append(f"- **Mechanic Summary:** {pat['mechanicSummary']}")
    lines.append(f"- **Affected Certificates:** {', '.join(pat['affectedCertificates'])}")
    lines.append("- **Transfer Flow Circuit:**")
    for step in pat['nodes']:
        lines.append(f"  {step['step']}. **[{step['badge']}] {step['entity']}**: {step['action']}")
    lines.append("- **Primary Evidence Receipts:**")
    for f in pat.get('primaryEvidenceFiles', []):
        lines.append(f"  - `{f}`")
    lines.append("")

lines.append("### VII.D. Traceable Certificate Master Pedigree Ledger (31 Stock Certificates)\n")
lines.append("| Cert # | Shares | Genesis Date | Origin Type | Primary Seller | Initial Recipient | Clearing Broker | Counsel | Red Flags | Key Receipts |")
lines.append("|---|---|---|---|---|---|---|---|---|---|")
for cert in lineage.get('traceableCertificates', []):
    rf_str = '; '.join(cert['redFlags'][:2]) if cert['redFlags'] else 'None'
    ev_str = ', '.join(cert['evidenceFiles'][:2])
    lines.append(f"| **{cert['certNumber']}** | {cert['shares']:,} | {cert['genesisDate']} | {cert['originType']} | {cert['primarySeller']} | {cert['initialRecipient']} | {cert['brokerOrClearing']} | {cert['opinionCounsel']} | {rf_str} | {ev_str} |")
lines.append("")

lines.append("#### Detailed Step-by-Step Graphic Custody Pedigree for Each and Every Certificate (31 Graphic Exhibits):\n")
for cert in lineage.get('traceableCertificates', []):
    lines.append(f"##### Certificate {cert['certNumber']} ({cert['shares']:,} Shares - {cert['initialRecipient']})")
    lines.append(f"- **Genesis Date:** {cert['genesisDate']} | **Origin:** {cert['originType']}")
    lines.append(f"- **Current Status:** {cert['currentHolderOrStatus']}")
    lines.append(f"- **Clearing Broker:** {cert['brokerOrClearing']} | **Opinion Counsel:** {cert['opinionCounsel']}")
    lines.append("- **Graphic Chain-of-Custody Flowchart:**\n")
    
    # ASCII Box Flowchart
    lines.append("```text")
    border = "═" * 74
    lines.append(f"╔{border}╗")
    h1 = f" CERTIFICATE #{cert['certNumber']} │ {cert['shares']:,} SHARES │ GENESIS: {cert['genesisDate']}"
    lines.append(f"║{h1:<74}║")
    h2 = f" Origin: {cert['originType'][:32]} │ Status: {cert['currentHolderOrStatus'][:32]}"
    lines.append(f"║{h2:<74}║")
    h3 = f" Counsel: {cert['opinionCounsel'][:32]} │ Broker: {cert['brokerOrClearing'][:32]}"
    lines.append(f"║{h3:<74}║")
    lines.append(f"╚{border}╝")
    for hop in cert['custodyHops']:
        b = hop.get('stageBadge', 'Custody Hop')
        lines.append("  │")
        lines.append(f"  ▼ [Hop {hop['step']} - {hop['date']}] ─── {b.upper()}")
        lines.append(f"    Transfer:  {hop['from']}  ──────►  {hop['to']}")
        act = hop['action']
        words = act.split()
        cur = "    Action:    "
        for w in words:
            if len(cur) + len(w) + 1 > 72:
                lines.append(cur)
                cur = "               " + w
            else:
                cur += (" " if cur.strip() else "") + w
        if cur.strip():
            lines.append(cur)
    lines.append("```\n")
    lines.append(f"- **Evidentiary Anomalies:** {'; '.join(cert['redFlags'])}")
    lines.append(f"- **Primary Hard Drive Files:** {', '.join(cert['evidenceFiles'])}\n")

out_path = '/Users/ericmiller/Downloads/GRNH_Forensic_Securities_Litigation_Report.md'
with open(out_path, 'w') as f:
    f.write('\n'.join(lines))

print(f"Exported executive litigation report to: {out_path} ({os.path.getsize(out_path):,} bytes)")
