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
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

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
              9 Secondary Entities &bull; $0.00 to Issuer Treasury
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
                Detailed dossiers on all 9 entities, promoters, and straw vehicles who acted as secondary sellers of GreenGro common stock, diverting proceeds from corporate accounts into personal offshore and promoter bank accounts.
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

        {/* SECTION 3: TRACEABLE CERTIFICATE LINEAGE ENGINE */}
        <section className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "14px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span className="badge badge-cyan" style={{ fontSize: "0.72rem" }}>
                  Traceable Pedigree Ledger
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Every Certificate Tracked from Genesis to Disposition
                </span>
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc" }}>
                Traceable History for Each and Every Certificate ({filteredCertificates.length} Certificates)
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "1000px", marginTop: "2px" }}>
                Click on any certificate to expand the complete, step-by-step custody timeline, stock powers, legal opinions, and primary evidence files.
              </p>
            </div>

            {/* Filters & Search */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative", minWidth: "240px" }}>
                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                <input
                  type="text"
                  placeholder="Search cert, seller, broker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 32px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    background: "rgba(0,0,0,0.4)",
                    color: "#f8fafc",
                    fontSize: "0.8rem",
                  }}
                />
              </div>

              {/* Origin Filter */}
              <select
                value={selectedOriginFilter}
                onChange={(e) => setSelectedOriginFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  background: "rgba(0,0,0,0.4)",
                  color: "#e2e8f0",
                  fontSize: "0.8rem",
                }}
              >
                <option value="all">All Origin Types</option>
                <option value="New Seller">Purchased from New Seller</option>
                <option value="Direct Issuer">Direct Issuer Issuances</option>
                <option value="Backdated">Backdated Consulting</option>
                <option value="Canadian">Canadian Straw Consolidation</option>
                <option value="Familial">Familial Conduit</option>
              </select>

              {/* Entity Filter */}
              <select
                value={selectedEntityFilter}
                onChange={(e) => setSelectedEntityFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  background: "rgba(0,0,0,0.4)",
                  color: "#e2e8f0",
                  fontSize: "0.8rem",
                }}
              >
                <option value="all">All Primary Entities</option>
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

          {/* Certificate Dossier Cards List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filteredCertificates.map((cert) => {
              const isExpanded = expandedCertId === cert.certNumber;
              return (
                <div
                  key={cert.certNumber}
                  style={{
                    background: isExpanded ? "rgba(15, 23, 42, 0.85)" : "rgba(15, 23, 42, 0.5)",
                    borderRadius: "8px",
                    border: isExpanded ? "1px solid #38bdf8" : "1px solid var(--border-subtle)",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Card Header Row */}
                  <div
                    onClick={() => setExpandedCertId(isExpanded ? null : cert.certNumber)}
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
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#38bdf8", fontFamily: "var(--font-mono)" }}>
                        {cert.certNumber}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
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
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Genesis: <strong style={{ color: "#e2e8f0" }}>{cert.genesisDate}</strong>
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Shares</div>
                        <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#f8fafc", fontFamily: "var(--font-mono)" }}>
                          {cert.shares.toLocaleString()}
                        </div>
                      </div>

                      <div style={{ textAlign: "right", minWidth: "140px" }}>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Primary Seller / Origin</div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: cert.primarySeller.includes("Big Thunder") ? "#38bdf8" : cert.primarySeller.includes("Dignitas") ? "#fbbf24" : "#e2e8f0" }}>
                          {cert.primarySeller}
                        </div>
                      </div>

                      <div style={{ color: isExpanded ? "#38bdf8" : "#64748b" }}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Custody Timeline & Details */}
                  {isExpanded && (
                    <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
                        {/* Left: Step-by-Step Chain of Custody */}
                        <div>
                          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#38bdf8", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <GitCommit size={14} /> Traceable Chain-of-Custody Timeline:
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", position: "relative", paddingLeft: "14px", borderLeft: "2px solid rgba(56, 189, 248, 0.3)" }}>
                            {cert.custodyHops.map((hop) => (
                              <div key={hop.step} style={{ position: "relative" }}>
                                <div
                                  style={{
                                    position: "absolute",
                                    left: "-21px",
                                    top: "2px",
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "50%",
                                    background: "#38bdf8",
                                    border: "2px solid #0f172a",
                                  }}
                                />
                                <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                                  Step {hop.step} &bull; {hop.date}
                                </div>
                                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f8fafc", marginTop: "2px" }}>
                                  {hop.from} <ArrowRight size={11} style={{ display: "inline", verticalAlign: "middle" }} /> {hop.to}
                                </div>
                                <div style={{ fontSize: "0.78rem", color: "#cbd5e1", marginTop: "3px", lineHeight: 1.4 }}>
                                  {hop.action}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right: Technical Metadata & Primary Evidence */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                          <div style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>
                              Clearing Broker / Depository:
                            </div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#38bdf8", marginTop: "2px" }}>
                              {cert.brokerOrClearing}
                            </div>

                            <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700, marginTop: "8px" }}>
                              Opinion Counsel / Authority:
                            </div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0", marginTop: "2px" }}>
                              {cert.opinionCounsel}
                            </div>

                            <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700, marginTop: "8px" }}>
                              Final Disposition Status:
                            </div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#fbbf24", marginTop: "2px" }}>
                              {cert.currentHolderOrStatus}
                            </div>
                          </div>

                          {/* Red Flags */}
                          <div>
                            <div style={{ fontSize: "0.7rem", color: "#f87171", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                              Forensic Red Flags:
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              {cert.redFlags.map((rf, rfIdx) => (
                                <div key={rfIdx} style={{ fontSize: "0.74rem", color: "#fca5a5", background: "rgba(239, 68, 68, 0.1)", padding: "4px 8px", borderRadius: "4px", borderLeft: "2px solid #ef4444" }}>
                                  {rf}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Primary Evidence Files */}
                          <div>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                              Evidentiary Source Files on Disk:
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              {cert.evidenceFiles.map((ef, efIdx) => (
                                <div
                                  key={efIdx}
                                  style={{
                                    fontSize: "0.72rem",
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
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
