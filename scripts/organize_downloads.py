import os, sys, re, shutil, filecmp
from collections import defaultdict

downloads_dir = '/Users/ericmiller/Downloads'

def classify(filename):
    fl = filename.lower()
    ext = os.path.splitext(filename)[1].lower()
    
    # 1. ZIRO MASTER (User explicit priority)
    if any(k in fl for k in ['ziro', 'z1r0', 'zi-ro']):
        return 'ZIRO MASTER'

    # 2. GRNH Forensics, Securities Fraud & Litigation Reports
    if any(k in fl for k in ['grnh', 'greengro', 'gaines', 'big thunder', 'motivated minds', 'casa de dinero', 'hintzen', 'john t. root', 'stephen mills', 'lawyer_guide_and_highway', 'lawyer guide', 'scottsdale capital', 'finra', 'forensic_securities', 'jessie ritchie']):
        return 'GRNH Forensics & Securities Fraud'
        
    # 3. Friednash & Garnishment Legal Matter (Case CV2017-005018)
    if any(k in fl for k in ['friednash', 'garnishment', 'garnishee', 'subpoena', 'minute entry', 'evidentiary hearing', 'stipulated facts', 'mark crone', 'cv2017-005018', '5ak', '5ao', '5b0', '5bo', '5bp', '4f82822', 'writ of garnishment', 'scottsdale eyewear', 'deposition_prep', 'deposition of debra']):
        return 'Friednash & Garnishment Legal Matter'

    # 4. Porsche & Vehicle Valuation
    if any(k in fl for k in ['porsche', 'cayman', 'macan', 'kelley blue book', 'vehicle_valuation', 'vehicle valuation', 'vehicle registration', 'car worth', 'vin_', 'adot', 'scottsdale_luxury_car_club', 'scottsdale luxury car club']):
        return 'Porsche & Vehicle Valuation'

    # 5. Asset Liberator Project
    if any(k in fl for k in ['asset_liberator', 'asset liberator', 'asset-liberator']):
        return 'Asset Liberator'

    # 6. EDGAR Scout, Form 4 Filings & SEC Monitoring
    if any(k in fl for k in ['edgar', 'desk144', '3a10', 'sec filing', 'form 4', 'form 8-k', '10-k', '10-q', 'schedule 13', 'four_filings', 'four filings', 'four_filing', 'disclosure documents', 'disclosure_documents']):
        return 'edgar-scout-light'

    # 7. Onli Corporation & IP Patents
    if any(k in fl for k in ['onli', 'token_onli', 'patent']):
        return 'Onli Corporation & Patents'

    # 8. ADU Store & Modular Housing (TheADUMart / HaaS)
    if any(k in fl for k in ['adu', 'theadumart', 'davis kitchens', 'tiny home']):
        return 'ADU Store & Modular Housing'

    # 9. Thinkubator / Thinkubator X
    if 'thinkubator' in fl:
        return 'thinkubator'

    # 10. KUSTOM X & KustomWorks
    if any(k in fl for k in ['kustom', 'kustomx', 'kx-']):
        return 'KUSTOM X FILES'

    # 11. Daily & Regional Outreach Reports (Executive Dispatch & Campaigns)
    if any(k in fl for k in ['outreach_report', 'outreach report', 'dispatch_report', 'dispatch report', 'master_daily', 'regional_daily', 'outreach_backlog', 'daily_app_build', 'outreach-protocol', 'personalized_emails', 'emails_that_go_out', 'backlog_drain', 'mail_merge']):
        return 'Executive & Daily Outreach Reports'

    # 12. God's Eye, Chokepoint & Global Intelligence Monitors
    if any(k in fl for k in ['gods_eye', 'god\'s eye', 'chokepoint', 'seismograph', 'biological_war', 'conflict', 'taiwan', 'hormuz', 'red sea', 'malacca', 'suez', 'macro_watch', 'war_scenario', 'war_monitor', 'ukraine_russia', 'pneumonic_plague', 'monitor_series']):
        return 'Gods Eye & Global Telemetry'

    # 13. Capital Markets, OTC Equities & Shell Analysis
    if any(k in fl for k in ['shell_finder', 'shell finder', 'shell_companies', 'shell companies', 'microcap', 'otc companies', 'stock_related', 'waste_energy', 'alphasense', 'bamsec', 'capital_markets', 'deal_pipeline', 'healthier_choices', 'hcmc', 'livewire', 'promissory_note', 'capital_power_brokers', 'ai_deals_and_capital', 'global_market_monitor', 'global market monitor', 'market_monitor', 'ipo', 'spac_quality', 'whistleblower', 'gtvh', 'maxim_targets']):
        return 'Capital Markets, OTC & Shell Analysis'

    # 14. Startup Seed, Venture Capital & Dealmakers
    if any(k in fl for k in ['seed_finder', 'seed finder', 'seed series', 'seed round', 'venture capital', 'yc_companies', 'private company list', 'dealroom', 'kingpins', 'dealmakers', 'early_stage_rounds']):
        return 'Venture Capital & Seed Dealroom'

    # 15. Ballot Watch & Political Elections
    if any(k in fl for k in ['ballot', 'election', 'candidate', 'caucus', 'governor', 'senate', 'mayor']):
        return 'Ballot Watch & Political Intelligence'

    # 16. Banking, Invoices, Receipts & Tax Records
    if any(k in fl for k in ['pnc', 'chase', 'bank', 'statement', 'invoice', 'receipt', 'tax', '1099', 'w-2', 'w2', 'financial statement', 'financials', 'usagedetails', 'credit card payment', 'billing', 'fire policy', 's-corp', 'passwords.csv', 'pandl', 'accountactivity', 'usage_details']):
        return 'Banking, Tax & Financial Records'

    # 17. Health & Medical Records
    if any(k in fl for k in ['heart', 'vascular', 'aorta', 'renal', 'duplex', 'ultrasound', 'doctor', 'clinic', 'medical', 'myeloma', 'bcbsaz', 'asps new patient', 'emvc_oon', 'patient', 'prior auth']):
        return 'Medical & Health Records'

    # 18. Personal Career, Executive Search & Resumes
    if any(k in fl for k in ['resume', 'curriculum vitae', 'cover letter', 'liaison application', 'interview_diligence', 'michael_cummings_bio', 'emily barela', 'recruitment']):
        return 'Career & Executive Search'

    # 19. EricLabs & Miller Personal Projects
    if any(k in fl for k in ['ericlabs', 'millerericj', 'project eric', 'eric miller', 'eric_miller']):
        return 'MILLERERICJ'

    # 20. WEDG Shares
    if 'wedg' in fl:
        return 'WEDG Shares'

    # 21. Real Estate & Property Management
    if any(k in fl for k in ['renaissance', 'rising village', 'rising_village', 'haven', 'reverse_mortgage', 'lease', 'tenant', 'landlord', 'apartment']):
        return 'Real Estate & Property Management'

    # 22. Business & Commercial Projects
    if any(k in fl for k in ['villagebaker', 'bakery', 'restaurant', 'fcv.company', 'business brochure']):
        return 'Business & Commercial Projects'

    # 23. Byond Projects
    if 'byond' in fl:
        return 'BYOND Projects'

    # 24. AI & Software Developer Files, Code & Prompts
    if any(k in fl for k in ['prompt', 'build_prompt', 'build prompt', 'architecture', 'spec.md', 'spec.doc', 'arguebot', 'scoundrel', 'enrich_campaign', 'generate_reports', 'tradelines', 'qa_wizard', 'neon-cosmic', 'vercel', 'domain-configuration', 'domain_configuration', 'portal.html', 'timestamp-fix', 'ledger_and_dissenter']) or ext in ['.py', '.sh', '.json', '.ts', '.js', '.html']:
        return 'AI & Developer Files & Prompts'

    # 25. Software Installers & Disk Images
    if ext in ['.dmg', '.pkg']:
        return 'Software Installers & Disk Images'

    # 26. Calendar Invites
    if ext in ['.ics']:
        return 'General Reference & Archive'

    # 27. Screenshots, UI Mockups & Media Captures
    if ext in ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.mov', '.mp4', '.m4v', '.svg', '.m4a']:
        return 'Screenshots & UI Media'

    # 28. Legal Contracts & Agreements (Other)
    if any(k in fl for k in ['agreement', 'contract', 'settlement', 'engagement letter', 'subcontract', 'legal_representation', 'brentwood law', 'barry review', 'policy document', 'paf schedule']):
        return 'Legal Contracts & Corporate Records'

    # 29. Articles, News & Reading
    if any(k in fl for k in ['the new york times', 'nyt', 'cooking', 'wedding', 'romeo', 'allegedly', 'article', 'news']):
        return 'Articles, News & Personal Reading'

    return 'General Reference & Archive'

