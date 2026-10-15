import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GRNH Forensics | GreenGro Technologies Stock Anomaly & Securities Fraud Database",
  description: "Comprehensive securities fraud audit desk and evidentiary database tracking 107M+ GRNH shares, 562 hard drive source documents, certificate-to-opinion links, and the progression from legal placement to federal felony indictment.",
  keywords: ["GRNH", "GreenGro Technologies", "Ira Gaines", "James Haas", "Securities Fraud", "Rule 144", "Stock Forensics", "Transfer Agent Anomaly"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
