import json

guide_path = '/Users/ericmiller/Downloads/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md'
with open(guide_path, 'r') as f:
    text = f.read()

db_path = 'src/data/grnh_forensic_database.json'
with open(db_path, 'r') as f:
    db = json.load(f)

certs = db['certificateLineage']['traceableCertificates']

# Build Part III-B
lines = []
lines.append("## PART III-B: COURT EXHIBIT GRAPHIC FLOWCHARTS FOR ALL 31 CERTIFICATES")
lines.append("This section renders each and every individual certificate as a courtroom-ready, chronological graphic flowchart. Counsel can introduce these visual diagrams as trial exhibits, deposition attachments, or appendices to Section 5 / Rule 10b-5 complaints to visually demonstrate the unbroken chain from issuer/intermediary origin through attorney whitewashing to brokerage dumping.\n")

for cert in certs:
    lines.append(f"### Court Exhibit Flowchart: Certificate #{cert['certNumber']}")
    lines.append(f"- **Certificate Number:** `{cert['certNumber']}`")
    lines.append(f"- **Common Shares:** **{cert['shares']:,}**")
    lines.append(f"- **Genesis Date:** {cert['genesisDate']}")
    lines.append(f"- **Origin Mechanism:** {cert['originType']}")
    lines.append(f"- **Primary Seller / Intermediary:** {cert['primarySeller']}")
    lines.append(f"- **Initial Recipient:** {cert['initialRecipient']}")
    lines.append(f"- **Legal Opinion Counsel:** {cert['opinionCounsel']}")
    lines.append(f"- **Clearing Broker / Depository:** {cert['brokerOrClearing']}")
    lines.append(f"- **Final Disposition Status:** `{cert['currentHolderOrStatus']}`\n")
    
    # Graphic ASCII Box Flowchart
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
    lines.append("- **Evidentiary Red Flags:**")
    for rf in cert['redFlags']:
        lines.append(f"  - {rf}")
    lines.append("- **Verified Hard Drive Receipts:**")
    for ef in cert['evidenceFiles']:
        lines.append(f"  - `{ef}`")
    lines.append("\n---\n")

part_3b_str = "\n".join(lines)

target_marker = "## PART IV: STATUTORY CAUSES OF ACTION & TRIAL PLEADING MATRIX"
if "## PART III-B: COURT EXHIBIT GRAPHIC FLOWCHARTS" in text:
    # Replace existing Part III-B
    start_idx = text.index("## PART III-B: COURT EXHIBIT GRAPHIC FLOWCHARTS")
    end_idx = text.index(target_marker)
    text = text[:start_idx] + part_3b_str + "\n" + text[end_idx:]
    print("Replaced existing Part III-B.")
else:
    if target_marker in text:
        text = text.replace(target_marker, part_3b_str + "\n" + target_marker)
        print("Injected Part III-B before Part IV.")
    else:
        print("Marker not found!")
        exit(1)

with open(guide_path, 'w') as f:
    f.write(text)

# Also copy to public/
with open('public/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md', 'w') as f:
    f.write(text)

print(f"Updated {guide_path} ({len(text):,} chars)")
