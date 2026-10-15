import { NextResponse } from "next/server";
import db from "@/data/grnh_forensic_database.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase();
  const phase = searchParams.get("phase");
  const cert = searchParams.get("cert");
  const category = searchParams.get("category");

  let filteredTxs = db.transactions;
  let filteredFiles = db.sourceFilesCatalog;

  if (phase && phase !== "all") {
    filteredTxs = filteredTxs.filter((tx) => tx.phase === phase);
  }

  if (cert && cert !== "all") {
    filteredTxs = filteredTxs.filter((tx) => tx.cert.toLowerCase().includes(cert.toLowerCase()));
    filteredFiles = filteredFiles.filter((f) =>
      f.linkedCertificates.some((c) => c.toLowerCase().includes(cert.toLowerCase())) ||
      f.filename.toLowerCase().includes(cert.toLowerCase())
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
        f.linkedCertificates.some((c) => c.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    meta: {
      ...db.meta,
      filteredTransactionsCount: filteredTxs.length,
      filteredFilesCount: filteredFiles.length,
    },
    evidentiaryPhases: db.evidentiaryPhases,
    entities: db.entities,
    fraudPatterns: db.fraudPatterns,
    transactions: filteredTxs,
    certificates: db.certificates,
    sourceFilesCatalog: filteredFiles,
  });
}
