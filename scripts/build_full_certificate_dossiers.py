import json, os

db_path = 'src/data/grnh_forensic_database.json'
with open(db_path, 'r') as f:
    db = json.load(f)

# Comprehensive list of traceable certificate dossiers
traceable_certs = [
    {
        'certNumber': 'CS1-8002',
        'shares': 4000000,
        'genesisDate': '2016-03-31 (Claimed) / 2017-08-30 (BT Formation)',
        'originType': 'Purchased from New Seller (Big Thunder LLC)',
        'primarySeller': 'Big Thunder, LLC (Tom McClusky / Sue McCluskey nominee)',
        'initialRecipient': 'Big Thunder, LLC',
        'currentHolderOrStatus': 'Deposited via Forest Securities / Cleared via Alpine',
        'brokerOrClearing': 'Forest Securities, Inc. (David Adams) / Alpine Securities Clearing',
        'opinionCounsel': 'Stephen Mills, Esq. (Request dated Dec 1, 2017)',
        'custodyHops': [
            {'step': 1, 'date': '2016-03-31', 'from': 'Issuer', 'to': 'Big Thunder, LLC (Purported)', 'action': 'Private placement transaction claimed on legal request'},
            {'step': 2, 'date': '2017-08-30', 'from': 'Ira Gaines', 'to': 'Big Thunder, LLC', 'action': 'LLC formed; Ira Gaines initially listed on page 14 of operating agreement, changed to Tom McCluskey upon broker warning'},
            {'step': 3, 'date': '2017-12-01', 'from': 'Big Thunder, LLC', 'to': 'Stephen Mills', 'action': 'Tom McClusky signs request for Section 4(a)(1) legal opinion representing 12-month holding'},
            {'step': 4, 'date': '2017-12-05', 'from': 'Big Thunder, LLC', 'to': 'Forest Securities (David Adams)', 'action': 'Deposited into brokerage account; broker alerts group to shovel related shares'},
            {'step': 5, 'date': '2018-01-15', 'from': 'Forest Securities', 'to': 'Alpine Clearing / OTC Market', 'action': 'Liquidated in broker transactions directed to retail market'}
        ],
        'redFlags': [
            'Big Thunder, LLC was organized on 8/30/2017, making March 31, 2016 purchase date impossible',
            'Ira Gaines named as initial manager on operating agreement page 14, substituted with Tom McCluskey',
            'Formed to circumvent Wilson-Davis & Pershing account closures'
        ],
        'evidenceFiles': ['Big Thunder LLC CHAPTER.docx', 'GRNH request for legal 4MM GRNH BIg Thunder.docx', 'GRNH 8002 4MM shares BTLLC.pdf']
    },
    {
        'certNumber': 'CS1-7910',
        'shares': 2000000,
        'genesisDate': '2015-05-27 (Genesis) / 2017-04-03 (Secondary SPA)',
        'originType': 'Purchased from New Seller (Dignitas Consulting LLC)',
        'primarySeller': 'Dignitas Consulting LLC (Ronald Brouillette)',
        'initialRecipient': 'Ira Gaines',
        'currentHolderOrStatus': 'Deposited at Alpine Securities',
        'brokerOrClearing': 'Alpine Securities Clearing / Wedbush Securities',
        'opinionCounsel': 'Stephen Mills, Esq. (Opinion dated July 11, 2017)',
        'custodyHops': [
            {'step': 1, 'date': '2015-05-27', 'from': 'GreenGro Technologies, Inc.', 'to': 'Dignitas Consulting LLC', 'action': 'Awarded 3,000,000 restricted shares under consulting agreement'},
            {'step': 2, 'date': '2017-04-03', 'from': 'Dignitas Consulting LLC', 'to': 'Ira Gaines', 'action': 'Secondary Stock Purchase Agreement: Gaines buys 2,000,000 shares for $25,000.00 ($0.0125/sh)'},
            {'step': 3, 'date': '2017-04-06', 'from': 'Fidelity Transfer Services', 'to': 'Ira Gaines', 'action': 'Certificate CS1-7910 issued, noted in ledger as "sending to ALPINE"'},
            {'step': 4, 'date': '2017-07-11', 'from': 'Stephen Mills, Esq.', 'to': 'Fidelity Transfer Services', 'action': 'Section 4(a)(1) opinion issued opining shares freely tradable'},
            {'step': 5, 'date': '2017-07-20', 'from': 'Ira Gaines', 'to': 'Alpine Securities', 'action': 'Deposited for open market retail sale'}
        ],
        'redFlags': [
            'Zero dollars paid to GreenGro corporate treasury; $25,000 paid to Dignitas intermediary',
            'Tacking back to May 2015 consulting contract to bypass Rule 144(d)(1)',
            'Gaines concealed beneficial affiliate control over Dignitas vehicle'
        ],
        'evidenceFiles': ['gainesgrnh7910.pdf', 'GRNH SPA 2M Ron Dignitas.pdf', 'GRNH req for Legal 2MM cert 7910.pdf']
    },
    {
        'certNumber': 'CS1-7905',
        'shares': 2500000,
        'genesisDate': '2016-10-07 (Note) / 2017-07-11 (Opinion)',
        'originType': 'Purchased from New Seller (Third Coast Partners LLC)',
        'primarySeller': 'Third Coast Partners LLC (Ronald Brouillette)',
        'initialRecipient': 'Ira Gaines',
        'currentHolderOrStatus': 'Legend Lifted / Cleared for OTC Market',
        'brokerOrClearing': 'Alpine Securities / Wedbush Securities',
        'opinionCounsel': 'Stephen Mills, Esq. (Opinion dated July 11, 2017)',
        'custodyHops': [
            {'step': 1, 'date': '2016-10-07', 'from': 'Ronald Brouillette / Third Coast Partners LLC', 'to': 'Ira Gaines', 'action': 'Secured Promissory Note: Gaines loans $76,000.00 to Brouillette, collateralized by 2.5M shares'},
            {'step': 2, 'date': '2017-03-31', 'from': 'Third Coast Partners LLC', 'to': 'Ira Gaines', 'action': 'Note default/satisfaction: 2,500,000 shares transferred to Gaines in lieu of repayment'},
            {'step': 3, 'date': '2017-07-11', 'from': 'Stephen Mills, Esq.', 'to': 'Fidelity Transfer Services', 'action': 'Section 4(a)(1) legal opinion issued to remove restrictive legend'},
            {'step': 4, 'date': '2017-07-15', 'from': 'Fidelity Transfer Services', 'to': 'Ira Gaines', 'action': 'Unlegended certificate released to Ruben Sanchez for broker delivery'},
            {'step': 5, 'date': '2017-08-01', 'from': 'Ira Gaines', 'to': 'Brokerage Accounts', 'action': 'Liquidated into retail market'}
        ],
        'redFlags': [
            'Private third-party debt collateral converted into unlegended stock',
            'Section 2(a)(11) Statutory Underwriter conduit status',
            'Zero capital infused into GreenGro operations'
        ],
        'evidenceFiles': ['gainesgrnh7905.pdf', 'GRNH req for legal 2.5 MM cert 7905 MILLS.pdf']
    },
    {
        'certNumber': 'CS1-7768',
        'shares': 1000000,
        'genesisDate': '2016-10-25 (SPA) / 2018-10-25 (Request)',
        'originType': 'Purchased from New Seller (Motivated Minds / Queler Conduit)',
        'primarySeller': 'Arthur N. Queler / Motivated Minds Network',
        'initialRecipient': 'Arthur N. Queler',
        'currentHolderOrStatus': 'Cleared via SagePoint Financial, Inc.',
        'brokerOrClearing': 'SagePoint Financial, Inc. / Wedbush Securities',
        'opinionCounsel': 'Stephen Mills, Esq. (Request dated Oct 25, 2018)',
        'custodyHops': [
            {'step': 1, 'date': '2016-10-25', 'from': 'GreenGro Technologies, Inc.', 'to': 'Arthur N. Queler', 'action': 'Stock Purchase Agreement for 1,000,000 restricted shares'},
            {'step': 2, 'date': '2016-11-16', 'from': 'Fidelity Transfer Services', 'to': 'Arthur N. Queler', 'action': 'Certificate FedExed to Queler'},
            {'step': 3, 'date': '2017-12-06', 'from': 'Motivated Minds Network', 'to': 'SagePoint Financial', 'action': 'Account opening and promissory note routing via SagePoint Motivated Minds'},
            {'step': 4, 'date': '2018-10-25', 'from': 'Arthur N. Queler', 'to': 'Stephen Mills', 'action': 'Request for legal opinion; claims SPA was dated Oct 25, 2018 yet simultaneously claims 1-year holding'},
            {'step': 5, 'date': '2018-11-05', 'from': 'SagePoint Financial', 'to': 'OTC Market', 'action': '1MM shares cleared and deposited for retail sale'}
        ],
        'redFlags': [
            'Exact date contradiction on face of legal request (SPA dated Oct 25, 2018 while claiming held for 1 year)',
            'Connected to SagePoint Motivated Minds distribution pipeline',
            'Commercial compensation accounts (Wells-Motivated Minds, Bankers-Motivated Minds)'
        ],
        'evidenceFiles': ['GRNH Art Queler req for legal.docx', 'SagePoint Motivated Minds.pdf', 'GRNH for Sage point 1MM shares.pdf']
    },
    {
        'certNumber': 'CS1-7937',
        'shares': 6790000,
        'genesisDate': '2013-09-09 (Backdated) / 2015-08-20 (SPA) / 2017-05-01 (Actual Signing)',
        'originType': 'Purchased from New Seller (Mark Delfin Sham Consultant)',
        'primarySeller': 'Mark Delfin (Consultant Nominee)',
        'initialRecipient': 'Cheryl Hintzen',
        'currentHolderOrStatus': 'Subject of Active Lawsuit: Hintzen v. Haas (CV2025-013574)',
        'brokerOrClearing': 'Alpine Securities / Forest Securities',
        'opinionCounsel': 'Stephen Mills, Esq. (Opinion dated Jan 10, 2018)',
        'custodyHops': [
            {'step': 1, 'date': '2017-05-01', 'from': 'GreenGro Technologies, Inc.', 'to': 'Mark Delfin', 'action': 'Consulting Agreement executed May 1, 2017, explicitly backdated 44 months to Sept 9, 2013'},
            {'step': 2, 'date': '2015-08-20', 'from': 'Mark Delfin', 'to': 'Cheryl Hintzen', 'action': 'Purported Stock Purchase Agreement: Hintzen buys 6,790,000 shares from Delfin for $125,000 (pre-dates contract creation)'},
            {'step': 3, 'date': '2018-01-09', 'from': 'Cheryl Hintzen', 'to': 'Stephen Mills, Esq.', 'action': 'Request for Section 4(a)(1) legal opinion representing non-affiliate status'},
            {'step': 4, 'date': '2018-01-10', 'from': 'Stephen Mills, Esq.', 'to': 'Fidelity Transfer Services', 'action': 'Opinion letter issued certifying shares freely tradable'},
            {'step': 5, 'date': '2025-01-15', 'from': 'Cheryl Hintzen', 'to': 'James Haas', 'action': 'Files lawsuit in Maricopa County Superior Court (CV2025-013574) seeking $1.8M damages for refusal to lift legend'}
        ],
        'redFlags': [
            'Chronological impossibility: SPA dated August 20, 2015 derives from an agreement created May 1, 2017',
            'In Pari Delicto / Unclean Hands affirmative defense for defense counsel',
            'Zero capital infused into GreenGro treasury'
        ],
        'evidenceFiles': ['grnhhintzen7937.pdf', 'GRNH req for legal Cheryl 2.docx', 'CONSULTING AGREEMENT_Delfin_GRNH.docx']
    },
    {
        'certNumber': 'CS1-7835',
        'shares': 3000000,
        'genesisDate': '2017-01-04 (Issuance) / 2019-03-27 (Poe Transfer)',
        'originType': 'Purchased from New Seller ("BOT FROM RON" Brouillette)',
        'primarySeller': 'Ronald Brouillette ("Ron")',
        'initialRecipient': 'Ira Gaines',
        'currentHolderOrStatus': 'Transferred to Canadian Nominee Paula Marie Poe',
        'brokerOrClearing': 'BMO InvestorLine (Toronto) / Fidelity Transfer Services',
        'opinionCounsel': 'Fidelity Transfer Services Instruction',
        'custodyHops': [
            {'step': 1, 'date': '2017-01-04', 'from': 'Ronald Brouillette ("Ron")', 'to': 'Ira Gaines', 'action': 'Certificate CS1-7835 issued for 3,000,000 shares, noted in portfolio list as "BOT FROM RON"'},
            {'step': 2, 'date': '2017-01-10', 'from': 'Fidelity Transfer Services', 'to': 'Ira Gaines', 'action': 'Restricted certificate delivered'},
            {'step': 3, 'date': '2019-03-27', 'from': 'Ira Gaines', 'to': 'Paula Marie Poe', 'action': 'Letter of Instruction to cancel Cert 7835 and reissue to Paula Marie Poe'},
            {'step': 4, 'date': '2019-04-12', 'from': 'Fidelity Transfer Services', 'to': 'BMO InvestorLine', 'action': 'Overnighted via FedEx to BMO InvestorLine account 23013702-15 in Toronto'},
            {'step': 5, 'date': '2019-04-20', 'from': 'Paula Marie Poe', 'to': 'OTC Retail Market', 'action': 'Liquidated into public float'}
        ],
        'redFlags': [
            'Direct documentary record: "BOT FROM RON" proves secondary promoter purchase',
            'Promoter paper washed through transfer agent into offshore Canadian nominee',
            'Zero registration statement or bona fide holding period compliance'
        ],
        'evidenceFiles': ['GRNH april 152019.xlsx', 'GRNH 7835 3 MM shares.pdf', 'record of GRNH stock transactions.docx']
    },
    {
        'certNumber': 'CS1-7978',
        'shares': 10000000,
        'genesisDate': '2019-04-10',
        'originType': 'Purchased from New Seller (James Haas / CEO Private Sale)',
        'primarySeller': 'James "Boe" Haas (CEO of GreenGro Technologies, Inc.)',
        'initialRecipient': 'Ira Gaines',
        'currentHolderOrStatus': 'Subdivided and Reissued to Paula Marie Poe',
        'brokerOrClearing': 'Fidelity Transfer Services / Bank of America',
        'opinionCounsel': 'In-House / John T. Root, Jr. Framework',
        'custodyHops': [
            {'step': 1, 'date': '2019-04-10', 'from': 'James Haas (CEO)', 'to': 'Ira Gaines', 'action': 'Private Stock Purchase Agreement: Haas sells 10,000,000 shares to Gaines for $70,000 ($0.007/share)'},
            {'step': 2, 'date': '2019-04-10', 'from': 'Ira Gaines', 'to': 'James Haas Personal Account', 'action': '$70k cash paid directly to Haas, zero funds entering GreenGro treasury'},
            {'step': 3, 'date': '2019-04-12', 'from': 'Fidelity Transfer Services', 'to': 'Cert CS1-8172', 'action': 'Certificate 7978 re-titled into CS1-8172 for 10M shares in name of Paula Marie Poe'},
            {'step': 4, 'date': '2019-04-15', 'from': 'Fidelity Transfer Services', 'to': 'BMO InvestorLine', 'action': 'Physical certificate shipped to Toronto brokerage for Canadian deposit'},
            {'step': 5, 'date': '2019-04-25', 'from': 'Paula Marie Poe', 'to': 'OTC Market', 'action': 'Sold at retail prices, generating over 10x return on the $0.007 purchase price'}
        ],
        'redFlags': [
            'CEO sold 10M shares at 90% discount to prevailing market price while company was actively promoting stock',
            'Affiliate sale without registration under Section 5',
            'Proceeds went directly to CEO Haas personally'
        ],
        'evidenceFiles': ['GRNH Signed 10MM.pdf', 'GRNH april 152019.xlsx', 'record of GRNH stock transactions.docx']
    },
    {
        'certNumber': 'CS1-8172',
        'shares': 27000000,
        'genesisDate': '2009-08-01 (Employment) / 2017-09-30 (Settlement) / 2019-01-22 (Root Opinion)',
        'originType': 'Purchased from New Seller (James Haas Affiliate Loan Collateral)',
        'primarySeller': 'James "Boe" Haas (Affiliate Transferor)',
        'initialRecipient': 'E.F. Romano III (Nominee Creditor)',
        'currentHolderOrStatus': 'Split per Haas May 6, 2019 Order: 10M to Gaines, 17M to Haas',
        'brokerOrClearing': 'Fidelity Transfer Services / Ruben Sanchez',
        'opinionCounsel': 'John T. Root, Jr., Esq. (Jan 22, 2019 / Apr 22, 2019)',
        'custodyHops': [
            {'step': 1, 'date': '2009-08-01', 'from': 'GreenGro Technologies, Inc.', 'to': 'James Haas', 'action': 'Employment Agreement back-salary accrual claimed by Haas'},
            {'step': 2, 'date': '2017-09-30', 'from': 'GreenGro Technologies, Inc.', 'to': 'James Haas', 'action': 'Settlement Agreement & Mutual Release: Haas issued 27,500,000 shares for release of debt'},
            {'step': 3, 'date': '2019-01-22', 'from': 'James Haas', 'to': 'E.F. Romano III', 'action': 'Assigned as collateral for purported $200,000 loan to issuer'},
            {'step': 4, 'date': '2019-04-22', 'from': 'John T. Root, Jr., Esq.', 'to': 'Fidelity Transfer Services', 'action': 'Re-issues opinion asserting 27M is "<1% of outstanding" (actual: 5.74%)'},
            {'step': 5, 'date': '2019-05-06', 'from': 'James Haas', 'to': 'Ruben Sanchez', 'action': 'Haas instructs: "Send 10 million to Ira Gaines and 17 million back to me"'}
        ],
        'redFlags': [
            'Mathematical fraud: Root represented 27M was <1% of 470M float (actual: 5.74%)',
            'Affiliate tacking violation: Rule 144(d)(1) forbids tacking Haas\'s 2009 employment period',
            'May 6, 2019 kickback order proves loan was a fraudulent pretext'
        ],
        'evidenceFiles': ['GRNH-4a1 Opinion Letter Draft II (4) (2).pdf', 'DEFENDANT_HAAS_RULE_26_1_SUPPLEMENTAL_DISCLOSURE_with_contact_info.pdf']
    },
    {
        'certNumber': 'CS1-8166',
        'shares': 5500000,
        'genesisDate': '2016-10-19 (Gaines Trust) / 2017 (Justin Haas) / 2019-04-08 (Amalgamation)',
        'originType': 'Amalgamation from New Sellers (Ira Gaines Trust & Justin Haas)',
        'primarySeller': 'Ira J. Gaines Revocable Trust (Cert 7750) & Justin Haas (Cert 8087)',
        'initialRecipient': 'Paula Marie Poe',
        'currentHolderOrStatus': 'Delivered to Carter / BMO InvestorLine',
        'brokerOrClearing': 'BMO InvestorLine (Toronto) / Fidelity Transfer Services',
        'opinionCounsel': 'Fidelity Transfer Services Processing',
        'custodyHops': [
            {'step': 1, 'date': '2016-10-19', 'from': 'GreenGro Technologies, Inc.', 'to': 'IRA J. Gaines Revocable Trust', 'action': '2,000,000 restricted shares issued via Cert CS1-7750'},
            {'step': 2, 'date': '2017-06-15', 'from': 'GreenGro Technologies, Inc.', 'to': 'Justin Haas', 'action': '3,500,000 restricted shares issued via Cert CS1-8087'},
            {'step': 3, 'date': '2019-04-08', 'from': 'Fidelity Transfer Services', 'to': 'Paula Marie Poe', 'action': 'Certificates 7750 and 8087 cancelled and merged into Cert CS1-8166 (5.5M shares)'},
            {'step': 4, 'date': '2019-04-12', 'from': 'Ruben Sanchez', 'to': 'Carter / BMO', 'action': 'Noted in ledger as "sent to carter, yes"'},
            {'step': 5, 'date': '2019-04-20', 'from': 'Paula Marie Poe', 'to': 'Public Float', 'action': 'Deposited in Canadian account and sold to retail investors'}
        ],
        'redFlags': [
            'Explicit spreadsheet ledger note: "From 8087 Justin 3.5MM and 7750 IGRT 2MM"',
            'Direct pooling of affiliate trust stock and CEO son stock into foreign straw',
            'Zero registration statement filed'
        ],
        'evidenceFiles': ['GRNH april 152019.xlsx', 'GRNH 8166 and 8167 total 14MMshares.pdf']
    },
    {
        'certNumber': 'CS1-7750',
        'shares': 2000000,
        'genesisDate': '2016-10-19',
        'originType': 'Direct Issuer Issuance (Gaines Control Trust)',
        'primarySeller': 'GreenGro Technologies, Inc. / Ira J. Gaines Revocable Trust',
        'initialRecipient': 'IRA J. Gaines Revocable Trust',
        'currentHolderOrStatus': 'Amalgamated into Cert CS1-8166 (Paula Marie Poe)',
        'brokerOrClearing': 'Alpine Securities / Fidelity Transfer Services',
        'opinionCounsel': 'Stephen Mills, Esq. (Opinion dated Dec 6, 2017)',
        'custodyHops': [
            {'step': 1, 'date': '2016-10-19', 'from': 'GreenGro Technologies, Inc.', 'to': 'IRA J. Gaines Revocable Trust', 'action': 'Stock Purchase Agreement: 2,000,000 shares for $80,000 ($0.04/sh)'},
            {'step': 2, 'date': '2016-10-21', 'from': 'Fidelity Transfer Services', 'to': 'IRA J. Gaines Revocable Trust', 'action': 'Certificate CS1-7750 issued restricted'},
            {'step': 3, 'date': '2017-12-06', 'from': 'Stephen Mills, Esq.', 'to': 'Fidelity Transfer Services', 'action': 'Section 4(a)(1) opinion issued to remove legend, claiming Gaines Trust was non-affiliate'},
            {'step': 4, 'date': '2018-02-23', 'from': 'IRA J. Gaines Revocable Trust', 'to': 'Alpine Securities', 'action': 'Deposit package submitted for clearance'},
            {'step': 5, 'date': '2019-04-08', 'from': 'Fidelity Transfer Services', 'to': 'Paula Marie Poe', 'action': 'Cancelled and amalgamated into Cert CS1-8166 (5.5M shares)'}
        ],
        'redFlags': [
            'Mills certified Gaines Trust was not an affiliate despite controlling tens of millions of shares',
            'Re-amalgamated in 2019 into foreign nominee Poe to evade US brokerage scrutiny'
        ],
        'evidenceFiles': ['grnhgaines7750.pdf', 'GRNH req for legal 2mm cert 7750.pdf', 'GRNH april 152019.xlsx']
    },
    {
        'certNumber': 'CS1-7800',
        'shares': 1500000,
        'genesisDate': '2016-10-25 (SPA) / 2016-11-18 (Issuance)',
        'originType': 'Direct Issuer Issuance (Gaines Control Trust)',
        'primarySeller': 'GreenGro Technologies, Inc. / Ira J. Gaines Revocable Trust',
        'initialRecipient': 'Ira Gaines Revocable Trust',
        'currentHolderOrStatus': 'Transferred to Canadian Nominee Paula Marie Poe',
        'brokerOrClearing': 'Alpine Securities / Fidelity Transfer Services',
        'opinionCounsel': 'Stephen Mills, Esq. (Opinion dated Dec 6, 2017)',
        'custodyHops': [
            {'step': 1, 'date': '2016-10-25', 'from': 'GreenGro Technologies, Inc.', 'to': 'Ira Gaines Revocable Trust', 'action': 'Stock Purchase Agreement for 1,500,000 shares for $60,000 ($0.04/sh)'},
            {'step': 2, 'date': '2016-11-06', 'from': 'Ira Gaines Trust', 'to': 'Naccarato and Associates', 'action': '$60,000 paid to legal escrow on behalf of GreenGro'},
            {'step': 3, 'date': '2016-11-18', 'from': 'Fidelity Transfer Services', 'to': 'Ira Gaines Trust', 'action': 'Certificate CS1-7800 issued'},
            {'step': 4, 'date': '2017-12-06', 'from': 'Stephen Mills, Esq.', 'to': 'Fidelity Transfer Services', 'action': 'Section 4(a)(1) legal opinion removes restrictive legend'},
            {'step': 5, 'date': '2019-04-10', 'from': 'Fidelity Transfer Services', 'to': 'Paula Marie Poe', 'action': 'Noted in master ledger: "7800 IGRT 1500000 Conv to Poe"'}
        ],
        'redFlags': [
            'Legal opinion certified non-affiliate status under Section 4(a)(1)',
            'Master ledger documents direct conversion from Gaines Trust to Canadian straw Poe'
        ],
        'evidenceFiles': ['grnhgaines7800.pdf', 'GRNH 7800 IGRT For legend lift.pdf', 'GRNH april 152019.xlsx']
    },
    {
        'certNumber': 'CS1-7824',
        'shares': 1000000,
        'genesisDate': '2016-12-23',
        'originType': 'Direct Issuer Issuance / Rapid 4-Day Flip',
        'primarySeller': 'Ira Gaines (Affiliate Transferor)',
        'initialRecipient': 'Ira Gaines',
        'currentHolderOrStatus': 'Transferred to Merrill Lynch Account 2872-57N77',
        'brokerOrClearing': 'Merrill Lynch, Pierce, Fenner & Smith Incorporated',
        'opinionCounsel': 'In-House / Fidelity Transfer Services',
        'custodyHops': [
            {'step': 1, 'date': '2016-12-23', 'from': 'GreenGro Technologies, Inc.', 'to': 'Ira Gaines', 'action': 'Certificate CS1-7824 issued to Ira Gaines'},
            {'step': 2, 'date': '2016-12-27', 'from': 'Ira Gaines', 'to': 'Merrill Lynch', 'action': 'Just 4 days later: Irrevocable Stock Power executed to Merrill Lynch account 2872-57N77'},
            {'step': 3, 'date': '2016-12-28', 'from': 'Fidelity Transfer Services', 'to': 'Merrill Lynch', 'action': 'Overnighted to Merrill Lynch clearing for immediate book-entry credit'}
        ],
        'redFlags': [
            'Hyper-velocity flipping (<96 hours) violating statutory investment intent under Section 2(a)(11)',
            'Transfer agent processed immediate transfer from affiliate into brokerage clearing'
        ],
        'evidenceFiles': ['GRNH 7824 1mm shares to ML 122716.pdf', 'record of GRNH stock transactions.docx']
    },
    {
        'certNumber': 'CS1-7906',
        'shares': 3500000,
        'genesisDate': '2017-03-31',
        'originType': 'Direct Issuer Issuance / 72-Hour Cede & Co Flip',
        'primarySeller': 'Ira Gaines (Affiliate Transferor)',
        'initialRecipient': 'Ira Gaines',
        'currentHolderOrStatus': 'Transferred to Cede & Co. for Exeter Trust',
        'brokerOrClearing': 'Exeter Trust Company / Cede & Co. / BBVA Compass Bank',
        'opinionCounsel': 'In-House / Exeter Trust',
        'custodyHops': [
            {'step': 1, 'date': '2017-03-31', 'from': 'GreenGro Technologies, Inc.', 'to': 'Ira Gaines', 'action': 'Certificate CS1-7906 issued for 3,500,000 shares'},
            {'step': 2, 'date': '2017-04-03', 'from': 'Ira Gaines', 'to': 'Cede & Co.', 'action': '72 hours later: Irrevocable Stock Power executed to Cede & Co. for Exeter Trust Administration'},
            {'step': 3, 'date': '2017-04-10', 'from': 'Exeter Trust Company', 'to': 'BBVA Compass Bank', 'action': 'Proceeds from share sales wired to Gaines BBVA Compass account'}
        ],
        'redFlags': [
            '72-hour turnaround between certificate issuance and Cede & Co. DTC depository transfer',
            'Direct proceeds wired to personal banking accounts'
        ],
        'evidenceFiles': ['record of GRNH stock transactions.docx', 'GRNH 3.5 MM shares.pdf']
    },
    {
        'certNumber': 'CS1-7908',
        'shares': 4000000,
        'genesisDate': '2017-04-05',
        'originType': 'Direct Issuer Issuance (Paradise Wire & Cable Shell)',
        'primarySeller': 'Paradise Wire & Cable, Inc. DBPP (Ira Gaines Shell)',
        'initialRecipient': 'Paradise Wire & Cable, Inc.',
        'currentHolderOrStatus': 'Transferred to Pershing LLC',
        'brokerOrClearing': 'Pershing LLC / Bankers Trust',
        'opinionCounsel': 'In-House / Fidelity Transfer Services (Ruben Sanchez)',
        'custodyHops': [
            {'step': 1, 'date': '2017-04-05', 'from': 'GreenGro Technologies, Inc.', 'to': 'Paradise Wire & Cable, Inc.', 'action': 'Certificate CS1-7908 issued for 4,000,000 shares free-trading from Ruben Sanchez'},
            {'step': 2, 'date': '2017-04-07', 'from': 'Paradise Wire & Cable DBPP', 'to': 'Pershing LLC', 'action': '2 days later: Irrevocable stock power executed to Pershing LLC, signed by Ira Gaines, Trustee'},
            {'step': 3, 'date': '2017-04-12', 'from': 'Pershing LLC', 'to': 'OTC Market', 'action': 'Liquidated into retail market'}
        ],
        'redFlags': [
            'Certificate issued "free-trading" by transfer agent without registration statement',
            'Ira Gaines signed as Trustee for Paradise Wire & Cable Pension Plan',
            'Pershing subsequently terminated Gaines accounts due to regulatory violations'
        ],
        'evidenceFiles': ['record of GRNH stock transactions.docx', 'GRNH 4.0 MM Paradise for Roy.pdf']
    },
    {
        'certNumber': 'CS1-7960 through CS1-7969',
        'shares': 5000000,
        'genesisDate': '2017-08-02 / 2017-08-09',
        'originType': 'Multi-Hop Familial Conduit (Joshua Hintzen 500k Series)',
        'primarySeller': 'Joshua Hintzen / Ira Gaines',
        'initialRecipient': 'Joshua Hintzen (10 certs of 500,000 shs each)',
        'currentHolderOrStatus': 'Transferred to Big Thunder LLC (2018) & Paula Marie Poe (2019)',
        'brokerOrClearing': 'Forest Securities / Alpine Clearing / BMO InvestorLine',
        'opinionCounsel': 'James Hintzen, Esq. & Stephen Mills, Esq.',
        'custodyHops': [
            {'step': 1, 'date': '2017-08-02', 'from': 'GreenGro Technologies, Inc.', 'to': 'Ira Gaines', 'action': 'Certificate CS1-7960 issued for 500,000 shares'},
            {'step': 2, 'date': '2017-08-09', 'from': 'GreenGro Technologies, Inc.', 'to': 'Joshua Hintzen', 'action': 'Nine additional certificates (7961-7969) issued for 500,000 shares each'},
            {'step': 3, 'date': '2018-12-03', 'from': 'Joshua Hintzen', 'to': 'Big Thunder, LLC', 'action': 'LOI to re-issue 8 certificates (7960-7969 series, 4M shs) in name of Big Thunder, LLC'},
            {'step': 4, 'date': '2019-03-27', 'from': 'Joshua Hintzen', 'to': 'Paula Marie Poe', 'action': 'LOI to cancel 5 certificates (7964, 7965, 7966, 7968, 7969) and reissue 2.5M shs to Poe'},
            {'step': 5, 'date': '2019-04-02', 'from': 'Joshua Hintzen', 'to': 'Paula Marie Poe', 'action': 'LOI stating certs 7960, 7961, 7963 are "registered in name of Ira Gaines" and sending to Poe at BMO'}
        ],
        'redFlags': [
            'Smurfing into 500,000 share blocks to evade transfer agent dollar/volume velocity flags',
            'Written admission on 4/2/2019 that certificates belonged to Ira Gaines',
            'Cross-border delivery to Toronto brokerage'
        ],
        'evidenceFiles': ['GRNH loi GRNH Joshua 2 and a half million shares loi to Paul Poe.docx', 'record of GRNH stock transactions.docx', 'GRNH april 152019.xlsx']
    },
    {
        'certNumber': 'CS1-7881',
        'shares': 1000000,
        'genesisDate': '2017-08-09',
        'originType': 'Multi-Hop Familial Conduit (Gaines to Josh Hintzen)',
        'primarySeller': 'Ira Gaines (Affiliate Transferor)',
        'initialRecipient': 'Joshua Hintzen',
        'currentHolderOrStatus': 'Re-issued as Free-Trading to Joshua Hintzen',
        'brokerOrClearing': 'Fidelity Transfer Services / Egan KS Brokerage',
        'opinionCounsel': 'Stephen Mills, Esq. (Reliance)',
        'custodyHops': [
            {'step': 1, 'date': '2017-08-09', 'from': 'Ira Gaines', 'to': 'Fidelity Transfer Services', 'action': 'LOI signed by Gaines instructing cancellation of Cert 7881 and reissuance of free-trading shares to Joshua Hintzen'},
            {'step': 2, 'date': '2017-08-15', 'from': 'Fidelity Transfer Services', 'to': 'Joshua Hintzen', 'action': 'Certificate re-issued without legend'},
            {'step': 3, 'date': '2017-08-20', 'from': 'Joshua Hintzen', 'to': 'Egan KS Account', 'action': 'Delivered for brokerage deposit'}
        ],
        'redFlags': [
            'Gaines directly ordered transfer agent to cancel his certificate and issue free-trading shares to relative',
            'Zero registration statement or bona fide holding period compliance'
        ],
        'evidenceFiles': ['LOI 7881 GRNH from ira to josh.docx', 'GRNH 7881 Sending to Egan KS address 1MM shares.pdf']
    },
    {
        'certNumber': 'CS1-8087',
        'shares': 3500000,
        'genesisDate': '2017-06-15',
        'originType': 'CEO Family Conduit (Justin Haas)',
        'primarySeller': 'Justin Haas (Son of CEO James Haas)',
        'initialRecipient': 'Justin Haas',
        'currentHolderOrStatus': 'Amalgamated into Cert CS1-8166 (Paula Marie Poe)',
        'brokerOrClearing': 'Fidelity Transfer Services / BMO InvestorLine',
        'opinionCounsel': 'Fidelity Transfer Services Processing',
        'custodyHops': [
            {'step': 1, 'date': '2017-06-15', 'from': 'GreenGro Technologies, Inc.', 'to': 'Justin Haas', 'action': '3,500,000 shares issued to CEO son Justin Haas'},
            {'step': 2, 'date': '2018-06-13', 'from': 'James Haas', 'to': 'Ruben Sanchez', 'action': 'Document: "GRNH 3.5 SENT TO RUBEN 61318 TO BE SOLD BY JUSTIN"'},
            {'step': 3, 'date': '2019-04-08', 'from': 'Justin Haas', 'to': 'Paula Marie Poe', 'action': 'Combined with Gaines Trust Cert 7750 to create Cert CS1-8166 (5.5M shares) issued to Poe'}
        ],
        'redFlags': [
            'CEO son certificate used as distribution feeder block for Canadian straw Poe',
            'Direct instruction from CEO to transfer agent to sell Justin shares'
        ],
        'evidenceFiles': ['GRNH 3.5 SENT TO RUBEN 61318 TO BE SOLD BY JUSTIN.pdf', 'GRNH april 152019.xlsx']
    },
    {
        'certNumber': 'CS1-8089',
        'shares': 6500000,
        'genesisDate': '2017-05-01 (Actual Signing) / 2013-09-09 (Backdated)',
        'originType': 'Backdated Sham Consulting Award',
        'primarySeller': 'Mark Delfin (Consultant Nominee)',
        'initialRecipient': 'Mark Delfin',
        'currentHolderOrStatus': 'Used to Feeder Cheryl Hintzen Cert CS1-7937',
        'brokerOrClearing': 'Fidelity Transfer Services',
        'opinionCounsel': 'Stephen Mills, Esq. (Reliance)',
        'custodyHops': [
            {'step': 1, 'date': '2017-05-01', 'from': 'GreenGro Technologies, Inc.', 'to': 'Mark Delfin', 'action': 'Consulting Agreement executed May 1, 2017, backdated 44 months to Sept 9, 2013'},
            {'step': 2, 'date': '2017-05-10', 'from': 'Fidelity Transfer Services', 'to': 'Mark Delfin', 'action': 'Restricted Cert CS1-8089 issued for 6,500,000 shares'},
            {'step': 3, 'date': '2018-01-10', 'from': 'Mark Delfin', 'to': 'Cheryl Hintzen', 'action': 'Feeder pool for Cheryl Hintzen 6,790,000 share transfer and Stephen Mills opinion'}
        ],
        'redFlags': [
            '44-month retroactive backdating',
            'Zero verified advisory services performed',
            'Direct genesis of Hintzen v. Haas lawsuit'
        ],
        'evidenceFiles': ['CONSULTING AGREEMENT_Delfin_GRNH.docx', 'FINAL CONSULTING AGREEMENT_Delfin_GRNH (4).docx']
    },
    {
        'certNumber': 'CS1-8090',
        'shares': 8500000,
        'genesisDate': '2017-05-01 (Actual Signing) / 2015-10-30 (Backdated)',
        'originType': 'Backdated Sham Consulting Award',
        'primarySeller': 'Santiago Rubio (Consultant Nominee)',
        'initialRecipient': 'Santiago Rubio',
        'currentHolderOrStatus': 'Nominee Holding for Reissuance',
        'brokerOrClearing': 'Fidelity Transfer Services',
        'opinionCounsel': 'Stephen Mills, Esq. (Reliance)',
        'custodyHops': [
            {'step': 1, 'date': '2017-05-01', 'from': 'GreenGro Technologies, Inc.', 'to': 'Santiago Rubio', 'action': 'Consulting Agreement executed May 1, 2017, backdated 18 months to Oct 30, 2015 for 8.5M shares'},
            {'step': 2, 'date': '2017-05-10', 'from': 'Fidelity Transfer Services', 'to': 'Santiago Rubio', 'action': 'Restricted Cert CS1-8090 issued'},
            {'step': 3, 'date': '2018-06-01', 'from': 'Santiago Rubio', 'to': 'Nominee Fleet', 'action': 'Used to support unlegended reissuance requests'}
        ],
        'redFlags': [
            '18-month retroactive backdating',
            'Zero monetary consideration received by company treasury'
        ],
        'evidenceFiles': ['CONSULTING AGREEMENT_Rubio_GRNH.docx', 'FINAL CONSULTING AGREEMENT_Rubio_GRNH.docx']
    },
    {
        'certNumber': 'CS1-8091',
        'shares': 8500000,
        'genesisDate': '2017-05-01 (Actual Signing) / 2014-12-08 (Backdated)',
        'originType': 'Backdated Sham Consulting Award',
        'primarySeller': 'Hulbert Ventures (Consultant Nominee)',
        'initialRecipient': 'Hulbert Ventures',
        'currentHolderOrStatus': 'Nominee Holding for Reissuance',
        'brokerOrClearing': 'Fidelity Transfer Services',
        'opinionCounsel': 'Stephen Mills, Esq. (Reliance)',
        'custodyHops': [
            {'step': 1, 'date': '2017-05-01', 'from': 'GreenGro Technologies, Inc.', 'to': 'Hulbert Ventures', 'action': 'Consulting Agreement executed May 1, 2017; duplicate text of Rubio agreement'},
            {'step': 2, 'date': '2017-05-10', 'from': 'Fidelity Transfer Services', 'to': 'Hulbert Ventures', 'action': 'Restricted Cert CS1-8091 issued for 8,500,000 shares'}
        ],
        'redFlags': [
            'Unedited boilerplate copy-paste retaining Santiago Rubio name in body',
            'Fabricated corporate consideration'
        ],
        'evidenceFiles': ['CONSULTING AGREEMENT_Hulbert_GRNH.docx', 'FINAL FINAL CONSULTING AGREEMENT_Hulbert_GRNH.docx']
    },
    {
        'certNumber': 'CS1-8088',
        'shares': 2000000,
        'genesisDate': '2017-05-01 (Actual Signing) / 2015-07-10 (Backdated)',
        'originType': 'Backdated Sham Consulting Award',
        'primarySeller': 'Phoenix Group (Consultant Nominee)',
        'initialRecipient': 'Phoenix Group',
        'currentHolderOrStatus': 'Nominee Holding for Reissuance',
        'brokerOrClearing': 'Fidelity Transfer Services',
        'opinionCounsel': 'Stephen Mills, Esq. (Reliance)',
        'custodyHops': [
            {'step': 1, 'date': '2017-05-01', 'from': 'GreenGro Technologies, Inc.', 'to': 'Phoenix Group', 'action': 'Consulting Agreement executed May 1, 2017, backdated 22 months to July 10, 2015 for 2.0M shares'},
            {'step': 2, 'date': '2017-05-10', 'from': 'Fidelity Transfer Services', 'to': 'Phoenix Group', 'action': 'Restricted Cert CS1-8088 issued'}
        ],
        'redFlags': ['Part of coordinated 25.5M share May 1, 2017 backdating issuance tranche'],
        'evidenceFiles': ['CONSULTING AGREEMENT_PHEONIX_GRNH.docx']
    },
    {
        'certNumber': 'CS1-8158 through CS1-8160',
        'shares': 8000000,
        'genesisDate': '2019-04-03',
        'originType': 'Canadian Straw Nominee Consolidation',
        'primarySeller': 'Paula Marie Poe (Canadian Straw)',
        'initialRecipient': 'Paula Marie Poe',
        'currentHolderOrStatus': 'BMO InvestorLine Account #23013702-15',
        'brokerOrClearing': 'BMO InvestorLine (Toronto) / Fidelity Transfer Services',
        'opinionCounsel': 'Fidelity Transfer Services Processing',
        'custodyHops': [
            {'step': 1, 'date': '2019-04-03', 'from': 'GreenGro Technologies, Inc.', 'to': 'Paula Marie Poe', 'action': 'Certificates CS1-8158 (2.5M), CS1-8159 (3.0M), CS1-8160 (2.5M) issued directly to Poe'},
            {'step': 2, 'date': '2019-04-08', 'from': 'Ruben Sanchez', 'to': 'BMO InvestorLine', 'action': 'Overnighted to First Canadian Place, Toronto via FedEx account #165398572'}
        ],
        'redFlags': ['Direct issuance of 8.0M shares to foreign nominee without registration or public disclosure'],
        'evidenceFiles': ['GRNH april 152019.xlsx', 'record of GRNH stock transactions.docx']
    },
    {
        'certNumber': 'CS1-8161 through CS1-8165',
        'shares': 22000000,
        'genesisDate': '2019-04-04',
        'originType': 'Canadian Straw Note Amalgamation',
        'primarySeller': 'Paula Marie Poe (Canadian Straw)',
        'initialRecipient': 'Paula Marie Poe',
        'currentHolderOrStatus': 'BMO InvestorLine Account #23013702-15',
        'brokerOrClearing': 'BMO InvestorLine (Toronto) / Bank of America',
        'opinionCounsel': 'Fidelity Transfer Services Processing',
        'custodyHops': [
            {'step': 1, 'date': '2019-04-04', 'from': 'Various Debt Paper Holders', 'to': 'Paula Marie Poe', 'action': '22,000,000 shares consolidated across certificates 8161 through 8165'},
            {'step': 2, 'date': '2019-04-04', 'from': 'BofA Account', 'to': 'Fidelity Transfer Services', 'action': '$107,500 wire fee paid to Fidelity on 4/4/2019 for processing Certs 8163/8164'},
            {'step': 3, 'date': '2019-04-12', 'from': 'Fidelity Transfer Services', 'to': 'BMO InvestorLine', 'action': 'Certificates shipped to Toronto for open market resale'}
        ],
        'redFlags': [
            '$107,500 processing fee paid directly to transfer agent',
            '22 million shares issued at effective $0.007/share subpenny price'
        ],
        'evidenceFiles': ['GRNH april 152019.xlsx', 'GRNH 8161 - 8165 22MM shares.pdf']
    },
    {
        'certNumber': 'CS1-8167',
        'shares': 8500000,
        'genesisDate': '2019-04-08',
        'originType': 'Canadian Straw Direct Amalgamation',
        'primarySeller': 'Paula Marie Poe (Canadian Straw)',
        'initialRecipient': 'Paula Marie Poe',
        'currentHolderOrStatus': 'BMO InvestorLine Account #23013702-15',
        'brokerOrClearing': 'BMO InvestorLine / Bank of America / Fidelity',
        'opinionCounsel': 'Fidelity Transfer Services Processing',
        'custodyHops': [
            {'step': 1, 'date': '2019-04-08', 'from': 'GreenGro Technologies, Inc.', 'to': 'Paula Marie Poe', 'action': 'Certificate CS1-8167 issued for 8,500,000 shares'},
            {'step': 2, 'date': '2019-04-08', 'from': 'BofA Account', 'to': 'Fidelity Transfer Services', 'action': '$50,150 wire fee paid to Fidelity for 8.5M shares processing'},
            {'step': 3, 'date': '2019-04-15', 'from': 'Fidelity Transfer Services', 'to': 'BMO InvestorLine', 'action': 'Shipped to Toronto brokerage for Canadian deposit'}
        ],
        'redFlags': ['$50,150 paid directly to transfer agent; zero funds to GreenGro treasury'],
        'evidenceFiles': ['GRNH april 152019.xlsx', 'GRNH 8166 and 8167 total 14MMshares.pdf']
    },
    {
        'certNumber': 'CS1-8169',
        'shares': 5500000,
        'genesisDate': '2019-04-10',
        'originType': 'Canadian Straw Direct Amalgamation',
        'primarySeller': 'Paula Marie Poe (Canadian Straw)',
        'initialRecipient': 'Paula Marie Poe',
        'currentHolderOrStatus': 'BMO InvestorLine Account #23013702-15',
        'brokerOrClearing': 'BMO InvestorLine / Bank of America / Fidelity',
        'opinionCounsel': 'Fidelity Transfer Services Processing',
        'custodyHops': [
            {'step': 1, 'date': '2019-04-10', 'from': 'GreenGro Technologies, Inc.', 'to': 'Paula Marie Poe', 'action': 'Certificate CS1-8169 issued for 5,500,000 shares (of 6.5M total allotment)'},
            {'step': 2, 'date': '2019-04-10', 'from': 'BofA Account', 'to': 'Fidelity Transfer Services', 'action': '$39,000 wire fee paid to Fidelity for processing'},
            {'step': 3, 'date': '2019-04-12', 'from': 'Fidelity Transfer Services', 'to': 'BMO InvestorLine', 'action': 'Shipped to Toronto brokerage'}
        ],
        'redFlags': ['$39,000 fee paid directly to transfer agent'],
        'evidenceFiles': ['GRNH april 152019.xlsx', 'GRNH 8169 5mm of total 605.pdf']
    },
    {
        'certNumber': 'CS1-8171',
        'shares': 1000000,
        'genesisDate': '2019-04-12',
        'originType': 'Canadian Straw Direct Amalgamation',
        'primarySeller': 'Paula Marie Poe (Canadian Straw)',
        'initialRecipient': 'Paula Marie Poe',
        'currentHolderOrStatus': 'BMO InvestorLine Account #23013702-15',
        'brokerOrClearing': 'BMO InvestorLine / Carter Clearing',
        'opinionCounsel': 'Fidelity Transfer Services Processing',
        'custodyHops': [
            {'step': 1, 'date': '2019-04-12', 'from': 'GreenGro Technologies, Inc.', 'to': 'Paula Marie Poe', 'action': 'Certificate CS1-8171 issued for 1,000,000 shares'},
            {'step': 2, 'date': '2019-04-12', 'from': 'Ruben Sanchez', 'to': 'Carter / BMO', 'action': 'Noted in master ledger: "sent to carter 2019-04-12"'}
        ],
        'redFlags': ['Part of massive April 2019 offshore straw consolidation'],
        'evidenceFiles': ['GRNH april 152019.xlsx', 'GRNH 8172 8169 8171.pdf']
    },
    {
        'certNumber': 'CS1-8173',
        'shares': 950000,
        'genesisDate': '2019-04-15',
        'originType': 'Secondary Promoter Transfer ("Ron")',
        'primarySeller': 'Ronald Brouillette ("Ron")',
        'initialRecipient': 'Paula Marie Poe',
        'currentHolderOrStatus': 'Pending Delivery per April 2019 Ledger',
        'brokerOrClearing': 'Fidelity Transfer Services / Carter',
        'opinionCounsel': 'Fidelity Transfer Services Processing',
        'custodyHops': [
            {'step': 1, 'date': '2018-12-10', 'from': 'Third Coast Partners / GRNH', 'to': 'Ronald Brouillette ("Ron")', 'action': 'Promoter compensation carveout originating from consulting/debt arrangement'},
            {'step': 2, 'date': '2019-04-15', 'from': 'Ronald Brouillette ("Ron")', 'to': 'Paula Marie Poe', 'action': 'Certificate CS1-8173 issued for 950,000 shares, noted in ledger as "Paid to Fidelity: Ron, sent to carter: not SENT YET"'}
        ],
        'redFlags': ['Direct evidence that promoter Ron Brouillette was paying Fidelity Transfer Services directly'],
        'evidenceFiles': ['GRNH april 152019.xlsx', 'GRNH 8172 10MM and 8173 950k.pdf']
    },
    {
        'certNumber': 'CS1-7568',
        'shares': 1000000,
        'genesisDate': '2015-06-01',
        'originType': 'Direct Issuer Issuance ("Compromise June 2015")',
        'primarySeller': 'Ira Gaines (Affiliate Transferor)',
        'initialRecipient': 'Ira Gaines',
        'currentHolderOrStatus': 'Deposited at Wedbush Securities',
        'brokerOrClearing': 'Wedbush Securities, Inc.',
        'opinionCounsel': 'In-House Legal Package',
        'custodyHops': [
            {'step': 1, 'date': '2015-06-01', 'from': 'GreenGro Technologies, Inc.', 'to': 'Ira Gaines', 'action': 'Issued under "Compromise June 2015" for 1,000,000 shares'},
            {'step': 2, 'date': '2016-04-01', 'from': 'Ira Gaines', 'to': 'Wedbush Securities', 'action': 'Noted in master cert ledger: "at wedbush"'}
        ],
        'redFlags': ['Early seed block used to establish OTC trading velocity'],
        'evidenceFiles': ['GRNH 7568 legal and cert.pdf', 'STOCK INVENTORY JULY 16  (version 1) (Autosaved) 2.xlsx']
    },
    {
        'certNumber': 'CS1-7549',
        'shares': 7000000,
        'genesisDate': '2015-06-01',
        'originType': 'Direct Issuer Issuance ("Compromise June 2015")',
        'primarySeller': 'Dignitas Consulting LLC',
        'initialRecipient': 'Dignitas Consulting LLC',
        'currentHolderOrStatus': 'Feeder Block for Dignitas Secondary Resales',
        'brokerOrClearing': 'Wilson-Davis & Co / Dignitas Fleet',
        'opinionCounsel': 'McGee Legal / Stephen Mills',
        'custodyHops': [
            {'step': 1, 'date': '2015-06-01', 'from': 'GreenGro Technologies, Inc.', 'to': 'Dignitas Consulting LLC', 'action': '7,000,000 restricted shares issued under June 2015 compromise'},
            {'step': 2, 'date': '2016-04-01', 'from': 'Dignitas Consulting LLC', 'to': 'Promoter Conduits', 'action': 'Used to feed secondary stock purchase agreements and promissory note pledges'}
        ],
        'redFlags': ['Massive 7,000,000 share block issued without registered public offering'],
        'evidenceFiles': ['STOCK INVENTORY JULY 16  (version 1) (Autosaved) 2.xlsx', 'GRNH SPA 2M Ron Dignitas.pdf']
    },
    {
        'certNumber': 'CS1-7596',
        'shares': 250000,
        'genesisDate': '2016-04-01',
        'originType': 'Direct Issuer Issuance (Paradise Wire & Cable Shell)',
        'primarySeller': 'Paradise Wire & Cable, Inc.',
        'initialRecipient': 'Paradise Wire & Cable, Inc.',
        'currentHolderOrStatus': 'Deposited at Wilson-Davis & Co.',
        'brokerOrClearing': 'Wilson-Davis & Co. (WDCO)',
        'opinionCounsel': 'McGee Legal',
        'custodyHops': [
            {'step': 1, 'date': '2016-04-01', 'from': 'GreenGro Technologies, Inc.', 'to': 'Paradise Wire & Cable, Inc.', 'action': 'Issued for 250,000 shares'},
            {'step': 2, 'date': '2016-04-01', 'from': 'Paradise Wire & Cable', 'to': 'Wilson-Davis & Co.', 'action': 'Noted in master inventory: "4/1/16 cert to WDCO"'}
        ],
        'redFlags': ['Corporate shell utilized to deposit shares into subpenny brokerage'],
        'evidenceFiles': ['GRNH 7596 Paradise.pdf', 'STOCK INVENTORY JULY 16  (version 1) (Autosaved) 2.xlsx']
    },
    {
        'certNumber': 'CS1-7628',
        'shares': 1000000,
        'genesisDate': '2016-04-27',
        'originType': 'Direct Issuer Issuance (Ira Gaines)',
        'primarySeller': 'Ira Gaines',
        'initialRecipient': 'Ira Gaines',
        'currentHolderOrStatus': 'Deposited at Wilson-Davis & Co.',
        'brokerOrClearing': 'Wilson-Davis & Co. (WDCO)',
        'opinionCounsel': 'McGee Legal',
        'custodyHops': [
            {'step': 1, 'date': '2016-04-27', 'from': 'GreenGro Technologies, Inc.', 'to': 'Ira Gaines', 'action': 'Certificate CS1-7628 issued for 1,000,000 shares'},
            {'step': 2, 'date': '2016-04-27', 'from': 'Ira Gaines', 'to': 'Wilson-Davis & Co.', 'action': 'Noted in inventory: "all in WDCO 4/27"'}
        ],
        'redFlags': ['Wilson-Davis later sanctioned by SEC and closed Gaines accounts'],
        'evidenceFiles': ['STOCK INVENTORY JULY 16  (version 1) (Autosaved) 2.xlsx']
    }
]

db['certificateLineage']['traceableCertificates'] = traceable_certs
db['certificateLineage']['summaryMetrics']['totalTrackedCertificates'] = len(traceable_certs)

with open(db_path, 'w') as f:
    json.dump(db, f, indent=2)

print(f"Successfully generated {len(traceable_certs)} detailed traceable certificate dossiers!")
