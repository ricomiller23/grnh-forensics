export interface EvidentiaryPhase {
  id: string;
  name: string;
  color: string;
  period: string;
  summary: string;
  riskLevel: string;
  badges: string[];
}

export interface EntityProfile {
  name: string;
  role: string;
  description: string;
  entities: string[];
  status: string;
}

export interface FraudPattern {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Elevated" | "Medium";
  statutoryViolation: string;
  description: string;
  affectedCertificates: string[];
  primaryEvidenceFiles: string[];
}

export interface Transaction {
  id: string;
  date: string;
  cert: string;
  shares: number;
  from: string;
  to: string;
  type: string;
  price: string;
  status: string;
  ta: string;
  opinion: string;
  phase: string;
  anomalies: string[];
  notes: string;
  sources: string[];
}

export interface CertificateIssuance {
  txId: string;
  date: string;
  shares: number;
  from: string;
  to: string;
  price: string;
  notes: string;
}

export interface CertificateDossier {
  certNumber: string;
  totalShares: number;
  issuances: CertificateIssuance[];
  transfers: any[];
  legalOpinions: string[];
  anomalies: string[];
  currentHolder: string;
  phase: string;
}

export interface DiscoveredSourceFile {
  id: string;
  filename: string;
  path: string;
  fileUrl: string;
  sizeBytes: number;
  sizeFormatted: string;
  extension: string;
  category: string;
  matchTag: string;
  directory: string;
  linkedCertificates: string[];
}

export interface ForensicMeta {
  ticker: string;
  companyName: string;
  caseCaptions: string[];
  auditorDesk: string;
  generatedAt: string;
  totalSharesTracked: number;
  totalTransactions: number;
  totalCertificates: number;
  totalDiscoveredFiles: number;
  anomaliesDetected: number;
}


export interface NonCompanyMechanismSummary {
  mechanism: string;
  shares: number;
  percentage: string;
  color: string;
}

export interface NonCompanyShareTranche {
  id: string;
  recipient: string;
  cert: string;
  shares: number;
  mechanismCategory: string;
  opinionDate: string;
  opinionAuthor: string;
  statedOrigin: string;
  actualCompanyCash: string;
  statutoryViolations: string[];
  forensicAutopsy: string;
  primaryEvidenceFiles: string[];
}

export interface RootOpinionAutopsy {
  title: string;
  attorney: string;
  recipient: string;
  date: string;
  shares: number;
  issuerOutstandingShares: number;
  statedPercentage: string;
  actualPercentage: string;
  verbatimExcerpts: string[];
  statutoryViolations: {
    statute: string;
    analysis: string;
  }[];
}

export interface CherylHintzenLawsuitAutopsy {
  title: string;
  caseCaption: string;
  certificateNumber: string;
  shares: number;
  plaintiffClaim: string;
  opinionAttorney: string;
  claimedProvenance: string;
  evidentiaryDiscrepancy: string;
  defenseStrategies: {
    doctrine: string;
    legalRule: string;
    application: string;
  }[];
}

export interface StatutoryVulnerability {
  code: string;
  name: string;
  summary: string;
  relevanceToLitigation: string;
}

export interface LitigationPlaybookItem {
  witness: string;
  targetSubject: string;
  sampleQuestions: string[];
}

export interface NonCompanySharesAnalysis {
  summaryMetrics: {
    totalNonCompanyShares: number;
    totalTranchesTracked: number;
    directCompanyCashReceived: string;
    pctNonCompanySourced: string;
    flaggedOpinionAttorneys: string[];
    primaryStatutoryViolations: string[];
    breakdownByMechanism: NonCompanyMechanismSummary[];
  };
  tranches: NonCompanyShareTranche[];
  rootOpinionAutopsy: RootOpinionAutopsy;
  cherylHintzenLawsuitAutopsy: CherylHintzenLawsuitAutopsy;
  statutoryVulnerabilities: StatutoryVulnerability[];
  litigationPlaybook: LitigationPlaybookItem[];
}

export interface ForensicDatabase {
  meta: ForensicMeta;
  evidentiaryPhases: EvidentiaryPhase[];
  entities: EntityProfile[];
  fraudPatterns: FraudPattern[];
  transactions: Transaction[];
  certificates: Record<string, CertificateDossier>;
  sourceFilesCatalog: DiscoveredSourceFile[];
  nonCompanySharesAnalysis: NonCompanySharesAnalysis;
}
