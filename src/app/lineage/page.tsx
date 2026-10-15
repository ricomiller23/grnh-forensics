"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import db from "@/data/grnh_forensic_database.json";
import { ForensicDatabase, TraceableCertificate, NewSellerProfile, VisualTransferPattern } from "@/types";
import {
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
} from "lucide-react";

export default function CertificateLineageStudio() {
  const forensicDb = db as unknown as ForensicDatabase;
  const { meta, certificateLineage } = forensicDb;
  const { newSellersAnalysis, visualPatterns, traceableCertificates, summaryMetrics } = certificateLineage;

  // State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOriginFilter, setSelectedOriginFilter] = useState<string>("all");
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<string>("all");
  const [activePatternId, setActivePatternId] = useState<string>("pattern_new_sellers");
  const [expandedCertId, setExpandedCertId] = useState<string | null>("CS1-8002");
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
    const citation = `EXHIBIT CUSTODY TRACE - CERTIFICATE NO. ${cert.certNumber}\n` +
      `Issuer: GreenGro Technologies, Inc. (OTC: GRNH) | Common Shares: ${cert.shares.toLocaleString()}\n` +
      `Genesis Date: ${cert.genesisDate} | Origin Mechanics: ${cert.originType}\n` +
      `Primary Seller / Intermediary: ${cert.primarySeller} | Initial Recipient: ${cert.initialRecipient}\n` +
      `Legal Opinion Counsel: ${cert.opinionCounsel} | Clearing Depository: ${cert.brokerOrClearing}\n` +
      `Disposition Status: ${cert.currentHolderOrStatus}\n\n` +
      `VERIFIED CHAIN-OF-CUSTODY HOPS:\n` +
      cert.custodyHops.map(h => `  [Hop ${h.step} - ${h.date}] ${h.stageBadge}: ${h.from} -> ${h.to} | Action: ${h.action}`).join('\n') +
      `\n\nPRIMARY PHYSICAL HARD DRIVE RECEIPTS:\n` +
      cert.evidenceFiles.map(f => `  - ${f}`).join('\n');
    navigator.clipboard.writeText(citation);
    setCopiedCitation(cert.certNumber);
    setTimeout(() => setCopiedCitation(null), 2500);
  };

  const activePattern = useMemo(() => {
    return visualPatterns.find((p) => p.id === activePatternId) || visualPatterns[0];
  }, [visualPatterns, activePatternId]);

  // Filtered Certificates
  const filteredCertificates = useMemo(() => {
    return traceableCertificates.filter((cert) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !searchQuery ||
        cert.certNumber.toLowerCase().includes(q) ||
        cert.primarySeller.toLowerCase().includes(q) ||
        cert.initialRecipient.toLowerCase().includes(q) ||
        cert.currentHolderOrStatus.toLowerCase().includes(q) ||
        cert.brokerOrClearing.toLowerCase().includes(q) ||
        cert.opinionCounsel.toLowerCase().includes(q) ||
        cert.redFlags.some((rf) => rf.toLowerCase().includes(q));

      const matchOrigin =
        selectedOriginFilter === "all" || cert.originType.includes(selectedOriginFilter);

      const matchEntity =
        selectedEntityFilter === "all" ||
        cert.primarySeller.toLowerCase().includes(selectedEntityFilter.toLowerCase()) ||
        cert.initialRecipient.toLowerCase().includes(selectedEntityFilter.toLowerCase()) ||
        cert.currentHolderOrStatus.toLowerCase().includes(selectedEntityFilter.toLowerCase());

      return matchQuery && matchOrigin && matchEntity;
    });
  }, [traceableCertificates, searchQuery, selectedOriginFilter, selectedEntityFilter]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(text);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-main)" }}>
      {/* Top Header */}
      <header
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(10, 15, 26, 0.95)",
          backdropFilter: "blur(16px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "16px 32px",
        }}
      >
        <div style={{ maxWidth: "1600px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-subtle)",
                color: "#38bdf8",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <ArrowLeft size={15} /> Dashboard
            </Link>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
                  Certificate Trace & Transfer Pattern Studio
                </h1>
                <span className="badge badge-cyan" style={{ fontSize: "0.7rem" }}>
                  {meta.ticker} &bull; Forensic Lineage Engine
                </span>
                <span className="badge badge-rose" style={{ fontSize: "0.7rem" }}>
                  New Sellers Tracking
                </span>
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Traceable step-by-step provenance for each certificate &bull; Big Thunder, Motivated Minds, Dignitas, Third Coast, Haas & Straw Networks
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <a
              href="/GRNH_Forensic_Securities_Litigation_Report.pdf"
              download="GRNH_Forensic_Securities_Litigation_Report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.78rem",
                padding: "8px 14px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(2, 132, 199, 0.35) 100%)",
                border: "1px solid rgba(56, 189, 248, 0.5)",
                color: "#7dd3fc",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 700,
              }}
            >
              <FileCheck2 size={14} /> Audit Report (PDF)
            </a>
            <a
              href="/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.pdf" 
              download="LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.78rem",
                padding: "8px 14px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.35) 100%)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                color: "#fca5a5",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 700,
              }}
            >
              <FileText size={14} /> Download Handbook (PDF)
            </a>
            <a
              href="/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md" 
              download="LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md"
              style={{
                fontSize: "0.78rem",
                padding: "8px 14px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(190, 18, 60, 0.3) 100%)",
                border: "1px solid rgba(244, 63, 94, 0.4)",
                color: "#fda4af",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 700,
              }}
            >
              <FileText size={14} /> Lawyer Highway Map & Handbook (.MD)
            </a>
            <a
              href="/api/grnh?lineageOnly=true"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.78rem",
                padding: "8px 12px",
                borderRadius: "6px",
                background: "rgba(56, 189, 248, 0.1)",
                border: "1px solid rgba(56, 189, 248, 0.25)",
                color: "#38bdf8",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 600,
              }}
            >
              <Share2 size={13} /> API Feed
            </a>

            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-dim)",
                background: "rgba(0,0,0,0.4)",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              Tracked: <strong style={{ color: "#f8fafc" }}>{traceableCertificates.length} Certificates</strong>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "28px 32px", maxWidth: "1600px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
        {/* KPI Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          <div className="glass-panel" style={{ padding: "16px 20px", borderLeft: "3px solid #f87171" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              New Seller Secondary Volume
            </div>
            <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#f87171", fontFamily: "var(--font-mono)" }}>
              {summaryMetrics.newSellerVolume.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
              10 Secondary Entities &bull; $0.00 to Issuer Treasury
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "16px 20px", borderLeft: "3px solid #f43f5e" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Casa de Dinero Conduit
            </div>
            <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#f43f5e", fontFamily: "var(--font-mono)" }}>
              {(summaryMetrics.casaDeDineroVolume || 40540000).toLocaleString()}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Ruben Sanchez (FTS) &bull; $403.5k Cash Diverted
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "16px 20px", borderLeft: "3px solid #38bdf8" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Big Thunder LLC Nominee Conduit
            </div>
            <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#38bdf8", fontFamily: "var(--font-mono)" }}>
              {summaryMetrics.bigThunderVolume.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Tom McClusky Straw &bull; Forest / Alpine Clearing
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "16px 20px", borderLeft: "3px solid #fbbf24" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Motivated Minds / SagePoint
            </div>
            <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#fbbf24", fontFamily: "var(--font-mono)" }}>
              {summaryMetrics.motivatedMindsVolume.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Promissory Note Conduit &bull; SagePoint Deposit
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "16px 20px", borderLeft: "3px solid #c084fc" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Canadian Straw Consolidation
            </div>
            <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#c084fc", fontFamily: "var(--font-mono)" }}>
              {summaryMetrics.canadianNomineeVolume.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Paula Marie Poe &bull; BMO InvestorLine (Toronto)
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "16px 20px", borderLeft: "3px solid #34d399" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Mapped Certificates
            </div>
            <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#34d399", fontFamily: "var(--font-mono)" }}>
              {traceableCertificates.length} Dossiers
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
              100% Chain-of-Custody Verified
            </div>
          </div>
        </div>

        {/* SECTION 1: THE "NEW SELLERS" FORENSIC SHOWCASE */}
        <section className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span className="badge badge-rose" style={{ fontSize: "0.72rem" }}>
                  Target of Great Interest
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Secondary Market Arbitrage & Sham Intermediaries
                </span>
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc" }}>
                GRNH Shares Purchased from "New Sellers" (Secondary Conduits)
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "1000px", marginTop: "2px" }}>
                Detailed dossiers on all 10 entities, promoters, and straw vehicles (headlined by Casa de Dinero, LLC with 40.54M shares, Big Thunder LLC with 8M shares, and Motivated Minds) who acted as secondary sellers of GreenGro common stock, diverting proceeds from corporate accounts into personal offshore and promoter bank accounts.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "16px" }}>
            {newSellersAnalysis.map((ns) => (
              <div
                key={ns.id}
                style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  borderTop: "3px solid #f87171",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#f87171", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                        {ns.id} &bull; {ns.role}
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc", marginTop: "2px" }}>
                        {ns.name}
                      </h3>
                      <div style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 600 }}>
                        Controller: {ns.controller}
                      </div>
                    </div>
                    <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#f87171", fontFamily: "var(--font-mono)" }}>
                      {ns.totalSharesSoldOrTransferred.toLocaleString()} shs
                    </span>
                  </div>

                  <p style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.45, margin: "10px 0" }}>
                    {ns.summary}
                  </p>

                  <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: "6px", marginBottom: "10px", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>
                      Consideration & Treasury Status:
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#fbbf24", fontWeight: 600, marginTop: "2px" }}>
                      {ns.considerationReceived}
                    </div>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                      Affected Certificates:
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {ns.affectedCertificates.map((c, cIdx) => (
                        <span
                          key={cIdx}
                          style={{
                            fontSize: "0.68rem",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            background: "rgba(56, 189, 248, 0.1)",
                            color: "#38bdf8",
                            border: "1px solid rgba(56, 189, 248, 0.2)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px" }}>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                    Primary Evidence Receipts:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {ns.primaryEvidenceFiles.map((f, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          fontSize: "0.72rem",
                          color: "#94a3b8",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "rgba(255,255,255,0.02)",
                          padding: "3px 6px",
                          borderRadius: "3px",
                        }}
                      >
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f}</span>
                        <button
                          onClick={() => copyToClipboard(f)}
                          style={{ background: "transparent", border: "none", color: copiedPath === f ? "#34d399" : "#64748b", cursor: "pointer" }}
                        >
                          {copiedPath === f ? <Check size={11} /> : <Copy size={11} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: VISIBLE PATTERNS STUDIO */}
        <section className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span className="badge badge-purple" style={{ fontSize: "0.72rem" }}>
                  Visible Fraud Schematics
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  The 6 Core Flow Patterns
                </span>
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc" }}>
                Visible Transfer Flow Patterns & Securities Evasion Circuits
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "1000px", marginTop: "2px" }}>
                Interactive schematic visualization of how certificates were channeled through straw nominees, opinion attorneys, and broker-dealers to wash restricted shares.
              </p>
            </div>

            {/* Pattern Selector Pills */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {visualPatterns.map((pat) => (
                <button
                  key={pat.id}
                  onClick={() => setActivePatternId(pat.id)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    background: activePatternId === pat.id ? "#8b5cf6" : "rgba(255,255,255,0.04)",
                    color: activePatternId === pat.id ? "#ffffff" : "var(--text-muted)",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {pat.title.split(":")[0].replace("The ", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Active Pattern Schematic Display */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)",
              borderRadius: "10px",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <span className="badge badge-purple" style={{ fontSize: "0.7rem", marginBottom: "4px" }}>
                  Active Pattern Schematic
                </span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f8fafc" }}>
                  {activePattern.title}
                </h3>
                <div style={{ fontSize: "0.82rem", color: "#c084fc", fontWeight: 600 }}>
                  {activePattern.subtitle}
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {activePattern.statutoryViolations.map((v, vIdx) => (
                  <span key={vIdx} className="badge badge-rose" style={{ fontSize: "0.68rem" }}>
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <p style={{ fontSize: "0.86rem", color: "#e2e8f0", lineHeight: 1.5, marginBottom: "24px", background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "6px" }}>
              {activePattern.mechanicSummary}
            </p>

            {/* VISUAL FLOW DIAGRAM NODES */}
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "12px" }}>
              Visual Flow Circuit (Step 1 to Exit):
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", position: "relative" }}>
              {activePattern.nodes.map((node, nIdx) => (
                <div
                  key={nIdx}
                  style={{
                    background: "rgba(15, 23, 42, 0.9)",
                    borderRadius: "8px",
                    border: "1px solid rgba(139, 92, 246, 0.25)",
                    borderLeft: "3px solid #a855f7",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#c084fc", fontFamily: "var(--font-mono)" }}>
                        NODE 0{node.step}
                      </span>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          padding: "1px 6px",
                          borderRadius: "3px",
                          background: "rgba(168, 85, 247, 0.15)",
                          color: "#d8b4fe",
                          fontWeight: 700,
                        }}
                      >
                        {node.badge}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f8fafc", marginBottom: "6px" }}>
                      {node.entity}
                    </div>

                    <p style={{ fontSize: "0.76rem", color: "#94a3b8", lineHeight: 1.4, margin: 0 }}>
                      {node.action}
                    </p>
                  </div>

                  {nIdx < activePattern.nodes.length - 1 && (
                    <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "4px", color: "#8b5cf6", fontSize: "0.7rem", fontWeight: 600 }}>
                      Flows to Node 0{node.step + 1} <ArrowRight size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Affected Certificates for Active Pattern */}
            <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>
                Certificates Executed Under this Pattern:
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {activePattern.affectedCertificates.map((cert, cIdx) => (
                  <span
                    key={cIdx}
                    style={{
                      fontSize: "0.75rem",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      background: "rgba(239, 68, 68, 0.15)",
                      color: "#fca5a5",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                    }}
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: TRACEABLE CERTIFICATE LINEAGE ENGINE & GRAPHIC EXHIBIT STUDIO */}
        <section className="glass-panel" style={{ padding: "28px", borderLeft: "4px solid #38bdf8" }}>
          {/* Section Heading */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span className="badge badge-cyan" style={{ fontSize: "0.72rem" }}>
                  Courtroom-Grade Graphic Engine
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Each Certificate Fully Traceable in Visual & Graphic Formats
                </span>
              </div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.01em" }}>
                Graphic Certificate Chain-of-Custody Tracing Studio ({traceableCertificates.length} Certificates)
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "1050px", marginTop: "3px", lineHeight: 1.5 }}>
                Every single certificate is mapped into a traceable, chronological node-and-arrow graphic flowchart for use in legal complaints, depositions, summary judgment exhibits, and trial presentation. Select any certificate below to inspect its visual custody sequence or review the master ledger cards.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => copyLegalCitation(selectedGraphicCert)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  background: copiedCitation === selectedGraphicCert.certNumber ? "rgba(52, 211, 153, 0.2)" : "rgba(56, 189, 248, 0.12)",
                  border: copiedCitation === selectedGraphicCert.certNumber ? "1px solid #34d399" : "1px solid rgba(56, 189, 248, 0.4)",
                  color: copiedCitation === selectedGraphicCert.certNumber ? "#34d399" : "#38bdf8",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {copiedCitation === selectedGraphicCert.certNumber ? <Check size={14} /> : <Copy size={14} />}
                {copiedCitation === selectedGraphicCert.certNumber ? "Citation Copied!" : "Copy Exhibit Citation"}
              </button>

              <button
                onClick={() => window.print()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid var(--border-subtle)",
                  color: "#f8fafc",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <Printer size={14} /> Print / Export Court Exhibit
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* FEATURED INTERACTIVE GRAPHIC CERTIFICATE INSPECTOR                         */}
          {/* ========================================================================= */}
          <div
            style={{
              background: "rgba(10, 15, 26, 0.85)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              borderRadius: "10px",
              padding: "24px",
              marginBottom: "36px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Inspector Selector Ribbon */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                paddingBottom: "16px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "#38bdf8", letterSpacing: "0.05em" }}>
                  Select Certificate:
                </span>

                {/* Dropdown for All 31 Certificates */}
                <select
                  value={selectedGraphicCertId}
                  onChange={(e) => setSelectedGraphicCertId(e.target.value)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "6px",
                    background: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid #38bdf8",
                    color: "#f8fafc",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    cursor: "pointer",
                  }}
                >
                  {traceableCertificates.map((c) => (
                    <option key={c.certNumber} value={c.certNumber}>
                      {c.certNumber} — {c.shares.toLocaleString()} Shs ({c.primarySeller.slice(0, 24)})
                    </option>
                  ))}
                </select>

                {/* Prev / Next Buttons */}
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    onClick={handlePrevCert}
                    title="Previous Certificate"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "30px",
                      height: "30px",
                      borderRadius: "4px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid var(--border-subtle)",
                      color: "#cbd5e1",
                      cursor: "pointer",
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextCert}
                    title="Next Certificate"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "30px",
                      height: "30px",
                      borderRadius: "4px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid var(--border-subtle)",
                      color: "#cbd5e1",
                      cursor: "pointer",
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Priority Quick Selection Pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase" }}>
                  High-Profile Picks:
                </span>
                {[
                  { id: "CS1-8002", label: "CS1-8002 (Big Thunder)" },
                  { id: "CS1-7937", label: "CS1-7937 (Casa Dinero)" },
                  { id: "CS1-7908", label: "CS1-7908 (Motivated Minds)" },
                  { id: "CS1-8172", label: "CS1-8172 (Hintzen 6.79M)" },
                  { id: "CS1-7750", label: "CS1-7750 (Paula Poe)" },
                  { id: "CS1-7835", label: "CS1-7835 (Dignitas)" },
                  { id: "CS1-7800", label: "CS1-7800 (David Rome)" },
                ].map((p) => {
                  const isSel = selectedGraphicCertId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedGraphicCertId(p.id)}
                      style={{
                        padding: "4px 9px",
                        borderRadius: "4px",
                        fontSize: "0.72rem",
                        fontWeight: isSel ? 700 : 500,
                        background: isSel ? "#38bdf8" : "rgba(255, 255, 255, 0.05)",
                        color: isSel ? "#0f172a" : "#cbd5e1",
                        border: isSel ? "1px solid #38bdf8" : "1px solid var(--border-subtle)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Certificate Exhibit Header */}
            <div
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                padding: "16px 20px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                    <span
                      style={{
                        fontSize: "1.35rem",
                        fontWeight: 900,
                        color: "#38bdf8",
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      CERTIFICATE #{selectedGraphicCert.certNumber}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "4px 9px",
                        borderRadius: "4px",
                        background: selectedGraphicCert.originType.includes("New Seller")
                          ? "rgba(248, 113, 113, 0.2)"
                          : "rgba(56, 189, 248, 0.15)",
                        color: selectedGraphicCert.originType.includes("New Seller") ? "#f87171" : "#38bdf8",
                        border: selectedGraphicCert.originType.includes("New Seller")
                          ? "1px solid rgba(248, 113, 113, 0.4)"
                          : "1px solid rgba(56, 189, 248, 0.3)",
                      }}
                    >
                      {selectedGraphicCert.originType}
                    </span>
                    <span className="badge badge-amber" style={{ fontSize: "0.7rem" }}>
                      {selectedGraphicCert.custodyHops.length} Custody Hops
                    </span>
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", gap: "18px", flexWrap: "wrap" }}>
                    <span>Genesis Date: <strong style={{ color: "#f8fafc" }}>{selectedGraphicCert.genesisDate}</strong></span>
                    <span>Primary Seller / Intermediary: <strong style={{ color: "#fbbf24" }}>{selectedGraphicCert.primarySeller}</strong></span>
                    <span>Legal Opinion: <strong style={{ color: "#f43f5e" }}>{selectedGraphicCert.opinionCounsel}</strong></span>
                    <span>Clearing Depository: <strong style={{ color: "#818cf8" }}>{selectedGraphicCert.brokerOrClearing}</strong></span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Tracked Share Volume
                  </div>
                  <div
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 900,
                      color: "#f8fafc",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {selectedGraphicCert.shares.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 600 }}>
                    Status: {selectedGraphicCert.currentHolderOrStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* THE VISUAL FLOWCHART GRAPHIC TRACK */}
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#38bdf8",
                  letterSpacing: "0.08em",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <GitCommit size={15} /> Graphic Chain-of-Custody Flowchart:
              </div>

              {/* Horizontal Scrollable Container for Flowchart */}
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  overflowX: "auto",
                  paddingBottom: "16px",
                  gap: "12px",
                }}
              >
                {selectedGraphicCert.custodyHops.map((hop, hopIdx) => {
                  const style = getStageStyle(hop.stageBadge);
                  const isLast = hopIdx === selectedGraphicCert.custodyHops.length - 1;

                  return (
                    <React.Fragment key={hop.step}>
                      {/* Flow Node Card */}
                      <div
                        style={{
                          minWidth: "260px",
                          maxWidth: "300px",
                          flex: "1 0 260px",
                          background: style.bg,
                          border: `1px solid ${style.border}`,
                          borderRadius: "8px",
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          position: "relative",
                          boxShadow: `0 4px 20px ${style.bg}`,
                        }}
                      >
                        {/* Step Top Bar */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                padding: "2px 7px",
                                borderRadius: "3px",
                                background: style.border,
                                color: "#0f172a",
                              }}
                            >
                              Step {hop.step}
                            </span>
                            <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontFamily: "var(--font-mono)" }}>
                              {hop.date}
                            </span>
                          </div>

                          {/* Stage Badge */}
                          <div style={{ fontSize: "0.76rem", fontWeight: 700, color: style.text, marginBottom: "8px" }}>
                            {hop.stageBadge}
                          </div>

                          {/* Entity Transfer Box */}
                          <div
                            style={{
                              background: "rgba(0, 0, 0, 0.4)",
                              borderRadius: "5px",
                              padding: "8px 10px",
                              marginBottom: "10px",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#cbd5e1" }}>
                              <span style={{ color: "var(--text-dim)", width: "35px" }}>From:</span>
                              <strong style={{ color: "#f8fafc" }}>{hop.from}</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#cbd5e1", marginTop: "4px" }}>
                              <span style={{ color: "var(--text-dim)", width: "35px" }}>To:</span>
                              <strong style={{ color: style.text }}>{hop.to}</strong>
                            </div>
                          </div>

                          {/* Action Description */}
                          <div style={{ fontSize: "0.75rem", color: "#e2e8f0", lineHeight: 1.45, marginBottom: "12px" }}>
                            {hop.action}
                          </div>
                        </div>

                        {/* Statutory Violation Tag */}
                        <div
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            padding: "4px 8px",
                            borderRadius: "4px",
                            background: "rgba(0,0,0,0.5)",
                            color: style.text,
                            borderLeft: `2px solid ${style.border}`,
                            marginTop: "8px",
                          }}
                        >
                          {style.tag}
                        </div>
                      </div>

                      {/* Connector Arrow Between Nodes */}
                      {!isLast && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 4px",
                            color: "#38bdf8",
                            opacity: 0.85,
                          }}
                        >
                          <ArrowRight size={22} style={{ filter: "drop-shadow(0 0 6px #38bdf8)" }} />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Evidentiary Receipts Drawer for Selected Cert */}
            <div
              style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
              }}
            >
              {/* Red Flags Column */}
              <div>
                <div style={{ fontSize: "0.72rem", color: "#f87171", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldAlert size={13} /> Specific Forensic Red Flags:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {selectedGraphicCert.redFlags.map((rf, rfIdx) => (
                    <div
                      key={rfIdx}
                      style={{
                        fontSize: "0.75rem",
                        color: "#fca5a5",
                        background: "rgba(239, 68, 68, 0.08)",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        borderLeft: "3px solid #ef4444",
                      }}
                    >
                      {rf}
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical Evidence Files on Disk */}
              <div>
                <div style={{ fontSize: "0.72rem", color: "#38bdf8", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FileCheck2 size={13} /> Primary Evidentiary Files on Disk ({selectedGraphicCert.evidenceFiles.length} Files):
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {selectedGraphicCert.evidenceFiles.map((ef, efIdx) => (
                    <div
                      key={efIdx}
                      style={{
                        fontSize: "0.73rem",
                        color: "#cbd5e1",
                        background: "rgba(255,255,255,0.03)",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-mono)" }}>
                        {ef}
                      </span>
                      <button
                        onClick={() => copyToClipboard(ef)}
                        title="Copy file path"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: copiedPath === ef ? "#34d399" : "#64748b",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        {copiedPath === ef ? <Check size={12} /> : <Copy size={12} />}
                        {copiedPath === ef ? "Copied" : "Copy"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MASTER LEDGER: ALL 31 CERTIFICATES WITH GRAPHIC FLOWCHARTS                 */}
          {/* ========================================================================= */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "14px" }}>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f8fafc" }}>
                Master Certificate Dossiers & Visual Tracing Ledger
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Showing {filteredCertificates.length} of {traceableCertificates.length} Certificates with verified chain-of-custody flows
              </div>
            </div>

            {/* Controls: Search, Filters & View Mode Toggle */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              {/* View Mode Switch */}
              <div
                style={{
                  display: "flex",
                  background: "rgba(0,0,0,0.5)",
                  borderRadius: "6px",
                  padding: "2px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <button
                  onClick={() => setCertViewMode("flowchart")}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: certViewMode === "flowchart" ? "#38bdf8" : "transparent",
                    color: certViewMode === "flowchart" ? "#0f172a" : "#94a3b8",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <GitCommit size={13} /> Graphic Flowcharts
                </button>
                <button
                  onClick={() => setCertViewMode("table")}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: certViewMode === "table" ? "#38bdf8" : "transparent",
                    color: certViewMode === "table" ? "#0f172a" : "#94a3b8",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Layers size={13} /> Compact Table
                </button>
              </div>

              {/* Search Bar */}
              <div style={{ position: "relative", minWidth: "220px" }}>
                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                <input
                  type="text"
                  placeholder="Filter certs, sellers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 12px 7px 30px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    background: "rgba(0,0,0,0.4)",
                    color: "#f8fafc",
                    fontSize: "0.78rem",
                  }}
                />
              </div>

              {/* Origin Filter */}
              <select
                value={selectedOriginFilter}
                onChange={(e) => setSelectedOriginFilter(e.target.value)}
                style={{
                  padding: "7px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  background: "rgba(0,0,0,0.4)",
                  color: "#e2e8f0",
                  fontSize: "0.78rem",
                }}
              >
                <option value="all">All Origins</option>
                <option value="New Seller">New Seller Conduits</option>
                <option value="Direct Issuer">Direct Issuance</option>
                <option value="Backdated">Backdated Consulting</option>
                <option value="Canadian">Canadian Nominees</option>
              </select>

              {/* Entity Filter */}
              <select
                value={selectedEntityFilter}
                onChange={(e) => setSelectedEntityFilter(e.target.value)}
                style={{
                  padding: "7px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  background: "rgba(0,0,0,0.4)",
                  color: "#e2e8f0",
                  fontSize: "0.78rem",
                }}
              >
                <option value="all">All Entities</option>
                <option value="Big Thunder">Big Thunder LLC</option>
                <option value="Motivated Minds">Motivated Minds / SagePoint</option>
                <option value="Dignitas">Dignitas Consulting</option>
                <option value="Third Coast">Third Coast Partners</option>
                <option value="Poe">Paula Marie Poe</option>
                <option value="Hintzen">Hintzen Network</option>
                <option value="Haas">Haas / Romano</option>
              </select>
            </div>
          </div>

          {/* RENDER MODE 1: GRAPHIC FLOWCHART CARDS (DEFAULT) */}
          {certViewMode === "flowchart" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredCertificates.map((cert) => {
                const isExpanded = expandedCertId === cert.certNumber;
                return (
                  <div
                    key={cert.certNumber}
                    style={{
                      background: isExpanded ? "rgba(15, 23, 42, 0.9)" : "rgba(15, 23, 42, 0.55)",
                      borderRadius: "8px",
                      border: isExpanded ? "1px solid #38bdf8" : "1px solid var(--border-subtle)",
                      overflow: "hidden",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Card Header Row */}
                    <div
                      style={{
                        padding: "16px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        flexWrap: "wrap",
                        gap: "12px",
                        background: isExpanded ? "rgba(56, 189, 248, 0.05)" : "transparent",
                      }}
                      onClick={() => setExpandedCertId(isExpanded ? null : cert.certNumber)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#38bdf8", fontFamily: "var(--font-mono)" }}>
                          {cert.certNumber}
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "4px",
                            background: cert.originType.includes("New Seller") ? "rgba(248, 113, 113, 0.15)" : "rgba(255,255,255,0.05)",
                            color: cert.originType.includes("New Seller") ? "#f87171" : "#cbd5e1",
                            border: cert.originType.includes("New Seller") ? "1px solid rgba(248, 113, 113, 0.3)" : "1px solid var(--border-subtle)",
                          }}
                        >
                          {cert.originType}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          Genesis: <strong style={{ color: "#e2e8f0" }}>{cert.genesisDate}</strong>
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Shares</div>
                          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f8fafc", fontFamily: "var(--font-mono)" }}>
                            {cert.shares.toLocaleString()}
                          </div>
                        </div>

                        <div style={{ textAlign: "right", minWidth: "150px" }}>
                          <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Primary Seller</div>
                          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: cert.primarySeller.includes("Big Thunder") ? "#38bdf8" : cert.primarySeller.includes("Dignitas") ? "#fbbf24" : "#e2e8f0" }}>
                            {cert.primarySeller}
                          </div>
                        </div>

                        <div style={{ color: isExpanded ? "#38bdf8" : "#64748b" }}>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {/* ALWAYS VISIBLE: HORIZONTAL MINI GRAPHIC FLOWCHART TRACK */}
                    <div
                      style={{
                        padding: "12px 20px 16px 20px",
                        background: "rgba(0, 0, 0, 0.25)",
                        borderTop: "1px solid rgba(255,255,255,0.04)",
                        overflowX: "auto",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "max-content" }}>
                        {cert.custodyHops.map((hop, hopIdx) => {
                          const style = getStageStyle(hop.stageBadge);
                          const isLast = hopIdx === cert.custodyHops.length - 1;
                          return (
                            <React.Fragment key={hop.step}>
                              <div
                                style={{
                                  background: style.bg,
                                  border: `1px solid ${style.border}`,
                                  borderRadius: "6px",
                                  padding: "8px 12px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.65rem",
                                    fontWeight: 800,
                                    padding: "2px 5px",
                                    borderRadius: "3px",
                                    background: style.border,
                                    color: "#0f172a",
                                  }}
                                >
                                  {hop.step}
                                </span>
                                <div>
                                  <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontFamily: "var(--font-mono)" }}>
                                    {hop.date}
                                  </div>
                                  <div style={{ fontSize: "0.76rem", fontWeight: 700, color: style.text, whiteSpace: "nowrap" }}>
                                    {hop.stageBadge}
                                  </div>
                                  <div style={{ fontSize: "0.72rem", color: "#e2e8f0", whiteSpace: "nowrap" }}>
                                    {hop.from} &rarr; {hop.to}
                                  </div>
                                </div>
                              </div>
                              {!isLast && (
                                <ArrowRight size={14} style={{ color: "#38bdf8", flexShrink: 0 }} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* EXPANDED FULL LEGAL DOSSIER */}
                    {isExpanded && (
                      <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.4)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
                          {/* Detailed Hop Narrative */}
                          <div>
                            <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#38bdf8", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                              <GitCommit size={14} /> Full Evidentiary Custody Log:
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "14px", position: "relative", paddingLeft: "16px", borderLeft: "2px solid rgba(56, 189, 248, 0.3)" }}>
                              {cert.custodyHops.map((hop) => {
                                const style = getStageStyle(hop.stageBadge);
                                return (
                                  <div key={hop.step} style={{ position: "relative" }}>
                                    <div
                                      style={{
                                        position: "absolute",
                                        left: "-23px",
                                        top: "3px",
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                        background: style.border,
                                        border: "2px solid #0f172a",
                                      }}
                                    />
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                      <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                                        Step {hop.step} &bull; {hop.date}
                                      </span>
                                      <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "1px 6px", borderRadius: "3px", background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                                        {hop.stageBadge}
                                      </span>
                                    </div>

                                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f8fafc", marginTop: "3px" }}>
                                      {hop.from} <ArrowRight size={11} style={{ display: "inline", verticalAlign: "middle" }} /> {hop.to}
                                    </div>
                                    <div style={{ fontSize: "0.78rem", color: "#cbd5e1", marginTop: "4px", lineHeight: 1.45 }}>
                                      {hop.action}
                                    </div>
                                    <div style={{ fontSize: "0.7rem", color: style.text, marginTop: "4px", fontStyle: "italic" }}>
                                      Violation Indicator: {style.tag}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Technical & Evidentiary Details */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
                              <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>
                                Depository / Brokerage:
                              </div>
                              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#38bdf8", marginTop: "2px" }}>
                                {cert.brokerOrClearing}
                              </div>

                              <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700, marginTop: "8px" }}>
                                Legal Opinion Counsel:
                              </div>
                              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0", marginTop: "2px" }}>
                                {cert.opinionCounsel}
                              </div>

                              <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700, marginTop: "8px" }}>
                                Disposition Status:
                              </div>
                              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#34d399", marginTop: "2px" }}>
                                {cert.currentHolderOrStatus}
                              </div>
                            </div>

                            {/* Red Flags */}
                            <div>
                              <div style={{ fontSize: "0.68rem", color: "#f87171", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                                Forensic Red Flags:
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                {cert.redFlags.map((rf, rfIdx) => (
                                  <div key={rfIdx} style={{ fontSize: "0.72rem", color: "#fca5a5", background: "rgba(239, 68, 68, 0.1)", padding: "4px 8px", borderRadius: "4px", borderLeft: "2px solid #ef4444" }}>
                                    {rf}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Evidence Files */}
                            <div>
                              <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                                Evidentiary Receipts on Disk:
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                {cert.evidenceFiles.map((ef, efIdx) => (
                                  <div
                                    key={efIdx}
                                    style={{
                                      fontSize: "0.7rem",
                                      color: "#94a3b8",
                                      background: "rgba(255,255,255,0.02)",
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ef}</span>
                                    <button
                                      onClick={() => copyToClipboard(ef)}
                                      style={{ background: "transparent", border: "none", color: copiedPath === ef ? "#34d399" : "#64748b", cursor: "pointer" }}
                                    >
                                      {copiedPath === ef ? <Check size={11} /> : <Copy size={11} />}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Load in Inspector Button */}
                            <button
                              onClick={() => {
                                setSelectedGraphicCertId(cert.certNumber);
                                window.scrollTo({ top: 900, behavior: "smooth" });
                              }}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "5px",
                                background: "rgba(56, 189, 248, 0.1)",
                                border: "1px solid #38bdf8",
                                color: "#38bdf8",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                              }}
                            >
                              <Sparkles size={13} /> Open in Featured Graphic Flow Inspector
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* RENDER MODE 2: COMPACT TABLE */
            <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                <thead>
                  <tr style={{ background: "rgba(15, 23, 42, 0.9)", borderBottom: "1px solid var(--border-subtle)" }}>
                    <th style={{ padding: "12px 14px", textAlign: "left", color: "var(--text-dim)", fontWeight: 700 }}>Cert #</th>
                    <th style={{ padding: "12px 14px", textAlign: "left", color: "var(--text-dim)", fontWeight: 700 }}>Shares</th>
                    <th style={{ padding: "12px 14px", textAlign: "left", color: "var(--text-dim)", fontWeight: 700 }}>Genesis Date</th>
                    <th style={{ padding: "12px 14px", textAlign: "left", color: "var(--text-dim)", fontWeight: 700 }}>Origin Mechanism</th>
                    <th style={{ padding: "12px 14px", textAlign: "left", color: "var(--text-dim)", fontWeight: 700 }}>Primary Seller / Conduit</th>
                    <th style={{ padding: "12px 14px", textAlign: "left", color: "var(--text-dim)", fontWeight: 700 }}>Opinion Counsel</th>
                    <th style={{ padding: "12px 14px", textAlign: "left", color: "var(--text-dim)", fontWeight: 700 }}>Brokerage</th>
                    <th style={{ padding: "12px 14px", textAlign: "center", color: "var(--text-dim)", fontWeight: 700 }}>Hops</th>
                    <th style={{ padding: "12px 14px", textAlign: "center", color: "var(--text-dim)", fontWeight: 700 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((cert) => (
                    <tr
                      key={cert.certNumber}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        background: selectedGraphicCertId === cert.certNumber ? "rgba(56, 189, 248, 0.08)" : "transparent",
                      }}
                    >
                      <td style={{ padding: "10px 14px", fontWeight: 800, color: "#38bdf8", fontFamily: "var(--font-mono)" }}>
                        {cert.certNumber}
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: "#f8fafc", fontFamily: "var(--font-mono)" }}>
                        {cert.shares.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{cert.genesisDate}</td>
                      <td style={{ padding: "10px 14px", color: cert.originType.includes("New Seller") ? "#f87171" : "#cbd5e1" }}>
                        {cert.originType}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#e2e8f0" }}>{cert.primarySeller}</td>
                      <td style={{ padding: "10px 14px", color: "#e2e8f0" }}>{cert.opinionCounsel}</td>
                      <td style={{ padding: "10px 14px", color: "#818cf8" }}>{cert.brokerOrClearing}</td>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <span className="badge badge-cyan" style={{ fontSize: "0.68rem" }}>
                          {cert.custodyHops.length}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <button
                          onClick={() => {
                            setSelectedGraphicCertId(cert.certNumber);
                            setCertViewMode("flowchart");
                            setExpandedCertId(cert.certNumber);
                          }}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            background: "rgba(56, 189, 248, 0.1)",
                            border: "1px solid #38bdf8",
                            color: "#38bdf8",
                            fontSize: "0.72rem",
                            cursor: "pointer",
                          }}
                        >
                          View Graphic Flow
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SECTION 4: BIG THUNDER & MOTIVATED MINDS DOSSIER */}
        <section className="glass-panel" style={{ padding: "24px", borderLeft: "4px solid #38bdf8" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc", marginBottom: "6px" }}>
            Target Dossier: Big Thunder, LLC & Motivated Minds Operational Network
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "18px" }}>
            Direct evidence documenting how Big Thunder LLC and Motivated Minds operated as nominee distribution hubs to evade regulatory scrutiny and broker blacklists.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "20px" }}>
            {/* Big Thunder Card */}
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#38bdf8" }}>
                  Big Thunder, LLC (Formed 8/30/2017)
                </h3>
                <span className="badge badge-rose" style={{ fontSize: "0.7rem" }}>
                  8,000,000 Shares Tracked
                </span>
              </div>

              <div style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                <p>
                  As explicitly recorded in <strong>Big Thunder LLC CHAPTER.docx</strong>, Big Thunder LLC was created on August 30, 2017 specifically because Ira Gaines faced widespread broker account closures at Wilson-Davis and Pershing. The managing partner was Tom McCluskey, husband of Sue McCluskey (Ira's assistant/bookkeeper).
                </p>
                <div style={{ background: "rgba(239, 68, 68, 0.1)", padding: "10px 14px", borderRadius: "6px", borderLeft: "3px solid #ef4444", margin: "10px 0" }}>
                  <strong>The Smoking Gun: Page 14 Ira Gaines Error:</strong>
                  <div style={{ fontSize: "0.78rem", color: "#fecdd3", marginTop: "2px" }}>
                    When opening the Big Thunder account with broker David Adams at Forest Securities, page 14 of the operating agreement inadvertently named Ira Gaines as Initial Manager. Broker David Adams alerted the group, and Sue McCluskey quickly substituted Tom McCluskey so the account could be opened to shovel shares.
                  </div>
                </div>
                <p>
                  <strong>Brokerages Used:</strong> Forest Securities (David Adams), Alpine Securities Clearing, Wedbush Securities, and Kaehr.
                </p>
              </div>
            </div>

            {/* Motivated Minds Card */}
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fbbf24" }}>
                  Motivated Minds / SagePoint Financial
                </h3>
                <span className="badge badge-amber" style={{ fontSize: "0.7rem" }}>
                  1,000,000 Shares Deposited
                </span>
              </div>

              <div style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                <p>
                  Motivated Minds operated as a commercial promissory note conduit and compensation distribution entity, maintaining corporate accounts at Wells Fargo and Bankers Trust (referenced across promoter payroll ledgers as <em>Wells-Motivated Minds</em> and <em>Bankers-Motivated Minds</em>).
                </p>
                <div style={{ background: "rgba(251, 191, 36, 0.1)", padding: "10px 14px", borderRadius: "6px", borderLeft: "3px solid #fbbf24", margin: "10px 0" }}>
                  <strong>SagePoint Financial Deposit:</strong>
                  <div style={{ fontSize: "0.78rem", color: "#fef3c7", marginTop: "2px" }}>
                    Documented in <strong>SagePoint Motivated Minds.pdf</strong> and <strong>GRNH for Sage point 1MM shares.pdf</strong>, 1,000,000 shares of GRNH were routed to SagePoint Financial for deposit and liquidation under promissory note conversion mechanics.
                  </div>
                </div>
                <p>
                  <strong>Linked Records:</strong> OCLG-Motivated Minds Promissory Note ($20k), Motivated Seller Letter template, and Eric Miller Compensation ledgers (2017-2020).
                </p>
              </div>
            </div>
          </div>
        </section>
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
          GRNH Forensics &bull; Certificate Trace & Transfer Pattern Studio &bull; Fed. R. Civ. P. 26 Evidentiary Pedigree
        </div>
        <div style={{ display: "flex", gap: "14px" }}>
          <Link href="/" style={{ color: "#38bdf8", textDecoration: "none" }}>Forensic Dashboard</Link>
          <a href="/api/grnh?lineageOnly=true" target="_blank" rel="noopener noreferrer" style={{ color: "#94a3b8", textDecoration: "none" }}>Lineage API</a>
        </div>
      </footer>
    </div>
  );
}
