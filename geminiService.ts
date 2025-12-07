import { GoogleGenAI } from "@google/genai";
import { AuditRecord } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize client
// Note: We create a new instance per call in the component or strictly here if the key is static.
// For safety in this demo, we check the key before usage.

export const generateAuditAnalysis = async (
  records: AuditRecord[],
  userQuery: string
): Promise<string> => {
  if (!API_KEY) {
    return "Error: API Key is missing. Please configure process.env.API_KEY.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Prepare data context (summarized to save tokens)
  const summary = records.slice(0, 50).map(r => 
    `- ${r.customerName}: $${r.totalBalance} (${r.agingDays} days) [${r.status}]`
  ).join('\n');

  const totalExposure = records.reduce((acc, r) => acc + r.totalBalance, 0);
  const highRisk = records.filter(r => r.agingDays > 90).length;

  const systemPrompt = `
    You are an expert Audit Professor specializing in Receivables and PSAK 71 / IFRS 9.
    
    Context Data Summary:
    Total Exposure: ${totalExposure}
    High Risk Accounts (>90 days): ${highRisk}
    
    Sample Data (First 50 records):
    ${summary}
    
    Instructions:
    1. Answer the user's question based on the provided data context.
    2. Be concise, professional, and authoritative.
    3. If asked about risks, refer to "Expected Credit Loss" (ECL) and PSAK 71.
    4. Speak naturally as if you are talking to a junior auditor.
    5. Do not use markdown formatting like bold or lists extensively, as this will be read out loud via Text-to-Speech. Keep it conversational text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Question: " + userQuery }] }
      ]
    });

    return response.text || "I could not generate an analysis at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error connecting to the Audit AI brain. Please try again.";
  }
};