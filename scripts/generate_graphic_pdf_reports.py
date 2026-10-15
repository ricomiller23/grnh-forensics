import json, os, subprocess

# 1. Load database
db_path = 'src/data/grnh_forensic_database.json'
with open(db_path, 'r') as f:
    db = json.load(f)

meta = db['meta']
lineage = db['certificateLineage']
certs = lineage['traceableCertificates']

def build_cert_flowchart_ascii(cert):
    out = []
    out.append("```text")
    border = "═" * 76
    out.append(f"╔{border}╗")
    header_str = f" CERTIFICATE #{cert['certNumber']} │ {cert['shares']:,} SHARES │ GENESIS: {cert['genesisDate']}"
    out.append(f"║{header_str:<76}║")
    orig_str = f" Origin: {cert['originType']} │ Status: {cert['currentHolderOrStatus']}"
    out.append(f"║{orig_str:<76}║")
    counsel_str = f" Counsel: {cert['opinionCounsel']} │ Broker: {cert['brokerOrClearing']}"
    out.append(f"║{counsel_str:<76}║")
    out.append(f"╚{border}╝")
    
    total_hops = len(cert['custodyHops'])
    for idx, hop in enumerate(cert['custodyHops']):
        badge = hop.get('stageBadge', 'Custody Hop')
        out.append("  │")
        out.append(f"  ▼ [HOP {hop['step']} OF {total_hops} : {hop['date']}] ─── {badge.upper()}")
        out.append(f"    TRANSFER:  {hop['from']}  ──────►  {hop['to']}")
        
        # Word wrap action
        action = hop['action']
        words = action.split()
        lines = []
        cur = "    ACTION:    "
        for w in words:
            if len(cur) + len(w) + 1 > 74:
                lines.append(cur)
                cur = "               " + w
            else:
                cur += (" " if cur.strip() else "") + w
        if cur.strip():
            lines.append(cur)
        out.extend(lines)
    out.append("```")
    return "\n".join(out)

# Update scripts/export_report.py
with open('scripts/export_report.py', 'r') as f:
    rep_script = f.read()

# Let's inspect where custody pedigree is in export_report.py
target_block = """lines.append("#### Detailed Step-by-Step Custody Pedigree for Key Certificates:\\n")
for cert in lineage.get('traceableCertificates', []):
    lines.append(f"##### Certificate {cert['certNumber']} ({cert['shares']:,} Shares - {cert['initialRecipient']})")
    lines.append(f"- **Genesis Date:** {cert['genesisDate']} | **Origin:** {cert['originType']}")
    lines.append(f"- **Current Status:** {cert['currentHolderOrStatus']}")
    lines.append(f"- **Clearing Broker:** {cert['brokerOrClearing']} | **Opinion Counsel:** {cert['opinionCounsel']}")
    lines.append("- **Custody Chain of Title:**")
    for hop in cert['custodyHops']:
        lines.append(f"  - **Step {hop['step']} ({hop['date']}):** `{hop['from']}` → `{hop['to']}`: {hop['action']}")
    lines.append(f"- **Evidentiary Anomalies:** {'; '.join(cert['redFlags'])}")
    lines.append(f"- **Primary Hard Drive Files:** {', '.join(cert['evidenceFiles'])}\\n")"""

graphic_block = """lines.append("#### Detailed Step-by-Step Graphic Custody Pedigree for Each and Every Certificate (31 Graphic Exhibits):\\n")
for cert in lineage.get('traceableCertificates', []):
    lines.append(f"##### Certificate {cert['certNumber']} ({cert['shares']:,} Shares - {cert['initialRecipient']})")
    lines.append(f"- **Genesis Date:** {cert['genesisDate']} | **Origin:** {cert['originType']}")
    lines.append(f"- **Current Status:** {cert['currentHolderOrStatus']}")
    lines.append(f"- **Clearing Broker:** {cert['brokerOrClearing']} | **Opinion Counsel:** {cert['opinionCounsel']}")
    lines.append("- **Graphic Chain-of-Custody Flowchart:**\\n")
    
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
    lines.append("```\\n")
    lines.append(f"- **Evidentiary Anomalies:** {'; '.join(cert['redFlags'])}")
    lines.append(f"- **Primary Hard Drive Files:** {', '.join(cert['evidenceFiles'])}\\n")"""

if target_block in rep_script:
    rep_script = rep_script.replace(target_block, graphic_block)
    with open('scripts/export_report.py', 'w') as f:
        f.write(rep_script)
    print("Updated scripts/export_report.py with graphic flowchart generation.")
else:
    print("Target block not matched exactly in scripts/export_report.py")

