import os, json, glob

def scan_hard_drive():
    roots = [
        '/Users/ericmiller/Desktop',
        '/Users/ericmiller/Downloads',
        '/Users/ericmiller/Documents',
        '/Users/ericmiller/Library/Mobile Documents'
    ]
    
    skip_dirs = {
        'node_modules', '.git', 'Pods', 'Caches', 'DerivedData', 'venv', '.venv',
        '.npm', '.cache', 'Application Support', 'Saved Application State',
        'Frameworks', 'CoreSimulator', 'Containers', 'Group Containers'
    }
    
    primary_terms = ['grnh', 'greengro']
    secondary_terms = [
        'cs1-7750', 'cs1-7678', 'cs1-7746', 'cs1-7800', 'cs1-7824', 'cs1-7835',
        'cs1-7905', 'cs1-7906', 'cs1-7908', 'cs1-7910', 'cs1-7915', 'cs1-7954',
        'cs1-7960', 'cs1-7971', 'cs1-7972', 'cs1-7978', 'cs1-8002', 'cs1-8087',
        'cs1-8108', 'cs1-8161', 'cs1-8162', 'cs1-8163', 'cs1-8164', 'cs1-8165',
        'cs1-8166', 'cs1-8167', 'cs1-8172', 'cs1-8173',
        'haas-gaines', 'haas_rule_26', 'gaines et al', 'paula marie poe',
        'big thunder', 'fidelity transfer services', 'stephen mills',
        'ruben sanchez', 'cheryl hintzen', 'joshua hintzen', 'delfin_grnh',
        'rubio_grnh', 'hulbert_grnh', 'pheonix_grnh', 'grow pods', 'cert list'
    ]
    
    discovered = []
    seen_paths = set()
    
    for r in roots:
        if not os.path.exists(r):
            continue
        for root, dirs, files in os.walk(r):
            dirs[:] = [d for d in dirs if d not in skip_dirs and not d.startswith('.')]
            for f in files:
                if f.startswith('.'):
                    continue
                fl = f.lower()
                is_match = False
                match_tag = ""
                if any(p in fl for p in primary_terms):
                    is_match = True
                    match_tag = "Direct GRNH Reference"
                elif any(s in fl for s in secondary_terms):
                    is_match = True
                    match_tag = "Forensic Certificate / Target Key"
                    
                if is_match:
                    fp = os.path.join(root, f)
                    if fp in seen_paths:
                        continue
                    seen_paths.add(fp)
                    try:
                        sz = os.path.getsize(fp)
                        ext = os.path.splitext(f)[1].lower()
                        
                        # Categorize
                        cat = "Stock Certificate & Scan"
                        if any(k in fl for k in ['legal', 'lgl', '4a1', 'opinion', '144 rep', 'broker rep']):
                            cat = "Legal Opinion & Rule 144 Letter"
                        elif any(k in fl for k in ['rule 26', 'court', 'usa_v', 'complaint', 'pleading', 'disclosure', 'cv2025', 'cv2020']):
                            cat = "Court Pleading & Criminal Record"
                        elif any(k in fl for k in ['consulting agreement', 'delfin', 'rubio', 'hulbert', 'pheonix']):
                            cat = "Sham Consulting Agreement"
                        elif any(k in fl for k in ['spa', 'stock purchase', 'waiver', 'settlement agreement']):
                            cat = "Stock Purchase Agreement (SPA)"
                        elif any(k in fl for k in ['fidelity', 'wire', 'loi', 'instruction', 'ruben', 'transfer agent']):
                            cat = "Transfer Agent Instruction & Wire"
                        elif any(k in fl for k in ['cert list', 'spreadsheet', 'data.xlsx', 'april 152019', 'chronology', 'record of']):
                            cat = "Nominee Share Ledger"
                        elif any(k in fl for k in ['merrill', 'exeter', 'pershing', 'huntington', 'wedbush', 'morgan stanley', 'acat', 'trade']):
                            cat = "Brokerage & Banking Record"
                            
                        # Detect linked certificates
                        linked_certs = []
                        cert_candidates = ['7750', '7678', '7746', '7800', '7812', '7813', '7814', '7824', '7835', '7848', '7905', '7906', '7908', '7910', '7915', '7954', '7960', '7970', '7971', '7972', '7978', '8002', '8087', '8108', '8158', '8159', '8160', '8161', '8162', '8163', '8164', '8165', '8166', '8167', '8172', '8173']
                        for c in cert_candidates:
                            if c in fl:
                                linked_certs.append(f'CS1-{c}' if not c.startswith('CS1-') else c)
                                
                        discovered.append({
                            'id': f'FILE-{len(discovered)+1:04d}',
                            'filename': f,
                            'path': fp,
                            'fileUrl': f'file://{fp}',
                            'sizeBytes': sz,
                            'sizeFormatted': f'{sz/1024:.1f} KB' if sz < 1048576 else f'{sz/1048576:.2f} MB',
                            'extension': ext,
                            'category': cat,
                            'matchTag': match_tag,
                            'directory': root,
                            'linkedCertificates': linked_certs
                        })
                    except Exception:
                        pass
                        
    return sorted(discovered, key=lambda x: (x['category'], x['filename']))

discovered_files = scan_hard_drive()
print(f"Total discovered files indexed from hard drive: {len(discovered_files)}")

