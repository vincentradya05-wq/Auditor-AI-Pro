// Data Models
export interface AuditRecord {
  id: string;
  customerName: string;
  totalBalance: number;
  agingDays: number;
  status: 'Current' | 'Overdue' | 'Impaired';
  invoiceDate: string;
}

export enum ViewState {
  LANDING = 'LANDING',
  UPLOAD = 'UPLOAD',
  DASHBOARD = 'DASHBOARD',
  ANALYSIS = 'ANALYSIS',
  FINDINGS = 'FINDINGS',
  REPORT = 'REPORT'
}

export interface KpiData {
  totalExposure: number;
  totalCustomers: number;
  nplTotal: number;
  nplRatio: number;
}

export interface AgingBucket {
  name: string;
  value: number;
  color: string;
}

// Web Speech API Type Definitions (Polyfill)
export interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export interface AnalysisMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}