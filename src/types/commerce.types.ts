export interface CommerceCartItem {
  id: string;
  title: string;
  price: number;
  thumbnail?: string | null;
  teacherName?: string | null;
}

export interface InvoiceData {
  id: string;
  orderNumber: string;
  amount: number;
  date: Date;
  status: "PAID" | "PENDING" | "FAILED";
  studentName: string;
  studentEmail: string;
  courseTitle: string;
}

export interface PayoutSummary {
  availableBalance: number;
  pendingBalance: number;
  payoutHistory: {
    id: string;
    amount: number;
    status: "PAID" | "PENDING" | "FAILED";
    requestedAt: Date;
    processedAt?: Date | null;
  }[];
}
