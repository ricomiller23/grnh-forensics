import re

with open('src/app/lineage/page.tsx', 'r') as f:
    content = f.read()

# 1. Update Lucide imports if Printer, ChevronLeft, ChevronRight, Download not present
old_imports = """import {
  ArrowLeft,
  Search,
  Copy,
  Check,
  ShieldAlert,
  AlertOctagon,
  ArrowRight,
  Scale,
  Building2,
  Users,
  FileText,
  FileCheck2,
  Briefcase,
  Flame,
  Layers,
  Sparkles,
  GitCommit,
  Landmark,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";"""

new_imports = """import {
  ArrowLeft,
  Search,
  Copy,
  Check,
  ShieldAlert,
  AlertOctagon,
  ArrowRight,
  Scale,
  Building2,
  Users,
  FileText,
  FileCheck2,
  Briefcase,
  Flame,
  Layers,
  Sparkles,
  GitCommit,
  Landmark,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Printer,
  ChevronLeft,
  ChevronRight,
  Download
} from "lucide-react";"""

content = content.replace(old_imports, new_imports)

# 2. Add state variables: selectedGraphicCertId, certViewMode, copiedCitation
state_target = """  const [expandedCertId, setExpandedCertId] = useState<string | null>("CS1-8002");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);"""

state_replacement = """  const [expandedCertId, setExpandedCertId] = useState<string | null>("CS1-8002");
  const [selectedGraphicCertId, setSelectedGraphicCertId] = useState<string>("CS1-8002");
  const [certViewMode, setCertViewMode] = useState<"flowchart" | "table">("flowchart");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);

  const selectedGraphicCert = useMemo(() => {
    return traceableCertificates.find((c) => c.certNumber === selectedGraphicCertId) || traceableCertificates[0];
  }, [traceableCertificates, selectedGraphicCertId]);

  const selectedCertIndex = useMemo(() => {
    return traceableCertificates.findIndex((c) => c.certNumber === selectedGraphicCertId);
  }, [traceableCertificates, selectedGraphicCertId]);

  const handlePrevCert = () => {
    if (selectedCertIndex > 0) {
      setSelectedGraphicCertId(traceableCertificates[selectedCertIndex - 1].certNumber);
    } else {
      setSelectedGraphicCertId(traceableCertificates[traceableCertificates.length - 1].certNumber);
    }
  };

  const handleNextCert = () => {
    if (selectedCertIndex < traceableCertificates.length - 1) {
      setSelectedGraphicCertId(traceableCertificates[selectedCertIndex + 1].certNumber);
    } else {
      setSelectedGraphicCertId(traceableCertificates[0].certNumber);
    }
  };

  const getActorIcon = (actorType?: string) => {
    switch (actorType) {
      case "issuer":
        return <Building2 size={15} />;
      case "conduit":
        return <Users size={15} />;
      case "counsel":
        return <Scale size={15} />;
      case "broker":
        return <Landmark size={15} />;
      case "offshore":
        return <ExternalLink size={15} />;
      default:
        return <GitCommit size={15} />;
    }
  };

  const getStageStyle = (stageBadge?: string) => {
    const s = stageBadge || "";
    if (s.includes("Genesis") || s.includes("Origin")) {
      return { bg: "rgba(56, 189, 248, 0.12)", border: "#38bdf8", text: "#38bdf8", tag: "Securities Act § 5 (Unregistered Offering)" };
    }
    if (s.includes("SPA") || s.includes("Purchase") || s.includes("Conduit")) {
      return { bg: "rgba(251, 191, 36, 0.12)", border: "#fbbf24", text: "#fbbf24", tag: "Rule 144(a)(1) Nominee Underwriter" };
    }
    if (s.includes("Courier") || s.includes("Physical") || s.includes("Transit")) {
      return { bg: "rgba(168, 85, 247, 0.12)", border: "#a855f7", text: "#c084fc", tag: "Physical Escrow & Custody Delivery" };
    }
    if (s.includes("Opinion") || s.includes("Whitewash")) {
      return { bg: "rgba(244, 63, 94, 0.15)", border: "#f43f5e", text: "#fb7185", tag: "Securities Act § 17(a) & 10b-5 Misrepresentation" };
    }
    if (s.includes("Brokerage") || s.includes("Deposit")) {
      return { bg: "rgba(99, 102, 241, 0.15)", border: "#6366f1", text: "#818cf8", tag: "FINRA Rule 2010 & Clearing AML Evasion" };
    }
    if (s.includes("Retail") || s.includes("Liquidation") || s.includes("Disposition")) {
      return { bg: "rgba(16, 185, 129, 0.15)", border: "#10b981", text: "#34d399", tag: "Exchange Act § 10(b) Fraudulent Distribution" };
    }
    if (s.includes("Stock Power")) {
      return { bg: "rgba(234, 179, 8, 0.15)", border: "#eab308", text: "#fde047", tag: "Straw Stock Power Endorsement" };
    }
    if (s.includes("Split") || s.includes("Re-issuance")) {
      return { bg: "rgba(14, 165, 233, 0.15)", border: "#0ea5e9", text: "#7dd3fc", tag: "Tack-Period Falsification / Split Washing" };
    }
    return { bg: "rgba(148, 163, 184, 0.12)", border: "#94a3b8", text: "#cbd5e1", tag: "Securities Custody Transit Hop" };
  };

  const copyLegalCitation = (cert: TraceableCertificate) => {
    const citation = `EXHIBIT CUSTODY TRACE - CERTIFICATE NO. ${cert.certNumber}\\n` +
      `Issuer: GreenGro Technologies, Inc. (OTC: GRNH) | Common Shares: ${cert.shares.toLocaleString()}\\n` +
      `Genesis Date: ${cert.genesisDate} | Origin Mechanics: ${cert.originType}\\n` +
      `Primary Seller / Intermediary: ${cert.primarySeller} | Initial Recipient: ${cert.initialRecipient}\\n` +
      `Legal Opinion Counsel: ${cert.opinionCounsel} | Clearing Depository: ${cert.brokerOrClearing}\\n` +
      `Disposition Status: ${cert.currentHolderOrStatus}\\n\\n` +
      `VERIFIED CHAIN-OF-CUSTODY HOPS:\\n` +
      cert.custodyHops.map(h => `  [Hop ${h.step} - ${h.date}] ${h.stageBadge}: ${h.from} -> ${h.to} | Action: ${h.action}`).join('\\n') +
      `\\n\\nPRIMARY PHYSICAL HARD DRIVE RECEIPTS:\\n` +
      cert.evidenceFiles.map(f => `  - ${f}`).join('\\n');
    navigator.clipboard.writeText(citation);
    setCopiedCitation(cert.certNumber);
    setTimeout(() => setCopiedCitation(null), 2500);
  };"""

content = content.replace(state_target, state_replacement)

print("Updated imports and state variables.")
with open('src/app/lineage/page.tsx', 'w') as f:
    f.write(content)