raw_txs = [
    {
        "id": "TX-01",
        "date": "2016-10-14",
        "cert": "Multiple Initial",
        "shares": 2000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Ira Gaines",
        "type": "Stock Purchase Agreement",
        "price": "$20,000.00 ($0.01/share)",
        "status": "Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "None (Standard Restricted Issuance)",
        "phase": "phase_1_legal_nominal",
        "anomalies": ["Dual SPA executed on same date with differing pricing"],
        "notes": "SPA signed by James Haas as CEO. Initial discounted placement under Rule 144.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH data.xlsx", "GRNH SPA and consideration Oct 19 2016.pdf"]
    },
    {
        "id": "TX-02",
        "date": "2016-10-19",
        "cert": "CS1-7750",
        "shares": 2000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "IRA J. Gaines Revocable Trust",
        "type": "Stock Purchase Agreement",
        "price": "$80,000.00 ($0.04/share)",
        "status": "Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Initial Issuance (Rule 144 Restricted)",
        "phase": "phase_1_legal_nominal",
        "anomalies": [],
        "notes": "Payment documented via Morgan Stanley check on 10/20/2016. Certificate CS1-7750 issued.",
        "sources": ["GRNH IRA 2MM SHARES SPA 102016.pdf", "GRNH req for legal 2mm cert 7750 (6).pdf", "record of GRNH stock transactions.docx"]
    },
    {
        "id": "TX-03",
        "date": "2016-10-21",
        "cert": "CS1-7750",
        "shares": 2000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "IRA J. Gaines Revocable Trust",
        "type": "Physical Certificate Issuance",
        "price": "$80,000.00 ($0.04/share)",
        "status": "Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "None (Standard Restricted)",
        "phase": "phase_1_legal_nominal",
        "anomalies": [],
        "notes": "Certificate CS1-7750 physically issued pursuant to the 10/19/2016 SPA.",
        "sources": ["grnhgaines7750.pdf", "record of GRNH stock transactions.docx", "GRNH 7750 2MM RTT 10_19_18 2.pdf"]
    },
    {
        "id": "TX-04",
        "date": "2016-12-23",
        "cert": "CS1-7824",
        "shares": 1000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Ira Gaines",
        "type": "Direct Issuance",
        "price": "Not Stated / Consulting Consideration",
        "status": "Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Pending",
        "phase": "phase_1_legal_nominal",
        "anomalies": ["Immediate transfer executed 4 days later"],
        "notes": "Certificate CS1-7824 issued to Ira Gaines.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH CERTS.pdf"]
    },
    {
        "id": "TX-05",
        "date": "2016-12-27",
        "cert": "CS1-7824",
        "shares": 1000000,
        "from": "Ira Gaines",
        "to": "Merrill Lynch (Acct 2872-57N77)",
        "type": "Irrevocable Stock Power Transfer",
        "price": "For Value Received",
        "status": "Transferred for Deposit",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "None Attached",
        "phase": "phase_2_accelerated_flip",
        "anomalies": ["Ultra-rapid flip (<4 days from issuance)", "Deposit into brokerage without registered prospectus"],
        "notes": "Irrevocable Stock Power executed to transfer 1M shares to Merrill Lynch account.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH Certs 7814 and 7813 overnight to ML 120816.pdf"]
    },
    {
        "id": "TX-06",
        "date": "2017-01-04",
        "cert": "CS1-7835",
        "shares": 3000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Ira Gaines",
        "type": "Direct Issuance",
        "price": "Not Stated (Noted: 'BOT FROM RON')",
        "status": "Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "None Attached",
        "phase": "phase_2_accelerated_flip",
        "anomalies": ["Internal ledger notation indicates secondary nominee trading"],
        "notes": "Certificate CS1-7835 issued. Noted in Gaines internal inventory as 'BOT FROM RON'. Later transferred to Poe in 2019.",
        "sources": ["CERT LIST.xlsx", "record of GRNH stock transactions.docx"]
    },
    {
        "id": "TX-07",
        "date": "2017-03-30",
        "cert": "Gaines Portfolio Tranche",
        "shares": 1150000,
        "from": "Ira J. Gaines",
        "to": "Exeter Trust Company (For Sale)",
        "type": "Authorization to Sell & Liquidate",
        "price": "Market Liquidation",
        "status": "Free-trading Sale",
        "ta": "Exeter Trust Administration",
        "opinion": "Exeter Trust Clearance",
        "phase": "phase_2_accelerated_flip",
        "anomalies": ["Proceeds wired directly to personal BBVA Compass Bank account", "Circumvention of standard affiliate volume limits"],
        "notes": "Letter authorizing Exeter Trust to sell 1.15M shares and wire net proceeds to BBVA Compass Bank account.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH 01222017 3MM AT .03.pdf"]
    },
    {
        "id": "TX-08",
        "date": "2017-03-31",
        "cert": "CS1-7906",
        "shares": 3500000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Ira Gaines",
        "type": "Certificate Issuance",
        "price": "Not Stated",
        "status": "Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Pending",
        "phase": "phase_2_accelerated_flip",
        "anomalies": ["Transferred 3 days later to Cede & Co."],
        "notes": "Certificate CS1-7906 issued for 3.5M shares.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH Cheryl 3.5MM.pdf"]
    },
    {
        "id": "TX-09",
        "date": "2017-04-03",
        "cert": "CS1-7906",
        "shares": 3500000,
        "from": "Ira Gaines",
        "to": "Cede & Co. (Exeter Trust Admin)",
        "type": "Stock Power Transfer",
        "price": "For Value Received",
        "status": "Transferred to Nominee Depot",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Pending",
        "phase": "phase_2_accelerated_flip",
        "anomalies": ["Transfer 3 days after certificate issuance", "Routing through DTC nominee Cede & Co."],
        "notes": "Irrevocable stock power executed transferring 3.5M shares to Cede & Co.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH Cheryl 3.5MM.pdf"]
    },
    {
        "id": "TX-10",
        "date": "2017-04-05",
        "cert": "CS1-7908",
        "shares": 4000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Paradise Wire & Cable, Inc.",
        "type": "Certificate Issuance",
        "price": "Not Stated",
        "status": "Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Pending",
        "phase": "phase_2_accelerated_flip",
        "anomalies": ["Entity controlled by Gaines used as intermediary nominee conduit"],
        "notes": "Certificate CS1-7908 issued to Paradise Wire & Cable (Ira Gaines affiliate).",
        "sources": ["record of GRNH stock transactions.docx", "GRNH 4MM Paradise.pdf"]
    },
    {
        "id": "TX-11",
        "date": "2017-04-06",
        "cert": "CS1-7910",
        "shares": 2000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Ira Gaines",
        "type": "Certificate Issuance",
        "price": "Not Stated",
        "status": "Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Pending (Later Mills Legal Opinion)",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Transferred to attorney Stephen Mills for legend removal without verified holding period"],
        "notes": "Certificate CS1-7910 issued. Later cleared for trading via legal opinion letter.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH 7910 7881.pdf"]
    },
    {
        "id": "TX-12",
        "date": "2017-04-07",
        "cert": "2902 & 2904",
        "shares": 1461209,
        "from": "Northstar Electronics (Trustee for Paradise Wire)",
        "to": "Pershing LLC",
        "type": "DWAC / Brokerage Transfer",
        "price": "Market Deposit",
        "status": "Brokerage Clearance",
        "ta": "FTS / DTC",
        "opinion": "Opinion Attached",
        "phase": "phase_2_accelerated_flip",
        "anomalies": ["Off-market allocation through shell electronics trustee entity"],
        "notes": "Transfer of 1,461,209 shares into Pershing LLC account.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH GUBIN SETTLEMENT SHARES 7746 7678.pdf"]
    },
    {
        "id": "TX-13",
        "date": "2017-04-07",
        "cert": "CS1-7908",
        "shares": 4000000,
        "from": "Paradise Wire & Cable DBPP",
        "to": "Pershing LLC",
        "type": "Stock Power Deposit",
        "price": "Market Liquidation",
        "status": "Deposited to Brokerage",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Legal Opinion Submitted",
        "phase": "phase_2_accelerated_flip",
        "anomalies": ["Transferred 2 days after issuance", "Defined Benefit Pension Plan used for microcap dumping"],
        "notes": "Certificate CS1-7908 deposited into Pershing LLC account 2 days after issuance.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH 4MM Paradise.pdf"]
    },
    {
        "id": "TX-14",
        "date": "2017-04-18",
        "cert": "CS1-7915",
        "shares": 3500000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Ira Gaines",
        "type": "Certificate Issuance",
        "price": "Not Stated",
        "status": "Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Pending",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Bulk issuance directly preceding broker account allocation"],
        "notes": "Certificate CS1-7915 issued for 3.5M shares.",
        "sources": ["record of GRNH stock transactions.docx", "CERT LIST.xlsx"]
    },
    {
        "id": "TX-15",
        "date": "2017-04-24",
        "cert": "Multiple Brokerage Tranches",
        "shares": 5500000,
        "from": "Gaines Controlled Nominees",
        "to": "Huntington Brokerage Account",
        "type": "Brokerage Deposit",
        "price": "Open Market Liquidation",
        "status": "Free-trading Deposit",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Cleared by Brokerage Counsel",
        "phase": "phase_2_accelerated_flip",
        "anomalies": ["Multiple tranches aggregated into newly opened regional bank brokerage"],
        "notes": "Deposit of 5.5M shares into Huntington brokerage account.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH 1MM for Wedbush 2.pdf"]
    },
    {
        "id": "TX-16",
        "date": "2017-05-01",
        "cert": "Advisory Tranche Delfin",
        "shares": 6500000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Mark Delfin (Consultant)",
        "type": "Sham Consulting Agreement (Backdated)",
        "price": "$0.00 / Advisory Services",
        "status": "Rule 144 Restricted (Backdated)",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Section 4(a)(1) Exemption Recited",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Backdated by 4 years (Start date: Sept 9, 2013 on May 1, 2017 agreement)", "Designed to fabricate 1-year Rule 144 holding period"],
        "notes": "Agreement signed by James Haas as CEO promising 6.5M Rule 144 restricted shares for services backdated 4 years.",
        "sources": ["CONSULTING AGREEMENT_Delfin_GRNH.docx", "FINAL CONSULTING AGREEMENT_Delfin_GRNH (4).docx"]
    },
    {
        "id": "TX-17",
        "date": "2017-05-01",
        "cert": "Advisory Tranche Rubio",
        "shares": 8500000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Santiago Rubio (Consultant)",
        "type": "Sham Consulting Agreement (Backdated)",
        "price": "$0.00 / Advisory Services",
        "status": "Rule 144 Restricted (Backdated)",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Section 4(a)(1) Exemption Recited",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Backdated start date to Oct 30, 2015", "Enormous 8.5M share block issued to individual consultant"],
        "notes": "Agreement signed by James Haas promising 8.5M Rule 144 restricted shares.",
        "sources": ["CONSULTING AGREEMENT_Rubio_GRNH.docx", "FINAL CONSULTING AGREEMENT_Rubio_GRNH.docx"]
    },
    {
        "id": "TX-18",
        "date": "2017-05-01",
        "cert": "Advisory Tranche Phoenix",
        "shares": 2000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Phoenix Theater (Arizona Corp)",
        "type": "Consulting Agreement",
        "price": "$0.00 / Services",
        "status": "Rule 144 Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Section 4(a)(1) Recited",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Corporate conduit entity in Arizona receiving microcap stock"],
        "notes": "2,000,000 shares issued to Phoenix Theater.",
        "sources": ["CONSULTING AGREEMENT_PHEONIX_GRNH.docx"]
    },
    {
        "id": "TX-19",
        "date": "2017-05-01",
        "cert": "Advisory Tranche Hulbert",
        "shares": 8500000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Hulbert (Consultant)",
        "type": "Consulting Agreement",
        "price": "$0.00 / Services",
        "status": "Rule 144 Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Section 4(a)(1) Recited",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["8.5M shares issued with nominal advisory obligations"],
        "notes": "Agreement promising 8.5M shares to Hulbert.",
        "sources": ["CONSULTING AGREEMENT_Hulbert_GRNH.docx", "FINAL FINAL CONSULTING AGREEMENT_Hulbert_GRNH.docx"]
    },
    {
        "id": "TX-20",
        "date": "2017-08-02",
        "cert": "CS1-7960",
        "shares": 500000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Ira Gaines",
        "type": "Certificate Issuance",
        "price": "Not Stated",
        "status": "Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Pending",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Part of 10-certificate split tranche distributed among family members"],
        "notes": "Certificate CS1-7960 issued for 500k shares. Transferred to Big Thunder LLC in 2018.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH Josh 1MM.pdf"]
    },
    {
        "id": "TX-21",
        "date": "2017-08-09",
        "cert": "CS1-7960 to 7969 (Series)",
        "shares": 4000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Joshua Hintzen",
        "type": "Series Certificate Issuance",
        "price": "Nominal / Familial Transfer",
        "status": "Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Pending",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Structured in exactly 500k and 1M share chunks across 10 certificates", "Nominee conduit to avoid affiliate threshold alerts"],
        "notes": "Certificates CS1-7961 through 7969 issued to Joshua Hintzen. Transferred to Big Thunder LLC and Poe in 2018-2019.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH certs to be put in new name Josh Hintzen.pdf"]
    },
    {
        "id": "TX-22",
        "date": "2017-12-06",
        "cert": "CS1-7750",
        "shares": 2000000,
        "from": "IRA J. Gaines Revocable Trust",
        "to": "IRA J. Gaines Revocable Trust (Free-Trading)",
        "type": "Legal Opinion Legend Removal",
        "price": "N/A",
        "status": "Legend Removed / Free-Trading",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Attorney Stephen Mills Section 4(a)(1) Opinion Letter",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Opinion issued despite affiliate relationship of Gaines to GreenGro", "Circumvention of SEC Rule 144 holding period rules"],
        "notes": "Attorney Stephen Mills authored Section 4(a)(1) opinion letter directing Fidelity Transfer Services to remove restrictive legend.",
        "sources": ["GRNH-4a1 Opinion Letter Draft II (4) (2).pdf", "GRNH req for legal 2mm cert 7750 (6).pdf", "GRNH7750 2MM request for updated legal opinion form you Stephen.pdf"]
    },
    {
        "id": "TX-23",
        "date": "2018-05-15",
        "cert": "CS1-7971 & CS1-7972",
        "shares": 5500000,
        "from": "Joshua Hintzen",
        "to": "Justin / Free-Trading Transfer",
        "type": "Legal Opinion Legend Removal & Transfer",
        "price": "N/A",
        "status": "Legend Removed / Transferred",
        "ta": "FTS (Ruben Sanchez)",
        "opinion": "Attorney James Hintzen Opinion (JHintzen-GRNH-LglOpLtr-CS1-7971-7972-2ndSet)",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Family member attorney issuing opinion for family member shareholder", "Direct conflict of interest"],
        "notes": "James Hintzen, Esq. authored legal opinion letter authorizing legend removal on 5.5M shares held by Joshua Hintzen.",
        "sources": ["GRNH JOSH 7971 7972 to justin.pdf", "GRNH Josh 5 qnd a hal mmilion.pdf"]
    },
    {
        "id": "TX-24",
        "date": "2018-08-20",
        "cert": "Big Thunder Fleet",
        "shares": 4000000,
        "from": "Big Thunder, LLC",
        "to": "Wedbush Securities (Deposit)",
        "type": "Rule 144 Representation Filing",
        "price": "Market Liquidation",
        "status": "Deposited to Brokerage",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Rule 144 Seller Representation Letter",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Shell company claiming non-affiliate status despite beneficial control by Ira Gaines"],
        "notes": "Big Thunder LLC 144 representation letter filed to facilitate brokerage clearing at Wedbush.",
        "sources": ["Big Thunder 144 Representation Letter (2) - August 20 - SAGD-1.docx", "BIG THUNDER application WDCO.pdf"]
    },
    {
        "id": "TX-25",
        "date": "2018-12-03",
        "cert": "7960 to 7969 Series",
        "shares": 4000000,
        "from": "Joshua Hintzen",
        "to": "Big Thunder, LLC",
        "type": "Nominee Consolidation Transfer",
        "price": "$10.00 & Other Good Consideration",
        "status": "Transferred to Shell",
        "ta": "Fidelity Transfer Services (Ruben Sanchez)",
        "opinion": "FTS Processing",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Concealment of individual ownership inside newly formed Wyoming LLC"],
        "notes": "9 certificates sent to Ruben Sanchez at Fidelity Transfer Services to be reissued into Big Thunder LLC.",
        "sources": ["GRNH SENT TO TA to be put in Big Thunder Name 9 certs.pdf", "GRNH going to Ruben to be put in Big thunder with LOI's.pdf"]
    },
    {
        "id": "TX-26",
        "date": "2018-12-03",
        "cert": "CS1-7960",
        "shares": 500000,
        "from": "Ira Gaines",
        "to": "Big Thunder, LLC",
        "type": "Nominee Consolidation Transfer",
        "price": "$10.00 & Consideration",
        "status": "Transferred to Shell",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "FTS Processing",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Transfer of personal shares to shell entity prior to liquidations"],
        "notes": "Certificate CS1-7960 transferred to Big Thunder LLC.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH SENT TO TA to be put in Big Thunder Name 9 certs.pdf"]
    },
    {
        "id": "TX-27",
        "date": "2018-12-15",
        "cert": "CS1-8002",
        "shares": 4000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Big Thunder, LLC",
        "type": "Certificate Issuance",
        "price": "Not Stated",
        "status": "Restricted",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Rule 144 Opinion Pending",
        "phase": "phase_3_opinion_shopping",
        "anomalies": ["Direct corporate issuance to shell entity"],
        "notes": "Certificate CS1-8002 issued to Big Thunder LLC for 4,000,000 shares.",
        "sources": ["GRNH 8002 4MM shares BTLLC.pdf", "Big Thunder Contract.docx"]
    },
    {
        "id": "TX-28",
        "date": "2019-03-27",
        "cert": "CS1-7835",
        "shares": 3000000,
        "from": "Ira Gaines",
        "to": "Paula Marie Poe",
        "type": "Nominee Straw Assignment",
        "price": "$21,000.00 ($0.007/share)",
        "status": "Transferred to Foreign Straw",
        "ta": "FTS (Ruben Sanchez)",
        "opinion": "Foreign Straw Exemption / Section 4(a)(1)",
        "phase": "phase_4_illegal_dump",
        "anomalies": ["Sale at $0.007/share represents 90% discount to prevailing OTC market", "Foreign straw recipient with zero business purpose"],
        "notes": "Irrevocable stock power executed transferring Certificate CS1-7835 (originally issued in Jan 2017) to foreign nominee Paula Marie Poe.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH april 152019.xlsx", "GRNH 8161 8162 8 and a half million POE.pdf"]
    },
    {
        "id": "TX-29",
        "date": "2019-03-27",
        "cert": "7964, 7965, 7966, 7968, 7969",
        "shares": 2500000,
        "from": "Joshua Hintzen",
        "to": "Paula Marie Poe",
        "type": "Nominee Straw Assignment",
        "price": "$17,500.00 ($0.007/share)",
        "status": "Transferred to Foreign Straw",
        "ta": "FTS (Ruben Sanchez)",
        "opinion": "Transferred for Reissuance",
        "phase": "phase_4_illegal_dump",
        "anomalies": ["Five 500k certificates aggregated and assigned simultaneously to foreign straw"],
        "notes": "Stock power transferring 5 certificates totaling 2.5M shares to Paula Marie Poe.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH april 152019.xlsx"]
    },
    {
        "id": "TX-30",
        "date": "2019-04-03",
        "cert": "CS1-8158 & CS1-8160",
        "shares": 5000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Paula Marie Poe",
        "type": "Physical Reissuance",
        "price": "$0.007/share Basis",
        "status": "Issued to Straw",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Exemption Recited",
        "phase": "phase_4_illegal_dump",
        "anomalies": ["Direct issuance of 5M shares to offshore nominee"],
        "notes": "Certificates CS1-8158 and CS1-8160 issued to Paula Marie Poe.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH april 152019.xlsx", "CERT LIST.xlsx"]
    },
    {
        "id": "TX-31",
        "date": "2019-04-03",
        "cert": "CS1-8159",
        "shares": 3000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Paula Marie Poe",
        "type": "Physical Reissuance",
        "price": "$0.007/share Basis",
        "status": "Issued to Straw",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Exemption Recited",
        "phase": "phase_4_illegal_dump",
        "anomalies": ["Reissuance replacing cancelled domestic restricted certificate CS1-7835"],
        "notes": "Certificate CS1-8159 issued to Paula Marie Poe replacing CS1-7835.",
        "sources": ["record of GRNH stock transactions.docx", "GRNH april 152019.xlsx"]
    },
    {
        "id": "TX-32",
        "date": "2019-04-08",
        "cert": "CS1-8166",
        "shares": 5500000,
        "from": "Justin (8087) & IGRT Trust (7750)",
        "to": "Paula Marie Poe",
        "type": "Consolidation & Reissuance",
        "price": "$0.007/share Basis",
        "status": "Reissued to Straw",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Clean Legal Opinion Claimed",
        "phase": "phase_4_illegal_dump",
        "anomalies": ["AMALGAMATION OF 2016 RESTRICTED SHARES WITH LATER CERTIFICATES TO CONCEAL PROVENANCE"],
        "notes": "Certificate CS1-8166 created by merging Certificate 8087 (3.5M shares from Justin) and Certificate 7750 (2.0M shares from IRA J Gaines Revocable Trust) into a single 5.5M share certificate in the name of Paula Marie Poe.",
        "sources": ["GRNH april 152019.xlsx", "record of GRNH stock transactions.docx", "GRNH 8161 - 8165 22MM shares 2.pdf"]
    },
    {
        "id": "TX-33",
        "date": "2019-04-08",
        "cert": "CS1-8167",
        "shares": 8500000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Paula Marie Poe",
        "type": "Certificate Issuance",
        "price": "$0.007/share Basis",
        "status": "Issued to Straw",
        "ta": "Fidelity Transfer Services, Inc.",
        "opinion": "Exemption Recited",
        "phase": "phase_4_illegal_dump",
        "anomalies": ["Massive 8.5M block issued without registration statement"],
        "notes": "Certificate CS1-8167 issued to Paula Marie Poe for 8.5M shares.",
        "sources": ["GRNH april 152019.xlsx", "record of GRNH stock transactions.docx"]
    },
    {
        "id": "TX-34",
        "date": "2019-04-08",
        "cert": "CS1-8161 to 8165",
        "shares": 22000000,
        "from": "GreenGro Technologies, Inc.",
        "to": "Paula Marie Poe",
        "type": "Mega-Block Reissuance",
        "price": "$0.007/share Basis",
        "status": "Issued to Straw",
        "ta": "Fidelity Transfer Services (Ruben Sanchez)",
        "opinion": "Exemption Recited",
        "phase": "phase_4_illegal_dump",
        "anomalies": ["22,000,000 SHARES SPLIT ACROSS 5 CONSECUTIVE CERTIFICATES TO FACILITATE SIMULTANEOUS BROKERAGE DEPOSITS"],
        "notes": "Certificates CS1-8161 through 8165 totaling 22M shares issued to Paula Marie Poe. Documented in primary scan PDF: GRNH 8161 - 8165 22MM shares 2.pdf.",
        "sources": ["GRNH 8161 - 8165 22MM shares 2.pdf", "GRNH 8161 8162 8 and a half million POE.pdf", "GRNH april 152019.xlsx"]
    },
    {
        "id": "TX-35",
        "date": "2019-04-10",
        "cert": "CS1-7978",
        "shares": 10000000,
        "from": "James Haas (CEO)",
        "to": "Ira Gaines",
        "type": "Executive Stock Purchase Agreement",
        "price": "$70,000.00 ($0.007/share)",
        "status": "Restricted / Disputed",
        "ta": "FTS (Ruben Sanchez)",
        "opinion": "144 Restricted / 4a1 Recited",
        "phase": "phase_4_illegal_dump",
        "anomalies": ["CEO selling 10M company shares to convicted target at 90% discount", "Subject of 2025 Maricopa County Superior Court Lawsuit"],
        "notes": "SPA signed by James Haas selling 10M shares (Certificate CS1-7978) to Ira Gaines. Operative agreement in Cheryl Hintzen v. James Haas (CV2025-013574).",
        "sources": ["DEFENDANT_HAAS_RULE_26_1_SUPPLEMENTAL_DISCLOSURE_with_contact_info.pdf", "record of GRNH stock transactions.docx"]
    },
    {
        "id": "TX-36",
        "date": "2019-05-06",
        "cert": "CS1-7978 & Reissuances",
        "shares": 27000000,
        "from": "James Haas (CEO)",
        "to": "Ira Gaines (10M) & James Haas (17M)",
        "type": "Transfer Agent Direct Email Instruction",
        "price": "Internal Allocation",
        "status": "Transfer Agent Directive",
        "ta": "FTS (Ruben Sanchez & Owen Naccarato)",
        "opinion": "None Attached",
        "phase": "phase_4_illegal_dump",
        "anomalies": ["CEO splits 27M shares via informal email directive: 'Send 10M to Ira Gaines and 17M back to me'", "No Board resolution or SEC Form 4 filed"],
        "notes": "Documented in Haas Rule 26.1 Disclosure at page 4: Email from James Haas to Ruben Sanchez and Owen Naccarato instructing split of 27 million shares.",
        "sources": ["DEFENDANT_HAAS_RULE_26_1_SUPPLEMENTAL_DISCLOSURE_with_contact_info.pdf", "Fidelity Transfer Services GRNH wire inst.docx"]
    },
    {
        "id": "TX-37",
        "date": "2020-12-15",
        "cert": "All Subject Certificates",
        "shares": 107361209,
        "from": "United States Department of Justice",
        "to": "Ira Jeffrey Gaines (Arrest & Seizure)",
        "type": "Federal Criminal Indictment & Arrest",
        "price": "$0.00 (Asset Seizure & Forfeiture)",
        "status": "Subject to Criminal Forfeiture",
        "ta": "N/A (Federal Injunction)",
        "opinion": "Grand Jury True Bill Indictment",
        "phase": "phase_5_criminal_enforcement",
        "anomalies": ["17-count federal felony indictment for securities fraud, wire fraud, money laundering, and identity theft", "Use of straw nominees and sham advisory agreements documented by FBI & DOJ"],
        "notes": "USA v. Gaines et al., Case No. 2:21-cr-00266 (D. Ariz.). Arrest of Ira Gaines in Scottsdale, AZ. Indictment explicitly charges sham stock purchase agreements, straw nominees, and money laundering of microcap proceeds.",
        "sources": ["USA_v_Gaines_et_al__azdce-21-00266__0124.0.pdf", "FACTUAL BASIS LINE 16 PAGE 10.docx", "record of GRNH stock transactions.docx"]
    },
    {
        "id": "TX-38",
        "date": "2025-05-15",
        "cert": "CS1-7978 & Portfolio Holdings",
        "shares": 10000000,
        "from": "Cheryl Hintzen (Plaintiff)",
        "to": "James M. Haas (Defendant)",
        "type": "State Superior Court Breach of Contract Action",
        "price": "$350,000.00 Claimed Damages",
        "status": "Active Civil Litigation",
        "ta": "Fidelity Transfer Services (Subject of Discrepancies)",
        "opinion": "Pleadings & Rule 26.1 Disclosure",
        "phase": "phase_5_criminal_enforcement",
        "anomalies": ["Plaintiff Cheryl Hintzen suing CEO James Haas claiming rights derived from Ira Gaines", "Haas asserts Unclean Hands, Securities Illegality, Sham Assignments, and 120M share transfer agent discrepancies"],
        "notes": "Cheryl Hintzen v. James M. Haas, Case No. CV2025-013574 (Maricopa County Superior Court). Haas Rule 26.1 Disclosure identifies massive 29M, 78M, and 120M share discrepancies at Fidelity Transfer Services and connects claims directly to federal criminal conduct.",
        "sources": ["DEFENDANT_HAAS_RULE_26_1_SUPPLEMENTAL_DISCLOSURE_with_contact_info.pdf", "DEFENDANT HAAS’ RULE 26.1 SUPPLEMENTAL DISCLOSURE(FILE).pdf"]
    }
]

