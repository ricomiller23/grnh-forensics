"use client";

import React, { useState, useMemo } from "react";
import db from "@/data/grnh_forensic_database.json";
import { CertificateDossier } from "@/types";
import {
  ShieldAlert,
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
  Check
} from "lucide-react";

export default function ForensicDashboard() {
  const [activeTab, setActiveTab] = useState<"timeline" | "matcher" | "vault" | "radar" | "entities">("timeline");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [selectedCert, setSelectedCert] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMatcherCert, setSelectedMatcherCert] = useState<string>("CS1-7750");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const { meta, evidentiaryPhases, entities, fraudPatterns, transactions, sourceFilesCatalog } = db;
  const certificates = db.certificates as Record<string, CertificateDossier>;

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

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
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

      {/* Main Container */}
      <main style={{ flex: 1, padding: "24px 32px", maxWidth: "1600px", width: "100%", margin: "0 auto" }}>
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

                  <div style={{ display: "flex", gap: "8px" }}>
                    <span className="badge badge-purple">
                      Phase: {activeDossier.phase.replace("phase_", "Phase ").replace(/_/g, " ")}
                    </span>
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
      </main>

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
