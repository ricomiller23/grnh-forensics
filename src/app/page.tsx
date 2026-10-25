"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { LexCoreConcurrentEngine, LawAnalysisTarget } from "@/components/LexCoreConcurrentEngine";
import db from "@/data/grnh_forensic_database.json";
import { CertificateDossier, ForensicDatabase } from "@/types";
import {
  ExternalLink,
  ShieldAlert,
  AlertOctagon,
  FileWarning,
  Landmark,
  DollarSign,
  Percent,
  Briefcase,
  FileText,
  Search,
  Download,
  AlertTriangle,
  Calendar,
  Scale,
  Users,
  HardDrive,
  ArrowRight,
  FileCheck2,
  Gavel,
  BadgeAlert,
  Building2,
  Copy,
  Check,
  GitCommit,
  Share2
} from "lucide-react";

export default function ForensicDashboard() {
  const [activeTab, setActiveTab] = useState<"timeline" | "matcher" | "vault" | "radar" | "entities" | "non-company">("timeline");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [selectedCert, setSelectedCert] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMatcherCert, setSelectedMatcherCert] = useState<string>("CS1-7750");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [selectedNonCompanyCategory, setSelectedNonCompanyCategory] = useState<string>("all");
  const [selectedWitness, setSelectedWitness] = useState<string>("John T. Root, Jr., Esq.");
  const [expandedNonCompanyId, setExpandedNonCompanyId] = useState<string | null>("NCS-01");

  const [lexCoreMode, setLexCoreMode] = useState<"hidden" | "drawer" | "split">("hidden");
  const [lexCoreCustomTarget, setLexCoreCustomTarget] = useState<LawAnalysisTarget | null>(null);

  const handleTriggerLexCore = (targetData: {
    name: string;
    cert?: string;
    shares: string | number;
    recipient?: string;
    statute?: string;
    precedent?: string;
    summary: string;
    primaryFiles?: string[];
    category?: string;
  }) => {
    const target: LawAnalysisTarget = {
      id: "target-" + String(Date.now()),
      name: targetData.name,
      category: targetData.category || "Forensic Share Issuance",
      shares: typeof targetData.shares === "number" ? targetData.shares.toLocaleString() : targetData.shares,
      statute: targetData.statute || "Securities Act § 5(a)/(c) Strict Liability",
      precedent: targetData.precedent || "SEC v. Ralston Purina Co., 346 U.S. 119",
      summary: targetData.summary,
      primaryFiles: targetData.primaryFiles || ["accounts/Gaines (IRA)/TD-2020/statements/TD_Ameritrade_Oct2020.pdf"],
      cert: targetData.cert
    };
    setLexCoreCustomTarget(target);
    if (lexCoreMode === "hidden") {
      setLexCoreMode("drawer");
    }
  };


  const forensicDb = db as unknown as ForensicDatabase;
  const { meta, evidentiaryPhases, entities, fraudPatterns, transactions, sourceFilesCatalog, nonCompanySharesAnalysis } = forensicDb;
  const certificates = forensicDb.certificates;

  // Filtered Non-Company Sourced Tranches
  const filteredNonCompanyTranches = useMemo(() => {
    if (!nonCompanySharesAnalysis?.tranches) return [];
    return nonCompanySharesAnalysis.tranches.filter((t: any) => {
      const matchCat =
        selectedNonCompanyCategory === "all" || t.mechanismCategory === selectedNonCompanyCategory;
      const q = searchQuery.toLowerCase();
      const matchQ =
        !searchQuery ||
        t.recipient.toLowerCase().includes(q) ||
        t.cert.toLowerCase().includes(q) ||
        t.opinionAuthor.toLowerCase().includes(q) ||
        t.statedOrigin.toLowerCase().includes(q) ||
        t.forensicAutopsy.toLowerCase().includes(q) ||
        t.statutoryViolations.some((v: string) => v.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [nonCompanySharesAnalysis, selectedNonCompanyCategory, searchQuery]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchPhase = selectedPhase === "all" || tx.phase === selectedPhase;
      const matchCert = selectedCert === "all" || tx.cert.toLowerCase().includes(selectedCert.toLowerCase());
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !searchQuery ||
        tx.cert.toLowerCase().includes(q) ||
        tx.from.toLowerCase().includes(q) ||
        tx.to.toLowerCase().includes(q) ||
        tx.notes.toLowerCase().includes(q) ||
        tx.opinion.toLowerCase().includes(q) ||
        tx.anomalies.some((a) => a.toLowerCase().includes(q));
      return matchPhase && matchCert && matchQuery;
    });
  }, [transactions, selectedPhase, selectedCert, searchQuery]);

  // Filtered files in the Vault
  const filteredFiles = useMemo(() => {
    return sourceFilesCatalog.filter((f) => {
      const matchCat = selectedCategory === "all" || f.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !searchQuery ||
        f.filename.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.path.toLowerCase().includes(q) ||
        f.linkedCertificates.some((c) => c.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [sourceFilesCatalog, selectedCategory, searchQuery]);

  // Categories list
  const categoriesList = useMemo(() => {
    const cats = new Set(sourceFilesCatalog.map((f) => f.category));
    return ["all", ...Array.from(cats).sort()];
  }, [sourceFilesCatalog]);

  // Unique certificates list for dropdown
  const certificateNumbers = useMemo(() => {
    return Object.keys(certificates).sort();
  }, [certificates]);

  // Active dossier for Certificate Matcher
  const activeDossier: CertificateDossier =
    certificates[selectedMatcherCert] || Object.values(certificates)[0];

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleDownloadReport = () => {
    const reportHeader = `# FORENSIC SECURITIES AUDIT BRIEF: GREENGRO TECHNOLOGIES, INC. (OTC: GRNH)
Generated: ${meta.generatedAt}
Auditor Desk: ${meta.auditorDesk}
Total Shares Tracked: ${meta.totalSharesTracked.toLocaleString()}
Primary Evidentiary Source Files on Disk: ${meta.totalDiscoveredFiles}

## 1. APPLICABLE LITIGATION DOCKETS
${meta.caseCaptions.map((c) => `- ${c}`).join("\n")}

## 2. EVIDENTIARY PHASES: FROM LEGAL TO HIGHLY ILLEGAL
${evidentiaryPhases
  .map(
    (p) => `### ${p.name}
Risk: ${p.riskLevel} | Period: ${p.period}
${p.summary}
`
  )
  .join("\n")}

## 3. FULL CHRONOLOGICAL TRANSACTION LEDGER
| Date | Cert # | Shares | From -> To | Price / Basis | Legal Opinion | Anomalies |
|---|---|---|---|---|---|---|
${transactions
  .map(
    (t) =>
      `| ${t.date} | ${t.cert} | ${t.shares.toLocaleString()} | ${t.from} -> ${t.to} | ${t.price} | ${t.opinion} | ${t.anomalies.join("; ") || "None"} |`
  )
  .join("\n")}

## 4. PRIMARY EVIDENTIARY FILES CATALOG (${sourceFilesCatalog.length} Files Indexed)
${sourceFilesCatalog
  .slice(0, 100)
  .map((f) => `- [${f.category}] **${f.filename}** (${f.sizeFormatted})\n  Path: \`${f.path}\``)
  .join("\n")}
`;

    const blob = new Blob([reportHeader], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GRNH_Forensic_Securities_Audit_Brief.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Legal Notice Ribbon */}
      <div
        style={{
          background: "linear-gradient(90deg, #1e1b4b 0%, #0f172a 50%, #31102f 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "8px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.76rem",
          color: "#cbd5e1",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="badge badge-purple" style={{ fontSize: "0.68rem" }}>
            <Gavel size={12} /> CRIMINAL & CIVIL RECORD
          </span>
          <span>
            <strong>Primary Dockets:</strong> USA v. Gaines (2:21-cr-00266) | Hintzen v. Haas (CV2025-013574)
          </span>
        </div>
        <div style={{ display: "flex", gap: "16px", color: "#94a3b8" }}>
          <span>Auditor Desk: {meta.auditorDesk}</span>
          <span>Indexed: {meta.totalDiscoveredFiles} Hard Drive Documents</span>
        </div>
      </div>

      {/* Main Header */}
      <header
        style={{
          padding: "24px 32px 18px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(10, 15, 26, 0.6)",
        }}
      >
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#38bdf8", letterSpacing: "-0.02em" }}>
                  GRNH
                </span>
                <span style={{ fontSize: "1.25rem", color: "#e2e8f0", fontWeight: 600 }}>
                  GreenGro Technologies, Inc.
                </span>
                <span className="badge badge-rose" style={{ padding: "4px 10px" }}>
                  <BadgeAlert size={13} /> {meta.anomaliesDetected} RED-FLAG FRAUD ANOMALIES
                </span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "800px" }}>
                Interactive forensic database investigating the multi-phase evolution of GreenGro restricted stock transactions
                from legal Section 4(a)(1) placements to sham backdated contracts, transfer agent discrepancies (29M–120M shares),
                and federal securities fraud.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <a
                id="btn-lexcore-copilot"
                href="https://lex-core-terminal-20261024.vercel.app/"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                  color: "#ffffff",
                  border: "1px solid #38bdf8",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  padding: "9px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(8, 145, 178, 0.35)",
                }}
              >
                <Scale size={15} /> LexCore Law & Deep Research Copilot ↗
              </a>
              <Link
                href="/lineage"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "#ffffff",
                  border: "1px solid #a855f7",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  padding: "9px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(124, 58, 237, 0.35)",
                }}
              >
                <GitCommit size={15} /> Certificate Lineage & Transfer Patterns Studio →
              </Link>
              <a
                href="/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md"
                download="LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(244, 63, 94, 0.15)",
                  color: "#fb7185",
                  border: "1px solid rgba(244, 63, 94, 0.4)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  padding: "9px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                <FileText size={15} /> Lawyer Highway Map & Handbook (.MD)
              </a>
              <a
                href="/GRNH_Forensic_Securities_Litigation_Report.pdf"
                download="GRNH_Forensic_Securities_Litigation_Report.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(2, 132, 199, 0.35) 100%)",
                  color: "#7dd3fc",
                  border: "1px solid rgba(56, 189, 248, 0.5)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  padding: "9px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  boxShadow: "0 2px 10px rgba(56, 189, 248, 0.2)",
                }}
              >
                <FileCheck2 size={15} /> Download Full Audit (PDF)
              </a>
              <a
                href="/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.pdf" 
                download="LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.35) 100%)",
                  color: "#fca5a5",
                  border: "1px solid rgba(239, 68, 68, 0.5)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  padding: "9px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  boxShadow: "0 2px 10px rgba(239, 68, 68, 0.2)",
                }}
              >
                <FileText size={15} /> Download Lawyer Handbook (PDF)
              </a>
              <button onClick={handleDownloadReport} className="btn-primary">
                <Download size={15} /> Export Legal Brief (.MD)
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "14px",
              marginTop: "20px",
            }}
          >
            <div className="glass-panel" style={{ padding: "14px 18px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Tracked Shares
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#38bdf8", fontFamily: "var(--font-mono)" }}>
                {meta.totalSharesTracked.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Across 38 Primary Transactions
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "14px 18px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Hard Drive Primary Files
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#34d399", fontFamily: "var(--font-mono)" }}>
                {meta.totalDiscoveredFiles} Files
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Desktop, Downloads, iCloud, Backups
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "14px 18px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Foreign Straw Dumping
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#f43f5e", fontFamily: "var(--font-mono)" }}>
                30,450,000
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Paula Marie Poe (April 2019)
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "14px 18px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Transfer Agent Discrepancy
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#fbbf24", fontFamily: "var(--font-mono)" }}>
                29M – 120M
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Fidelity Transfer Services (Haas Rule 26.1)
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "14px 18px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Sham Advisory Shares
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 700, color: "#c084fc", fontFamily: "var(--font-mono)" }}>
                25,500,000
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Delfin, Rubio, Hulbert, Phoenix
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Persistent Concurrent Engine Status & Controls */}
      <div
        id="lexcore-concurrent-status-bar"
        style={{
          padding: "10px 32px",
          background: "linear-gradient(90deg, rgba(8, 47, 73, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)",
          borderBottom: "1px solid rgba(56, 189, 248, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          fontSize: "0.8rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "9999px",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#34d399",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
            }}
          >
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399" }} className="animate-pulse" />
            LEXCORE DATA & LAW ANALYZER: CONCURRENT ENGINE RUNNING
          </span>
          <span style={{ color: "#94a3b8", fontSize: "0.76rem" }}>
            Operating concurrently with GRNH Forensics &bull; DeepSeek V4.1 Reasoning Active
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            id="btn-toggle-split-view"
            onClick={() => setLexCoreMode(lexCoreMode === "split" ? "hidden" : "split")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "6px",
              background: lexCoreMode === "split" ? "rgba(56, 189, 248, 0.25)" : "rgba(255, 255, 255, 0.06)",
              border: lexCoreMode === "split" ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.12)",
              color: lexCoreMode === "split" ? "#38bdf8" : "#cbd5e1",
              fontSize: "0.76rem",
              fontWeight: 600,
              cursor: "pointer",
              minHeight: "44px",
            }}
          >
            <Scale size={14} />
            {lexCoreMode === "split" ? "Exit Split View" : "Split Screen (50/50)"}
          </button>
          <button
            id="btn-toggle-copilot-drawer"
            onClick={() => setLexCoreMode(lexCoreMode === "drawer" ? "hidden" : "drawer")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "6px",
              background: lexCoreMode === "drawer" ? "rgba(56, 189, 248, 0.25)" : "rgba(255, 255, 255, 0.06)",
              border: lexCoreMode === "drawer" ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.12)",
              color: lexCoreMode === "drawer" ? "#38bdf8" : "#cbd5e1",
              fontSize: "0.76rem",
              fontWeight: 600,
              cursor: "pointer",
              minHeight: "44px",
            }}
          >
            <FileText size={14} />
            {lexCoreMode === "drawer" ? "Close Drawer" : "Copilot Drawer"}
          </button>
          <a
            id="btn-lexcore-popout-sidecar"
            href="https://lex-core-terminal-20261024.vercel.app/?companion=1"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "6px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#cbd5e1",
              fontSize: "0.76rem",
              fontWeight: 600,
              textDecoration: "none",
              minHeight: "44px",
            }}
          >
            <ExternalLink size={14} /> Popout Sidecar ↗
          </a>
        </div>
      </div>

      {/* Main Container & Concurrent Split View */}
      <div style={{ display: "flex", width: "100%", minHeight: "calc(100vh - 180px)", position: "relative" }}>
        <div style={{ flex: 1, width: lexCoreMode === "split" ? "55%" : "100%", minWidth: 0, transition: "width 0.2s ease" }}>
          <main style={{ flex: 1, padding: "24px 32px", maxWidth: lexCoreMode === "split" ? "100%" : "1600px", width: "100%", margin: "0 auto" }}>
        {/* Phase Timeline Stepper */}
        <section style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "0.88rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8" }}>
              The 5 Evidentiary Phases: Transition from "Legal to Highly Illegal"
            </h2>
            <button
              onClick={() => setSelectedPhase("all")}
              style={{
                background: "transparent",
                border: "none",
                color: selectedPhase === "all" ? "#38bdf8" : "#64748b",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reset Phase Filter (Show All 5 Phases)
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
            {evidentiaryPhases.map((phase, idx) => {
              const isSelected = selectedPhase === phase.id;
              return (
                <div
                  key={phase.id}
                  onClick={() => setSelectedPhase(isSelected ? "all" : phase.id)}
                  className="glass-panel"
                  style={{
                    padding: "12px 14px",
                    cursor: "pointer",
                    borderLeft: `4px solid ${phase.color}`,
                    borderColor: isSelected ? phase.color : undefined,
                    background: isSelected ? "rgba(30, 41, 59, 0.9)" : undefined,
                    transform: isSelected ? "translateY(-2px)" : "none",
                    boxShadow: isSelected ? `0 4px 20px -2px ${phase.color}40` : undefined,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: phase.color, textTransform: "uppercase" }}>
                      Phase {idx + 1}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>{phase.period}</span>
                  </div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#f8fafc", marginBottom: "4px" }}>
                    {phase.name.split(":")[1]?.trim() || phase.name}
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: "8px" }}>
                    {phase.summary.slice(0, 110)}...
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {phase.badges.map((b, bIdx) => (
                      <span
                        key={bIdx}
                        style={{
                          fontSize: "0.62rem",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: `${phase.color}18`,
                          color: phase.color,
                          border: `1px solid ${phase.color}33`,
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid var(--border-subtle)",
            marginBottom: "20px",
            overflowX: "auto",
            paddingBottom: "2px",
          }}
        >
          <button
            onClick={() => setActiveTab("timeline")}
            style={{
              padding: "10px 18px",
              fontSize: "0.84rem",
              fontWeight: 600,
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "timeline" ? "2px solid #38bdf8" : "2px solid transparent",
              color: activeTab === "timeline" ? "#38bdf8" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
            }}
          >
            <Calendar size={15} /> Forensic Timeline & Transactions ({filteredTransactions.length})
          </button>

          <button
            onClick={() => setActiveTab("matcher")}
            style={{
              padding: "10px 18px",
              fontSize: "0.84rem",
              fontWeight: 600,
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "matcher" ? "2px solid #38bdf8" : "2px solid transparent",
              color: activeTab === "matcher" ? "#38bdf8" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
            }}
          >
            <Scale size={15} /> Certificate Matcher & Opinion Inspector
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            style={{
              padding: "10px 18px",
              fontSize: "0.84rem",
              fontWeight: 600,
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "vault" ? "2px solid #38bdf8" : "2px solid transparent",
              color: activeTab === "vault" ? "#38bdf8" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
            }}
          >
            <HardDrive size={15} /> Hard Drive Evidence Vault ({filteredFiles.length} of {meta.totalDiscoveredFiles})
          </button>

          <button
            onClick={() => setActiveTab("radar")}
            style={{
              padding: "10px 18px",
              fontSize: "0.84rem",
              fontWeight: 600,
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "radar" ? "2px solid #38bdf8" : "2px solid transparent",
              color: activeTab === "radar" ? "#38bdf8" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
            }}
          >
            <ShieldAlert size={15} /> Fraud Pattern Radar ({fraudPatterns.length})
          </button>

          <button
            onClick={() => setActiveTab("non-company")}
            style={{
              padding: "10px 18px",
              fontSize: "0.84rem",
              fontWeight: 600,
              background: activeTab === "non-company" ? "rgba(239, 68, 68, 0.15)" : "transparent",
              border: "none",
              borderBottom: activeTab === "non-company" ? "2px solid #ef4444" : "2px solid transparent",
              color: activeTab === "non-company" ? "#f87171" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              borderRadius: "6px 6px 0 0",
            }}
          >
            <AlertOctagon size={15} color="#ef4444" /> Non-Company Sourced Shares ({nonCompanySharesAnalysis?.summaryMetrics?.totalTranchesTracked || 14} Tranches / 109.2M)
          </button>

          <button
            onClick={() => setActiveTab("entities")}
            style={{
              padding: "10px 18px",
              fontSize: "0.84rem",
              fontWeight: 600,
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "entities" ? "2px solid #38bdf8" : "2px solid transparent",
              color: activeTab === "entities" ? "#38bdf8" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
            }}
          >
            <Users size={15} /> Key Targets & Nominees ({entities.length})
          </button>

          <Link
            href="/lineage"
            style={{
              padding: "10px 18px",
              fontSize: "0.84rem",
              fontWeight: 700,
              background: "rgba(124, 58, 237, 0.15)",
              border: "1px solid rgba(168, 85, 247, 0.35)",
              borderRadius: "6px 6px 0 0",
              color: "#c084fc",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              marginLeft: "auto",
            }}
          >
            <GitCommit size={15} /> Lineage & Patterns Studio (Separate Page) ↗
          </Link>
        </div>

        {/* Global Search and Filter Bar */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 280px" }}>
            <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
            <input
              type="text"
              className="input-search"
              placeholder="Search certificates (e.g. 7750, 8166), actors (Gaines, Haas, Poe), legal opinions, anomalies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {activeTab === "timeline" && (
            <select
              className="select-filter"
              value={selectedCert}
              onChange={(e) => setSelectedCert(e.target.value)}
            >
              <option value="all">All Certificates ({certificateNumbers.length})</option>
              {certificateNumbers.map((c) => (
                <option key={c} value={c}>
                  {c} ({certificates[c]?.totalShares.toLocaleString()} shares)
                </option>
              ))}
            </select>
          )}

          {activeTab === "vault" && (
            <select
              className="select-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          )}

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="btn-secondary"
              style={{ fontSize: "0.75rem", padding: "6px 12px" }}
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* TAB 1: FORENSIC TIMELINE & TRANSACTIONS */}
        {activeTab === "timeline" && (
          <div>
            <div className="glass-panel" style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table className="forensic-table">
                  <thead>
                    <tr>
                      <th style={{ width: "95px" }}>Tx ID / Date</th>
                      <th style={{ width: "120px" }}>Certificate #</th>
                      <th style={{ width: "110px", textAlign: "right" }}>Shares</th>
                      <th>Grantor &rarr; Grantee (Conduit)</th>
                      <th>Basis / Pricing</th>
                      <th>Transfer Agent</th>
                      <th>Legal Opinion Attached</th>
                      <th>Evidentiary Anomalies & Red Flags</th>
                      <th style={{ width: "150px" }}>Hard Drive Sources</th>
                      <th style={{ width: "130px" }}>AI Law Analysis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: "0.82rem" }}>{tx.id}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                            {tx.date}
                          </div>
                        </td>

                        <td>
                          <span
                            className="font-mono"
                            style={{
                              display: "inline-block",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: "rgba(255, 255, 255, 0.05)",
                              border: "1px solid var(--border-subtle)",
                              fontSize: "0.78rem",
                              color: "#38bdf8",
                              fontWeight: 600,
                            }}
                          >
                            {tx.cert}
                          </span>
                        </td>

                        <td style={{ textAlign: "right" }}>
                          <span
                            className="font-mono"
                            style={{
                              fontWeight: 700,
                              fontSize: "0.88rem",
                              color: tx.shares >= 5000000 ? "#f43f5e" : tx.shares >= 2000000 ? "#fbbf24" : "#e2e8f0",
                            }}
                          >
                            {tx.shares.toLocaleString()}
                          </span>
                        </td>

                        <td>
                          <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#f1f5f9" }}>
                            {tx.from}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.74rem", color: "#38bdf8" }}>
                            <ArrowRight size={11} /> {tx.to}
                          </div>
                          {tx.notes && (
                            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "3px" }}>
                              {tx.notes}
                            </div>
                          )}
                        </td>

                        <td>
                          <span style={{ fontSize: "0.76rem", color: "#94a3b8" }}>{tx.price}</span>
                        </td>

                        <td>
                          <span style={{ fontSize: "0.76rem", color: "#cbd5e1" }}>{tx.ta}</span>
                        </td>

                        <td>
                          <div style={{ fontSize: "0.76rem", color: tx.opinion.includes("Mills") || tx.opinion.includes("Hintzen") ? "#38bdf8" : "var(--text-muted)" }}>
                            {tx.opinion}
                          </div>
                        </td>

                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {tx.anomalies.length === 0 ? (
                              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Documented / None Noted</span>
                            ) : (
                              tx.anomalies.map((a, aIdx) => (
                                <span
                                  key={aIdx}
                                  className="badge badge-rose pulse-badge"
                                  style={{ fontSize: "0.68rem", whiteSpace: "normal", textAlign: "left", lineHeight: 1.25 }}
                                >
                                  <AlertTriangle size={10} style={{ flexShrink: 0 }} /> {a}
                                </span>
                              ))
                            )}
                          </div>
                        </td>

                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            {tx.sources.map((s, sIdx) => (
                              <span
                                key={sIdx}
                                style={{
                                  fontSize: "0.68rem",
                                  color: "#94a3b8",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: "140px",
                                  display: "block",
                                }}
                                title={s}
                              >
                                📄 {s}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td>
                          <button
                            id={"btn-analyze-tx-" + String(tx.id)}
                            onClick={() => handleTriggerLexCore({
                              name: String(tx.to) + " (Cert " + String(tx.cert) + ")",
                              cert: tx.cert,
                              shares: tx.shares,
                              category: "Transaction Lineage",
                              statute: tx.opinion.includes("Root") ? "Securities Act § 17(a) & Common Law Fraud" : "Securities Act § 5(a)/(c) Strict Liability",
                              precedent: tx.opinion.includes("Root") ? "SEC v. Ralston Purina Co., 346 U.S. 119" : "SEC v. CMKM Diamonds, Inc., 729 F.3d 1248",
                              summary: "Transfer of " + String(tx.shares) + " shares from " + String(tx.from) + " to " + String(tx.to) + ". TA: " + String(tx.ta) + ". Opinion: " + String(tx.opinion) + ".",
                              primaryFiles: tx.sources
                            })}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              background: "rgba(56, 189, 248, 0.12)",
                              border: "1px solid rgba(56, 189, 248, 0.35)",
                              color: "#38bdf8",
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              minHeight: "36px",
                            }}
                            title="Analyze statutory violations and case law with LexCore AI"
                          >
                            <Scale size={12} />
                            Analyze Law
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CERTIFICATE MATCHER & OPINION INSPECTOR */}
        {activeTab === "matcher" && (
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px" }}>
            {/* Left Certificate Selector List */}
            <div className="glass-panel" style={{ padding: "16px", maxHeight: "800px", overflowY: "auto" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "12px" }}>
                Select Certificate Dossier ({certificateNumbers.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {certificateNumbers.map((c) => {
                  const dos = certificates[c];
                  const isSelected = selectedMatcherCert === c;
                  return (
                    <div
                      key={c}
                      onClick={() => setSelectedMatcherCert(c)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background: isSelected ? "rgba(6, 182, 212, 0.15)" : "rgba(255, 255, 255, 0.02)",
                        border: isSelected ? "1px solid var(--accent-cyan)" : "1px solid transparent",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.85rem", color: isSelected ? "#38bdf8" : "#f1f5f9" }}>
                          {c}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                          {dos ? dos.totalShares.toLocaleString() : 0} shares
                        </div>
                      </div>
                      {dos && dos.anomalies.length > 0 && (
                        <span className="badge badge-rose" style={{ fontSize: "0.62rem" }}>
                          {dos.anomalies.length}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Dossier Detail View */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "#38bdf8" }}>
                        Certificate: {activeDossier.certNumber}
                      </span>
                      <span className="badge badge-cyan">
                        {activeDossier.totalShares.toLocaleString()} Total Shares
                      </span>
                    </div>
                    <div style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      Current Registered / Nominee Holder: <strong style={{ color: "#f8fafc" }}>{activeDossier.currentHolder}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <span className="badge badge-purple">
                      Phase: {activeDossier.phase.replace("phase_", "Phase ").replace(/_/g, " ")}
                    </span>
                    <button
                      id="btn-analyze-dossier-lexcore"
                      onClick={() => handleTriggerLexCore({
                        name: String(activeDossier.currentHolder || "Dossier") + " (Cert " + String(activeDossier.certNumber) + ")",
                        cert: activeDossier.certNumber,
                        shares: activeDossier.totalShares,
                        category: "Certificate Dossier",
                        statute: "Securities Act § 5(a)/(c) Strict Liability & Rule 144 Disqualification",
                        precedent: "SEC v. CMKM Diamonds, Inc., 729 F.3d 1248 (9th Cir. 2013)",
                        summary: "Certificate " + String(activeDossier.certNumber) + " held by " + String(activeDossier.currentHolder) + " for " + String(activeDossier.totalShares) + " shares. Anomalies: " + activeDossier.anomalies.join("; ") + ".",
                        primaryFiles: []
                      })}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                        color: "#ffffff",
                        border: "1px solid #38bdf8",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        minHeight: "36px",
                      }}
                    >
                      <Scale size={13} /> Analyze with LexCore AI
                    </button>
                  </div>
                </div>

                {/* 3-Column Relational Inspector */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", marginTop: "20px" }}>
                  {/* Matched Legal Opinions */}
                  <div className="glass-panel" style={{ padding: "16px", background: "rgba(15, 23, 42, 0.6)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "#38bdf8" }}>
                      <Scale size={16} />
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>
                        Matched Legal Opinion
                      </span>
                    </div>
                    {activeDossier.legalOpinions.length === 0 ? (
                      <p style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                        No separate legal opinion filed for this certificate (standard restricted issuance or direct physical reissuance).
                      </p>
                    ) : (
                      activeDossier.legalOpinions.map((op: string, i: number) => (
                        <div key={i} style={{ padding: "8px 10px", borderRadius: "6px", background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.2)", marginBottom: "6px" }}>
                          <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0" }}>{op}</div>
                          <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "4px" }}>
                            Instructed Fidelity Transfer Services to remove restrictive legend under Section 4(a)(1) without required holding period.
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Transfer Agent Instructions */}
                  <div className="glass-panel" style={{ padding: "16px", background: "rgba(15, 23, 42, 0.6)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "#34d399" }}>
                      <Building2 size={16} />
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>
                        Transfer Agent Processing
                      </span>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#e2e8f0", marginBottom: "6px" }}>
                      Fidelity Transfer Services, Inc. (Ruben Sanchez)
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      Processed stock powers, medallion guarantees, and cancelled restricted certificates. Submissions subject of 2025 Haas Rule 26.1 Disclosure citing 29M, 78M, and 120M share discrepancies.
                    </p>
                  </div>

                  {/* Red-Flag Anomalies */}
                  <div className="glass-panel" style={{ padding: "16px", background: "rgba(15, 23, 42, 0.6)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "#f43f5e" }}>
                      <AlertTriangle size={16} />
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>
                        Evidentiary Red Flags
                      </span>
                    </div>
                    {activeDossier.anomalies.length === 0 ? (
                      <p style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                        Standard restricted private placement under Rule 144. No procedural anomalies noted.
                      </p>
                    ) : (
                      activeDossier.anomalies.map((anom: string, i: number) => (
                        <div key={i} style={{ padding: "6px 8px", borderRadius: "6px", background: "rgba(244, 63, 94, 0.08)", border: "1px solid rgba(244, 63, 94, 0.25)", marginBottom: "6px", fontSize: "0.76rem", color: "#fca5a5" }}>
                          &bull; {anom}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Chain of Custody & Issuance History */}
                <div style={{ marginTop: "24px" }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8", marginBottom: "12px" }}>
                    Chain of Custody & Transaction Chronology
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {activeDossier.issuances.map((iss, i: number) => (
                      <div
                        key={i}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid var(--border-subtle)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#38bdf8", fontWeight: 600 }}>
                              {iss.txId}
                            </span>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>({iss.date})</span>
                          </div>
                          <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "#f1f5f9", marginTop: "3px" }}>
                            {iss.from} &rarr; <span style={{ color: "#38bdf8" }}>{iss.to}</span>
                          </div>
                          {iss.notes && (
                            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "2px" }}>
                              {iss.notes}
                            </div>
                          )}
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.95rem", color: "#f8fafc" }}>
                            {iss.shares.toLocaleString()} Shares
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                            Basis: {iss.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HARD DRIVE EVIDENCE VAULT */}
        {activeTab === "vault" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f8fafc" }}>
                  Hard Drive Evidence Vault ({filteredFiles.length} of {meta.totalDiscoveredFiles} Files)
                </h3>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Primary legal documents, certificates, opinion letters, SPAs, and spreadsheets discovered across the local system.
                </p>
              </div>
            </div>

            <div className="glass-panel" style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table className="forensic-table">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>ID</th>
                      <th>Filename</th>
                      <th style={{ width: "170px" }}>Category</th>
                      <th style={{ width: "90px", textAlign: "right" }}>Size</th>
                      <th style={{ width: "150px" }}>Linked Certs</th>
                      <th>Local Absolute Path</th>
                      <th style={{ width: "110px", textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((f) => (
                      <tr key={f.id}>
                        <td>
                          <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>
                            {f.id}
                          </span>
                        </td>

                        <td>
                          <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "6px" }}>
                            <FileText size={14} style={{ color: "#38bdf8", flexShrink: 0 }} />
                            <span>{f.filename}</span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={
                              f.category.includes("Certificate")
                                ? "badge badge-cyan"
                                : f.category.includes("Legal Opinion")
                                ? "badge badge-purple"
                                : f.category.includes("Court")
                                ? "badge badge-rose"
                                : f.category.includes("Sham")
                                ? "badge badge-amber"
                                : "badge badge-slate"
                            }
                            style={{ fontSize: "0.68rem" }}
                          >
                            {f.category}
                          </span>
                        </td>

                        <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-dim)" }}>
                          {f.sizeFormatted}
                        </td>

                        <td>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {f.linkedCertificates.length === 0 ? (
                              <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>—</span>
                            ) : (
                              f.linkedCertificates.map((c, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: "0.68rem",
                                    padding: "1px 5px",
                                    borderRadius: "4px",
                                    background: "rgba(6, 182, 212, 0.12)",
                                    color: "#38bdf8",
                                    fontFamily: "var(--font-mono)",
                                  }}
                                >
                                  {c}
                                </span>
                              ))
                            )}
                          </div>
                        </td>

                        <td>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--text-muted)",
                              fontFamily: "var(--font-mono)",
                              display: "block",
                              maxWidth: "400px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={f.path}
                          >
                            {f.path}
                          </span>
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => handleCopyPath(f.path)}
                            className="btn-secondary"
                            style={{ fontSize: "0.7rem", padding: "4px 8px" }}
                            title="Copy full local path"
                          >
                            {copiedPath === f.path ? <Check size={12} style={{ color: "#34d399" }} /> : <Copy size={12} />}
                            {copiedPath === f.path ? "Copied" : "Copy"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FRAUD PATTERN RADAR & STATUTORY ANALYSIS */}
        {activeTab === "radar" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "16px" }}>
            {fraudPatterns.map((pat) => (
              <div key={pat.id} className="glass-panel" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <span className="badge badge-rose" style={{ marginBottom: "6px" }}>
                      <AlertTriangle size={11} /> {pat.severity} SEVERITY
                    </span>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc" }}>
                      {pat.title}
                    </h3>
                  </div>
                </div>

                <div style={{ padding: "6px 10px", borderRadius: "6px", background: "rgba(244, 63, 94, 0.08)", border: "1px solid rgba(244, 63, 94, 0.2)", fontSize: "0.74rem", color: "#fca5a5", fontWeight: 600, marginBottom: "12px" }}>
                  Violation: {pat.statutoryViolation}
                </div>

                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.45, marginBottom: "14px" }}>
                  {pat.description}
                </p>

                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "6px" }}>
                    Affected Certificates:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {pat.affectedCertificates.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.72rem",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: "rgba(255, 255, 255, 0.05)",
                          color: "#38bdf8",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "6px" }}>
                    Primary Hard Drive Evidence Receipts:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {pat.primaryEvidenceFiles.map((ev, i) => (
                      <div key={i} style={{ fontSize: "0.75rem", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FileCheck2 size={13} style={{ color: "#34d399" }} />
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: KEY TARGETS & NOMINEES */}
        {activeTab === "entities" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "16px" }}>
            {entities.map((ent, i) => (
              <div key={i} className="glass-panel" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc" }}>
                      {ent.name}
                    </h3>
                    <div style={{ fontSize: "0.78rem", color: "#38bdf8", fontWeight: 600 }}>
                      {ent.role}
                    </div>
                  </div>
                  <span
                    className={
                      ent.status.includes("Indicted")
                        ? "badge badge-rose"
                        : ent.status.includes("Defendant")
                        ? "badge badge-amber"
                        : ent.status.includes("Plaintiff")
                        ? "badge badge-purple"
                        : "badge badge-cyan"
                    }
                    style={{ fontSize: "0.68rem" }}
                  >
                    {ent.status}
                  </span>
                </div>

                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.45, marginTop: "10px", marginBottom: "14px" }}>
                  {ent.description}
                </p>

                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "6px" }}>
                    Associated Corporate Shells / Accounts:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {ent.entities.map((sh, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontSize: "0.72rem",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: "rgba(255, 255, 255, 0.04)",
                          color: "#e2e8f0",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        {sh}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: NON-COMPANY SOURCED SHARES & LEGAL OPINION FORENSICS */}
        {activeTab === "non-company" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Executive Alert Banner */}
            <div
              className="glass-panel"
              style={{
                padding: "24px",
                borderLeft: "4px solid #ef4444",
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span className="badge badge-rose" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>
                      Critical Securities Audit Finding
                    </span>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      Governing Standard: 17 C.F.R. § 230.144(d)(1) & 15 U.S.C. § 77b(a)(11)
                    </span>
                  </div>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#f8fafc", marginBottom: "6px" }}>
                    Forensic Analysis of Shares NOT Purchased from the Company
                  </h2>
                  <p style={{ fontSize: "0.88rem", color: "#cbd5e1", maxWidth: "1100px", lineHeight: 1.5 }}>
                    Detailed examination of all <strong style={{ color: "#f87171" }}>109,240,000 shares (99.4% of subject issuances)</strong> identified in legal opinion letters, promissory notes, and transfer agent records where <strong style={{ color: "#38bdf8" }}>zero cash consideration entered GreenGro Technologies, Inc. corporate accounts</strong>. Sourced exclusively through affiliate debt pledges, backdated consulting contracts, third-party promoter loans, and nominee amalgamations.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <div style={{ background: "rgba(0,0,0,0.3)", padding: "12px 16px", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "center" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Non-Company Volume</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f87171", fontFamily: "var(--font-mono)" }}>109,240,000</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>99.4% of Tracked Float</div>
                  </div>
                  <div style={{ background: "rgba(0,0,0,0.3)", padding: "12px 16px", borderRadius: "8px", border: "1px solid rgba(56, 189, 248, 0.3)", textAlign: "center" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Issuer Treasury Cash</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#38bdf8", fontFamily: "var(--font-mono)" }}>$0.00</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Zero Capital Infusion</div>
                  </div>
                </div>
              </div>

              {/* Mechanism Breakdown Bar */}
              <div style={{ marginTop: "20px", paddingTop: "18px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                  Volume Distribution by Non-Company Acquisition Mechanism:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                  {nonCompanySharesAnalysis?.summaryMetrics?.breakdownByMechanism?.map((b: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        padding: "10px 14px",
                        background: "rgba(0, 0, 0, 0.25)",
                        borderRadius: "6px",
                        borderLeft: `3px solid ${b.color}`,
                      }}
                    >
                      <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>{b.mechanism}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "4px" }}>
                        <span style={{ fontSize: "0.95rem", fontWeight: 700, color: b.color, fontFamily: "var(--font-mono)" }}>
                          {b.shares.toLocaleString()}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                          {b.percentage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TWO CRITICAL SPOTLIGHT AUTOPSIES */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "20px" }}>
              {/* SPOTLIGHT 1: JOHN T. ROOT 27M OPINION */}
              <div
                className="glass-panel"
                style={{
                  padding: "22px",
                  borderTop: "3px solid #ef4444",
                  background: "rgba(15, 23, 42, 0.75)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <span className="badge badge-rose" style={{ fontSize: "0.68rem", marginBottom: "6px" }}>
                      Mathematical Falsification & Affiliate Tacking
                    </span>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
                      John T. Root, Jr. 27M Share Opinion Autopsy
                    </h3>
                    <div style={{ fontSize: "0.76rem", color: "#38bdf8", marginTop: "2px" }}>
                      Recipient: E.F. Romano III &bull; Cert CS1-8172 &bull; Jan 22 / Apr 22, 2019
                    </div>
                  </div>
                  <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f87171", fontFamily: "var(--font-mono)" }}>
                    27,000,000 Shs
                  </span>
                </div>

                <div style={{ background: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "6px", marginBottom: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "#fbbf24", marginBottom: "4px" }}>
                    The 5.74% Math Fraud vs. Root's Opinion Letter:
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#e2e8f0", lineHeight: 1.45 }}>
                    Root certified to Fidelity Transfer Services: <em>"I do not consider it to rise to the level of a distribution as it is <strong>much less than one percent</strong> of the outstanding shares."</em>
                  </div>
                  <div style={{ marginTop: "6px", display: "flex", gap: "16px", fontSize: "0.78rem" }}>
                    <div>Outstanding: <strong style={{ color: "#38bdf8" }}>470,220,980</strong></div>
                    <div>Actual Share Ratio: <strong style={{ color: "#f87171" }}>5.7419%</strong></div>
                    <div>Statutory Ceiling: <strong style={{ color: "#94a3b8" }}>1.00%</strong> (5.74x Excess)</div>
                  </div>
                </div>

                <div style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.45, marginBottom: "12px" }}>
                  <strong style={{ color: "#ef4444" }}>Rule 144(d)(1) Affiliate Bar:</strong> Root explicitly admitted: <em>"These Shares were assigned and transferred from James Haas, an affiliate, as collateral in return for the lending of funds to the Issuer..."</em> Under federal law, securities acquired from an affiliate restart the holding period. Root's attempt to tack back 10 years to Haas's 2009 employment agreement was a legal impossibility.
                </div>

                <div style={{ background: "rgba(239, 68, 68, 0.1)", padding: "10px 14px", borderRadius: "6px", borderLeft: "3px solid #ef4444", marginBottom: "14px" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f87171", textTransform: "uppercase" }}>
                    The May 6, 2019 Kickback Split Order:
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#fecdd3", marginTop: "2px" }}>
                    Exactly 14 days after Root's opinion, James Haas ordered transfer agent Ruben Sanchez: <em>"Send 10 million to Ira Gaines and 17 million back to me."</em> Proves Romano was merely an unregistered nominee conduit.
                  </div>
                </div>

                <div style={{ fontSize: "0.74rem", color: "var(--text-dim)" }}>
                  Primary Evidence Receipts:
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                    <span style={{ padding: "2px 6px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", color: "#38bdf8" }}>
                      GRNH-4a1 Opinion Letter Draft II (4) (2).pdf
                    </span>
                    <span style={{ padding: "2px 6px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", color: "#38bdf8" }}>
                      DEFENDANT_HAAS_RULE_26_1_SUPPLEMENTAL_DISCLOSURE.pdf
                    </span>
                  </div>
                </div>
              </div>

              {/* SPOTLIGHT 2: CHERYL HINTZEN LAWSUIT DEFENSE */}
              <div
                className="glass-panel"
                style={{
                  padding: "22px",
                  borderTop: "3px solid #38bdf8",
                  background: "rgba(15, 23, 42, 0.75)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <span className="badge badge-cyan" style={{ fontSize: "0.68rem", marginBottom: "6px" }}>
                      Ariz. Super. Ct. Case No. CV2025-013574
                    </span>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
                      Cheryl Hintzen 6.79M Share Lawsuit Defense
                    </h3>
                    <div style={{ fontSize: "0.76rem", color: "#38bdf8", marginTop: "2px" }}>
                      Plaintiff: Cheryl Hintzen &bull; Cert CS1-7937 &bull; Stephen Mills Opinion (Jan 10, 2018)
                    </div>
                  </div>
                  <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#38bdf8", fontFamily: "var(--font-mono)" }}>
                    6,790,000 Shs
                  </span>
                </div>

                <div style={{ background: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "6px", marginBottom: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "#38bdf8", marginBottom: "4px" }}>
                    The 44-Month Retroactive Backdating Fraud:
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#e2e8f0", lineHeight: 1.45 }}>
                    Mills's opinion asserted Hintzen purchased 6.79M shares from Mark Delfin under an August 20, 2015 SPA, which derived from a Sept 9, 2013 consulting agreement.
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "0.78rem", color: "#f43f5e" }}>
                    Corporate records establish Delfin's agreement was drafted and signed on <strong>May 1, 2017</strong>. Hintzen could not have acquired shares in August 2015 from an agreement created in May 2017.
                  </div>
                </div>

                <div style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.45, marginBottom: "12px" }}>
                  <strong style={{ color: "#38bdf8" }}>Triad Defense for Counsel:</strong>
                  <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                    <li><strong>In Pari Delicto / Unclean Hands:</strong> Hintzen cannot claim $1.8M in equity damages for failure to lift legends on shares born of a fraudulent Section 5 evasion scheme.</li>
                    <li><strong>Statutory Underwriter Conduit:</strong> Immediate Section 4(a)(1) opinion request proves shares were taken with a view to distribution under Section 2(a)(11).</li>
                    <li><strong>Legality of Performance:</strong> Directing the transfer agent to remove legends would constitute a federal securities felony.</li>
                  </ul>
                </div>

                <div style={{ fontSize: "0.74rem", color: "var(--text-dim)" }}>
                  Primary Evidence Receipts:
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                    <span style={{ padding: "2px 6px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", color: "#38bdf8" }}>
                      grnhhintzen7937.pdf
                    </span>
                    <span style={{ padding: "2px 6px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", color: "#38bdf8" }}>
                      GRNH req for legal Cheryl 2.docx
                    </span>
                    <span style={{ padding: "2px 6px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", color: "#38bdf8" }}>
                      CONSULTING AGREEMENT_Delfin_GRNH.docx
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TRANCHES MASTER DOSSIER TABLE */}
            <div className="glass-panel" style={{ padding: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
                    Master Ledger: Shares Not Purchased from Issuer ({filteredNonCompanyTranches.length} Tranches)
                  </h3>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Every documented non-company acquisition tranche isolated from legal opinion letters and transfer agent ledgers.
                  </div>
                </div>

                {/* Filter Pills */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {["all", "Affiliate Debt & Collateral Transfers", "Backdated Sham Consulting Awards", "Foreign Straw Nominee Amalgamations", "Purported Note Assignments & Familial Conduits", "Promoter Loan Collateral & Nominee Shells"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedNonCompanyCategory(cat)}
                      style={{
                        padding: "5px 10px",
                        fontSize: "0.72rem",
                        borderRadius: "4px",
                        border: "1px solid var(--border-subtle)",
                        background: selectedNonCompanyCategory === cat ? "#ef4444" : "rgba(255,255,255,0.04)",
                        color: selectedNonCompanyCategory === cat ? "#ffffff" : "var(--text-muted)",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {cat === "all" ? "All Categories" : cat.split(" ")[0] + " " + cat.split(" ")[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-dim)", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.05em" }}>
                      <th style={{ padding: "10px 12px" }}>Tranche / Cert</th>
                      <th style={{ padding: "10px 12px" }}>Recipient / Nominee</th>
                      <th style={{ padding: "10px 12px", textAlign: "right" }}>Shares</th>
                      <th style={{ padding: "10px 12px" }}>Mechanism & Stated Origin</th>
                      <th style={{ padding: "10px 12px" }}>Legal Opinion / Counsel</th>
                      <th style={{ padding: "10px 12px", textAlign: "center" }}>Company Cash</th>
                      <th style={{ padding: "10px 12px" }}>Statutory Violations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNonCompanyTranches.map((t: any) => {
                      const isExpanded = expandedNonCompanyId === t.id;
                      return (
                        <React.Fragment key={t.id}>
                          <tr
                            onClick={() => setExpandedNonCompanyId(isExpanded ? null : t.id)}
                            style={{
                              borderBottom: "1px solid rgba(255,255,255,0.04)",
                              cursor: "pointer",
                              background: isExpanded ? "rgba(239, 68, 68, 0.08)" : "transparent",
                            }}
                          >
                            <td style={{ padding: "12px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#f87171" }}>
                              <div>{t.id}</div>
                              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>{t.cert}</div>
                            </td>
                            <td style={{ padding: "12px", fontWeight: 600, color: "#f1f5f9" }}>
                              {t.recipient}
                            </td>
                            <td style={{ padding: "12px", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#f87171" }}>
                              {t.shares.toLocaleString()}
                            </td>
                            <td style={{ padding: "12px", maxWidth: "340px" }}>
                              <div style={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: 600 }}>{t.mechanismCategory}</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px", lineHeight: 1.35 }}>
                                {t.statedOrigin}
                              </div>
                            </td>
                            <td style={{ padding: "12px" }}>
                              <div style={{ fontWeight: 600, color: "#e2e8f0" }}>{t.opinionAuthor}</div>
                              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>{t.opinionDate}</div>
                            </td>
                            <td style={{ padding: "12px", textAlign: "center", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#38bdf8" }}>
                              {t.actualCompanyCash}
                            </td>
                            <td style={{ padding: "12px" }}>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                {t.statutoryViolations.map((v: string, vIdx: number) => (
                                  <span
                                    key={vIdx}
                                    style={{
                                      fontSize: "0.65rem",
                                      padding: "1px 6px",
                                      borderRadius: "3px",
                                      background: "rgba(239, 68, 68, 0.15)",
                                      color: "#fca5a5",
                                      border: "1px solid rgba(239, 68, 68, 0.3)",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {v}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Autopsy Row */}
                          {isExpanded && (
                            <tr style={{ background: "rgba(0,0,0,0.4)" }}>
                              <td colSpan={7} style={{ padding: "16px 20px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                                  <div>
                                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f87171", textTransform: "uppercase", marginBottom: "6px" }}>
                                      Forensic Autopsy & Legal Vulnerability:
                                    </div>
                                    <p style={{ fontSize: "0.84rem", color: "#e2e8f0", lineHeight: 1.5, margin: 0 }}>
                                      {t.forensicAutopsy}
                                    </p>
                                  </div>

                                  <div>
                                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", marginBottom: "6px" }}>
                                      Primary Evidence Files on Disk:
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                      {t.primaryEvidenceFiles.map((f: string, fIdx: number) => (
                                        <div
                                          key={fIdx}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "6px 10px",
                                            borderRadius: "4px",
                                            background: "rgba(255,255,255,0.04)",
                                            fontSize: "0.75rem",
                                            color: "#cbd5e1",
                                          }}
                                        >
                                          <span>{f}</span>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigator.clipboard.writeText(f);
                                              setCopiedPath(f);
                                              setTimeout(() => setCopiedPath(null), 2000);
                                            }}
                                            style={{
                                              background: "transparent",
                                              border: "none",
                                              color: copiedPath === f ? "#34d399" : "#64748b",
                                              cursor: "pointer",
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "4px",
                                            }}
                                          >
                                            {copiedPath === f ? <Check size={12} /> : <Copy size={12} />}
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "flex-end" }}>
                                  <button
                                    id={"btn-analyze-tranche-" + String(t.id)}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTriggerLexCore({
                                        name: String(t.recipient) + " (Cert " + String(t.cert) + ")",
                                        cert: t.cert,
                                        shares: t.shares,
                                        category: t.mechanismCategory,
                                        statute: t.statutoryViolations.join("; "),
                                        precedent: "Lorenzo v. SEC, 139 S. Ct. 1094",
                                        summary: t.forensicAutopsy,
                                        primaryFiles: t.primaryEvidenceFiles
                                      });
                                    }}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      padding: "7px 14px",
                                      borderRadius: "6px",
                                      background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                                      color: "#ffffff",
                                      border: "1px solid #38bdf8",
                                      fontSize: "0.76rem",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                      minHeight: "44px",
                                    }}
                                  >
                                    <Scale size={13} /> Analyze Statutory Claim with LexCore AI (Concurrent)
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* STATUTORY VULNERABILITIES GRID */}
            <div className="glass-panel" style={{ padding: "22px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", marginBottom: "6px" }}>
                Statutory Vulnerabilities & Securities Violations Framework
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                Key legal grounds and federal securities rules violated by the non-company share issuances and opinion letters.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                {nonCompanySharesAnalysis?.statutoryVulnerabilities?.map((sv: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#f87171", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                        {sv.code}
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f8fafc", marginTop: "2px", marginBottom: "6px" }}>
                        {sv.name}
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.45, marginBottom: "10px" }}>
                        {sv.summary}
                      </p>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px", fontSize: "0.72rem", color: "#38bdf8" }}>
                      <strong>Litigation Impact:</strong> {sv.relevanceToLitigation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LITIGATION & DEPOSITION PLAYBOOK */}
            <div className="glass-panel" style={{ padding: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
                    Litigation & Deposition Playbook for Defense Counsel
                  </h3>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Targeted cross-examination questions and document traps for opinion counsel, plaintiff Hintzen, and transfer agent.
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {nonCompanySharesAnalysis?.litigationPlaybook?.map((lp: any) => (
                    <button
                      key={lp.witness}
                      onClick={() => setSelectedWitness(lp.witness)}
                      style={{
                        padding: "6px 12px",
                        fontSize: "0.75rem",
                        borderRadius: "4px",
                        border: "1px solid var(--border-subtle)",
                        background: selectedWitness === lp.witness ? "#38bdf8" : "rgba(255,255,255,0.04)",
                        color: selectedWitness === lp.witness ? "#0f172a" : "var(--text-muted)",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {lp.witness}
                    </button>
                  ))}
                </div>
              </div>

              {/* Witness Deposition Card */}
              {(() => {
                const currentWitness = nonCompanySharesAnalysis?.litigationPlaybook?.find(
                  (lp: any) => lp.witness === selectedWitness
                );
                if (!currentWitness) return null;
                return (
                  <div
                    style={{
                      padding: "18px",
                      borderRadius: "8px",
                      background: "rgba(0, 0, 0, 0.35)",
                      border: "1px solid rgba(56, 189, 248, 0.2)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
                      <div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Deposition Target</div>
                        <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f8fafc" }}>{currentWitness.witness}</div>
                      </div>
                      <span className="badge badge-amber" style={{ fontSize: "0.72rem" }}>
                        Subject: {currentWitness.targetSubject}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {currentWitness.sampleQuestions.map((q: string, qIdx: number) => (
                        <div
                          key={qIdx}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "6px",
                            background: "rgba(255, 255, 255, 0.03)",
                            borderLeft: "3px solid #38bdf8",
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          <span style={{ color: "#38bdf8", fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
                            Q{qIdx + 1}:
                          </span>
                          <span style={{ fontSize: "0.82rem", color: "#e2e8f0", lineHeight: 1.45 }}>
                            {q}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

      </main>
        </div>

        {lexCoreMode === "split" && (
          <div
            id="lexcore-split-pane"
            style={{
              width: "45%",
              minWidth: "420px",
              height: "calc(100vh - 120px)",
              position: "sticky",
              top: "120px",
              padding: "16px",
              overflowY: "auto",
              borderLeft: "1px solid rgba(56, 189, 248, 0.25)",
              background: "rgba(10, 15, 26, 0.95)",
            }}
          >
            <LexCoreConcurrentEngine
              customTarget={lexCoreCustomTarget}
              onClose={() => setLexCoreMode("hidden")}
            />
          </div>
        )}
      </div>

      {/* Floating Copilot Drawer */}
      {lexCoreMode === "drawer" && (
        <div
          id="lexcore-copilot-drawer"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "min(620px, 100vw)",
            height: "100vh",
            zIndex: 99999,
            boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.8)",
          }}
        >
          <LexCoreConcurrentEngine
            customTarget={lexCoreCustomTarget}
            onClose={() => setLexCoreMode("hidden")}
            isDrawer={true}
          />
        </div>
      )}

      {/* Persistent Floating Quick-Access Trigger Button */}
      {lexCoreMode === "hidden" && (
        <button
          id="floating-lexcore-copilot-trigger"
          onClick={() => setLexCoreMode("drawer")}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 20px",
            borderRadius: "9999px",
            background: "linear-gradient(135deg, #0284c7 0%, #0f172a 100%)",
            color: "#ffffff",
            border: "1px solid #38bdf8",
            fontWeight: 700,
            fontSize: "0.82rem",
            boxShadow: "0 8px 30px rgba(2, 132, 199, 0.5)",
            cursor: "pointer",
            minHeight: "44px",
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399" }} className="animate-pulse" />
          <Scale size={16} color="#38bdf8" />
          <span>LexCore Law Analyzer (Concurrent Engine)</span>
        </button>
      )}

      {/* Footer */}
      <footer
        style={{
          padding: "16px 32px",
          borderTop: "1px solid var(--border-subtle)",
          background: "rgba(10, 15, 26, 0.8)",
          fontSize: "0.75rem",
          color: "var(--text-dim)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          GRNH Securities Litigation Forensic Database &bull; Built pursuant to Federal & State Civil Court Disclosure Rules
        </div>
        <div>
          Sources: Primary physical certificates, transfer agent records, and case filings on disk
        </div>
      </footer>
    </div>
  );
}
