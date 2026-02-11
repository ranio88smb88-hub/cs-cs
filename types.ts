
export type ModuleType = 'dashboard' | 'tugas' | 'report' | 'login' | 'rekening' | 'dana' | 'serah-terima' | 'gallery';

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

export interface DailyReport {
  id: string;
  content: string;
  timestamp: string;
}

export interface WorkLogin {
  id: string;
  platform: string;
  username: string;
  password?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  timestamp: string;
}

export interface AccountFollowUp {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  issue: string;
  status: 'Follow Up ADM' | 'Cabut dari Kas 1' | 'Follow Up ke Bulan Depan' | 'Lainnya';
  timestamp: string;
}

export interface FundLog {
  id: string;
  amount: number;
  description: string;
  timestamp: string;
}

export interface GalleryItem {
  id: string;
  imageData: string;
  caption: string;
  timestamp: string;
}

export interface SheetRow {
  id: string;
  customerName: string;
  email: string;
  status: 'Lead' | 'Contacted' | 'Closed' | 'Lost';
  value: number;
  date: string;
}

export interface AIInsight {
  summary: string;
  suggestions: string[];
  trend: 'positive' | 'negative' | 'neutral';
}
