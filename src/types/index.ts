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

export interface ForensicDatabase {
  meta: ForensicMeta;
  evidentiaryPhases: EvidentiaryPhase[];
  entities: EntityProfile[];
  fraudPatterns: FraudPattern[];
  transactions: Transaction[];
  certificates: Record<string, CertificateDossier>;
  sourceFilesCatalog: DiscoveredSourceFile[];
}
