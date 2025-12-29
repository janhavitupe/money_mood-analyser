import { Transaction, AnalysisResult } from "../types";

export const analyzeSpendingPatterns = async (
  transactions: Transaction[]
): Promise<AnalysisResult> => {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactions }),
  });

  if (!response.ok) {
    throw new Error("AI analysis failed");
  }

  return response.json();
};