loose_files = [f for f in os.listdir(downloads_dir) if not f.startswith('.') and os.path.isfile(os.path.join(downloads_dir, f))]
print(f"Total loose files to organize: {len(loose_files)}")

# Special files we want to keep symlinks in ~/Downloads for immediate discovery & active editor tabs
keep_symlink = {
    'LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.pdf',
    'GRNH_Forensic_Securities_Litigation_Report.pdf',
    'LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md',
    'GRNH_Forensic_Securities_Litigation_Report.md',
    'Porsche_Valuation_Lawyer_Audit_Report.md'
}

stats = defaultdict(int)
moved_map = {}

for f in loose_files:
    cat = classify(f)
    dest_dir = os.path.join(downloads_dir, cat)
    os.makedirs(dest_dir, exist_ok=True)
    
    src_path = os.path.join(downloads_dir, f)
    dest_path = os.path.join(dest_dir, f)
    
    # Handle filename collision safely
    if os.path.exists(dest_path):
        if filecmp.cmp(src_path, dest_path, shallow=False):
            # Identical file already exists in destination folder
            os.remove(src_path)
        else:
            # Different file with same name -> append unique counter
            base, ext = os.path.splitext(f)
            counter = 1
            while os.path.exists(dest_path):
                dest_path = os.path.join(dest_dir, f"{base}_{counter}{ext}")
                counter += 1
            shutil.move(src_path, dest_path)
    else:
        shutil.move(src_path, dest_path)
        
    stats[cat] += 1
    moved_map[f] = dest_path

print("\n--- MOVE EXECUTION SUMMARY ---")
for cat, count in sorted(stats.items(), key=lambda x: x[1], reverse=True):
    print(f"  {cat}: {count} files moved")

# Create symlinks for active editor documents & Rule 6 discovery
for sym_name in keep_symlink:
    if sym_name in moved_map:
        target = moved_map[sym_name]
        link_path = os.path.join(downloads_dir, sym_name)
        if not os.path.exists(link_path):
            os.symlink(target, link_path)
            print(f"Created discovery symlink: {sym_name} -> {target}")

print("\nDownloads folder organization complete!")
