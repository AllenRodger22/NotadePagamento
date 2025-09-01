export interface Client {
  name: string;
}

export interface Item {
  id: string;
  ref: string;
  description:string;
  value: number;
}

export interface CompanyInfo {
  name: string;
}

export interface SavedReceipt {
  receiptNumber: string;
  serviceType: string;
  client: Client;
  items: Item[];
  total: number;
  companyInfo: CompanyInfo;
  extraValue: number;
  date: string;
  createdAt: number; // Timestamp in milliseconds
}