cert_map = {}
for tx in raw_txs:
    c = tx['cert']
    if c not in cert_map:
        cert_map[c] = {
            'certNumber': c,
            'totalShares': tx['shares'],
            'issuances': [],
            'transfers': [],
            'legalOpinions': [],
            'anomalies': list(tx['anomalies']),
            'currentHolder': tx['to'],
            'phase': tx['phase']
        }
    cert_map[c]['issuances'].append({
        'txId': tx['id'],
        'date': tx['date'],
        'shares': tx['shares'],
        'from': tx['from'],
        'to': tx['to'],
        'price': tx['price'],
        'notes': tx['notes']
    })
    for a in tx['anomalies']:
        if a not in cert_map[c]['anomalies']:
            cert_map[c]['anomalies'].append(a)
    if tx['opinion'] and 'None' not in tx['opinion'] and 'Pending' not in tx['opinion']:
        if tx['opinion'] not in cert_map[c]['legalOpinions']:
            cert_map[c]['legalOpinions'].append(tx['opinion'])

database = {
    'meta': {
        'ticker': 'GRNH',
        'companyName': 'GreenGro Technologies, Inc.',
        'caseCaptions': [
            'USA v. Gaines et al., Case No. 2:21-cr-00266 (D. Ariz.)',
            'Cheryl Hintzen v. James M. Haas, Case No. CV2025-013574 (Ariz. Super. Ct., Maricopa Cnty.)',
            'GreenGro Technologies, Inc. v. Gaines et al., Case No. CV2020-015738 (Ariz. Super. Ct.)'
        ],
        'auditorDesk': 'Forensic Securities Litigation & Stock Anomaly Audit Desk',
        'generatedAt': '2026-10-15T14:46:00Z',
        'totalSharesTracked': 107361209,
        'totalTransactions': len(raw_txs),
        'totalCertificates': len(cert_map),
        'totalDiscoveredFiles': len(discovered_files),
        'anomaliesDetected': sum(len(tx['anomalies']) for tx in raw_txs)
    },
    'evidentiaryPhases': [
        {
            'id': 'phase_1_legal_nominal',
            'name': 'Phase 1: Legal / Nominal Issuance (Oct – Dec 2016)',
            'color': '#10b981',
            'period': 'October 2016 – December 2016',
            'summary': 'Documented direct private placements under Rule 144 / Section 4(a)(1) with valid restricted legends, executed stock purchase agreements (SPA), and documented banking checks from Morgan Stanley ($0.04/share).',
            'riskLevel': 'Low / Documented Basis',
            'badges': ['Rule 144 Restricted', 'Documented Consideration', 'Morgan Stanley Check']
        },
        {
            'id': 'phase_2_accelerated_flip',
            'name': 'Phase 2: Accelerated Flipping & Nominee Transfers (Early 2017)',
            'color': '#06b6d4',
            'period': 'January 2017 – May 2017',
            'summary': 'Sudden velocity increase. Shares transferred within 4 days of issuance via irrevocable stock powers to Merrill Lynch, Exeter Trust, Cede & Co., and Huntington accounts for open-market liquidation with proceeds wired to personal accounts.',
            'riskLevel': 'Elevated / Velocity Anomaly',
            'badges': ['<4 Day Turnaround', 'Irrevocable Stock Powers', 'Exeter Trust Wires']
        },
        {
            'id': 'phase_3_opinion_shopping',
            'name': 'Phase 3: Sham Consulting & Opinion Shopping (Mid 2017 – 2018)',
            'color': '#f59e0b',
            'period': 'June 2017 – December 2018',
            'summary': 'Issuance of 25.5M+ shares to shell consultants (Delfin, Rubio, Hulbert, Phoenix Theater) with backdated agreements dating back 4 years to manufacture fake Rule 144 seasoning. Reliance on opinion letters by attorneys Stephen Mills and James Hintzen to strip legends.',
            'riskLevel': 'High / Regulatory & Securities Law Violation',
            'badges': ['4-Year Backdated Contracts', 'Section 4(a)(1) Opinion Shopping', '25.5M Advisory Shares']
        },
        {
            'id': 'phase_4_illegal_dump',
            'name': 'Phase 4: Massive Offshore Straw Dumping (Early 2019)',
            'color': '#ef4444',
            'period': 'January 2019 – May 2019',
            'summary': "Consolidation of over 30,450,000 shares into a single foreign nominee, Paula Marie Poe, at $0.007/share (90% below market), funded via Fidelity Transfer Services and Bank of America accounts, followed by immediate open-market dumping. Haas instructs Sanchez: 'Send 10M to Gaines and 17M back to me.'",
            'riskLevel': 'Critical / Fraudulent Concealment & Section 5 Violations',
            'badges': ['90% Price Discount', 'Paula Marie Poe Straw', '30.45M Amalgamation']
        },
        {
            'id': 'phase_5_criminal_enforcement',
            'name': 'Phase 5: Federal Indictment & Superior Court Actions (2020 – 2025)',
            'color': '#8b5cf6',
            'period': 'December 2020 – 2025',
            'summary': 'Arrest of Ira Gaines on December 15, 2020. 17-count federal indictment in USA v. Gaines (2:21-cr-00266) charging securities fraud, wire fraud, money laundering, and identity theft. Subsequent Maricopa County Superior Court lawsuits (CV2020-015738 and Cheryl Hintzen v. James M. Haas, CV2025-013574) exposing 29M, 78M, and 120M share transfer agent discrepancies.',
            'riskLevel': 'Criminal Record & Civil Fraud Defense',
            'badges': ['17 Federal Felony Counts', 'Ariz. Super. Ct. CV2025-013574', '120M Discrepancy']
        }
    ],
    'entities': [
        {
            'name': 'Ira Jeffrey Gaines',
            'role': 'Primary Target / Beneficial Controller',
            'description': 'Criminal defendant in USA v. Gaines (2:21-cr-00266). Controlled beneficial ownership of tens of millions of GRNH shares through revocable trusts, nominee accounts, and shell entities (Big Thunder LLC, Paradise Wire & Cable).',
            'entities': ['IRA J. Gaines Revocable Trust', 'Big Thunder, LLC', 'Paradise Wire & Cable, Inc.'],
            'status': 'Indicted / Target'
        },
        {
            'name': "James 'Boe' Haas",
            'role': 'CEO of GreenGro Technologies / Co-Defendant / Discloser',
            'description': 'Chief Executive Officer and Director of GreenGro Technologies, Inc. Executed SPAs, stock issuances, and consulting agreements. Defendant in Cheryl Hintzen v. James M. Haas (CV2025-013574), in which he filed a comprehensive Rule 26.1 disclosure exposing the nominee scheme and transfer agent discrepancies.',
            'entities': ['GreenGro Technologies, Inc.', 'Haas, Inc.'],
            'status': 'Executive / Defendant'
        },
        {
            'name': 'Paula Marie Poe',
            'role': 'Foreign Nominee / Straw Seller',
            'description': 'Foreign individual used as nominee straw recipient for 30,450,000 GRNH shares across certificates CS1-8158 through 8173 in April 2019 at $0.007/share. Shares were immediately deposited into brokerage accounts and liquidated for cash.',
            'entities': ['GreenGro Technologies, Inc.', 'Fidelity Transfer Services'],
            'status': 'Nominee Straw Recipient'
        },
        {
            'name': 'Joshua Hintzen & Cheryl Hintzen',
            'role': 'Intermediary Holders / Family Conduit Network / Civil Plaintiff',
            'description': 'Recipients of multiple 500k to 5M share tranches (e.g. certificates CS1-7960 through CS1-7969). Later transferred shares into Big Thunder LLC and Paula Marie Poe. Cheryl Hintzen subsequently sued James Haas in Maricopa County Superior Court (CV2025-013574) for failure to remove stock legends.',
            'entities': ['Big Thunder LLC', 'Cheryl Hintzen Trading Account'],
            'status': 'Conduit / Assignor / Civil Plaintiff'
        },
        {
            'name': 'Stephen Mills, Esq.',
            'role': 'Opinion Attorney',
            'description': 'Attorney who authored Section 4(a)(1) legal opinion letters authorizing Fidelity Transfer Services to remove restrictive legends from certificates CS1-7750, 7905, 7910, facilitating free-trading status without required bona fide holding periods.',
            'entities': ['Law Office of Stephen Mills'],
            'status': 'Legal Opinion Issuer'
        },
        {
            'name': 'James Hintzen, Esq.',
            'role': 'Opinion Attorney',
            'description': 'Attorney who authored legal opinion letter JHintzen-GRNH-LglOpLtr-CS1-7971-7972-2ndSet authorizing restriction removal on certificates CS1-7971 and CS1-7972.',
            'entities': ['Hintzen Law'],
            'status': 'Legal Opinion Issuer'
        },
        {
            'name': 'Fidelity Transfer Services, Inc. (Ruben Sanchez)',
            'role': 'Primary Stock Transfer Agent',
            'description': 'Transfer agent that maintained GreenGro share register, processed stock powers, cancelled restricted certificates, and reissued free-trading shares to nominees upon receiving legal opinions. Cited in court disclosures for handling 29M, 78M, and 120M questionable shares.',
            'entities': ['Fidelity Transfer Services, Inc.'],
            'status': 'Transfer Agent / Target of Scrutiny'
        },
        {
            'name': 'Mark Delfin / Santiago Rubio / Hulbert',
            'role': 'Sham Advisory Consultants',
            'description': 'Individuals who signed consulting agreements backdated 2 to 4 years to receive 6.5M to 8.5M restricted shares each, manufacturing simulated Rule 144 holding periods for subsequent legend removal.',
            'entities': ['GreenGro Consulting Fleet'],
            'status': 'Nominee Consultants'
        }
    ],
    'fraudPatterns': [
        {
            'id': 'backdated_consulting',
            'title': 'Backdated Advisory Contracts (Rule 144 Manufacture)',
            'severity': 'Critical',
            'statutoryViolation': 'Securities Act Section 5 / Rule 144(d) Holding Period Fraud',
            'description': "Agreements executed on May 1, 2017 (e.g. Delfin, Rubio, Hulbert) explicitly backdated the 'Description of Services' starting date by 4 years to September 9, 2013. This created the false documentary appearance of a satisfied 1-year Rule 144 holding period to induce transfer agents to remove restrictive legends.",
            'affectedCertificates': ['CS1-7910', 'CS1-7915', 'CS1-7960-7969', 'CS1-8002'],
            'primaryEvidenceFiles': ['CONSULTING AGREEMENT_Delfin_GRNH.docx', 'CONSULTING AGREEMENT_Rubio_GRNH.docx', 'CONSULTING AGREEMENT_Hulbert_GRNH.docx']
        },
        {
            'id': 'velocity_flip',
            'title': 'Hyper-Velocity Nominee Flipping (<72 Hours)',
            'severity': 'High',
            'statutoryViolation': 'Underwriter Status / Section 2(a)(11) Distribution Conduit',
            'description': 'Restricted certificates issued to nominees were immediately endorsed via irrevocable stock powers within 3 to 4 days of issuance and routed to Merrill Lynch, Exeter Trust, and Cede & Co. for open-market dump, violating statutory investment intent.',
            'affectedCertificates': ['CS1-7824', 'CS1-7906', 'CS1-7908'],
            'primaryEvidenceFiles': ['GRNH Certs 7814 and 7813 overnight to ML 120816.pdf', 'GRNH Cheryl 3.5MM.pdf', 'GRNH 01222017 3MM AT .03.pdf']
        },
        {
            'id': 'offshore_straw',
            'title': 'Massive Offshore Straw Consolidation (Paula Marie Poe)',
            'severity': 'Critical',
            'statutoryViolation': 'Securities Exchange Act Section 10(b) / Rule 10b-5 Scheme Liability',
            'description': 'In April 2019, 30,450,000 shares across certificates CS1-8158 through CS1-8173 were amalgamated and issued to foreign straw recipient Paula Marie Poe at $0.007/share (90% market discount), with proceeds routed to Bank of America and personal accounts.',
            'affectedCertificates': ['CS1-8158', 'CS1-8159', 'CS1-8160', 'CS1-8161-8165', 'CS1-8166', 'CS1-8167', 'CS1-8172', 'CS1-8173'],
            'primaryEvidenceFiles': ['GRNH 8161 - 8165 22MM shares 2.pdf', 'GRNH april 152019.xlsx', 'GRNH 8161 8162 8 and a half million POE.pdf']
        },
        {
            'id': 'opinion_shopping',
            'title': 'Opinion Shopping & Attorney Reliance (Mills & Hintzen)',
            'severity': 'High',
            'statutoryViolation': 'Legal Opinion Malpractice / Fraudulent Exemption Claim',
            'description': 'Attorneys Stephen Mills and James Hintzen issued Section 4(a)(1) legal opinions to Fidelity Transfer Services asserting exemption from registration, despite knowing or having reason to know of nominee ownership, sham consulting agreements, and lack of valid holding periods.',
            'affectedCertificates': ['CS1-7750', 'CS1-7905', 'CS1-7910', 'CS1-7971', 'CS1-7972'],
            'primaryEvidenceFiles': ['GRNH-4a1 Opinion Letter Draft II.pdf', 'GRNH 7905 2.5 million pkg for Ruben for lenged lift.pdf', 'GRNH7750 2MM request for updated legal opinion form you Stephen.pdf']
        },
        {
            'id': 'transfer_agent_discrepancy',
            'title': 'Transfer Agent Ledger Discrepancies (29M vs 78M vs 120M)',
            'severity': 'Critical',
            'statutoryViolation': 'Books & Records Violations / Spurious Share Creation',
            'description': 'As disclosed in the Haas Rule 26.1 Disclosure (CV2025-013574), internal company records, transfer agent communications, and demand letters reflected wildly conflicting share totals: 29 million, 78 million, and up to 120 million shares connected to Fidelity Transfer Services and Ruben Sanchez.',
            'affectedCertificates': ['All Active Issuances', 'CS1-7978'],
            'primaryEvidenceFiles': ['DEFENDANT_HAAS_RULE_26_1_SUPPLEMENTAL_DISCLOSURE_with_contact_info.pdf', 'Fidelity Transfer Services GRNH wire inst.docx', 'IRA FIDELITY MESSAGES AND PRINTS EXPELLED FROM FIRM.pdf']
        }
    ],
    'transactions': raw_txs,
    'certificates': cert_map,
    'sourceFilesCatalog': discovered_files,
    'nonCompanySharesAnalysis': {
        "summaryMetrics": {
                "totalNonCompanyShares": 109240000,
                "totalTranchesTracked": 14,
                "directCompanyCashReceived": "zsh.00",
                "pctNonCompanySourced": "99.4%",
                "flaggedOpinionAttorneys": [
                        "John T. Root, Jr., Esq.",
                        "Stephen Mills, Esq.",
                        "James Hintzen, Esq."
                ],
                "primaryStatutoryViolations": [
                        "Securities Act Section 5 (Unregistered Public Distribution)",
                        "Rule 144(d)(1) Affiliate Tacking Bar",
                        "Section 2(a)(11) Statutory Underwriter Status",
                        "Rule 144(i) Shell Company Prohibition",
                        "Rule 144(e)(1)(i) 1% Float Volume Ceiling Fraud"
                ],
                "breakdownByMechanism": [
                        {
                                "mechanism": "Foreign Straw Nominee Amalgamations (Poe / Canada)",
                                "shares": 30450000,
                                "percentage": "27.9%",
                                "color": "#f97316"
                        },
                        {
                                "mechanism": "Affiliate Collateral & Debt Transfers (Haas 2009)",
                                "shares": 27000000,
                                "percentage": "24.7%",
                                "color": "#ef4444"
                        },
                        {
                                "mechanism": "Backdated Sham Consulting Awards (Delfin / Rubio / Hulbert)",
                                "shares": 25500000,
                                "percentage": "23.3%",
                                "color": "#eab308"
                        },
                        {
                                "mechanism": "Purported Note Assignments & Familial Conduits (Cheryl & Josh Hintzen)",
                                "shares": 15790000,
                                "percentage": "14.5%",
                                "color": "#8b5cf6"
                        },
                        {
                                "mechanism": "Promoter Loan Collateral & Nominee Shells (Brouillette / Big Thunder)",
                                "shares": 10500000,
                                "percentage": "9.6%",
                                "color": "#06b6d4"
                        }
                ]
        },
        "tranches": [
                {
                        "id": "NCS-01",
                        "recipient": "E.F. Romano III",
                        "cert": "CS1-8172 / 27M Unlegended",
                        "shares": 27000000,
                        "mechanismCategory": "Affiliate Debt & Collateral Transfers",
                        "opinionDate": "January 22, 2019 / April 22, 2019",
                        "opinionAuthor": "John T. Root, Jr., Esq.",
                        "statedOrigin": "Assigned and transferred from James Haas (Affiliate) as collateral for a ,000 loan to Issuer, originating from 2009 Employment Agreement debt settled on Sept 30, 2017 for 27,500,000 shares.",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Rule 144(d)(1) Affiliate Tacking Bar",
                                "Section 2(a)(11) Statutory Underwriter Status",
                                "Rule 144(e)(1)(i) 1% Volume Ceiling Fraud",
                                "Section 5 Unregistered Public Distribution"
                        ],
                        "forensicAutopsy": "Root explicitly represented that 27M shares was \"much less than one percent of the outstanding shares of the Issuer\". In fact, 27M was 5.74% of the 470,220,980 total shares\u2014more than 5x the statutory ceiling. Haas subsequently ordered Ruben Sanchez on May 6, 2019: \"Send 10 million to Ira Gaines and 17 million back to me\", proving Romano was merely a temporary nominee conduit to wash affiliate stock.",
                        "primaryEvidenceFiles": [
                                "GRNH-4a1 Opinion Letter Draft II (4) (2).pdf",
                                "DEFENDANT_HAAS_RULE_26_1_SUPPLEMENTAL_DISCLOSURE_with_contact_info.pdf"
                        ]
                },
                {
                        "id": "NCS-02",
                        "recipient": "Cheryl Hintzen",
                        "cert": "CS1-7937",
                        "shares": 6790000,
                        "mechanismCategory": "Purported Note Assignments & Familial Conduits",
                        "opinionDate": "January 10, 2018 (Request: Jan 9, 2018)",
                        "opinionAuthor": "Stephen Mills, Esq.",
                        "statedOrigin": "Secondary purchase from Mark Delfin pursuant to Stock Purchase Agreement dated August 20, 2015 for ,000.00, purportedly deriving from a Sept 9, 2013 consulting agreement.",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Section 5 Unregistered Distribution",
                                "Rule 144(d) Holding Period Fabrication",
                                "In Pari Delicto / Unclean Hands",
                                "Section 2(a)(11) Underwriter Conduit"
                        ],
                        "forensicAutopsy": "Corporate documents prove Mark Delfin consulting agreement was actually drafted and signed on May 1, 2017 (backdated 44 months). Cheryl Hintzen could not have acquired shares in August 2015 under a contract created in May 2017. Forms the basis of Hintzen v. Haas (CV2025-013574) claiming .8M damages for Haas refusing to lift the legend.",
                        "primaryEvidenceFiles": [
                                "grnhhintzen7937.pdf",
                                "GRNH req for legal Cheryl 2.docx",
                                "CONSULTING AGREEMENT_Delfin_GRNH.docx"
                        ]
                },
                {
                        "id": "NCS-03",
                        "recipient": "Ira Gaines",
                        "cert": "CS1-7905",
                        "shares": 2500000,
                        "mechanismCategory": "Promoter Loan Collateral & Nominee Shells",
                        "opinionDate": "July 11, 2017",
                        "opinionAuthor": "Stephen Mills, Esq.",
                        "statedOrigin": "Secured Promissory Note dated October 7, 2016 between Ira Gaines and Ronald Brouillette / Third Coast Partners LLC (,000 loan satisfaction via 2,500,000 shares).",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Section 2(a)(11) Statutory Underwriter Status",
                                "Section 5 Unregistered Resale of Loan Collateral",
                                "Rule 144(a)(1) Affiliate Control Concealment"
                        ],
                        "forensicAutopsy": "Private loan between third-party promoter Ronald Brouillette and undisclosed control person Ira Gaines converted into unlegended shares for immediate OTC resale through Stephen Mills Section 4(a)(1) opinion. Zero capital entered GreenGro corporate accounts.",
                        "primaryEvidenceFiles": [
                                "gainesgrnh7905.pdf",
                                "GRNH req for legal 2.5 MM cert 7905 MILLS.pdf"
                        ]
                },
                {
                        "id": "NCS-04",
                        "recipient": "Ira Gaines",
                        "cert": "CS1-7910",
                        "shares": 2000000,
                        "mechanismCategory": "Promoter Loan Collateral & Nominee Shells",
                        "opinionDate": "July 11, 2017",
                        "opinionAuthor": "Stephen Mills, Esq.",
                        "statedOrigin": "Secondary SPA dated April 3, 2017 whereby Ira Gaines purchased 2,000,000 shares from Dignitas Consulting LLC for ,000.00, purportedly deriving from a May 27, 2015 consulting award.",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Rule 144(d)(1) Holding Period Evasion",
                                "Beneficial Ownership Concealment",
                                "Sham Consulting Intermediary"
                        ],
                        "forensicAutopsy": "Dignitas Consulting LLC was an intermediary vehicle managed by promoter Ronald Brouillette. Gaines purchased 2M shares secondarily for k and had Mills opine under Section 4(a)(1) that the shares had \"come to rest\" since 2015.",
                        "primaryEvidenceFiles": [
                                "gainesgrnh7910.pdf",
                                "GRNH req for Legal 2MM cert 7910.pdf",
                                "GRNH SPA 2M Ron Dignitas.pdf"
                        ]
                },
                {
                        "id": "NCS-05",
                        "recipient": "Ira Gaines",
                        "cert": "CS1-7696 / CS1-7896",
                        "shares": 1000000,
                        "mechanismCategory": "Promoter Loan Collateral & Nominee Shells",
                        "opinionDate": "February 17, 2017",
                        "opinionAuthor": "Stephen Mills, Esq.",
                        "statedOrigin": "Advisory agreement dated June 16, 2015 between GRNH and Ira Gaines for services rendered beginning November 24, 2014 (zsh.00 cash).",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Section 4(a)(1) Misrepresentation (Affiliate Bar)",
                                "Rule 144(a)(1) Affiliate Control Concealment",
                                "Section 5 Unregistered Public Offering"
                        ],
                        "forensicAutopsy": "Mills opined that Gaines was not an affiliate and did not own >10% of stock. In reality, Gaines controlled tens of millions of shares through trusts, nominees, and family conduits, and directed transfer agent issuances.",
                        "primaryEvidenceFiles": [
                                "gainesgrnh4a1.pdf",
                                "GRNH 7696 req for legal.pdf"
                        ]
                },
                {
                        "id": "NCS-06",
                        "recipient": "Big Thunder, LLC (Tom McClusky)",
                        "cert": "CS1-8002",
                        "shares": 4000000,
                        "mechanismCategory": "Promoter Loan Collateral & Nominee Shells",
                        "opinionDate": "December 1, 2017 (Request)",
                        "opinionAuthor": "Stephen Mills, Esq.",
                        "statedOrigin": "Private securities transaction with issuer dated March 31, 2016 for 4,000,000 shares.",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Nominee Entity Masking Affiliate Control",
                                "Section 2(a)(11) Underwriter Conduit",
                                "Rule 144(i) Shell Evasion"
                        ],
                        "forensicAutopsy": "Big Thunder, LLC was an entity organized and controlled by Ira Gaines and Tom McClusky to receive large blocks of restricted stock, hold them nominally for 12 months, and then obtain Section 4(a)(1) opinions to liquidate into the OTC market.",
                        "primaryEvidenceFiles": [
                                "GRNH request for legal 4MM GRNH BIg Thunder.docx",
                                "GRNH 8002 4MM shares BTLLC.pdf"
                        ]
                },
                {
                        "id": "NCS-07",
                        "recipient": "Mark Delfin",
                        "cert": "CS1-8089",
                        "shares": 6500000,
                        "mechanismCategory": "Backdated Sham Consulting Awards",
                        "opinionDate": "Executed May 1, 2017 (Backdated to Sept 9, 2013)",
                        "opinionAuthor": "In-House / Mills Reliance",
                        "statedOrigin": "Consulting Agreement for advisory knowledge and product expertise in lieu of monetary compensation.",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Securities Act Section 5 Violation",
                                "Rule 144(d) 44-Month Holding Period Backdating",
                                "Creation of Bogus Corporate Consideration"
                        ],
                        "forensicAutopsy": "Contract executed May 1, 2017 explicitly backdated description of services start date to September 9, 2013. Designed to create retroactive paper trail to support legend removal and secondary transfers like Cheryl Hintzen Cert 7937.",
                        "primaryEvidenceFiles": [
                                "CONSULTING AGREEMENT_Delfin_GRNH.docx",
                                "FINAL CONSULTING AGREEMENT_Delfin_GRNH (4).docx"
                        ]
                },
                {
                        "id": "NCS-08",
                        "recipient": "Santiago Rubio",
                        "cert": "CS1-8090",
                        "shares": 8500000,
                        "mechanismCategory": "Backdated Sham Consulting Awards",
                        "opinionDate": "Executed May 1, 2017 (Backdated to Oct 30, 2015)",
                        "opinionAuthor": "In-House / Mills Reliance",
                        "statedOrigin": "Consulting Agreement for advisory knowledge in lieu of monetary compensation.",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Securities Act Section 5 Violation",
                                "Rule 144(d) 18-Month Holding Period Backdating",
                                "Section 2(a)(11) Nominee Conduit"
                        ],
                        "forensicAutopsy": "Consulting agreement drafted May 1, 2017 backdated 18 months to October 30, 2015. 8.5M shares issued without cash consideration to corporate treasury.",
                        "primaryEvidenceFiles": [
                                "CONSULTING AGREEMENT_Rubio_GRNH.docx",
                                "FINAL CONSULTING AGREEMENT_Rubio_GRNH.docx"
                        ]
                },
                {
                        "id": "NCS-09",
                        "recipient": "Hulbert Ventures",
                        "cert": "CS1-8091",
                        "shares": 8500000,
                        "mechanismCategory": "Backdated Sham Consulting Awards",
                        "opinionDate": "Executed May 1, 2017 (Backdated to Dec 8, 2014)",
                        "opinionAuthor": "In-House / Mills Reliance",
                        "statedOrigin": "Consulting Agreement for advisory knowledge in lieu of monetary compensation.",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Securities Act Section 5 Violation",
                                "Rule 144(d) Holding Period Fabrication",
                                "Sham Boilerplate Contract Execution"
                        ],
                        "forensicAutopsy": "Draft agreement was an unedited copy-paste of Santiago Rubio contract, retaining Rubio preamble verbatim. 8.5M shares issued with zsh.00 capital invested.",
                        "primaryEvidenceFiles": [
                                "CONSULTING AGREEMENT_Hulbert_GRNH.docx",
                                "FINAL FINAL CONSULTING AGREEMENT_Hulbert_GRNH.docx"
                        ]
                },
                {
                        "id": "NCS-10",
                        "recipient": "Phoenix Group",
                        "cert": "CS1-8088",
                        "shares": 2000000,
                        "mechanismCategory": "Backdated Sham Consulting Awards",
                        "opinionDate": "Executed May 1, 2017 (Backdated to July 10, 2015)",
                        "opinionAuthor": "In-House / Mills Reliance",
                        "statedOrigin": "Consulting Agreement for strategic marketing and corporate development advisory.",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Securities Act Section 5 Violation",
                                "Rule 144(d) 22-Month Holding Period Backdating"
                        ],
                        "forensicAutopsy": "Part of the coordinated 25.5M share May 1, 2017 backdating issuance tranche.",
                        "primaryEvidenceFiles": [
                                "CONSULTING AGREEMENT_PHOENIX_GRNH.docx"
                        ]
                },
                {
                        "id": "NCS-11",
                        "recipient": "Paula Marie Poe (Canadian Nominee)",
                        "cert": "CS1-8166",
                        "shares": 5500000,
                        "mechanismCategory": "Foreign Straw Nominee Amalgamations",
                        "opinionDate": "April 8-15, 2019 (Transfer Agent Ledger)",
                        "opinionAuthor": "Fidelity Transfer Services Instruction",
                        "statedOrigin": "Secondary amalgamation combining restricted Cert CS1-7750 (2,000,000 shares from Ira J. Gaines Revocable Trust) + Cert CS1-8087 (3,500,000 shares from Justin Haas).",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Laundering Restricted Affiliate Shares into Foreign Straw",
                                "Rule 144(d)(1) Affiliate Tacking Bar",
                                "Section 5 Unregistered Public Distribution"
                        ],
                        "forensicAutopsy": "Spreadsheet GRNH april 152019.xlsx explicitly records: \"From 8087 Justin 3.5MM and 7750 IGRT 2MM\". Restricted affiliate and family certificates merged into Canadian nominee Paula Marie Poe at BMO InvestorLine to dump into public float.",
                        "primaryEvidenceFiles": [
                                "GRNH april 152019.xlsx",
                                "GRNH 8166 and 8167 total 14MMshares.pdf"
                        ]
                },
                {
                        "id": "NCS-12",
                        "recipient": "Paula Marie Poe (Canadian Nominee)",
                        "cert": "CS1-7835",
                        "shares": 3000000,
                        "mechanismCategory": "Foreign Straw Nominee Amalgamations",
                        "opinionDate": "April 2019 (Transfer Agent Ledger)",
                        "opinionAuthor": "Fidelity Transfer Services Instruction",
                        "statedOrigin": "Secondary purchase explicitly recorded in Gaines ledger as \"BOT FROM RON\" (Ronald Brouillette).",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Section 4(a)(1) Evasion on Promoter Stock",
                                "Section 2(a)(11) Underwriter Conduit",
                                "Section 5 Registration Violation"
                        ],
                        "forensicAutopsy": "Secondary market acquisition from promoter Ronald Brouillette converted directly to nominee Paula Marie Poe without registration.",
                        "primaryEvidenceFiles": [
                                "GRNH april 152019.xlsx",
                                "GRNH 7835 3 MM shares.pdf"
                        ]
                },
                {
                        "id": "NCS-13",
                        "recipient": "Joshua Hintzen -> Paula Marie Poe",
                        "cert": "CS1-7960, 7961, 7963 (Amalgamated into CS1-8162)",
                        "shares": 1500000,
                        "mechanismCategory": "Purported Note Assignments & Familial Conduits",
                        "opinionDate": "April 2, 2019 (Letter of Instruction)",
                        "opinionAuthor": "Fidelity Transfer Services (Ruben Sanchez)",
                        "statedOrigin": "Instruction letter from Joshua Hintzen states certificates 7960, 7961, 7963 are \"registered in the name of Ira Gaines\" and instructs cancellation and reissuance to Canadian nominee Paula Marie Poe at BMO InvestorLine.",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Affiliate Control Stock Nominee Washing",
                                "Cross-Border Securities Laundering",
                                "Section 5 Unregistered Public Resale"
                        ],
                        "forensicAutopsy": "Smoking gun documentary admission: Joshua Hintzen signs instruction acknowledging shares belong to Ira Gaines, routing them through Canadian nominee account with medallion guarantee to circumvent US broker scrutiny.",
                        "primaryEvidenceFiles": [
                                "GRNH loi GRNH Joshua 2 and a half million shares loi to Paul Poe.docx",
                                "GRNH april 152019.xlsx"
                        ]
                },
                {
                        "id": "NCS-14",
                        "recipient": "Paula Marie Poe (Canadian Nominee)",
                        "cert": "CS1-8161 through CS1-8165",
                        "shares": 20450000,
                        "mechanismCategory": "Foreign Straw Nominee Amalgamations",
                        "opinionDate": "April 4-12, 2019",
                        "opinionAuthor": "Fidelity Transfer Services Processing",
                        "statedOrigin": "Secondary debt note amalgamations and conversion fees paid directly to Fidelity Transfer Services (,500 on 4/4/2019, ,150 on 4/8/2019, ,000 on 4/10/2019).",
                        "actualCompanyCash": "zsh.00",
                        "statutoryViolations": [
                                "Massive Unregistered Public Distribution (20.45M Shares)",
                                "Transfer Agent Payoffs / Direct Conversion Fees",
                                "90% Price Discount Evasion"
                        ],
                        "forensicAutopsy": "Over 20.45M shares consolidated into Poe at an effective price of zsh.007/share (90% market discount). Fees wired directly to Fidelity Transfer Services and personal promoter accounts, with zero capital funding GreenGro operations.",
                        "primaryEvidenceFiles": [
                                "GRNH april 152019.xlsx",
                                "GRNH 8161 - 8165 22MM shares 2.pdf"
                        ]
                }
        ],
        "rootOpinionAutopsy": {
                "title": "The John T. Root, Jr. 27M Share Opinion Fraud Autopsy",
                "attorney": "John T. Root, Jr., Esq. (P.O. Box 701, Greenbrier, AR 72058)",
                "recipient": "E.F. Romano III",
                "date": "January 22, 2019 (Drafted) / April 22, 2019 (Re-issued)",
                "shares": 27000000,
                "issuerOutstandingShares": 470220980,
                "statedPercentage": "Much less than one percent (<1%)",
                "actualPercentage": "5.7419% (5.74x statutory ceiling)",
                "verbatimExcerpts": [
                        "These Shares were assigned and transferred from James Haas, an affiliate, as collateral in return for the lending of funds to the Issuer, and they are properly restricted, which restriction may be validly removed pursuant to Rule 144(e)(1)(i)...",
                        "The original debt arose from amounts due Mr. Haas from an Employment Agreement, dated August 2009...",
                        "The Shares represent 27,000,000 shares. The outstanding shares are 470,220,980 common and ... number, I do not consider it to rise to the level of a distribution as it is much less than one percent of the outstanding shares of the Issuer."
                ],
                "statutoryViolations": [
                        {
                                "statute": "Rule 144(d)(1) Affiliate Tacking Bar",
                                "analysis": "Under Rule 144(d)(1), purchasers of securities or debt from an affiliate cannot tack the affiliate's holding period. Romano was legally required to hold the shares for a minimum of 6 months to 1 year from the date of the January 2019 transfer before any public resale could occur. Root's attempt to tack back 10 years to Haas's 2009 employment agreement was a legal nullity."
                        },
                        {
                                "statute": "Rule 144(e)(1)(i) 1% Volume Ceiling Fraud",
                                "analysis": "Root explicitly certified to transfer agent Fidelity Transfer Services that 27M shares was \"much less than one percent of the outstanding shares\". In reality, 27M / 470.22M = 5.7419%! This was a direct, mathematically demonstrable false statement of material fact made to induce the issuance of unlegended shares."
                        },
                        {
                                "statute": "Section 2(a)(11) Conduit & The Haas May 6, 2019 Order",
                                "analysis": "Exactly 14 days after Root's April 22, 2019 reissuance, James Haas sent formal written instructions to transfer agent Ruben Sanchez: \"Send 10 million to Ira Gaines and 17 million back to me\" (10M + 17M = 27M). This proves the E.F. Romano III loan was a complete sham conduit designed to wash affiliate stock before returning it to Haas and Gaines."
                        }
                ]
        },
        "cherylHintzenLawsuitAutopsy": {
                "title": "The Cheryl Hintzen 6.79M Share Conduit & Lawsuit Defense Autopsy",
                "caseCaption": "Cheryl Hintzen v. James M. Haas, Maricopa County Superior Court Case No. CV2025-013574",
                "certificateNumber": "CS1-7937",
                "shares": 6790000,
                "plaintiffClaim": "Breach of contract alleging ,800,000+ in damages based on James Haas's refusal to instruct transfer agent Fidelity Transfer Services to remove restrictive legends.",
                "opinionAttorney": "Stephen Mills, Esq. (Opinion: January 10, 2018; Request: January 9, 2018)",
                "claimedProvenance": "Stock Purchase Agreement dated August 20, 2015 from Mark Delfin (,000.00), purportedly deriving from a Sept 9, 2013 consulting agreement with GreenGro.",
                "evidentiaryDiscrepancy": "GreenGro corporate records reveal Mark Delfin's consulting agreement (CONSULTING AGREEMENT_Delfin_GRNH.docx) was actually drafted and signed on May 1, 2017, and backdated 44 months to September 9, 2013. Cheryl Hintzen could not have acquired shares in August 2015 under a contract that did not exist until May 2017.",
                "defenseStrategies": [
                        {
                                "doctrine": "In Pari Delicto & Clean Hands Bar",
                                "legalRule": "Courts of equity will not enforce an illegal agreement or award damages to a party participating in a fraudulent evasion scheme.",
                                "application": "Because Hintzen's claim derives from a retroactively backdated consulting contract designed to evade Section 5 registration, her claim is barred by the doctrine of unclean hands."
                        },
                        {
                                "doctrine": "Section 2(a)(11) Statutory Underwriter Status",
                                "legalRule": "Any person acquiring stock from an issuer or affiliate with a view to distribution is an underwriter disqualified from Section 4(a)(1).",
                                "application": "Hintzen immediately retained Stephen Mills to issue a Section 4(a)(1) free-trading opinion for open-market liquidation. She acted as a statutory underwriter conduit."
                        },
                        {
                                "doctrine": "Impossibility & Legality of Performance",
                                "legalRule": "A corporate officer cannot be held liable for refusing to direct an unlawful act.",
                                "application": "Had Haas instructed the transfer agent to remove the legend, Haas, the issuer, and the transfer agent would have committed a federal felony under Section 5. Refusal to commit a felony cannot form the predicate for breach of contract."
                        }
                ]
        },
        "statutoryVulnerabilities": [
                {
                        "code": "17 C.F.R. \u00a7 230.144(d)(1)",
                        "name": "Affiliate Tacking Prohibition",
                        "summary": "Holding periods can only tack if securities were purchased from non-affiliates. Acquisition of shares or debt from an affiliate (Haas or Gaines) restarts the holding period from day zero.",
                        "relevanceToLitigation": "Completely invalidates John T. Root's opinion tacking Haas's 2009 employment debt to E.F. Romano III, and Mills's opinions tacking Gaines trust holdings."
                },
                {
                        "code": "15 U.S.C. \u00a7 77b(a)(11)",
                        "name": "Statutory Underwriter Status",
                        "summary": "Any person who purchases from an issuer or control person with a view to distribution is an underwriter, stripping Section 4(a)(1) exemption eligibility.",
                        "relevanceToLitigation": "Applies directly to E.F. Romano III, Cheryl Hintzen, Big Thunder LLC, and Paula Marie Poe, who served as conduits to funnel restricted stock into OTC retail markets."
                },
                {
                        "code": "17 C.F.R. \u00a7 230.144(i)",
                        "name": "Shell Company Resale Prohibition",
                        "summary": "Rule 144 is unavailable for the resale of securities initially issued by a shell or former shell company unless strict reporting conditions and a 1-year seasoning period are met.",
                        "relevanceToLitigation": "GreenGro was a former shell company (Twister Holdings, Inc.). Opinion counsel attempted an end-run around 144(i) by citing Section 4(a)(1), which SEC enforcement precedent strictly forbids."
                },
                {
                        "code": "17 C.F.R. \u00a7 230.144(e)(1)",
                        "name": "Volume Limitations Ceiling",
                        "summary": "Sales within any 3-month period cannot exceed the greater of 1% of outstanding shares or the average weekly reported trading volume.",
                        "relevanceToLitigation": "Root's 27M share opinion represented 5.74% of GreenGro's 470M outstanding shares, exceeding the 1% volume ceiling by 574%."
                },
                {
                        "code": "15 U.S.C. \u00a7 77e / SEC v. Spectrum",
                        "name": "Attorney Opinion Liability & Scheme Liability",
                        "summary": "Attorneys who author opinion letters without reasonable inquiry or who make material misstatements to transfer agents face SEC enforcement and civil liability.",
                        "relevanceToLitigation": "Establishes opinion counsel liability for Stephen Mills and John T. Root, Jr. for facilitating illegal distributions based on backdated and mathematically false representations."
                }
        ],
        "litigationPlaybook": [
                {
                        "witness": "John T. Root, Jr., Esq.",
                        "targetSubject": "The 27M Share Romano Opinion & 5.74% Float Falsification",
                        "sampleQuestions": [
                                "In your opinion letter dated January 22, 2019, you wrote that 27,000,000 shares was \"much less than one percent of the outstanding shares of the Issuer\". Did you perform basic arithmetic before signing that statement?",
                                "GreenGro had 470,220,980 common shares outstanding. What is 27,000,000 divided by 470,220,980?",
                                "Under Rule 144(d)(1), how could Mr. Romano tack the holding period of James Haas, whom you explicitly identified in paragraph 2 as an affiliate of the issuer?",
                                "Were you aware that exactly two weeks after your April 22, 2019 opinion letter, James Haas instructed transfer agent Ruben Sanchez to wire 10 million shares to Ira Gaines and 17 million shares back to himself?"
                        ]
                },
                {
                        "witness": "Stephen Mills, Esq.",
                        "targetSubject": "Opinion Shopping, Backdated Consulting Agreements & Gaines Affiliation",
                        "sampleQuestions": [
                                "In your January 10, 2018 opinion letter for Cheryl Hintzen regarding certificate CS1-7937, you relied on a consulting agreement between GreenGro and Mark Delfin dated September 9, 2013. Did you examine the original metadata of that document?",
                                "Are you aware that the Mark Delfin agreement was created and executed on May 1, 2017, nearly 4 years after its stated date?",
                                "In your February 17, 2017 opinion for Ira Gaines (CS1-7696), you certified that Gaines was not an affiliate. What investigation did you conduct regarding Mr. Gaines's beneficial control over certificates 7750, 7800, 7835, and 7905?",
                                "Did you verify whether GreenGro Technologies was a former shell company subject to the resale disqualifications of Rule 144(i)?"
                        ]
                },
                {
                        "witness": "Cheryl Hintzen",
                        "targetSubject": "Lack of Consideration, Mark Delfin Conduit & Maricopa County Lawsuit",
                        "sampleQuestions": [
                                "You are currently suing James Haas in Maricopa County Superior Court (CV2025-013574) for failing to remove the legend on certificate CS1-7937. How much money did you pay to GreenGro Technologies, Inc. for those 6,790,000 shares?",
                                "Your stock purchase agreement states you purchased the shares from Mark Delfin for ,000 on August 20, 2015. Can you produce bank records showing ,000 transferred to Mr. Delfin?",
                                "Did you know that Mark Delfin's consulting agreement with GreenGro was not authored or signed until May 1, 2017?",
                                "When you requested Stephen Mills to issue a Section 4(a)(1) legal opinion on January 9, 2018, was it your immediate intention to sell all 6.79 million shares into the OTC public float?"
                        ]
                },
                {
                        "witness": "Ruben Sanchez (Fidelity Transfer Services)",
                        "targetSubject": "Transfer Agent Discrepancies (29M vs 78M vs 120M) & Canadian Straw Wires",
                        "sampleQuestions": [
                                "As disclosed in the Haas Rule 26.1 disclosure, Fidelity Transfer Services processed between 29 million, 78 million, and 120 million questionable GRNH shares. Why do your internal transfer ledgers fail to reconcile with SEC Pinksheet share totals?",
                                "On April 2, 2019, Joshua Hintzen instructed you to cancel certificates 7960, 7961, and 7963 registered to Ira Gaines and reissue them to Canadian resident Paula Marie Poe. Why did you process a transfer from an affiliate to a foreign nominee without a registration statement?",
                                "Between April 4 and April 10, 2019, Fidelity received wire payments totaling over ,000 for processing certificates 8161 through 8169. Who paid those transfer fees and what account did they originate from?"
                        ]
                }
        ]
}
}

out_file = 'src/data/grnh_forensic_database.json'
with open(out_file, 'w') as f:
    json.dump(database, f, indent=2)

print(f"Generated {out_file}: {len(raw_txs)} transactions, {len(cert_map)} certificates, {len(discovered_files)} primary files indexed from hard drive.")
