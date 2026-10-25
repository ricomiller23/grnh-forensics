import { NextResponse } from "next/server";
import db from "@/data/grnh_forensic_database.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase();
  const phase = searchParams.get("phase");
  const cert = searchParams.get("cert");
  const category = searchParams.get("category");
  const nonCompanyOnly = searchParams.get("nonCompanyOnly") === "true";
  const lineageOnly = searchParams.get("lineageOnly") === "true";
  const newSellersOnly = searchParams.get("newSellersOnly") === "true";

  let filteredTxs = db.transactions;
  let filteredFiles = db.sourceFilesCatalog;
  let filteredNonCompanyTranches = db.nonCompanySharesAnalysis?.tranches || [];

  if (phase && phase !== "all") {
    filteredTxs = filteredTxs.filter((tx) => tx.phase === phase);
  }

  if (cert && cert !== "all") {
    filteredTxs = filteredTxs.filter((tx) => tx.cert.toLowerCase().includes(cert.toLowerCase()));
    filteredFiles = filteredFiles.filter((f) =>
      (f.linkedCertificates || []).some((c) => c.toLowerCase().includes(cert.toLowerCase())) ||
      f.filename.toLowerCase().includes(cert.toLowerCase())
    );
    filteredNonCompanyTranches = filteredNonCompanyTranches.filter((t) =>
      t.cert.toLowerCase().includes(cert.toLowerCase())
    );
  }

  if (category && category !== "all") {
    filteredFiles = filteredFiles.filter((f) => f.category === category);
  }

  if (q) {
    filteredTxs = filteredTxs.filter(
      (tx) =>
        tx.cert.toLowerCase().includes(q) ||
        tx.from.toLowerCase().includes(q) ||
        tx.to.toLowerCase().includes(q) ||
        tx.notes.toLowerCase().includes(q) ||
        tx.opinion.toLowerCase().includes(q) ||
        tx.anomalies.some((a) => a.toLowerCase().includes(q))
    );

    filteredFiles = filteredFiles.filter(
      (f) =>
        f.filename.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.path.toLowerCase().includes(q) ||
        (f.linkedCertificates || []).some((c) => c.toLowerCase().includes(q))
    );

    filteredNonCompanyTranches = filteredNonCompanyTranches.filter(
      (t) =>
        t.recipient.toLowerCase().includes(q) ||
        t.cert.toLowerCase().includes(q) ||
        t.opinionAuthor.toLowerCase().includes(q) ||
        t.statedOrigin.toLowerCase().includes(q) ||
        t.forensicAutopsy.toLowerCase().includes(q) ||
        t.statutoryViolations.some((v: string) => v.toLowerCase().includes(q))
    );
  }

    if (lineageOnly) {
    return NextResponse.json({
      meta: {
        ticker: db.meta.ticker,
        companyName: db.meta.companyName,
        totalTrackedCertificates: db.certificateLineage?.summaryMetrics?.totalTrackedCertificates || 0,
        newSellerVolume: db.certificateLineage?.summaryMetrics?.newSellerVolume || 0,
        bigThunderVolume: db.certificateLineage?.summaryMetrics?.bigThunderVolume || 0,
      },
      certificateLineage: db.certificateLineage,
    });
  }

  if (newSellersOnly) {
    return NextResponse.json({
      newSellersAnalysis: db.certificateLineage?.newSellersAnalysis || [],
      summaryMetrics: db.certificateLineage?.summaryMetrics,
    });
  }

  if (nonCompanyOnly) {
    return NextResponse.json({
      meta: {
        ticker: db.meta.ticker,
        companyName: db.meta.companyName,
        totalNonCompanyShares: db.nonCompanySharesAnalysis.summaryMetrics.totalNonCompanyShares,
        totalTranchesTracked: db.nonCompanySharesAnalysis.summaryMetrics.totalTranchesTracked,
        filteredTranchesCount: filteredNonCompanyTranches.length,
      },
      summaryMetrics: db.nonCompanySharesAnalysis.summaryMetrics,
      tranches: filteredNonCompanyTranches,
      rootOpinionAutopsy: db.nonCompanySharesAnalysis.rootOpinionAutopsy,
      cherylHintzenLawsuitAutopsy: db.nonCompanySharesAnalysis.cherylHintzenLawsuitAutopsy,
      statutoryVulnerabilities: db.nonCompanySharesAnalysis.statutoryVulnerabilities,
      litigationPlaybook: db.nonCompanySharesAnalysis.litigationPlaybook,
    });
  }

  return NextResponse.json({
    meta: {
      ...db.meta,
      filteredTransactionsCount: filteredTxs.length,
      filteredFilesCount: filteredFiles.length,
      totalNonCompanyShares: db.nonCompanySharesAnalysis?.summaryMetrics?.totalNonCompanyShares || 0,
    },
    evidentiaryPhases: db.evidentiaryPhases,
    entities: db.entities,
    fraudPatterns: db.fraudPatterns,
    transactions: filteredTxs,
    certificates: db.certificates,
    sourceFilesCatalog: filteredFiles,
    certificateLineage: db.certificateLineage,
    nonCompanySharesAnalysis: {
      ...db.nonCompanySharesAnalysis,
      tranches: filteredNonCompanyTranches,
    },
  });
}
