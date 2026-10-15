import json

db_path = 'src/data/grnh_forensic_database.json'
with open(db_path, 'r') as f:
    db = json.load(f)

ncs = db['nonCompanySharesAnalysis']
ncs['summaryMetrics']['directCompanyCashReceived'] = "$0.00"

# Fix stated origins and cash values
origins = {
    'NCS-01': "Assigned and transferred from James Haas (Affiliate) as collateral for a $200,000 loan to Issuer, originating from 2009 Employment Agreement debt settled on Sept 30, 2017 for 27,500,000 shares.",
    'NCS-02': "Secondary purchase from Mark Delfin pursuant to Stock Purchase Agreement dated August 20, 2015 for $125,000.00, purportedly deriving from a Sept 9, 2013 consulting agreement.",
    'NCS-03': "Secured Promissory Note dated October 7, 2016 between Ira Gaines and Ronald Brouillette / Third Coast Partners LLC ($76,000 loan satisfaction via 2,500,000 shares).",
    'NCS-04': "Secondary SPA dated April 3, 2017 whereby Ira Gaines purchased 2,000,000 shares from Dignitas Consulting LLC for $25,000.00, purportedly deriving from a May 27, 2015 consulting award.",
    'NCS-05': "Advisory agreement dated June 16, 2015 between GRNH and Ira Gaines for services rendered beginning November 24, 2014 ($0.00 cash).",
    'NCS-06': "Private securities transaction with issuer dated March 31, 2016 for 4,000,000 shares.",
    'NCS-07': "Consulting Agreement for advisory knowledge and product expertise in lieu of monetary compensation ($0.00 cash).",
    'NCS-08': "Consulting Agreement for advisory knowledge in lieu of monetary compensation ($0.00 cash).",
    'NCS-09': "Consulting Agreement for advisory knowledge in lieu of monetary compensation ($0.00 cash).",
    'NCS-10': "Consulting Agreement for strategic marketing and corporate development advisory ($0.00 cash).",
    'NCS-11': "Secondary amalgamation combining restricted Cert CS1-7750 (2,000,000 shares from Ira J. Gaines Revocable Trust) + Cert CS1-8087 (3,500,000 shares from Justin Haas).",
    'NCS-12': "Secondary purchase explicitly recorded in Gaines ledger as 'BOT FROM RON' (Ronald Brouillette).",
    'NCS-13': "Instruction letter from Joshua Hintzen states certificates 7960, 7961, 7963 are 'registered in the name of Ira Gaines' and instructs cancellation and reissuance to Canadian nominee Paula Marie Poe at BMO InvestorLine.",
    'NCS-14': "Secondary debt note amalgamations and conversion fees paid directly to Fidelity Transfer Services ($107,500 on 4/4/2019, $50,150 on 4/8/2019, $39,000 on 4/10/2019)."
}

for t in ncs['tranches']:
    t['actualCompanyCash'] = "$0.00"
    if t['id'] in origins:
        t['statedOrigin'] = origins[t['id']]

with open(db_path, 'w') as f:
    json.dump(db, f, indent=2)

print("Fixed all actualCompanyCash and statedOrigin values in grnh_forensic_database.json!")
