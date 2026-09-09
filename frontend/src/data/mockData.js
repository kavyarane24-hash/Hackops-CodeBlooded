// Mock Data for TrustLens AI Informal Lending Assessment
export const mockBorrowerData = {
  id: "BR-89241",
  name: "Ramesh Kumar",
  businessType: "Kirana & General Store",
  location: "Jaipur, Rajasthan",
  phone: "+91 98765 43210",
  experienceYears: 6,
  requestedAmount: 150000, // ₹1,50,000
  tenureMonths: 12,
  loanPurpose: "Inventory Expansion for Festive Season",

  // Trust & Risk Metrics
  trustScore: 785, // Scale 300 - 900
  maxTrustScore: 900,
  riskLevel: "Low Risk", // Low Risk | Medium Risk | High Risk
  riskScorePercent: 18, // 18% default probability
  recommendedMaxLoan: 180000,
  suggestedInterestRate: 14.5, // 14.5% annual informal micro-lending rate

  // Recharts Monthly Cashflow & Repayment Data
  monthlyCashflow: [
    { month: "Oct", inflow: 112000, outflow: 78000, netSavings: 34000 },
    { month: "Nov", inflow: 145000, outflow: 95000, netSavings: 50000 },
    { month: "Dec", inflow: 168000, outflow: 110000, netSavings: 58000 },
    { month: "Jan", inflow: 130000, outflow: 88000, netSavings: 42000 },
    { month: "Feb", inflow: 125000, outflow: 84000, netSavings: 41000 },
    { month: "Mar", inflow: 152000, outflow: 98000, netSavings: 54000 }
  ],

  // Recharts Trust Dimension Breakdown
  trustDimensions: [
    { subject: "Transaction Consistency", score: 88, fullMark: 100 },
    { subject: "Supplier Repayment", score: 92, fullMark: 100 },
    { subject: "Community Trust", score: 75, fullMark: 100 },
    { subject: "Utility Bill Compliance", score: 95, fullMark: 100 },
    { subject: "Revenue Growth", score: 80, fullMark: 100 }
  ],

  // Factors Impacting Score (Positive and Negative)
  factors: [
    {
      id: "f1",
      title: "Consistent Daily UPI Transactions",
      impact: "positive",
      points: "+45 pts",
      description: "Over 450 QR code transactions recorded monthly with average ticket size of ₹280.",
      category: "Cashflow Integrity"
    },
    {
      id: "f2",
      title: "Punctual Electricity & Shop Rent Payments",
      impact: "positive",
      points: "+30 pts",
      description: "Zero defaults or late payments on utility bills across 12 consecutive months.",
      category: "Utility Compliance"
    },
    {
      id: "f3",
      title: "Verified Wholesale Supplier Vouching",
      impact: "positive",
      points: "+25 pts",
      description: "Primary distributor confirmed 3+ years of timely trade credit settlements.",
      category: "Trade Credit"
    },
    {
      id: "f4",
      title: "Seasonal Dip in Festive Post-Period Sales",
      impact: "negative",
      points: "-15 pts",
      description: "January revenue drops by ~22% compared to December peak demand.",
      category: "Volatility Risk"
    },
    {
      id: "f5",
      title: "Unorganized Udhar (Credit) Ledger Size",
      impact: "negative",
      points: "-10 pts",
      description: "~₹42,000 credit extended to local customers with informal tracking.",
      category: "Accounts Receivable"
    }
  ],

  // Verified Evidence Items
  evidence: [
    {
      id: "e1",
      name: "PhonePe Business UPI Ledger (6 Months)",
      type: "Bank / Digital Ledger",
      status: "Verified",
      confidence: 96,
      date: "08 Sep 2026",
      details: "Parsed 2,840 valid transaction records. Zero suspicious circular transfers."
    },
    {
      id: "e2",
      name: "Bahi-Khata Physical Register OCR",
      type: "Informal Accounting",
      status: "Verified",
      confidence: 89,
      date: "08 Sep 2026",
      details: "Extracted customer receivables and cash sales with 89% handwriting match."
    },
    {
      id: "e3",
      name: "Electricity Bill (Jaipur Discom)",
      type: "Utility Proof",
      status: "Verified",
      confidence: 99,
      date: "05 Sep 2026",
      details: "Matches business premises address. Prompt payment history verified."
    },
    {
      id: "e4",
      name: "Distributor Trade Invoice Records",
      type: "Supplier Vouching",
      status: "Pending Verification",
      confidence: 72,
      date: "07 Sep 2026",
      details: "Cross-referencing 3 wholesaler receipts with regional distributor database."
    }
  ]
};
